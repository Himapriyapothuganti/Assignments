import { DatePipe } from '@angular/common';
import { Component ,OnInit} from '@angular/core';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-list-employees-component',
  imports: [DatePipe],
  templateUrl: './list-employees-component.html',
  styleUrl: './list-employees-component.css',
})
export class ListEmployeesComponent implements OnInit {
 employees: Employee[] = [
 {
 id: 1,
 name: 'Mark',
 gender: 'Male',
 contactPreference: 'Email',
 email: 'mark@pragimtech.com',
 dateOfBirth: new Date('10/25/1988'),
 department: 'IT',
 isActive: true,
 photoPath: './John.png'
 },
 {
 id: 2,
 name: 'Mary',
 gender: 'Female',
 contactPreference: 'Phone',
 phoneNumber: 2345978640,
 dateOfBirth: new Date('11/20/1979'),
 department: 'HR',
 isActive: true,
 photoPath: './Mary.png'
 },
 {
 id: 3,
 name: 'John',
 gender: 'Male',
 contactPreference: 'Phone',
 phoneNumber: 5432978640,
 dateOfBirth: new Date('3/25/1976'),
 department: 'IT',
 isActive: false,
 photoPath: './Mark.png'
 },
 ];
 constructor() { }
 ngOnInit() {
 }
}
