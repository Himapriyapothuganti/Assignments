import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css',
  //template:`hello {{title}}`,
})
export class Products {
  title : string ="hey hi";
  sayHello(){
  console.log("Hello!");
}
}

