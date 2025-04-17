import {getRequest} from "./axios.service"

async function getAllActiviteFromAPI() {
    return getRequest('/activite', 'GETALLACTIVITE')
}

async function getAllActivite() {
    let answer = await getAllActiviteFromAPI()
    return answer
}


export {
    getAllActivite
}