### 0. 通用
对所有组件都有 `required`  属性，非必填，可控制是否在label左边实现红色的 *  号
```
1. 不显示红色*
<jumpToselect ... ></jumpToselect>
2. 显示红色*
<jumpToselect ... required="{{true}}"></jumpToselect>
```
![](img/2023-08-09/64d30ea0606ba.png)

### 1. switchtoint
对switch组件简单封装，将他的bool值，转为我们后端接收的int(0或1)值

````
<switchtoint label="银行代码" model:switchNum="{{field}}"></switchtoint>
````
label:开关组件左边的文字提示比如，是否启用
switchNum:控制的字段名称，post或者get传入的参数名称

### 2. 图片上传
![](img/2023-08-04/64cc9ec6c300a.png)
```
<!-- 图片上传 -->
<uploader class="uploader" label="选择图片" model:image-urls="{{imglistText}}"></uploader>
```
imglistText 接收的值是上传后的图片相对uri的数组的json

提交前注意要手动上传图片，参考
http://192.168.0.170:4999/web/#/10?page_id=1967

### 3. 日期选择
![](img/2023-08-04/64cc9efe77802.png)
```
<!-- 时间选择 -->
<datePicker label="时间选择" model:date-value="{{dateValue}}"></datePicker>
```
dateValue 是日期字符串，接收到的值如 `2023/08/04`


### 4. 营业时间选择
![](img/2023-08-04/64cc9f9a161ff.png)
```
<worktimePicker label="营业时间" model:worktimes="{{bhListtext}}"></worktimePicker>
```

bhListtext 接收的值营业时间数组的json，如 `"[{"index":1,"weekText":"星期一到星期五","date_from":"1","date_to":"5","work_start_time":"08:00","work_end_time":"16:00"}....]`

### 5. 地址选择
![](img/2023-08-09/64d2eebee1a8b.png)
```
 <addressPicker model:area-address="{{addressValuetext}}" model:detail-address="{{detailAddress}}"></addressPicker>
```
<font color="#dd0000">**需要对应的拿省市区的接口**一般在项目的情况下为home/get_area</font>
返回两个变量:
`area-address`: 省市区三级区域地址字符串
`detail-address`: 详细地址


### 6. 跳转并选择
![](img/2023-08-09/64d2fe789bdbd.png)
```
<!-- 时间选择 -->
<jumpToselect label="合作方案" model:select-value="{{plan_id}}" jump-url="/pages/partner/plan_list"></jumpToselect>
```
1. `select-value` 接收选中结果
2. `jump-url` 要跳转的页面

- 注：
我们需要在跳转打开的新页面`/pages/partner/plan_list` 的 "确定选择"按钮处理中，回传选择结果
```
// 回传选中结果: [选中项id, 选中项名]
this.getOpenerEventChannel().emit('acceptSelectValue', [this.data.selected_id, this.data.selected_name]);
```
