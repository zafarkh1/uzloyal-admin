import { Route, Routes } from "react-router-dom";
import { useTokenStore } from "./zustand/TokenStore";
import Layout from "./layout/Layout";
import Login from "./components/Login/Login";
import Faqs from "./pages/Faqs/Faqs";
import Categories from "./pages/Categories/Categories";
import News from "./pages/News/News";
import Blogs from "./pages/Blogs/Blogs";
import Services from "./pages/Services/Services";
import Sources from "./pages/Sources/Sources";

function App() {
  const { token } = useTokenStore();

  return (
    <>
      {token && token.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9") ? (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Categories />} />
            <Route path="faqs" element={<Faqs />} />
            <Route path="news" element={<News />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="services" element={<Services />} />
            <Route path="sources" element={<Sources />} />
          </Route>
        </Routes>
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;
