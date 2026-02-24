import { execSync } from "node:child_process";
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { app, dialog, FileFilter } from "electron";
import { join } from "node:path";

function openFile(path: string): void {
    execSync(`Invoke-Item ${path}`, { shell: "powershell.exe" });
}

function copyFileToAppData(
    filePath: string,
    newFileName: string,
    subdir: string,
): string {
    const targetPath = join(app.getPath("userData"), subdir, newFileName);
    copyFileSync(filePath, targetPath);

    return targetPath;
}

function getFileContent(filePath: string): string {
    return readFileSync(filePath, "utf-8");
}

function getFileContentB64(filePath: string): string {
    return readFileSync(filePath).toString("base64");
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
    copyFileToAppData,
    getFileContent,
    getFileContentB64,
    openChooseFileDialog,
    openSaveFileDialog,
    saveToFile,
};
