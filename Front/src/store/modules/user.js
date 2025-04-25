// src/store/modules/user.js

import { getSessionCookies, logout } from "@/services/authentification.service.js";

import {
    getAllUsers,
    createUser,
    getAllReservations,
    updateUtilisateur,
    deleteUtilisateur,
    getUserFromSessionId,
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
    }),
    getters: {
        getSessionId: state => state.userCourant.id_session,
        getUserCourant: state => state.userCourant
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
            state.userCourant.id_session = id_session;
            state.isConnected = true;
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
        async getAllReservations({ commit }, id) {
            try {
                const result = await getAllReservations(id);
                if (Array.isArray(result.data)) {
                    commit('SET_RESERVATIONS', result.data);
                } else {
                    console.error("Unexpected response format:", result);
                }
            } catch (err) {
                console.error("Error in getAllReservationStore():", err);
            }
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
                commit('UPDATE_USER', result[0]);
            } catch (err) {
                console.error("Error in createUserStore():", err);
            }
        },
        async deleteUtilisateur({ commit }, id) {
            try {
                const result = await deleteUtilisateur(id);
                commit('DELETE_UTILISATEUR', result[0]);
            } catch (err) {
                console.error("Error in deleteUser():", err);
            }
        },
        async fetchSessionFromCookies({ commit }) {
            try {
                const sessionId = await getSessionCookies(); // <- c'est une string
                if (sessionId !== "Pas de session trouvée") {
                    const user = await getUserFromSessionId(sessionId);
                    commit("SET_SESSION_ID", sessionId);
                    commit("SET_USER", user.data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de la session :", error);
            }
        }
    }
};


