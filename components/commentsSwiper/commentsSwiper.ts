// components/commentsSwiper/commentsSwiper.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    comments:{
      type:Array,
      value:[]
    },
    sec:{
      type:Number,
      value:2000
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    view_comments: [
    ],
    now_index: 0,
  },
  ready() {
    // setInterval(() => {
    //   this.addview()
    // }, this.data.sec)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    start(){
      setInterval(() => {
        this.addview()
      }, this.data.sec)
    },
    addview() {
      if(this.data.comments.length > 0){
        let temp_arr = this.data.view_comments
        let index = this.data.now_index
        
        if (index >= this.data.comments.length) {
          index = 0
        }
        let new_comment = this.data.comments[index]
        if(temp_arr.length >= 10){
          temp_arr.splice(0,5)
        }
        temp_arr.push(new_comment)
        console.log('temp_arr: ', temp_arr);
        this.setData({
          view_comments: temp_arr,
          now_index: index+1,
        })
      }
    },
  },
})
