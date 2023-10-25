/* eslint-disable prettier/prettier */
import { Page } from '@playwright/test';
import { checkApproval, waitModalClose, waitModalOpen } from './modal';

interface LimitField {
  price: string;
  budget: string;
}

interface BaseConfig {
  base: string;
  quote: string;
}

interface LimitStrategyConfig extends BaseConfig {
  buy: LimitField;
  sell: LimitField;
}

export const prepareLimitStrategy = async (
  page: Page,
  config: LimitStrategyConfig
) => {
  const { base, quote, buy, sell } = config;
  await page.getByTestId('create-strategy-desktop').click();

  // Select Base
  await page.getByTestId('select-base-token').click();
  await waitModalOpen(page);
  await page.getByLabel('Select Token').fill(base);
  await page.getByTestId(`select-token-${base}`).click();
  await waitModalClose(page);

  // Select Quote
  await page.getByTestId('select-quote-token').click();
  await waitModalOpen(page);
  await page.getByLabel('Select Token').fill(quote);
  await page.getByTestId(`select-token-${quote}`).click();
  await page.getByText('Next Step').click();

  // Fill Buy fields
  const buySection = page.getByTestId('buy-section');
  await buySection.getByTestId('input-limit').fill(buy.price);
  await buySection.getByTestId('input-budget').fill(buy.budget);

  // Fill Sell fields
  const sellSection = page.getByTestId('sell-section');
  await sellSection.getByTestId('input-limit').fill(sell.price);
  await sellSection.getByTestId('input-budget').fill(sell.budget);
};

/** Run AFTER preparing the strategy */
export const createStrategy = async (page: Page, config: BaseConfig) => {
  const { base, quote } = config;
  await page.getByText('Create Strategy').click();

  // Accept approval
  await checkApproval(page, [base, quote]);
};
