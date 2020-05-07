import React from 'react';
import {connect} from 'react-redux';
import {useDrag, DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import {State, GlobalPlayerData} from 'src/reducers';
import {bindActionCreators} from 'redux';
import FormButton from './form_button';
import {getMimeFromExtension, copyTextToClipboard, getTimestampFromSeconds} from '../util/util';
import {playAndShowComments} from '../actions';
import {Theme} from 'mattermost-redux/types/preferences';

type StateProps<T> = {
    show: boolean;
    data: T;
    theme: Theme;
};

type DispatchProps = {
    close: () => void;
};

type Props<T> = StateProps<T> & DispatchProps

type Action = {
    type: string;
    data?: {};
}

export type ConnectConfig<T> = {
    state(state: State): StateProps<T>;
    dispatch(dispatch: (action: Action) => any): any;
}
export const config = {
    state: ({'plugins-mattermusic': p, ...state}: State) => ({
        show: Boolean(p.globalPlayer),
        data: p.globalPlayer,
        theme: getTheme(state),
    }),
    dispatch: (dispatch) => bindActionCreators({
        close: () => ({type: 'CLOSE_GLOBAL_PLAYER'}),
        playAndShowComments,
    }, dispatch),
}

const WithDND = (props: any) => {
    return (
        <DndProvider backend={Backend}>
            <GlobalPlayerImpl {...props}/>
        </DndProvider>
    )
}

const GlobalPlayer = connect(config.state, config.dispatch)(WithDND);
export default GlobalPlayer;

export type IGlobalPlayer = React.FunctionComponent<Props<GlobalPlayerData>>

enum MobilePlacement {
    TOP,
    BOTTOM,
}

const getDefaultPlacement = (mime: Mimes, videoSize?:VideoPlayerSize): any => {
    if (mime.includes(Mimes.AUDIO)) {
        return audioDefaultPlacement;
    } else {
        if (isVideoSizeSmall(videoSize as VideoPlayerSize)) {
            return videoDefaultPlacement;
        }
        return videoDefaultBigPlacement;
    }
}

const audioDefaultPlacement = {
    top: '65px',
    right: '90px',
}

const videoDefaultPlacement = {
    top: '119px',
    right: '0px',
}

const videoDefaultBigPlacement = {
    bottom: '0px',
    right: '0px',
}

enum Mimes {
    AUDIO = 'audio',
    VIDEO = 'video',
}

enum VideoPlayerSize {
    SMALL = 'small',
    BIG = 'big',
}
const isVideoSizeSmall = (videoSize: VideoPlayerSize) => videoSize === VideoPlayerSize.SMALL;

export function GlobalPlayerImpl(props: Props<GlobalPlayerData>) {
    const playerRef = React.createRef<HTMLAudioElement>();
    const [fileURL, setFileURL] = React.useState('');

    const [placement, setPlacement] = React.useState(audioDefaultPlacement);
    const [lastMime, setLastMime] = React.useState(Mimes.AUDIO);
    const [mobilePlacement, setMobilePlacement] = React.useState(MobilePlacement.TOP);
    const [shouldDrag, setShouldDrag] = React.useState(false);
    const [visible, setVisible] = React.useState(true);
    const [videoSize, setVideoSize] = React.useState(VideoPlayerSize.SMALL);

    const [{ opacity }, dragRef] = useDrag({
        item: { type: 'CARD', text: 'Hey' },
        collect: monitor => ({
          opacity: monitor.isDragging() ? 0.5 : 1,
        }),
        end: (item, monitor) => {
            const offset = monitor.getClientOffset()

            setPlacement({
                top: `${offset.y - 100}px`,
                left: `${offset.x - 300}px`,
            });
        },
      })
    //   return (
    //     <div ref={dragRef} style={{ opacity }}>
    //       {'Im the text'}
    //     </div>
    //   )

    React.useEffect(() => {
        let newFileURL = '';
        if (props.data && props.data.fileInfo.id) {
            newFileURL = `/api/v4/files/${props.data.fileInfo.id}`;
            setFileURL(newFileURL);
            const p = getDefaultPlacement(props.data.fileInfo.mime_type as Mimes, videoSize);
            setPlacement(p);
        }
    }, [props.data && props.data.fileInfo.id]);

    React.useEffect(() => {
        setVisible(true);
        if (playerRef && playerRef.current) {
            const current = playerRef.current as HTMLAudioElement | HTMLVideoElement;

            if (props.data.seekTo) {
                const [minute, second] = props.data.seekTo.split(':')
                const time = parseInt(minute) * 60 + parseInt(second);
                current.currentTime = time;
                current.onloadeddata = (e) => {
                    if (playerRef.current) {
                        playerRef.current.currentTime = time;
                    }
                };
            }
        }

    }, [props.data]);

    if (!props.show) {
        return false;
    }

    if (!props.data) {
        return false;
    }

    let closeButtonStyle = {
        position: 'absolute',
    };

    const mime = props.data.fileInfo.mime_type;

    const isMobile = window.innerWidth <= 768;
    let style;
    // break this out into two components. mobile and web
    if (isMobile) {
        style = {
            width: '100%',
            zIndex: 90000000,
            position: 'absolute',
        };
        if (mobilePlacement === MobilePlacement.TOP) {
            style = {
                ...style,
                top: '50px',
                right: '0px',
            }
        } else {
            style = {
                ...style,
                bottom: '50px',
                right: '0px',
            }
        }

        closeButtonStyle = {
            ...closeButtonStyle,
            top: '0px',
            right: '10px',
        };
    } else {
        let width = '650px'
        if (mime.includes(Mimes.VIDEO)) {
            width = isVideoSizeSmall(videoSize) ? '400px' : '700px';
        }
        style = {
            width,
            zIndex: 90000000,
            position: 'absolute',
            ...placement,
        };
        closeButtonStyle = {
            ...closeButtonStyle,
            top: '-20px',
            left: '30px',
        };
    }

    const clickedClose = (e) => {
        e.stopPropagation();
        e.preventDefault();
        props.close();
    };

    const clickedSwitchMobilePlacement = (e) => {
        e.stopPropagation();
        e.preventDefault();
        switch (mobilePlacement) {
            case MobilePlacement.TOP:
                return setMobilePlacement(MobilePlacement.BOTTOM);
            case MobilePlacement.BOTTOM:
                return setMobilePlacement(MobilePlacement.TOP);
        }
    };

    let content = <h1>{`Unsupported mime type ${mime}`}</h1>;

    const audioStyle = getStyle(props.theme);
    if (mime.includes('audio')) {
        content = (
            <audio
                key={fileURL}
                style={{
                    width: '100%',
                    ...audioStyle,
                }}
                id={'global-player'}
                controls={true}
                // autoPlay={true}
                ref={playerRef}
                >
                <source
                    src={fileURL}
                    type={mime}
                />
            </audio>
        );
    } else if (mime.includes('video')) {
        content = (
            <video
                key={fileURL}
                style={{width: '100%'}}
                id={'global-player'}
                controls={true}
                // autoPlay={true}
                ref={playerRef}
            >
                <source
                    src={fileURL}
                    type={mime}
                />
            </video>
        );
    }

    const extraButtons = [];
    if (!isMobile && visible) {
        extraButtons.push(
            <div
                key={'drag'}
                style={{
                    ...closeButtonStyle,
                    top: '-20px',
                    left: '80px',
                }}
            >
                <a
                    onClick={() => setShouldDrag(!shouldDrag)}
                >
                    {shouldDrag ? 'UnDrag' : 'Drag'}
                </a>
            </div>
        );

        const changeVideoSize = () => {
            const newVideoSize = isVideoSizeSmall(videoSize) ? VideoPlayerSize.BIG : VideoPlayerSize.SMALL;
            setVideoSize(newVideoSize);
            setPlacement(getDefaultPlacement(Mimes.VIDEO, newVideoSize));
        };
        if (mime.includes(Mimes.VIDEO)) {
            extraButtons.push(
                <div
                    key={'size'}
                    style={{
                        ...closeButtonStyle,
                        top: '-20px',
                        left: '300px',
                    }}
                >
                    <a
                        onClick={changeVideoSize}
                    >
                        {isVideoSizeSmall(videoSize) ? 'Big' : 'Small'}
                    </a>
                </div>
            );}
    } else if (isMobile && visible) {
        extraButtons.push(
            <div
                key={'mobile-switch-placement'}
                style={{
                    ...closeButtonStyle,
                    top: '0px',
                    right: '60px',
                }}
            >
                <a
                    onClick={clickedSwitchMobilePlacement}
                >
                    {'Move'}
                </a>
            </div>
        );
    }

    const clickedTimestampGen = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!(playerRef && playerRef.current)) {
            return;
        }

        let currentTime = playerRef.current.currentTime;
        if (!playerRef.current.paused) {
            currentTime = Math.max(0, currentTime - 2);
        }

        const timeStr = ` ${getTimestampFromSeconds(currentTime)} `;
        copyTextToClipboard(timeStr);
    }

    let timeStampButtonStyle;
    if (isMobile) {
        timeStampButtonStyle = {top: '0px', right: '180px'};
    } else {
        timeStampButtonStyle = {top: '-20px', left: '210px'};
    }

    extraButtons.push(
        <div
            key={'timestamps-link'}
            style={{
                ...closeButtonStyle,
                ...timeStampButtonStyle,
            }}
        >
            <a
                onClick={clickedTimestampGen}
            >
                {'Timestamp'}
            </a>
        </div>
    )

    const clickedCommentsButton = () => {
        props.playAndShowComments(props.data.postID);
    }

    let commentButtonStyle;
    if (isMobile) {
        commentButtonStyle = {top: '0px', right: '110px'};
    } else {
        commentButtonStyle = {top: '-20px', left: '130px'};
    }
    extraButtons.push(
        <div
            key={'comments-link'}
            style={{
                ...closeButtonStyle,
                ...commentButtonStyle,
            }}
        >
            <a
                onClick={clickedCommentsButton}
            >
                {'Comments'}
            </a>
        </div>
    )

    // let closeButton;
    // if (visible) {

    // }

    return (
        <div style={style} ref={shouldDrag ? dragRef : null}>
            <div style={{
                display: visible ? undefined : 'none'
            }}>
                {content}
            </div>
            {/* <div style={closeButtonStyle}>
                <a
                    onClick={clickedClose}
                >
                    {'Close'}
                </a>
            </div> */}
            <div style={closeButtonStyle}>
                <a
                    onClick={() => setVisible(!visible)}
                >
                    {visible ? 'Hide' : 'Show'}
                </a>
            </div>
            {extraButtons}
        </div>
    )
}

const getStyle = (theme: Theme) => ({
    audioPlayer: {
        backgroundColor: theme.centerChannelBg,
        display: 'block',
    },
})
