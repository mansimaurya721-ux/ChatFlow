const API_URL = "http://localhost:5000/api";

// GET ALL USERS
export const getUsers = async() => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error(
            "Authentication token not found"
        );
    }

    const response = await fetch(
        `${API_URL}/users`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch users"
        );
    }

    return data.users;
};