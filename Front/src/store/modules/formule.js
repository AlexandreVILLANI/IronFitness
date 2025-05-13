import {
    getAllFormule,
    getFormuleById,
    createFormule,
    updateFormule,
    deleteFormule
} from "@/services/formule.service";

export default {
    namespaced: true,
    state: () => ({
        formules: [],
        selectedFormule: null,
    }),
    mutations: {
        SET_FORMULES(state, formules) {
            state.formules = formules;
        },
        SET_SELECTED_FORMULE(state, formule) {
            state.selectedFormule = formule;
        },
    },
    getters: {
        formules(state) {
            return state.formules;
        },
        selectedFormule(state) {
            return state.selectedFormule;
        }
    },
    actions: {
        async getAllFormule({ commit }) {
            try {
                const result = await getAllFormule();
                if (Array.isArray(result.data)) {
                    commit("SET_FORMULES", result.data);
                } else {
                    console.error("Unexpected response format:", result);
                }
            } catch (err) {
                console.error("Error in getAllFormule():", err);
            }
        },

        async getFormuleById({ commit }, id) {
            try {
                const result = await getFormuleById(id);
                if (Array.isArray(result.data) && result.data.length > 0) {
                    commit("SET_SELECTED_FORMULE", result.data[0]);
                } else {
                    commit("SET_SELECTED_FORMULE", null);
                    console.warn("Formule not found or unexpected response:", result);
                }
            } catch (err) {
                console.error("Error in getFormuleById():", err);
            }
        },

        async createFormule(_, payload) {
            try {
                const result = await createFormule(payload);
                return result;
            } catch (err) {
                console.error("Error in createFormule():", err);
                throw err;
            }
        },

        async updateFormule(_, { id, payload }) {
            try {
                const result = await updateFormule(id, payload);
                return result;
            } catch (err) {
                console.error("Error in updateFormule():", err);
                throw err;
            }
        },

        async deleteFormule(_, id) {
            try {
                const result = await deleteFormule(id);
                return result;
            } catch (err) {
                console.error("Error in deleteFormule():", err);
                throw err;
            }
        }
    },
};
