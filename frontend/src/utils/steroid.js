import axios from "axios";
import { toast } from "sonner";


export async function apiRequest(path, method = "GET", data = null, isForm = false) {
  let baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000" ;
  if (path === "/arqonz-signin" || path === "/get-credits" || path === "/update-credits") {
    baseUrl = "/api";
  }
  
  try {
    const config = {
      method,
      url: `${baseUrl}${path}`,
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

    const res = await axios(config);;
    return res.data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data || err.message || "Unknown error",
    };
  }
}

export async function fetchImageHistory() {
  try {
    const userStr = localStorage.getItem("user");
    const user = JSON.parse(userStr);

    if (!userStr) {
      throw new Error("User not found in localStorage");
    }

    if (!user.email) {
      throw new Error("User email missing");
    }

    const res = await apiRequest(
      "/image-history/get",
      "POST",
      { userEmail: user.email }
    );

    if (!res.success) {
      throw new Error(res.error || "Failed to fetch image history");
    }

    return res.data || [];

  } catch (error) {
    console.error("Fetch image history error:", error);
    return [];
  }
}

export async function deleteImageHistory(historyId) {
  try {
    if (!historyId) {
      throw new Error("History ID is required");
    }

    const res = await apiRequest(
      "/image-history/delete",
      "POST",
      { id: historyId }
    );

    if (!res.success) {
      throw new Error(res.error || "Failed to delete image history");
    }

    return true;

  } catch (error) {
    console.error("Delete image history error:", error);
    return false;
  }
}

export async function saveImageHistory({
  userEmail,
  imageUrl,
  toolName,
  imageType = "url",
  prompt = null,
}) {
  // Frontend validation
  if (!userEmail || !imageUrl || !toolName) {
    return {
      success: false,
      error: "userEmail, imageUrl and toolName are required",
    };
  }

  const payload = {
    userEmail,
    imageUrl,
    toolName,
    imageType,
  };

  if (prompt) {
    payload.prompt = prompt;
  }

  // Call backend
  const res = await apiRequest(
    "/image-history/save",
    "POST",
    payload
  );

  return res;
}

export function updateCredits() {
  let apiKey = localStorage.getItem("apikey");
  apiKey = apiKey?.replace(/^"|"$/g, "");

  if (!apiKey) toast.error("API key not found.");

  const payload = { apiKey: apiKey, "Update_Type":"debit","Amount":1 }
  const data = apiRequest("/update-credits", "POST",payload);
}
