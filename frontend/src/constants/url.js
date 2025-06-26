const URL = {
  // BACKEND_URL: process.env.REACT_APP_BACKEND_URL || "http://192.168.0.27:8000",
  // NGINX_IP: process.env.REACT_APP_BACKEND_URL || "http://192.168.0.27",
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || "http://192.168.0.27:8000",
  NGINX_IP: process.env.REACT_NGINX_IP || "http://localhost",
};
export default URL;

// const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//   setDifficulty(e.target.value);
// };
