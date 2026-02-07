import { useState, type Dispatch, type JSX, type SetStateAction } from "react";

import "./App.css";
import { openConfig, getOrgansList, getCover } from "./utils/api";
import { useApi } from "./utils/hooks/api.hook";
import type { Organ } from "./utils/types/api.types";
import { useBridge } from "./utils/hooks/bridge.hook";

function OrganCard({
    organ,
    setSelected,
    pywebviewReady,
}: {
    organ: Organ;
    setSelected: Dispatch<SetStateAction<Organ | null>>;
    pywebviewReady: boolean;
}): JSX.Element {
    const {
        data: cover,
        isLoading: isCoverLoading,
        error: coverError,
    } = useApi<string>(
        async () => await getCover(organ.id),
        [],
        pywebviewReady,
    );
    console.log(cover)

    return (
        <div
            key={organ.id}
            className="organ"
            onClick={() => setSelected(organ)}
        >
            <div
                className="cover"
                style={
                    cover
                        ? {
                              backgroundImage: `url(${cover})`,
                          }
                        : undefined
                }
            >
                {coverError && "Impossible de charger l'image"}
            </div>
            <div className="content">
                <h3 className="name">{organ.name}</h3>
                <div className="infos">{`${organ.creator} • ${organ.date.toString()}`}</div>
            </div>
        </div>
    );
}

function App(): JSX.Element {
    const pywebviewReady = useBridge();

    const {
        data: organs,
        isLoading,
        error,
    } = useApi<Organ[]>(getOrgansList, [], pywebviewReady);

    const [selected, setSelected] = useState<Organ | null>(null);

    return (
        <>
            <div className="appbar">
                <h1 className="app-title">GO Dash</h1>
                <div className="actions">
                    <button onClick={openConfig}>Éditer la config</button>
                </div>
            </div>
            <main>
                <div className="grid">
                    {error}
                    {!isLoading &&
                        !error &&
                        organs &&
                        organs.map((organ) => (
                            <OrganCard
                                key={organ.id}
                                setSelected={setSelected}
                                organ={organ}
                                pywebviewReady={pywebviewReady}
                            />
                        ))}
                </div>
                <div className="panel">
                    {selected ? (
                        ""
                    ) : (
                        <div className="none">Aucun orgue sélectionné.</div>
                    )}
                </div>
            </main>
        </>
    );
}

export default App;
