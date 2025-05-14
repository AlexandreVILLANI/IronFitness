import { getRequest, patchRequest, postRequest, deleteRequest } from "./axios.service";

async function getAllActiviteFromAPI() {
    return getRequest('/activite', 'GETALLACTIVITE');
}

async function getAllActivite() {
    let answer = await getAllActiviteFromAPI();
    return answer;
}

async function getActiviteByIdFromAPI(id) {
    return getRequest(`/activite/${id}`, 'GETACTIVITEBYID');
}

async function getActiviteById(id) {
    let answer = await getActiviteByIdFromAPI(id);
    return answer;
}

async function updateActiviteFromAPI(data){
    return patchRequest('/activite/updateActivite',data, 'UPDATEACTIVITE')
}

async function updateActivite(data) {
    let answer = await updateActiviteFromAPI(data);
    return answer;
}

async function createActiviteFromAPI(data) {
    return postRequest('/activite', data, 'CREATEACTIVITE');
}

async function createActivite(data) {
    const answer = await createActiviteFromAPI(data);
    return answer;
}

async function deleteActiviteFromAPI(id) {
    return deleteRequest(`/activite`, id);
}

async function deleteActivite(id) {
    const answer = await deleteActiviteFromAPI(id);
    return answer;
}


export {
    getAllActivite,
    getActiviteById,
    updateActivite,
    createActivite,
    deleteActivite
};