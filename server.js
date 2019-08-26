const Koa = require('koa');
const Router = require("koa-router");
const KoaBody = require("koa-body");

let app = new Koa();
let router = new Router();

app.use(KoaBody({
    multipart: true,
}));

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set("X-Response-Time", `${ms}ms`);
});

app.use(async (ctx, next) => {
    await next();
    console.log(`${ctx.method} ${ctx.path} ${ctx.status} `);
});

app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD, OPTIONS");
    ctx.set("Cache-Control", "max-age=60");
    await next();
})

router.post("/upload", async (ctx, next) => {
    // ...
    ctx.body = {
        code: 0,
    }
    await next();
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000);
console.log("listening port 4000...");
