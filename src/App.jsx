import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import { useAuthContext } from "./contex/index.jsx";
import Header from "./components/Header/Header";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import PreBookingHistory from "./Pages/PreBookingHistory.jsx";
import PreBookingCreate from "./Pages/PreBookingCreate.jsx";
import Account from "./Pages/Account.jsx";
import SubAdminPreBookingDetails from "./Pages/SubAdminPreBookingDetails.jsx";

function App() {
  return <AppRoutes />;
}

function AppRoutes() {
  const { isSubAdminAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isSubAdminAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute isSubAdminAuthenticated={isSubAdminAuthenticated}>
            <Layout>
              <Routes>
                <Route index path="/" element={<Home />} />

                <Route index path="/create" element={<PreBookingCreate />} />

                <Route path="/history">
                  <Route index element={<PreBookingHistory />} />
                  <Route
                    path="details"
                    element={<SubAdminPreBookingDetails />}
                  />
                </Route>

                <Route path="/account" element={<Account />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaQueryChange = (event) => {
      if (event.matches) {
        setSidebarOpen(false);
      }
    };
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () =>
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  return (
    <div className="h-screen overflow-hidden ">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex justify-normal items-start  w-full relative">
        <div
          className={`overflow-auto w-full max-w-60 hidden z-10 ${
            sidebarOpen ? "xs:block absolute" : "md:block"
          }`}
        >
          <div className="pt-24 h-screen w-60">
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        </div>

        <div
          className={`bg-[#f0f0f5] w-full  overflow-auto ${
            sidebarOpen ? "xs:blur-md sm:blur-md" : ""
          }`}
        >
          <div className="pt-24">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
