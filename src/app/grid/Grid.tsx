import { useEffect, type JSX } from "react";
import { useTranslation } from "react-i18next";
import { CircleAlert } from "lucide-react";

import "./Grid.css";
import { organApi } from "../../api/organ.api";
import { useApi } from "../../utils/hooks/api.hook";
import type { MinimalOrgan } from "../../utils/types/organ.type";
import { sortArrayOfObjectByField } from "../../utils/sort";
import logo from "../../assets/logo.ico";

function OrganCard({
    reloadCount,
    organ,
    onSelect,
}: {
    reloadCount: number;
    organ: MinimalOrgan;
    onSelect: (organ: MinimalOrgan) => void;
}): JSX.Element {
    const { t } = useTranslation();
    const {
        data: cover,
        isLoading: isCoverLoading,
        error: coverError,
    } = useApi<string | null>(async () => {
        const rawB64 = await organApi.getCoverB64(organ.id);
        return rawB64 ? `data:image;base64,${rawB64}` : null;
    }, [reloadCount]);

    return (
        <div key={organ.id} className="organ" onClick={() => onSelect(organ)}>
            <div className={`cover${isCoverLoading ? " shimmer-loading" : ""}`}>
                {!coverError && !isCoverLoading && (
                    <div
                        className="image"
                        style={{
                            backgroundImage: `url(${cover ?? logo})`,
                            ...(!cover && { backgroundSize: 80 }),
                        }}
                    />
                )}
                {coverError && (
                    <div className="error">
                        <CircleAlert size={24} strokeWidth={1.75} />
                        {t("common.imageError")}
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
                              ` ${t("common.stop", { count: organ.stops })}`
                            : "") +
                        (!organ.keyboards && !organ.hasPedals
                            ? ""
                            : (organ.stops ? ", " : " • ") +
                              (organ.keyboards && organ.hasPedals
                                  ? `${organ.keyboards}+P`
                                  : organ.keyboards
                                    ? organ.keyboards +
                                      ` ${t("common.keyboard", { count: organ.keyboards })}`
                                    : ` ${t("common.pedals")}`))}
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
