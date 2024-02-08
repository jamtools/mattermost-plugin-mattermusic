import React from 'react';
import {bindActionCreators} from 'redux';

import {Theme} from 'mattermost-redux/types/preferences';

import {SeekTimestampModalData, State} from '../../reducers';

type DefaultProps = {theme: Theme}

import FormButton from '../form_button';
import createModal, {ConnectConfig} from '../modal';
import {Project} from 'src/model';

const config: ConnectConfig<SeekTimestampModalData> = {
    state: ({'plugins-mattermusic': {seekTimestampModal}}) => ({
        open: Boolean(seekTimestampModal),
        data: seekTimestampModal,
    }),
    dispatch: (dispatch) => bindActionCreators({
        close: () => ({type: 'CLOSE_SEEK_TIMESTAMPS_MODAL'}),
        seekGlobalPlayer: (fileID: string, seekTo: string) => ({type: 'SEEK_GLOBAL_PLAYER', data: {fileID, seekTo}}),
    }, dispatch),
};

const FancyModal = createModal<SeekTimestampModalData>(config);
export default function SeekTimestampModal(props: DefaultProps) {
    const InnerBody = (props: {data: SeekTimestampModalData; close: () => void, seekGlobalPlayer: (fileID: string, seekTo: string) => void}) => {
        if (!props.data) {
            return 'No data for modal';
        }

        const clickedTimestamp = (timestamp: string) => (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (!props.data) {
                return 'No data for modal';
            }
            props.seekGlobalPlayer(props.data.fileID, timestamp);
        };

        return (
            <div>
                {props.data.timestamps.map((timestamp: string) => (
                    <FormButton
                        btnClass='btn btn-primary'
                        saving={false}
                        onClick={clickedTimestamp(timestamp)}
                    >
                        {timestamp}
                    </FormButton>
                ))}
            </div>
        );
    };

    const body = (props: {data: SeekTimestampModalData}) => {
        if (!props.data) {
            return <span>{'No data'}</span>;
        }

        // if (!props.data.files.length) {
        // return <span>{'No files'}</span>;
        // }

        return <InnerBody {...props}/>;
    };

    const footer = (props: any) => false;

    return (
        <FancyModal
            header={'Seek it bro!'}
            body={body}
            footer={footer}
            theme={props.theme}
        />
    );
}
