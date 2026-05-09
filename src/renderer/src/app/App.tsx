import { useReducer, useState, type JSX } from "react";
import { createPortal } from "react-dom";
import {
    ArrowDownNarrowWide,
    ArrowDownUp,
    ArrowDownWideNarrow,
    Download,
    Ellipsis,
    FolderOpen,
    Plus,
    RefreshCcw,
    Trash,
} from "lucide-react";

import "./App.css";
import type { MinimalOrgan } from "../utils/types/api.type";
import logo from "../assets/logo.ico";
import { Panel } from "./panel/Panel";
import { Grid } from "./grid/Grid";
import { EditModal } from "./modals/EditModal";
import {
    getAppVersion,
    exportAllOrgans,
    importOrgans,
    removeAllOrgans,
} from "../utils/api";
import { useApi } from "../utils/hooks/api.hook";
import { IconButton, TextButton } from "../components/button/Button";
import { Modal } from "../components/modal/Modal";
import { Menu, SelectionMenu } from "../components/menu/Menu";

const sortFields: { name: string; id: keyof MinimalOrgan }[] = [
    {
        name: "Trier par nom",
        id: "name",
    },
    {
        name: "Trier par pays",
        id: "country",
    },
    {
        name: "Trier par année de construction",
        id: "year",
    },
    {
        name: "Trier par facteur d'orgue",
        id: "builder",
    },
];

function App(): JSX.Element {
    const [selectedOrganId, setSelectedOrganId] = useState<string | null>(null);
    const [organs, setOrgans] = useState<MinimalOrgan[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [reloadCount, triggerReload] = useReducer(
        (count: number) => count + 1,
        0,
    );

    const { data: appVersion } = useApi<string>(getAppVersion, []);

    const selected = selectedOrganId
        ? (organs.find((organ) => organ._id === selectedOrganId) ?? null)
        : null;

    const reload = (): void => {
        triggerReload();
    };

    const closeAddModal = (): void => setIsAddModalOpen(false);
    const openAddModal = (): void => setIsAddModalOpen(true);
    const closeDeleteModal = (): void => setIsDeleteModalOpen(false);
    const openDeleteModal = async (): Promise<void> =>
        setIsDeleteModalOpen(true);

    const [selectedSortOrder, setSelectedSortOrder] = useState<number>(0);
    const [selectedSortField, setSelectedSortField] = useState<number>(0);

    const handleOrgansLoaded = (nextOrgans: MinimalOrgan[]): void => {
        setOrgans(nextOrgans);

        if (
            selectedOrganId &&
            !nextOrgans.some((organ) => organ._id === selectedOrganId)
        ) {
            setSelectedOrganId(null);
        }
    };

    const handleImport = async (): Promise<void> => {
        await importOrgans();
        reload();
    };

    const handleRemove = async (): Promise<void> => {
        closeDeleteModal();
        await removeAllOrgans();
        reload();
    };

    return (
        <>
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
                            onClick={reload}
                        />
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
                                    name: "Tri croissant",
                                },
                                {
                                    name: "Tri décroissant",
                                },
                            ]}
                            defaultSelected={selectedSortOrder}
                            onSelected={(entryIndex) =>
                                setSelectedSortOrder(entryIndex)
                            }
                        />
                        <SelectionMenu
                            target={
                                <IconButton icon={<ArrowDownUp />} secondary />
                            }
                            entries={sortFields}
                            defaultSelected={selectedSortField}
                            onSelected={(entryIndex) =>
                                setSelectedSortField(entryIndex)
                            }
                        />
                        <Menu
                            target={
                                <IconButton icon={<Ellipsis />} secondary />
                            }
                            entries={[
                                {
                                    name: "Supprimer tout",
                                    icon: <Trash />,
                                    onClick: openDeleteModal,
                                },
                                {
                                    name: "Importer des orgues",
                                    icon: <FolderOpen />,
                                    onClick: handleImport,
                                },
                                {
                                    name: "Exporter tous les orgues",
                                    icon: <Download />,
                                    onClick: exportAllOrgans,
                                },
                            ]}
                        />
                    </div>
                    {createPortal(
                        <EditModal
                            isOpen={isAddModalOpen}
                            close={closeAddModal}
                            onSaved={reload}
                        />,
                        document.body,
                    )}
                    {createPortal(
                        <Modal
                            isOpen={isDeleteModalOpen}
                            onClose={closeDeleteModal}
                            onConfirm={handleRemove}
                            title="Supprimer tous les orgues"
                            titleIcon={<Trash />}
                            confirmActionText="Supprimer"
                        >
                            Voulez-vous vraiment supprimer tous les orgues ?{" "}
                            <br />
                            Les fichiers extérieurs spécifiés dans les
                            propriétés des orgues sur GO Dash ne seront pas
                            supprimés.
                        </Modal>,
                        document.body,
                    )}
                </div>
            </div>
            <main>
                <Grid
                    reloadCount={reloadCount}
                    onSelectOrgan={(organ) => setSelectedOrganId(organ._id)}
                    onOrgansLoaded={handleOrgansLoaded}
                    ascendantSort={selectedSortOrder === 0}
                    fieldSort={sortFields[selectedSortField].id}
                />
                <Panel selectedOrgan={selected} reload={reload} />
            </main>
        </>
    );
}

export default App;
