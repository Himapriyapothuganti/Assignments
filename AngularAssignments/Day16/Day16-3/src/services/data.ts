import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Data {
  add(a:number,b:number){
    return a+b;
  }
  subtract(a:number,b:number){
    return a-b;
  }
  multiply(a:number,b:number){
    return a*b;
  }
  division(a:number,b:number){
    return a/b;
  }
}
