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

export {
    getAdminEmail,
    sendAbonnementMail
}
