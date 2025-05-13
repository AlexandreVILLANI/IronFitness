import { getRequest, postRequest, putRequest, deleteRequest } from "./axios.service";

async function getAllFormuleFromAPI() {
    return getRequest('/Formule', 'GETALLFORMULE');
}

async function getAllFormule() {
    return await getAllFormuleFromAPI();
}

async function getFormuleByIdFromAPI(id) {
    return getRequest(`/Formule/${id}`, 'GETFORMULEBYID');
}

async function getFormuleById(id) {
    return await getFormuleByIdFromAPI(id);
}

async function createFormuleFromAPI(data) {
    return postRequest('/Formule', data, 'CREATEFORMULE');
}

async function createFormule(data) {
    return await createFormuleFromAPI(data);
}

async function updateFormuleFromAPI(id, data) {
    return putRequest(`/Formule/${id}`, data, 'UPDATEFORMULE');
}

async function updateFormule(id, data) {
    return await updateFormuleFromAPI(id, data);
}

async function deleteFormuleFromAPI(id) {
    return deleteRequest(`/Formule`,id);
}

async function deleteFormule(id) {
    return await deleteFormuleFromAPI(id);
}

export {
    getAllFormule,
    getFormuleById,
    createFormule,
    updateFormule,
    deleteFormule
};
