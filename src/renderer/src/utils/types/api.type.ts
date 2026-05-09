interface MinimalOrgan {
    _id: string;
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

type SettingValue = string | boolean;

interface Setting {
    _id?: string;
    name: string;
    value: SettingValue;
}

export type { Organ, MinimalOrgan, SettingValue, Setting };
