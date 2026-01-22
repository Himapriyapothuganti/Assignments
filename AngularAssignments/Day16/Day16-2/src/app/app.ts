import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Usercomp } from '../components/usercomp/usercomp';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Usercomp],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Day16-2');
}
