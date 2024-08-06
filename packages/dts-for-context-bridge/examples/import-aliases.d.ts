interface Window {
    /**
     * Demo from Electron docs
     * @see https://www.electronjs.org/docs/latest/api/context-bridge
     */
    readonly electronAlias: { doThing: () => void; };
    /**
     * Another Demo from Electron docs
     * @see https://www.electronjs.org/docs/latest/api/context-bridge
     */
    readonly contextBridgeAlias: { doThing: () => void; };
}
