import axios from "axios";
// const BASE_URL = "http://localhost:3001/api/";
const BASE_URL = "https://music-data-visualization-backend.onrender.com/api";
export default axios.create({
  baseURL: BASE_URL,
});
