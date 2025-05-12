import {getRequest} from "./axios.service"

async function getAllFormuleFromAPI() {
    return getRequest('/Formule', 'GETALLFORMULE')
}

async function getAllFormule() {
    let answer = await getAllFormuleFromAPI()
    return answer
}

async function getFormuleByIdFromAPI(id) {
    return getRequest(`/Formule/${id}`, 'GETFORMULEBYID');
}

async function getFormuleById(id) {
    const response = await getFormuleByIdFromAPI(id);
    return response;
}


export {
    getAllFormule,
    getFormuleById
}