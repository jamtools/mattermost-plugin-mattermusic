import {FileInfo} from 'mattermost-redux/types/files';

export function parseQueryString(query: string): any {
    const vars = query.split('&');
    return vars.reduce((accum, v) => {
        const pair = v.split('=');
        const key = decodeURIComponent(pair[0]);
        const value = decodeURIComponent(pair[1]);
        return {
            ...accum,
            [key]: value,
        }
    }, {});
}

function fallbackCopyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

export function copyTextToClipboard(text: string) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

export const addTextToClipboard = (toAdd: string) => {
    navigator.clipboard.readText()
    .then((text='') => {
        if (text) {
            text += ' ';
        }
        copyTextToClipboard(text + toAdd);
    })
    .catch(err => {
        console.error('Failed to read clipboard contents: ', err);
    });
};

export function getTimestampFromSeconds(seconds: number) {
    const minuteStr = Math.floor(seconds/60).toString();
    const second = Math.floor(seconds % 60);
    let secondStr = second.toString();
    if (second < 10) {
        secondStr = '0' + secondStr;
    }

    return `${minuteStr}:${secondStr}`;
}

export function getSecondsFromTimestamp(timestamp: string): number {
    if(!timestamp) {
        return 0;
    }

    const [minuteStr, secondsStr] = timestamp.split(':');
    const minutes = parseInt(minuteStr);
    const seconds = parseInt(secondsStr);
    return minutes*60 + seconds;
}
