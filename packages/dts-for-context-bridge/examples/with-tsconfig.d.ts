interface Window {
    readonly electron: { readonly invoke: (...args: any[]) => Promise<any>; };
    readonly openExternalURL: (url: string) => Promise<void>;
    readonly uuid: () => string;
    readonly maximize: () => void;
    readonly unmaximize: () => void;
    readonly minimize: () => void;
}
