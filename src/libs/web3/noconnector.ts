import { Actions, Connector } from '@web3-react/types';

export interface NoConnectorArgs {
  actions: Actions;
  name: string;
  url: string;
}

export class NoConnectorError extends Error {
  public constructor(name: string) {
    super(`${name} not installed, redirecting to website...`);
    this.name = NoConnectorError.name;
    Object.setPrototypeOf(this, NoConnectorError.prototype);
  }
}

export class NoConnector extends Connector {
  /** {@inheritdoc Connector.provider} */
  public declare readonly provider: undefined;
  name: string;
  url: string;

  // eslint-disable-next-line no-this-before-super
  constructor({ actions, name, url }: NoConnectorArgs) {
    super(actions);
    this.name = name;
    this.url = url;
  }
  public activate() {
    setTimeout(() => {
      window.open(this.url, '_blank');
    }, 3000);
    throw new NoConnectorError(this.name);
  }
}
