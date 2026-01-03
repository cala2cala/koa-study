const Koa = require("./koa");
const app = new Koa();

const a1 = async (ctx, next) => {
  console.log(111, ctx.request.method);
  console.log(">>1");
  await next();
  console.log("<<1");
};
const a2 = async (ctx, next) => {
  console.log(">>2");
  await next();
  console.log("<<2");
};
const a3 = async (ctx, next) => {
  console.log(">>3");
  await next();
  console.log("<<3");
};
app.use(a1);
app.use(a2);
app.use(a3);
// app.use(async (ctx) => {
//   ctx.body = "Hello World";
// });

app.listen(3000);
