function sortArrayOfObjectByField<T extends object>(
    array: T[],
    fieldName: keyof T,
    ascendant: boolean,
): T[] {
    const sortingFn = (a: T, b: T): number => {
        if (a[fieldName] < b[fieldName]) {
            return ascendant ? -1 : 1;
        } else if (b[fieldName] < a[fieldName]) {
            return ascendant ? 1 : -1;
        }
        return 0;
    };
    return array.sort(sortingFn);
}

export { sortArrayOfObjectByField };
