import * as Router from 'koa-router';
import { fieldDataSeeds } from './seeds/field-data';
import { planSeeds } from './seeds/plan';
import { subDepartmentSeeds } from './seeds/sub-departments';

export const weeklyPlannerRouter = new Router({ prefix: '/api' })
  .get('/subdepts', (context) => {
    context.body = subDepartmentSeeds;
  })
  .get('/:subDeptId/fieldDetail', (context) => {
    context.body = fieldDataSeeds;
  })
  .get('/:subDeptId/plan/:workDate/:dockId', (context) => {
    context.body = planSeeds;
  })
  .post('/:subDeptId/plan/:workDate/:dockId', (context) => {
    context.body = planSeeds;
  });
