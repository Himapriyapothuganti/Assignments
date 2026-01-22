import { Component,inject,OnInit} from '@angular/core';
import { MessageService } from '../../services/message-service';

@Component({
  selector: 'app-arraycomponent',
  imports: [],
  templateUrl: './arraycomponent.html',
  styleUrl: './arraycomponent.css',
})
export class Arraycomponent {
  private res=inject(MessageService);
  
  
  a:string[]=[];

  ngOnInit(){
    this.res.addData(['apple','banana','custard']);
    this.a=this.res.getData();
  }
}
