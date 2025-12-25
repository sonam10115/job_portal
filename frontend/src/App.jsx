import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import Home from "./components/components_lite/Home";
import { RouterProvider } from "react-router-dom";
// import PrivacyPolicy from "./components/components_lite/PrivacyPolicy";
import TermsOfService from "./components/components_lite/termofService";
import Jobs from "./components/components_lite/Jobs";
import Browse from "./components/components_lite/Browse";
import Profile from "./components/components_lite/Profile";
import Description from "./components/components_lite/Description";
import Companies from "./components/adminComponent/Companies";
import CompanyCreate from "./components/adminComponent/CompanyCreate";
import CompanySetup from "./components/adminComponent/CompanySetup";
import AdminJobs from "./components/adminComponent/AdminJobs";

const appRouter = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  // { path: "/PrivacyPolicy", element: <PrivacyPolicy /> },
  { path: "/TermofService", element: <TermsOfService /> },
  { path: "/Jobs", element: <Jobs /> },
  { path: "/Browse", element: <Browse /> },
  { path: "/Profile", element: <Profile /> },
  { path: "/description/:id", element: <Description /> },
  { path: "/admin/companies", element: <Companies /> },
  { path: "/admin/companies/create", element: <CompanyCreate /> },
  { path: "/admin/companies/:id", element: <CompanySetup /> },
  { path: "/admin/jobs", element: <AdminJobs /> },
]);

function App() {
  return (
    <div className="overflow-x-hidden">
      <RouterProvider router={appRouter}></RouterProvider>
    </div>
  );
}

export default App;
