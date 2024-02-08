import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Modal} from 'react-bootstrap';

import {Theme} from 'mattermost-redux/types/preferences';

import {TrimModalData, State} from '../reducers';

import FormButton from './form_button';

type DefaultProps = {
    theme: Theme;
};

type StateProps<T> = {
    open: boolean;
    data: T;
};

type DispatchProps = {
    close: () => void;
};

type Props<T> = StateProps<T> & DispatchProps

type Action = {
    type: string;
    data?: {};
}

export type ConnectConfig<T> = {
    state(state: State): StateProps<T>;
    dispatch(dispatch: (action: Action) => any): any;
}

function createModal<T>(config: ConnectConfig<T>) {
    return connect(config.state, config.dispatch)(ModalImpl) as IModal<T>;
}
export default createModal;

type OwnProps<T> = {
    header: string;
    body: React.FunctionComponent<{data: T}>;
    footer: React.FunctionComponent<{data: T}>;
}

export type IModal<T> = React.FunctionComponent<OwnProps<T> & DefaultProps>;

function ModalImpl<T>(props: Props<T> & DefaultProps & OwnProps<T>) {
    const {open, data, theme} = props;
    const ref = React.useRef(null);

    if (!open) {
        return false;
    }

    const handleClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        props.close();
    };

    const Body = props.body;
    const Footer = props.footer;

    const footerClose = (
        <FormButton
            type='submit'
            btnClass='btn btn-primary'
            defaultMessage='Close'
            onClick={handleClose}
        >
            {'Close'}
        </FormButton>
    );

    const footer = (
        <React.Fragment>
            {footerClose}
            {Footer && <Footer {...props}/>}
        </React.Fragment>
    );

    const style = getStyle(theme);

    return (
        <Modal
            dialogClassName='modal--scroll'
            show={open}
            onHide={handleClose}
            onExited={handleClose}
            bsSize='large'
            backdrop='static'
        >
            <Modal.Header closeButton={true}>
                <Modal.Title>
                    {props.header}
                </Modal.Title>
            </Modal.Header>
            <form
                role='form'
                onSubmit={handleClose}
            >
                <Modal.Body
                    style={style.modalBody}
                    ref={ref}
                >
                    <Body {...props}/>
                </Modal.Body>
                <Modal.Footer style={style.modalFooter}>
                    {footer}
                </Modal.Footer>
            </form>
        </Modal>
    );
}

const getStyle = (theme: Theme) => ({
    modalBody: {
        padding: '2em 2em 3em',
        color: theme.centerChannelColor,
        backgroundColor: theme.centerChannelBg,
    },
    modalFooter: {
        padding: '2rem 15px',
    },
    descriptionArea: {
        height: 'auto',
        width: '100%',
        color: '#000',
    },
});
