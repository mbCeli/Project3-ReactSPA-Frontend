import IsPrivate from "../components/IsPrivate/IsPrivate";

import DashboardPage from "../pages/Admin/DashboardPage/DashboardPage";
import GameManagementPage from "../pages/Admin/GameManagementPage/GameManagementPage";
import UserManagementPage from "../pages/Admin/UserManagementPage/UserManagementPage";

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
