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
import {postHasMedia} from "./selectors";

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
        const timestamps = parseTimestamps(message);

        let cloudFrontLink = getCloudFrontLink(message);

        if (!timestamps.length && !cloudFrontLink.length) {
            return message;
        }

        const state = this.store.getState();
        let mediaPost = post;
        if (post.root_id) {
            mediaPost = getPost(state, post.root_id);
        }

        if (!mediaPost) {
            return message;
        }

        const hasMedia = postHasMedia(state, mediaPost);
        cloudFrontLink = getCloudFrontLink(mediaPost.message);

        if (!hasMedia && !getYoutubeVideoID(mediaPost.message) && !cloudFrontLink.length) {
            return message;
        }

        if (hasMedia) {
            return timestamps.reduce((accum: string, timestamp: string): string => {
                const link = makeMediaTimestampLink(mediaPost, timestamp);
                return accum.replace(timestamp, link);
            }, message);
        }

        if (getYoutubeVideoID(mediaPost.message)) {
            return timestamps.reduce((accum: string, timestamp: string): string => {
                const link = makeYoutubeTimestampLink(mediaPost, timestamp);
                return accum.replace(timestamp, link);
            }, message)
        }

        if (cloudFrontLink.length) {
            message = message.replace(cloudFrontLink, makeCloudFrontTimestampLink(mediaPost, cloudFrontLink, ''));

            return timestamps.reduce((accum: string, timestamp: string): string => {
                const link = makeCloudFrontTimestampLink(mediaPost, cloudFrontLink, timestamp);
                return accum.replace(timestamp, link);
            }, message)
        }

        return message;
    }
}

const makeMediaTimestampLink = (post: Post, timestamp: string): string => {
    // return `[${timestamp}](mattermusic://postID=${post.id}&seekTo=${timestamp})`;
    const condensed = getCondensedTimestamp(timestamp);

    return `[${timestamp}](mattermusic://media?postID=${post.id}&seekTo=${condensed})`;
}

const makeYoutubeTimestampLink = (post: Post, timestamp: string): string => {
    const vid = getYoutubeVideoID(post.message);
    const seconds = getSecondsFromTimestamp(timestamp);
    // return `[${timestamp}](https://youtube.com/watch?v=${vid}?t=${seconds})`;
    return `[${timestamp}](mattermusic://youtube?postID=${post.id}&seekTo=${timestamp}&videoID=${vid})`;
}

export const getYoutubeVideoID = (message: string) => {
    const r = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\? ]*).*/;
    const matched = message.match(r);
    if (!matched) {
        return '';
    }

    return matched[1];
}

const makeCloudFrontTimestampLink = (post: Post, cloudFrontLink: string, timestamp: string): string => {
    let seekTo = '';
    if (timestamp.length) {
        seekTo = getCondensedTimestamp(timestamp);
    }

    let label = timestamp;
    if (!timestamp.length) {
        label = cloudFrontLink;
    }

    return `[${label}](mattermusic://external?postID=${post.id}&url=${cloudFrontLink}&seekTo=${seekTo})`;
}

const getCloudFrontLink = (message: string): string => {
    const urlRegex = /(https:\/\/[a-z0-9]+\.cloudfront\.net[^\s]+)/g;
    const matched = message.match(urlRegex);

    if (!matched || !matched.length) {
        return '';
    }

    return matched[0];
}

const getSecondsFromTimestamp = (timestamp: string): number => {
    const parts = timestamp.split(':');

    if (parts.length === 2) {
        return (parseInt(parts[0]) * 60) + parseInt(parts[1]);
    }

    if (parts.length === 3) {
        return (parseInt(parts[0]) * 60 * 60) + (parseInt(parts[1]) * 60) + parseInt(parts[2]);
    }

    return 0;
}

const getCondensedTimestamp = (timestamp: string): string => {
    const parts = timestamp.split(':');

    if (parts.length === 2) {
        return timestamp;
    }

    if (parts.length === 3) {
        const minutes = (parseInt(parts[0]) * 60) + parseInt(parts[1]);
        return `${minutes}:${parts[2]}`;
    }

    return timestamp;
}

const parseTimestamps = (message: string): string[] => {
    return message.match(/([0-9]+:)?[0-9]+:[0-5][0-9]/g) || [];
}
