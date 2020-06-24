// pages/kcb/kcb.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scoreImg: '',
    scoreLoad: false,
    queryConfirm:false,
    xn: ['大一', '大二', '大三', '大四'],
    xnCur: 0,
    xq: ['上学期', '下学期'],
    xqCur: 0,
    scoreSrc: '',
    imgTip:'图片加载中...'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var src = this.data.scoreSrc//获取data-src
    var imgList = [this.data.scoreSrc];//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的https链接
      urls: imgList // 需要预览的图片https链接列表
    });
  },
  xnSelect: function (e) {
    this.setData({
      xnCur: e.currentTarget.dataset.id,
    });
  },
  xqSelect: function (e) {
    this.setData({
      xqCur: e.currentTarget.dataset.id,
    });
  },
  queryScore: function () {
    var loginInfo = JSON.parse(wx.getStorageSync('loginInfo'));
    console.log(loginInfo);
    var cookie = loginInfo['cookie'];
    var id = loginInfo['id'];
    var username = wx.getStorageSync('username');
    this.setData({queryConfirm:true});
    var that = this;
    wx.request({
      url: 'https://www.misakiemi.cn:3000/score',
      data: {
        id: id,
        cookie: cookie,
        xn: parseInt(username.slice(0, 4)) + that.data.xnCur,
        xq: that.data.xqCur
      },
      success: function (res) {
        console.log(res);
        if ('src' in res.data) {
          that.setData({
            scoreLoad: true,
            scoreImg: `https://www.misakiemi.cn/kcb/images/${res.data['src']}`,
            scoreSrc: `https://www.misakiemi.cn/kcb/images/${res.data['src']}`
          });
        }
        else{
          that.setData({
            scoreLoad: false,
            imgTip:res.data['fail']
          });
        }
      }
    });
  },
  toCalculate:function(){
    var that = this;
    wx.navigateTo({
      url: `../calculate/calculate?src=${that.data.scoreSrc}`,
    })
  }
})