import axios from 'axios';

const API_URL = 'http://localhost:3000'; // ou l'URL de ton serveur backend

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Si tu utilises les cookies/sessions
    headers: {
        'Content-Type': 'application/json',
    },
});


// Injecte le token automatiquement
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
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

export const postRequest = async (url, data = {}, debugKey = '', headers = {}) => {
    try {
        const response = await axiosInstance.post(url, data, {
            headers: headers
        });
        return response;
    } catch (error) {
        console.error(`Erreur POST ${debugKey} :`, error);
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

export const deleteRequest = async (url, id) => {
    try {
        const response = await axiosInstance.delete(`${url}/${id}`);
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

