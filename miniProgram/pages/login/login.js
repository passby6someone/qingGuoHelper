// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipModal:true,
    id: null,
    cookie: '',
    username: '',
    password: '',
    yzm: '',
    viewstate: '',
    yzmLoad: false,
    yzmSrc: '',
    loginModal:false,
    loginModalTitle:'登录中',
    loginModalContent:'没什么好看的，只是为了告诉你这个按钮还有用',
    modalShow:false,
    tip:'验证码加载中...'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://www.misakiemi.cn:3000/login',
      success(res) {
        if('fail' in res.data){
          that.setData({
            tip:'加载失败，即将重试'
          });
          setTimeout(()=>{
            wx.redirectTo({
              url: '../login/login',
            });
          },3000)
        }
        console.log(res);
        that.setData({
          yzmLoad: true,
          yzmSrc: `https://www.misakiemi.cn/kcb/images/${res.data['id']}${res.data['random']}.jpg`,
          id: res.data['id'],
          cookie: res.data['cookie'],
          viewstate: res.data['viewstate']
        });
        var loginInfo = {};
        loginInfo['id'] = res.data['id'];
        loginInfo['cookie'] = res.data['cookie'];
        wx.setStorage({
          key: 'loginInfo',
          data: JSON.stringify(loginInfo),
        });
      },
      fail:function(){
        that.setData({
          tip: '网络出错，请检查网络'
        });
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
  hideTipModal:function(){
    this.setData({tipModal:false});
  },
  login: function () {
    console.log(this.data);
    this.setData({
      loginModal: true
    })
    var that = this;
    wx.request({
      url: 'https://www.misakiemi.cn:3000/yzm',
      method: 'POST',
      data: {
        'username': that.data.username,
        'password': that.data.password,
        'yzm': that.data.yzm,
        'cookie': that.data.cookie,
        'viewstate': that.data.viewstate,
        'id': that.data.id,
        // 'xn': that.data.xnCur + parseInt(that.data.username.slice(0, 4)),
        // 'xq': that.data.xqCur
      },
      success: function (res) {
        console.log(res);
        console.log('success' in res.data);
        if('success' in res.data){
          that.setData({
            loginModalTitle:'登录成功',
            loginModalContent:'别担心，马上要跳转了'
          });
          wx.setStorage({
            key: 'username',
            data: that.data.username,
          });
          setTimeout(()=>{
            wx.redirectTo({
              url: '../menu/menu',
            });
          },2000)
        }
        else if('fail' in res.data){
          that.setData({
            loginModalTitle:'登录失败',
            loginModalContent:res.data['fail']
          });
        }
        else{
          that.setData({
            loginModalTitle:'我也不知道为什么会这样',
            loginModalContent:'，你可以再试一次，欢迎加我QQ：945879305反映问题'
          });
        }
      }
    });
  },
  saveChange: function (e) {
    console.log(e);
    var target = e.target.id;
    console.log(target);
    var value = e.detail.value;
    var o = {};
    o[`${target}`] = value;
    this.setData(o);
  },
  hideModal: function(){
    this.setData({
      loginModal:false
    });
    chaengYzm.call(this);
    this.setData({
      loginModalTitle: '登录中',
      loginModalContent: '没什么好看的，只是为了告诉你这个按钮还有用'
    });
  },
  changeYzm: chaengYzm
});

function chaengYzm(){
  var that = this;
  wx.request({
    url: 'https://www.misakiemi.cn:3000/changeYzm',
    data:{
      cookie:that.data.cookie,
      id:that.data.id
    },
    success(res) {
      if ('fail' in res.data) {
        that.setData({
          tip: '加载失败，即将重试'
        });
        setTimeout(() => {
          wx.redirectTo({
            url: '../login/login',
          });
        }, 3000)
      }
      console.log(res);
      that.setData({
        yzmLoad: true,
        yzmSrc: `https://www.misakiemi.cn/kcb/images/${res.data['id']}${res.data['random']}.jpg`
      });
    },
    fail: function () {
      that.setData({
        tip: '网络出错，请检查网络'
      });
    }
  });
}