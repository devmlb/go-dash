import type { ChangeEvent, JSX } from "react";

import "./Input.css";

function Input({
    placeholder,
    value,
    setValue,
    regexValidation,
    validationErrorText,
    setIsValid,
}: {
    placeholder?: string;
    value: string;
    setValue: (v: string) => void;
    regexValidation?: RegExp;
    validationErrorText?: string;
    setIsValid?: (v: boolean) => void;
}): JSX.Element {
    const isValidInput = (input: string): boolean => {
        return !regexValidation || regexValidation.test(input);
    };

    const getValidationError = (input: string): string | null => {
        if (regexValidation && !regexValidation.test(input)) {
            return validationErrorText ?? "Valeur incorrecte";
        }

        return null;
    };

    const error = getValidationError(value);

    const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
        const inputValue = e.target.value;

        if (setIsValid) setIsValid(isValidInput(inputValue));
        setValue(inputValue);
    };

    return (
        <label className="input">
            <input
                name={placeholder}
                placeholder=" "
                type="text"
                value={value}
                onChange={handleInput}
            />
            <span data-label={placeholder} />
            {error && <span className="error">{error}</span>}
        </label>
    );
}

export { Input };
