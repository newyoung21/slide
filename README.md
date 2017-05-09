## 移动端幻灯片组件

### 2种使用方法
* 引用 slide.js 文件
  ```
  只需一条语句

	touch(obj);

	参数 obj 是一个对象
	obj = {
		container: '.slide', 选择器

		data:  [{'src':'./images/202.jpg'}], 后台传来数据，是一个数组,数组每一项都是一个对象，对象必须要有src属性

		heigth:  '180px',可选，默认为180px

		time: 3000, 每张自动播发时间间隔,可选，默认为3000
	}
  ```
* 引用 slide2.js 封装到jQuery插件
  ```

  	$('.silde').touch(obj)

  	obj除了不用container 参数，其他与上面一样

  ```

  ### 展示效果 调为手机模式 <a href="https://newyoung21.github.io/slide/">狠狠的点击这里demo</a>