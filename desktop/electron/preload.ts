// Preload script — runs in the renderer process before page scripts.
// contextIsolation is enabled; expose only what the renderer needs via
// contextBridge.  No Node integration is required for this app.
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
});
