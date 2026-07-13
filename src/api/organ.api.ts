import { LazyStore } from "@tauri-apps/plugin-store";
import { openPath as openFile } from "@tauri-apps/plugin-opener";
import {
    open as openChooseFileDialog,
    save as openSaveFileDialog,
} from "@tauri-apps/plugin-dialog";

import { i18n } from "../utils/i18n";
import type { Organ } from "../utils/types/organ.type";

import { getFileContentB64, saveToFile, getFileContent } from "../utils/fs";

class OrganNotFoundError extends Error {}

class OrganApi {
    store: LazyStore;

    constructor() {
        this.store = new LazyStore("organs.json");
    }

    async exists(id: string): Promise<boolean> {
        return await this.store.has(id);
    }

    async getById(id: string): Promise<Organ> {
        const organ = await this.store.get<Omit<Organ, "id">>(id);
        if (!organ) throw new OrganNotFoundError();

        return {
            id,
            name: organ.name,
            country: organ.country,
            year: organ.year !== null ? organ.year : undefined,
            builder: organ.builder !== null ? organ.builder : undefined,
            url: organ.url !== null ? organ.url : undefined,
            features: organ.features !== null ? organ.features : undefined,
            stops: organ.stops !== null ? organ.stops : undefined,
            keyboards: organ.keyboards !== null ? organ.keyboards : undefined,
            path: organ.path,
            coverPath: organ.coverPath !== null ? organ.coverPath : undefined,
            previewPath:
                organ.previewPath !== null ? organ.previewPath : undefined,
        };
    }

    async getAll(): Promise<Organ[]> {
        const organs: Organ[] = [];
        for (const organId of await this.store.keys()) {
            organs.push(await this.getById(organId));
        }

        return organs;
    }

    async add(organ: Omit<Organ, "id">): Promise<string> {
        const id =
            Date.now().toString() +
            (Math.floor(Math.random() * (1000 - 0 + 1)) + 0)
                .toString()
                .padStart(4, "0");
        await this.store.set(id, organ);

        return id;
    }

    async update(id: string, organ: Partial<Omit<Organ, "id">>): Promise<void> {
        // this.getById will throw an error if the id is not found
        const existingOrgan = await this.getById(id);

        await this.store.set(id, { ...existingOrgan, ...organ });
    }

    async remove(id: string): Promise<void> {
        if (!this.exists(id)) throw new OrganNotFoundError();

        await this.store.delete(id);
    }

    async clear(): Promise<void> {
        await this.store.clear();
    }

    async open(id: string): Promise<void> {
        // this.getById will throw an error if the id is not found
        const organ = await this.getById(id);

        await openFile(organ.path);
    }

    async chooseImage(): Promise<string | null> {
        return await openChooseFileDialog({
            filters: [
                {
                    name: i18n.t("dialog.image.filter"),
                    extensions: ["jpg", "png"],
                },
            ],
            title: i18n.t("dialog.image.title"),
        });
    }

    async chooseGOFile(): Promise<string | null> {
        return await openChooseFileDialog({
            filters: [
                {
                    name: i18n.t("dialog.organ.filter"),
                    extensions: ["orgue", "organ"],
                },
            ],
            title: i18n.t("dialog.organ.title"),
        });
    }

    async getCoverB64(id: string): Promise<string | null> {
        // this.getById will throw an error if the id is not found
        const organ = await this.getById(id);

        return organ.coverPath ? getFileContentB64(organ.coverPath) : null;
    }

    async getPreviewB64(id: string): Promise<string | null> {
        // this.getById will throw an error if the id is not found
        const organ = await this.getById(id);

        return organ.previewPath ? getFileContentB64(organ.previewPath) : null;
    }

    async exportAll(): Promise<void> {
        const organs = await this.getAll();

        const exportPath = await openSaveFileDialog({
            filters: [
                {
                    name: i18n.t("dialog.export.filter"),
                    extensions: ["json"],
                },
            ],
            title: i18n.t("dialog.export.title"),
        });
        if (exportPath) saveToFile(JSON.stringify(organs, null, 2), exportPath);
    }

    async import(): Promise<void> {
        const importPath = await openChooseFileDialog({
            filters: [
                {
                    name: i18n.t("dialog.import.filter"),
                    extensions: ["json"],
                },
            ],
            title: i18n.t("dialog.import.title"),
        });
        if (!importPath) return;

        const organs = await getFileContent(importPath);
        const parsedOrgans = JSON.parse(organs);

        if (Array.isArray(parsedOrgans)) {
            for (const parsedOrgan of parsedOrgans) {
                if (
                    !("name" in parsedOrgan) ||
                    typeof parsedOrgan.name !== "string" ||
                    !("country" in parsedOrgan) ||
                    typeof parsedOrgan.country !== "string" ||
                    !("path" in parsedOrgan) ||
                    typeof parsedOrgan.path !== "string"
                ) {
                    // Invalid organ, skip it
                    return;
                }

                await this.add({
                    name: parsedOrgan.name,
                    country: parsedOrgan.country,
                    year:
                        "year" in parsedOrgan &&
                        typeof parsedOrgan.year === "number"
                            ? parsedOrgan.year
                            : null,
                    builder:
                        "builder" in parsedOrgan &&
                        typeof parsedOrgan.builder === "string"
                            ? parsedOrgan.builder
                            : null,
                    features:
                        "features" in parsedOrgan &&
                        typeof parsedOrgan.features === "string"
                            ? parsedOrgan.features
                            : null,
                    url:
                        "url" in parsedOrgan &&
                        typeof parsedOrgan.url === "string"
                            ? parsedOrgan.url
                            : null,
                    path: parsedOrgan.path,
                    previewPath:
                        "previewPath" in parsedOrgan &&
                        typeof parsedOrgan.previewPath === "string"
                            ? parsedOrgan.previewPath
                            : null,
                    coverPath:
                        "coverPath" in parsedOrgan &&
                        typeof parsedOrgan.coverPath === "string"
                            ? parsedOrgan.coverPath
                            : null,
                    stops:
                        "stops" in parsedOrgan &&
                        typeof parsedOrgan.stops === "number"
                            ? parsedOrgan.stops
                            : null,
                    keyboards:
                        "keyboards" in parsedOrgan &&
                        typeof parsedOrgan.keyboards === "number"
                            ? parsedOrgan.keyboards
                            : null,
                });
            }
        }
    }
}

const organApi = new OrganApi();

export { organApi, type Organ };
