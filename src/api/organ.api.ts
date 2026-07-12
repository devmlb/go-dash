import { LazyStore } from "@tauri-apps/plugin-store";
import { openPath as openFile } from "@tauri-apps/plugin-opener";
import { open as openChooseFileDialog } from "@tauri-apps/plugin-dialog";

import type { Organ } from "../utils/types/organ.type";

import { getFileContentB64, saveToFile, getFileContent } from "../utils/fs";

class OrganNotFoundError extends Error {}

class OrganApi {
    store: LazyStore;

    constructor() {
        this.store = new LazyStore("organs.json");

        // Auto-bind instance methods so 'this' remains correct when methods
        // are passed as callbacks
        // const proto = Object.getPrototypeOf(this);
        // for (const key of Object.getOwnPropertyNames(proto)) {
        //     if (key === "constructor") continue;
        //     const desc = Object.getOwnPropertyDescriptor(proto, key);
        //     if (!desc) continue;
        //     const value = (this as any)[key];
        //     if (typeof value === "function") {
        //         (this as any)[key] = value.bind(this);
        //     }
        // }
    }

    async exists(id: string): Promise<boolean> {
        return await this.store.has(id);
    }

    async getById(id: string): Promise<Organ> {
        const organ = await this.store.get<Organ>(id);
        if (!organ) throw new OrganNotFoundError();

        return {
            id: organ.id,
            name: organ.name,
            country: organ.country,
            year: organ.year !== null ? organ.year : undefined,
            builder: organ.builder !== null ? organ.builder : undefined,
            url: organ.url !== null ? organ.url : undefined,
            features: organ.features !== null ? organ.features : undefined,
            stops: organ.stops !== null ? organ.stops : undefined,
            keyboards: organ.keyboards !== null ? organ.keyboards : undefined,
            path: organ.path,
            coverPath: organ.coverPath,
            previewPath: organ.previewPath,
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
        const id = Date.now().toString();
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
                    name: "Images",
                    extensions: ["jpg", "png"],
                },
            ],
            title: "Sélectionner une image pour l'orgue",
        });
    }

    async chooseGOFile(): Promise<string | null> {
        return await openChooseFileDialog({
            filters: [
                {
                    name: "Fichier Grand Orgue",
                    extensions: ["orgue", "organ"],
                },
            ],
            title: "Sélectionner un fichier d'orgue",
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

    // async exportAll(window: Electron.BaseWindow): Promise<void> {
    //     const organDocs = await this.db.findAsync({});

    //     const organsExport = JSON.stringify(
    //         organDocs.map((organ) => {
    //             delete organ._id;
    //             return organ;
    //         }),
    //         null,
    //         2,
    //     );

    //     const exportPath = openSaveFileDialog(
    //         window,
    //         "Exporter tous les orgues",
    //         [
    //             {
    //                 name: "Fichier JSON",
    //                 extensions: ["json"],
    //             },
    //         ],
    //     );
    //     if (exportPath) saveToFile(organsExport, exportPath);
    // }

    // async import(window: Electron.BaseWindow): Promise<void> {
    //     const importPath = openChooseFileDialog(window, "Importer des orgues", [
    //         {
    //             name: "Fichier JSON",
    //             extensions: ["json"],
    //         },
    //     ]);
    //     if (!importPath) return;

    //     try {
    //         const organs = getFileContent(importPath);
    //         const parsedOrgans = JSON.parse(organs);

    //         if (Array.isArray(parsedOrgans)) {
    //             parsedOrgans.forEach((parsedOrgan) => {
    //                 if (
    //                     !("name" in parsedOrgan) ||
    //                     typeof parsedOrgan.name !== "string" ||
    //                     !("country" in parsedOrgan) ||
    //                     typeof parsedOrgan.country !== "string" ||
    //                     !("path" in parsedOrgan) ||
    //                     typeof parsedOrgan.path !== "string"
    //                 ) {
    //                     // Invalid organ, skip it
    //                     return;
    //                 }

    //                 this.add({
    //                     name: parsedOrgan.name,
    //                     country: parsedOrgan.country,
    //                     year:
    //                         "year" in parsedOrgan &&
    //                         typeof parsedOrgan.year === "number"
    //                             ? parsedOrgan.year
    //                             : null,
    //                     builder:
    //                         "builder" in parsedOrgan &&
    //                         typeof parsedOrgan.builder === "string"
    //                             ? parsedOrgan.builder
    //                             : null,
    //                     features:
    //                         "features" in parsedOrgan &&
    //                         typeof parsedOrgan.features === "string"
    //                             ? parsedOrgan.features
    //                             : null,
    //                     url:
    //                         "url" in parsedOrgan &&
    //                         typeof parsedOrgan.url === "string"
    //                             ? parsedOrgan.url
    //                             : null,
    //                     path: parsedOrgan.path,
    //                     previewPath:
    //                         "previewPath" in parsedOrgan &&
    //                         typeof parsedOrgan.previewPath === "string"
    //                             ? parsedOrgan.previewPath
    //                             : null,
    //                     coverPath:
    //                         "coverPath" in parsedOrgan &&
    //                         typeof parsedOrgan.coverPath === "string"
    //                             ? parsedOrgan.coverPath
    //                             : null,
    //                     stops:
    //                         "stops" in parsedOrgan &&
    //                         typeof parsedOrgan.stops === "number"
    //                             ? parsedOrgan.stops
    //                             : null,
    //                     keyboards:
    //                         "keyboards" in parsedOrgan &&
    //                         typeof parsedOrgan.keyboards === "number"
    //                             ? parsedOrgan.keyboards
    //                             : null,
    //                 });
    //             });
    //         }
    //     } catch (error) {
    //         throw new Error(`Cannot parse the provided file: ${error}`);
    //     }
    // }
}

const organApi = new OrganApi();

export { organApi, type Organ };
