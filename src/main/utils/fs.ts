import { execSync } from "node:child_process";
import { copyFileSync, readFileSync } from "node:fs";
import { app } from "electron";
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

export { openFile, copyFileToAppData, getFileContentB64 };
