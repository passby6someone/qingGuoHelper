// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    cookie:'',
    username:'',
    password:'',
    yzm:'',
    viewstate:'',
    yzmLoad:false,
    yzmSrc:'',
    scoreLoad:false,
    scoreSrc:'',
    alreadySubmit:false,
    err:false,
    errMsg:'',
    xn:['大一','大二','大三','大四'],
    xnCur: 0,
    xq: ['上学期', '下学期'],
    xqCur: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://www.misakiemi.cn:3000/login',
      success(res){
        console.log(res);
        that.setData({
          yzmLoad:true,
          yzmSrc:`https://www.misakiemi.cn/kcb/images/${res.data['id']}.jpg`,
          id:res.data['id'],
          cookie:res.data['cookie'],
          viewstate: res.data['viewstate']
        })
      }
    });
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

  saveChange:function(e){
    console.log(e);
    var target = e.target.id;
    console.log(target);
    var value = e.detail.value;
    var o = {};
    o[`${target}`] = value;
    this.setData(o);
  },

  showImg:function(e){
    // var that = this;
    var src = this.data.scoreSrc//获取data-src
    var imgList = [this.data.scoreSrc];//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的https链接
      urls: imgList // 需要预览的图片https链接列表
    })
  },

  queryScore:function(){
    console.log(this.data);
    this.setData({
      alreadySubmit:true
    })
    var that = this;
    wx.request({
      url: 'https://www.misakiemi.cn:3000/yzm',
      method:'POST',
      data:{
        'username':that.data.username,
        'password':that.data.password,
        'yzm':that.data.yzm,
        'cookie':that.data.cookie,
        'viewstate': that.data.viewstate,
        'id':that.data.id,
        'xn': that.data.xnCur + parseInt(that.data.username.slice(0,4)),
        'xq': that.data.xqCur
      },
      success:function(res){
        console.log(res);
        if('src' in res.data){
          that.setData({
            scoreLoad:true,
            scoreSrc:`https://www.misakiemi.cn/kcb/images/${res.data.src}`
          });
        }
        else{
          that.setData({
            scoreLoad: true,
            err:true,
            errMsg:res.data['fail']
          })
        }
      }
    });
  },

  xnSelect:function(e){
    this.setData({
      xnCur: e.currentTarget.dataset.id,
    })
  },
  xqSelect: function (e) {
    this.setData({
      xqCur: e.currentTarget.dataset.id,
    })
  }
})