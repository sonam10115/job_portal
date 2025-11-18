import React from "react";
import Navbar from "@/components/components_lite/Navbar";
import { createBrowserRouter } from "react-router-dom";
import Login from "@/components/authentication/Login";
import Register from "@/components/authentication/Register";
import Home from "@/components/components_lite/Home";
import { RouterProvider } from "react-router-dom";

const appRouter = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

function App() {
  return (
    <div className="overflow-x-hidden">
      <RouterProvider router={appRouter}></RouterProvider>
    </div>
  );
}

export default App;
