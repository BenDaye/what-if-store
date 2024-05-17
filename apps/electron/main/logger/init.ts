import path from 'path';
import { app, dialog } from 'electron';
import log from 'electron-log';
import { getPath } from '../utils';

export const initializeLogger = () => {
  try {
    log.initialize();

    Object.assign(console, log.functions);

    log.transports.file.resolvePathFn = (
      pathVariables: log.PathVariables,
      message?: log.LogMessage,
    ) =>
      path.join(
        getPath('logs'),
        message?.level ?? 'silly',
        pathVariables.fileName,
      );

    log.errorHandler.startCatching({
      showDialog: false,
      onError: ({ createIssue, error, processType, versions }) => {
        if (processType === 'renderer') return;

        dialog
          .showMessageBox({
            title: 'An error occurred',
            message: error.message,
            detail: error.stack,
            type: 'error',
            buttons: ['Ignore', 'Report', 'Exit'],
          })
          .then(({ response }) => {
            if (response === 1) {
              return createIssue(
                'https://github.com/bendaye/what-if-store/issues/new',
                {
                  title: `Error report for ${versions.app}`,
                  body:
                    'Error:\n```' +
                    error.stack +
                    '\n```\n' +
                    `OS: ${versions.os}`,
                },
              );
            }

            if (response === 2) app.quit();
          })
          .catch((err) => log.error(err));
      },
    });

    app.once('before-quit', () => {
      log.errorHandler.stopCatching();
    });
  } catch (err) {
    log.error(err);
  }
};
