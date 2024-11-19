import { createRouter } from "./Router3";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {[1, 2, 3].map((id) => (
          <li key={id}>
            <Link to="/orders/:id" params={{ id }}>
              Order {id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Order() {
  const { id } = useParams();
  return (
    <div>
      <h1>Order {id}</h1>
    </div>
  );
}

const Routes = {
    Dashboard: '/dashboard',

}

const config = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/orders/:id",
    element: <Order />,
  },
];

const Router = createRouter(config);

function App() {
  return <Router config={config} />;
}

export default App;
