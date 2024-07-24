import { initContract } from '@ts-rest/core';

import { authContract } from './auth.contract';
import { userContract } from './user.contract';
import { customChartsContract } from './custom-charts.contract';
import { contactContract } from './contact.contract';

const c = initContract();

export const router = c.router({
  contact: contactContract,
  auth: authContract,
  user: userContract,
  userCharts: customChartsContract,
});

export default router;
