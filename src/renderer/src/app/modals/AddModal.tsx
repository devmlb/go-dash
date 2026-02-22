import { JSX, useState } from "react";

import "./AddModal.css";
import { Modal } from "../../components/modal/Modal";
import { Input } from "../../components/input/Input";

function AddModal({
    isOpen,
    close,
}: {
    isOpen: boolean;
    close: () => void;
}): JSX.Element {
    const fields = [
        {
            placeholder: "Nom",
            regexValidation: /^.+$/,
            validationErrorText: "Nom invalide : au moins 1 caractère requis.",
        },
        {
            placeholder: "Pays",
            regexValidation: /^.+$/,
            validationErrorText:
                "Pays invalide : au moins un caractère requis.",
        },
        {
            placeholder: "Année de construction",
            regexValidation: /^$|^[0-9]{4}$/,
            validationErrorText:
                "Année invalide : 4 caractères numériques requis.",
        },
        {
            placeholder: "Facteur d'orgue",
            regexValidation: undefined,
            validationErrorText: undefined,
        },
        {
            placeholder: "Caractéristiques",
            regexValidation: undefined,
            validationErrorText: undefined,
        },
        {
            placeholder: "URL externe",
            regexValidation: /^$|^(http|https):\/\/.*\..*$/,
            validationErrorText: "URL invalide",
        },
    ];

    const [fieldsValues, setFieldsValues] = useState<string[]>(
        Array(fields.length).map(() => ""),
    );
    const [fieldsValidity, setFieldsValidity] = useState<boolean[]>(
        Array(fields.length).map(() => false),
    );

    const setFieldValue = (fieldIndex: number, value: string): void => {
        const fieldsClone = structuredClone(fieldsValues);
        fieldsClone[fieldIndex] = value;
        setFieldsValues(fieldsClone);
    };

    const setFieldValidity = (fieldIndex: number, isValid: boolean): void => {
        const fieldsClone = structuredClone(fieldsValidity);
        fieldsClone[fieldIndex] = isValid;
        setFieldsValidity(fieldsClone);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={close}
            onConfirm={close}
            title="Ajouter un orgue"
        >
            <div className="add-modal-content">
                {fields.map((field, i) => (
                    <Input
                        key={"field" + i}
                        value={fieldsValues[i]}
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

export { AddModal };
