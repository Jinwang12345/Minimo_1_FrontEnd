import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-registrar',
  standalone: true,            
  imports: [CommonModule, FormsModule], 
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent {
  nuevoUsuario: User = {
    username: '',
    gmail: '',
    password: '',
    birthday: new Date(),
  };

  confirmarPassword = '';
  birthdayStr = '';
  maxDate: string;
  formSubmitted = false;
  errorMessage = '';
  isSubmitting = false;

  constructor(private userService: UserService, private router: Router) {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
  }

  isFutureDate(): boolean {
    if (!this.birthdayStr) return false;
    const selected = new Date(this.birthdayStr);
    const today = new Date();
    return selected > today;
  }

  onSubmit(form: any) {
    this.formSubmitted = true;
    this.errorMessage = '';

    if (form.invalid || this.isFutureDate() || this.nuevoUsuario.password !== this.confirmarPassword) {
      this.errorMessage = 'Por favor, revisa los campos del formulario.';
      return;
    }

    this.isSubmitting = true;

    const newUser: User = {
      username: this.nuevoUsuario.username.trim(),
      gmail: this.nuevoUsuario.gmail.trim(),
      password: this.nuevoUsuario.password.trim(),
      birthday: new Date(this.birthdayStr),
    };

    this.userService.addUser(newUser).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al registrar usuario', err);
        this.isSubmitting = false;
        this.errorMessage =
          err?.error?.message ||
          'Ha ocurrido un error al registrar el usuario. Inténtalo nuevamente.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
