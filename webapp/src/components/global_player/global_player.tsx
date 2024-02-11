import React from 'react';
import {connect} from 'react-redux';
import {useDrag, DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import {State, GlobalPlayerData} from 'src/reducers';
import {bindActionCreators} from 'redux';
import {copyTextToClipboard, getTimestampFromSeconds} from '../../util/util';
import {playAndShowComments} from '../../actions';
import {Theme} from 'mattermost-redux/types/preferences';
import {getMimeFromFileInfo, getMimeFromURL, Mimes} from '../../util/file_types';

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

export const WithDND = (props: any) => {
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
    top: '2px',
    right: '195px',
}

const videoDefaultPlacement = {
    top: '119px',
    right: '0px',
}

const videoDefaultBigPlacement = {
    bottom: '0px',
    right: '0px',
}

enum VideoPlayerSize {
    SMALL = 'small',
    BIG = 'big',
}
const isVideoSizeSmall = (videoSize: VideoPlayerSize) => videoSize === VideoPlayerSize.SMALL;

export type GlobalPlayerProps = Props<GlobalPlayerData>;

export function GlobalPlayerImpl(props: GlobalPlayerProps) {
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

    React.useEffect(() => {
        let newFileURL = '';
        if (props.data && props.data.fileInfo && props.data.fileInfo.id) {
            newFileURL = `/api/v4/files/${props.data.fileInfo.id}`;
            setFileURL(newFileURL);
            const p = getDefaultPlacement(getMimeFromFileInfo(props.data.fileInfo) as Mimes, videoSize);
            setPlacement(p);
        } else if (props.data && props.data.url) {
            setFileURL(props.data.url);

            const mime = getMimeFromURL(props.data.url);

            const p = getDefaultPlacement(mime, videoSize);
            setPlacement(p);
        }
    }, [props.data && ((props.data.fileInfo && props.data.fileInfo.id) || (props.data.url))]);

    React.useEffect(() => {
        setVisible(true);

        if (!props.data) {
            return;
        }
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


    let mime = '';
    if (props.data.fileInfo) {
        mime = getMimeFromFileInfo(props.data.fileInfo);
    } else if (props.data.url) {
        mime = getMimeFromURL(props.data.url);
    }

    const isMobile = window.innerWidth <= 768;
    const isVideo = mime.includes(Mimes.VIDEO);
    const isAudio = mime.includes(Mimes.AUDIO);

    let style;
    // break this out into two components. mobile and web
    if (isMobile) {
        style = {
            width: '100%',
            zIndex: 1000,
            position: 'fixed',
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
        const extra = isAudio ? {
            maxWidth: '500px',
            minWidth: '34%',
        } : {
            width: isVideoSizeSmall(videoSize) ? '400px' : '700px',
        };

        style = {
            zIndex: 1000,
            position: 'fixed',
            ...extra,
            ...placement,
        };

        if (isVideo) {
            closeButtonStyle = {
                ...closeButtonStyle,
                top: '-20px',
                left: '30px',
            };
        }
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
    if (mime.includes(Mimes.AUDIO)) {
        content = (
            <audio
                key={fileURL}
                style={{
                    ...audioStyle,
                    width: '100%',
                    height: '37px',
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
    } else if (isVideo) {
        content = (
            <video
                key={fileURL}
                style={{width: '100%', maxHeight: '600px'}}
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
        const changeVideoSize = (e) => {
            e.stopPropagation();
            const newVideoSize = isVideoSizeSmall(videoSize) ? VideoPlayerSize.BIG : VideoPlayerSize.SMALL;
            setVideoSize(newVideoSize);
            setPlacement(getDefaultPlacement(Mimes.VIDEO, newVideoSize));
        };
        if (isVideo) {
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

    // let timeStampButtonStyle;
    // if (isMobile) {
    //     timeStampButtonStyle = {top: '0px', right: '180px'};
    // } else {
    //     timeStampButtonStyle = {top: '-20px', left: '210px'};
    // }

    // extraButtons.push(
    //     <div
    //         key={'timestamps-link'}
    //         style={{
    //             ...closeButtonStyle,
    //             ...timeStampButtonStyle,
    //         }}
    //     >
    //         <a
    //             onClick={clickedTimestampGen}
    //         >
    //             {'Timestamp'}
    //         </a>
    //     </div>
    // )

    const clickedCommentsButton = (e) => {
        e.stopPropagation();
        props.playAndShowComments({postID: props.data.postID});
    }

    let commentButtonStyle;
    if (isMobile) {
        commentButtonStyle = {top: '0px', right: '110px'};
    } else if (isVideo) {
        commentButtonStyle = {top: '-20px', left: '130px'};
    } else {
        commentButtonStyle = {top: '7px', right: '-28px'};
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
                style={{color: 'rgba(255, 255, 255, 0.56)'}}
            >
                {/* {'Comments'} */}
                <i className='fa fa-comment'></i>
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
            {!isMobile && (
                <>
                    {isVideo && (
                        <div style={closeButtonStyle}>
                            <a
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setVisible(!visible)
                                }}
                            >
                                {visible ? 'Hide' : 'Show'}
                            </a>
                        </div>
                    )}
                    {extraButtons}
                </>
            )}
        </div>
    )
}

const getStyle = (theme: Theme) => ({
    audioPlayer: {
        backgroundColor: theme.centerChannelBg,
        display: 'block',
    },
})
