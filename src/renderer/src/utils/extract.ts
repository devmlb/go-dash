function extractIntIfFound(s: unknown): number | null {
    if (!s || typeof s !== "string") return null;

    const parsedInt = parseInt(s);
    return parsedInt && !isNaN(parsedInt) ? parsedInt : null;
}

export { extractIntIfFound };
