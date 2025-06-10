import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {CommonModule} from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {userEvent} from '@testing-library/user-event';
import {NavbarComponent} from './navbar.component';
import {NullComponent} from '../shared/null-component';
import {TranslateTestingModule} from 'ngx-translate-testing';

describe('NavbarComponent', () => {
  const renderOptions = {
    imports: [
      CommonModule,
      NoopAnimationsModule,
      RouterTestingModule.withRoutes([
        {path: '', component: NullComponent},
        {path: 'habit/create', component: NullComponent}
      ]),
      NavbarComponent,
      TranslateTestingModule.withTranslations({ en: require('../../../src/assets/i18n/en.json')})
    ],
    declarations: []
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

  it('should render the navbar with correct brand and links', async () => {
    await render(NavbarComponent, renderOptions);

    expect(screen.getByText('Habit tracker for mental health')).toBeVisible();
    expect(screen.getByText('Habit tracker for mental health').closest('a')).toHaveAttribute('href', '/');

    expect(screen.getByText('Home')).toBeVisible();
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');

    expect(screen.getByText('Habit')).toBeVisible();
  });

  it('should display dropdown menu when clicking the Habit dropdown toggle', async () => {
    const user = userEvent.setup();
    await render(NavbarComponent, renderOptions);

    const dropdownToggle = screen.getByText('Habit');
    await user.click(dropdownToggle);

    expect(screen.getByText('Your Habits')).toBeVisible();
    expect(screen.getByText('Your Habits').closest('a')).toHaveAttribute('href', '/habit/create');
  });

  it('should toggle navbar collapse on button click for mobile view', async () => {
    const user = userEvent.setup();
    await render(NavbarComponent, renderOptions);

    const toggleButton = screen.getByRole('button', {name: /toggle navigation/i});
    const collapseDiv = screen.getByTestId('navbarNavDropdown');
    expect(collapseDiv).not.toHaveClass('show');

    await user.click(toggleButton);

    expect(collapseDiv).toHaveClass('collapse navbar-collapse justify-content-end');
  });
});
