import React from 'react';
import {bindActionCreators} from 'redux';

import {TrimModalData, State} from '../reducers';
import {Theme} from 'mattermost-redux/types/preferences';

type DefaultProps = {theme: Theme}

import FormButton from './form_button';
import createModal, {ConnectConfig} from './modal';
import {Project} from 'src/model';

const config: ConnectConfig<TrimModalData> = {
    state: ({'plugins-mattermusic': {trimModal}}) => ({
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

type TrimPayload = {
    start: number;
    end: number;
    file: File;
}

const FancyModal = createModal<TrimModalData>(config);
export default function ActualExport(props: DefaultProps) {
    const InnerBody = (props: {data: TrimModalData; close: () => void}) => {
        const [startTime, setStartTime] = React.useState(0);
        const [endTime, setEndTime] = React.useState(0);

        const audioRef = React.useRef<HTMLAudioElement | null>(null);

        const [selectedBound, setSelectedBound] = React.useState<Bounds | null>(null);
        const [projects, setProjects] = React.useState<Project[]>([]);

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

        const submitTrim = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!props.data) {
                return;
            }

            const file = props.data.files[0];

            const index = file.name.lastIndexOf('.');
            const name = file.name.substring(0, index);
            const ext = file.name.substring(index);
            const newName = `${name}-trimmed${ext}`;
            const file2 = new File([file], newName, { type: file.type });

            if (props.data.upload) {
                props.data.upload([file, file2]);
                props.close();
            }

            // const formData = new FormData();
            // formData.append('file', props.data.files[0]);
            // formData.append('start', startTime.toString());
            // formData.append('end', endTime.toString());

            // fetch('/plugins/mattermusic/trim', {
            //     body: formData,
            //     method: 'POST',
            // }).then(r => r.text()).then(console.log);
        }

        const file = props.data.files[0];
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

        React.useEffect(() => {
            fetch('/plugins/mattermusic/projects').then(r => r.json()).then(setProjects);
        }, []);

        const clickedBoundsButton = (b: Bounds) => (e) => {
            e.stopPropagation();
            e.preventDefault();
            setSelectedBound(b);
        }

        return (
            <div>
                <div>
                    <FormButton
                        btnClass='btn btn-primary'
                        saving={false}
                        onClick={clickedBoundsButton(Bounds.Start)}
                    >
                        {'Start'}
                    </FormButton>
                    <input value={startTime} onChange={e => setStartTime(parseInt(e.target.value))}/>
                </div>
                <div>
                    <FormButton
                        btnClass='btn btn-primary'
                        saving={false}
                        onClick={clickedBoundsButton(Bounds.End)}
                    >
                        {'End'}
                    </FormButton>
                    <input value={endTime} onChange={e => setEndTime(parseFloat(e.target.value))}/>
                </div>

                <audio controls={true} ref={audioRef} style={{width: '100%'}}>
                    <source src={blobURL} type={`audio/${file.name.split('.').pop()}`}/>
                </audio>
                <select>
                    {projects.map((project) => (
                        <option value={project.ID}>{project.Name}</option>
                    ))}
                </select>
                <FormButton
                    btnClass='btn btn-primary'
                    saving={false}
                    onClick={submitTrim}
                >
                    {'Trim'}
                </FormButton>
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

        return <InnerBody {...props}/>
    }

    const footer = (props: any) => (
        <FormButton
            btnClass='btn btn-primary'
            saving={false}
            onClick={e => e.stopPropagation()}
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
