import { Page } from 'components/common/page';
import config from 'config';

export const PrivacyPage = () => {
  return !!config.legal?.privacy ? (
    <Page title={'Privacy Policy'}>
      <config.legal.privacy />
    </Page>
  ) : (
    <></>
  );
};
