// store/modules/formule.js

import { getAllFormule } from "@/services/formule.service";

export default {
    namespaced: true,
    state: () => ({
        formules: [],
    }),
    mutations: {
        SET_FORMULES(state, formules) {
            state.formules = formules;
        },
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
    },
};
