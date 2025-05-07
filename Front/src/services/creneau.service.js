import {getRequest, postRequest, putRequest} from "./axios.service"

async function getAllCreneauFromAPI() {
    return getRequest('/Creneau', 'GETALLCRENEAU')
}

async function getAllCreneau() {
    let answer = await getAllCreneauFromAPI()
    return answer
}

async function getCreneauByIdFromAPI(id) {
    return getRequest(`/Creneau/${id}`, 'GETCRENEAU');
}

async function getCreneauById(id) {
    const response = await getCreneauByIdFromAPI(id);
    return response;
}

async function updateCreneauAPI(creneauData) {
    return putRequest(`/Creneau/${creneauData.id_creneau}`, creneauData, 'UPDATECRENEAU');
}

async function updateCreneau(creneauData) {
    const response = await updateCreneauAPI(creneauData);
    return response;
}

async function createCreneauAPI(creneauData) {
    return postRequest('/Creneau', creneauData, 'CREATECRENEAU');
}

async function createCreneau(creneauData) {
    const response = await createCreneauAPI(creneauData);
    return response;
}

export {
    getAllCreneau,
    getCreneauById,
    updateCreneau,
    createCreneau
}