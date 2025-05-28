import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest
} from "./axios.service"

async function getAllCreneauFromAPI() {
    return getRequest('/Creneau', 'GETALLCRENEAU');
}

async function getAllCreneau() {
    let answer = await getAllCreneauFromAPI();
    return answer;
}

async function getCreneauByIdFromAPI(id) {
    return getRequest(`/Creneau/${id}`, 'GETCRENEAU');
}

async function getCreneauById(id) {
    const response = await getCreneauByIdFromAPI(id);
    return response;
}

async function updateCreneauAPI(creneauData) {
    return putRequest('/Creneau', creneauData, 'UPDATECRENEAU');
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

async function deleteCreneauAPI(id) {
    return deleteRequest('/creneau', id);
}

async function deleteCreneau(id) {
    const response = await deleteCreneauAPI(id);
    return response;
}

async function reserverCreneauAPI(data) {
    return postRequest('/Creneau/reserver', data, 'RESERVERCRENEAU');
}

async function reserverCreneau(data) {
    const response = await reserverCreneauAPI(data);
    return response;
}

async function getReservationsByUserIdFromAPI(userId) {
    return getRequest(`/creneau/reservations/user/${userId}`, `GETRESERVATIONS_USER_${userId}`);
}

async function getReservationsByUserId(userId) {
    const response = await getReservationsByUserIdFromAPI(userId);
    return response;
}

export {
    getAllCreneau,
    getCreneauById,
    updateCreneau,
    createCreneau,
    deleteCreneau,
    reserverCreneau,
    getReservationsByUserId
}
