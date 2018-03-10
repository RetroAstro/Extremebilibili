const Koa = require('koa')

const bodyParser = require('koa-bodyparser')

const controller = require('./controller')

const templating = require('./templating')

const proxy = require('koa-proxies')

const app = new Koa()

const isProduction = process.env.NODE_ENV === 'production';

app.use(bodyParser());

if ( !isProduction ) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}


app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

app.use(controller());

app.use(proxy('/gayligayliapi/verificationCode', {
    target: 'http://www.mashiroc.cn',
    changeOrigin: true,
    logs: true
}));

app.use(proxy('/gayligayliapi/register', {
    target: 'http://www.mashiroc.cn',
    changeOrigin: true,
    logs: true
}));

app.use(proxy('/gayligayliapi/login', {
    target: 'http://www.mashiroc.cn',
    changeOrigin: true,
    logs: true
}));

app.use(proxy('/gayligayliapi/uploadToken', {
    target: 'http://www.mashiroc.cn',
    changeOrigin: true,
    logs: true
}));

app.use(proxy('/gayligayliapi/uploadSuccess', {
    target: 'http://www.mashiroc.cn',
    changeOrigin: true,
    logs: true
}));

app.use(proxy('/gayligayliapi/videoPage', {
    target: 'http://www.mashiroc.cn',
    changeOrigin: true,
    logs: true
}));

app.use(proxy('/gayligayliapi/search', {
    target: 'http://www.mashiroc.cn',
    changeOrigin: true,
    logs: true
}));

app.use(proxy('/gayligayliapi/sendCoin', {
    target: 'http://www.mashiroc.cn',
    changeOrigin: true,
    logs: true
}));

app.listen(8080);

console.log('app started at port 8080');