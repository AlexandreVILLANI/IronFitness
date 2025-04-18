import {getRequest} from "./axios.service"

async function getAllFormuleFromAPI() {
    return getRequest('/Formule', 'GETALLFORMULE')
}

async function getAllFormule() {
    let answer = await getAllFormuleFromAPI()
    return answer
}


export {
    getAllFormule
}