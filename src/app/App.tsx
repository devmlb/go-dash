import { useEffect, useReducer, useState, type JSX } from "react";

import "./App.css";
import type { MinimalOrgan } from "../utils/types/organ.type";
import { Panel } from "./panel/Panel";
import { Grid } from "./grid/Grid";
import { Appbar } from "./appbar/Appbar";
import { useUpdater } from "../utils/hooks/updater.hook";
import { createPortal } from "react-dom";
import { UpdateModal } from "./modals/UpdateModal";

const sortFields: { name: string; id: keyof MinimalOrgan }[] = [
    {
        name: "Trier par nom",
        id: "name",
    },
    {
        name: "Trier par pays",
        id: "country",
    },
    {
        name: "Trier par année de construction",
        id: "year",
    },
    {
        name: "Trier par facteur d'orgue",
        id: "builder",
    },
    {
        name: "Trier par nombre de jeux",
        id: "stops",
    },
    {
        name: "Trier par nombre de claviers",
        id: "keyboards",
    },
];

function App(): JSX.Element {
    const [selectedOrganId, setSelectedOrganId] = useState<string | null>(null);
    const [organs, setOrgans] = useState<MinimalOrgan[]>([]);
    const [selectedSortOrder, setSelectedSortOrder] = useState<number | null>(
        null,
    );
    const [selectedSortField, setSelectedSortField] = useState<number | null>(
        null,
    );
    const [reloadCount, triggerReload] = useReducer(
        (count: number) => count + 1,
        0,
    );
    const selected = selectedOrganId
        ? (organs.find((organ) => organ.id === selectedOrganId) ?? null)
        : null;
    const { updateInfos, isUpdateDownloaded, restartAndinstallUpdate } =
        useUpdater();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

    const reload = (): void => {
        triggerReload();
    };

    const handleOrgansLoaded = (nextOrgans: MinimalOrgan[]): void => {
        setOrgans(nextOrgans);

        if (
            selectedOrganId &&
            !nextOrgans.some((organ) => organ.id === selectedOrganId)
        ) {
            setSelectedOrganId(null);
        }
    };

    useEffect(() => {
        if (isUpdateDownloaded) {
            setIsUpdateModalOpen(true);
        }
    }, [isUpdateDownloaded]);

    return (
        <>
            <Appbar
                reloadFn={reload}
                selectedSortOrder={selectedSortOrder}
                setSelectedSortOrder={setSelectedSortOrder}
                selectedSortField={selectedSortField}
                setSelectedSortField={setSelectedSortField}
                sortFields={sortFields}
            />
            <main>
                <Grid
                    reloadCount={reloadCount}
                    onSelectOrgan={(organ) => setSelectedOrganId(organ.id)}
                    onOrgansLoaded={handleOrgansLoaded}
                    ascendantSort={
                        selectedSortOrder !== null
                            ? selectedSortOrder === 0
                            : true
                    }
                    fieldSort={
                        selectedSortField !== null
                            ? sortFields[selectedSortField].id
                            : sortFields[0].id
                    }
                />
                <Panel selectedOrgan={selected} reloadFn={reload} />
            </main>
            {updateInfos &&
                createPortal(
                    <UpdateModal
                        isOpen={isUpdateModalOpen}
                        close={() => setIsUpdateModalOpen(false)}
                        restart={restartAndinstallUpdate}
                        updateDetails={updateInfos}
                    />,
                    document.body,
                )}
        </>
    );
}

export default App;
