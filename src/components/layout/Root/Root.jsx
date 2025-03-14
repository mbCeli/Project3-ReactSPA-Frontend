import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";

function Root() {
  return (
    <>
      <Sidebar />
      <Outlet />
      <Footer/>
    </>
  );
}

export default Root;
