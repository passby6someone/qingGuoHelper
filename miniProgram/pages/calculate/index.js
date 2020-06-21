// pages/calculate/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // width:0,
    // height:0,
    CustomBar: app.globalData.CustomBar,
    src:false,
    numInput:false,
    num:0,
    GPAshow:false,
    GPA:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if('src' in options){
      this.setData({
        src:options.src
      });
    }
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
  saveNum:function(e){
    this.setData({
      inputArr: new Array(parseInt(e.detail.value)).fill(null).map(() => new creditAndScore())
    });
    // this.data.inputArr = this.data.inputArr.forEach((cur,index)=>{
    //   cur = new creditAndScore();
    // });
    console.log(this.data.inputArr);
  },
  saveData:function(e){
    console.log(e);
    this.data.inputArr[e.currentTarget.dataset.index][e.currentTarget.dataset.type] = e.detail.value;
    console.log(this.data.inputArr);
  },
  numConfirm:function(){
    this.setData({numInput:true});
  },
  showImg: function (e) {
    // var that = this;
    var src = this.data.src//获取data-src
    var imgList = [this.data.src];//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的https链接
      urls: imgList // 需要预览的图片https链接列表
    });
  },
  submit:function(){
    var sumCredit = 0,sumGPA = 0;
    this.data.inputArr.forEach(cur=>{
      let score = parseFloat(cur.score);
      let credit = parseInt(cur.credit);
      sumGPA += (credit * (score - 50)) / 10;
      sumCredit += credit;
    });
    console.log(sumGPA);
    console.log(sumCredit);
    this.setData({ 
      GPA: (sumGPA / sumCredit).toFixed(4),
      GPAshow:true
    })
  },
  hideModal:function(){
    this.setData({GPAshow:false});
  }
});

function creditAndScore(){
  this.credit = -1;
  this.score = -1;
}