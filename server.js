const Koa = require('koa');
const Router = require("koa-router");
const KoaBody = require("koa-body");
const fs = require("fs");
const Util = require("./myutil");
const path = require("path");


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

// 全局储存上传的文件分片
let buffs = [];
let i = 0;
router.post("/upload", async (ctx, next) => {
    let uploadDir = Util.mkUploadDir();
    
    let chunk = ctx.request.files.file;
    let buff = fs.readFileSync(chunk.path);
    buffs.push(buff);
    let end = ctx.request.body.end;
    if (end) {
        let b = Buffer.concat(buffs);
        fs.writeFileSync(path.join(uploadDir, ctx.request.body.name), b);
    }
    ctx.body = {
        code: 0,
    }
    await next();
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000);
console.log("listening port 4000...");
