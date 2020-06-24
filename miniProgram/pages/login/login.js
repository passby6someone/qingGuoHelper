// pages/test/test.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tipModal:true,
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
    tip:'验证码加载中...',
    navType:''
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
              url: '../login/login?to='+options.to,
            });
          },3000);
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

    this.setData({
      navType:options['to'],
      username:app.globalData['username'],
      password:app.globalData['password']
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
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "天财教务小助手",        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index',        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '/images/ita.jpg',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    };
    return shareObj;
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
          app.globalData['hasLogin'] = true;
          Object.assign(app.globalData, {
            username: that.data['username'],
            password: that.data['password']
          });
          if (that.data.navType === 'account'){
            let db = wx.cloud.database();
            db.collection('account').add({
              data:{
                openid: app.globalData.openid,
                username: that.data.username,
                password: that.data.password
              }
            })
              .then(console.log)
              .catch(console.error);
          }
          setTimeout(()=>{
            wx.redirectTo({
              url: `../${that.data.navType}/${that.data.navType}`,
            });
          },2000);
        }
        else if('fail' in res.data){
          that.setData({
            loginModalTitle:'登录失败',
            loginModalContent:res.data['fail']+",即将刷新"
          });
          setTimeout(() => {
            wx.redirectTo({
              url: `../login/login?to=${that.data.navType}`,
            });
          }, 2000);
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
  changeYzm: function(){
    var that = this;
    wx.request({
      url: 'https://www.misakiemi.cn:3000/changeYzm',
      data: {
        cookie: that.data.cookie,
        id: that.data.id
      },
      success(res) {
        if ('fail' in res.data) {
          that.setData({
            tip: '加载失败，即将重试'
          });
          setTimeout(() => {
            wx.redirectTo({
              url: `../login/login?to=${that.data.navType}`,
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
});