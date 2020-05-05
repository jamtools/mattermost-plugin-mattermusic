import {Reducer} from "redux";
import {Post} from "mattermost-redux/types/posts";
import {Theme} from "mattermost-redux/types/preferences";
import {FileInfo} from "mattermost-redux/types/files";
import {State} from "../reducers";

export type FileHookResponse = {
    message: string | null; // error message
    files: File[] | null; // modified file array to upload
}

type DefaultProps = {theme: Theme};
type PostDropdownMenuComponentProps = DefaultProps & {postId: string};
type FilePreviewOverrideProps = DefaultProps & {fileInfo: FileInfo, post: Post};

export type FilesWillUploadHook = (files: File[], upload: (files: File[]) => void) => Promise<FileHookResponse>;

type Component<T> = React.Component<T> | React.FunctionComponent<T>

export interface Registry {
    registerPostDropdownMenuAction: (text: string, action: (postID: string) => void, filter?: () => boolean) => string;
    registerFilesWillUploadHook: (hook: FilesWillUploadHook) => string;
    registerReducer: (reducer: Reducer) => void;
    registerMessageWillFormatHook: (hook: (post: Post, message: string) => string) => void;
    registerRootComponent: (component: Component<DefaultProps>) => void;
    registerPostDropdownMenuComponent: (component: Component<PostDropdownMenuComponentProps>) => void;
    registerFilePreviewComponent: (override: (fileInfo: FileInfo, post: Post) => boolean, component: Component<FilePreviewOverrideProps>) => string;
}

export interface Store {
    dispatch(action: {}): void;
    getState(): State;
}
