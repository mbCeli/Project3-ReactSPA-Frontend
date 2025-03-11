import IsPrivate from "../components/IsPrivate/IsPrivate";

import DashboardPage from "../pages/admin/DashboardPage/DashboardPage";
import GameManagementPage from "../pages/admin/GameManagementPage/GameManagementPage";
import UserManagementPage from "../pages/admin/UserManagementPage/UserManagementPage";

const adminRoutes = {
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
  };

export { adminRoutes }; 

