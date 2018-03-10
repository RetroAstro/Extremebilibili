// index:

module.exports = {
    'GET /': async (ctx, next) => {
    	await next();
        ctx.render('index.html');
    },
    'GET /video': async (ctx, next) => {
    	await next();
        ctx.render('video.html');
    },
    'GET /video/:id': async (ctx, next) => {
    	await next();
        ctx.render('video.html');
    },
    'GET /register': async (ctx, next) => {
    	await next();
        ctx.render('register.html');
    },
    'GET /upload': async (ctx, next) => {
        await next();
        ctx.render('upload.html');
    },
    'GET /login': async (ctx, next) => {
        await next();
        ctx.render('login.html');
    },
    'GET /search': async (ctx, next) => {
        await next();
        ctx.render('search.html');
    }
};






