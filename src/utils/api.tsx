import type { Organ } from "./types/api.types";

async function openConfig(): Promise<void> {
    if (import.meta.env.VITE_UI_ONLY !== "true") {
        await window.pywebview.api.open_config();
    }
}

async function getOrgansList(): Promise<Organ[]> {
    console.log("ok")
    if (import.meta.env.VITE_UI_ONLY === "true") {
        const data = [];
        for (let i = 0; i < 20; i++) {
            data.push({
                id: `organ-${i.toString()}`,
                name: "NDTJ",
                creator: "Debierre",
                date: 1850,
            });
        }
        return data;
    } else {
        return await window.pywebview.api.get_all_organs();
    }
}

export { openConfig, getOrgansList };
