import { Page } from 'playwright-core';
import {
  CreateStrategyTestCase,
  Direction,
  SimulatorChartTypes,
} from './types';
import { screenshot, waitFor } from '../operators';
import { screenshotPath } from './utils';

export class SimulationResultDriver {
  constructor(private page: Page, private testCase: CreateStrategyTestCase) {}

  async waitForChartElement() {
    await waitFor(this.page, 'chart-tab-animation', 50000);
  }

  getSummaryChart() {
    return this.page.getByTestId('chart-summary');
  }
  getAnimationChart() {
    return this.page.getByTestId('chart-animation');
  }

  async screenshotAnimationChart() {
    const animationChart = this.page.getByTestId('chart-animation');
    await animationChart.scrollIntoViewIfNeeded();
    await screenshot(
      animationChart,
      screenshotPath(this.testCase, 'simulator-results-animation')
    );
  }

  async screenshotSummaryChart() {
    const summaryChart = this.page.getByTestId('chart-summary');
    await summaryChart.scrollIntoViewIfNeeded();
    await screenshot(
      summaryChart,
      screenshotPath(this.testCase, 'simulator-results-summary')
    );
  }

  setChartTab(chartType: SimulatorChartTypes) {
    return this.page.getByTestId(`chart-tab-${chartType}`).click();
  }

  async getAnimationControls() {
    return {
      playPause: async () =>
        await this.page.getByTestId('animation-controls-play&pause').click(),
      end: async () => {
        await this.page.getByTestId('animation-controls-end').click();
      },
      replay: async () =>
        await this.page.getByTestId('animation-controls-replay').click(),
      setPlaybackSpeed: async (speed) => {
        await this.page.getByTestId('set-playback-speed').click();
        await this.page.getByTestId(`set-speed-${speed}`).click();
      },
    };
  }

  getSimulationDates() {
    return this.page.getByTestId('simulation-dates');
  }

  getSimulationSummaryRow(direction: Direction) {
    const orderRates = () =>
      this.page.getByTestId(`table-${direction}-order-rates`);
    const orderBudget = () =>
      this.page.getByTestId(`table-${direction}-order-budget`);

    return { orderRates, orderBudget };
  }

  getSimulationSummary() {
    return {
      buy: this.getSimulationSummaryRow('buy'),
      sell: this.getSimulationSummaryRow('sell'),
    };
  }

  getRoi() {
    return this.page.getByTestId('summary-roi');
  }
  getEstimatedGains() {
    return this.page.getByTestId('summary-gains');
  }
}
