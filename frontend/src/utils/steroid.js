import axios from "axios";
import { toast } from "sonner";

let BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";


export async function apiRequest(path, method = "GET", data = null, isForm = false) {
  console.log("api path", path)
  let baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000" ;
  if (path === "/arqonz-signin" || path === "/get-credits") {
    baseUrl = "/api";
  }
 
  console.log("API Base URL:", baseUrl);
  
  try {
    const config = {
      method,
      url: `${baseUrl}${path}`,
      headers: {},
    };

    console.log("API Request:", config.url);

    if (data) {
      if (isForm) {
        config.data = data;
      } else {
        config.headers["Content-Type"] = "application/json";
        config.data = data;
      }
    }

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

export function updateCredits() {
  let apiKey = localStorage.getItem("apikey");
  apiKey = apiKey?.replace(/^"|"$/g, "");

  console.log("Updating credits with API key:", apiKey);

  if (!apiKey) toast.error("API key not found.");

  const payload = { apiKey: apiKey, "Update_Type":"debit","Amount":1 }
  console.log("Update Credits Payload:", payload);
  const data = apiRequest("/update-credits", "POST",payload);
  console.log("Update Credits Response:", data);
  if (data.success) {
    toast.success("Credit updated successfully.");
  }
  else {
    toast.error(`Failed to update credit`);
  }
}
