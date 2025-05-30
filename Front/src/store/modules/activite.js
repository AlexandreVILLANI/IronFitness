import { getActiviteById, getAllActivite, updateActivite, createActivite, deleteActivite } from "@/services/activite.service";

export default {
    namespaced: true,
    state: () => ({
        activites: [],
        currentActivite: null
    }),
    mutations: {
        SET_ACTIVITES(state, activites) {
            state.activites = activites;
        },
        SET_CURRENT_ACTIVITE(state, activite) {
            state.currentActivite = activite;
        },
        UPDATE_ACTIVITE(state, updatedActivite) {
            const index = state.activites.findIndex(a => a.id_activite === updatedActivite.id_activite);
            if (index !== -1) {
                state.activites.splice(index, 1, updatedActivite);
            }
        },
        ADD_ACTIVITE(state, newActivite) {
            state.activites.push(newActivite);
        },
        DELETE_ACTIVITE(state, idActivite) {
            state.activites = state.activites.filter(a => a.id_activite !== idActivite);
        }
    },
    actions: {
        async getAllActivite({ commit }) {
            try {
                const result = await getAllActivite();
                if (Array.isArray(result.data)) {
                    commit("SET_ACTIVITES", result.data);
                } else {
                    console.error("Unexpected response format:", result);
                    throw new Error("Format de réponse inattendu");
                }
            } catch (err) {
                console.error("Error in getAllActivites():", err);
                throw err;
            }
        },
        async getActiviteById({ commit }, id) {
            try {
                const result = await getActiviteById(id);
                if (result.data) {
                    commit("SET_CURRENT_ACTIVITE", result.data);
                    return result.data;
                } else {
                    console.error("Activité non trouvée");
                    throw new Error("Activité non trouvée");
                }
            } catch (err) {
                console.error("Error in getActiviteById():", err);
                throw err;
            }
        },

        async updateActivite({ commit }, data) {
            try {
                await updateActivite(data);
                commit('UPDATE_ACTIVITE', data);
            } catch (err) {
                console.error("Error in updateActivite():", err);
                throw err;
            }
        },

        async createActivite({ commit }, activiteData) {
            try {
                const result = await createActivite(activiteData);
                commit('ADD_ACTIVITE', result.data);
                return result.data;
            } catch (error) {
                console.error("Error in createActivite():", error);
                throw error;
            }
        },

        async deleteActivite({ commit }, idActivite) {
            try {
                await deleteActivite(idActivite);
                commit('DELETE_ACTIVITE', idActivite);
            } catch (error) {
                console.error("Error in deleteActivite():", error);
                throw error;
            }
        }
    },
    getters: {
        allActivites: state => state.activites,
        currentActivite: state => state.currentActivite,
        activiteById: state => id => state.activites.find(a => a.id_activite === id)
    }
};
