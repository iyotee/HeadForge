// Browser API type definitions for Chrome Extension

export interface ChromeStorage {
  local: {
    get(keys?: string | string[] | object | null): Promise<object>;
    set(items: object): Promise<void>;
    remove(keys: string | string[]): Promise<void>;
    clear(): Promise<void>;
    getBytesInUse(callback?: (bytesInUse: number) => void): Promise<number>;
    getBytesInUse(keys: string | string[] | null, callback?: (bytesInUse: number) => void): Promise<number>;
  };
  sync: {
    get(keys?: string | string[] | object | null): Promise<object>;
    set(items: object): Promise<void>;
    remove(keys: string | string[]): Promise<void>;
    clear(): Promise<void>;
    getBytesInUse(callback?: (bytesInUse: number) => void): Promise<number>;
    getBytesInUse(keys: string | string[] | null, callback?: (bytesInUse: number) => void): Promise<number>;
    MAX_ITEMS: number;
    MAX_WRITE_OPERATIONS_PER_HOUR: number;
    MAX_WRITE_OPERATIONS_PER_MINUTE: number;
    QUOTA_BYTES: number;
    QUOTA_BYTES_PER_ITEM: number;
  };
  managed: {
    get(keys?: string | string[] | object | null): Promise<object>;
    onChanged: ChromeEvent<(changes: object, areaName: string) => void>;
  };
  onChanged: ChromeEvent<(changes: object, areaName: string) => void>;
}

export interface ChromeTabs {
  query(queryInfo: TabQueryInfo): Promise<Tab[]>;
  get(tabId: number): Promise<Tab>;
  getCurrent(): Promise<Tab>;
  create(createProperties: TabCreateProperties): Promise<Tab>;
  update(tabId: number | undefined, updateProperties: TabUpdateProperties): Promise<Tab>;
  update(updateProperties: TabUpdateProperties): Promise<Tab>;
  move(tabId: number | number[], moveProperties: TabMoveProperties): Promise<Tab | Tab[]>;
  move(moveProperties: TabMoveProperties): Promise<Tab | Tab[]>;
  reload(tabId: number | undefined, reloadProperties?: TabReloadProperties): Promise<void>;
  reload(reloadProperties?: TabReloadProperties): Promise<void>;
  remove(tabId: number | number[]): Promise<void>;
  detectLanguage(tabId: number | undefined): Promise<string>;
  detectLanguage(): Promise<string>;
  captureVisibleTab(windowId?: number, options?: TabCaptureOptions): Promise<string>;
  captureVisibleTab(options?: TabCaptureOptions): Promise<string>;
  executeScript(tabId: number | undefined, details: ScriptInjectionDetails): Promise<any[]>;
  executeScript(details: ScriptInjectionDetails): Promise<any[]>;
  insertCSS(tabId: number | undefined, details: CSSInjectionDetails): Promise<void>;
  insertCSS(details: CSSInjectionDetails): Promise<void>;
  removeCSS(tabId: number | undefined, details: CSSInjectionDetails): Promise<void>;
  removeCSS(details: CSSInjectionDetails): Promise<void>;
  sendMessage(tabId: number, message: any, options?: MessageSendOptions): Promise<any>;
  sendMessage(tabId: number, message: any, responseCallback?: (response: any) => void): void;
  connect(tabId: number, connectInfo?: TabConnectInfo): Port;
  connect(connectInfo?: TabConnectInfo): Port;
  onCreated: ChromeEvent<(tab: Tab) => void>;
  onUpdated: ChromeEvent<(tabId: number, changeInfo: TabChangeInfo, tab: Tab) => void>;
  onMoved: ChromeEvent<(tabId: number, moveInfo: TabMoveInfo) => void>;
  onActivated: ChromeEvent<(activeInfo: TabActiveInfo) => void>;
  onHighlighted: ChromeEvent<(highlightInfo: TabHighlightInfo) => void>;
  onDetached: ChromeEvent<(tabId: number, detachInfo: TabDetachInfo) => void>;
  onAttached: ChromeEvent<(tabId: number, attachInfo: TabAttachInfo) => void>;
  onRemoved: ChromeEvent<(tabId: number, removeInfo: TabRemoveInfo) => void>;
  onReplaced: ChromeEvent<(addedTabId: number, removedTabId: number) => void>;
  onZoomChange: ChromeEvent<(ZoomChangeInfo: TabZoomChangeInfo) => void>;
}

