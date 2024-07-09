import { initContract } from '@ts-rest/core';

import { authContract } from './auth.contract';
import { userContract } from './user.contract';
import { customChartsContract } from './custom-charts.contract';

const c = initContract();

export const router = c.router({
  auth: authContract,
  user: userContract,
  userCharts: customChartsContract,
});

export default router;
