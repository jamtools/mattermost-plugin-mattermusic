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
import GlobalPlayer from './components/global_player/global_player';
import {parseQueryString} from './util/util';
import FileViewOverride, {shouldDisplayFileOverride} from './components/file_view_override';
import {playAndShowComments} from './actions';
import YoutubePlayer from './components/youtube_player';

export default class Plugin {
    private registry: Registry;
    private store: Store;

    private activeHooks: string[] = [];

    initialize(registry: Registry, store: Store) {
        this.registry = registry;
        this.store = store;

        try {
            registry.registerReducer(reducers);
        } catch (e) {
            if (!e.toString().includes('display_name')) {
                throw e;
            }
        }

        const hooks = new Hooks(store);
        // registry.registerFilesWillUploadHook(hooks.filesWillUploadHook);
        registry.registerMessageWillFormatHook(hooks.messageWillFormatHook)

        // registry.registerPostDropdownMenuComponent(SeekToTimestampPostMenuAction);

        // registry.registerRootComponent(SeekTimestampModal);
        registry.registerRootComponent(GlobalPlayer);
        registry.registerRootComponent(YoutubePlayer);
        // registry.registerRootComponent(TrimModal);

        registry.registerFilePreviewComponent(shouldDisplayFileOverride, FileViewOverride);

        window.addEventListener('click', this.anchorClickHandler);

        this.initYoutube();
    }

    uninitialize() {
        window.removeEventListener('click', this.anchorClickHandler);
    }

    anchorClickHandler = (e) => {
        let href = e.target && e.target.href;
        if (!href) {
            href = e.target.parentElement && e.target.parentElement.href;
            if (!href) {
                return;
            }
        }

        const prefix = 'mattermusic://'
        if (!href.startsWith(prefix)) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const link = href.substring(prefix.length);
        const [name, query] = link.split('?');
        const {postID, seekTo, videoID} = parseQueryString(query);

        if (name === 'media') {
            this.store.dispatch(playAndShowComments(postID, seekTo));
        } else if(name === 'youtube') {
            this.store.dispatch(playAndShowComments(postID, seekTo, videoID));
        }
    }

    initYoutube = () => {
        setTimeout(() => {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                console.log('LOADED YOUTUBE!!!!!');
            }
        }, 1000);
    }
}
