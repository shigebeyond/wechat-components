// components/upload/upload.ts
import { upload_img } from "../../api/upload_img"
var app = getApp()
// 获得原图的相对路径
function getOriginImgUri(url){
  url = url.replace(/^https?:\/\/[^\/]+\//g,'') // 去掉域名头
  //console.log(url)
  url = url.replace(/_\d+x\d+\.png$/g,'') // 去掉缩略尺寸尾
  //console.log(url)
  return url
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imageUrls: {
      // 上传的图片url的json数组
      type: String,
      value: "",
    },
    required: {
      // 必填
      type: Boolean,
      value: false,
    },
    label: {
      // 标签
      type: String,
      value: "",
    },
    max: {
      // 默认可以上传10张图片
      type: Number,
      value: 10,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageList: [], // 要上传的图片对象
    imageUrlList: [], // 要上传的图片路径
  },
  observers:{
    // 订阅父组件传过来的url
    'imageUrls':function(imageUrls){
      //console.log('imageUrls: ', imageUrls);
      if(imageUrls == "")
        return
      
      var imagesArr = imageUrls.split(",")
      // if(!/^https?:/.test(imagesArr[0])) // 相对uri就不修改上传组件内部状态，因为相对uri是由组件内部触发变化的
      //   return
      if(this.data.imageUrlList.toString() == imagesArr.toString()) // 检查`现有的属性` vs `收到的属性` 是否一致，如果一致就不处理了
        return
      //console.log('trigger imageUrls observer ')
      var tempList:any[] = []
      var tempUrlList:any[] = []
      imagesArr.forEach(el => {
        let obj = {
          url: el,
          isImage: true,
          deletable: true,
          name: "图片"+new Date().getTime(),
        }
        tempUrlList.push(getOriginImgUri(el)) // 绝对url转相对uri
        tempList.push(obj)
        this.setData({
          imageList:tempList,
          imageUrlList:tempUrlList
        })
      });
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //图片上传
    afterRead(e) {
      var _this = this
      // const { file } = e.detail;
      var imageList: any[] = []
      var imageUrlList: any[] = []
      e.detail.file.forEach((el, index) => {
        let obj = {
          url: el.url,
          isImage: true,
          deletable: true,
          name: "图片" + new Date().getTime(),
        }
        imageList.push(obj)
        imageUrlList.push(el.url)
      })
      _this.setData(
        {
          imageList: [..._this.data.imageList, ...imageList],
          imageUrlList: [..._this.data.imageUrlList, ...imageUrlList],
        },
        () => {
          
          // this.setData({
          //   imageUrls: this.data.imageUrlList.toString(),
          // })
        }
      )
      
      this.uploadImgs(function () {})
    },
    uploadImgs(callback) {
      // 上传图片
      wx.showLoading({
        title:''
      })
      var _this = this
      let tempObj: any[] = []
      this.data.imageUrlList.forEach((el, index) => {
        let obj = {}
        if (el.indexOf("tmp") > 0) {
          obj.index = index
          obj.path = el
          tempObj.push(obj)
        }
      })
      //没有需要上传的图片直接回调
      if (tempObj.length == 0) {
        callback()
        return
      }
      let data = {
        type: "resources",
      }
      var length = 1
      // 逐个图片上传
      tempObj.forEach((el) => {
        // 发图片上传请求
        // upload_img(url, parm, path, key, success, fail)
        upload_img(
          "upload/upload_img",
          data,
          el.path,
          "img",
          (res) => {
            wx.hideLoading()
            //无论成功或失败都要关闭loading图标
            if (res.code == 200) {
              _this.data.imageList[el.index].url = res.data.url // 缩略图绝对url
              _this.data.imageUrlList[el.index] = res.data.relative // 原图相对uri
            } else {
              wx.showToast({
                icon: "none",
                title: `第${el.index + 1}张上传失败`,
              })
            }
            if (length == tempObj.length) {
              // 所有图片上传完，要回调(如提交)
              var resimageList2 = _this.data.imageList.filter((el) => {
                return el.url.indexOf("//tmp") == -1
              })
              var resimageArry2 = _this.data.imageUrlList.filter((el) => {
                return el.indexOf("//tmp") == -1
              })
              _this.setData(
                {
                  imageList: resimageList2,
                  imageUrlList: resimageArry2,
                },
                () => {
                  _this.setData({
                    imageUrls: _this.data.imageUrlList.toString(),
                  },()=>{
                    console.log("成功")
                  })
                  
                  callback()
                }
              )
            }
            length++
          },
          (res) => {
            wx.hideLoading()
            wx.showToast({
              title: res.msg,
              icon: "error",
              duration: 1500,
            })
          }
        )
      })
    },
    delimage(e) {
      var _this = this
      let { index } = e.detail
        _this.data.imageList.splice(index, 1),
        _this.data.imageUrlList.splice(index, 1),
        // Array.splice(index,n)
        this.setData({
          imageList: _this.data.imageList,
          imageUrlList: _this.data.imageUrlList,
        },()=>{
          this.setData({
            imageUrls: _this.data.imageUrlList.toString(),
          })
        })
          // imageUrls: JSON.stringify(_this.data.imageUrlList),
        
        
    },
  },
})
