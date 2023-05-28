# tracing

Scoped logging system.

```bash
$ yarn add https://github.com/seokju-na/tracing/main
```

## Usage

### Node.js

`.env` file:
```
TRACING=debug,module-1=error,something-*=warn
```

source file:
```ts
import { tracer } from 'tracing';

let log = tracer('module-1');
log.debug('debug');
log.info('info');
log.error('error caught', error);

log = tracer('something-special');
log.debug('debug');
log.info('info');
log.error('error caught', error);
```

### Cloudflare Worker

Call `initTracing(scopeStr: string)` to initialize tracing.

index.ts:
```ts
import { initTracing } from 'tracing';

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    initTracing(env.TRACING ?? 'error,database=debug');
    return new Response('Hello World');
  }
}
```

database.ts:
```ts
import { tracer } from 'tracing';
import { type MiddlewareHandler } from 'hono';
import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import { formatDialect, sqlite } from 'sql-formatter';

export function database(): MiddlewareHandler {
  const log = tracer('database');
  
  return async (c, next) => {
    const db = new Kysely({
      dialect: new D1Dialect({ database: c.env.DB }),
      log: event => {
        log.debug(`sql ${event.level}\n`, formatDialect(event.query.sql, {
          dialect: sqlite,
          tabWidth: 2,
          keywordCase: 'upper',
        }));
      },
    });
    c.set('database', db);
    await next();
  };
}
```

## License

MIT License
