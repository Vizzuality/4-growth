import { initContract } from '@ts-rest/core';

import { authContract } from './auth.contract';
import { usersContract } from './users.contract';
import { customChartsContract } from './custom-charts.contract';
import { contactContract } from './contact.contract';
import { sectionContract } from './sections.contract';

const c = initContract();

export const router = c.router({
  contact: contactContract,
  auth: authContract,
  users: usersContract,
  userCharts: customChartsContract,
  sections: sectionContract,
});

export default router;
