// pages/cj/cj.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kcbImg:'',
    kcbLoad:false,
    kcbSrc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var loginInfo = JSON.parse(wx.getStorageSync('loginInfo'));
    console.log(loginInfo);
    var cookie = loginInfo['cookie'];
    var id = loginInfo['id'];
    var username = wx.getStorageSync('username');
    var that = this;
    wx.request({
      url: 'https://www.misakiemi.cn:3000/kcb',
      data:{
        id:id,
        cookie:cookie,
      },
      success:function(res){
        if('src' in res.data){
          that.setData({
            kcbLoad:true,
            kcbImg: `https://www.misakiemi.cn/kcb/images/${res.data['src']}`,
            kcbSrc: `https://www.misakiemi.cn/kcb/images/${res.data['src']}`
          });
        }
      }
    })
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

  },
  showImg: function (e) {
    // var that = this;
    var src = this.data.kcbSrc//获取data-src
    var imgList = [this.data.kcbSrc];//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的https链接
      urls: imgList // 需要预览的图片https链接列表
    });
  },
  queryKcb:function(){
    this.setData({kcbLoad:false});
    var loginInfo = JSON.parse(wx.getStorageSync('loginInfo'));
    console.log(loginInfo);
    var cookie = loginInfo['cookie'];
    var id = loginInfo['id'];
    var username = wx.getStorageSync('username');
    var that = this;
    wx.request({
      url: 'https://www.misakiemi.cn:3000/kcb',
      data: {
        id: id,
        cookie: cookie,
      },
      success: function (res) {
        console.log(res);
        if ('src' in res.data) {
          that.setData({
            kcbLoad: true,
            kcbImg: `https://www.misakiemi.cn/kcb/images/${res.data['src']}`,
            kcbSrc: `https://www.misakiemi.cn/kcb/images/${res.data['src']}`
          });
        }
      }
    });
  }
})