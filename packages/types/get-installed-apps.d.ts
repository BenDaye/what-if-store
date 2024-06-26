declare module 'get-installed-apps' {
  interface App {
    appName: string;
    appIdentifier: string;
    appInstallDate: string;
    appVersion: string;
  }
  export interface MacApp extends App {
    _kMDItemDisplayNameWithExtensions: string;
    kMDItemAppStoreCategory: string;
    kMDItemAppStoreCategoryType: string;
    kMDItemCFBundleIdentifier: string;
    kMDItemContentCreationDate: string;
    kMDItemContentCreationDate_Ranking: string;
    kMDItemContentModificationDate: string;
    kMDItemContentType: string;
    kMDItemCopyright: string;
    kMDItemDateAdded: string;
    kMDItemDisplayName: string;
    kMDItemDocumentIdentifier: string;
    kMDItemFSContentChangeDate: string;
    kMDItemFSCreationDate: string;
    kMDItemFSFinderFlags: string;
    kMDItemFSInvisible: string;
    kMDItemFSIsExtensionHidden: string;
    kMDItemFSLabel: string;
    kMDItemFSName: string;
    kMDItemFSNodeCount: string;
    kMDItemFSOwnerGroupID: string;
    kMDItemFSOwnerUserID: string;
    kMDItemFSSize: string;
    kMDItemInterestingDate_Ranking: string;
    kMDItemKind: string;
    kMDItemLastUsedDate: string;
    kMDItemLastUsedDate_Ranking: string;
    kMDItemLogicalSize: string;
    kMDItemPhysicalSize: string;
    kMDItemUseCount: string;
    kMDItemVersion: string;
  }
  export interface WinApp extends App {
    'Inno Setup: Setup Version': string;
    'Inno Setup: App Path': string;
    InstallLocation: string;
    'Inno Setup: Icon Group': string;
    'Inno Setup: User': string;
    'Inno Setup: Selected Tasks': string;
    'Inno Setup: Deselected Tasks': string;
    'Inno Setup: Language': string;
    DisplayName: string;
    DisplayIcon: string;
    UninstallString: string;
    QuietUninstallString: string;
    DisplayVersion: string;
    Publisher: string;
    appPublisher: string;
    URLInfoAbout: string;
    HelpLink: string;
    URLUpdateInfo: string;
    NoModify: string;
    NoRepair: string;
    InstallDate: string;
    MajorVersion: string;
    MinorVersion: string;
    VersionMajor: string;
    VersionMinor: string;
    EstimatedSize: string;
  }

  export const getInstalledApps: () => Promise<MacApp[] | WinApp[]>;
  export const getMacInstalledApps: (directory?: string) => Promise<MacApp[]>;
  export const getWinInstalledApps: () => Promise<WinApp[]>;
}
