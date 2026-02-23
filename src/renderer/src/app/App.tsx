import { useReducer, useState, type JSX } from "react";

import "./App.css";
// import { openConfig, reloadOrgans } from "./utils/api";
import type { MinimalOrgan } from "../utils/types/api.type";
import logo from "../assets/logo.ico";
import { Panel } from "./panel/Panel";
import { Grid } from "./grid/Grid";
import { EditModal } from "./modals/EditModal";

function App(): JSX.Element {
    const [selectedOrganId, setSelectedOrganId] = useState<string | null>(null);
    const [organs, setOrgans] = useState<MinimalOrgan[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [reloadCount, triggerReload] = useReducer(
        (count: number) => count + 1,
        0,
    );

    const selected = selectedOrganId
        ? (organs.find((organ) => organ._id === selectedOrganId) ?? null)
        : null;

    const reload = (): void => {
        triggerReload();
    };

    const closeModal = (): void => setIsAddModalOpen(false);
    const openModal = (): void => setIsAddModalOpen(true);

    const handleOrgansLoaded = (nextOrgans: MinimalOrgan[]): void => {
        setOrgans(nextOrgans);

        if (
            selectedOrganId &&
            !nextOrgans.some((organ) => organ._id === selectedOrganId)
        ) {
            setSelectedOrganId(null);
        }
    };

    return (
        <>
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
                    <button onClick={openModal}>Ajouter un orgue</button>
                    <EditModal isOpen={isAddModalOpen} close={closeModal} />
                </div>
            </div>
            <main>
                <Grid
                    reloadCount={reloadCount}
                    onSelectOrgan={(organ) => setSelectedOrganId(organ._id)}
                    onOrgansLoaded={handleOrgansLoaded}
                />
                <Panel selectedOrgan={selected} reload={reload} />
            </main>
            {/* <Modal /> */}
        </>
    );
}

export default App;
