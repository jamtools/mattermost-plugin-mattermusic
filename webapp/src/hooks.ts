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

    // slashCommandWillBePostedHook = (message, contextArgs) => {
    //     let messageTrimmed;
    //     if (message) {
    //         messageTrimmed = message.trim();
    //     }
    // }
}
