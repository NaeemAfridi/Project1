import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// register user service
const register = async (userData) => {
  // const response = await axios.post(API_URL, userData);
  const response = await axios.post(`${API_URL}/register`, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// logout user service
const logout = async () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  logout,
};

export default authService;
