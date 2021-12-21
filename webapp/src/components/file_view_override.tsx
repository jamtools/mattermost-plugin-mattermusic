import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {FileInfo} from 'mattermost-redux/types/files';
import {Post} from 'mattermost-redux/types/posts';

import {playAndShowComments} from '../actions';
import {State} from '../reducers';
import {getMimeFromFileInfo} from '../util/file_types';

/**
    * Register a component to override file previews. Accepts a function to run before file is
    * previewed and a react component to be rendered as the file preview.
    * - override - A function to check whether preview needs to be overridden. Receives fileInfo and post as arguments.
    * Returns true is preview should be overridden and false otherwise.
    * - component - A react component to display instead of original preview. Receives fileInfo and post as props.
    * Returns a unique identifier.
    * Only one plugin can override a file preview at a time. If two plugins try to override the same file preview, the first plugin will perform the override and the second will not. Plugin precedence is ordered alphabetically by plugin ID.
    * registerFilePreviewComponent(override, component)
*/

type StateProps = {
    // post: Post;
    // fileID: string;
};

type DispatchProps = {
    // showSeekTimestamps: (fileID: string, timestamps: string[]) => void;
    playAndShowComments: (postID: string, seekTo?: string) => void;
};

// type Props = StateProps & DispatchProps

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
    },
    dispatch: (dispatch) => bindActionCreators({
        playAndShowComments,
    }, dispatch),
}

const FileViewOverride = connect(config.state, config.dispatch)(FileViewOverrideImpl);
export default FileViewOverride;

export const shouldDisplayFileOverride = (fileInfo: FileInfo, post: Post) => {
    if (!fileInfo) {
        return false
    }

    const mime = getMimeFromFileInfo(fileInfo);
    return mime.includes('audio') || mime.includes('video');
}

type Props = {
    fileInfo: FileInfo;
    post: Post;
    onModalDismissed: () => void;
} & DispatchProps;

export function FileViewOverrideImpl(props: Props) {
    React.useEffect(() => {
        if (props.fileInfo) {
            props.onModalDismissed();
            props.playAndShowComments({postID: props.post.id});
        }
    }, [props.fileInfo]);
    return null;
}
