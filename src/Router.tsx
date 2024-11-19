import React, { createContext, ReactNode, useContext, useMemo, useState } from "react";

// Extract Parameters from a Path
type ExtractRouteParams<Path extends string> =
    Path extends `${infer _Start}:${infer Param}/${infer Rest}`
        ? { [K in Param]: string } & ExtractRouteParams<`/${Rest}`>
        : Path extends `${infer _Start}:${infer Param}`
            ? { [K in Param]: string }
            : {};

// Route Configuration Type
type Route<Path extends string> = {
  path: Path;
  element: ReactNode;
};

type Routes = Record<string, Route<string>>;

// Router Context Type
interface RouterContextType<Routes extends Record<string, Route<string>>> {
  currentPath: string;
  navigate: (to: keyof Routes, params?: ExtractRouteParams<Routes[keyof Routes]["path"]>) => void;
}

const RouterContext = createContext<RouterContextType<any> | null>(null);

// Router Component
export const Router = <R extends Routes>({ routes }: { routes: R }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const navigate = (to: keyof R, params?: ExtractRouteParams<R[keyof R]["path"]>) => {
    const route = routes[to];
    if (!route) throw new Error(`Route "${String(to)}" not found`);

    const path = generatePath(route.path, params || {});
    setCurrentPath(path);
    window.history.pushState({}, "", path);
  };

  const matchedRoute = useMemo(() => {
    return Object.values(routes).find((route) => matchPath(route.path, currentPath));
  }, [currentPath, routes]);

  return (
      <RouterContext.Provider value={{ currentPath, navigate }}>
        {matchedRoute ? matchedRoute.element : <h1>404: Page Not Found</h1>}
      </RouterContext.Provider>
  );
};

// Helper: Match Path with Params
const matchPath = (routePath: string, currentPath: string) => {
  const routeSegments = routePath.split("/");
  const currentSegments = currentPath.split("/");

  if (routeSegments.length !== currentSegments.length) return false;

  return routeSegments.every((segment, i) =>
      segment.startsWith(":") || segment === currentSegments[i]
  );
};

// Generate Path with Params
const generatePath = (path: string, params: Record<string, string>) => {
  return path.replace(/:([^/]+)/g, (_, key) => {
    if (!(key in params)) {
      throw new Error(`Missing parameter "${key}"`);
    }
    return params[key];
  });
};

// Link Component
type LinkProps<R extends Routes, RouteKey extends keyof R> = {
  to: RouteKey;
  params?: ExtractRouteParams<R[RouteKey]["path"]>;
  children: ReactNode;
};

export const Link = <R extends Routes, RouteKey extends keyof R>({
                                                                   to,
                                                                   params,
                                                                   children,
                                                                 }: LinkProps<R, RouteKey>) => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("Link must be used within a Router");
  }

  const { navigate } = context;

  return (
      <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(to, params);
          }}
      >
        {children}
      </a>
  );
};

// useParams Hook
export const useParams = <R extends Routes, RouteKey extends keyof R>(
    currentRoute: RouteKey
): ExtractRouteParams<R[RouteKey]["path"]> => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useParams must be used within a Router");
  }

  const { currentPath } = context;
  const route = context.currentPath;

  const paramNames = context.currentPath.match(/:([^/]+)/g) || [];
  const values = currentPath.split("/");

  return paramNames.reduce((acc, param, index) => {
    acc[param.substring(1)] = values[index];
    return acc;
  }, {} as any);
};
