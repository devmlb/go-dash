import { useState, type JSX } from "react";

import "./App.css";
// import { openConfig, reloadOrgans } from "./utils/api";
import type { MinimalOrgan } from "../utils/types/api.type";
import logo from "../assets/logo.ico";
import { Panel } from "./panel/Panel";
import { Grid } from "./grid/Grid";
import { Modal } from "../components/modal/Modal";

function App(): JSX.Element {
    const [selected, setSelected] = useState<MinimalOrgan | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [reloadTime, setReloadTime] = useState<number>(Date.now());

    const reload = async (): Promise<void> => {
        // await reloadOrgans();
        setSelected(null);
        setReloadTime(Date.now());
    };

    const closeModal = (): void => setIsAddModalOpen(false);
    const openModal = (): void => setIsAddModalOpen(true);

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
                    <Modal
                        isOpen={isAddModalOpen}
                        onClose={closeModal}
                        onConfirm={closeModal}
                        title="Ajouter un orgue"
                    >
                        <input type="text" placeholder="Nom" />
                        <input type="text" placeholder="Pays" />
                        <input type="number" placeholder="Année" />
                        <input type="text" placeholder="Facteur d'orgue" />
                        <input type="text" placeholder="URL" />
                        <input type="text" placeholder="Caractéristiques" />
                        <input type="text" placeholder="Chemin" />
                        <input
                            type="text"
                            placeholder="Chemin de la couverture"
                        />
                        <input type="text" placeholder="Chemin de l'aperçu" />
                    </Modal>
                </div>
            </div>
            <main>
                <Grid reloadTime={reloadTime} setSelectedOrgan={setSelected} />
                <Panel selectedOrgan={selected} />
            </main>
            {/* <Modal /> */}
        </>
    );
}

export default App;
