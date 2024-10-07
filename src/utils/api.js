export const apiRequest = async (endpoint, method = "GET", data = null) => {
  const baseUrl = "https://api.dezinfeksiyatashkent.uz/api/";
  const options = {
    method,
    headers: {},
  };

  // Handle data and headers
  if (data) {
    if (data instanceof FormData) {
      // FormData is used for file uploads, so no need to set Content-Type
      options.body = data;
    } else {
      // For JSON data
      options.body = JSON.stringify(data);
      options.headers["Content-Type"] = "application/json";
    }
  }

  // Include token if it exists for authenticated requests
  const token = localStorage.getItem("token-uzloyal");
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, options);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || `HTTP error! Status: ${response.status}`);
    }

    // Assume the response is JSON unless it's empty
    if (response.status !== 204) {
      return await response.json();
    } else {
      return {}; // Return an empty object for no content (204 status)
    }
  } catch (error) {
    console.error("Error in apiRequest:", error);
    throw error;
  }
};
