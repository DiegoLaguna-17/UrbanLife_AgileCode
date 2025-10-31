import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../componentes/navbar/navbar';
import { Footer } from '../../componentes/footer/footer';

@Component({
  selector: 'app-public-shell',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './public-shell.html',
  styleUrl: './public-shell.scss'
})
export class PublicShell{
  ngOnInit(){
    sessionStorage.clear();
  }
}
