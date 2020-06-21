const https = require('https');
const fs = require('fs');
const kcb = require('./kcb');
const utils = require('./utils');
const login = require('./login');
const score = require('./score');
const GPA = require('./calculateGPA');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const router = new Router();
const port = 3000;

router.get('/login',async (ctx,next)=>{
    console.log('login');
    var random = Math.random().toFixed(4)*10000;
    var timeId = new Date().getTime();
    let cookie = await login.getCookie().then((data)=>data===null?utils.fail('网络错误',ctx):data);
    if(cookie === null) return false;
    var _viewstate = await login.getVIEWSTATE(cookie).then((data)=>data===null?utils.fail('网络错误',ctx):data);
    if(_viewstate === null) return false;
    var yzmImgResult = await login.getYzmImg(cookie,timeId.toString()+random.toString()).then((data)=>data===null?utils.fail('网络错误',ctx):data);
    console.log(yzmImgResult);
    if(yzmImgResult === null) return false;
    ctx.body = {cookie:cookie,id:timeId,viewstate:_viewstate,random:random};
    setTimeout(()=>{
        if(fs.existsSync(`../images/${timeId}${random}.jpg`)){
            fs.unlink(`../images/${timeId}${random}.jpg`, (err) => {
                if (err) throw err;
                console.log('文件已删除');
            });
        }
    },20000);
});

router.get('/changeYzm',async (ctx,next)=>{
    //TODO容错
    var random = Math.random().toFixed(4)*10000;
    var yzmImgResult = await login.getYzmImg(ctx.query['cookie'],ctx.query['id']+random.toString()).then((data)=>data===null?utils.fail('网络错误',ctx):data);
    if(yzmImgResult === null) return false;
    ctx.body = {id:ctx.query['id'],random:random};
    setTimeout(()=>{
        if(fs.existsSync(`../images/${ctx.query['id']}${random}.jpg`)){
            fs.unlink(`../images/${ctx.query['id']}${random}.jpg`, (err) => {
                if (err) throw err;
                console.log('文件已删除');
            });
        }
    },20000);
});

router.post('/yzm',async (ctx,next)=>{
    // console.log(ctx.request.body);
    let [username,password,yzmCrypto] = login.encrypto(ctx.request.body['username'],ctx.request.body['password'],ctx.request.body['yzm']);
    var loginRes = await login.simulateLogin(username,password,yzmCrypto,ctx.request.body['cookie'],ctx.request.body['viewstate'] ).then((data)=>data===null?utils.fail('网络错误',ctx):data.resData);
    if(loginRes === null) return false;
    try {
        var result = /<font color="Red">(.+?)<\/font>/.exec(loginRes)[1].replace(/<br.*?>/,'');
        console.log(result);
    } catch (error) {
        console.log(error);
        ctx.body = {fail:'网络错误'};
        return false;
    }
    if(result.indexOf('验证码')!=-1){
        ctx.body = {fail:'验证码错误'};
    }
    else if(result.indexOf('帐号或密码不正确')!=-1){
        ctx.body = {fail:'账号或密码不正确'};
    }
    else{
        ctx.body = {success:'成功登录'};
    }
});

router.get('/score',async (ctx,next)=>{
    console.log('score');
    var random = Math.random().toFixed(4)*10000;
    var src = await score.getScore(ctx.query['cookie'],ctx.query['id'],ctx.query['xn'],ctx.query['xq'],random).then((data)=>data===null?utils.fail('当前学期未有成绩',ctx):data);
    if(src === null) return false;
    //TODO无法查询报错
    ctx.body = { src:`${ctx.query['id']}cj${random}.jpg`};
    //TODO 挂太多定时器消耗性能
    setTimeout(()=>{
        if(fs.existsSync(`../images/${ctx.query['id']}cj${random}.jpg`)){
            fs.unlink(`../images/${ctx.query['id']}cj${random}.jpg`, (err) => {
                if (err) throw err;
                console.log('文件已删除');
            });
        }
    },120000);
});

router.get('/gpa',async (ctx,next)=>{
    ctx.body = {gpa:await GPA.getGPA(ctx.query['id']+'cj').then(data=>data)};
});

router.get('/kcb',async (ctx,next)=>{
    //TODO学年学期
    console.log(ctx.query['id']);
    var random = Math.random().toFixed(4)*10000;
    var yzm = await kcb.getYzm(ctx.query['cookie']).then((data)=>data===null?utils.fail('网络错误',ctx):data);
    if(yzm === null) return false;
    var imgSrc = await kcb.postYzm(yzm['xnxq'],yzm['randomStr'],yzm['hidyzm'],yzm['hidsjyzm'],ctx.query['cookie']).then((data)=>data===null?utils.fail('网络错误',ctx):data);
    if(imgSrc === null) return false;
    var getKcbResult = await kcb.getKcb(ctx.query['cookie'],ctx.query['id'] + random.toString(),imgSrc,yzm['randomStr']).then((data)=>data===null?utils.fail('网络错误',ctx):data);
    if(getKcbResult == null) return false;
    ctx.body = {src:`${ctx.query['id']}${random}kc.jpg`};
    setTimeout(()=>{
        if(fs.existsSync(`../images/${ctx.query['id']}${random}kc.jpg`)){
            fs.unlink(`../images/${ctx.query['id']}${random}kc.jpg`, (err) => {
                if (err) throw err;
                console.log('文件已删除');
            });
        }
    },120000);
});

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
});

app.use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

var httpsOptions = {
    cert: fs.readFileSync('/etc/nginx/1_misakiemi.cn_bundle.crt'),
    key: fs.readFileSync('/etc/nginx/2_misakiemi.cn.key'),
    requestCert: false,
    rejectUnauthorized: false
};
var httpsServer = https.createServer(httpsOptions, app.callback());
httpsServer.listen(port);