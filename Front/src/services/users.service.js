import {getRequest,postRequest,patchRequest} from "./axios.service"

async function getAllUsersFromAPI() {
    return getRequest('/users', 'GETALLUSERS')
}

async function getAllUsers() {
    let answer = await getAllUsersFromAPI()
    return answer
}

async function createUserFromAPI(data) {
    return postRequest('/users',data, 'CREATEUSER')
}

async function createUser(data) {
    let answer = await createUserFromAPI(data)
    return answer
}

async function updateUtilisateurFromAPI(data) {
    return patchRequest('/users',data, 'UPDATEUSER')
}

async function updateUtilisateur(data) {
    let answer = await updateUtilisateurFromAPI(data)
    return answer
}

async function getAllReservations(id) {
    let answer = await getAllReservationsFromAPI(id)
    return answer
}

async function getAllReservationsFromAPI(id) {
    return getRequest('/users/reservations?id='+id, 'GETALLRESERVATIONS')
}

async function deleteUtilisateurFromAPI(data) {
    return patchRequest('/users/delete',data, 'DELETEUSER')
}

async function deleteUtilisateur(data) {
    let answer = await deleteUtilisateurFromAPI(data)
    return answer
}

async function getUserFromSessionIdFromAPI() {
    return await getRequest( '/users/getBySessionId', 'GETUSER_BY_SESSION_ID');
}

async function getUserFromSessionId() {
    return await getUserFromSessionIdFromAPI();
}



export {
    getAllUsers,
    createUser,
    updateUtilisateur,
    getAllReservations,
    deleteUtilisateur,
    getUserFromSessionId,
}