import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
    Sidebar
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

    menuAbierto = false;

    constructor(
        private router: Router
    ) {}

    cerrarSesion(){

        localStorage.clear();

        this.router.navigate(['/login']);

    }

}