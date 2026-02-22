import { ipcRenderer } from "electron";

// Custom APIs for renderer
const api = {
    getAllOrgans: () => ipcRenderer.invoke("getAllOrgans"),
    getOrgan: (id: string) => ipcRenderer.invoke("getOrgan", id),
    openOrgan: (id: string) => ipcRenderer.invoke("openOrgan", id),
    getOrganCover: (id: string) => ipcRenderer.invoke("getOrganCover", id),
    getOrganPreview: (id: string) => ipcRenderer.invoke("getOrganPreview", id),
};

export { api };
