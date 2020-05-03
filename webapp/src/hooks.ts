/**
    * Register a hook to intercept file uploads before they take place.
    * Accepts a function to run before files get uploaded. Receives an array of
    * files and a function to upload files at a later time as arguments. Must
    * return an object that can contain two properties:
    * - message - An error message to display, leave blank or null to display no message
    * - files - Modified array of files to upload, set to null to reject all files
    * Returns a unique identifier.
*/
// registerFilesWillUploadHook(hook)
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Store, FileHookResponse} from "./util/plugin_registry";
import {Post} from "mattermost-redux/types/posts";
import {getPost} from "mattermost-redux/selectors/entities/posts";

export default class Hooks implements IHooks {
    constructor(private store: Store) {}

    filesWillUploadHook = (files: File[], upload: (files: File[]) => void): Promise<FileHookResponse> => {
        this.store.dispatch({
            type: 'OPEN_TRIM_MODAL',
            data: {
                files,
                upload,
            },
        })

        // setTimeout(() => upload(files), 1000);
        return {
            message: '',
            files: [],
        };
    }

    /**
        * Register a hook that will be called before a message is formatted into Markdown.
        * Accepts a function that receives the unmodified post and the message (potentially
        * already modified by other hooks) as arguments. This function must return a string
        * message that will be formatted.
        * Returns a unique identifier.
    */
    messageWillFormatHook = (post: Post, message: string): string => {
        const timestamps = message.split(' ').map(word => word.match(/([0-9]*):([0-9]*)/)).filter(Boolean).map(t => t[0]);
        if (!timestamps) {
            return message;
        }

        let filePost = post;
        if (post.root_id) {
            filePost = getPost(this.store.getState(), post.root_id);
        }

        if (!filePost.file_ids) {
            return message;
        }

        return timestamps.reduce((accum: string, timestamp: string): string => {
            const link = `[${timestamp}](mattermusic://postID=${post.id}&seekTo=${timestamp})`;
            return accum.replace(timestamp, link);
        }, message);
    }
}
