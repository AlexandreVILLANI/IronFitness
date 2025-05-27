import { postRequest } from "./axios.service";

async function uploadImageToAPI(formData) {
    return postRequest('/image/upload-image', formData, 'UPLOAD_IMAGE', true); // Le dernier paramètre 'true' indique que c'est un FormData
}

async function uploadImage(formData) {
    try {
        const answer = await uploadImageToAPI(formData);
        return answer;
    } catch (error) {
        console.error("Error in uploadImage():", error);
        throw error;
    }
}

export {
    uploadImage
};