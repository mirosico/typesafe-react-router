import { createLink, createRoute, createRouter } from '../lib';
import { User } from './pages/User.tsx';
import { AboutUs } from './pages/AboutUs.tsx';
import { Main } from './pages/Main.tsx';

const routes = [
    createRoute('/users/:userId/test/:testId', User),
    createRoute('/about', AboutUs),
    createRoute('/', Main),
];

const Link = createLink(routes);
const Router = createRouter(routes);

export { Link, Router };
