const API_URL = "http://localhost:5000/api";

// CREATE OR GET PRIVATE CONVERSATION
export const createConversation = async(userId) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error(
            "Authentication token not found"
        );
    }

    const response = await fetch(
        `${API_URL}/conversations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                userId
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to create conversation"
        );
    }

    return data.conversation;
};