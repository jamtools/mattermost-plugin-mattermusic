import {combineReducers} from 'redux';
import {GlobalState} from 'mattermost-redux/types/store';
import {FileInfo} from 'mattermost-redux/types/files';

export type TrimModalData = {
    files: File[],
    upload: (files: File[]) => void;
} | null

function trimModal(state: TrimModalData = null, action: {type: string; data?: TrimModalData}) {
    switch(action.type) {
        case 'OPEN_TRIM_MODAL':
            return action.data;
        case 'CLOSE_TRIM_MODAL':
            return null;
        default:
            return state;
    }
}

export type GlobalPlayerData = {
    postID: string;
    fileInfo: FileInfo;
    seekTo: string;
} | null

function globalPlayer(state: GlobalPlayerData = null, action: {type: string; data?: GlobalPlayerData}) {
    switch(action.type) {
        case 'SEEK_GLOBAL_PLAYER':
            return action.data;
        case 'CLOSE_GLOBAL_PLAYER':
        case 'SEEK_YOUTUBE_PLAYER':
            return null;
        default:
            return state;
    }
}

export type YoutubePlayerData = {
    postID: string;
    seekTo: string;
    videoID: string;
} | null

type SelectPostPayload = {type: string; postId: string;}
type YoutubePlayerAction = {type: string; data?: YoutubePlayerData};

function youtubePlayer(state: YoutubePlayerData = null, action: YoutubePlayerAction | SelectPostPayload) {
    switch(action.type) {
        case 'SEEK_YOUTUBE_PLAYER':
            if (state) {
                if (state.postID !== action.data.postID) {
                    return null;
                }
            }
            return action.data;
        case 'CLOSE_YOUTUBE_PLAYER':
        case 'SEEK_GLOBAL_PLAYER':
            return null;
        case 'SELECT_POST':
            if (!action.postId) {
                return null;
            }
            // if (!state){
            //     return null;
            // }

            // if (action.postId !== state.postID) {
            //     return null;
            // }

        default:
            return state;
    }
}

export type SeekTimestampModalData = {
    fileID: string;
    timestamps: string[];
} | null

function seekTimestampModal(state: SeekTimestampModalData = null, action: {type: string; data?: SeekTimestampModalData}) {
    switch(action.type) {
        case 'SHOW_SEEK_TIMESTAMPS_MODAL':
            return action.data;
        case 'CLOSE_SEEK_TIMESTAMPS_MODAL':
            return null;
        default:
            return state;
    }
}

export type PluginState = {
    trimModal: TrimModalData;
    globalPlayer: GlobalPlayerData;
    youtubePlayer: YoutubePlayerData;
    seekTimestampModal: SeekTimestampModalData;
};

export type State = GlobalState & {
    'plugins-mattermusic': PluginState;
}

export default combineReducers({
    trimModal,
    globalPlayer,
    youtubePlayer,
    seekTimestampModal,
})
