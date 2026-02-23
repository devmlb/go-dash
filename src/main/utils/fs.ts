import { execSync } from "node:child_process";
import { copyFileSync, readFileSync } from "node:fs";
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

function getFileContentB64(filePath: string): string {
    return readFileSync(filePath).toString("base64");
}

function openChooseFileDialog(
    window: Electron.BaseWindow,
    title: string,
    fileTypes: FileFilter[],
): string | null {
    const result = dialog.showOpenDialogSync(window, {
        title: title,
        filters: fileTypes,
        properties: ["openFile", "multiSelections"],
    });

    return result ? result[0] : null;
}

export { openFile, copyFileToAppData, getFileContentB64, openChooseFileDialog };
