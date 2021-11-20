import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';

export default function controller({ mainWindow: BrowserWindow }) {
  ipcMain.on('ipc', async (event, arg: unknown) => {
    console.log('nodejs收到:', arg);
    const dir = dialog.showOpenDialog(mainWindow!, {
      properties: ['openDirectory'],
    });
    dir.then((dif) => {
      event.reply('ipc', dif);
    });
  });
}
