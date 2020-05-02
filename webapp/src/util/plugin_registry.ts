import {Reducer} from "redux";

export type FileHookResponse = {
    message: string | null; // error message
    files: File[] | null; // modified file array to upload
}

export type FilesWillUploadHook = (files: File[], upload: (files: File[]) => void) => Promise<FileHookResponse>;

export interface Registry {
    registerPostDropdownMenuAction: (text: string, action: (postID: string) => void, filter?: () => boolean) => string;
    // registerRightHandSidebarComponent: (comp: React.FunctionComponent, title: string) => RHSInfo;
    registerFilesWillUploadHook: (hook: FilesWillUploadHook) => void;
    registerReducer: (reducer: Reducer) => void;
    registerRootComponent: (component: React.Component | React.FunctionComponent) => void;
}

export interface Store {
    dispatch(action: {}): void;
    getState(): string
}
