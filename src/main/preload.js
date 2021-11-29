const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send(arg) {
      ipcRenderer.send('ipc', arg);
    },
    on(channel, func) {
      if (channel === 'ipc') {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
  },
});
