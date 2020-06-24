// pages/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasAccount:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    console.log(app.globalData);
    let intervalHandle = setInterval(()=>{
      if (app.globalData['done']){
        console.log(app.globalData);
        if (app.globalData['username'] === '') {
          that.setData({
            hasAccount: false
          });
        }
        clearInterval(intervalHandle);
      }
    },500);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "天财教务小助手",        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index',        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '/images/ita.jpg',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    };
    return shareObj;
  },
  navTo:function(e){
    let to = e.currentTarget.dataset['to'];
    if (app.globalData['done']) {
      if(to === 'kcb' || to === 'cj'){
        if (app.globalData['username'] !== ''){
          if (app.globalData['hasLogin']) {
            nav(`/pages/${to}/${to}`);
          }
          else {
            nav(`/pages/login/login?to=${to}`);
          }
          return false;
        }
        else{
          this.setData({
            hasAccount:false
          });
          return false;
        }
      }
      nav(`/pages/${to}/${to}`);
    }
    function nav(path){
      wx.navigateTo({
        url: path,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      });
    }
  },
  userType:function(e){
    console.log(e.currentTarget.dataset['usertype']);
    if (e.currentTarget.dataset['usertype'] === 'customer'){
      this.setData({
        hasAccount: true
      });
    }
    else{
      wx.navigateTo({
        url: `/pages/account/account`,
      });
      this.setData({
        hasAccount: true
      });
    }
  }
});