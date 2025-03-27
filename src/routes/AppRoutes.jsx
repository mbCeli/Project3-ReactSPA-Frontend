import { createBrowserRouter } from "react-router-dom";

import Root from "../components/layout/Root/Root";
import IsPrivate from "../components/IsPrivate/IsPrivate";
import IsAnon from "../components/IsAnon/IsAnon";

import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import LandingPage from "../pages/LandingPage/LandingPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import LogoutPage from "../pages/LogoutPage/LogoutPage";
import HomePage from "../pages/HomePage/HomePage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import GamesPage from "../pages/GamesPage/GamesPage";
import GameDetailPage from "../pages/GameDetailPage/GameDetailPage";
import LeaderboardPage from "../pages/LeaderboardPage/LeaderboardPage";



// Admin Pages
import DashboardPage from "../pages/AdminPage/DashboardPage/DashboardPage";
import GameManagementPage from "../pages/AdminPage/GameManagementPage/GameManagementPage";
import UserManagementPage from "../pages/AdminPage/UserManagementPage/UserManagementPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <LandingPage />,
      },
      {
        path: "signup",
        element: (
          <IsAnon>
            <SignupPage />
          </IsAnon>
        ),
      },
      {
        path: "login",
        element: (
          <IsAnon>
            <LoginPage />
          </IsAnon>
        ),
      },
      {
        path: "logout",
        element: <LogoutPage />,
      },
      {
        path: "/home",
        element: (
          <IsPrivate>
            <HomePage />
          </IsPrivate>
        ),
      },
      {
        path: "/profile",
        element: (
          <IsPrivate>
            <ProfilePage />
          </IsPrivate>
        ),
      },
      {
        path: "/games",
        element: (
          <IsPrivate>
            <GamesPage />
          </IsPrivate>
        ),
      },
      {
        path: "/games/:id",
        element: (
          <IsPrivate>
            <GameDetailPage />
          </IsPrivate>
        ),
      },
      {
        path: "/leaderboard",
        element: (
          <IsPrivate>
            <LeaderboardPage />
          </IsPrivate>
        ),
      },
      // Admin routes directly included
      {
        path: "/admin/dashboard",
        element: (
          <IsPrivate adminOnly>
            <DashboardPage />
          </IsPrivate>
        ),
      },
      {
        path: "/admin/games",
        element: (
          <IsPrivate adminOnly>
            <GameManagementPage />
          </IsPrivate>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <IsPrivate adminOnly>
            <UserManagementPage />
          </IsPrivate>
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
