import {FileInfo} from "mattermost-redux/types/files"

const extensionMap: {[extension: string]: string} = {
    mp3: 'audio/mp3',
    aac: 'audio/aac',
}

export function getMimeFromFileInfo(fileInfo: FileInfo): string {
    if (fileInfo.mime_type) {
        return fileInfo.mime_type;
    }

    const extension = fileInfo.extension;
    return extensionMap[extension] || '';
}
