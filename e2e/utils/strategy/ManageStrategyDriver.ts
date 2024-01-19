import { DebugDriver } from './../../utils/DebugDriver';
import { navigateTo } from './../../utils/operators';
import { MyStrategyDriver } from './../../utils/strategy/MyStrategyDriver';
import { Page } from 'playwright-core';
import { CreateStrategyTestCase } from './types';

export class ManageStrategyDriver {
  constructor(private page: Page) {}

  async createStrategy(testCase: CreateStrategyTestCase) {
    const debug = new DebugDriver(this.page);
    await debug.createStrategy(testCase);
    await navigateTo(this.page, '/');
    const myStrategies = new MyStrategyDriver(this.page);
    return myStrategies.getStrategy(1);
  }
}
