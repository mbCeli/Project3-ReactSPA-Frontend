import { createBrowserRouter } from "react-router-dom";

import IsPrivate from "./components/IsPrivate/IsPrivate";

import DashboardPage from "./pages/admin/DashboardPage";
import GameManagementPage from "./pages/admin/GameManagementPage";
import UserManagementPage from "./pages/admin/UserManagementPage";

const adminRoutes = createBrowserRouter([
  {
    path: "admin",
    children: [
      {
        path: "",
        element: (
          <IsPrivate adminOnly>
            <DashboardPage />
          </IsPrivate>
        ),
      },
      {
        path: "games",
        element: (
          <IsPrivate adminOnly>
            <GameManagementPage />
          </IsPrivate>
        ),
      },
      {
        path: "users",
        element: (
          <IsPrivate adminOnly>
            <UserManagementPage />
          </IsPrivate>
        ),
      },
    ],
  },
]);

export default adminRoutes; 

