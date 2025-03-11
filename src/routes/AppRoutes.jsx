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
import ProfilePage from "../pages/ProfilePage/ProfilePage"
import GamesPage from "../pages/GamesPage/GamesPage";
import GameDetailPage from "../pages/GameDetailPage/GameDetailPage";
import LeaderboardPage from "../pages/LeaderboardPage/LeaderboardPage";

import { adminRoutes } from "./AdminRoutes";

/* 
//NOT NEEDED BEACUSE OF THE Auth.context.jsx
//to check que is authenticated by getting the token from the localStorage
const checkAuthLoader = () => {
    const token = localStorage.getItem("token");
    if(!token) {
        return redirect("/") //si no hay token you are not athenticated, tehn go back a la landing page
    }
    return null; // No redirection, allow navigation
}; */

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
        element: (
            <LogoutPage />
        ),
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
      {
        path: "*",
        element: <NotFoundPage />,
      },

      adminRoutes,
    ],
  },
]);

export default router;