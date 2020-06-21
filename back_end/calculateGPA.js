const https = require('https');
const fs = require('fs');
var qs = require('querystring');

function parseImg(imgPath){
  var data = fs.readFileSync(`../images/${imgPath}.jpg`);
  data = Buffer.from(data).toString('base64');
  return data;
}

function getTooken(){
  const param = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': 'dZjAj2mdBPYKN674nhRR45kS',
    'client_secret': 'H7DnsGbNVRA7gCfhVIynwv11hmAFaecQ'
  });
  const options = {
    hostname: 'aip.baidubce.com',
    path: '/oauth/2.0/token?' + param,
    // port:443,
    // agent: false,
    timeout: 300,
    method:'GET'
  }

  console.log(options);
  return new Promise((resolve)=>{
    https.get(options,res=>{
      var chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
        // result['resData'] = chunk;
      });
      res.on('end',()=>{
        // console.log(JSON.parse(chunks.join('').toString()));
        resolve(JSON.parse(chunks.join('').toString()));
      })
    });
  })
}

function postData(data,tooken){
  return new Promise(resolve=>{
    var options = {
      hostname:'aip.baidubce.com',
      path:'/rest/2.0/solution/v1/form_ocr/request'+ "?access_token=" +tooken,
      method:'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(qs.stringify(data))
      }
    }
    var chunks = [];
    let req = https.request(options,res=>{
      res.on('data',chunk => {
        chunks.push(chunk);
      });
      res.on('end',()=>{
        resolve(JSON.parse(chunks.join('').toString()));
      })
    });
    req.write(qs.stringify(data));
    req.end();
  })
}

function calculateGPA(postResult){
  var tableData = JSON.parse( postResult['result']['result_data'] );
  tableData = tableData['forms'][0]['body'];
  var col6 = [];
  var col7 = [];
  var col8 = [];
  for(let i in tableData){
      if(tableData[i]['column'] == 6){
          col6.push(tableData[i]['word']);
      }
      else if(tableData[i]['column'] == 7){
          col7.push(tableData[i]['word']);
      }
      else if(tableData[i]['column'] == 8){
          col8.push(tableData[i]['word']);
      }
  }
  var result = col6.map((cur,index)=>col6[index]+col7[index]+col8[index]);
  console.log(result);
  var sumCredit = 0,sumGPA = 0;
  for(let i = 1;i < result.length;i++){
    let match = /(\d+)\.\d+(\d\.\d)+?/.exec(result[i]);
    let score = parseInt(match[0]);
    let credit = parseFloat(match[1]) === 0 ? 1.0 : parseFloat(match[1]);
    sumGPA+=(credit*(score-50))/10;
    sumCredit+=credit;
  }
  console.log(sumGPA/sumCredit);
  let res = sumGPA/sumCredit;
  return res;
}

async function main(imgPath){
  // todo to
  try {
    var base64Img = parseImg(imgPath); 
  } catch (error) {
    
  }

  var tooken = await getTooken().then(data=>data['access_token']);
  var params = {
    image:base64Img,
    is_sync: 'true',
    request_type:'json'
  };
  var postResult = await postData(params,tooken).then(data=>data);
  return calculateGPA(postResult);
}

module.exports = {
  getGPA:main
}
