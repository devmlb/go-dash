import type { MinimalOrgan } from "./types/api.type";

// async function openConfig(): Promise<void> {
//     if (import.meta.env.VITE_UI_ONLY !== "true") {
//         await window.pywebview.api.open_config();
//     }
// }

async function getOrgansList(): Promise<MinimalOrgan[]> {
    return await window.api.getAllOrgans();
}

async function getCover(organId: string): Promise<string> {
    return `data:image;base64,${await window.api.getOrganCover(organId)}`;
}

async function getPreview(organId: string): Promise<string> {
    return `data:image;base64,${await window.api.getOrganPreview(organId)}`;
}

// async function reloadOrgans(): Promise<void> {
//     if (import.meta.env.VITE_UI_ONLY !== "true") {
//         await window.pywebview.api.reload_organs_list();
//     }
// }

async function openOrgan(organId: string): Promise<void> {
    await window.api.openOrgan(organId);
}

export {
    // openConfig,
    getOrgansList,
    getCover,
    getPreview,
    // reloadOrgans,
    openOrgan,
};
