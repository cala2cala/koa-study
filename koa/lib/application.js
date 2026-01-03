const http = require("http");
const context = require("./context");
const request = require("./request");
const response = require("./response");
module.exports = class Application {
  constructor(options) {
    this.middleware = [];
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }
  listen(...args) {
    // debug("listen");
    // const server = http.createServer(this.callback());
    // return server.listen(...args);
    const server = http.createServer(this.callback());
    console.log("123");
    server.listen(...args);

    // (req, res) => {
    //   res.writeHead(200, { "Content-Type": "application/json" });
    //   res.end(
    //     JSON.stringify({
    //       data: "Hello World!",
    //     })
    //   );
    // }
  }
  createContext(req, res) {
    let ctx = Object.create(this.context);
    ctx.request = Object.create(this.request);
    ctx.response = Object.create(this.response);
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }

  //异步递归遍历中间件处理函数
  compose(middleware) {
    return function (context) {
      const dispatch = (index) => {
        console.log("index", index);
        if (index >= middleware.length) {
          return Promise.resolve();
        }
        const fn = middleware[index];
        //TODO 上下文对象

        return Promise.resolve(fn(context, () => dispatch(index + 1)));
      };
      //返回第一个中间件处理函数
      return dispatch(0);
    };
  }

  callback() {
    const fnMiddleware = this.compose(this.middleware);
    const handleRequest = (req, res) => {
      const context = this.createContext(req, res);
      fnMiddleware(context)
        .then(() => {
          res.end();
        })
        .catch((err) => {
          console.log("callback err", err);
        });
    };
    return handleRequest;
  }

  use(middleware) {
    this.middleware.push(middleware);
  }
};
