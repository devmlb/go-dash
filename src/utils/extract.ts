function extractIntIfFound(s: unknown): number | undefined {
    if (!s || typeof s !== "string") return undefined;

    const parsedInt = parseInt(s);
    return parsedInt && !isNaN(parsedInt) ? parsedInt : undefined;
}

export { extractIntIfFound };
