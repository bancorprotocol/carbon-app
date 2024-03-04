import { Page } from 'playwright-core';
import { CreateStrategyTestCase, SimulatorChartTypes } from './types';
import { Direction } from '../types';
import { screenshot, waitFor } from '../operators';
import { screenshotPath } from './utils';

export class SimulationResultDriver {
  constructor(private page: Page, private testCase: CreateStrategyTestCase) {}

  async waitForChartElement() {
    await waitFor(this.page, 'chart-tab-animation');
  }

  getSummaryChart() {
    return this.page.getByTestId('chart-summary').locator('..');
  }

  getAnimationChart() {
    return this.page.getByTestId(`chart-animation-price`).locator('..');
  }

  async screenshotAnimationChart() {
    const animationChart = this.getAnimationChart();
    await animationChart.scrollIntoViewIfNeeded();
    const elementsToHide = [this.getSimulationDates()];

    await screenshot(
      animationChart,
      screenshotPath(this.testCase, 'simulator-results-animation'),
      elementsToHide
    );
  }

  async screenshotSummaryChart() {
    const summaryChart = this.getSummaryChart();
    await summaryChart.scrollIntoViewIfNeeded();
    const elementsToHide = [this.getSimulationDates()];

    await screenshot(
      summaryChart,
      screenshotPath(this.testCase, 'simulator-results-summary'),
      elementsToHide
    );
  }

  setChartTab(chartType: SimulatorChartTypes) {
    return this.page.getByTestId(`chart-tab-${chartType}`).click();
  }

  async getAnimationControls() {
    const control = (id: string) =>
      this.page.getByTestId(`animation-controls-${id}`);
    return {
      playPause: async () => control('play&pause').click(),
      end: async () => control('end').click(),
      replay: async () => control('replay').click(),
      setPlaybackSpeed: async (speed) => {
        await this.page.getByTestId('set-playback-speed').click();
        await this.page.getByTestId(`set-speed-${speed}`).click();
      },
    };
  }

  getSimulationDates() {
    return this.page.getByTestId('simulation-dates');
  }

  getSummaryRow(direction: Direction, type: 'rates' | 'budget') {
    return this.page.getByTestId(`table-${direction}-order-${type}`);
  }

  getRoi() {
    return this.page.getByTestId('summary-roi');
  }
  getEstimatedGains() {
    return this.page.getByTestId('summary-gains');
  }
}
