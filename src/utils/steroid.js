import axios from "axios";

let BASE_URL = "/api";

export async function apiRequest(path, method = "GET", data = null, isForm = false) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${path}`,
      headers: {},
    };

    if (data) {
      if (isForm) {
        config.data = data;
      } else {
        config.headers["Content-Type"] = "application/json";
        config.data = data;
      }
    }

    console.log("API Request Config:", config);

    const res = await axios(config);
    console.log("API Response:", res);
    return res.data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data || err.message || "Unknown error",
    };
  }
}
