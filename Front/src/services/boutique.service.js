import { getRequest, postRequest, putRequest, deleteRequestWithBody } from "@/services/axios.service";


async function getAllGoodiesFromAPI() {
    return getRequest("/goodies", "GETALLGOODIES");
}

async function getAllGoodies() {
    let answer = await getAllGoodiesFromAPI();
    return answer;
}


async function getGoodieByIdFromAPI(id) {
    return getRequest(`/goodies/${id}`, "GETGOODIEBYID");
}

async function getGoodieById(id) {
    let answer = await getGoodieByIdFromAPI(id);
    return answer;
}


async function createGoodieFromAPI(data) {
    return postRequest("/goodies", data, "CREATEGODDIE");
}

async function createGoodies(data) {
    let answer = await createGoodieFromAPI(data);
    return answer;
}


async function updateGoodieFromAPI(id, data) {
    return putRequest(`/goodies/${id}`, data, "UPDATEGOODIE");
}

async function updateGoodies(id, data) {
    let answer = await updateGoodieFromAPI(id, data);
    return answer;
}


async function deleteGoodieFromAPI(id) {
    return deleteRequestWithBody(`/goodies/${id}`, { action: "DELETEGOODIE" });
}

async function deleteGoodies(id) {
    let answer = await deleteGoodieFromAPI(id);
    return answer;
}


export {
    getAllGoodies,
    getGoodieById,
    createGoodies,
    updateGoodies,
    deleteGoodies
};
