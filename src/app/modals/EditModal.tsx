import { JSX, useEffect, useReducer } from "react";
import { Pen } from "lucide-react";

import "./EditModal.css";
import { Modal } from "../../components/modal/Modal";
import { Input } from "../../components/input/Input";
import type { Organ } from "../../utils/types/organ.type";
import { useApi } from "../../utils/hooks/api.hook";
import { organApi } from "../../api/organ.api";
import { TextButton } from "../../components/button/Button";
import { extractIntIfFound } from "../../utils/extract";

interface FormFields {
    [key: string]:
        | {
              value: string;
              isValid: boolean;
              placeholder: string;
              regexValidation?: RegExp;
              validationErrorText?: string;
          }
        | {
              value: string;
              required: boolean;
              legend: string;
              action: () => Promise<string | null>;
          };
}

type FormFieldsAction =
    | {
          type: "reset";
          fields: FormFields;
      }
    | {
          type: "setValue";
          key: string;
          value: string;
      }
    | {
          type: "setValidity";
          key: string;
          isValid: boolean;
      };

function formFieldsReducer(
    state: FormFields,
    action: FormFieldsAction,
): FormFields {
    switch (action.type) {
        case "reset":
            return action.fields;
        case "setValue": {
            const field = state[action.key];
            if (!field) return state;

            return {
                ...state,
                [action.key]: {
                    ...field,
                    value: action.value,
                },
            };
        }
        case "setValidity": {
            const field = state[action.key];
            if (!field || !("isValid" in field)) return state;

            return {
                ...state,
                [action.key]: {
                    ...field,
                    isValid: action.isValid,
                },
            };
        }
    }
}

function buildFormFields(organInfos: Organ | null): FormFields {
    const defaults: FormFields = {
        name: {
            value: "",
            isValid: false,
            placeholder: "Nom",
            regexValidation: /^.+$/,
            validationErrorText: "Nom invalide : au moins 1 caractère requis.",
        },
        country: {
            value: "",
            isValid: false,
            placeholder: "Pays",
            regexValidation: /^.+$/,
            validationErrorText: "Pays invalide : au moins 1 caractère requis.",
        },
        year: {
            value: "",
            isValid: true,
            placeholder: "Année de construction",
            regexValidation: /^$|^[0-9]{4}$/,
            validationErrorText:
                "Année invalide : 4 caractères numériques requis.",
        },
        builder: {
            value: "",
            isValid: true,
            placeholder: "Facteur d'orgue",
        },
        stops: {
            value: "",
            isValid: true,
            placeholder: "Nombre de jeux",
            regexValidation: /^[0-9]*$/,
            validationErrorText: "Nombre de jeux invalide.",
        },
        keyboards: {
            value: "",
            isValid: true,
            placeholder: "Nombre de claviers",
            regexValidation: /^[0-9]*$/,
            validationErrorText: "Nombre de claviers invalide.",
        },
        features: {
            value: "",
            isValid: true,
            placeholder: "Autres caractéristiques",
        },
        url: {
            value: "",
            isValid: true,
            placeholder: "URL externe",
            regexValidation: /^$|^(http|https):\/\/.*\..*$/,
            validationErrorText: "URL invalide.",
        },
        path: {
            value: "",
            required: true,
            legend: "Chemin du fichier d'orgue",
            action: organApi.chooseGOFile,
        },
        coverPath: {
            value: "",
            required: false,
            legend: "Chemin de l'image de couverture",
            action: organApi.chooseImage,
        },
        previewPath: {
            value: "",
            required: false,
            legend: "Chemin de l'aperçu",
            action: organApi.chooseImage,
        },
    };

    if (organInfos) {
        (Object.keys(organInfos) as (keyof typeof organInfos)[]).forEach(
            (key) => {
                if (key === "id") return;

                if (typeof organInfos[key] === "number") {
                    defaults[key].value = organInfos[key].toString();
                } else {
                    defaults[key].value = organInfos[key]
                        ? organInfos[key]
                        : "";
                }

                if (
                    "isValid" in defaults[key] &&
                    !defaults[key].isValid &&
                    organInfos[key]
                ) {
                    defaults[key].isValid = true;
                }
            },
        );
    }

    return defaults;
}

