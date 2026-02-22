interface MinimalOrgan {
    _id: string;
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

export type { Organ, MinimalOrgan };
