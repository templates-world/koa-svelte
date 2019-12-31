import koa from 'koa';
import send from 'koa-send';
import serve from 'koa-static';

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