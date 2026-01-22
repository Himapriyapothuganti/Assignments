import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Calculator } from '../components/calculator/calculator';
import { Arraycomponent } from '../components/arraycomponent/arraycomponent';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Calculator,Arraycomponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Day16');
}
