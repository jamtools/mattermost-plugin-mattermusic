import React from 'react';
import PropTypes from 'prop-types';

import {Theme} from 'mattermost-redux/types/preferences';

type Props = {
    theme: Theme;
    href: string;
    dispatch: any;
};

export default function SeekTooltip({href, theme, dispatch}: Props) {
    if (!href.startsWith('mattermusic://')) {
        return null;
    }
    const style = getStyle(theme);

    const parts = href.split('|');
    const [prefix, fileID, timestamp] = parts;

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const data = {fileID, seekTo: timestamp};

        dispatch({type: 'SEEK_GLOBAL_PLAYER', data});

        // look to see if it is a music sniper link, then seek if it is the case
    };

    return (
        <a
            style={style.modalBody}
            onClick={handleClick}
        >
            {/* <i
                style={iconStyles}
                className='icon fa fa-plug'
            /> */}
            {'Seek'}
        </a>
    );
}

const parentDivStyles = {
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    boxShadow: 'rgba(61, 60, 64, 0.1) 0px 17px 50px 0px, rgba(61, 60, 64, 0.1) 0px 12px 15px 0px',
    fontSize: '14px',
    marginTop: '10px',
    padding: '10px 15px 15px',
};

const iconStyles = {
    paddingRight: '5px',
};

const getStyle = (theme: Theme) => ({
    modalBody: {
        padding: '10px 15px 15px',
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
