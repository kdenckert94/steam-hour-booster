const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const {LoginSession, EAuthTokenPlatformType} = require('steam-session');
const SteamUser = require('steam-user');
const fs = require('fs');

let mainWindow;
const loginSessions = {}; // Store sessions by username

const client = new SteamUser({
  autoRelogin: true,
  dataDirectory: './data',
  renewRefreshTokens: true
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  // mainWindow.webContents.openDevTools(); // comment in for debugging
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// auto login from token
ipcMain.handle('login-with-token', async (event, credentials) => {
  let savedToken = null;
  if (fs.existsSync('refresh-token.json')) {
    const json = fs.readFileSync('refresh-token.json', 'utf-8');
    savedToken = JSON.parse(json).token;
  }

  return new Promise(async (resolve) => {
    if(savedToken != null && savedToken !== "") {
      client.logOn({
        refreshToken: savedToken,
        machineName: 'SteamHourBooster',
        rememberPassword: true
      })

      client.on('refreshToken', async function (token) {
        fs.writeFileSync('refresh-token.json', JSON.stringify({ token: token }));
      })

      client.on('loggedOn', async function (details) {

        const gameList = await client.getUserOwnedApps(client.steamID.getSteamID64(), {includePlayedFreeGames: true})

        resolve({
          status: 'success',
          games: JSON.stringify(gameList)
        });
      });
    } else {
      resolve({
        status: 'failed'
      });
    }

    client.on('playingState', (blocked, playingApp) => {
      // Forward event to renderer
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('steam-playing-state', {
          blocked,
          playingApp
        });
      }
    });

    client.on('error', async function () {
      resolve({
        status: 'failed'
      });
    })
  })
})

// username/password login
ipcMain.handle('start-password-login', async (event, credentials) => {
  const session = new LoginSession(EAuthTokenPlatformType.SteamClient);
  session.loginTimeout = 10000;
  loginSessions[credentials.username] = session;

  return new Promise(async (resolve) => {
    client.logOn({
      accountName: credentials.username,
      password: credentials.password,
      machineName: 'SteamHourBooster',
      rememberPassword: true,
      twoFactorCode: credentials.twoFactor ?? null
    })

    client.on('loggedOn', async function () {

      const gameList = await client.getUserOwnedApps(client.steamID.getSteamID64())

      resolve({
        status: 'success',
        games: JSON.stringify(gameList)
      });
    });

    client.on('refreshToken', async function (token) {
      fs.writeFileSync('refresh-token.json', JSON.stringify({ token: token }));
    })

    client.on('steamGuard', function (domain, callback) {
    	resolve({
        status: '2fa_required'
      });
    });

    client.on('playingState', (blocked, playingApp) => {
      // Forward event to renderer
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('steam-playing-state', {
          blocked,
          playingApp
        });
      }
    });

    try {
      const result = await session.startWithCredentials({
        accountName: credentials.username,
        password: credentials.password,
        steamGuardCode: credentials.twoFactor ?? ''
      });

      if (result.actionRequired) {
        resolve({status: '2fa_required'});
      }
    } catch (err) {
      resolve({ status: 'error', message: err.message });
    }
  });
});

// set games played
ipcMain.handle('start-idling', async (event, games) => {
  client.setPersona(SteamUser.EPersonaState.Online); // maybe make it customizable
  client.gamesPlayed(games, true); // true to force other clients to disconnect
})

// stop games played
ipcMain.handle('stop-idling', async (event, games) => {
  client.setPersona(SteamUser.EPersonaState.Snooze); // maybe make it customizable
  client.gamesPlayed([], true); // true to force other clients to disconnect
})

// logout
ipcMain.handle('logout', async (event, games) => {
  client.setPersona(SteamUser.EPersonaState.Offline); // maybe make it customizable
  client.gamesPlayed([], true); // true to force other clients to disconnect
  client.logOff();

  return new Promise(async (resolve) => {
    resolve({ status: 'success'});
  })
})