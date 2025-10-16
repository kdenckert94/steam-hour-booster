const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('steamAPI', {
  startQrLogin: () => ipcRenderer.invoke('start-qr-login'),
  startPasswordLogin: (credentials) => ipcRenderer.invoke('start-password-login', credentials),
  tryAutoLoginWithToken: () => ipcRenderer.invoke('login-with-token'),
  startIdling: (games) => ipcRenderer.invoke('start-idling', games),
  stopIdling: (games) => ipcRenderer.invoke('stop-idling', games),
  logout: (games) => ipcRenderer.invoke('logout', games),
  onPlayingState: (callback) => {
    ipcRenderer.on('steam-playing-state', (_, data) => callback(data));
  }
});