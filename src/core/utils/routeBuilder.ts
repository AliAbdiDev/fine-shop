type RouteParam = string | number;
type QueryParams = Record<string, string | number | boolean | null | undefined>;

export interface BuildRouteOptions {
    params?: Record<string, RouteParam>;
    query?: QueryParams;
}

export function createRoute<Path>(
    base: string,
    segments: Path | (Path)[],
    options?: BuildRouteOptions
): string {
    const normalizedBase = base.replace(/\/+$/, "");
    const segmentArray = Array.isArray(segments) ? segments : [segments];

    let fullPath = [normalizedBase, ...segmentArray.map(String)]
        .join("/")
        .replace(/\/+/g, "/");

    if (options?.params) {
        for (const [key, value] of Object.entries(options.params)) {
            const paramValue = String(value);
            fullPath = fullPath
                .replace(`:${key}`, paramValue)
                .replace(`[${key}]`, paramValue);
        }
    }

    if (options?.query) {
        const searchParams = new URLSearchParams();
        Object.entries(options.query).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) fullPath += `?${queryString}`;
    }

    return fullPath;
}

export const ROUTES = {
    HOME: "/",
    SIGNIN: "/signin",
    SIGNIN_VERIFY: "/signin/verify",
    ADMIN: "/admin",
    PRODUCTS: "/products",
} as const;
