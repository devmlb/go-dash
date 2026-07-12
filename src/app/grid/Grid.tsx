import { useEffect, type JSX } from "react";

import "./Grid.css";
import { organApi } from "../../api/organ.api";
import { useApi } from "../../utils/hooks/api.hook";
import type { MinimalOrgan } from "../../utils/types/organ.type";
import { sortArrayOfObjectByField } from "../../utils/sort";

function OrganCard({
    reloadCount,
    organ,
    onSelect,
}: {
    reloadCount: number;
    organ: MinimalOrgan;
    onSelect: (organ: MinimalOrgan) => void;
}): JSX.Element {
    const {
        data: cover,
        isLoading: isCoverLoading,
        error: coverError,
    } = useApi<string | null>(
        async () => `data:image;base64,${await organApi.getCoverB64(organ.id)}`,
        [reloadCount],
    );

    return (
        <div key={organ.id} className="organ" onClick={() => onSelect(organ)}>
            <div className={`cover${cover ? " shimmer-loading" : ""}`}>
                <div
                    className="image"
                    style={{
                        backgroundImage:
                            cover && !isCoverLoading
                                ? `url(${cover})`
                                : undefined,
                        backgroundColor: !cover
                            ? "var(--color-surface-dark)"
                            : undefined,
                    }}
                />
                {coverError && (
                    <div className="error">
                        Impossible de charger l&apos;image
                    </div>
                )}
            </div>
            <div className="content">
                <h3 className="name">{organ.name}</h3>
                <div className="infos">
                    {organ.country +
                        (organ.year ? " • " + organ.year : "") +
                        (organ.stops
                            ? " • " +
                              organ.stops +
                              ` jeu${organ.stops > 1 ? "x" : ""}`
                            : "") +
                        (organ.keyboards
                            ? (organ.stops ? ", " : " • ") +
                              organ.keyboards +
                              ` clavier${organ.keyboards > 1 ? "s" : ""}`
                            : "")}
                </div>
            </div>
        </div>
    );
}

function Grid({
    reloadCount,
    onSelectOrgan,
    onOrgansLoaded,
    ascendantSort,
    fieldSort,
}: {
    reloadCount: number;
    onSelectOrgan: (organ: MinimalOrgan) => void;
    onOrgansLoaded: (organs: MinimalOrgan[]) => void;
    ascendantSort: boolean;
    fieldSort: keyof MinimalOrgan;
}): JSX.Element {
    const {
        data: organs,
        isLoading,
        error,
    } = useApi<MinimalOrgan[]>(
        async () => await organApi.getAll(),
        [reloadCount],
    );

    useEffect(() => {
        if (!isLoading && !error) {
            onOrgansLoaded(organs ?? []);
        }
    }, [error, isLoading, onOrgansLoaded, organs]);

    return (
        <div className="grid">
            {error}
            {!isLoading &&
                !error &&
                organs &&
                sortArrayOfObjectByField<MinimalOrgan>(
                    organs,
                    fieldSort,
                    ascendantSort,
                ).map((organ) => (
                    <OrganCard
                        key={organ.id}
                        onSelect={onSelectOrgan}
                        organ={organ}
                        reloadCount={reloadCount}
                    />
                ))}
        </div>
    );
}

export { Grid };
