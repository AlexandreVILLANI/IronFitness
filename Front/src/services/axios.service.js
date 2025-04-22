import axios from 'axios';

const API_URL = 'http://localhost:3000'; // ou l'URL de ton serveur backend


const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Si tu utilises les cookies/sessions
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function getRequest(endpoint, debugKey = '') {
    try {
        const response = await axios.get(`${API_URL}${endpoint}`, {
            withCredentials: true,

        });
        return response;
    } catch (error) {
        console.error(`Erreur GET ${debugKey} :`, error);
        throw error;
    }
}

export const postRequest = async (url, data) => {
    try {
        const response = await axiosInstance.post(url, data);
        return response;
    } catch (error) {
        console.error('Erreur POST :', error);
        throw error;
    }
};

export const putRequest = async (url, data) => {
    try {
        const response = await axiosInstance.put(url, data);
        return response;
    } catch (error) {
        console.error('Erreur PUT :', error);
        throw error;
    }
};

export const deleteRequest = async (url) => {
    try {
        const response = await axiosInstance.delete(url);
        return response;
    } catch (error) {
        console.error('Erreur DELETE :', error);
        throw error;
    }
};

export const patchRequest = async (url, data) => {
    try {
        const response = await axiosInstance.patch(url, data);
        return response;
    } catch (error) {
        console.error('Erreur PATCH :', error);
        throw error;
    }
};

