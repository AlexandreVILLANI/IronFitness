import { getSessionCookies, logout } from "@/services/authentification.service.js";

import {
    getAllUsers,
    createUser,
    getUserById,
    updateUtilisateur,
    deleteUtilisateur,
    getUserFromSessionId,
    getUserFormules,
    updateUserFormule
} from "@/services/users.service";

export default {
    namespaced: true,
    state: () => ({
        userCourant: {
            id_session: null,
            id_role: null,
        },
        users: [],
        isConnected: false,
        reservations: [],
        prestataire: null,
        prestataires: null,
        activites: null,
        activityViewsData: null,
        formulesUtilisateur: [],
    }),
    getters: {
        getSessionId: state => state.userCourant.id_session,
        getUserCourant: state => state.userCourant,
        getFormulesUtilisateur: state => state.formulesUtilisateur,
    },
    mutations: {
        SET_USERS(state, users) {
            state.users = users;
        },
        CREATE_USER(state, data) {
            state.users.push(data);
        },
        CHANGE_ROLE(state, role) {
            state.userCourant.id_role = role;
        },
        SET_RESERVATIONS(state, data) {
            state.reservations = data;
        },
        SET_USER(state, user) {
            state.userCourant = user;
            state.isConnected = true;
        },
        LOGOUT_USER(state) {
            state.userCourant = { id_session: null, id_role: null };
            state.isConnected = false;
        },
        UPDATE_USER(state, user) {
            if (user.id_utilisateur === state.userCourant.id_utilisateur) {
                state.userCourant = user;
            }
        },
        DELETE_UTILISATEUR(state, user) {
            if (state.userCourant.id_utilisateur === user.id_utilisateur) {
                state.userCourant = { id_session: null, id_role: null };
                state.isConnected = false;
            }
        },
        SET_ACTIVITES(state, activites) {
            state.activites = activites;
        },
        SET_SESSION_ID(state, id_session) {
            if (state.userCourant && typeof state.userCourant === 'object') {
                state.userCourant.id_session = id_session;
                state.isConnected = true;
            } else {
                state.userCourant = { id_session: id_session, id_role: null }; // Initialisation de l'objet si nécessaire
                state.isConnected = true;
            }
        },
        SET_USER_FORMULES(state, formules) {
            state.formulesUtilisateur = Array.isArray(formules) ? formules : [];
        },
        UPDATE_USER_FORMULE(state, updatedFormules) {
            state.formulesUtilisateur = updatedFormules;
        },
    },
    actions: {
        async getAllUsers({ commit }) {
            try {
                const result = await getAllUsers();
                if (Array.isArray(result.data)) {
                    commit('SET_USERS', result.data);
                } else {
                    console.error("Unexpected response format:", result);
                }
            } catch (err) {
                console.error("Error in getUsersStore():", err);
            }
        },
        async createUtilisateur({ commit }, data) {
            try {
                await createUser(data);
                commit('CREATE_USER', data);
            } catch (err) {
                console.error("Error in createUserStore():", err);
            }
        },
        async changeRoleStore({ commit }, id) {
            commit('CHANGE_ROLE', id);
        },
        async loginUtilisateur({ commit }, data) {
            commit('SET_USER', data);
        },
        async logoutUser({ commit }) {
            await logout();
            commit('LOGOUT_USER');
        },
        async updateUtilisateur({ commit }, data) {
            try {
                const result = await updateUtilisateur(data);
                if (result.data && result.data.length > 0) {
                    commit('UPDATE_USER', result.data[0]);
                } else {
                    console.error("Aucune donnée renvoyée par l'API");
                }
            } catch (err) {
                console.error("Error in updateUserStore():", err);
            }
        },

        async deleteUtilisateur({ commit }, id) {
            try {
                const result = await deleteUtilisateur(id);
                commit('DELETE_UTILISATEUR', result[0]);
            } catch (err) {
                console.error("Error in deleteUtilisateur():", err);
            }
        },
        async fetchSessionFromCookies({ commit }) {
            try {
                const response = await getSessionCookies();
                if (response && response.data !== "Pas de session trouvée") {
                    const user = await getUserFromSessionId(response);
                    commit("SET_SESSION_ID", response);
                    commit("SET_USER", user.data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de la session :", error);
            }
        },
        async getUserFormules({ commit }, id_utilisateur) {
            try {
                const result = await getUserFormules(id_utilisateur);
                if (Array.isArray(result.data)) {
                    commit("SET_USER_FORMULES", result.data);
                } else {
                    console.error("Unexpected response format:", result);
                }
            } catch (err) {
                console.error("Error in getUserFormulesStore():", err);
            }
        },
        async updateUserFormule({ commit }, { id_utilisateur, formules }) {
            console.log('tableaux',formules)
            try {
                const result = await updateUserFormule({ id_utilisateur, formules });
                commit("UPDATE_USER_FORMULE", result.data);
            } catch (err) {
                console.error("Error in updateUserFormuleStore():", err);
            }
        },

        async getUserById({ commit }, id) {
            try {
                const result = await getUserById(id);
                return result.data[0];
            } catch (err) {
                console.error("Error in getUserByIdStore():", err);
                throw err;
            }
        }
    }
};
