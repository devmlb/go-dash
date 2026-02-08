import type { Dispatch, JSX, SetStateAction } from "react";

import "./Grid.css";
import { getCover, getOrgansList } from "../../utils/api";
import { useApi } from "../../utils/hooks/api.hook";
import type { Organ } from "../../utils/types/api.types";
import { useBridgeReady } from "../../utils/hooks/bridge.hook";

function OrganCard({
    organ,
    setSelected,
}: {
    organ: Organ;
    setSelected: Dispatch<SetStateAction<Organ | null>>;
}): JSX.Element {
    const {
        data: cover,
        isLoading: isCoverLoading,
        error: coverError,
    } = useApi<string>(
        async () => await getCover(organ.id),
        [],
        useBridgeReady(),
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

function Grid({
    reloadTime,
    setSelectedOrgan,
}: {
    reloadTime: number;
    setSelectedOrgan: Dispatch<SetStateAction<Organ | null>>;
}): JSX.Element {
    const {
        data: organs,
        isLoading,
        error,
    } = useApi<Organ[]>(getOrgansList, [reloadTime], useBridgeReady());

    return (
        <div className="grid">
            {error}
            {!isLoading &&
                !error &&
                organs &&
                organs.map((organ) => (
                    <OrganCard
                        key={organ.id}
                        setSelected={setSelectedOrgan}
                        organ={organ}
                    />
                ))}
        </div>
    );
}

export { Grid };
