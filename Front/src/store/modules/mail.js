import { getAdminEmail, sendAbonnementMail } from "@/services/mail.service";

export default {
    namespaced: true,
    state: () => ({
        adminEmail: null,
        mailSentSuccess: false,
        mailSendError: null,
    }),
    mutations: {
        SET_ADMIN_EMAIL(state, email) {
            state.adminEmail = email;
        },
        SET_MAIL_SENT_SUCCESS(state, success) {
            state.mailSentSuccess = success;
        },
        SET_MAIL_SEND_ERROR(state, error) {
            state.mailSendError = error;
        },
        SET_MAIL_SUCCESS(state, value) {
            state.mailSentSuccess = value;
        },
    },
    actions: {
        async fetchAdminEmail({ commit }) {
            try {
                const result = await getAdminEmail();
                if (result.data && result.data.adresse_mail) {
                    commit("SET_ADMIN_EMAIL", result.data.adresse_mail);
                } else {
                    console.warn("Email admin manquant ou format inattendu:", result);
                }
            } catch (err) {
                console.error("Erreur fetchAdminEmail:", err);
            }
        },

        async sendAbonnementMail({ commit }, sessionId) {
            try {
                await sendAbonnementMail(sessionId);
                commit("SET_MAIL_SENT_SUCCESS", true);
                commit("SET_MAIL_SEND_ERROR", null);
            } catch (err) {
                commit("SET_MAIL_SENT_SUCCESS", false);
                commit("SET_MAIL_SEND_ERROR", err);
                console.error("Erreur lors de l’envoi de l’abonnement:", err);
            }
        },
    },
};
