import {combineReducers} from 'redux';
import {GlobalState} from 'mattermost-redux/types/store';

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
    fileID: string;
    seekTo: string;
} | null

function globalPlayer(state: GlobalPlayerData = null, action: {type: string; data?: GlobalPlayerData}) {
    switch(action.type) {
        case 'SEEK_GLOBAL_PLAYER':
            return action.data;
        case 'CLOSE_GLOBAL_PLAYER':
            return null;
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
    seekTimestampModal: SeekTimestampModalData;
};

export type State = GlobalState & {
    'plugins-music-sniper': PluginState;
}

export default combineReducers({
    trimModal,
    globalPlayer,
    seekTimestampModal,
})
