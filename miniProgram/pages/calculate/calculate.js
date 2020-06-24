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
    src: false,
    numInput: false,
    num: 0,
    GPAshow: false,
    GPA: 0,
    imgSrc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if ('src' in options) {
      this.setData({
        src: options.src
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
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "天财教务小助手",        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index',        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '/images/ita.jpg',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    };
    return shareObj;
  },
  saveNum: function (e) {
    this.setData({
      inputArr: new Array(parseInt(e.detail.value)).fill(null).map(() => new creditAndScore())
    });
    // this.data.inputArr = this.data.inputArr.forEach((cur,index)=>{
    //   cur = new creditAndScore();
    // });
    console.log(this.data.inputArr);
  },
  saveData: function (e) {
    console.log(e);
    this.data.inputArr[e.currentTarget.dataset.index][e.currentTarget.dataset.type] = e.detail.value;
    console.log(this.data.inputArr);
  },
  numConfirm: function () {
    this.setData({ numInput: true });
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
  submit: function () {
    const that = this;
    var sumCredit = 0, sumGPA = 0;
    this.data.inputArr.forEach(cur => {
      let score = parseFloat(cur.score);
      let credit = parseInt(cur.credit);
      sumGPA += credit * (4 - 3 * (100 - score) * (100 - score) / 1600);
      sumCredit += credit;
    });
    console.log(sumGPA);
    console.log(sumCredit);
    (async ()=>{
      that.setData({
        GPA: (sumGPA / sumCredit).toFixed(4),
        GPAshow: true,
        imgSrc: await pickImgShow(sumGPA / sumCredit)
      });
    })();
  },
  hideModal: function () {
    this.setData({ GPAshow: false });
  }
});

function creditAndScore() {
  this.credit = -1;
  this.score = -1;
}

function pickImgShow(gpa){
  let fileId = '';
  if(gpa > 3.5){
    fileId = 'cloud://cloud-h139j.636c-cloud-h139j-1300645783/credit/0.jpg';
  }
  else if(gpa > 3){
    fileId = 'cloud://cloud-h139j.636c-cloud-h139j-1300645783/credit/1.jpg';
  }
  else if(gpa > 2.5){
    fileId = 'cloud://cloud-h139j.636c-cloud-h139j-1300645783/credit/2.jpg';
  }
  else if(gpa > 2){
    fileId = 'cloud://cloud-h139j.636c-cloud-h139j-1300645783/credit/3.jpg';
  }
  else{
    fileId = 'cloud://cloud-h139j.636c-cloud-h139j-1300645783/credit/4.jpg';
  }
  return wx.cloud.getTempFileURL({
    fileList: [{
      fileID: fileId,
      // maxAge: 60 * 60, // one hour
    }]
  }).then(res => {
    // get temp file URL
    console.log(res.fileList)
    return res.fileList[0]['tempFileURL'];
  }).catch(error => {
    // handle error
  });
}