function extractFilename(filePath: string | null | undefined): string | null {
    if (!filePath) return null;
    const filename = filePath.match(/[^\\/]*\.[a-zA-Z]+$/);
    return filename ? filename[0] : filePath;
}

function EditModal({
    isOpen,
    close,
    organId,
    onSaved,
}: {
    isOpen: boolean;
    close: () => void;
    organId?: string;
    onSaved?: () => void;
}): JSX.Element {
    const { data: organInfos } = useApi<Organ | null>(
        organId
            ? async (): Promise<Organ> => await organApi.getById(organId)
            : async (): Promise<null> => null,
        [organId],
    );

    const [formFields, dispatchFormFields] = useReducer(
        formFieldsReducer,
        buildFormFields(null),
    );

    useEffect(() => {
        dispatchFormFields({
            type: "reset",
            fields: buildFormFields(organInfos),
        });
    }, [organInfos]);

    const setFieldValue = (key: string, value: string): void => {
        dispatchFormFields({ type: "setValue", key, value });
    };

    const setInputValidity = (inputKey: string, isValid: boolean): void => {
        dispatchFormFields({ type: "setValidity", key: inputKey, isValid });
    };

    const isFormValid = (): boolean => {
        return Object.keys(formFields).every((fieldKey) => {
            const field = formFields[fieldKey];
            if ("isValid" in field) {
                return field.isValid;
            } else {
                return field.required ? !!field.value : true;
            }
        });
    };

    const handlePathSelection = async (
        formKey: string,
        fn: () => Promise<string | null>,
    ): Promise<void> => {
        const path = await fn();
        setFieldValue(formKey, path ? path : "");
    };

    const closeAndSave = async (): Promise<void> => {
        const newOrgan = {
            name: formFields["name"].value,
            country: formFields["country"].value,
            year: extractIntIfFound(formFields["year"].value),
            builder: formFields["builder"].value
                ? formFields["builder"].value
                : undefined,
            features: formFields["features"].value
                ? formFields["features"].value
                : undefined,
            stops: extractIntIfFound(formFields["stops"].value),
            keyboards: extractIntIfFound(formFields["keyboards"].value),
            url: formFields["url"].value ? formFields["url"].value : undefined,
            path: formFields["path"].value,
            previewPath: formFields["previewPath"].value
                ? formFields["previewPath"].value
                : undefined,
            coverPath: formFields["coverPath"].value
                ? formFields["coverPath"].value
                : undefined,
        };

        if (organInfos) {
            await organApi.update(organInfos.id, newOrgan);
        } else {
            await organApi.add(newOrgan);
        }

        close();
        onSaved?.();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={close}
            onConfirm={closeAndSave}
            title={organId ? "Modifier un orgue" : "Ajouter un orgue"}
            isConfirmActionEnabled={isFormValid()}
            titleIcon={<Pen />}
        >
            <div className="edit-modal-content">
                {Object.keys(formFields).map((fieldKey) => {
                    const field = formFields[fieldKey];
                    if ("isValid" in field) {
                        return (
                            <Input
                                key={"field" + fieldKey}
                                value={field.value}
                                setValue={(v) => setFieldValue(fieldKey, v)}
                                placeholder={field.placeholder}
                                regexValidation={field.regexValidation}
                                validationErrorText={field.validationErrorText}
                                setIsValid={(v) =>
                                    setInputValidity(fieldKey, v)
                                }
                            />
                        );
                    } else {
                        return (
                            <div
                                key={"field" + fieldKey}
                                className="file-selection"
                            >
                                <span className="description">
                                    {field.legend} :
                                    <span
                                        className={
                                            field.required && !field.value
                                                ? "error"
                                                : ""
                                        }
                                    >
                                        {extractFilename(field.value) ??
                                            "Aucun"}
                                    </span>
                                </span>
                                <TextButton
                                    text="Sélectionner"
                                    secondary
                                    onClick={() =>
                                        handlePathSelection(
                                            fieldKey,
                                            field.action,
                                        )
                                    }
                                />
                            </div>
                        );
                    }
                })}
            </div>
        </Modal>
    );
}

export { EditModal };
