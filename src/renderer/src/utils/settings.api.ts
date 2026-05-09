import type { Setting, SettingValue } from "./types/api.type";

async function getAllSettings(): Promise<Setting[]> {
    return await window.api.getAllSettings();
}

async function getSettingValue<T extends SettingValue>(
    name: string,
): Promise<T> {
    return await window.api.getSettingValueByName(name);
}

async function setSettingValue(
    name: string,
    value: SettingValue,
): Promise<void> {
    return await window.api.setSettingValueByName(name, value);
}

async function getAppVersion(): Promise<string> {
    return await window.api.getAppVersion();
}

export { getAllSettings, getSettingValue, setSettingValue, getAppVersion };
