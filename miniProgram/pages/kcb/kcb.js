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
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "天财教务小助手",        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index',        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '/images/ita.jpg',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    };
    return shareObj;
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