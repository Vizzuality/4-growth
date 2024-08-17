import * as express from 'express';
import { AppDataSource } from './ormconfig';
import { FourGrowthODataServer } from './server';


AppDataSource.initialize().then(() => {
  FourGrowthODataServer.create('/odata', 4001)
  console.log('Server running at http://localhost:4001/odata')
}).catch((error) => {
  console.error('Could not start datasource: ', error)
})
