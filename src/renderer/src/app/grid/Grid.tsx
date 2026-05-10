import { useEffect, type JSX } from "react";

import "./Grid.css";
import { getCover, getOrgansList } from "../../api/organ.api";
import { useApi } from "../../utils/hooks/api.hook";
import type { MinimalOrgan } from "../../utils/types/api.type";
import { sortArrayOfObjectByField } from "@renderer/utils/sort";

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
        async () => await getCover(organ._id),
        [reloadCount],
    );

    return (
        <div key={organ._id} className="organ" onClick={() => onSelect(organ)}>
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
                <div className="infos">{`${organ.country}${organ.year ? " • " + organ.year.toString() : ""}`}</div>
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
    } = useApi<MinimalOrgan[]>(getOrgansList, [reloadCount]);

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
                        key={organ._id}
                        onSelect={onSelectOrgan}
                        organ={organ}
                        reloadCount={reloadCount}
                    />
                ))}
        </div>
    );
}

export { Grid };
