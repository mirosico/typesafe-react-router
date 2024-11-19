import React from 'react';

type ExtractRouteParams<Path extends string> =
    Path extends `${infer _Start}:${infer Param}/${infer Rest}`
        ? { [k in Param]: string } & ExtractRouteParams<`/${Rest}`>
        : Path extends `${infer _Start}:${infer Param}`
            ? { [k in Param]: string }
            : object;

type IsEmptyObject<T extends object> = keyof T extends never ? true : false;

type RouteDefinition<Path extends string> = {
  path: Path;
  component: React.ComponentType<ExtractRouteParams<Path>>;
};

// Utility function to match a path pattern against the current path
function matchPath(pathPattern: string, currentPath: string): boolean {
  const regexPattern = '^' + pathPattern.replace(/:[^/]+/g, '([^/]+)') + '$';
  const regex = new RegExp(regexPattern);
  return regex.test(currentPath);
}

// Utility function to extract parameters from the current path
function extractParams<Path extends string>(
    pathPattern: Path,
    currentPath: string
): ExtractRouteParams<Path> {
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

// Utility function to build a path string from a pattern and parameters
function buildPath<Path extends string>(
    path: Path,
    params?: ExtractRouteParams<Path>
): string {
  let builtPath = path as string;
  if (params) {
    for (const key in params) {
      builtPath = builtPath.replace(`:${key}`, params[key]);
    }
  }
  return builtPath;
}

// Function to create a router with typed Router and Link components
export function createRouter<Route extends RouteDefinition<string>>(
    routes: readonly Route[]
) {
  type Paths = Route['path'];

  interface RouterContextType {
    currentPath: string;
    navigate: (path: string) => void;
  }

  const RouterContext = React.createContext<RouterContextType | undefined>(
      undefined
  );

  // Router component
  const Router: React.FC<{ initialPath?: string }> = ({
                                                        initialPath = '/',
                                                      }) => {
    const [currentPath, setCurrentPath] = React.useState(initialPath);

    const navigate = (path: string) => {
      setCurrentPath(path);
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
              React.createElement(
                  route.component,
                  extractParams(route.path, currentPath)
              )
          ) : (
              <NotFound />
          )}
        </RouterContext.Provider>
    );
  };

  // Type definition for Link component props
  type LinkProps<Path extends Paths> = IsEmptyObject<
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

  // Link component
  function Link<Path extends Paths>({ to, params, children }: LinkProps<Path>) {
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



  // NotFound component for handling 404 routes
  function NotFound() {
    return <div>404 Not Found</div>;
  }

  return { Router, Link };
}


const UserComponent = (props: {
    userId: string;
    testId: string;
    }
) => {
  return  <Link to="/users/:userId/test/:testId" params={{ userId: '123', testId: 'rer' }}>
    Go to User 123
  </Link>
};

const AboutComponent = () => {
  return <div>About Us</div>;
};

const createRoute = <Path extends string, Component extends React.ComponentType<ExtractRouteParams<Path>>>(
    path: Path,
    component: Component
): RouteDefinition<Path> => ({ path, component });



const userRoute = createRoute('/users/:userId/test/:testId', UserComponent);
const aboutRoute = createRoute('/about', AboutComponent);


const routes = [
  userRoute,
  aboutRoute,
];

const hardCodedRoutes = [
    {
      path: '/users/:userId/test/:testId',
        component: UserComponent,
    },
    {
      path: '/about',
        component: AboutComponent,
    }];



const { Router, Link } = createRouter(routes);

// Your main application component
function App() {
  return (
      <Router initialPath="/"/>
  );
}

