import { ConsoleModule } from './console.module';

describe('ConsoleModule', () => {
  let consoleModule: ConsoleModule;

  beforeEach(() => {
    consoleModule = new ConsoleModule();
  });

  it('should create an instance', () => {
    expect(consoleModule).toBeTruthy();
  });
});
