import {getRequest, postRequest, patchRequest, deleteRequest, putRequest} from "./axios.service"

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

async function getUserById(id) {
    let answer = await getUserByIdFromAPI(id)
    return answer
}

async function getUserByIdFromAPI(id) {
    return getRequest('/users/byid?id='+id, 'GETUSERBYID')
}

async function deleteUtilisateurFromAPI(id) {
    return deleteRequest('/users/delete', id);
}

async function deleteUtilisateur(id) {
    let answer = await deleteUtilisateurFromAPI(id);
    return answer;
}

async function getUserFromSessionIdFromAPI() {
    return await getRequest( '/users/getBySessionId', 'GETUSER_BY_SESSION_ID');
}

async function getUserFromSessionId() {
    return await getUserFromSessionIdFromAPI();
}

async function getUserFormulesFromAPI(id) {
    return getRequest(`/users/getUserFormule?id_utilisateur=${id}`, 'GETUSERFORMULE');
}

async function getUserFormules(id) {
    let answer = await getUserFormulesFromAPI(id)
    return answer
}

async function updateUserFormuleFromAPI({ id_utilisateur, formules }) {
    return putRequest('/users/updateUserFormule',{ id_utilisateur, formules }, 'UPDATEUSERFORMULE')
}

async function updateUserFormule({ id_utilisateur, formules }) {
    let answer = await updateUserFormuleFromAPI({ id_utilisateur, formules })
    return answer
}


export {
    getAllUsers,
    createUser,
    updateUtilisateur,
    getUserById,
    deleteUtilisateur,
    getUserFromSessionId,
    getUserFormules,
    updateUserFormule
}