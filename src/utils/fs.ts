import { readTextFile, writeTextFile, exists } from "@tauri-apps/plugin-fs";
import { utf8StringToBase64 } from "./base64";

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

async function getFileContentB64(path: string): Promise<string> {
    return utf8StringToBase64(await getFileContent(path));
}

async function saveToFile(content: string, path: string): Promise<void> {
    if (!(await exists(path))) throw new FileNotFoundError();

    await writeTextFile(path, content);
}

export {
    // copyFileToAppData,
    getFileContent,
    getFileContentB64,
    saveToFile,
    FileNotFoundError,
};
