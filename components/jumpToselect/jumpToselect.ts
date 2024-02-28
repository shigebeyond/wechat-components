// components/jumpToselect/jumpToselect.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selectValue: { // 选择的值
    	type: String,
    	value: ''
    },

    jumpUrl: { // 跳转的页面url
    	type: String,
    	value: ''
    },
    required: { // 必填
      type: Boolean,
      value: false
    },
    label: { // 标签
    	type: String,
    	value: ''
    },
    selectName: {
      type: String,
    	value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转选择
    jumpToselect() {
      const self = this
      wx.navigateTo({
        url: this.data.jumpUrl+"?id="+this.data.selectValue,
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据，一般是[选中项id, 选中项名]
          acceptSelectValue: function(v) {
            console.log(v)
            self.triggerEvent("callback",{old_value:[self.data.selectValue,self.data.selectName],new_value:v})
            self.setData({
              selectValue: v[0], // 选中项id
              selectName: v[1] // 选中项名
           })
          
          },
        },
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          //res.eventChannel.emit('xxx', { data: 'test' })
        }
      })
  },
  }
})
