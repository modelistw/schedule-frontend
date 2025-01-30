import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ScheduleService } from '../../services/schedule.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatCardModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  days: string[] = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  schedule: { [key: string]: { start: string, end: string } } = {};
  errorMessage: string = '';

  constructor(
    private scheduleService: ScheduleService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.scheduleService.getSchedule().subscribe(
      (response) => {
        
        this.schedule = { ...response };
        this.cdr.detectChanges();
      },
      (error) => {
        this.errorMessage = 'Не удалось загрузить расписание. Попробуйте позже.';
      }
    );
  }

  updateSchedule(day: string) {
    const { start, end } = this.schedule[day];
    this.scheduleService.updateSchedule(day, start, end).subscribe(
      (response) => {
        console.log(`Обновлено расписание для ${day}:`, response);
      },
      (error) => {
        console.error('Ошибка обновления расписания:', error);
        this.errorMessage = 'Не удалось обновить расписание. Проверьте авторизацию.';
      }
    );
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }
}