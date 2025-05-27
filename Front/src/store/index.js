import { createStore } from 'vuex'; // Vuex 4 import
import activite from "@/store/modules/activite.js";
import formule from "@/store/modules/formule.js";
import user from "@/store/modules/user.js";
import mail from "@/store/modules/mail.js"
import creneau from "@/store/modules/creneau.js";
import boutique from "@/store/modules/boutique.js";
import image from "@/store/modules/image.js";

export default createStore({
    modules: {
        activite,
        formule,
        user,
        mail,
        creneau,
        boutique,
        image
    },
});
