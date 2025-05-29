import { expect, test } from '@playwright/test';
import { navigateTo } from '../../utils/operators';
import {
  CreateSimulationDriver,
  CreateStrategyTestCase,
  SimulationResultDriver,
  assertRecurringTestCase,
  testDescription,
} from '../../utils/simulator/';
import { waitForTenderlyRpc } from '../../utils/tenderly';

export const simulateRecurringStrategy = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  const output = testCase.output;

  return test(testDescription(testCase), async ({ page }) => {
    await navigateTo(page, '/simulate/*?*');

    const createForm = new CreateSimulationDriver(page, testCase);
    await createForm.waitForDisclaimerModal();
    await createForm.clearSimulatorDisclaimer();

    await createForm.selectToken('base');
    await createForm.selectToken('quote');
    await createForm.selectStrategyType('recurring');
    await createForm.fillRecurring();

    const start = testCase.input.dates.start;
    const end = testCase.input.dates.end;

    await createForm.fillDates(start, end);

    await createForm.waitForPriceChart();
    await createForm.screenshotPriceChart();

    await createForm.submit();
    await waitForTenderlyRpc(page);

    const simulationResult = new SimulationResultDriver(page, testCase);
    await simulationResult.waitForChartElement();

    const sellOrderRates = simulationResult.getSummaryRow('sell', 'rates');
    const sellOrderBudget = simulationResult.getSummaryRow('sell', 'budget');
    const buyOrderRates = simulationResult.getSummaryRow('buy', 'rates');
    const buyOrderBudget = simulationResult.getSummaryRow('buy', 'budget');

    await expect(sellOrderRates).toHaveText(output.sell.rate);
    await expect(sellOrderBudget).toHaveText(output.sell.budget);
    await expect(buyOrderRates).toHaveText(output.buy.rate);
    await expect(buyOrderBudget).toHaveText(output.buy.budget);

    const roi = simulationResult.getRoi();
    await expect(roi).toHaveText(output.roi);

    const gains = simulationResult.getEstimatedGains();
    await expect(gains).toHaveText(output.estimatedGains);

    const simulationDates = simulationResult.getSimulationDates();
    await expect(simulationDates).toHaveText(testCase.output.date);

    // Move the animation to the end
    const animationControls = await simulationResult.getAnimationControls();
    await animationControls.end();

    await simulationResult.screenshotAnimationChart();

    await simulationResult.setChartTab('summary');

    await simulationResult.screenshotSummaryChart();
  });
};
