import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import type { WingetListItem } from '@what-if-store/types/winget';

const exec = promisify(execCallback);

export type Output = {
  stdout?: string;
  stderr?: string;
  error?: string;
};

export type WingetCommand =
  | 'winget'
  | 'winget configure'
  | 'winget download'
  | 'winget export'
  | 'winget features'
  | 'winget hash'
  | 'winget import'
  | 'winget install'
  | 'winget add'
  | 'winget list'
  | 'winget ls'
  | 'winget pin'
  | 'winget search'
  | 'winget find'
  | 'winget settings'
  | 'winget config'
  | 'winget show'
  | 'winget view'
  | 'winget source'
  | 'winget uninstall'
  | 'winget remove'
  | 'winget rm'
  | 'winget upgrade'
  | 'winget update'
  | 'winget validate';

const isDev = process.env.NODE_ENV !== 'production';

const formatError = (error: unknown): Output => ({
  error: error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error',
});

const wingetCommand = async (
  command: WingetCommand,
  args: string[],
  fullCommand?: string,
): Promise<Output> => {
  try {
    const _command = fullCommand ?? `${command} ${args.join(' ')}`;
    if (_command.includes('--wait')) throw new Error('Cannot use --wait flag in non-interactive mode');
    const { stdout, stderr } = await Promise.race([
      exec(_command),
      new Promise<Output>((_, reject) =>
        setTimeout(
          () => reject(new Error('The command timed out after 30 seconds, possibly waiting for user input.')),
          30 * 1000,
        ),
      ),
    ]);
    if (isDev) {
      if (stderr) console.error({ command: _command, stderr });
      if (stdout) console.log({ command: _command, stdout });
    }
    return { stdout, stderr };
  } catch (error) {
    if (isDev) console.error(error);
    return formatError(error);
  }
};

export const wingetVersion = async (): Promise<Output> => await wingetCommand('winget', ['--version']);

export type WingetCommonArgs = {
  '-?'?: true;
  '--help'?: true;
  '--wait'?: true;
  '--logs'?: true;
  '--open-logs'?: true;
  '--verbose'?: true;
  '--verbose-logs'?: true;
  '--disable-interactivity'?: true;
  '--nowarn'?: true;
  '--ignore-warnings'?: true;
  '--proxy'?: string;
  '--no-proxy'?: true;
};

export type WingetConfigureArgs = {
  show?: true;
  test?: true;
  validate?: true;
  '-f'?: string;
  '--file'?: string;
  '--module-path'?: string;
  '--accept-configuration-agreements'?: true;
  '--enable'?: true;
  '--disable'?: true;
} & WingetCommonArgs;

