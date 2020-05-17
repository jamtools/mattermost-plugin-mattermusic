// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState} from 'react';

import {storiesOf} from '@storybook/react';
import {withKnobs, text} from '@storybook/addon-knobs';

import {WithDND, IGlobalPlayer} from './global_player';

const GlobalPlayer = WithDND as IGlobalPlayer;

storiesOf('GlobalPlayer', module).
    addDecorator(withKnobs).
    add('Blah',
        () => (
            <GlobalPlayer
                theme={{}}
                data={{
                    seekTo: '0:00',
                    postID: 'ijfeijf',
                    fileInfo: {mime_type: 'audio/mp3'},
                }}
                show={true}

            />
        ),
    );
    // add('LoadingSpinner with text',
    //     () => <LoadingSpinner text={text('Text', 'Loading')}/>
    // ).
    // add('loadingWrapper', () => {
    //     const LoadingExample = () => {
    //         const [loading, setLoading] = useState(false);
    //         const loadingFunc = (e) => {
    //             e.preventDefault();
    //             setLoading(true);
    //             setTimeout(() => setLoading(false), 2000);
    //         };
    //         return (
    //             <div>
    //                 <a
    //                     className='btn btn-primary'
    //                     onClick={loadingFunc}
    //                 >
    //                     <LoadingWrapper
    //                         loading={loading}
    //                         text='loading'
    //                     >
    //                         {'Load'}
    //                     </LoadingWrapper>
    //                 </a>
    //             </div>
    //         );
    //     };

    //     return (<LoadingExample/>);
    // });
