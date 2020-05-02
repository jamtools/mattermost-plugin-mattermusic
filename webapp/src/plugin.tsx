import React from 'react';

// import  from 'mattermost-redux/actions/search';

// import RhsThread from 'mattermost-webapp/components/rhs_thread';
// import {selectPost} from 'mattermost-webapp/actions/views/rhs';

import {getPost} from 'mattermost-redux/selectors/entities/posts';

import {Registry, Store} from './util/plugin_registry';
import Hooks from './hooks';
import reducers from './reducers';
import TrimModal from './components/trim_modal';

export default class Plugin {
    initialize(registry: Registry, store: Store) {
        registry.registerReducer(reducers);

        registry.registerPostDropdownMenuAction('Music', (postID) => {

        });
        const hooks = new Hooks(store);
        registry.registerFilesWillUploadHook(hooks.filesWillUploadHook);

        registry.registerRootComponent(TrimModal);
    }
}
