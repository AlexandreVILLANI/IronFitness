import {
    getAllGoodies,
    createGoodies,
    updateGoodies,
    deleteGoodies
} from "@/services/boutique.service";

export default {
    namespaced: true,
    state: () => ({
        goodies: [],
        currentGoodie: null
    }),
    mutations: {
        SET_GOODIES(state, goodies) {
            state.goodies = goodies;
        },
        SET_CURRENT_GOODIE(state, goodie) {
            state.currentGoodie = goodie;
        },
        UPDATE_GOODIE(state, updatedGoodie) {
            const index = state.goodies.findIndex(g => g.id_goodies === updatedGoodie.id_goodies);
            if (index !== -1) {
                state.goodies.splice(index, 1, updatedGoodie);
            }
        },
        ADD_GOODIE(state, newGoodie) {
            state.goodies.push(newGoodie);
        },
        DELETE_GOODIE(state, id) {
            state.goodies = state.goodies.filter(g => g.id_goodies !== id);
        }
    },
    actions: {
        async getAllGoodies({ commit }) {
            try {
                const result = await getAllGoodies();
                if (Array.isArray(result.data)) {
                    commit("SET_GOODIES", result.data);
                } else {
                    console.error("Format de réponse inattendu pour les goodies:", result);
                    throw new Error("Format de réponse inattendu pour les goodies");
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des goodies:", err);
                throw err;
            }
        },
        async createGoodies({ commit }, goodieData) {
            try {
                const result = await createGoodies(goodieData);
                if (result.data) {
                    commit("ADD_GOODIE", result.data);
                    return result.data;
                } else {
                    console.error("Erreur lors de la création du goodie:", result);
                    throw new Error("Erreur lors de la création du goodie");
                }
            } catch (err) {
                console.error("Erreur lors de la création du goodie:", err);
                throw err;
            }
        },
        async updateGoodies({ commit }, goodieData) {
            try {
                const result = await updateGoodies(goodieData.id_goodies, goodieData);
                commit("UPDATE_GOODIE", goodieData);
                return result;
            } catch (err) {
                console.error("Erreur lors de la mise à jour du goodie:", err);
                throw err;
            }
        },
        async deleteGoodies({ commit }, id) {
            try {
                const result = await deleteGoodies(id);
                commit("DELETE_GOODIE", id);
                return result;
            } catch (err) {
                console.error(`Erreur lors de la suppression du goodie avec l'ID ${id}:`, err);
                throw err;
            }
        }
    },
    getters: {
        allGoodies: state => state.goodies,
        currentGoodie: state => state.currentGoodie,
        goodieById: state => id => state.goodies.find(g => g.id_goodies === id)
    }
};
