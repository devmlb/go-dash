interface MinimalOrgan {
    id: string;
    name: string;
    country: string;
    year?: number;
    builder?: string;
    url?: string;
    features?: string;
    stops?: number;
    keyboards?: number;
}

interface Organ extends MinimalOrgan {
    path: string;
    coverPath?: string;
    previewPath?: string;
}

export type { MinimalOrgan, Organ };
