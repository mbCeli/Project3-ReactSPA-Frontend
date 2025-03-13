import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

function Root() {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
}

export default Root;
