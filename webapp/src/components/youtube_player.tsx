import React from 'react';
import {connect} from 'react-redux';
import {useDrag, DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import {State, YoutubePlayerData} from 'src/reducers';
import {bindActionCreators} from 'redux';
import FormButton from './form_button';
import {getMimeFromExtension, copyTextToClipboard, getTimestampFromSeconds, getSecondsFromTimestamp} from '../util/util';
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
        show: Boolean(p.youtubePlayer),
        data: p.youtubePlayer,
        theme: getTheme(state),
    }),
    dispatch: (dispatch) => bindActionCreators({
        close: () => ({type: 'CLOSE_YOUTUBE_PLAYER'}),
        playAndShowComments,
    }, dispatch),
}

const YoutubePlayer = connect(config.state, config.dispatch)(YoutubePlayerImpl);
export default YoutubePlayer;

export type IYoutubePlayer = React.FunctionComponent<Props<YoutubePlayerData>>


enum PlayPauseState {
    PLAYING = 1,
    PAUSED = 2,
}

type OnPlayerStateChangePayload = {
    target: HTMLElement;
    data: PlayPauseState;
}

interface Player {
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    playVideo(): void;
}

type GetPlayerAndInfo = {func: () => {player: Player, data: YoutubePlayerData}};

export function YoutubePlayerImpl(props: Props<YoutubePlayerData>) {
    const [getPlayerAndInfo, setGetPlayer] = React.useState<GetPlayerAndInfo | null>(null);

    const onPlayerStateChangeCreator = (getPlayer: () => Player, videoID: string) => (e: OnPlayerStateChangePayload) => {
        if (e.data === PlayPauseState.PLAYING) {
            console.log('were playing')
        } else if (e.data === PlayPauseState.PAUSED) {
            console.log('were paused')
        }
    }

    React.useEffect(() => {
        if (!props.data) {
            console.log('NO PROPS DATA!');
            return;
        }

        if (!getPlayerAndInfo) {
            console.log('NO GETPLAYERANDINFO');
            return;
        }

        if (!getPlayerAndInfo.func) {
            console.log('NO GETPLAYERANDINFO FUNC');
            return;
        }

        const info = getPlayerAndInfo.func();
        if (!info || !info.data) {
            console.log('No INFO!!');
            return;
        }

        if (!info.player) {
            console.log('NO PLAYER!');
            return;
        }

        console.log(info.player);

        if (props.data.postID !== info.data.postID) {
            console.log('POST IDS TO NOT MATCH');
            return;
        }

        const seconds = getSecondsFromTimestamp(props.data.seekTo);
        if (!seconds) {
            console.log('wont seek because seekto is 0');
            return;
        }

        console.log('here goes nothin');
        if (!info.player || !info.player.seekTo) {
            console.log(info.player);
            console.log('NO PLAYER TO SEEK WITH!!');
            return;
        }

        console.log('LINK SEEKTO')
        info.player.seekTo(seconds, true);
        console.log('I wonder what happened');
    }, [props.data]);

    React.useEffect(() => {
        (async () => {
            if (!props.data || !props.data.videoID) {
                console.log('No props or no video id. setting getplayer callback to null');
                setGetPlayer(null);
                return;
            }

            if (getPlayerAndInfo) {
                const info = getPlayerAndInfo.func();
            }

            const YT = (window as any).YT;
            if (!YT) {
                console.log('WHY YOU DO THIS TO ME???');
                return;
            }

            let lookForThumbnail = !getPlayerAndInfo;
            if (getPlayerAndInfo) {
                const info = getPlayerAndInfo.func();
                if (info.data.postID !== props.data.postID) {
                    lookForThumbnail = true;
                }
            }

            // check if video-thumbnail__container is there first
            if (lookForThumbnail) {
                await new Promise(r => setTimeout(r, 500));
                const thumbnailSelector = '#rhsContainer .video-thumbnail__container';
                const thumbnailElement = document.querySelector(thumbnailSelector);
                if (thumbnailElement) {
                    console.log('FOUND THUMBNAIL')
                    thumbnailElement.click();
                    await new Promise(r => setTimeout(r, 500));
                } else {
                    console.log('DIDNT FIND THUMBNAIL');
                }
            }

            const newID = `rhsContainer-${props.data.videoID}`;
            const originalSelector = `#rhsContainer #${props.data.videoID}`;
            let el = document.querySelector(originalSelector);
            if (!el) {
                el = document.getElementById(newID);
                if (el) {
                    console.log('handler is already attached');
                    return;
                }
            }
            if (!el) {
                console.log('couldnt find player');
                setGetPlayer(null);
                return;
            }
            el.id = newID;

            let player: Player;
            const getPlayer = {func: () => ({player, data: props.data})};
            setGetPlayer(getPlayer);
            player = new YT.Player(newID, {
                events: {
                    'onReady': async () => {
                        setGetPlayer(getPlayer);
                        console.log('WERE READY TO ROCK');

                        const seconds = getSecondsFromTimestamp(props.data.seekTo);
                        if (!seconds) {
                            console.log('onReady wont seek because seekto is 0');
                            return;
                        }

                        console.log('ONREADY SEEKTO')
                        player.seekTo(seconds, true);
                    },
                }
            });
        })();
    }, [props.data]);

    // NEED A CLEANUP METHOD FOR WHEN THE PLUGIN REDEPLOYS
    // it was showing "didn't find thumbnail" twice after reload, whenever I clicked the timestamp

    return (
        <div />
    );
}

const getThumbnailElement = () => {

}

const getOriginalIFrame = () => {

}

const getNewIFrame = () => {

}
