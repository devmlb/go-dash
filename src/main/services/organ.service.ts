import { app, BrowserWindow } from "electron";
import { join } from "node:path";
import Datastore from "@seald-io/nedb";

import { getFileContentB64, openChooseFileDialog, openFile } from "../utils/fs";

interface MinimalOrgan {
    _id?: string;
    name: string;
    country: string;
    year: number | null;
    builder: string | null;
    url: string | null;
    features: string | null;
}

interface Organ extends MinimalOrgan {
    path: string;
    coverPath: string | null;
    previewPath: string | null;
}

class OrganService {
    db: Datastore<Organ>;

    constructor() {
        this.db = new Datastore<Organ>({
            filename: join(app.getPath("userData"), "organs"),
            autoload: true,
        });
    }

    async getAll(): Promise<MinimalOrgan[]> {
        await this.db.autoloadPromise;
        const organDocs = await this.db.findAsync({});

        return organDocs.map((doc) => ({
            _id: doc._id,
            name: doc.name,
            country: doc.country,
            year: doc.year,
            builder: doc.builder,
            url: doc.url,
            features: doc.features,
        }));
    }

    async getById(id: string): Promise<Organ> {
        await this.db.autoloadPromise;
        const organDoc = await this.db.findOneAsync({ _id: id });

        if (organDoc) {
            return organDoc;
        } else {
            throw new Error("Unknown organ");
        }
    }

    async add(organInfos: Omit<Organ, "_id">): Promise<void> {
        await this.db.insertAsync(organInfos);
    }

    async update(organ: Organ): Promise<void> {
        await this.db.updateAsync({ _id: organ._id }, organ);
    }

    async remove(organId: string): Promise<void> {
        await this.db.removeAsync({ _id: organId }, {});
    }

    async open(id: string): Promise<void> {
        openFile((await this.getById(id)).path);
    }

    chooseImage(window: BrowserWindow): null | string {
        return openChooseFileDialog(
            window,
            "Sélectionner une image pour l'orgue",
            [
                {
                    name: "Images",
                    extensions: ["jpg", "png"],
                },
            ],
        );
    }

    chooseGOFile(window: BrowserWindow): null | string {
        return openChooseFileDialog(window, "Sélectionner un fichier d'orgue", [
            {
                name: "Fichier Grand Orgue",
                extensions: ["orgue", "organ"],
            },
        ]);
    }

    async getCoverB64(id: string): Promise<string | null> {
        const organ = await this.getById(id);
        return organ.coverPath ? getFileContentB64(organ.coverPath) : null;
    }

    async getPreviewB64(id: string): Promise<string | null> {
        const organ = await this.getById(id);
        return organ.previewPath ? getFileContentB64(organ.previewPath) : null;
    }
}

const organService = new OrganService();

export { organService, type Organ };
