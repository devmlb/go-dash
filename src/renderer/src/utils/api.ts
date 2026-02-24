import type { MinimalOrgan, Organ } from "./types/api.type";

async function getOrgansList(): Promise<MinimalOrgan[]> {
    return await window.api.getAllOrgans();
}

async function getFullOrgan(id: string): Promise<Organ> {
    return await window.api.getFullOrgan(id);
}

async function getCover(organId: string): Promise<string | null> {
    const cover = await window.api.getOrganCover(organId);
    return cover ? `data:image;base64,${cover}` : null;
}

async function getPreview(organId: string): Promise<string | null> {
    const preview = await window.api.getOrganPreview(organId);
    return preview ? `data:image;base64,${preview}` : null;
}

async function openOrgan(organId: string): Promise<void> {
    await window.api.openOrgan(organId);
}

async function removeOrgan(organId: string): Promise<void> {
    await window.api.removeOrgan(organId);
}

async function updateOrgan(organ: Organ): Promise<void> {
    await window.api.updateOrgan(organ);
}

async function addOrgan(organInfos: Omit<Organ, "_id">): Promise<void> {
    await window.api.addOrgan(organInfos);
}

async function chooseOrganFile(): Promise<string | null> {
    return await window.api.chooseOrganFile();
}

async function chooseOrganImage(): Promise<string | null> {
    return await window.api.chooseOrganImage();
}

async function getAppVersion(): Promise<string> {
    return await window.api.getAppVersion();
}

async function exportAllOrgans(): Promise<string> {
    return await window.api.exportAllOrgans();
}

async function importOrgans(): Promise<string> {
    return await window.api.importOrgans();
}

export {
    getOrgansList,
    getCover,
    getPreview,
    openOrgan,
    getFullOrgan,
    updateOrgan,
    addOrgan,
    removeOrgan,
    chooseOrganImage,
    chooseOrganFile,
    getAppVersion,
    exportAllOrgans,
    importOrgans,
};
