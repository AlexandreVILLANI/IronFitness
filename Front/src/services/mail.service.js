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
async function sendAbonnementMailFromAPI(sessionId) {
    return postRequest('/mail/abonnement-mail', {}, 'SEND_ABONNEMENT_MAIL', {
        'session-id': sessionId
    })
}

async function sendAbonnementMail(sessionId) {
    const response = await sendAbonnementMailFromAPI(sessionId)
    return response
}

export {
    getAdminEmail,
    sendAbonnementMail
}
