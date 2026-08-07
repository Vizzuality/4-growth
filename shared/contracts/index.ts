import { initContract } from '@ts-rest/core';

import { authContract } from './auth.contract';
import { usersContract } from './users.contract';
import { contactContract } from './contact.contract';
import { sectionContract } from './sections.contract';
import { widgetsContract } from '@shared/contracts/base-widgets.contract';
import { pageFiltersContract } from '@shared/contracts/page-filters.contract';
import { projectionsContract } from '@shared/contracts/projections.contract';
import { savedProjectionsContract } from '@shared/contracts/saved-projections.contract';

const c = initContract();

export const router = c.router({
  contact: contactContract,
  auth: authContract,
  users: usersContract,
  sections: sectionContract,
  widgets: widgetsContract,
  projections: projectionsContract,
  savedProjections: savedProjectionsContract,
  pageFilter: pageFiltersContract,
});

export default router;
