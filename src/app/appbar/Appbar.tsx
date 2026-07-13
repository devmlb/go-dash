import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    ArrowDownNarrowWide,
    ArrowDownUp,
    ArrowDownWideNarrow,
    CircleQuestionMark,
    Download,
    Ellipsis,
    FolderOpen,
    Plus,
    RefreshCcw,
    Trash,
} from "lucide-react";
import { getVersion } from "@tauri-apps/api/app";

import "./Appbar.css";
import type { MinimalOrgan } from "../../utils/types/organ.type";
import logo from "../../assets/logo.ico";
import { EditModal } from "../modals/EditModal";
import { organApi } from "../../api/organ.api";
import { settingsApi } from "../../api/settings.api";
import { useApi } from "../../utils/hooks/api.hook";
import { IconButton, TextButton } from "../../components/button/Button";
import { Modal } from "../../components/modal/Modal";
import { Menu, SelectionMenu } from "../../components/menu/Menu";
import { useTranslation } from "react-i18next";

function Appbar({
    reloadFn,
    selectedSortOrder,
    setSelectedSortOrder,
    selectedSortField,
    setSelectedSortField,
    sortFields,
}: {
    reloadFn: () => void;
    selectedSortOrder: number | null;
    setSelectedSortOrder: React.Dispatch<React.SetStateAction<number | null>>;
    selectedSortField: number | null;
    setSelectedSortField: React.Dispatch<React.SetStateAction<number | null>>;
    sortFields: { name: string; id: keyof MinimalOrgan }[];
}): React.JSX.Element {
    const { t } = useTranslation();
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const { data: appVersion } = useApi<string>(getVersion, []);
    const { data: storedAscendantSort } = useApi<boolean>(
        async () => await settingsApi.getValue("ascendantSort"),
        [],
    );
    const { data: storedSortField } = useApi<string>(
        async () => await settingsApi.getValue("sortField"),
        [],
    );

    const closeAddModal = (): void => setIsAddModalOpen(false);
    const openAddModal = (): void => setIsAddModalOpen(true);
    const closeDeleteModal = (): void => setIsDeleteModalOpen(false);
    const openDeleteModal = async (): Promise<void> =>
        setIsDeleteModalOpen(true);
    const handleImport = async (): Promise<void> => {
        await organApi.import();
        reloadFn();
    };
    const handleExport = async (): Promise<void> => {
        await organApi.exportAll();
    };
    const handleRemove = async (): Promise<void> => {
        closeDeleteModal();
        await organApi.clear();
        reloadFn();
    };
    const handleSortOrderChange = async (entryIndex: number): Promise<void> => {
        setSelectedSortOrder(entryIndex);
        await settingsApi.setValue("ascendantSort", entryIndex === 0);
    };
    const handleSortFieldChange = async (entryIndex: number): Promise<void> => {
        setSelectedSortField(entryIndex);
        await settingsApi.setValue("sortField", sortFields[entryIndex].id);
    };

    useEffect(() => {
        if (
            typeof storedAscendantSort !== "boolean" ||
            typeof storedSortField !== "string"
        )
            return;

        setSelectedSortOrder(storedAscendantSort ? 0 : 1);
        setSelectedSortField(
            sortFields.findIndex((field) => field.id === storedSortField),
        );
    }, [
        setSelectedSortField,
        setSelectedSortOrder,
        sortFields,
        storedAscendantSort,
        storedSortField,
    ]);

    return (
        <div className="appbar">
            <div className="branding">
                <img className="logo" src={logo} />
                <h1 className="title">GO Dash</h1>
                {appVersion && (
                    <span className="version">{`v${appVersion}`}</span>
                )}
            </div>
            <div className="actions">
                <TextButton
                    text="Ajouter un orgue"
                    icon={<Plus />}
                    onClick={openAddModal}
                />
                <div className="secondary">
                    <IconButton
                        icon={<RefreshCcw />}
                        secondary
                        onClick={reloadFn}
                    />
                    {selectedSortOrder !== null ? (
                        <SelectionMenu
                            target={
                                <IconButton
                                    icon={
                                        selectedSortOrder === 0 ? (
                                            <ArrowDownNarrowWide />
                                        ) : (
                                            <ArrowDownWideNarrow />
                                        )
                                    }
                                    secondary
                                />
                            }
                            entries={[
                                {
                                    name: t("sortOrder.ascendant"),
                                },
                                {
                                    name: t("sortOrder.descendant"),
                                },
                            ]}
                            defaultSelected={selectedSortOrder}
                            onSelected={handleSortOrderChange}
                        />
                    ) : (
                        <IconButton icon={<CircleQuestionMark />} secondary />
                    )}
                    {selectedSortField !== null ? (
                        <SelectionMenu
                            target={
                                <IconButton icon={<ArrowDownUp />} secondary />
                            }
                            entries={sortFields}
                            defaultSelected={selectedSortField}
                            onSelected={handleSortFieldChange}
                        />
                    ) : (
                        <IconButton icon={<ArrowDownUp />} secondary />
                    )}
                    <Menu
                        target={<IconButton icon={<Ellipsis />} secondary />}
                        entries={[
                            {
                                name: t("more.deleteAll"),
                                icon: <Trash />,
                                onClick: openDeleteModal,
                            },
                            {
                                name: t("more.import"),
                                icon: <FolderOpen />,
                                onClick: handleImport,
                            },
                            {
                                name: t("more.export"),
                                icon: <Download />,
                                onClick: handleExport,
                            },
                        ]}
                    />
                </div>
                {createPortal(
                    <EditModal
                        isOpen={isAddModalOpen}
                        close={closeAddModal}
                        onSaved={reloadFn}
                    />,
                    document.body,
                )}
                {createPortal(
                    <Modal
                        isOpen={isDeleteModalOpen}
                        onCancel={closeDeleteModal}
                        onConfirm={handleRemove}
                        title="Supprimer tous les orgues"
                        titleIcon={<Trash />}
                        confirmActionText="Supprimer"
                    >
                        Voulez-vous vraiment supprimer tous les orgues ? <br />
                        Les fichiers extérieurs spécifiés dans les propriétés
                        des orgues sur GO Dash ne seront pas supprimés.
                    </Modal>,
                    document.body,
                )}
            </div>
        </div>
    );
}

export { Appbar };
