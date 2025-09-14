export declare function copyToClipboard(text: string): Promise<void>;
export declare function readFromClipboard(): Promise<string>;
export declare const ClipboardUtils: {
    copyToClipboard: typeof copyToClipboard;
    readFromClipboard: typeof readFromClipboard;
    copyImageToClipboard: typeof copyImageToClipboard;
    isClipboardSupported: typeof isClipboardSupported;
    isClipboardReadSupported: typeof isClipboardReadSupported;
    isClipboardWriteSupported: typeof isClipboardWriteSupported;
};
export declare function isClipboardSupported(): boolean;
export declare function isClipboardReadSupported(): boolean;
export declare function isClipboardWriteSupported(): boolean;
export declare function copyImageToClipboard(imageBlob: Blob): Promise<void>;
export declare function copyHtmlToClipboard(html: string, plainText?: string): Promise<void>;
export declare function getClipboardPermission(): Promise<PermissionState>;
export declare function requestClipboardPermission(): Promise<boolean>;
export declare function copyWithNotification(text: string, notificationText?: string): Promise<void>;
export declare function createCopyButton(text: string, buttonText?: string, onSuccess?: () => void, onError?: (error: Error) => void): HTMLButtonElement;
export declare function createCopyableElement(text: string, elementType?: keyof HTMLElementTagNameMap): HTMLElement;
export declare function addCopyToClipboardListener(element: HTMLElement, getText: () => string, onSuccess?: () => void, onError?: (error: Error) => void): void;
export declare function getClipboardInfo(): {
    supported: boolean;
    readSupported: boolean;
    writeSupported: boolean;
    permission: PermissionState | 'unknown';
};
export declare function getClipboardInfoAsync(): Promise<{
    supported: boolean;
    readSupported: boolean;
    writeSupported: boolean;
    permission: PermissionState;
}>;
//# sourceMappingURL=clipboard.d.ts.map