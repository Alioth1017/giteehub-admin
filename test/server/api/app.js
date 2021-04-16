const Koa = require('koa');
const router = require('koa-router')();
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

app.use(cors());
app.use(bodyParser());

router.get('/getTest', (ctx) => {
  ctx.body = {
    name: 'test',
  };
});

router.post('/login', (ctx) => {
  ctx.body = {
    code: 200,
    success: true,
    result: {
      userId: '1',
      username: 'admin',
      realName: 'Admin',
      desc: 'manager',
      password: 'admin',
      token: 'fakeToken1',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
    },
  };
});

router.get('/getUserInfoById', (ctx) => {
  ctx.body = {
    code: 200,
    success: true,
    result: {
      userId: '1',
      username: 'admin',
      realName: 'Admin',
      desc: 'manager',
      password: 'admin',
      token: 'fakeToken1',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
    },
  };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3002, () => {
  console.log('server is listen in 3002');
});
