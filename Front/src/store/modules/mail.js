import { getAdminEmail, sendAbonnementMail, sendGoodieMail } from "@/services/mail.service";

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

        async sendAbonnementMail({ commit }, { sessionId, id_formule, demandeDescription }) {
            try {
                if (!id_formule) {
                    console.error("ID de formule manquant.");
                    commit("SET_MAIL_SENT_SUCCESS", false);
                    commit("SET_MAIL_SEND_ERROR", "ID de formule manquant.");
                    return;
                }

                const mailData = {
                    sessionId,
                    id_formule,
                    demandeDescription: demandeDescription || null
                };

                await sendAbonnementMail(mailData);
                commit("SET_MAIL_SENT_SUCCESS", true);
                commit("SET_MAIL_SEND_ERROR", null);
            } catch (err) {
                commit("SET_MAIL_SENT_SUCCESS", false);
                commit("SET_MAIL_SEND_ERROR", err.message || "Erreur lors de l'envoi de la demande");
                console.error("Erreur lors de l'envoi de l'abonnement:", err);
            }
        },

        async sendGoodieMail({ commit }, { sessionId, id_goodie, quantite, id_taille }) {
            try {
                if (!id_goodie || !id_taille) {
                    const msg = "ID du goodie ou de la taille manquant.";
                    console.error(msg);
                    commit("SET_MAIL_SENT_SUCCESS", false);
                    commit("SET_MAIL_SEND_ERROR", msg);
                    return;
                }

                if (!quantite || quantite <= 0) {
                    const msg = "Quantité invalide ou manquante.";
                    console.error(msg);
                    commit("SET_MAIL_SENT_SUCCESS", false);
                    commit("SET_MAIL_SEND_ERROR", msg);
                    return;
                }

                const mailData = { sessionId, id_goodie, quantite, id_taille };

                await sendGoodieMail(mailData);
                commit("SET_MAIL_SENT_SUCCESS", true);
                commit("SET_MAIL_SEND_ERROR", null);
            } catch (err) {
                commit("SET_MAIL_SENT_SUCCESS", false);
                commit("SET_MAIL_SEND_ERROR", err.message || "Erreur lors de l'envoi de la commande goodie.");
                console.error("Erreur lors de l'envoi du mail de goodie:", err);
            }
        }
    },
};
