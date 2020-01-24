# koa-svelte

koa-svelte is a template using [Koa](https://koajs.com) as backend and [Svelte](https://svelte.dev) as frontend.

# Getting started

Using a [degit](https://github.com/Rich-Harris/degit) tool, you can install this template as:

```
npx degit Olyno/koa-svelte my-app
```

# What contain this template

 - [@babel/core](https://www.npmjs.com/package/@babel/core)
    - [@babel/node](https://www.npmjs.com/package/@babel/node) : to execute code using [Babel](https://babeljs.io)
    - [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env) : to compile es6 code into an interpretable code in es5
 - [rollup](https://rollupjs.org/guide/en/)
    - [@rollup/plugin-commonjs](https://www.npmjs.com/package.@rollup/plugin-commonjs) : to make it browser compatible
    - [@rollup/plugin-node-resolve](https://www.npmjs.com/package/@rollup/plugin-node-resolve) : to resolve node dependencies
    - [rollup-plugin-livereload](https://www.npmjs.com/package/rollup-plugin-livereload) : to reload automatically the browser after any change
    - [rollup-plugin-svelte](https://www.npmjs.com/package/rollup-plugin-svelte) : to compile svelte files
    - [rollup-plugin-terser](https://www.npmjs.com/package/rollup-plugin-terser) : to minify compiled code
 - [gulp](https://gulpjs.com) : to manage tasks easily
 - [svelte](https://svelte.dev) : -_-
 - [routify](https://github.com/sveltech/routify) : Svelte router
 - [tree-kill](https://www.npmjs.com/package/tree-kill) : to kill a process (using to restart server)
 - [koa](https://koajs.com) : -_-
 - [koa-static](https://github.com/koajs/static) : to serve static files
 - [koa-send](https://github.com/koajs/send) : to send files

# What could be added

 - Typescript support
    1) Install typescript dependecies: ``npm i -D typescript @types/koa @types/koa-static @types/koa-send ts-node``
    2) Remove unused babel dependencies: ``npm uninstall -D @babel/core @babel/node @babel/preset-env``
    3) Change the ``server/index.js`` file to ``server/index.ts`` and make it compatible with typescript:
    ```diff
    - import koa from 'koa';
    - import send from 'koa-send';
    - import serve from 'koa-static';
    + import * as koa from 'koa';
    + import * as send from 'koa-send';
    + import * as serve from 'koa-static';

    const PORT = 3000;

    const app = new koa();

    // Serve static assets
    app.use(serve('public'));

    // Serve index.html file
    app.use(async (ctx, next) => {
        await send(ctx, 'index.html', { root: 'public' });
        return next();
    })

    app.listen(PORT, () => console.log('> Server listening at http://localhost:' + PORT))
    ```
    4) Replace ``babel-node`` to ``ts-node`` inside the ``start`` script in your ``package.json`` file
    5) Remove unused ``.babelrc`` file
 - Security
    1) Install security dependencies: ``npm i koa-helmet koa-protect @koa/cors``
    2) Add them into the ``server/index.js`` file:
    ```diff
    import koa from 'koa';
    import send from 'koa-send';
    import serve from 'koa-static';
    + import protect from 'koa-protect';
    + import helmet from 'koa-helmet';
    + import cors from '@koa/cors';

    const PORT = 3000;

    const app = new koa();

    + app.use(helmet());
    + app.use(cors());
    + app.use(protect.koa.sqlInjection({ body: true, loggerFunction: console.error }))
    + app.use(protect.koa.xss({ body: true, loggerFunction: console.error }))  

    // Serve static assets
    app.use(serve('public'));

    // Serve index.html file
    app.use(async (ctx, next) => {
        await send(ctx, 'index.html', { root: 'public' });
        return next();
    })

    app.listen(PORT, () => console.log('> Server listening at http://localhost:' + PORT))
    ```