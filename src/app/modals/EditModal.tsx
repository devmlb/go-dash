import { type JSX, useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { Pen } from "lucide-react";

import "./EditModal.css";
import { Modal } from "../../components/modal/Modal";
import { Input } from "../../components/input/Input";
import type { Organ } from "../../utils/types/organ.type";
import { useApi } from "../../utils/hooks/api.hook";
import { organApi } from "../../api/organ.api";
import { TextButton } from "../../components/button/Button";
import { extractIntIfFound } from "../../utils/extract";

type FormFields = Record<
    string,
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
      }
>;

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

function buildFormFields(
    organInfos: Organ | null,
    t: ReturnType<typeof useTranslation>["t"],
): FormFields {
    const defaults: FormFields = {
        name: {
            value: "",
            isValid: false,
            placeholder: t("modal.edit.form.name"),
            regexValidation: /^.+$/,
            validationErrorText: t("modal.edit.validation.name"),
        },
        country: {
            value: "",
            isValid: false,
            placeholder: t("modal.edit.form.country"),
            regexValidation: /^.+$/,
            validationErrorText: t("modal.edit.validation.country"),
        },
        year: {
            value: "",
            isValid: true,
            placeholder: t("modal.edit.form.year"),
            regexValidation: /^$|^[0-9]{4}$/,
            validationErrorText: t("modal.edit.validation.year"),
        },
        builder: {
            value: "",
            isValid: true,
            placeholder: t("modal.edit.form.builder"),
        },
        stops: {
            value: "",
            isValid: true,
            placeholder: t("modal.edit.form.stops"),
            regexValidation: /^[0-9]*$/,
            validationErrorText: t("modal.edit.validation.stops"),
        },
        keyboards: {
            value: "",
            isValid: true,
            placeholder: t("modal.edit.form.keyboards"),
            regexValidation: /^[0-9]*$/,
            validationErrorText: t("modal.edit.validation.keyboards"),
        },
        features: {
            value: "",
            isValid: true,
            placeholder: t("modal.edit.form.features"),
        },
        url: {
            value: "",
            isValid: true,
            placeholder: t("modal.edit.form.url"),
            regexValidation: /^$|^(http|https):\/\/.*\..*$/,
            validationErrorText: t("modal.edit.validation.url"),
        },
        path: {
            value: "",
            required: true,
            legend: t("modal.edit.form.path"),
            action: organApi.chooseGOFile,
        },
        coverPath: {
            value: "",
            required: false,
            legend: t("modal.edit.form.coverPath"),
            action: organApi.chooseImage,
        },
        previewPath: {
            value: "",
            required: false,
            legend: t("modal.edit.form.previewPath"),
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
    const { t } = useTranslation();

    const { data: organInfos } = useApi<Organ | null>(
        organId
            ? async (): Promise<Organ> => await organApi.getById(organId)
            : async (): Promise<null> => null,
        [organId],
    );

    const [formFields, dispatchFormFields] = useReducer(
        formFieldsReducer,
        buildFormFields(null, t),
    );

    useEffect(() => {
        dispatchFormFields({
            type: "reset",
            fields: buildFormFields(organInfos, t),
        });
    }, [organInfos, t]);

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
            onCancel={close}
            onConfirm={closeAndSave}
            title={
                organId ? t("modal.edit.title.edit") : t("modal.edit.title.add")
            }
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
                                    <span className="legend">
                                        {field.legend}
                                    </span>
                                    <span
                                        className={
                                            field.required && !field.value
                                                ? "error"
                                                : ""
                                        }
                                    >
                                        {extractFilename(field.value) ??
                                            t("modal.edit.form.noFileSelected")}
                                    </span>
                                </span>
                                <TextButton
                                    text={t("modal.edit.buttons.select")}
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
