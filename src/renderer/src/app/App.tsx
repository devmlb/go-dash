import { useReducer, useState, type JSX } from "react";
import { createPortal } from "react-dom";

import "./App.css";
import type { MinimalOrgan } from "../utils/types/api.type";
import logo from "../assets/logo.ico";
import { Panel } from "./panel/Panel";
import { Grid } from "./grid/Grid";
import { EditModal } from "./modals/EditModal";
import { getAppVersion } from "../utils/api";
import { useApi } from "../utils/hooks/api.hook";

function App(): JSX.Element {
    const [selectedOrganId, setSelectedOrganId] = useState<string | null>(null);
    const [organs, setOrgans] = useState<MinimalOrgan[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [reloadCount, triggerReload] = useReducer(
        (count: number) => count + 1,
        0,
    );

    const { data: appVersion } = useApi<string>(getAppVersion, []);

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
                    {appVersion && (
                        <span className="version">{`v${appVersion}`}</span>
                    )}
                </div>
                <div className="actions">
                    <button onClick={reload}>Recharger</button>
                    <button onClick={openModal}>Ajouter un orgue</button>
                    {createPortal(
                        <EditModal
                            isOpen={isAddModalOpen}
                            close={closeModal}
                            onSaved={reload}
                        />,
                        document.body,
                    )}
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
        </>
    );
}

export default App;
