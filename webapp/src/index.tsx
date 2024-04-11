import React from 'react';

// import  from 'mattermost-redux/actions/search';

// import RhsThread from 'mattermost-webapp/components/rhs_thread';
// import {selectPost} from 'mattermost-webapp/actions/views/rhs';

// import {getPost} from 'mattermost-redux/selectors/entities/posts';

import {Registry, Store} from './util/plugin_registry';
import Hooks from './hooks';
import reducers from './reducers';

// import TrimModal from './components/trim_modal';
// import SeekToTimestampPostMenuAction from './components/post_menu/seek_to_timestamp';
// import SeekTimestampModal from './components/post_menu/seek_timestamp_modal';
import GlobalPlayer from './components/global_player/global_player';
import {parseQueryString} from './util/util';
import FileViewOverride, {shouldDisplayFileOverride} from './components/file_view_override';
import {playAndShowComments} from './actions';
import YoutubePlayer from './components/youtube_player';

import './styles.css';

// type URLObject = {url: string};
// type Embed = {embed: URLObject};

export default class Plugin {
    private registry!: Registry;
    private store!: Store;

    private activeHooks: string[] = [];

    initialize(registry: Registry, store: Store) {
        this.registry = registry;
        this.store = store;

        try {
            registry.registerReducer(reducers);
        } catch (e) {
            if (!(e as Error).toString().includes('display_name')) {
                throw e;
            }
        }

        const hooks = new Hooks(store);

        // registry.registerFilesWillUploadHook(hooks.filesWillUploadHook);
        registry.registerMessageWillFormatHook(hooks.messageWillFormatHook);

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

    anchorClickHandler = (e: MouseEvent) => {
        const target = e.target as HTMLAnchorElement;
        let href = target && target.href;
        if (!href) {
            href = (target.parentElement as HTMLAnchorElement)?.href || '';
            if (!href) {
                return;
            }
        }

        const prefix = 'mattermusic://';
        if (!href.startsWith(prefix)) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const link = href.substring(prefix.length);
        const [name, query] = link.split('?');

        if (name === 'media') {
            const {postID, seekTo} = parseQueryString(query);
            this.store.dispatch(playAndShowComments({postID, seekTo}));
        } else if (name === 'youtube') {
            const {postID, seekTo, videoID} = parseQueryString(query);
            this.store.dispatch(playAndShowComments({postID, seekTo, videoID}));
        } else if (name === 'external') {
            const {postID, seekTo, url} = parseQueryString(query);
            this.store.dispatch(playAndShowComments({postID, seekTo, url}));
        }
    };

    initYoutube = () => {
        setTimeout(() => {
            const tag = document.createElement('script');
            tag.src = '';

            // tag.src = "https://www.youtube.com/iframe_api";
            tag.src = '/plugins/mattermusic/assets/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            if (!firstScriptTag.parentNode) {
                return;
            }

            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            (window as any).onYouTubeIframeAPIReady = () => {
                console.log('LOADED YOUTUBE!!!!!');
            };
        }, 1000);
    };
}

import {id} from './manifest';

(window as any).registerPlugin(id, new Plugin());
