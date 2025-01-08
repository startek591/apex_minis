import * as cors from '@koa/cors';
import * as http from 'http';
import * as https from 'https';
import * as Koa from 'koa';
import koaBody from 'koa-body';
import * as Router from 'koa-router';
import * as selfsigned from 'selfsigned';
import * as yargs from 'yargs';
import { loginRouter } from './login/router';
import { weeklyPlannerRouter } from './weekly-planner/router';
import * as LoginTypes from './login/types';
import * as WeeklyPlannerTypes from './weekly-planner/types';
export { LoginTypes, WeeklyPlannerTypes };

const { MOCK_API_PORT } = process.env;

type CliArguments = {
  host: string;
  port: number;
  ssl: boolean;
  delay: number;
} & yargs.Arguments;

const argv = yargs
  .options('host', {
    alias: 'h',
    description: 'the host address to listen on',
    type: 'string',
    default: 'localhost',
  })
  .options('port', {
    alias: 'p',
    description: 'the port to listen on',
    type: 'number',
    default: MOCK_API_PORT ? parseInt(MOCK_API_PORT, 10) : 8080,
  })
  .options('ssl', {
    description: 'enable SSL',
    type: 'boolean',
    default: false,
  })
  .options('delay', {
    alias: 'd',
    description: 'the global delay in milliseconds, to wait before responding',
    type: 'number',
    default: 0,
  }).argv as CliArguments;

const app = new Koa();
app.use(cors());
app.use(koaBody({ jsonLimit: '6mb' }));

if (argv.delay) {
  app.use(async (context, next) => {
    await next();
    await new Promise((resolve) => setTimeout(resolve, argv.delay));
  });
}

const router = new Router()
  .use('/login', loginRouter.routes(), loginRouter.allowedMethods())
  .use(
    '/weekly-planner',
    weeklyPlannerRouter.routes(),
    weeklyPlannerRouter.allowedMethods()
  );

app.use(router.routes()).use(router.allowedMethods());

if (argv.ssl) {
  const { private: key, cert } = selfsigned.generate(
    [{ name: 'commonName', value: argv.host }],
    { keySize: 2048, algorithm: 'sha256' }
  );
  https.createServer({ key, cert }, app.callback()).listen(logAddress);
}

function logAddress(this: http.Server | https.Server): void {
  const addressInfo = this.address();
  if (typeof addressInfo === 'string') {
    console.log(
      `Listening on ${argv.ssl ? 'https' : 'http'}://${addressInfo}...`
    );
  } else {
    const { address, port } = addressInfo;
    const protocol = argv.ssl ? 'https' : 'http';
    console.log(`Listening on ${protocol}://${address}:${port}...`);
  }
}
