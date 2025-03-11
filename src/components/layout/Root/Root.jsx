import { Outlet } from "react-router-dom";

import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";

function Root() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Outlet />
      <Footer />
    </>
  );
}

export default Root;
