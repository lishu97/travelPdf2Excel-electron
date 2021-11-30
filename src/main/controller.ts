import { BrowserWindow, ipcMain, dialog } from 'electron';

const travelPdfToExcel = require('travel-pdf-to-excel');

export type action = {
  name: string;
  payload: unknown;
};

type exportExcelPayload = {
  id: string;
  name: string;
  outputPath: string;
  filePaths: Array<string>;
};

type travelPdfToExcelRes = { status: string; message: unknown };

export default function controller(mainWindow: BrowserWindow | null) {
  ipcMain.on('ipc', async (event, arg: action) => {
    console.log('nodejs收到:', arg);
    switch (arg.name) {
      case 'openChooseDirModal':
        const dir = dialog.showOpenDialog(mainWindow!, {
          properties: ['openDirectory'],
        });
        dir.then((dif) => {
          event.reply('ipc', {
            name: 'changeDir',
            payload: dif?.filePaths?.[0],
          });
        });
        break;
      case 'exportExcel':
        const { outputPath, id, name, filePaths } =
          arg.payload as exportExcelPayload;
        travelPdfToExcel(id, name, filePaths, outputPath).then(
          (res: travelPdfToExcelRes) => {
            event.reply('ipc', {
              name: 'exportEnd',
              payload: res.status,
            });
          }
        );
        break;
      default:
        break;
    }
  });
}
