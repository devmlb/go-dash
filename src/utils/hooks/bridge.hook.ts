import { useState, useEffect } from "react";

function useBridge(): boolean {
    const [pywebviewReady, setPywebviewReady] = useState<boolean>(false);

    useEffect(() => {
        const handler = (): void => {
            setPywebviewReady(true);
        };

        if (import.meta.env.VITE_UI_ONLY === "true") {
            setPywebviewReady(true);
        } else {
            window.addEventListener("pywebviewready", handler);
        }

        return (): void => {
            window.removeEventListener("pywebviewready", handler);
        };
    }, []);

    return pywebviewReady;
}

export { useBridge };