export interface ChromeRuntime {
  id: string;
  onStartup: ChromeEvent<() => void>;
  onInstalled: ChromeEvent<(details: RuntimeOnInstalledDetails) => void>;
  onSuspend: ChromeEvent<() => void>;
  onSuspendCanceled: ChromeEvent<() => void>;
  onUpdateAvailable: ChromeEvent<(details: RuntimeOnUpdateAvailableDetails) => void>;
  onBrowserUpdateAvailable: ChromeEvent<() => void>;
  onRestartRequired: ChromeEvent<(reason: string) => void>;
  onConnect: ChromeEvent<(port: Port) => void>;
  onConnectExternal: ChromeEvent<(port: Port) => void>;
  onMessage: ChromeEvent<(message: any, sender: MessageSender, sendResponse: (response?: any) => void) => boolean>;
  onMessageExternal: ChromeEvent<(message: any, sender: MessageSender, sendResponse: (response?: any) => void) => boolean>;
  connect(connectInfo?: RuntimeConnectInfo): Port;
  connect(extensionId: string, connectInfo?: RuntimeConnectInfo): Port;
  connectNative(application: string): Port;
  sendMessage(message: any, responseCallback?: (response: any) => void): void;
  sendMessage(extensionId: string, message: any, responseCallback?: (response: any) => void): void;
  sendMessage(extensionId: string, message: any, options: RuntimeSendMessageOptions, responseCallback?: (response: any) => void): void;
  sendNativeMessage(application: string, message: any, responseCallback?: (response: any) => void): void;
  getManifest(): Manifest;
  getURL(path?: string): string;
  setUninstallURL(url: string, callback?: () => void): void;
  reload(): void;
  requestUpdateCheck(callback: (status: string, details?: RuntimeRequestUpdateCheckDetails) => void): void;
  restart(): void;
  restartAfterDelay(seconds: number, callback?: () => void): void;
  getPlatformInfo(callback: (platformInfo: RuntimePlatformInfo) => void): void;
  getPackageDirectoryEntry(callback: (directoryEntry: DirectoryEntry) => void): void;
}

export interface ChromeClipboard {
  writeText(data: string): Promise<void>;
  readText(): Promise<string>;
}

export interface ChromeContextMenus {
  create(createProperties: ContextMenuCreateProperties, callback?: () => void): number | string;
  update(id: number | string, updateProperties: ContextMenuUpdateProperties, callback?: () => void): void;
  remove(id: number | string, callback?: () => void): void;
  removeAll(callback?: () => void): void;
  onClicked: ChromeEvent<(info: ContextMenuOnClickedInfo, tab?: Tab) => void>;
}

export interface ChromeCommands {
  onCommand: ChromeEvent<(command: string) => void>;
  getAll(callback: (commands: Command[]) => void): void;
}

export interface ChromeAction {
  setTitle(details: ActionSetTitleDetails, callback?: () => void): void;
  getTitle(details: ActionGetTitleDetails, callback: (result: string) => void): void;
  setIcon(details: ActionSetIconDetails, callback?: () => void): void;
  setPopup(details: ActionSetPopupDetails, callback?: () => void): void;
  setBadgeText(details: ActionSetBadgeTextDetails, callback?: () => void): void;
  getBadgeText(details: ActionGetBadgeTextDetails, callback: (result: string) => void): void;
  setBadgeBackgroundColor(details: ActionSetBadgeBackgroundColorDetails, callback?: () => void): void;
  getBadgeBackgroundColor(details: ActionGetBadgeBackgroundColorDetails, callback: (result: ColorArray) => void): void;
  enable(callback?: () => void): void;
  enable(tabId: number, callback?: () => void): void;
  disable(callback?: () => void): void;
  disable(tabId: number, callback?: () => void): void;
  onClicked: ChromeEvent<(tab: Tab) => void>;
}

export interface ChromeManagement {
  get(callback: (result: ExtensionInfo) => void): void;
  get(id: string, callback: (result: ExtensionInfo) => void): void;
  getAll(callback: (result: ExtensionInfo[]) => void): void;
  getSelf(callback: (result: ExtensionInfo) => void): void;
  setEnabled(id: string, enabled: boolean, callback?: () => void): void;
  uninstall(id: string, options?: ManagementUninstallOptions, callback?: () => void): void;
  uninstallSelf(options?: ManagementUninstallOptions, callback?: () => void): void;
  getPermissionWarningsById(id: string, callback: (permissionWarnings: string[]) => void): void;
  getPermissionWarningsByManifest(manifestStr: string, callback: (permissionWarnings: string[]) => void): void;
  launchApp(id: string, callback?: () => void): void;
  onInstalled: ChromeEvent<(info: ExtensionInfo) => void>;
  onUninstalled: ChromeEvent<(id: string) => void>;
  onEnabled: ChromeEvent<(info: ExtensionInfo) => void>;
  onDisabled: ChromeEvent<(info: ExtensionInfo) => void>;
}

