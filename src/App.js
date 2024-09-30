import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Cars from "./pages/Cars/Cars";
import Cities from "./pages/Cities/Cities";
import Brands from "./pages/Brands/Brands";
import Locations from "./pages/Locations/Locations";
import Models from "./pages/Models/Models";
import Settings from "./pages/Settings/Settings";
import Login from "./components/Login/Login";
import { useTokenStore } from "./zustand/TokenStore";

function App() {
  const { token } = useTokenStore();

  return (
    <>
      {token && token.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9") ? (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="cars" element={<Cars />} />
            <Route path="cities" element={<Cities />} />
            <Route path="brands" element={<Brands />} />
            <Route path="locations" element={<Locations />} />
            <Route path="models" element={<Models />} />
          </Route>
        </Routes>
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;
