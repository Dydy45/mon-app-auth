import { supabaseClient } from '../config/supabase.js';
import { authService } from './auth.service.js';

export class UserService {
    constructor() {
        this.supabase = supabaseClient;
    }

    // Créer ou mettre à jour le profil utilisateur
    async createUserProfile(userData) {
        try {
            const user = await authService.getCurrentUser();
            if (!user) throw new Error('Utilisateur non connecté');

            const { data, error } = await this.supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    email: user.email,
                    user_name: userData.user_name,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur création profil:', error);
            return { data: null, error };
        }
    }

    // Récupérer le profil utilisateur
    async getUserProfile() {
        try {
            const user = await authService.getCurrentUser();
            if (!user) throw new Error('Utilisateur non connecté');

            const { data, error } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur récupération profil:', error);
            return { data: null, error };
        }
    }

    // Mettre à jour le profil
    async updateUserProfile(updates) {
        try {
            const user = await authService.getCurrentUser();
            if (!user) throw new Error('Utilisateur non connecté');

            const { data, error } = await this.supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur mise à jour profil:', error);
            return { data: null, error };
        }
    }
}

export const userService = new UserService();
