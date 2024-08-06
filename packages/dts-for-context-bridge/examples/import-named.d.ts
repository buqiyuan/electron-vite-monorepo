interface Window {
    /**
     * Demo from Electron docs
     * @see https://www.electronjs.org/docs/latest/api/context-bridge
     */
    readonly electron: { doThing: () => void; };
}
