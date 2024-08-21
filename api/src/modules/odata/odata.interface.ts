export interface OdataClientInterface {
  getAll(query: string): Promise<any>;
}
