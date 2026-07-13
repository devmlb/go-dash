function base64ToUtf8String(base64String: string) {
    const binString = atob(base64String);

    const bytes = Uint8Array.from(binString, (m) => {
        const code = m.codePointAt(0);
        if (!code) throw new Error("Uint8Array convert error");
        return code;
    });

    return new TextDecoder().decode(bytes);
}

function utf8StringToBase64(string: string) {
    const bytes = new TextEncoder().encode(string);

    const binString = Array.from(bytes, (byte) =>
        String.fromCodePoint(byte),
    ).join("");

    return btoa(binString);
}

export { base64ToUtf8String, utf8StringToBase64 };
