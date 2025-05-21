import { getRequest, postRequest, putRequest, deleteRequestWithBody } from "@/services/axios.service";

async function getAllGoodies() {
    return getRequest("/goodies", "GOODIES");
}

async function createGoodies(goodiesData) {
    return postRequest("/goodies", goodiesData, "GOODIES");
}

async function updateGoodies(id, updatedData) {
    return putRequest(`/goodies/${id}`, updatedData, "GOODIES");
}
async function deleteGoodies(id) {
    return deleteRequestWithBody(`/goodies/${id}`, { action: "DELETE_GOODIES" });
}

export {
    getAllGoodies,
    createGoodies,
    updateGoodies,
    deleteGoodies
};
