export const ODataClient = Symbol('OdataClientInterface');

export interface OdataClientInterface {
  getAll(query: string): Promise<any>;
}
