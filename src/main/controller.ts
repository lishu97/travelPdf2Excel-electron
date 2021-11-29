import { BrowserWindow, ipcMain, dialog } from 'electron';

type action = {
  name: string;
  payload: unknown;
};

export default function controller(mainWindow: BrowserWindow | null) {
  ipcMain.on('ipc', async (event, arg: action) => {
    console.log('nodejs收到:', arg);
    switch (arg.name) {
      case 'openChooseDirModal':
        const dir = dialog.showOpenDialog(mainWindow!, {
          properties: ['openDirectory'],
        });
        dir.then((dif) => {
          event.reply('ipc', dif?.filePaths?.[0]);
        });
        break;
      default:
        break;
    }
  });
}
