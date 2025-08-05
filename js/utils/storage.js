// Gestionnaire de stockage local avec validation
export const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    },

    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Erreur lors de la lecture:', error);
            return null;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    }
};

// Constantes pour les clés de stockage
export const STORAGE_KEYS = {
    USER: 'app_user',
    SESSION: 'app_session'
};
