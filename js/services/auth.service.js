import { supabaseClient } from '../config/supabase.js';
import { storage, STORAGE_KEYS } from '../utils/storage.js';

export class AuthService {
    constructor() {
        this.supabase = supabaseClient;
    }

    // Inscription avec email et mot de passe
    async signUp(email, password, userName) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        user_name: userName,
                        full_name: userName
                    }
                }
            });

            if (error) throw error;

            // Sauvegarde automatique de la session
            if (data.session) {
                this.saveSession(data.session);
                this.saveUser(data.user);
            }

            return { data, error: null };
        } catch (error) {
            console.error('Erreur inscription:', error);
            return { data: null, error };
        }
    }

    // Connexion
    async signIn(email, password, rememberMe = false) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Gestion de la persistance
            if (rememberMe) {
                this.supabase.auth.setSession({ 
                    access_token: data.session.access_token, 
                    refresh_token: data.session.refresh_token 
                });
            }

            this.saveSession(data.session);
            this.saveUser(data.user);

            return { data, error: null };
        } catch (error) {
            console.error('Erreur connexion:', error);
            return { data: null, error };
        }
    }

    // Déconnexion
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;

            this.clearSession();
            return { error: null };
        } catch (error) {
            console.error('Erreur déconnexion:', error);
            return { error };
        }
    }

    // Réinitialisation du mot de passe
    async resetPassword(email) {
        try {
            const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password.html`
            });

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Erreur réinitialisation:', error);
            return { error };
        }
    }

    // Mise à jour du mot de passe
    async updatePassword(newPassword) {
        try {
            const { data, error } = await this.supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur mise à jour:', error);
            return { data: null, error };
        }
    }

    // Récupération de l'utilisateur actuel
    async getCurrentUser() {
        try {
            // Vérifier d'abord le stockage local
            const cachedUser = storage.get(STORAGE_KEYS.USER);
            if (cachedUser) return cachedUser;

            // Sinon, vérifier avec Supabase
            const { data: { user } } = await this.supabase.auth.getUser();
            if (user) {
                this.saveUser(user);
            }
            
            return user;
        } catch (error) {
            console.error('Erreur récupération utilisateur:', error);
            return null;
        }
    }

    // Gestion de session
    isAuthenticated() {
        return !!storage.get(STORAGE_KEYS.SESSION);
    }

    // Sauvegardes locales
    saveSession(session) {
        storage.set(STORAGE_KEYS.SESSION, {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at
        });
    }

    saveUser(user) {
        storage.set(STORAGE_KEYS.USER, {
            id: user.id,
            email: user.email,
            user_name: user.user_metadata?.user_name || user.email
        });
    }

    clearSession() {
        storage.remove(STORAGE_KEYS.SESSION);
        storage.remove(STORAGE_KEYS.USER);
    }

    // Écouteur de changement d'état
    onAuthStateChange(callback) {
        return this.supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                this.saveSession(session);
                this.saveUser(session.user);
            } else if (event === 'SIGNED_OUT') {
                this.clearSession();
            }
            callback(event, session);
        });
    }
}

// Instance singleton
export const authService = new AuthService();
