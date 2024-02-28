Component({
  /**
   * 组件的属性列表
   */
  properties: {
    switchNum: {
    	type: Number,
    	value: 1,
    },

    required: { // 必填
      type: Boolean,
      value: false
    },
    label: {
    	type: String,
    	value: '标签'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    switchValue: true,
  },
  observers:{
    'switchNum':function(switchNum){
      console.log('switchNum: ', switchNum);
      this.setData({
        switchValue: switchNum==1,
      })
    }
  },
  attached() {
      // this.setData({
      //   switchValue: this.properties.switchNum==1,
      // })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    switchChange(e){
      this.setData({
        switchValue: e.detail,
        switchNum:e.detail==true?1:0
      })
    },
  }
})
