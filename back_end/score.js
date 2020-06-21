const utils = require('./utils');
const fs = require('fs');
const querystring = require('querystring');

async function getScore(cookie,fileTime,xn,xq,random){
    
    var postParams = {
        hostname:'121.193.151.131',
        path:'/jwweb/xscj/Stu_MyScore_rpt.aspx',
        method:'POST',
        headers:{
            "Referer":"http://121.193.151.131/jwweb/xscj/Stu_MyScore.aspx",
            "Origin" :"http://121.193.151.131",
            "Host" : "121.193.151.131",
            "Content-Type" : "application/x-www-form-urlencoded",
            "Cookie":cookie
        }
    }
    var Params = {
        sel_xn: xn,
        sel_xq: xq,
        SJ: 1,
        btn_search: '%BC%EC%CB%F7',
        SelXNXQ: 2,
        zfx_flag: 0,
        zxf: 0
    }

    var postData = querystring.stringify(Params);

    try {
        var imgSrc = await utils.request(postParams,postData).then((data)=>/'(Stu_MyScore_Drawimg.aspx.*?)'/.exec(data.resData)[1]);
    } catch (error) {
        return null;
    }

    console.log(imgSrc);

    var imgOptions = {
        hostname:'121.193.151.131',
        path:'/jwweb/xscj/' + imgSrc,
        headers:{
            "Referer": "http://121.193.151.131/jwweb/xscj/Stu_MyScore_rpt.aspx",
            "Host" : "121.193.151.131",
            "Cookie":cookie
        }
    }

    var result = await utils.requestImg(imgOptions).then((data)=>{
        fs.writeFileSync(`../images/${fileTime}cj${random}.jpg`,data.resData,'binary');
        return `${fileTime}cj.jpg`
    });

    return result;
}

module.exports = {
    getScore:getScore
}