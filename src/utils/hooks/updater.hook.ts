import { useEffect, useState } from "react";
import {
    check as checkForUpdates,
    type Update,
} from "@tauri-apps/plugin-updater";

function useUpdater() {
    const [status, setStatus] = useState<Update | null>(null);
    const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    const check = async (): Promise<Update | null> => {
        const result = await checkForUpdates();
        setStatus(result);
        return result;
    };

    const download = async (): Promise<void> => {
        if (!status) return;

        console.log("Downloading update...");

        try {
            await status.download();
            setIsDownloaded(true);
            console.log("Update downloaded successfully");
        } catch (e) {
            setIsDownloaded(false);
            throw e;
        }
    };

    const install = async (): Promise<void> => {
        if (status) {
            await status.install();
        }
    };

    if (status && !isDownloading) {
        setIsDownloading(true);
        console.log(`Update found: app can be upgraded to v${status.version}`);
        void download();
    }

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                setStatus(await check());
            } catch (e) {
                console.error("Error when processing update:", e);
            }
        })();
    }, []);

    return {
        updateInfos: status,
        isUpdateDownloaded: isDownloaded,
        restartAndinstallUpdate: install,
    };
}

export { useUpdater };
