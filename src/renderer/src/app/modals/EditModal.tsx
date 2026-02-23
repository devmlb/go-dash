import { JSX, useEffect, useState } from "react";

import "./EditModal.css";
import { Modal } from "../../components/modal/Modal";
import { Input } from "../../components/input/Input";
import type { Organ } from "@renderer/utils/types/api.type";
import { useApi } from "@renderer/utils/hooks/api.hook";
import { getFullOrgan, updateOrgan } from "@renderer/utils/api";

type EditField = {
    value: string;
    isValid: boolean;
    placeholder: string;
    regexValidation: RegExp | undefined;
    validationErrorText: string | undefined;
};

function buildFields(organInfos: Organ | null): EditField[] {
    return [
        {
            value: organInfos?.name ?? "",
            isValid: organInfos ? true : false,
            placeholder: "Nom",
            regexValidation: /^.+$/,
            validationErrorText: "Nom invalide : au moins 1 caractère requis.",
        },
        {
            value: organInfos?.country ?? "",
            isValid: organInfos ? true : false,
            placeholder: "Pays",
            regexValidation: /^.+$/,
            validationErrorText:
                "Pays invalide : au moins un caractère requis.",
        },
        {
            value: organInfos ? organInfos.year.toString() : "",
            isValid: organInfos ? true : false,
            placeholder: "Année de construction",
            regexValidation: /^$|^[0-9]{4}$/,
            validationErrorText:
                "Année invalide : 4 caractères numériques requis.",
        },
        {
            value: organInfos?.builder ?? "",
            isValid: organInfos ? true : false,
            placeholder: "Facteur d'orgue",
            regexValidation: undefined,
            validationErrorText: undefined,
        },
        {
            value: organInfos?.features ?? "",
            isValid: organInfos ? true : false,
            placeholder: "Caractéristiques",
            regexValidation: undefined,
            validationErrorText: undefined,
        },
        {
            value: organInfos?.url ?? "",
            isValid: organInfos ? true : false,
            placeholder: "URL externe",
            regexValidation: /^$|^(http|https):\/\/.*\..*$/,
            validationErrorText: "URL invalide.",
        },
    ];
}

function EditModal({
    isOpen,
    close,
    organId,
    onSaved,
}: {
    isOpen: boolean;
    close: () => void;
    organId: string;
    onSaved?: () => void;
}): JSX.Element {
    const { data: organInfos } = useApi<Organ | null>(
        organId
            ? async (): Promise<Organ> => await getFullOrgan(organId)
            : async (): Promise<null> => null,
        [organId],
    );

    const [fields, setFields] = useState<EditField[]>(buildFields(null));

    useEffect(() => {
        setFields(buildFields(organInfos));
    }, [organInfos]);

    const setFieldValue = (fieldIndex: number, value: string): void => {
        const fieldsClone = structuredClone(fields);
        fieldsClone[fieldIndex].value = value;
        setFields(fieldsClone);
    };

    const setFieldValidity = (fieldIndex: number, isValid: boolean): void => {
        const fieldsClone = structuredClone(fields);
        fieldsClone[fieldIndex].isValid = isValid;
        setFields(fieldsClone);
    };

    const areAllFieldsValids = (): boolean => fields.every((f) => f.isValid);

    const closeAndSave = async (): Promise<void> => {
        if (!organInfos) return;

        const year =
            fields[2].value === ""
                ? organInfos.year
                : parseInt(fields[2].value);

        await updateOrgan({
            _id: organInfos._id,
            name: fields[0].value,
            country: fields[1].value,
            year,
            builder: fields[3].value,
            features: fields[4].value,
            url: fields[5].value,
            path: organInfos.path,
            previewPath: organInfos.previewPath,
            coverPath: organInfos.coverPath,
        });
        close();
        onSaved?.();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={close}
            onConfirm={closeAndSave}
            title="Ajouter un orgue"
            isConfirmActionEnabled={areAllFieldsValids()}
        >
            <div className="edit-modal-content">
                {fields.map((field, i) => (
                    <Input
                        key={"field" + i}
                        value={field.value}
                        setValue={(v) => setFieldValue(i, v)}
                        placeholder={field.placeholder}
                        regexValidation={field.regexValidation}
                        validationErrorText={field.validationErrorText}
                        setIsValid={(v) => setFieldValidity(i, v)}
                    />
                ))}
            </div>
        </Modal>
    );
}

export { EditModal };
