// store/modules/activite.js

import { getAllActivite } from "@/services/activite.service";

export default {
    namespaced: true,
    state: () => ({
        activites: [],
    }),
    mutations: {
        SET_ACTIVITES(state, activites) {
            state.activites = activites;
        },
    },
    actions: {
        async getAllActivite({ commit }) {
            try {
                const result = await getAllActivite();
                if (Array.isArray(result.data)) {
                    commit("SET_ACTIVITES", result.data);
                } else {
                    console.error("Unexpected response format:", result);
                }
            } catch (err) {
                console.error("Error in getAllActivite():", err);
            }
        },
    },
};
