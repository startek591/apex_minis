import * as cors from '@koa/cors';
import * as Koa from 'koa';
import koaBody from 'koa-body';

const app = new Koa();
app.use(cors());
app.use(koaBody({ jsonLimit: '6mb' }));
