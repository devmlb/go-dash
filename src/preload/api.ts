import { ipcRenderer } from "electron";

import { Organ } from "../main/services/organ.service";

// Custom APIs for renderer
const api = {
    getAllOrgans: () => ipcRenderer.invoke("getAllOrgans"),
    getFullOrgan: (id: string) => ipcRenderer.invoke("getFullOrgan", id),
    openOrgan: (id: string) => ipcRenderer.invoke("openOrgan", id),
    updateOrgan: (organ: Organ) => ipcRenderer.invoke("updateOrgan", organ),
    getOrganCover: (id: string) => ipcRenderer.invoke("getOrganCover", id),
    getOrganPreview: (id: string) => ipcRenderer.invoke("getOrganPreview", id),
};

export { api };
