import { app } from "electron";
import { join } from "node:path";
import Datastore from "@seald-io/nedb";

type SettingValue = string | boolean;

interface Setting {
    _id?: string;
    name: string;
    value: SettingValue;
}

const DEFAULT_SETTINGS: Setting[] = [
    { name: "sort-field", value: "name" },
    { name: "ascendant-sort", value: true },
];

class SettingsService {
    db!: Datastore<Setting>;
    initialized: boolean;

    constructor() {
        this.initialized = false;
        this.db = new Datastore<Setting>({
            filename: join(app.getPath("userData"), "settings"),
            autoload: true,
        });
        (async () => {
            try {
                await this.db.autoloadPromise;

                for (const setting of DEFAULT_SETTINGS) {
                    if (!(await this.db.findOneAsync({ name: setting.name }))) {
                        await this.db.insertAsync(setting);
                    }
                }
            } catch {
                throw new Error("Cannot load the Settings DB");
            }
        })();
    }

    async getAll(): Promise<Omit<Setting, "_id">[]> {
        const settingDocs = await this.db.findAsync({});

        return settingDocs.map((doc) => ({
            name: doc.name,
            value: doc.value,
        }));
    }

    async getValueByName(name: string): Promise<SettingValue> {
        const settingDoc = await this.db.findOneAsync({ name });

        if (settingDoc) {
            return settingDoc.value;
        } else {
            throw new Error("Unknown setting");
        }
    }

    async setValueByName(name: string, value: SettingValue): Promise<void> {
        const settingDoc = await this.db.findOneAsync({ name });

        if (settingDoc) {
            if (typeof value === typeof settingDoc.value) {
                await this.db.updateAsync({ name }, { name, value });
            } else {
                throw new Error(
                    "Cannot set a new setting value with a different type",
                );
            }
        } else {
            throw new Error("Unknown setting");
        }
    }
}

const settingsService = new SettingsService();

export { settingsService, type Setting, type SettingValue };
