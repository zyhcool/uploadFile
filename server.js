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


router.post("/upload", async (ctx, next) => {
    const chunk = ctx.request.files.file;
    const { hash, end, name, index } = ctx.request.body;
    let filename;

    const uploadDir = Util.mkUploadDir();
    const chunkDir = Util.mkUploadTemp(hash);

    const chunkPath = path.join(chunkDir, hash + '-' + index);
    fs.copyFileSync(chunk.path, chunkPath);
    fs.unlinkSync(chunk.path);

    if (end) {
        filename = `${new Date().getTime()}${name}`;
        const filePath = path.join(uploadDir, filename);
        for (let i = 0; i < index + 1; i++) {
            const chunkPath = path.join(chunkDir, hash + "-" + i);
            if (fs.existsSync(chunkPath)) {
                fs.appendFileSync(filePath, fs.readFileSync(chunkPath));
                fs.unlinkSync(chunkPath);
            }
        }
        fs.rmdirSync(chunkDir);
    }
    ctx.body = {
        code: 0,
        filename,
    }
    await next();
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000);
console.log("listening port 4000...");
