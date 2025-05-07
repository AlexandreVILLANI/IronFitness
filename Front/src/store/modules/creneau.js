// store/modules/creneau.js

import { getAllCreneau, getCreneauById, updateCreneau, createCreneau } from "@/services/creneau.service";

export default {
    namespaced: true,
    state: () => ({
        creneaux: [],
        currentCreneau: null
    }),
    mutations: {
        SET_CRENEAUX(state, creneaux) {
            state.creneaux = creneaux;
        },
        SET_CURRENT_CRENEAU(state, creneau) {
            state.currentCreneau = creneau;
        },
        UPDATE_CRENEAU(state, updatedCreneau) {
            const index = state.creneaux.findIndex(c => c.id_creneau === updatedCreneau.id_creneau);
            if (index !== -1) {
                state.creneaux.splice(index, 1, updatedCreneau);
            }
        },
        ADD_CRENEAU(state, newCreneau) {
            state.creneaux.push(newCreneau);
        }
    },
    actions: {
        async getAllCreneau({ commit }) {
            try {
                const result = await getAllCreneau();
                if (Array.isArray(result.data)) {
                    commit("SET_CRENEAUX", result.data);
                } else {
                    console.error("Format de réponse inattendu pour les créneaux:", result);
                    throw new Error("Format de réponse inattendu pour les créneaux");
                }
            } catch (err) {
                console.error("Erreur lors de la récupération de tous les créneaux:", err);
                throw err;
            }
        },
        async getCreneauById({ commit }, id) {
            try {
                const result = await getCreneauById(id);
                if (result.data) {
                    commit("SET_CURRENT_CRENEAU", result.data);
                    return result.data;
                } else {
                    console.error("Créneau non trouvé avec l'ID:", id);
                    throw new Error(`Créneau non trouvé avec l'ID: ${id}`);
                }
            } catch (err) {
                console.error(`Erreur lors de la récupération du créneau avec l'ID ${id}:`, err);
                throw err;
            }
        },
        async updateCreneau({ commit }, creneauData) {
            try {
                const result = await updateCreneau(creneauData);
                commit('UPDATE_CRENEAU', creneauData); // Optimistically update state
                return result;
            } catch (err) {
                console.error("Erreur lors de la mise à jour du créneau:", err);
                throw err;
            }
        },
        async createCreneau({ commit }, creneauData) {
            try {
                const result = await createCreneau(creneauData);
                if (result.data) {
                    commit('ADD_CRENEAU', result.data);
                    return result.data;
                } else {
                    console.error("Erreur lors de la création du créneau:", result);
                    throw new Error("Erreur lors de la création du créneau");
                }
            } catch (err) {
                console.error("Erreur lors de la création du créneau:", err);
                throw err;
            }
        }
    },
    getters: {
        allCreneaux: state => state.creneaux,
        currentCreneau: state => state.currentCreneau,
        creneauById: state => id => state.creneaux.find(c => c.id_creneau === id)
    }
};