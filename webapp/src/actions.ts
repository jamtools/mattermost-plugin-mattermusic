import {Post} from 'mattermost-redux/types/posts';
import {DispatchFunc, GetStateFunc} from 'mattermost-redux/types/actions';
import {getPost} from 'mattermost-redux/selectors/entities/posts';
import {getCurrentChannelId} from 'mattermost-redux/selectors/entities/channels';
import {makeGetFilesForPost} from 'mattermost-redux/selectors/entities/files';
import {FileInfo} from 'mattermost-redux/types/files';

const ActionTypes = {
    UPDATE_RHS_SEARCH_RESULTS_TERMS: 'UPDATE_RHS_SEARCH_RESULTS_TERMS',
    UPDATE_RHS_SEARCH_TERMS: 'UPDATE_RHS_SEARCH_TERMS',
    UPDATE_RHS_STATE: 'UPDATE_RHS_STATE',

    SELECT_POST: 'SELECT_POST',
    SET_RHS_EXPANDED: 'SET_RHS_EXPANDED',
};

const getFilesForPost = makeGetFilesForPost();

export type PlayAndShowCommentsArguments = {postID: string, seekTo?: string, videoID?: string, url?: string};

export function playAndShowComments({postID, seekTo, videoID, url}: PlayAndShowCommentsArguments) {
    return (dispatch: DispatchFunc, getState: GetStateFunc) => {
        const state = getState();
        if (!postID) {
            alert('no post id');
        }
        const post = getPost(state, postID);
        if (!post) {
            alert('couldnt get post for media');
        }

        dispatch(selectPost(post));
        dispatch(setRhsExpanded(true));

        if (videoID) {
            dispatch({
                type: 'SEEK_YOUTUBE_PLAYER',
                data: {postID, seekTo, videoID},
            });
        } else if (url) {
            dispatch({
                type: 'SEEK_GLOBAL_PLAYER',
                data: {seekTo, postID, url},
            });
        } else {
            const filePostID = post.root_id || post.id;
            const fileInfos: FileInfo[] = getFilesForPost(state, filePostID);

            const fileInfo = fileInfos[0];
            if (fileInfo) {
                dispatch({
                    type: 'SEEK_GLOBAL_PLAYER',
                    data: {fileInfo, seekTo, postID, url},
                });
            }
        }
    };
}

export function selectPost(post: Post) {
    return {
        type: ActionTypes.SELECT_POST,
        postId: post.root_id || post.id,
        channelId: post.channel_id,
        timestamp: Date.now(),
    };
}

export function setRhsExpanded(expanded = true) {
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

const RHSStates = {
    PIN: 'pin',
};

export function updateRhsState(rhsState: string, channelId?: string) {
    return (dispatch: DispatchFunc, getState: GetStateFunc) => {
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
