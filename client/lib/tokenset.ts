export default function tokenSet(newAccessToken: string) {
  // Store all app data under 'kineq' key
  const appData = {
    accesstoken: newAccessToken, // key is 'accesstoken', value is the token
    // Add more properties here as needed (e.g., user info)
  };
  const storedData = JSON.parse(localStorage.getItem("kineq") || "{}");
  if (newAccessToken !== storedData.accesstoken) {
    localStorage.removeItem("kineq"); // Clear old data before setting new token
    localStorage.setItem("kineq", JSON.stringify(appData));
  }
}
