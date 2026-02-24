import { useEffect, type JSX } from "react";

import "./Grid.css";
import { getCover, getOrgansList } from "../../utils/api";
import { useApi } from "../../utils/hooks/api.hook";
import type { MinimalOrgan } from "../../utils/types/api.type";

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
}: {
    reloadCount: number;
    onSelectOrgan: (organ: MinimalOrgan) => void;
    onOrgansLoaded: (organs: MinimalOrgan[]) => void;
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
                organs.map((organ) => (
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
