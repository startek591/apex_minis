import * as Router from 'koa-router';
import loginSeed from './seeds/login';

export const loginRouter = new Router().post('/token', (context) => {
  if (context.request.body.username === 'kylo.ren') {
    context.status = 401;
    return;
  }
  context.body = loginSeed;
});
