import { authService } from '../services/auth.service.js';

export class Router {
    constructor() {
        this.routes = {
            public: ['index.html', 'reset-password.html'],
            protected: ['dashboard.html']
        };
    }

    // Vérifier l'accès à une route
    async checkAccess() {
        const currentPath = window.location.pathname;
        const isProtected = this.routes.protected.some(route => 
            currentPath.endsWith(route)
        );
        const isPublic = this.routes.public.some(route => 
            currentPath.endsWith(route)
        );

        const isAuthenticated = authService.isAuthenticated();

        if (isProtected && !isAuthenticated) {
            window.location.href = 'index.html';
            return false;
        }

        if (isPublic && isAuthenticated && !currentPath.endsWith('reset-password.html')) {
            window.location.href = 'dashboard.html';
            return false;
        }

        return true;
    }

    // Navigation sécurisée
    navigate(path) {
        if (path === 'dashboard.html' && !authService.isAuthenticated()) {
            window.location.href = 'index.html';
            return;
        }
        
        window.location.href = path;
    }
}

export const router = new Router();
