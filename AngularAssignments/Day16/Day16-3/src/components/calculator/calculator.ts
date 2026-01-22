import { Component,inject } from '@angular/core';
import { Data } from '../../services/data';

@Component({
  selector: 'app-calculator',
  imports: [],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})

export class Calculator {
 private calci=inject(Data); 
 result1=this.calci.add(4,3);
 result2=this.calci.subtract(4,3);
 result3=this.calci.multiply(4,3);
 result4=this.calci.division(4,3);
}
