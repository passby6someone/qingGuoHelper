// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  let accounts = '';
  const db = cloud.database();
  const account = db.collection('account');
  await account.where({
    openid: wxContext.OPENID
  })
  .get()
  .then(res => {
    console.log(res);
    accounts = JSON.stringify(res);
  });

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    accountInfo:accounts
  }
}