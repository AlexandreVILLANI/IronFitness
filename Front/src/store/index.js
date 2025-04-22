import { createStore } from 'vuex'; // Vuex 4 import
import activite from "@/store/modules/activite.js";
import formule from "@/store/modules/formule.js";
import user from "@/store/modules/user.js";

export default createStore({
    modules: {
        activite,
        formule,
        user
    },
});
