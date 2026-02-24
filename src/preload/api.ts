import { ipcRenderer } from "electron";

import { Organ } from "../main/services/organ.service";

// Custom APIs for renderer
const api = {
    getAllOrgans: () => ipcRenderer.invoke("getAllOrgans"),
    getFullOrgan: (id: string) => ipcRenderer.invoke("getFullOrgan", id),
    openOrgan: (id: string) => ipcRenderer.invoke("openOrgan", id),
    removeOrgan: (id: string) => ipcRenderer.invoke("removeOrgan", id),
    removeAllOrgans: () => ipcRenderer.invoke("removeAllOrgans"),
    updateOrgan: (organ: Organ) => ipcRenderer.invoke("updateOrgan", organ),
    addOrgan: (organInfos: Omit<Organ, "_id">) =>
        ipcRenderer.invoke("addOrgan", organInfos),
    getOrganCover: (id: string) => ipcRenderer.invoke("getOrganCover", id),
    getOrganPreview: (id: string) => ipcRenderer.invoke("getOrganPreview", id),
    chooseOrganImage: () => ipcRenderer.invoke("chooseOrganImage"),
    chooseOrganFile: () => ipcRenderer.invoke("chooseOrganFile"),
    getAppVersion: () => ipcRenderer.invoke("getAppVersion"),
    exportAllOrgans: () => ipcRenderer.invoke("exportAllOrgans"),
    importOrgans: () => ipcRenderer.invoke("importOrgans"),
};

export { api };
