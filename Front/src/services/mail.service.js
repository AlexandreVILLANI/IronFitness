import { getRequest, postRequest } from './axios.service'


async function getAdminEmailFromAPI() {
    return getRequest('/mail/getAdminEmail', 'GET_ADMIN_EMAIL')
}

async function getAdminEmail() {
    const response = await getAdminEmailFromAPI()
    return response
}

async function sendAbonnementMailFromAPI({ sessionId, id_formule, demandeDescription = null }) {
    return postRequest('/mail/abonnement-mail', {
        id_formule,
        demande_description: demandeDescription
    }, 'SEND_ABONNEMENT_MAIL', {
        'session-id': sessionId
    });
}

async function sendAbonnementMail({ sessionId, id_formule, demandeDescription = null }) {
    const response = await sendAbonnementMailFromAPI({ sessionId, id_formule, demandeDescription });
    return response;
}
// Envoie un mail de commande de goodie
async function sendGoodieMailFromAPI({ sessionId, id_goodie, quantite, id_taille }) {
    return postRequest('/mail/goodie-mail', {
        id_goodie,
        quantite,
        id_taille
    }, 'SEND_GOODIE_MAIL', {
        'session-id': sessionId
    });
}

async function sendGoodieMail({ sessionId, id_goodie, quantite, id_taille }) {
    const response = await sendGoodieMailFromAPI({ sessionId, id_goodie, quantite, id_taille });
    return response;
}
export {
    getAdminEmail,
    sendAbonnementMail,
    sendGoodieMail
}
