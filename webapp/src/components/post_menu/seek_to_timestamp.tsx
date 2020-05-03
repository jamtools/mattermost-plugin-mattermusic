import React from 'react';

import {State, GlobalPlayerData} from 'src/reducers';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getPost} from 'mattermost-redux/selectors/entities/posts';
import {Post} from 'mattermost-redux/types/posts';
import {selectPost} from '../../actions';

type StateProps = {
    post: Post;
    fileID: string;
};

type DispatchProps = {
    showSeekTimestamps: (fileID: string, timestamps: string[]) => void;
    openRHS: (post: Post) => void;
};

type Props = StateProps & DispatchProps

type Action = {
    type: string;
    data?: {};
}

export type ConnectConfig<T> = {
    state(state: State): StateProps;
    dispatch(dispatch: (action: Action) => any): any;
}
export const config = {
    state: (state: State, ownProps: {postId: string}) => {
        const post = getPost(state, ownProps.postId);
        let fileID;
        if (post.file_ids && post.file_ids) {
            fileID = post.file_ids[0];
        } else if (post.root_id) {
            const rootPost = getPost(state, post.root_id);
            if (rootPost.file_ids) {
                fileID = rootPost.file_ids[0];
            }
        }

        return {
            post,
            fileID,
        };
    },
    dispatch: (dispatch) => bindActionCreators({
        showSeekTimestamps: (fileID: string, timestamps: string[]) => ({
            type: 'SHOW_SEEK_TIMESTAMPS_MODAL',
            data: {
                fileID,
                timestamps,
            },
        }),
        openRHS: selectPost,
    }, dispatch),
}

const SeekToTimestampPostMenuAction = connect(config.state, config.dispatch)(SeekToTimestampPostMenuActionImpl);
export default SeekToTimestampPostMenuAction;

export function SeekToTimestampPostMenuActionImpl(props: Props) {
    const timestamps = props.post.message.split(' ').map(word => word.match(/([0-9]*):([0-9]*)/)).filter(Boolean).map(t => t[0]);

    const onClick = () => {
        props.showSeekTimestamps(props.fileID, timestamps);
        // props.openRHS(props.post);
    }

    const content = (
        <button
            className='style--none'
            role='menuitem'

            onClick={onClick}
        >
            {'Seek'}
        </button>
    );

    return (
        <li
            className='MenuItem'
            role='menuitem'
        >
            {content}
        </li>
    );
}

// Clicking on a post that has audio timestamps will show a post action called "seek".
// clicking on this will open a popover (may need to be modal because of mobile)
// where you can select which timestamp to seek to
// then global player seeks to that spot
// keep horizontal view in mind too
