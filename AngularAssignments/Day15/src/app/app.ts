import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Products } from '../components/products/products';
import { NavBar } from '../components/nav-bar/nav-bar';
import { Description } from '../components/description/description';
import { Banner } from '../components/banner/banner';
import { Cards } from '../components/cards/cards';
import { Footer } from '../components/footer/footer';
 


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Products,NavBar,Description,Banner,Cards,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('myapp');
}
