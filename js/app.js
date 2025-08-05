import { authService } from './services/auth.service.js';
import { userService } from './services/user.service.js';
import { router } from './utils/router.js';

class App {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.endsWith('dashboard.html')) return 'dashboard';
        if (path.endsWith('reset-password.html')) return 'reset-password';
        return 'auth';
    }

    async init() {
        // Vérifier l'accès à la page
        await router.checkAccess();

        // Initialiser la page appropriée
        switch (this.currentPage) {
            case 'auth':
                this.initAuthPage();
                break;
            case 'dashboard':
                this.initDashboardPage();
                break;
            case 'reset-password':
                this.initResetPasswordPage();
                break;
        }

        // Écouter les changements d'authentification
        authService.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event);
            if (event === 'SIGNED_OUT') {
                router.navigate('index.html');
            }
        });
    }

    initAuthPage() {
        this.setupTabs();
        this.setupForms();
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const forms = document.querySelectorAll('.auth-form');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;
                
                // Update active tab
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active form
                forms.forEach(form => form.classList.remove('active'));
                document.getElementById(`${target}-form`).classList.add('active');
            });
        });
    }

    setupForms() {
        // Formulaire de connexion
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin(e);
            });
        }

        // Formulaire d'inscription
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegister(e);
            });
        }
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        const { error } = await authService.signIn(email, password, rememberMe);
        
        if (error) {
            this.showError('Email ou mot de passe incorrect');
            return;
        }

        router.navigate('dashboard.html');
    }

    async handleRegister(e) {
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const userName = document.getElementById('register-name').value;

        const { error } = await authService.signUp(email, password, userName);
        
        if (error) {
            this.showError(error.message);
            return;
        }

        this.showSuccess('Compte créé avec succès ! Redirection...');
        setTimeout(() => router.navigate('dashboard.html'), 1500);
    }

    async initDashboardPage() {
        const user = await authService.getCurrentUser();
        if (!user) {
            router.navigate('index.html');
            return;
        }

        this.displayUserInfo(user);
        this.setupDashboard();
    }

    displayUserInfo(user) {
        const emailElement = document.getElementById('user-email');
        const nameElement = document.getElementById('user-name');
        
        if (emailElement) emailElement.textContent = user.email;
        if (nameElement) nameElement.textContent = user.user_name || user.email;
    }

    setupDashboard() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await authService.signOut();
            });
        }
    }

    initResetPasswordPage() {
        const resetForm = document.getElementById('reset-form');
        if (resetForm) {
            resetForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleResetPassword(e);
            });
        }
    }

    async handleResetPassword(e) {
        const email = document.getElementById('reset-email').value;
        
        const { error } = await authService.resetPassword(email);
        
        if (error) {
            this.showError(error.message);
            return;
        }

        this.showSuccess('Email de réinitialisation envoyé !');
        e.target.reset();
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem',
            borderRadius: '4px',
            color: 'white',
            backgroundColor: type === 'error' ? '#ef4444' : '#10b981',
            zIndex: '1000',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialiser l'application
const app = new App();
