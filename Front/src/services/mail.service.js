import { getRequest, postRequest } from './axios.service'

// Appel pour récupérer l'email de l'admin
async function getAdminEmailFromAPI() {
    return getRequest('/mail/getAdminEmail', 'GET_ADMIN_EMAIL')
}

async function getAdminEmail() {
    const response = await getAdminEmailFromAPI()
    return response
}

// Appel pour envoyer la demande d’abonnement
async function sendAbonnementMailFromAPI(sessionId, id_formule) {
    return postRequest('/mail/abonnement-mail', { id_formule }, 'SEND_ABONNEMENT_MAIL', {
        'session-id': sessionId
    });
}

async function sendAbonnementMail(sessionId, id_formule) {
    const response = await sendAbonnementMailFromAPI(sessionId, id_formule);
    return response;
}

export {
    getAdminEmail,
    sendAbonnementMail
}
