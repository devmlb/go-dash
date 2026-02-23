import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
// import icon from "../../resources/icon.png?asset";

import { organService } from "./services/organ.service";
import { updaterService } from "./services/updater.service";
import type { Organ } from "./services/organ.service";

function createWindow(): BrowserWindow {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        autoHideMenuBar: true,
        // ...(process.platform === "linux" ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, "../preload/index.js"),
            sandbox: false,
        },
    });

    mainWindow.on("ready-to-show", () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: "deny" };
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
        mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
        mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
    }

    return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId("com.electron");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    const window = createWindow();

    if (!is.dev) {
        updaterService.init();
        setTimeout(() => updaterService.checkForUpdates(), 3000);
    }

    ipcMain.handle("getAllOrgans", () => organService.getAll());
    ipcMain.handle("getFullOrgan", (_event, id: string) =>
        organService.getById(id),
    );
    ipcMain.handle("openOrgan", (_event, id: string) => organService.open(id));
    ipcMain.handle("updateOrgan", (_event, organ: Organ) =>
        organService.update(organ),
    );
    ipcMain.handle("addOrgan", (_event, organInfos: Omit<Organ, "_id">) =>
        organService.add(organInfos),
    );
    ipcMain.handle("removeOrgan", (_event, id: string) =>
        organService.remove(id),
    );
    ipcMain.handle("getOrganCover", (_event, id: string) =>
        organService.getCoverB64(id),
    );
    ipcMain.handle("getOrganPreview", (_event, id: string) =>
        organService.getPreviewB64(id),
    );
    ipcMain.handle("chooseOrganImage", () => organService.chooseImage(window));
    ipcMain.handle("chooseOrganFile", () => organService.chooseGOFile(window));
    ipcMain.handle("getAppVersion", () => app.getVersion());

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
