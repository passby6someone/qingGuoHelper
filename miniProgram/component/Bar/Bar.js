Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    curTab: {
      type: String,
      value: 'menu',
    }
  },
  data: {
    tabList:[
      '/images/basics.png',
      '/images/about.png'
    ],
    curTab:''
  },
  attached:function(){
    console.log(this.properties);
    switch(this.properties.curTab){
      case 'index':
        this.setData({
          tabSrc: [
            '/images/basics_cur.png',
            '/images/about.png'
          ]
        });
        break;
      case 'me':
        this.setData({
          tabSrc: [
            '/images/basics.png',
            '/images/about_cur.png'
          ]
        });
        break;
    }
    const that = this;
    this.setData({
      curTab: that.properties.curTab
    })
  },
  methods: {
    switchTab: function (e) {
      console.log(e);
      let tabName = e.currentTarget.dataset['tab'];
      if(this.properties.curTab !== tabName){
        wx.redirectTo({
          url: `/pages/${tabName}/${tabName}`,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        });
      }
    }
  },
})