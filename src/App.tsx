import { useState, type Dispatch, type JSX, type SetStateAction } from "react";
import { MapPin, Calendar } from "lucide-react";

import "./App.css";
import {
    openConfig,
    getOrgansList,
    getCover,
    getPreview,
    reloadOrgans,
    openOrgan,
} from "./utils/api";
import { useApi } from "./utils/hooks/api.hook";
import type { Organ } from "./utils/types/api.types";
import { useBridge } from "./utils/hooks/bridge.hook";
import logo from "./assets/logo.ico";

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

    return (
        <div
            key={organ.id}
            className="organ"
            onClick={() => setSelected(organ)}
        >
            <div className="cover shimmer-loading">
                <div
                    className="image"
                    style={
                        cover && !isCoverLoading
                            ? {
                                  backgroundImage: `url(${cover})`,
                              }
                            : undefined
                    }
                />
                {coverError && (
                    <div className="error">Impossible de charger l'image</div>
                )}
            </div>
            <div className="content">
                <h3 className="name">{organ.name}</h3>
                <div className="infos">{`${organ.country} • ${organ.date.toString()}`}</div>
            </div>
        </div>
    );
}

function Panel({
    selectedOrgan,
    pywebviewReady,
}: {
    selectedOrgan: Organ | null;
    pywebviewReady: boolean;
}): JSX.Element {
    const {
        data: preview,
        isLoading: isPreviewLoading,
        error: previewError,
    } = useApi<string>(
        selectedOrgan
            ? async (): Promise<string> => await getPreview(selectedOrgan.id)
            : async (): Promise<string> => "",
        [selectedOrgan],
        pywebviewReady,
    );

    const [mousePosition, setMousePosition] = useState<{
        x: number;
        y: number;
    }>({ x: 50, y: 50 });
    const [isHovering, setIsHovering] = useState<boolean>(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>): void => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
    };

    return (
        <div className="panel">
            {selectedOrgan ? (
                !isPreviewLoading &&
                !previewError &&
                preview && (
                    <>
                        <div className="preview-container shimmer-loading">
                            <div
                                className="preview"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                style={{
                                    scale: isHovering ? 1.5 : 1,
                                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                                    backgroundImage: `url(${preview})`,
                                }}
                            />
                        </div>
                        <div className="content">
                            <div className="legend">
                                Passer la souris sur l'image pour zoomer.
                            </div>
                            <div className="actions">
                                <div className="infos">
                                    <h2 className="name">
                                        {selectedOrgan.name}
                                    </h2>
                                    <div>
                                        <MapPin size={16} />
                                        {selectedOrgan.country}
                                    </div>
                                    <div>
                                        <Calendar size={16} />
                                        {selectedOrgan.date.toString()}
                                    </div>
                                </div>
                                <button
                                    onClick={() => openOrgan(selectedOrgan.id)}
                                >
                                    Ouvrir l'orgue
                                </button>
                            </div>
                        </div>
                    </>
                )
            ) : (
                <div className="none">Aucun orgue sélectionné.</div>
            )}
        </div>
    );
}

function App(): JSX.Element {
    const pywebviewReady = useBridge();

    const [selected, setSelected] = useState<Organ | null>(null);
    const [reloadTime, setReloadTime] = useState<number>(Date.now());
    const {
        data: organs,
        isLoading,
        error,
    } = useApi<Organ[]>(getOrgansList, [reloadTime], pywebviewReady);

    const reload = async (): Promise<void> => {
        await reloadOrgans();
        setSelected(null);
        setReloadTime(Date.now());
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
                <Panel
                    selectedOrgan={selected}
                    pywebviewReady={pywebviewReady}
                />
            </main>
        </>
    );
}

export default App;
