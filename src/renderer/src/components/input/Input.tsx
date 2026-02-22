import { ChangeEvent, JSX, useState } from "react";

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
    const [error, setError] = useState<string | null>(null);

    const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
        console.log(e);
        if (regexValidation && !regexValidation.test(e.target.value)) {
            setError(validationErrorText ?? "Valeur incorrecte");
            if (setIsValid) setIsValid(false);
        } else {
            setError(null);
            if (setIsValid) setIsValid(true);
        }
        setValue(e.target.value);
    };

    return (
        <label className="input">
            <input
                name={value}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleInput}
            />
            {error && <span className="error">{error}</span>}
        </label>
    );
}

export { Input };
