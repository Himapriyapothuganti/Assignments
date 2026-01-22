import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
 private data: string[] = [];

 getData(){
  return this.data;
 }

 addData(message:string []){
  message.forEach((i)=>{
    this.data.push(i);
  })
 }
}
