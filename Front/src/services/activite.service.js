import {getRequest} from "./axios.service"

async function getAllActiviteFromAPI() {
    return getRequest('/activite', 'GETALLACTIVITE')
}

async function getAllActivite(type) {
    let answer = await getAllActiviteFromAPI()
    return answer
}


export {
    getAllActivite
}