import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {CommonModule} from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {userEvent} from '@testing-library/user-event';
import {anything, instance, mock, when} from 'ts-mockito';
import {of} from 'rxjs';
import {HabitCreateComponent} from './habit-create.component';
import {NullComponent} from '../shared/null-component';
import {HabitService} from '../service/habit.service';
import {ErrorPopupComponent} from '../error-popup/error-popup.component';
import {Habit} from '../model/Habit';

describe('HabitCreateComponent', () => {
  let habitServiceMock: HabitService = mock(HabitService);

  const renderOptions = {
    imports: [
      CommonModule,
      ReactiveFormsModule,
      NoopAnimationsModule,
      RouterTestingModule.withRoutes([
        {path: '', component: NullComponent},
        {path: 'habit/create', component: NullComponent}
      ]),
      HabitCreateComponent,
      ErrorPopupComponent
    ],
    declarations: [],
    providers: [
      {provide: HabitService, useValue: instance(habitServiceMock)},
    ]
  };

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('should render the component with no habits message when habits array is empty', async () => {
    when(habitServiceMock.getAllHabits()).thenReturn(of([]));

    await render(HabitCreateComponent, renderOptions);

    expect(screen.getByTestId('habitsHeader')).toHaveTextContent('Your Habits');
    expect(screen.getByTestId('noHabitsMessage')).toHaveTextContent('You haven’t created any habits yet.');
    expect(screen.getByTestId('noHabitsMessage')).toHaveTextContent('Click + Add New Habit to start building your routine!');
  });

  it('should render habits list when habits are loaded', async () => {
    const mockHabits: Habit[] = [
      {id: 1, name: 'Exercise', frequency: 'day', startDate: '2025-05-28', notes: 'Daily workout'},
      {id: 2, name: 'Read', frequency: 'month', startDate: '2025-06-01', notes: 'Read a book'}
    ];
    when(habitServiceMock.getAllHabits()).thenReturn(of(mockHabits));

    await render(HabitCreateComponent, renderOptions);

    const habitItems = screen.getAllByTestId('habitItem');
    expect(habitItems).toHaveLength(2);
    expect(screen.getAllByTestId('habitNameLabel')[0]).toHaveTextContent('Exercise');
    expect(screen.getAllByTestId('habitNameLabel')[1]).toHaveTextContent('Read');
    expect(screen.getAllByTestId('habitStartDateLabel')[0]).toHaveTextContent('Starts: 2025-05-28');
    expect(screen.getAllByTestId('habitStartDateLabel')[1]).toHaveTextContent('Starts: 2025-06-01');
    expect(screen.getAllByTestId('habitFrequencyLabel')[0]).toHaveTextContent('day');
    expect(screen.getAllByTestId('habitFrequencyLabel')[1]).toHaveTextContent('month');
  });

  it('should submit a valid form and add a new habit', async () => {
    const user = userEvent.setup();
    const newHabit: Habit = {
      name: 'Meditate',
      frequency: 'day',
      startDate: '2025-05-28',
      notes: 'Daily meditation'
    };
    const createdHabit: Habit = {id: 1, ...newHabit};
    when(habitServiceMock.getAllHabits()).thenReturn(of([]));
    when(habitServiceMock.createHabit(anything())).thenReturn(of(createdHabit));

    await render(HabitCreateComponent, renderOptions);
    await user.click(screen.getByTestId('habitButton'));

    await user.type(screen.getByTestId('habitNameInput'), newHabit.name);
    await user.selectOptions(screen.getByTestId('habitFrequencySelect'), newHabit.frequency);
    await user.type(screen.getByTestId('habitDateInput'), newHabit.startDate);
    await user.type(screen.getByTestId('habitNotesInput'), newHabit.notes!);

    await user.click(screen.getByTestId('submitHabitButton'));

    expect(screen.getByTestId('habitNameLabel')).toHaveTextContent('Meditate');
    expect(screen.getByTestId('habitStartDateLabel')).toHaveTextContent('Starts: 2025-05-28');
    expect(screen.getByTestId('habitFrequencyLabel')).toHaveTextContent('day');
  });

  it('should show validation errors for invalid form submission', async () => {
    const user = userEvent.setup();
    when(habitServiceMock.getAllHabits()).thenReturn(of([]));

    await render(HabitCreateComponent, renderOptions);
    await user.click(screen.getByTestId('habitButton'));

    await user.click(screen.getByTestId('submitHabitButton'));

    expect(screen.getByText('name is required or invalid')).toBeVisible();
    expect(screen.getByText('frequency is required or invalid')).toBeVisible();
    expect(screen.getByText('startDate is required or invalid')).toBeVisible();
  });

  it('should toggle form visibility on button click', async () => {
    const user = userEvent.setup();
    when(habitServiceMock.getAllHabits()).thenReturn(of([]));

    await render(HabitCreateComponent, renderOptions);

    const toggleButton = screen.getByTestId('habitButton');
    const formDiv = screen.getByTestId('habitForm');

    expect(formDiv).not.toHaveClass('show');

    await user.click(toggleButton);

    expect(formDiv).toHaveClass('collapse');
  });
});
