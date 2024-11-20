type ExtractRouteParams<Path extends string> =
    Path extends `${infer _Start}:${infer Param}/${infer Rest}`
        ? { [k in Param]: string } & ExtractRouteParams<`/${Rest}`>
        : Path extends `${infer _Start}:${infer Param}`
          ? { [k in Param]: string }
          : Record<never, never>;

type IsEmptyObject<T extends Record<any, any>> = keyof T extends never
    ? true
    : false;

const matchPath = (pathPattern: string, currentPath: string): boolean => {
    const regex = pathPatternToRegex(pathPattern);
    return regex.test(currentPath);
};

const pathPatternToRegex = (pathPattern: string): RegExp => {
    const regexPattern = '^' + pathPattern.replace(/:[^/]+/g, '([^/]+)') + '$';
    return new RegExp(regexPattern);
};

const extractParamNames = (pathPattern: string): string[] => {
    return (pathPattern.match(/:[^/]+/g) || []).map((param) => param.slice(1));
};

const extractParamValues = (
    pathPattern: string,
    currentPath: string,
): string[] => {
    const regex = pathPatternToRegex(pathPattern);
    return (currentPath.match(regex) || []).slice(1);
};

const extractParams = <Path extends string>(
    pathPattern: Path,
    currentPath: string,
): ExtractRouteParams<Path> => {
    const paramValues = extractParamValues(pathPattern, currentPath);
    const paramNames = extractParamNames(pathPattern);
    if (paramValues.length !== paramNames.length) {
        return {} as ExtractRouteParams<Path>;
    }
    return paramNames.reduce((params, name, index) => {
        return {
            ...params,
            [name]: paramValues[index],
        };
    }, {} as ExtractRouteParams<Path>);
};

const buildPath = (path: string, params?: Record<string, string>): string => {
    let builtPath = path;
    params &&
        Object.keys(params).forEach((key) => {
            builtPath = builtPath.replace(`:${key}`, params[key]);
        });
    return builtPath;
};

export {
    matchPath,
    extractParams,
    buildPath,
    extractParamNames,
    extractParamValues,
};

export type { ExtractRouteParams, IsEmptyObject };
