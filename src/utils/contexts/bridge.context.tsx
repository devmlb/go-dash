import { createContext, useEffect, useState, type JSX } from "react";

type BridgeContextValue = {
    ready: boolean;
};

const BridgeContext = createContext<BridgeContextValue | undefined>(undefined);

function BridgeProvider({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const handler = (): void => {
            setReady(true);
        };

        if (import.meta.env.VITE_UI_ONLY === "true") {
            setReady(true);
        } else {
            window.addEventListener("pywebviewready", handler);
        }

        return (): void => {
            window.removeEventListener("pywebviewready", handler);
        };
    }, []);

    return (
        <BridgeContext.Provider value={{ ready }}>
            {children}
        </BridgeContext.Provider>
    );
}

export { BridgeContext, BridgeProvider };
