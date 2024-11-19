import React from "react";
import {createRoute, createRouter, createLink} from "./router.tsx";



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


const routes = [
    createRoute('/users/:userId/test/:testId', UserComponent),
    createRoute('/about', AboutComponent),
];

const Link = createLink(routes);
const Router = createRouter(routes);



// Your main application component
function App() {
    return (
        <Router initialPath="/"/>
    );
}