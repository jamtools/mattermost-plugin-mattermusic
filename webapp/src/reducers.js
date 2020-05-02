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

export type State = GlobalState & {
    'plugins-music-sniper': {
        trimModal: TrimModalData,
    }
}

export default combineReducers({
    trimModal,
})
