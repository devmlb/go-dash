import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dialog, FileFilter } from "electron";
import { openPath } from '@tauri-apps/plugin-opener';

async function openFile(path: string): Promise<void> {
    await openPath(path)
}

// function copyFileToAppData(
//     filePath: string,
//     newFileName: string,
//     subdir: string,
// ): string {
//     const targetPath = join(app.getPath("userData"), subdir, newFileName);
//     copyFileSync(filePath, targetPath);

//     return targetPath;
// }

function getFileContent(filePath: string): string {
    return readFileSync(filePath, "utf-8");
}

function getFileContentB64(filePath: string): string | null {
    if (!existsSync(filePath)) {
        return null;
    }

    try {
        return readFileSync(filePath).toString("base64");
    } catch {
        return null;
    }
}

function openChooseFileDialog(
    window: Electron.BaseWindow,
    title: string,
    fileTypes: FileFilter[],
): string | null {
    const path = dialog.showOpenDialogSync(window, {
        title: title,
        filters: fileTypes,
        properties: ["openFile", "multiSelections"],
    });
    return path ? path[0] : null;
}

function openSaveFileDialog(
    window: Electron.BaseWindow,
    title: string,
    fileTypes: FileFilter[],
): string | null {
    const path = dialog.showSaveDialogSync(window, {
        title: title,
        filters: fileTypes,
    });
    return path ? path : null;
}

function saveToFile(content: string, path: string): void {
    writeFileSync(path, content);
}

export {
    openFile,
    // copyFileToAppData,
    getFileContent,
    getFileContentB64,
    openChooseFileDialog,
    openSaveFileDialog,
    saveToFile,
};
