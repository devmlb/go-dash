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
    hasPedals: boolean;
}

interface Organ extends MinimalOrgan {
    path: string;
    coverPath?: string;
    previewPath?: string;
}

export type { MinimalOrgan, Organ };
