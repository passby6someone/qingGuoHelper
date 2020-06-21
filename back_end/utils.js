const http = require('http');
const iconv = require("iconv-lite");
const crypto = require('crypto');

const to = promise => promise.then(res=>[null,res]).catch(err=>[err]);

const fail = (reason,ctx) => {
    ctx.body = {fail:reason};
    console.log('error');
    return null;
}

function encryptoMD5(str){
    var hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}

function request(newOptions,postData={}){
    var options = {
        port: 80,
        timeout: 9000,
        method:'GET'
    };
    options = Object.assign({},options,newOptions);

    // console.log(options);
    
    return new Promise((resolve,reject)=>{
        var result = {};
        const req = http.request(options,(res)=>{
            result['res'] = res;
            res.setEncoding('binary');
            var chunks = [];
            res.on('data', (chunk) => {
                chunks.push(chunk);
                // result['resData'] = chunk;
            });
            res.on('end', () => {
                // console.log();
                var decodedBody = iconv.decode(chunks.join(''), 'gb2312');
                result['resData'] = decodedBody;
                resolve(result);
            });
        });
    
        req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
            reject(e);
        });

        req.on('timeout',()=>{
            reject('网络错误');
        });
    
        // 将数据写入请求主体。
        if(options['method'] === 'POST'){
            req.write(postData);
            // console.log(postData);
        }
        req.end();
    })
}
function requestImg(newOptions,postData={}){
    var options = {
        port: 80,
        timeout: 9000,
        method:'GET'
    };
    options = Object.assign({},options,newOptions);

    // console.log(options);

    return new Promise((resolve,reject)=>{
        var result = {};
        const req = http.request(options,(res)=>{
            result['res'] = res;
            res.setEncoding('binary');
            var chunks = '';
            res.on('data', (chunk) => {
                chunks += chunk;
            });
            res.on('end', () => {
                result['resData'] = chunks;
                resolve(result);
            });
        });
    
        req.on('timeout',()=>{
            reject('网络错误');
        });

        req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
            reject(e);
        });
    
        // 将数据写入请求主体。
        if(options['method'] === 'POST'){
            req.write(postData);
        }

        req.end();
    })
}

module.exports = {
    to:to,
    fail:fail,
    encryptoMD5:encryptoMD5,
    request:request,
    requestImg:requestImg
}