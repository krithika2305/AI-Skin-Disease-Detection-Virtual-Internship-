const API_URL = 'http://localhost:5000';

export const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            // Throw the error data so the caller can use the message
            throw data;
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const submitFeedback = async (feedbackData) => {
    try {
        const response = await fetch(`${API_URL}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedbackData),
        });
        return await response.json();
    } catch (error) {
        console.error("Feedback Error:", error);
        throw error;
    }
};

export const getAdminStats = async () => {
    try {
        const response = await fetch(`${API_URL}/admin/stats`);
        return await response.json();
    } catch (error) {
        console.error("Stats Error:", error);
        throw error;
    }
};

export const getAllFeedback = async () => {
    try {
        const response = await fetch(`${API_URL}/admin/feedback`);
        return await response.json();
    } catch (error) {
        console.error("Get Feedback Error:", error);
        throw error;
    }
};

export const getDoctors = async (city) => {
    try {
        const response = await fetch(`${API_URL}/doctors?city=${city}`);
        return await response.json();
    } catch (error) {
        console.error("Doctor Fetch Error:", error);
        throw error;
    }
};

export const askChatbot = async (message) => {
    try {
        const response = await fetch(`${API_URL}/chatbot`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        return await response.json();
    } catch (error) {
        console.error("Chatbot Error:", error);
        throw error;
    }
};
