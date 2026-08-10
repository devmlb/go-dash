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
import { Switch } from "../../components/switch/Switch";

type FormFields = Record<
    string,
    | {
          type: "input";
          value: string;
          isValid: boolean;
          placeholder: string;
          regexValidation?: RegExp;
          validationErrorText?: string;
      }
    | {
          type: "file";
          value: string;
          required: boolean;
          legend: string;
          action: () => Promise<string | null>;
      }
    | {
          type: "switch";
          value: boolean;
          legend: string;
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
          value: string | boolean;
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

            if (typeof action.value === "boolean") {
                if (field.type !== "switch") {
                    throw new Error(`Invalid value type for '${action.key}'`);
                }

                return {
                    ...state,
                    [action.key]: {
                        ...field,
                        value: action.value,
                    },
                };
            }

            if (field.type === "switch") {
                throw new Error(`Invalid value type for '${action.key}'`);
            }

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
            type: "input",
            value: "",
            isValid: false,
            placeholder: t("modal.edit.form.name"),
            regexValidation: /^.+$/,
            validationErrorText: t("modal.edit.validation.name"),
        },
        country: {
            type: "input",
            value: "",
            isValid: false,
            placeholder: t("modal.edit.form.country"),
            regexValidation: /^.+$/,
            validationErrorText: t("modal.edit.validation.country"),
        },
        year: {
            type: "input",
            value: "",
            isValid: true,
            placeholder: t("modal.edit.form.year"),
            regexValidation: /^$|^[0-9]{4}$/,
            validationErrorText: t("modal.edit.validation.year"),
        },
        builder: {
            type: "input",
            value: "",
            isValid: true,
            placeholder: t("modal.edit.form.builder"),
        },
        stops: {
            type: "input",
            value: "",
            isValid: true,
            placeholder: t("modal.edit.form.stops"),
            regexValidation: /^[0-9]*$/,
            validationErrorText: t("modal.edit.validation.stops"),
        },
        keyboards: {
            type: "input",
            value: "",
            isValid: true,
            placeholder: t("modal.edit.form.keyboards"),
            regexValidation: /^[0-9]*$/,
            validationErrorText: t("modal.edit.validation.keyboards"),
        },
        hasPedals: {
            type: "switch",
            value: true,
            legend: t("modal.edit.form.pedals"),
        },
        features: {
            type: "input",
            value: "",
            isValid: true,
            placeholder: t("modal.edit.form.features"),
        },
        url: {
            type: "input",
            value: "",
            isValid: true,
            placeholder: t("modal.edit.form.url"),
            regexValidation: /^$|^(http|https):\/\/.*\..*$/,
            validationErrorText: t("modal.edit.validation.url"),
        },
        path: {
            type: "file",
            value: "",
            required: true,
            legend: t("modal.edit.form.path"),
            action: organApi.chooseGOFile,
        },
        coverPath: {
            type: "file",
            value: "",
            required: false,
            legend: t("modal.edit.form.coverPath"),
            action: organApi.chooseImage,
        },
        previewPath: {
            type: "file",
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

                if (typeof organInfos[key] === "boolean") {
                    defaults[key].value = organInfos[key];
                } else if (typeof organInfos[key] === "number") {
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

    const setFieldValue = (key: string, value: string | boolean): void => {
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
            } else if (!("required" in field)) {
                return true;
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
        const getInputValue = (key: string): string => {
            const field = formFields[key];
            return field.type === "input" ? field.value : "";
        };

        const getFileValue = (key: string): string | undefined => {
            const field = formFields[key];
            return field.type === "file" && field.value
                ? field.value
                : undefined;
        };

        const newOrgan = {
            name: getInputValue("name"),
            country: getInputValue("country"),
            year: extractIntIfFound(getInputValue("year")),
            builder: getInputValue("builder") || undefined,
            features: getInputValue("features") || undefined,
            stops: extractIntIfFound(getInputValue("stops")),
            keyboards: extractIntIfFound(getInputValue("keyboards")),
            hasPedals: !!formFields["hasPedals"].value,
            url: getInputValue("url") || undefined,
            path: getFileValue("path") ?? "",
            previewPath: getFileValue("previewPath"),
            coverPath: getFileValue("coverPath"),
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
                    if (field.type === "input") {
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
                    } else if (field.type === "switch") {
                        return (
                            <div
                                key={"field" + fieldKey}
                                className="switch-view"
                            >
                                <span className="description">
                                    {field.legend}
                                </span>
                                <Switch
                                    isChecked={field.value}
                                    setIsChecked={(v) =>
                                        setFieldValue(fieldKey, v)
                                    }
                                />
                            </div>
                        );
                    } else if (field.type === "file") {
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
