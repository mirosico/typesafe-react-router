import { Router } from './appRouter.ts';

function App() {
    const currentPath = window.location.pathname;
    return <Router initialPath={currentPath} />;
}

export default App;
