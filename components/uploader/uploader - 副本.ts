// components/upload/upload.ts
import { upload_img } from "../../api/upload_img"
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
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageList: [], // 要上传的图片对象
    imageUrlList: [], // 要上传的图片路径
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
          name: "图片" + index,
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
          this.setData({
            imageUrls: JSON.stringify(this.data.imageUrlList),
          })
        }
      )
      console.log(imageUrlList)
      this.uploadImgs(function () {})
    },
    uploadImgs(callback) {
      // 上传图片
      wx.showLoading({
        mask: true,
      })
      var _this = this
      let tempObj: any[] = []
      // let tempArray: any[] = []
      this.data.imageUrlList.forEach((el, index) => {
        let obj = {}
        if (el.indexOf("tmp") > 0) {
          obj.index = index
          obj.path = el
          tempObj.push(obj)
        }
      })
      if(tempObj.length==0){
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
            //无论成功或失败都要关闭loading图标
            if (res.code == 200) {
              // tempArray.push(res.data.relative) // 收集图片的相对uri
              _this.data.imageList[el.index].url = res.data.url
              _this.data.imageUrlList[el.index] = res.data.relative
            }else{
              wx.hideLoading()
              wx.showToast({
                icon: "none",
                title: `第${el.index + 1}张上传失败`,
              })
            }
    // 如果上传次数=要上传数，即上传完成后，提交表单
          // 剔除上传失败的图片(还是本地临时图片路径)
            if (length == tempObj.length) {
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
                  imageUrls: JSON.stringify(_this.data.imageUrlList),
                },
                () => {
                  callback()
                }
              )
            }
            length++
              // 所有图片上传完，要回调(如提交)
             
            // }
            // wx.showToast({
            //   title: res.msg,
            //   icon: "error",
            //   duration: 1500,
            // })
            // callback()
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
      // 没有图片要上传，直接回调(如提交)
      if (tempObj.length == 0) {
        // 回调(如提交)
        callback()
      }
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
          imageUrls: JSON.stringify(_this.data.imageUrlList),
        })
    },
  },
})
