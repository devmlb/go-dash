import { ipcRenderer } from "electron";

import { Organ } from "../main/services/organ.service";
import { SettingValue } from "../main/services/settings.service";

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
    exportAllOrgans: () => ipcRenderer.invoke("exportAllOrgans"),
    importOrgans: () => ipcRenderer.invoke("importOrgans"),

    getAllSettings: () => ipcRenderer.invoke("getAllSettings"),
    getSettingValueByName: (name: string) =>
        ipcRenderer.invoke("getSettingValueByName", name),
    setSettingValueByName: (name: string, value: SettingValue) =>
        ipcRenderer.invoke("setSettingValueByName", name, value),

    getAppVersion: () => ipcRenderer.invoke("getAppVersion"),
};

export { api };
