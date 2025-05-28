import {TestBed} from '@angular/core/testing';
import {HabitService} from './habit.service';
import {Habit} from '../model/Habit';
import {HttpClient} from '@angular/common/http';
import {instance, mock, when} from 'ts-mockito';
import {of} from 'rxjs';

const HABIT_URL = '/api/habits';

describe('HabitService', () => {
  const httpClientMock = mock(HttpClient);

  let habitService: HabitService = new HabitService(httpClientMock);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [HabitService, {provide: HttpClient, useValue: instance(httpClientMock)}],
    });
    habitService = TestBed.inject(HabitService);
  });

  describe('Get all habits', () => {
    it('should return an Observable of Habit array', () => {
      const givenHabits: Habit[] = [
        {id: 1, name: 'Exercise', frequency: 'day', startDate: '2025-05-28', notes: 'Daily workout'},
        {id: 2, name: 'Read', frequency: 'month', startDate: '2025-06-01', notes: 'Read a book'}
      ];

      when(httpClientMock.get<Habit[]>(HABIT_URL)).thenReturn(of(givenHabits));

      habitService.getAllHabits().subscribe(habits => {
        expect(habits.length).toBe(2);
        expect(habits).toEqual(givenHabits);
      });
    });
  });

  describe('Create new habit', () => {
    it('should create a new habit and return it', () => {
      const givenHabit: Habit = {
        name: 'Meditate',
        frequency: 'day',
        startDate: '2025-05-28',
        notes: 'Daily meditation'
      };
      const expectedHabit: Habit = {id: 1, ...givenHabit};

      when(httpClientMock.post<Habit>(HABIT_URL, givenHabit)).thenReturn(of(expectedHabit));

      habitService.createHabit(givenHabit).subscribe(habit => {
        expect(habit).toEqual(expectedHabit);
      });
    });
  });
});
