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
      url: `../calculate/index?src=${that.data.scoreSrc}`,
    })
  }
})