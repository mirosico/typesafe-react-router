
type ExtractRouteParams<Path extends string> =
    Path extends `${infer _Start}:${infer Param}/${infer Rest}`
        ? { [k in Param]: string } & ExtractRouteParams<`/${Rest}`>
        : Path extends `${infer _Start}:${infer Param}`
            ? { [k in Param]: string }
            : Record<string, string>;

type IsEmptyObject<T extends object> = keyof T extends never ? true : false;


const matchPath = (pathPattern: string, currentPath: string): boolean => {
    const regexPattern = '^' + pathPattern.replace(/:[^/]+/g, '([^/]+)') + '$';
    const regex = new RegExp(regexPattern);
    return regex.test(currentPath);
}

const extractParams = <Path extends string>(
    pathPattern: Path,
    currentPath: string
): ExtractRouteParams<Path> => {
    const paramNames = (pathPattern.match(/:[^/]+/g) || []).map(param =>
        param.slice(1)
    );

    const regexPattern = '^' + pathPattern.replace(/:[^/]+/g, '([^/]+)') + '$';
    const regex = new RegExp(regexPattern);
    const match = currentPath.match(regex);

    const params = {} as ExtractRouteParams<Path>;
    if (match) {
        paramNames.forEach((name, index) => {
            params[name] = match[index + 1];
        });
    }

    return params;
}

const buildPath = (
    path: string,
    params?: Record<string, string>
): string => {
    let builtPath = path;
    if (params) {
        for (const key in params) {
            builtPath = builtPath.replace(`:${key}`, params[key]);
        }
    }
    return builtPath;
}


export {
    matchPath,
    extractParams,
    buildPath,
}

export type { ExtractRouteParams, IsEmptyObject }
