import type { Dispatch, JSX, SetStateAction } from "react";

import "./Grid.css";
import { getCover, getOrgansList } from "../../utils/api";
import { useApi } from "../../utils/hooks/api.hook";
import type { MinimalOrgan } from "../../utils/types/api.type";

function OrganCard({
    organ,
    setSelected,
}: {
    organ: MinimalOrgan;
    setSelected: Dispatch<SetStateAction<MinimalOrgan | null>>;
}): JSX.Element {
    const {
        data: cover,
        isLoading: isCoverLoading,
        error: coverError,
    } = useApi<string>(async () => await getCover(organ._id), []);

    return (
        <div
            key={organ._id}
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
                    <div className="error">
                        Impossible de charger l&apos;image
                    </div>
                )}
            </div>
            <div className="content">
                <h3 className="name">{organ.name}</h3>
                <div className="infos">{`${organ.country} • ${organ.year.toString()}`}</div>
            </div>
        </div>
    );
}

function Grid({
    reloadTime,
    setSelectedOrgan,
}: {
    reloadTime: number;
    setSelectedOrgan: Dispatch<SetStateAction<MinimalOrgan | null>>;
}): JSX.Element {
    const {
        data: organs,
        isLoading,
        error,
    } = useApi<MinimalOrgan[]>(getOrgansList, [reloadTime]);

    return (
        <div className="grid">
            {error}
            {!isLoading &&
                !error &&
                organs &&
                organs.map((organ) => (
                    <OrganCard
                        key={organ._id}
                        setSelected={setSelectedOrgan}
                        organ={organ}
                    />
                ))}
        </div>
    );
}

export { Grid };
