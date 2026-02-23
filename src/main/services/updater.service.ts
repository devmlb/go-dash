import { BrowserWindow, dialog } from "electron";
import { autoUpdater } from "electron-updater";

class UpdaterService {
    private initialized = false;

    init(): void {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        autoUpdater.autoDownload = true;
        autoUpdater.autoInstallOnAppQuit = true;

        autoUpdater.on("error", (error) => {
            console.error("[updater] update error:", error);
        });

        autoUpdater.on("checking-for-update", () => {
            console.info("[updater] checking for updates...");
        });

        autoUpdater.on("update-available", (info) => {
            console.info("[updater] update available:", info.version);
        });

        autoUpdater.on("update-not-available", () => {
            console.info("[updater] no update available");
        });

        autoUpdater.on("update-downloaded", async (info) => {
            console.info("[updater] update downloaded:", info.version);

            const focusedWindow = BrowserWindow.getFocusedWindow();
            const messageOptions = {
                type: "info" as const,
                buttons: ["Redémarrer maintenant", "Plus tard"],
                defaultId: 0,
                cancelId: 1,
                title: "Mise à jour prête",
                message:
                    "Une nouvelle version a été téléchargée. Redémarrer l'application pour l'installer ?",
            };
            const { response } = focusedWindow
                ? await dialog.showMessageBox(focusedWindow, messageOptions)
                : await dialog.showMessageBox(messageOptions);

            if (response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    }

    checkForUpdates(): void {
        autoUpdater.checkForUpdatesAndNotify().catch((error) => {
            console.error("[updater] check failed:", error);
        });
    }
}

export const updaterService = new UpdaterService();