// Supporting interfaces
export interface Tab {
  id?: number;
  index: number;
  windowId: number;
  openerTabId?: number;
  selected?: boolean;
  highlighted: boolean;
  active: boolean;
  pinned: boolean;
  audible?: boolean;
  discarded: boolean;
  autoDiscardable: boolean;
  mutedInfo?: TabMutedInfo;
  url?: string;
  pendingUrl?: string;
  title?: string;
  favIconUrl?: string;
  status?: string;
  incognito: boolean;
  width?: number;
  height?: number;
  sessionId?: string;
}

export interface TabQueryInfo {
  active?: boolean;
  audible?: boolean;
  autoDiscardable?: boolean;
  currentWindow?: boolean;
  discarded?: boolean;
  groupId?: number;
  highlighted?: boolean;
  index?: number;
  lastFocusedWindow?: boolean;
  muted?: boolean;
  pinned?: boolean;
  status?: string;
  title?: string;
  url?: string | string[];
  windowId?: number;
  windowType?: string;
}

export interface TabCreateProperties {
  windowId?: number;
  index?: number;
  url?: string;
  active?: boolean;
  selected?: boolean;
  pinned?: boolean;
  openerTabId?: number;
}

export interface TabUpdateProperties {
  active?: boolean;
  highlighted?: boolean;
  loadReplace?: boolean;
  muted?: boolean;
  openerTabId?: number;
  pinned?: boolean;
  selected?: boolean;
  url?: string;
}

export interface TabMoveProperties {
  windowId?: number;
  index: number;
}

export interface TabReloadProperties {
  bypassCache?: boolean;
}

export interface TabCaptureOptions {
  format?: string;
  quality?: number;
}

export interface ScriptInjectionDetails {
  allFrames?: boolean;
  code?: string;
  file?: string;
  frameId?: number;
  matchAboutBlank?: boolean;
  runAt?: string;
}

export interface CSSInjectionDetails {
  allFrames?: boolean;
  code?: string;
  file?: string;
  frameId?: number;
  matchAboutBlank?: boolean;
  runAt?: string;
}

export interface MessageSendOptions {
  frameId?: number;
}

export interface TabConnectInfo {
  name?: string;
}

export interface TabChangeInfo {
  audible?: boolean;
  autoDiscardable?: boolean;
  discarded?: boolean;
  favIconUrl?: string;
  groupId?: number;
  highlighted?: boolean;
  mutedInfo?: TabMutedInfo;
  pinned?: boolean;
  status?: string;
  title?: string;
  url?: string;
}

export interface TabMoveInfo {
  windowId: number;
  fromIndex: number;
  toIndex: number;
}

export interface TabActiveInfo {
  tabId: number;
  windowId: number;
}

export interface TabHighlightInfo {
  tabIds: number[];
  windowId: number;
}

export interface TabDetachInfo {
  oldWindowId: number;
  oldPosition: number;
}

export interface TabAttachInfo {
  newWindowId: number;
  newPosition: number;
}

export interface TabRemoveInfo {
  windowId: number;
  isWindowClosing: boolean;
}

export interface TabZoomChangeInfo {
  tabId: number;
  oldZoomFactor: number;
  newZoomFactor: number;
  zoomSettings: ZoomSettings;
}

export interface TabMutedInfo {
  muted: boolean;
  reason?: string;
  extensionId?: string;
}

export interface Port {
  name: string;
  disconnect(): void;
  onDisconnect: ChromeEvent<() => void>;
  onMessage: ChromeEvent<(message: any) => void>;
  postMessage(message: any): void;
  sender?: MessageSender;
}

export interface MessageSender {
  tab?: Tab;
  frameId?: number;
  id?: string;
  url?: string;
  tlsChannelId?: string;
}

export interface RuntimeOnInstalledDetails {
  reason: string;
  previousVersion?: string;
}

export interface RuntimeOnUpdateAvailableDetails {
  version: string;
}

export interface RuntimeConnectInfo {
  name?: string;
  includeTlsChannelId?: boolean;
}

export interface RuntimeSendMessageOptions {
  includeTlsChannelId?: boolean;
}

export interface RuntimeRequestUpdateCheckDetails {
  version: string;
}

export interface RuntimePlatformInfo {
  os: string;
  arch: string;
  nacl_arch: string;
}

export interface DirectoryEntry {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
  fullPath: string;
  filesystem: any;
}

