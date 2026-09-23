const API_URL = "http://localhost:5000/api";

export const getCurrentUser = async() => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Authentication token not found");
    }

    const response = await fetch(
        `${API_URL}/auth/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch user"
        );
    }

    return data.user;
};