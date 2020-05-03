import React from 'react';

import {State, GlobalPlayerData} from 'src/reducers';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import FormButton from './form_button';

type StateProps<T> = {
    show: boolean;
    data: T;
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
    state: ({'plugins-music-sniper': {globalPlayer}}: State) => ({
        show: Boolean(globalPlayer),
        data: globalPlayer,
    }),
    dispatch: (dispatch) => bindActionCreators({
        close: () => ({type: 'CLOSE_GLOBAL_PLAYER'}),
    }, dispatch),
}

const GlobalPlayer = connect(config.state, config.dispatch)(GlobalPlayerImpl);
export default GlobalPlayer;

export type IGlobalPlayer = React.FunctionComponent<Props<GlobalPlayerData>>

export function GlobalPlayerImpl(props: Props<GlobalPlayerData>) {
    const audioRef = React.createRef<HTMLAudioElement>();
    const [fileURL, setFileURL] = React.useState('');

    React.useEffect(() => {
        let newFileURL = '';
        if (props.data && props.data.fileID) {
            newFileURL = `/api/v4/files/${props.data.fileID}`;
            setFileURL(newFileURL);
        }

        if (audioRef && audioRef.current) {
            audioRef.current.src = newFileURL;
        }
    }, [props.data && props.data.fileID]);

    React.useEffect(() => {
        if (audioRef && audioRef.current) {
            let time = 0;

            if (props.data.seekTo) {
                const [minute, second] = props.data.seekTo.split(':')
                time = parseInt(minute) * 60 + parseInt(second);
            }
            audioRef.current.currentTime = time;
        }
    }, [props.data]);

    if (!props.show) {
        return false;
    }

    if (!props.data) {
        return false;
    }

    const isMobile = window.innerWidth <= 768;
    let style;
    if (isMobile) {
        style = {
            width: '100%',
            zIndex: 90000000,
            position: 'absolute',
            top: '50px',
            right: '0px',
        };
    } else {
        style = {
            width: '40%',
            zIndex: 90000000,
            position: 'absolute',
            top: '65px',
            right: '25%',
            minWidth: '350px',
        }
    }

    const clickedClose = (e) => {
        e.stopPropagation();
        e.preventDefault();
        props.close();
    };

    return (
        <div style={style}>
            <div>
                <audio
                    style={{width: '100%'}}
                    id={'global-player'}
                    controls={true}
                    // autoPlay={true}
                    ref={audioRef}
                    >
                    <source
                        src={fileURL}
                        // type={`audio/${props.data.name.split('.').pop()}`}
                        />
                </audio>
            </div>
            <div style={{position: 'absolute', top: '0px', right: '70px'}}>
                <a
                    onClick={clickedClose}
                >
                    <i className={'fa fa-cross'}/>
                </a>
            </div>
        </div>
    )
}
