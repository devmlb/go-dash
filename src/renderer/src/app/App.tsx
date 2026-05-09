import { useReducer, useState, type JSX } from "react";

import "./App.css";
import type { MinimalOrgan } from "../utils/types/api.type";
import { Panel } from "./panel/Panel";
import { Grid } from "./grid/Grid";
import { Appbar } from "./appbar/Appbar";

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
        ? (organs.find((organ) => organ._id === selectedOrganId) ?? null)
        : null;

    const reload = (): void => {
        triggerReload();
    };
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
                    onSelectOrgan={(organ) => setSelectedOrganId(organ._id)}
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
        </>
    );
}

export default App;
