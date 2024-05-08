import { Page } from 'components/common/page';
import config from 'config';

export const TermsPage = () => {
  return !!config.legal?.terms ? (
    <Page title="Terms of Use">
      <config.legal.terms />
    </Page>
  ) : (
    <></>
  );
};
