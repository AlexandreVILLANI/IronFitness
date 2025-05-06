import { getRequest, patchRequest } from "./axios.service";

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

export {
    getAllActivite,
    getActiviteById,
    updateActivite
};