import { app, BrowserWindow, dialog, shell, Menu } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as http from 'http';

const BACKEND_PORT = parseInt(process.env.PORT || '8000', 10);
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`;

let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcess | null = null;

/** Find the backend binary or Python interpreter to run. */
function resolveBackendCommand(): { cmd: string; args: string[]; cwd: string } {
  if (app.isPackaged) {
    const ext = process.platform === 'win32' ? '.exe' : '';
    const binaryDir = path.join(
      process.resourcesPath,
      'backend',
      'vedic-astro-backend'
    );
    const binaryPath = path.join(binaryDir, `vedic-astro-backend${ext}`);
    return { cmd: binaryPath, args: [], cwd: binaryDir };
  }
  // Development mode: run server.py with Python
  const backendDir = path.join(__dirname, '..', '..', 'backend');
  const python = process.platform === 'win32' ? 'python' : 'python3';
  return { cmd: python, args: ['server.py'], cwd: backendDir };
}

function startBackend(): Promise<void> {
  return new Promise((resolve, reject) => {
    const { cmd, args, cwd } = resolveBackendCommand();

    backendProcess = spawn(cmd, args, {
      cwd,
      stdio: 'pipe',
      env: { ...process.env, PORT: String(BACKEND_PORT) },
      detached: false,
    });

    backendProcess.on('error', (err) => {
      reject(new Error(`Backend process error: ${err.message}`));
    });

    backendProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.error(
          `Backend exited with code ${code}. ` +
          'Check that Python dependencies are installed (pip install -r backend/requirements.txt) ' +
          'and that port 8000 is not already in use.'
        );
      }
    });

    pollBackend(resolve, reject, 0);
  });
}

function pollBackend(
  resolve: () => void,
  reject: (err: Error) => void,
  attempts: number
): void {
  const MAX_POLL_ATTEMPTS = 60; // one attempt per second, up to 60 s
  if (attempts >= MAX_POLL_ATTEMPTS) {
    reject(new Error('Backend failed to start within 60 seconds.'));
    return;
  }

  http
    .get(`${BACKEND_URL}/api/health`, (res) => {
      if (res.statusCode === 200) {
        resolve();
      } else {
        setTimeout(() => pollBackend(resolve, reject, attempts + 1), 1000);
      }
    })
    .on('error', () => {
      setTimeout(() => pollBackend(resolve, reject, attempts + 1), 1000);
    });
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 800,
    minHeight: 600,
    title: '🔱 Vedic Astro',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(BACKEND_URL);

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open external links in the system browser, not Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [{ role: 'quit' }],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}

app.whenReady().then(async () => {
  try {
    await startBackend();
    createWindow();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    dialog.showErrorBox(
      'Startup Error',
      `Failed to start the Vedic Astro backend:\n\n${msg}`
    );
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
});
