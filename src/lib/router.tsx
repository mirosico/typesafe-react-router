import React from 'react';
import {buildPath, extractParams, ExtractRouteParams, IsEmptyObject, matchPath} from './utils';


type RouteDefinition<Path extends string> = {
    path: Path;
    component: React.ComponentType<ExtractRouteParams<Path>>;
};

interface RouterContextType {
    currentPath: string;
    navigate: (path: string) => void;
}

interface RouterProps {
    routes: RouteDefinition<string>[];
    initialPath: string;
    pageNotFound?: React.ReactNode;
}

type LinkProps<Path extends string> = IsEmptyObject<
    ExtractRouteParams<Path>
> extends true
    ? {
        to: Path;
        params?: undefined;
        children: React.ReactNode;
    }
    : {
        to: Path;
        params: ExtractRouteParams<Path>;
        children: React.ReactNode;
    };


const NotFound: React.FC = () => {
    return <div>404 Not Found</div>;
}

const RouterContext = React.createContext<RouterContextType | undefined>(undefined);


const Router: React.FC<RouterProps> = ({
                                           routes,
                                           initialPath = '/',
                                           pageNotFound = <NotFound/>,
                                       }) => {
    const [currentPath, setCurrentPath] = React.useState(initialPath);

    const navigate = (path: string) => {
        setCurrentPath(path);
        window.history.pushState({}, "", path);
    };

    const route = routes.find(r => matchPath(r.path, currentPath));

    const routerContextValue = React.useMemo(
        () => ({
            currentPath,
            navigate,
        }),
        [currentPath]
    );

    return (
        <RouterContext.Provider value={routerContextValue}>
            {route ? (
                <route.component {...extractParams(route.path, currentPath)}/>
            ) : (
                pageNotFound
            )}
        </RouterContext.Provider>
    );
};

const createRouter = <Path extends string>(
    routes: RouteDefinition<Path>[]
) => {
    const TypedRouter: React.FC<Omit<RouterProps, 'routes'>> = (props) => {
        return <Router routes={routes} {...props} />;
    };
    return TypedRouter;
}



// eslint-disable-next-line @typescript-eslint/no-unused-vars
    const createLink = <PathDefined extends string, >(routes: RouteDefinition<PathDefined>[]) => {
    const TypedLink = <Path extends PathDefined, >({to, params, children}: LinkProps<Path>) => {
        const context = React.useContext(RouterContext);
        if (!context) {
            throw new Error('Link must be used within a Router');
        }

        const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            const path = buildPath(to, params);
            context.navigate(path);
        };


        return (
            <a href={'#'} onClick={handleClick}>
                {children}
            </a>
        );
    }
    return TypedLink;
}

const createRoute = <Path extends string>(
    path: RouteDefinition<Path>['path'],
    component: RouteDefinition<Path>['component']
): RouteDefinition<Path> => ({path, component});


export {
    createRoute,
    createRouter,
    createLink,
}
