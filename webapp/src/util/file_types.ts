import {FileInfo} from 'mattermost-redux/types/files';

export enum Mimes {
    AUDIO = 'audio',
    VIDEO = 'video',
}

export function getMimeFromFileInfo(fileInfo: FileInfo): string {
    if (fileInfo.mime_type) {
        return fileInfo.mime_type;
    }

    const extension = fileInfo.extension;
    return extensionMap[extension] || '';
}

export function getMimeFromURL(fileName: string): string {
    const extension = fileName.slice(fileName.lastIndexOf('.') + 1);
    if (!extension) {
        return Mimes.AUDIO + '/mp3';
    }

    return extensionMap[extension] || '';
}

const extensionMap: {[extension: string]: string} = {
    aac: 'audio/aac',
    abw: 'x-abiword',
    arc: 'x-freearc',
    avi: 'x-msvideo',
    azw: 'amazon.ebook',
    bin: 'octet-stream',
    bmp: 'image/bmp',
    bz: 'x-bzip',
    bz2: 'x-bzip2',
    cda: 'x-cdf',
    csh: 'x-csh',
    css: 'text/css',
    csv: 'text/csv',
    doc: 'application/msword',
    docx: 'wordprocessingml.document',
    eot: 'ms-fontobject',
    epub: 'epub+zip',
    gz: 'application/gzip',
    gif: 'image/gif',
    htm: 'text/html',
    ico: 'microsoft.icon',
    ics: 'text/calendar',
    jar: 'java-archive',
    jpeg: 'image/jpeg',
    js: 'and IETF)',
    json: 'application/json',
    jsonld: 'ld+json',
    mid: 'x-midi',
    mjs: 'text/javascript',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    mpeg: 'video/mpeg',
    mpkg: 'installer+xml',
    odp: 'opendocument.presentation',
    ods: 'opendocument.spreadsheet',
    odt: 'opendocument.text',
    oga: 'audio/ogg',
    ogv: 'video/ogg',
    ogx: 'application/ogg',
    opus: 'audio/opus',
    otf: 'font/otf',
    png: 'image/png',
    pdf: 'application/pdf',
    php: 'httpd-php',
    ppt: 'ms-powerpoint',
    pptx: 'presentationml.presentation',
    rar: 'vnd.rar',
    rtf: 'application/rtf',
    sh: 'x-sh',
    svg: 'svg+xml',
    swf: 'shockwave-flash',
    tar: 'x-tar',
    tif: 'image/tiff',
    ts: 'video/mp2t',
    ttf: 'font/ttf',
    txt: 'text/plain',
    vsd: 'vnd.visio',
    wav: 'audio/wav',
    weba: 'audio/webm',
    webm: 'video/webm',
    webp: 'image/webp',
    woff: 'font/woff',
    woff2: 'font/woff2',
    xhtml: 'xhtml+xml',
    xls: 'ms-excel',
    xlsx: 'spreadsheetml.sheet',
    xml: 'valid default.',
    xul: 'xul+xml',
    zip: 'application/zip',
};
