import { useEffect, useState } from "react";

type ApiState<T> = {
    data: T | null;
    isLoading: boolean;
    error: string | null;
};

function useApi<T>(
    apiCall: () => Promise<T>,
    deps: unknown[] = [],
): ApiState<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData(): Promise<void> {
            try {
                setLoading(true);
                setError(null);

                const result = await apiCall();
                if (!cancelled) setData(result);
            } catch (err) {
                if (!cancelled) {
                    setError("Unexpected error: " + err);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        let cancelled = false;
        fetchData();

        return (): void => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps]);

    return { data, isLoading, error };
}

export { useApi };
