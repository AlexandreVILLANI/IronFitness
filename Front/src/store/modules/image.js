import { uploadImage } from "@/services/image.service";

export default {
    namespaced: true, // Très important pour éviter les conflits de noms
    actions: {
        async upload({ dispatch }, formData) {
            try {
                const response = await uploadImage(formData);
                // Si tu veux mettre à jour l'état d'un autre module (ex: activite),
                // tu peux utiliser dispatch avec le chemin complet de l'action.
                // Par exemple, pour mettre à jour l'activité après un upload réussi:
                const entityId = formData.get('entityId');
                const newImageFileName = response.data.fileName;
                dispatch('activite/UPDATE_ACTIVITE_IMAGE', { id_activite: entityId, newImageFileName }, { root: true }); // root: true pour appeler une action dans un autre module
                return response.data;
            } catch (error) {
                console.error("Error in image/upload action:", error);
                throw error;
            }
        }
    }
};