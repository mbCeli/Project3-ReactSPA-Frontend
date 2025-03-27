import IsPrivate from "../components/IsPrivate/IsPrivate";

import DashboardPage from "../pages/AdminPage/DashboardPage/DashboardPage";
import GameManagementPage from "../pages/AdminPage/GameManagementPage/GameManagementPage";
import UserManagementPage from "../pages/AdminPage/UserManagementPage/UserManagementPage";

const adminRoutes = {
  path: "dashboard",
  element: (
    <IsPrivate adminOnly>
      <DashboardPage />
    </IsPrivate>
  ),
  children: [
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
