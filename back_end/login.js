const utils = require('./utils');
const fs = require('fs');
const querystring = require('querystring');

const encrypto = (username,password,yzm) => {
    var username = username;
    var password = utils.encryptoMD5(username + utils.encryptoMD5(password).slice(0,30).toUpperCase() + '10070').slice(0,30).toUpperCase();
    var yzmCrypto = utils.encryptoMD5(utils.encryptoMD5(yzm.toUpperCase()).slice(0,30).toUpperCase() + '10070').slice(0,30).toUpperCase();
    return [username,password,yzmCrypto];
}

async function getCookie(){
    var options = {
        hostname: '121.193.151.131',
        path:'/jwweb/home.aspx',
        timeout: 3000,
        headers:{
            'Host':'121.193.151.131'
        }
    }
    
    let [err,homePageRes] = await utils.to(utils.request(options));
    if(err!==null) return null;
    cookie = homePageRes.res.headers['set-cookie'];
    return `name=value; ${/(A.*?=.*?;)/.exec(cookie[1])[1]} ${/(in.*?=\d+?;)/.exec(cookie[2])[1]}`;
}

async function getVIEWSTATE(cookie){
    var options = {
        hostname:'121.193.151.131',
        path:'/jwweb/_data/login_home.aspx',
        headers:{
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
            'Referer': 'http://121.193.151.131/jwweb/home.aspx',
            'Host': "121.193.151.131",
            'Content-Type': 'text/html; charset=utf-8',
            'Cookie': cookie
        }
    }
    let [err,loginPage] = await utils.to(utils.request(options));
    if(err!==null) return null;
    const VIEWSTATE = /name="__VIEWSTATE" value="(.*)"/.exec(loginPage.resData)[1];
    return VIEWSTATE;
}

async function getYzmImg(cookie,fileTime){

    var options = {
        hostname:'121.193.151.131',
        path:'/jwweb/sys/ValidateCode.aspx?t=' + new Date().getMilliseconds(),
        // path:'/jwweb/sys/ValidateCode.aspx',
        headers:{
            'Cookie':"name=value; "+cookie,
            'Referer': 'http://121.193.151.131/jwweb/_data/login_home.aspx',
            'Accept':'image/webp,image/apng,image/*,*/*;q=0.8',
            'Host':'121.193.151.131',
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
            'Connection':'keep-alive'
        }
    }

    let [err,yzmData] = await utils.to(utils.requestImg(options));
    if(err !== null) return null;
    let [err1,writeResult] = await new Promise((resolve,reject)=>{
        fs.writeFile(`../images/${fileTime}.jpg`,yzmData.resData,'binary',(error)=>{
            if(error){
                reject( error );
            }
            resolve(true)
        });
    }).then(data=>[null,data]).catch(error=>[error]);
    console.log(err1);
    if(err1 !== null) return null;
    return true;
}

async function simulateLogin(username,password,yzm,cookie,viewstate){

    var body = {
        '__VIEWSTATE':viewstate,
        'pcInfo':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36undefined5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 SN:NULL',
        'txt_mm_expression':'',
        'txt_mm_length':'',
        'txt_mm_userzh':'',
        'typeName':'%D1%A7%C9%FA',
        'dsdsdsdsdxcxdfgfg': password,
        'fgfggfdgtyuuyyuuckjg':yzm,
        'Sel_Type': 'STU',
        'txt_asmcdefsddsd':username,
        'txt_pewerwedsdfsdff':'',
        'txt_psasas':'%C7%EB%CA%E4%C8%EB%C3%DC%C2%EB',
        'txt_sdertfgsadscxcadsads':'',
    }

    var postData = querystring.stringify(body);

    var options = {
        hostname:'121.193.151.131',
        path:'/jwweb/_data/login_home.aspx',
        method:'POST',
        headers:{
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Cookie': "name=value; "+cookie,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
            'Referer': 'http://121.193.151.131/jwweb/_data/login_home.aspx',
            "Host" : '121.193.151.131',
            'Origin': 'http://121.193.151.131',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    }

    var [err,res] = await utils.to(utils.request(options,postData));
    if(err !== null) return null;
    return res;
}

module.exports = {
    encrypto:encrypto,
    getCookie:getCookie,
    getVIEWSTATE:getVIEWSTATE,
    getYzmImg:getYzmImg,
    simulateLogin:simulateLogin
}