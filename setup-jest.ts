import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import '@testing-library/jest-dom';

// Setup Zone.js for Angular testing
setupZoneTestEnv();

// TypeScript interfaces for Jasmine types
interface JasmineSpy extends jest.Mock {
  and: {
    returnValue: (value: unknown) => JasmineSpy;
    callFake: (fn: (...args: unknown[]) => unknown) => JasmineSpy;
    throwError: (error: unknown) => JasmineSpy;
    callThrough: () => JasmineSpy;
    resetCalls: () => void;
  };
  calls: {
    count: () => number;
    argsFor: (index: number) => unknown[];
    allArgs: () => unknown[][];
    all: () => { args: unknown[] }[];
    mostRecent: () => { args: unknown[] };
    first: () => { args: unknown[] };
    reset: () => void;
  };
}

interface JasmineSpyObj {
  [key: string]: JasmineSpy;
}

interface JasmineMatchers {
  any: (val: unknown) => unknown;
  objectContaining: (val: Record<string, unknown>) => unknown;
  stringMatching: (val: string | RegExp) => unknown;
  arrayContaining: (val: unknown[]) => unknown;
}

interface JasmineStatic extends JasmineMatchers {
  createSpy: (name?: string) => JasmineSpy;
  createSpyObj: (baseName: string, methodNames: string[]) => JasmineSpyObj;
}

/**
 * Creates a Jasmine-style spy that wraps a Jest mock function
 * @param name Optional name for the spy
 * @returns A Jest mock function with Jasmine-compatible properties
 */
function createJasmineSpy(name?: string): JasmineSpy {
  const spy = jest.fn() as JasmineSpy;

  // Add Jasmine-style 'and' property for configuring the spy
  spy.and = {
    returnValue: (value: unknown) => {
      spy.mockReturnValue(value);
      return spy;
    },
    callFake: (fn: (...args: unknown[]) => unknown) => {
      spy.mockImplementation(fn);
      return spy;
    },
    throwError: (error: unknown) => {
      spy.mockImplementation(() => {
        throw error;
      });
      return spy;
    },
    callThrough: () => {
      spy.mockImplementation((...args: unknown[]) => args[0]);
      return spy;
    },
    resetCalls: () => spy.mockReset()
  };

  // Add Jasmine-style 'calls' property for accessing call information
  spy.calls = {
    count: () => spy.mock.calls.length,
    argsFor: (index: number) => spy.mock.calls[index] || [],
    allArgs: () => spy.mock.calls,
    all: () => spy.mock.calls.map((args: unknown[]) => ({ args })),
    mostRecent: () => ({ args: spy.mock.calls[spy.mock.calls.length - 1] || [] }),
    first: () => ({ args: spy.mock.calls[0] || [] }),
    reset: () => spy.mockReset()
  };

  return spy;
}

// Setup Jasmine compatibility layer for Jest
// This allows tests written with Jasmine syntax to run in Jest
global.jasmine = {
  createSpy: createJasmineSpy,

  createSpyObj: (baseName: string, methodNames: string[]): JasmineSpyObj => {
    const obj: JasmineSpyObj = {};

    for (const method of methodNames) {
      obj[method] = createJasmineSpy(`${baseName}.${method}`);
    }

    return obj;
  },

  // Jasmine matchers mapped to Jest equivalents
  any: (val: unknown) => expect.anything(),
  objectContaining: (val: Record<string, unknown>) => expect.objectContaining(val),
  stringMatching: (val: string | RegExp) => expect.stringMatching(val),
  arrayContaining: (val: unknown[]) => expect.arrayContaining(val)
} as JasmineStatic;
