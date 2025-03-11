import "./App.css";
import { RouterProvider } from "react-router-dom";

import { AuthProviderWrapper } from "./context/Auth.context";
import { ThemeProviderWrapper } from "./context/ThemeContext";
import router from "./routes/AppRoutes";




function App() {
  return (
    <div className="App">
      <AuthProviderWrapper>
        <ThemeProviderWrapper>
            <RouterProvider router={router} />
        </ThemeProviderWrapper>
      </AuthProviderWrapper>
    </div>
  );
}

export default App;
