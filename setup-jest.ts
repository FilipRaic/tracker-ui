import '@angular/localize/init';
import '@testing-library/jest-dom';
import 'intl-tel-input/build/js/utils.js';
import 'jest-preset-angular/setup-jest';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

import { jestPreviewConfigure } from 'jest-preview';

jestPreviewConfigure({ autoPreview: true, publicFolder: 'src' });

const scrollIntoViewMock = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
