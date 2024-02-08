import {GlobalState} from 'mattermost-redux/types/store';
import {Post} from 'mattermost-redux/types/posts';
import {makeGetFilesForPost} from 'mattermost-redux/selectors/entities/files';
import {FileInfo} from 'mattermost-redux/types/files';

import {getMimeFromFileInfo} from './util/file_types';

const getFiles = makeGetFilesForPost();
export const postHasMedia = (state: GlobalState, post?: Post): boolean => {
    if (!post) {
        return false;
    }

    if (post.file_ids) {
        const files = getFiles(state, post.id) as FileInfo[];
        const file = files[0];
        if (file) {
            const mime = getMimeFromFileInfo(file);
            if (mime.includes('audio') || mime.includes('video')) {
                return true;
            }
        }
    }

    return false;
};
