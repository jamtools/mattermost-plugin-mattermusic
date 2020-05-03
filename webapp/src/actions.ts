// import {getPostThread} from 'mattermost-redux/actions/posts';
import {GlobalState} from 'mattermost-redux/types/store';
import {Post} from 'mattermost-redux/types/posts';
import {DispatchFunc, GetStateFunc} from 'mattermost-redux/types/actions';
import {Client4} from 'mattermost-redux/client';
import {getPost} from 'mattermost-redux/selectors/entities/posts';

export function getRhsState(state: GlobalState): any {
    return state.views.rhs.rhsState;
}

const ActionTypes = {
    UPDATE_RHS_SEARCH_RESULTS_TERMS: 'UPDATE_RHS_SEARCH_RESULTS_TERMS',
    UPDATE_RHS_SEARCH_TERMS: 'UPDATE_RHS_SEARCH_TERMS',
    UPDATE_RHS_STATE: 'UPDATE_RHS_STATE',

    SELECT_POST: 'SELECT_POST',
    SET_RHS_EXPANDED: 'SET_RHS_EXPANDED',
}

export function playAndShowComments(postID: string, seekTo?: string) {
    return (dispatch: DispatchFunc, getState: GetStateFunc) => {
        const state = getState();

        let fileID;
        const post = getPost(state, postID);
        if(post.root_id) {
            const rootPost = getPost(state, post.root_id);
            if (rootPost.file_ids) {
                fileID = rootPost.file_ids[0];
            }
        }
        else if (post.file_ids) {
            fileID = post.file_ids[0];
        }

        if (fileID) {
            dispatch({
                type: 'SEEK_GLOBAL_PLAYER',
                data: {fileID, seekTo},
            });
        }

        dispatch(selectPost(post));
        dispatch(setRhsExpanded(true))
    }
}

export function selectPost(post: Post) {
    return {
        type: ActionTypes.SELECT_POST,
        postId: post.root_id || post.id,
        channelId: post.channel_id,
        timestamp: Date.now(),
    };
}

export function setRhsExpanded(expanded=true) {
    return {
        type: ActionTypes.SET_RHS_EXPANDED,
        expanded,
    };
}

// export function openRHSSearch() {
//     return (dispatch) => {
//         // dispatch(clearSearch());
//         dispatch(updateSearchTerms(''));
//         dispatch(updateSearchResultsTerms(''));

//         // dispatch(updateRhsState(RHSStates.SEARCH));
//     };
// }

export function updateSearchTerms(terms) {
    return {
        type: ActionTypes.UPDATE_RHS_SEARCH_TERMS,
        terms,
    };
}

function updateSearchResultsTerms(terms) {
    return {
        type: ActionTypes.UPDATE_RHS_SEARCH_RESULTS_TERMS,
        terms,
    };
}

const RHSStates = {
    PIN: 'pin',
}

export function updateRhsState(rhsState: string, channelId?: string) {
    return (dispatch, getState) => {
        const action = {
            type: ActionTypes.UPDATE_RHS_STATE,
            state: rhsState,
        } as any;

        if (rhsState === RHSStates.PIN) {
            action.channelId = channelId || getCurrentChannelId(getState());
        }

        dispatch(action);
    };
}
