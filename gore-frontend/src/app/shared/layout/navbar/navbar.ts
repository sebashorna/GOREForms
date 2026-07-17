import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  menuAbierto = false;
  constructor(
    private router: Router
  ) {}

  cerrarSesion() {

    // Más adelante eliminaremos aquí el JWT
    localStorage.clear();

    this.router.navigate(['/login']);

  }
}
