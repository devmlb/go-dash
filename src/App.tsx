import type { JSX } from "react";

import "./App.css";
import { openConfig, getOrgansList } from "./utils/api";
import { useApi } from "./utils/hooks/api.hook";
import type { Organ } from "./utils/types/api.types";
import { useBridge } from "./utils/hooks/bridge.hook";

function App(): JSX.Element {
    const pywebviewReady = useBridge();

    const {
        data: organs,
        isLoading,
        error,
    } = useApi<Organ[]>(getOrgansList, [], pywebviewReady);

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
                        organs.map((organ) => {
                            return (
                                <div key={organ.id} className="organ">
                                    <div className="preview" />
                                    <div className="content">
                                        <h3 className="name">{organ.name}</h3>
                                        <div className="infos">{`${organ.creator} • ${organ.date.toString()}`}</div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <div className="panel"></div>
            </main>
        </>
    );
}

export default App;
