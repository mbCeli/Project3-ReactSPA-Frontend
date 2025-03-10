import "./App.css";
import { Routes, Route } from "react-router-dom";

import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";

import HomePage from "./pages/HomePage/HomePage";
import LandingPage from "./pages/LandingPage/LandingPage";
import GameManagementPage from "./pages/GameManagementPage/GameManagementPage";
import GamePage from "./pages/GamePage/GamePage";
import GameDetailPage from "./pages/GameDetailPage/GameDetailPage";
import LeaderboardPage from "./pages/LeaderboardPage/LeaderboardPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

import DashboardPage from "./pages/admin/DashboardPage";
import GameManagementPage from "./pages/admin/GameManagementPage";
import UserManagementPage from "./pages/admin/UserManagementPage";



function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/games" element={<GamePage />} />
        <Route path="/games/:id" element={<GameDetailPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/signup"
          element={
            <IsAnon>
              <SignupPage />
            </IsAnon>
          }
        />
        <Route
          path="/login"
          element={
            <IsAnon>
              <LoginPage />
            </IsAnon>
          }
        />
        <Route
          path="/profile"
          element={
            <IsPrivate>
              <ProfilePage />
            </IsPrivate>
          }
        />
        <Route
          path="/admin"
          element={
            <IsPrivate adminOnly>
              <DashboardPage />
            </IsPrivate>
          }
        />
        <Route
          path="/admin/games"
          element={
            <IsPrivate adminOnly>
              <GameManagementPage />
            </IsPrivate>
          }
        />
        <Route
          path="/admin/users"
          element={
            <IsPrivate adminOnly>
              <UserManagementPage />
            </IsPrivate>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