export const wingetConfigure = async (args: WingetConfigureArgs): Promise<Output> =>
  await wingetCommand(
    'winget configure',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export type WingetDownloadArgs = {
  '-d'?: string;
  '--download-directory'?: string;
  '-m'?: string;
  '--manifest'?: string;
  '--id'?: string;
  '--name'?: string;
  '--moniker'?: string;
  '-v'?: string;
  '--version'?: string;
  '-s'?: string;
  '--source'?: string;
  '--scope'?: 'user' | 'machine';
  '-a'?: string;
  '--architecture'?: string;
  '--installer-type'?: string;
  '-e'?: true;
  '--exact'?: true;
  '--locale'?: string;
  '--ignore-security-hash'?: true;
  '--skip-dependencies'?: true;
  '--header'?: string;
  '--authentication-mode'?: 'silent' | 'silentPreferred' | 'interactive';
  '--authentication-account'?: string;
  '--accept-package-agreements'?: true;
  '--accept-source-agreements'?: true;
  '--skip-license'?: true;
  '--skip-microsoft-store-package-license'?: true;
  '--platform'?: string;
} & WingetCommonArgs;

export const wingetDownload = async (args: WingetDownloadArgs): Promise<Output> =>
  await wingetCommand(
    'winget download',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export type WingetExportArgs = {
  '-o'?: string;
  '--output'?: string;
  '-s'?: string;
  '--source'?: string;
  '--include-versions'?: true;
  '--accept-source-agreements'?: true;
} & WingetCommonArgs;

export const wingetExport = async (args: WingetExportArgs): Promise<Output> =>
  await wingetCommand(
    'winget export',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export type WingetFeaturesArgs = WingetCommonArgs;

export const wingetFeatures = async (args: WingetFeaturesArgs): Promise<Output> =>
  await wingetCommand('winget features', Object.keys(args));

export type WingetHashArgs = {
  '-f'?: string;
  '--file'?: string;
  '-m'?: true;
  '--msix'?: true;
} & WingetCommonArgs;

export const wingetHash = async (args: WingetHashArgs): Promise<Output> =>
  await wingetCommand(
    'winget hash',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export const wingetHelp = async (command: WingetCommand): Promise<Output> =>
  await wingetCommand(command, ['--help']);

export type WingetImportArgs = {
  '-i'?: string;
  '--import-file'?: string;
  '--ignore-unavailable'?: true;
  '--no-upgrade'?: true;
  '--accept-package-agreements'?: true;
  '--accept-source-agreements'?: true;
} & WingetCommonArgs;

export const wingetImport = async (args: WingetImportArgs): Promise<Output> =>
  await wingetCommand(
    'winget import',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export type WingetInstallArgs = {
  '-m'?: string;
  '--manifest'?: string;
  '--id'?: string;
  '--name'?: string;
  '--moniker'?: string;
  '-v'?: string;
  '--version'?: string;
  '-s'?: string;
  '--source'?: string;
  '--scope'?: 'user' | 'machine';
  '-a'?: string;
  '--architecture'?: string;
  '--installer-type'?: string;
  '-h'?: true;
  '--silent'?: true;
  '-e'?: true;
  '--exact'?: true;
  '--locale'?: string;
  '-l'?: string;
  '--location'?: string;
  '--ignore-security-hash'?: true;
  '--allow-reboot'?: true;
  '--skip-dependencies'?: true;
  '--ignore-local-archive-malware-scan'?: true;
  'dependency-source'?: string;
  '--accept-package-agreements'?: true;
  '--no-upgrade'?: true;
  '--header'?: string;
  '--authentication-mode'?: 'silent' | 'silentPreferred' | 'interactive';
  '--authentication-account'?: string;
  '--accept-source-agreements'?: true;
  '-r'?: string;
  '--rename'?: string;
  '--uninstall-previous'?: true;
} & WingetCommonArgs;

export const wingetInstall = async (args: WingetInstallArgs): Promise<Output> =>
  await wingetCommand(
    'winget install',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export const wingetAdd = async (args: WingetInstallArgs): Promise<Output> =>
  await wingetCommand(
    'winget add',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export type WingetListArgs = {
  '--id'?: string;
  '--name'?: string;
  '--moniker'?: string;
  '-s'?: string;
  '--source'?: string;
  '--tag'?: string;
  '--cmd'?: string;
  '--command'?: string;
  '-n'?: string;
  '--count'?: string;
  '-e'?: true;
  '--exact'?: true;
  '--scope'?: 'user' | 'machine';
  '--header'?: string;
  '--authentication-mode'?: 'silent' | 'silentPreferred' | 'interactive';
  '--authentication-account'?: string;
  '--accept-source-agreements'?: true;
  '--upgrade-available'?: true;
  '-u'?: true;
  '--unknown'?: true;
  '--include-unknown'?: true;
  '--pinned'?: true;
  '--include-pinned'?: true;
} & WingetCommonArgs;

export const wingetList = async (args: WingetListArgs): Promise<Output> =>
  await wingetCommand(
    'winget list',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );
export const wingetLs = async (args: WingetListArgs): Promise<Output> =>
  await wingetCommand(
    'winget ls',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export const wingetInfo = async () => await wingetCommand('winget', ['--info']);

export type WingetPinAddArgs = {
  '--id'?: string;
  '--name'?: string;
  '--moniker'?: string;
  '--tag'?: string;
  '--cmd'?: string;
  '--command'?: string;
  '-e'?: true;
  '--exact'?: true;
  '-v'?: string;
  '--version'?: string;
  '-s'?: string;
  '--source'?: string;
  '--header'?: string;
  '--authentication-mode'?: 'silent' | 'silentPreferred' | 'interactive';
  '--authentication-account'?: string;
  '--accept-source-agreements'?: true;
  '--force'?: true;
  '--blocking'?: true;
  '--installed'?: true;
} & WingetCommonArgs;

export type WingetPinRemoveArgs = Omit<
  WingetPinAddArgs,
  '--tag' | '-v' | '--version' | '--force' | '--blocking'
>;

export type WingetPinListArgs = Omit<
  WingetPinAddArgs,
  '--tag' | '-v' | '--version' | '--force' | '--blocking' | '--installed'
>;

export type WingetPinResetArgs = {
  '--force'?: true;
  '-s'?: string;
  '--source'?: string;
} & WingetCommonArgs;

export const wingetPinAdd = async (args: WingetPinAddArgs): Promise<Output> =>
  await wingetCommand('winget pin', [
    'add',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);

export const wingetPinRemove = async (args: WingetPinRemoveArgs): Promise<Output> =>
  await wingetCommand('winget pin', [
    'remove',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);

export const wingetPinList = async (args: WingetPinListArgs): Promise<Output> =>
  await wingetCommand('winget pin', [
    'list',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);

export const wingetPinReset = async (args: WingetPinResetArgs): Promise<Output> =>
  await wingetCommand('winget pin', [
    'reset',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);

export const wingetPin = async (args: WingetCommonArgs): Promise<Output> =>
  await wingetCommand(
    'winget pin',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export type WingetSearchArgs = {
  '--id'?: string;
  '--name'?: string;
  '--moniker'?: string;
  '--tag'?: string;
  '--cmd'?: string;
  '--command'?: string;
  '-s'?: string;
  '--source'?: string;
  '-n'?: string;
  '--count'?: string;
  '-e'?: true;
  '--exact'?: true;
  '--header'?: string;
  '--authentication-mode'?: 'silent' | 'silentPreferred' | 'interactive';
  '--authentication-account'?: string;
  '--accept-source-agreements'?: true;
  '--versions'?: true;
} & WingetCommonArgs;

export const wingetSearch = async (args: WingetSearchArgs): Promise<Output> =>
  await wingetCommand(
    'winget search',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );
export const wingetFind = async (args: WingetSearchArgs): Promise<Output> =>
  await wingetCommand(
    'winget find',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export type WingetSettingsArgs = {
  '--enable'?: string;
  '--disable'?: string;
} & WingetCommonArgs;

export type WingetSettingsExportArgs = WingetCommonArgs;

export type WingetSettingsSetArgs = {
  '--setting'?: string;
  '--value'?: string;
} & WingetCommonArgs;

export type WingetSettingsResetArgs = WingetSettingsSetArgs;

export const wingetSettings = async (args: WingetSettingsArgs): Promise<Output> =>
  await wingetCommand(
    'winget settings',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );
export const wingetConfig = async (args: WingetSettingsArgs): Promise<Output> =>
  await wingetCommand(
    'winget config',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export const wingetSettingsExport = async (args: WingetSettingsExportArgs): Promise<Output> =>
  await wingetCommand('winget settings', [
    'export',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);
export const wingetSConfigExport = async (args: WingetSettingsExportArgs): Promise<Output> =>
  await wingetCommand('winget config', [
    'export',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);

export const wingetSettingsSet = async (args: WingetSettingsSetArgs): Promise<Output> =>
  await wingetCommand('winget settings', [
    'set',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);
export const wingetConfigSet = async (args: WingetSettingsSetArgs): Promise<Output> =>
  await wingetCommand('winget config', [
    'set',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);

export const wingetSettingsReset = async (args: WingetSettingsResetArgs): Promise<Output> =>
  await wingetCommand('winget settings', [
    'reset',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);
export const wingetConfigReset = async (args: WingetSettingsResetArgs): Promise<Output> =>
  await wingetCommand('winget config', [
    'reset',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);

export type WingetShowArgs = {
  '-m'?: string;
  '--manifest'?: string;
  '--id'?: string;
  '--name'?: string;
  '--moniker'?: string;
  '-v'?: string;
  '--version'?: string;
  '-s'?: string;
  '--source'?: string;
  '-e'?: true;
  '--exact'?: true;
  '--scope'?: 'user' | 'machine';
  '-a'?: string;
  '--architecture'?: string;
  '--installer-type'?: string;
  '--locale'?: string;
  '--versions'?: true;
  '--header'?: string;
  '--authentication-mode'?: 'silent' | 'silentPreferred' | 'interactive';
  '--authentication-account'?: string;
  '--accept-source-agreements'?: true;
} & WingetCommonArgs;

export const wingetShow = async (args: WingetShowArgs): Promise<Output> =>
  await wingetCommand(
    'winget show',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );
export const wingetView = async (args: WingetShowArgs): Promise<Output> =>
  await wingetCommand(
    'winget view',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export type WingetSourceAddArgs = {
  '-n'?: string;
  '--name'?: string;
  '-a'?: string;
  '--arg'?: string;
  '-t'?: string;
  '--type'?: string;
  '--trust-level'?: 'none' | 'trusted';
  '--header'?: string;
  '--accept-source-agreements'?: true;
  '--explicit'?: true;
} & WingetCommonArgs;

export type WingetSourceRemoveArgs = {
  '-n'?: string;
  '--name'?: string;
} & WingetCommonArgs;

export type WingetSourceListArgs = {
  '-n'?: string;
  '--name'?: string;
} & WingetCommonArgs;

export type WingetSourceUpdateArgs = {
  '-n'?: string;
  '--name'?: string;
} & WingetCommonArgs;

export type WingetSourceResetArgs = {
  '-n'?: string;
  '--name'?: string;
  '--force'?: true;
} & WingetCommonArgs;

export type WingetSourceExportArgs = {
  '-n'?: string;
  '--name'?: string;
} & WingetCommonArgs;

export const wingetSourceAdd = async (args: WingetSourceAddArgs): Promise<Output> =>
  await wingetCommand('winget source', [
    'add',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);

export const wingetSourceList = async (args: WingetSourceListArgs): Promise<Output> =>
  await wingetCommand('winget source', [
    'list',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);
export const wingetSourceLs = async (args: WingetSourceListArgs): Promise<Output> =>
  await wingetCommand('winget source', [
    'ls',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);

export const wingetSourceRemove = async (args: WingetSourceRemoveArgs): Promise<Output> =>
  await wingetCommand('winget source', [
    'remove',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);
export const wingetSourceRm = async (args: WingetSourceRemoveArgs): Promise<Output> =>
  await wingetCommand('winget source', [
    'rm',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);

export const wingetSourceUpdate = async (args: WingetSourceUpdateArgs): Promise<Output> =>
  await wingetCommand('winget source', [
    'update',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);

export const wingetSourceReset = async (args: WingetSourceResetArgs): Promise<Output> =>
  await wingetCommand('winget source', [
    'reset',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);

export const wingetSourceExport = async (args: WingetSourceExportArgs): Promise<Output> =>
  await wingetCommand('winget source', [
    'export',
    ...Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  ]);

export const wingetSource = async (args: WingetCommonArgs): Promise<Output> =>
  await wingetCommand(
    'winget source',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export type WingetUninstallArgs = {
  '-m'?: string;
  '--manifest'?: string;
  '--id'?: string;
  '--name'?: string;
  '--moniker'?: string;
  '--product-code'?: string;
  '-v'?: string;
  '--version'?: string;
  '--all'?: true;
  '--all-versions'?: true;
  '-s'?: string;
  '--source'?: string;
  '-e'?: true;
  '--exact'?: true;
  '--scope'?: 'user' | 'machine';
  '-i'?: true;
  '--interactive'?: true;
  '-h'?: true;
  '--silent'?: true;
  '--force'?: true;
  '--purge'?: true;
  '--preserve'?: true;
  '-o'?: string;
  '--log'?: string;
  '--header'?: string;
  '--authentication-mode'?: 'silent' | 'silentPreferred' | 'interactive';
  '--authentication-account'?: string;
  '--accept-source-agreements'?: true;
} & WingetCommonArgs;

export const wingetUninstall = async (args: WingetUninstallArgs): Promise<Output> =>
  await wingetCommand(
    'winget uninstall',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );
export const wingetRemove = async (args: WingetUninstallArgs): Promise<Output> =>
  await wingetCommand(
    'winget remove',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );
export const wingetRm = async (args: WingetUninstallArgs): Promise<Output> =>
  await wingetCommand(
    'winget rm',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export type WingetUpgradeArgs = {
  '-m'?: string;
  '--manifest'?: string;
  '--id'?: string;
  '--name'?: string;
  '--moniker'?: string;
  '-v'?: string;
  '--version'?: string;
  '-s'?: string;
  '--source'?: string;
  '-e'?: true;
  '--exact'?: true;
  '-i'?: true;
  '--interactive'?: true;
  '-h'?: true;
  '--silent'?: true;
  '--purge'?: true;
  '-o'?: string;
  '--log'?: string;
  '--custom'?: string;
  '--override'?: string;
  '-l'?: string;
  '--location'?: string;
  '--scope'?: 'user' | 'machine';
  '-a'?: string;
  '--architecture'?: string;
  '--installer-type'?: string;
  '--locale'?: string;
  '--ignore-security-hash'?: true;
  '--allow-reboot'?: true;
  '--skip-dependencies'?: true;
  '--ignore-local-archive-malware-scan'?: true;
  '--accept-package-agreements'?: true;
  '--accept-source-agreements'?: true;
  '--header'?: string;
  '--authentication-mode'?: 'silent' | 'silentPreferred' | 'interactive';
  '--authentication-account'?: string;
  '-r'?: true;
  '--recurse'?: true;
  '--all'?: true;
  '-u'?: true;
  '--unknown'?: true;
  '--include-unknown'?: true;
  '--pinned'?: true;
  '--include-pinned'?: true;
  '--uninstall-previous'?: true;
  '--force'?: true;
} & WingetCommonArgs;

export const wingetUpgrade = async (args: WingetUpgradeArgs): Promise<Output> =>
  await wingetCommand(
    'winget upgrade',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );
export const wingetUpdate = async (args: WingetUpgradeArgs): Promise<Output> =>
  await wingetCommand(
    'winget update',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export type WingetValidateArgs = {
  '--manifest'?: string;
} & WingetCommonArgs;

export const wingetValidate = async (args: WingetValidateArgs): Promise<Output> =>
  await wingetCommand(
    'winget validate',
    Object.entries(args).flatMap(([key, value]) => (typeof value === 'string' ? [key, value] : [key])),
  );

export const transformWingetListStdoutToItems = (stdout: string): WingetListItem[] => {
  const lines = stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.map((line) => {
    const [name, id, version, available, source] = line.split(/\s{2,}/).map((item) => item.trim());
    return { name, id, version, available, source };
  });
};
