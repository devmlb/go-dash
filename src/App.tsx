import { useState, type JSX } from "react";

import "./App.css";
import { openConfig, reloadOrgans } from "./utils/api";
import type { Organ } from "./utils/types/api.types";
import { BridgeProvider } from "./utils/contexts/bridge.context";
import logo from "./assets/logo.ico";
import { Panel } from "./components/panel/Panel";
import { Grid } from "./components/grid/Grid";

function App(): JSX.Element {
    const [selected, setSelected] = useState<Organ | null>(null);
    const [reloadTime, setReloadTime] = useState<number>(Date.now());

    const reload = async (): Promise<void> => {
        await reloadOrgans();
        setSelected(null);
        setReloadTime(Date.now());
    };

    return (
        <BridgeProvider>
            <div className="appbar">
                <div className="branding">
                    <img className="logo" src={logo} />
                    <h1 className="title">GO Dash</h1>
                    <span className="version">
                        {import.meta.env.VITE_VERSION}
                    </span>
                </div>
                <div className="actions">
                    <button onClick={reload}>Recharger</button>
                    <button onClick={openConfig}>Éditer la config</button>
                </div>
            </div>
            <main>
                <Grid reloadTime={reloadTime} setSelectedOrgan={setSelected} />
                <Panel selectedOrgan={selected} />
            </main>
        </BridgeProvider>
    );
}

export default App;
