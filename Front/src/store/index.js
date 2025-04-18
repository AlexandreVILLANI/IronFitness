import { createStore } from 'vuex';
import activite from "@/store/modules/activite.js";
import formule from "@/store/modules/formule.js"

export default createStore({
    modules: {
        activite,
        formule
    },
});
