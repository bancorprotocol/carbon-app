import { expect, test } from '@playwright/test';
import { navigateTo } from '../../utils/operators';
import {
  CreateSimulationDriver,
  CreateStrategyTestCase,
  SimulationResultDriver,
  assertRecurringTestCase,
  testDescription,
} from '../../utils/simulator/';

export const simulateRecurringStrategy = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  const output = testCase.output;

  return test(testDescription(testCase), async ({ page }) => {
    await navigateTo(page, '/simulator/recurring');

    const createForm = new CreateSimulationDriver(page, testCase);
    await createForm.waitForDisclaimerModal();
    await createForm.clearSimulatorDisclaimer();

    await createForm.selectToken('base');
    await createForm.selectToken('quote');
    await createForm.selectStrategyType('recurring');
    await createForm.fillRecurring();
    await createForm.fillDates();

    await createForm.waitForPriceChart();
    await createForm.screenshotPriceChart();

    await createForm.submit();

    const simulationResult = new SimulationResultDriver(page, testCase);
    await simulationResult.waitForChartElement();

    const simulatorSummary = simulationResult.getSimulationSummary();
    const sellOrderRates = simulatorSummary.sell.orderRates();
    const sellOrderBudget = simulatorSummary.sell.orderBudget();
    const buyOrderRates = simulatorSummary.buy.orderRates();
    const buyOrderBudget = simulatorSummary.buy.orderBudget();

    await expect(sellOrderRates).toHaveText(output.sell.rate);
    await expect(sellOrderBudget).toHaveText(output.sell.budget);

    await expect(buyOrderRates).toHaveText(output.buy.rate);
    await expect(buyOrderBudget).toHaveText(output.buy.budget);

    const roi = simulationResult.getRoi();
    await expect(roi).toHaveText(output.roi);

    const gains = simulationResult.getEstimatedGains();
    await expect(gains).toHaveText(output.estimatedGains);

    const simulationDates = simulationResult.getSimulationDates();
    expect(simulationDates).toHaveText(testCase.output.date);

    // Move the animation to the end
    const animationControls = await simulationResult.getAnimationControls();
    await animationControls.end();

    await simulationResult.screenshotAnimationChart();

    // Toggle Summary
    await simulationResult.setChartTab('summary');

    await simulationResult.screenshotSummaryChart();
  });
};
