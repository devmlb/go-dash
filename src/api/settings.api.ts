import { LazyStore } from "@tauri-apps/plugin-store";

import { defaultSettings, Settings } from "../utils/types/settings.type";

class SettingNotFoundError extends Error {}

class SettingTypeMismatchError extends Error {}

class SettingsApi {
    store: LazyStore;

    constructor() {
        this.store = new LazyStore("settings.json", {
            defaults: defaultSettings,
        });
    }

    async getValue<T extends keyof Settings>(name: T): Promise<Settings[T]> {
        const value = await this.store.get<Settings[T]>(name);

        if (value !== undefined) {
            return value;
        } else {
            throw new SettingNotFoundError();
        }
    }

    async getAll(): Promise<Settings> {
        const settings = structuredClone(defaultSettings) as Record<
            keyof Settings,
            Settings[keyof Settings]
        >;

        for (const settingName of Object.keys(
            defaultSettings,
        ) as (keyof Settings)[]) {
            settings[settingName] = await this.getValue(settingName);
        }

        return settings as Settings;
    }

    async setValue(
        name: keyof Settings,
        value: Settings[keyof Settings],
    ): Promise<void> {
        const currentSettings = await this.getValue(name);

        if (typeof value === typeof currentSettings) {
            await this.store.set(name, value);
        } else {
            throw new SettingTypeMismatchError();
        }
    }
}

const settingsApi = new SettingsApi();

export { settingsApi };
