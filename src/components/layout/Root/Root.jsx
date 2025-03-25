import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import AIChatButton from "../../ai/ChatButton/AIChatButton";
import { AuthContext } from "../../../context/AuthContext";


function Root() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      <Sidebar />
      <Outlet />
      <Footer />
      {isLoggedIn && <AIChatButton />}
    </>
  );
}

export default Root;
