import React from 'react';

// import  from 'mattermost-redux/actions/search';

// import RhsThread from 'mattermost-webapp/components/rhs_thread';
// import {selectPost} from 'mattermost-webapp/actions/views/rhs';

import {getPost} from 'mattermost-redux/selectors/entities/posts';

import {Registry, Store} from './util/plugin_registry';
import Hooks from './hooks';
import reducers from './reducers';
import TrimModal from './components/trim_modal';
import SeekToTimestampPostMenuAction from './components/post_menu/seek_to_timestamp';
import SeekTimestampModal from './components/post_menu/seek_timestamp_modal';
import GlobalPlayer from './components/global_player';
import {parseQueryString} from './util/util';
import FileViewOverride, {shouldDisplayFileOverride} from './components/file_view_override';
import {playAndShowComments} from './actions';

export default class Plugin {
    private registry: Registry;
    private store: Store;

    private activeHooks: string[] = [];

    initialize(registry: Registry, store: Store) {
        this.registry = registry;
        this.store = store;
        registry.registerReducer(reducers);

        const hooks = new Hooks(store);
        // registry.registerFilesWillUploadHook(hooks.filesWillUploadHook);
        registry.registerMessageWillFormatHook(hooks.messageWillFormatHook)

        registry.registerPostDropdownMenuComponent(SeekToTimestampPostMenuAction);

        registry.registerRootComponent(SeekTimestampModal);
        registry.registerRootComponent(GlobalPlayer);
        registry.registerRootComponent(TrimModal);

        registry.registerFilePreviewComponent(shouldDisplayFileOverride, FileViewOverride);

        window.addEventListener('click', this.anchorClickHandler);
    }

    uninitialize() {
        window.removeEventListener('click', this.anchorClickHandler);
    }

    anchorClickHandler = (e) => {
        const href = e.target.href;
        if (!href) {
            return;
        }

        const prefix = 'mattermusic://'
        if (!href.startsWith(prefix)) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();

        const query = href.substring(prefix.length);
        const {postID, seekTo} = parseQueryString(query)

        this.store.dispatch(playAndShowComments(postID, seekTo));
    }
}
