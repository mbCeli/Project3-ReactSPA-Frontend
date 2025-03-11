import api from "./api.service"

class AuthService {
  login = (requestBody) => {
    return api.post("/auth/login", requestBody);
    // same as
    // return axios.post("http://localhost:5005/auth/login");
  };

  signup = (requestBody) => {
    return api.post("/auth/signup", requestBody);
    // same as
    // return axios.post("http://localhost:5005/auth/singup");
  };

  verify = () => {
    return api.get("/auth/verify");
    // same as
    // return axios.post("http://localhost:5005/auth/verify");
  };

  logout = () => {
    return api.get("/auth/logout");
  };
}

// Create one instance (object) of the service
const authService = new AuthService();

export default authService;
