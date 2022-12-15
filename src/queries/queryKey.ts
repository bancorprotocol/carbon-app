export abstract class QueryKey {
  private static _chain = ['chain'];
  private static _extAPI = ['ext-api'];

  static tokenLists = () => [...this._extAPI, 'token-lists'];
  static tokens = () => [...this._extAPI, 'tokens'];

  static strategies = (user?: string) => [...this._chain, 'strategies', user];

  static approval = (user: string, token: string, spender: string) => [
    ...this._chain,
    'approval',
    user,
    token,
    spender,
  ];

  static balance = (user: string, token: string) => [
    ...this._chain,
    'balance',
    user,
    token,
  ];
}
