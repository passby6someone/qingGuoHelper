const utils = require('./utils');
const qs = require('querystring');
const fs = require('fs');

//TODO学年学期
var xnxq = '20191';

function randomString(len) 
{　
    len = len || 32;
    var ss="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var maxPos = ss.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
    　　pwd += ss.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

async function getYzm(cookie){
    var yzmPageOption = {
        hostname:'121.193.151.131',
        path:'/jwweb/znpk/Pri_StuSel.aspx',
        headers:{
            Cookie:'name=value; '+cookie,
            Referer:'http://121.193.151.131/jwweb/znpk/Pri_StuSel.aspx',
            Host:'121.193.151.131'
        }
    }
    let [err,data] = await utils.to( utils.request(yzmPageOption) );
    if(err !== null) return null;
    var yzm = {},randomStr = randomString(15);
    yzm['xnxq'] = xnxq;
    yzm['randomStr'] = randomStr;
    yzm['hidyzm'] = /name="hidyzm" value="(\w+)"/.exec(data.resData)[1];
    yzm['hidsjyzm'] = utils.encryptoMD5( '10070' + xnxq + randomStr ).toUpperCase();
    return yzm;
}

async function postYzm(xnxq,randomStr,hidyzm,hidsjyzm,cookie){

    var data = {
        Sel_XNXQ: xnxq,
        rad: 0,
        px: 0,
        txt_yzm: '',
        hidyzm: hidyzm,
        hidsjyzm: hidsjyzm,
    }

    var options = {
        hostname:'121.193.151.131',
        path:'/jwweb/znpk/Pri_StuSel_rpt.aspx?m=' + randomStr,
        method:'POST',
        headers:{
            Host:'121.193.151.131',
            Origin:' http://121.193.151.131',
            Referer: 'http://121.193.151.131/jwweb/znpk/Pri_StuSel.aspx',
            'Cookie': "name=value; "+cookie,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(qs.stringify(data))
        }
    }

    var [err,res] = await utils.to(utils.request(options,qs.stringify(data)));
    console.log(err);
    if(err !== null) return null;
    return /<img.+src='(.+)'>/.exec(res.resData)[1];;

}

async function getKcb(cookie,fileTime,imgSrc,randomStr){
    var options = {
        hostname:'121.193.151.131',
        path:'/jwweb/znpk/' + imgSrc,
        headers:{
            Cookie: 'name=value; ' + cookie,
            Host: '121.193.151.131',
            Referer: 'http://121.193.151.131/jwweb/znpk/Pri_StuSel_rpt.aspx?m=' + randomStr
        }
    }

    let [err,kcbData] = await utils.to(utils.requestImg(options));
    if(err !== null) return null;
    let [err1,writeResult] = await new Promise((resolve,reject)=>{
        console.log(fileTime);
        fs.writeFile(`../images/${fileTime}kc.jpg`,kcbData.resData,'binary',(error)=>{
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

module.exports = {
    getYzm:getYzm,
    postYzm:postYzm,
    getKcb:getKcb
}