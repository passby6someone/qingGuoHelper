//app.js
App({
  onLaunch:function(){
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    });

    const that = this;
    wx.cloud.init();
    wx.cloud.callFunction({
      // 云函数名称
      name: 'login',
      // 传给云函数的参数
      data: {},
    })
      .then(res => {
        // console.log(res.result);
        let account = JSON.parse(res.result['accountInfo']);
        that.globalData['openid'] = res.result['openid'];
        if (account['data'].length !== 0) {
          // console.log(account);
          Object.assign(that.globalData, {
            username: account.data[0]['username'],
            password: account.data[0]['password']
          });
          console.log(that.globalData);
        }
        that.globalData['done'] = true;
      })
      .catch(console.error);
  },
  globalData: {
    userInfo: null,
    username:'',
    password:'',
    openid:'',
    done:false,
    hasLogin:false
  }
})