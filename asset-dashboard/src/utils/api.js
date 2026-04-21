export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/";
    return null;
  }


  if (res.status === 204) {
    return null; // DELETE response
  }

  return res.json();
};