export interface Manifest {
  manifest_version: number;
  name: string;
  version: string;
  description?: string;
  icons?: { [key: string]: string };
  default_locale?: string;
  background?: any;
  content_scripts?: any[];
  content_security_policy?: string;
  web_accessible_resources?: any[];
  permissions?: string[];
  optional_permissions?: string[];
  host_permissions?: string[];
  action?: any;
  browser_action?: any;
  page_action?: any;
  options_page?: string;
  options_ui?: any;
  chrome_url_overrides?: any;
  commands?: any;
  devtools_page?: string;
  event_rules?: any[];
  externally_connectable?: any;
  file_browser_handlers?: any[];
  file_system_provider_capabilities?: any;
  homepage_url?: string;
  import?: any[];
  input_components?: any[];
  key?: string;
  minimum_chrome_version?: string;
  nacl_modules?: any[];
  oauth2?: any;
  offline_enabled?: boolean;
  platforms?: any[];
  requirements?: any;
  sandbox?: any;
  short_name?: string;
  storage?: any;
  system_indicator?: any;
  update_url?: string;
  version_name?: string;
  webview?: any;
}

export interface ContextMenuCreateProperties {
  type?: string;
  id?: string;
  title?: string;
  checked?: boolean;
  contexts?: string[];
  visible?: boolean;
  onclick?: (info: ContextMenuOnClickedInfo, tab?: Tab) => void;
  parentId?: string | number;
  documentUrlPatterns?: string[];
  targetUrlPatterns?: string[];
  enabled?: boolean;
}

export interface ContextMenuUpdateProperties {
  type?: string;
  title?: string;
  checked?: boolean;
  contexts?: string[];
  visible?: boolean;
  onclick?: (info: ContextMenuOnClickedInfo, tab?: Tab) => void;
  parentId?: string | number;
  documentUrlPatterns?: string[];
  targetUrlPatterns?: string[];
  enabled?: boolean;
}

export interface ContextMenuOnClickedInfo {
  menuItemId: string | number;
  parentMenuItemId?: string | number;
  mediaType?: string;
  linkUrl?: string;
  srcUrl?: string;
  pageUrl?: string;
  frameUrl?: string;
  selectionText?: string;
  editable: boolean;
  wasChecked?: boolean;
  checked?: boolean;
}

export interface Command {
  name: string;
  description?: string;
  shortcut?: string;
}

export interface ActionSetTitleDetails {
  title: string;
  tabId?: number;
}

export interface ActionGetTitleDetails {
  tabId?: number;
}

export interface ActionSetIconDetails {
  imageData?: ImageData | { [key: string]: ImageData };
  path?: string | { [key: string]: string };
  tabId?: number;
}

export interface ActionSetPopupDetails {
  popup: string;
  tabId?: number;
}

export interface ActionSetBadgeTextDetails {
  text: string;
  tabId?: number;
}

export interface ActionGetBadgeTextDetails {
  tabId?: number;
}

export interface ActionSetBadgeBackgroundColorDetails {
  color: string | ColorArray;
  tabId?: number;
}

export interface ActionGetBadgeBackgroundColorDetails {
  tabId?: number;
}

export interface ColorArray {
  0: number;
  1: number;
  2: number;
  3: number;
}

export interface ExtensionInfo {
  id: string;
  name: string;
  shortName?: string;
  description?: string;
  version: string;
  versionName?: string;
  mayDisable: boolean;
  enabled: boolean;
  disabledReason?: string;
  isApp: boolean;
  type: string;
  appLaunchUrl?: string;
  homepageUrl?: string;
  updateUrl?: string;
  offlineEnabled?: boolean;
  optionsUrl?: string;
  icons?: { [key: string]: string };
  permissions?: string[];
  hostPermissions?: string[];
  installType?: string;
  launchType?: string;
  availableLaunchTypes?: string[];
  enabledIncognitoAccess?: boolean;
  warnings?: string[];
  blacklistState?: string;
}

export interface ManagementUninstallOptions {
  showConfirmDialog?: boolean;
}

export interface ZoomSettings {
  mode?: string;
  scope?: string;
  defaultZoomFactor?: number;
}

// Chrome Event interface
export interface ChromeEvent<T extends Function> {
  addListener(callback: T): void;
  removeListener(callback: T): void;
  hasListener(callback: T): boolean;
  hasListeners(): boolean;
  getRules(callback: (rules: any[]) => void): void;
  getRules(ruleIdentifiers: string[], callback: (rules: any[]) => void): void;
  removeRules(ruleIdentifiers?: string[], callback?: () => void): void;
  addRules(rules: any[], callback?: (rules: any[]) => void): void;
}

// Global Chrome interface
export interface Chrome {
  storage: ChromeStorage;
  tabs: ChromeTabs;
  runtime: ChromeRuntime;
  clipboard: ChromeClipboard;
  contextMenus: ChromeContextMenus;
  commands: ChromeCommands;
  action: ChromeAction;
  management: ChromeManagement;
}

// Global chrome object
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const chrome: Chrome;
