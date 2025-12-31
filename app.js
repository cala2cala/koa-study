const Koa = require("koa");
const Router = require("@koa/router");
const serve = require("koa-static");
const app = new Koa();
const router = new Router();
const path = require("path");
const mount = require("koa-mount");
const compose = require("koa-compose");
// logger
// ctx and next are automatically inferred!
// router.get("/:id", (ctx, next) => {
//   const id = ctx.params.id; // ✅ Inferred as string
//   ctx.request.params.id; // ✅ Also available
//   ctx.body = { id }; // ✅ Works
//   return next(); // ✅ Works
// });
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.log(222, error);
    ctx.throw(500);
    ctx.app.emit("error", error, ctx);
  }
});
app.use(mount("/root", serve(path.join(__dirname, "./"))));

// Define routes
router.get("/", (ctx, next) => {
  //   ctx.body = "Hello World!";
  ctx.redirect("/hello");
});
router.get("/hello", (ctx, next) => {
  //   ctx.body = "Hello World1!";
  ctx.throw(500);
});

router.get("/users/:id", (ctx, next) => {
  ctx.body = { id: ctx.params.id };
});

// app.use(
//   mount("/hello", (ctx, next) => {
//     ctx.body = "Hello World!";
//   })
// );

// Apply router middleware
app.use(router.routes()).use(router.allowedMethods());

// Also works for router.use()
const a1 = (ctx, next) => {
  ctx.state.startTime = Date.now();
  return next();
};
const a2 = async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`123${ctx.method} ${ctx.url} - ${rt}`);
};
const a3 = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
};
// // x-response-time

app.use(compose([a1, a2, a3]));

// response

// app.use(async (ctx) => {
//   ctx.body = "Hello World";
// });
app.on("error", (err, ctx) => {
  console.log("111", err);
  //   log.error("server error", err, ctx);
});

app.listen(3000);
