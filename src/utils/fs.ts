import {
    readTextFile,
    readFile,
    writeTextFile,
    exists,
} from "@tauri-apps/plugin-fs";
import { bytesToBase64 } from "./base64";

// function copyFileToAppData(
//     path: string,
//     newFileName: string,
//     subdir: string,
// ): string {
//     const targetPath = join(app.getPath("userData"), subdir, newFileName);
//     copyFileSync(path, targetPath);

//     return targetPath;
// }

class FileNotFoundError extends Error {}

async function getFileContent(path: string): Promise<string> {
    if (!(await exists(path))) throw new FileNotFoundError();

    return await readTextFile(path);
}

async function getRawFileContent(
    path: string,
): Promise<Uint8Array<ArrayBuffer>> {
    if (!(await exists(path))) throw new FileNotFoundError();

    return await readFile(path);
}

async function getFileContentB64(path: string): Promise<string> {
    return bytesToBase64(await getRawFileContent(path));
}

async function saveToFile(content: string, path: string): Promise<void> {
    await writeTextFile(path, content);
}

export {
    // copyFileToAppData,
    getFileContent,
    getRawFileContent,
    getFileContentB64,
    saveToFile,
    FileNotFoundError,
};
