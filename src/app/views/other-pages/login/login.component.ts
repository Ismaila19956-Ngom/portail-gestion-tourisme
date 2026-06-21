import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: [`
    * { box-sizing: border-box; }
    .login-page { min-height: 100vh; display: flex; font-family: 'Inter', sans-serif; }
    .login-left { width: 45%; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; padding: 40px; }
    .login-right { flex: 1; display: flex; align-items: center; justify-content: center; background: #f5fdf7; padding: 40px 60px; }
    @media (max-width: 900px) { .login-left { display: none; } .login-right { padding: 30px 24px; } }
    .input-group { position: relative; margin-bottom: 18px; }
    .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #556B2F; font-size: 0.9rem; }
    .form-input { width: 100%; border: 1.5px solid #d1e7dd; border-radius: 10px; padding: 13px 16px 13px 42px; font-size: 0.92rem; color: #333; outline: none; transition: all 0.3s; background: #fff; }
    .form-input:focus { border-color: #556B2F; box-shadow: 0 0 0 3px rgba(85,107,47,0.08); }
    .eye-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #888; cursor: pointer; font-size: 0.9rem; }
    .btn-login { width: 100%; background: #556B2F; color: #fff; border: none; border-radius: 10px; padding: 14px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .btn-login:hover:not(:disabled) { background: #0a7a35; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(85,107,47,0.25); }
    .btn-login:disabled { opacity: 0.65; cursor: not-allowed; }
    .feature-item { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .feature-icon { width: 36px; height: 36px; background: rgba(241,181,59,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #F1B53B; flex-shrink: 0; }
  `]
})
export class LoginComponent {
  email        = '';
  password     = '';
  showPassword = false;
  loading      = false;
  errorMsg     = '';

  constructor(private auth: AuthService, private router: Router) {}

  togglePassword() { this.showPassword = !this.showPassword; }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Veuillez remplir tous les champs.';
      return;
    }
    this.loading  = true;
    this.errorMsg = '';

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: res => {
        this.loading = false;
        if (res.user?.userType === 'CLIENT') {
          this.router.navigate(['/mon-espace']);
        } else {
          this.errorMsg = 'Ce compte n\'est pas un compte assuré. Accédez au backoffice.';
        }
      },
      error: err => {
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.errorMsg = 'Email ou mot de passe incorrect.';
        } else if (err.status === 0) {
          this.errorMsg = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
        } else {
          this.errorMsg = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }
}
