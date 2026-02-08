import { useContext } from "react";

import { BridgeContext } from "../contexts/bridge.context";

function useBridgeReady(): boolean {
    const context = useContext(BridgeContext);

    if (!context) {
        throw new Error("useBridgeStatus must be used inside a BridgeProvider");
    }

    return context.ready;
}

export { useBridgeReady };
