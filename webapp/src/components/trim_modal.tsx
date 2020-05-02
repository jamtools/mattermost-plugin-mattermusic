import React from 'react';
import {bindActionCreators} from 'redux';

import {TrimModalData, State} from '../reducers';
import {Theme} from 'mattermost-redux/types/preferences';

type DefaultProps = {theme: Theme}

import FormButton from './form_button';
import createModal, {ConnectConfig} from './modal';

const config: ConnectConfig<TrimModalData> = {
    state: ({'plugins-music-sniper': {trimModal}}) => ({
        open: Boolean(trimModal),
        data: trimModal,
    }),
    dispatch: (dispatch) => bindActionCreators({
        close: () => ({type: 'CLOSE_TRIM_MODAL'}),
    }, dispatch),
}

enum Bounds {
    Start,
    End,
};

const FancyModal = createModal<TrimModalData>(config);
export default function ActualExport(props: DefaultProps) {
    const InnerBody = (props: {files: File[]}) => {
        const [startTime, setStartTime] = React.useState(0);
        const [endTime, setEndTime] = React.useState(0);

        const audioRef = React.useRef<HTMLAudioElement | null>(null);

        const [selectedBound, setSelectedBound] = React.useState<Bounds | null>(null);

        const setTime = (time: number) => {
            switch (selectedBound) {
                case Bounds.Start:
                    setStartTime(time);
                    break;
                case Bounds.End:
                    setEndTime(time);
                    break;
            }
        }

        console.log('current start ' + startTime);

        const file = props.files[0];
        const blobURL = URL.createObjectURL(file);

        React.useEffect(() => {
            if (audioRef && audioRef.current) {
                const audio = audioRef.current;
                audio.onseeking = () => {
                    setTime(Math.round(audio.currentTime));
                }
                audio.onpause = () => {
                    setTime(Math.round(audio.currentTime));
                }
            }
        }, [selectedBound]);

        const clickedBoundsButton = (b: Bounds) => (e) => {
            e.stopPropagation();
            e.preventDefault();
            setSelectedBound(b);
        }

        return (
            <div style={{width: '100%'}}>
                <div>
                    <button onClick={clickedBoundsButton(Bounds.Start)}>{'Start Time'}</button>
                    <input value={startTime} onChange={e => setStartTime(parseInt(e.target.value))}/>
                </div>
                <div>
                    <button onClick={clickedBoundsButton(Bounds.End)}>{'End Time'}</button>
                    <input value={endTime} onChange={e => setEndTime(parseFloat(e.target.value))}/>
                </div>

                <audio controls={true} ref={audioRef}>
                    <source src={blobURL} type='audio/mp3'/>
                </audio>
            </div>
        );
    }

    const body = (props: {data: TrimModalData}) => {
        if (!props.data) {
            return <span>{'No data'}</span>;
        }

        if (!props.data.files.length) {
            return <span>{'No files'}</span>;
        }

        return <InnerBody files={props.data.files}/>
    }

    const submitForm = (e) => {
        e.preventDefault();
        e.stopPropagation();
        fetch('/plugins/music-sniper/trim', {
            body: 'yo',
            method: 'POST',
        }).then(r => r.text()).then(console.log);
    }

    const footer = (props: any) => (
        <FormButton
            id='submit-button'
            type='submit'
            btnClass='btn btn-primary'
            saving={false}
            onClick={submitForm}
        >
            {'Create'}
        </FormButton>
    );

    return (
        <FancyModal
            header={'Im the trim modal! Whats up bro!'}
            body={body}
            footer={footer}
            theme={props.theme}
        />
    )
}
