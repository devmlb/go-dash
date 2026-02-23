import { app } from "electron";
import { join } from "node:path";
import Datastore from "@seald-io/nedb";

import { getFileContentB64, openFile } from "../utils/fs";

interface MinimalOrgan {
    _id?: string;
    name: string;
    country: string;
    year: number;
    builder: string;
    url: string;
    features: string;
}

interface Organ extends MinimalOrgan {
    path: string;
    coverPath: string;
    previewPath: string;
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

    // add(
    //     name: string,
    //     country: string,
    //     year: number,
    //     builder: string,
    //     coverPath: string,
    //     previewPath: string,
    // ) {
    //     await db.updateAsync(
    //         { planet: "Pluton" },
    //         {
    //             planet: "Pluton",
    //             inhabited: false,
    //         },
    //         { upsert: true },
    //     );
    // }

    async update(organ: Organ): Promise<void> {
        await this.db.updateAsync({ _id: organ._id }, organ);
    }

    async open(id: string): Promise<void> {
        openFile((await this.getById(id)).path);
    }

    async getCoverB64(id: string): Promise<string> {
        return getFileContentB64((await this.getById(id)).coverPath);
    }

    async getPreviewB64(id: string): Promise<string> {
        return getFileContentB64((await this.getById(id)).previewPath);
    }
}

const organService = new OrganService();

export { organService, type Organ };
