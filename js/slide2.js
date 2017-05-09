function Touch(obj){
 	this.init(obj)
}
Touch.prototype = {
	//init 为初始化函数，定义变量与函数
	init: function(obj){
		this.$c = $(obj.container);
		this.$imgs = obj.data;
		this.$len = this.$imgs.length;
		this.time = obj.time || 3000;
		this.height = obj.height;
		this.$wW = $(window).width();
		this.createElement();
		this.index = 0;
		this.hd = true;
		this.goPlay();
	},
	//创建元素
	createElement: function(){
		//创建幻灯片元素,每个幻灯片放在div容器里
		for(var i = 0; i<this.$len;i++){
			var s = $('<div><img src="'+this.$imgs[i].src+'"></div>')
			this.$c.append(s);
		}
		//创建一个ul容器包含小圆点 li
		var ul = $('<ul></ul>');
		for(var l =0; l<this.$len; l++){
			if(l == 0){
				var li = $('<li class="active"></li>');
			}else{
				var li = $('<li></li>');
			}
			
			ul.append(li);
		}
		this.$c.append(ul);
		// 获取幻灯片容器等元素
		this.$div = this.$c.find('div');
		this.$image = this.$div.find('img');
		this.$ul = this.$c.find('ul');
		this.$l = this.$ul.find('li');
		this.setCSS()
	},
	//设置css,给ul li 给定高度...
	setCSS: function(){
		var me = this;
		this.$c.css({
			'width':me.$wW,
			'overflow': 'hidden',
			'height':me.height,
			'position': 'relative'
		})
		this.$div.each(function(index, el) {
			$(el).css({
				// 'height':me.$wH,
				'display':'block',
				'transform':'translate3d('+index*me.$wW+'px,0,0)',
				'position':'absolute'
			});
		});
		this.$image.css({
			'width':'100%',
			'display':'block',
			'height':me.height
		})
		this.$ul.css({
			'position': 'absolute',
			'bottom': '0.2rem',
			'left': '50%',
			'-ms-transform': 'translateX(-50%)',
			'transform': 'translateX(-50%)',
			'-webkit-transform': 'translateX(-50%)'
		})
		this.$l.css({
			'margin-right': '10px',
			'width': '15px',
			'height': '15px',
			'border-radius': '7.5px',
			'background-color': '#afaeae',
			'float': 'left'
		})
		this.bind();
	},

	//绑定函数，touchstart触摸屏幕时，touchmove滑动屏幕时，thouchend离开屏幕时
	bind:function(){
		var me = this;
		this.$c.on('touchstart',function(evt){
			me.startHandler(evt);//清除自动播放
			clearInterval(me.play);
		});

		this.$c.on('touchmove',function(evt){	
			me.moveHandler(evt);
		});

		this.$c.on('touchend',function(evt){
			me.endHandler(evt);	
			me.goPlay();//恢复自动播发
				
		});
	},
	//触摸屏幕时执行的函数
	startHandler:function(evt){
		this.startX = evt.touches[0].pageX;//获取手指的坐标
		this.offsetX = 0;//偏移位置
	},
	//滑动屏幕时执行的函数
	moveHandler:function(evt){
		this.pushArry();
		//计算出移动多少距离
		this.offsetX = evt.targetTouches[0].pageX - this.startX;
		//修改样式，有一个移动效果
		for(var k = -1;k<2; k++){
			this.li[k+1].css({
				'transition':'transform 0s ease-out',
				'transform':'translate3d('+(k*this.$wW+this.offsetX)+'px,0,0)'
			});
		}
	},
	//离开屏幕执行的函数
	endHandler:function(){
		//获取屏幕1/6宽度，用来判断
		var boundary = this.$wW/6,
			me = this;
		//向左移动距离大于这个宽度，执行上一页
		if(this.offsetX > boundary){
			this.perv();
		//向右移动距离大于这个宽度，执行下一页
		}else if(this.offsetX < -boundary){
			this.next();
		//如果小于boundary 且小于0	
		}else if(this.offsetX < 0){
				for(var k =0;k<2; k++){
				   	this.li[k+1].css({
				   		'transition':'transform 0.2s ease-out',
				   		'transform':'translate3d('+k*this.$wW+'px,0,0)'
				   	}); 
				}
		}else if(this.offsetX > 0){
				for(var k =-1;k<1; k++){
				   	this.li[k+1].css({
				   		'transition':'transform 0.2s ease-out',
				   		'transform':'translate3d('+k*this.$wW+'px,0,0)'
				   	}); 
				}
			}
		},
	//下一张滑动
	next:function(){
		this.pushArry();
		var m = this.index+1;
		for(var k =-1;k<1; k++){
	    	this.li[k+2].css({
	    		'transition':'transform 0.2s ease-out',
	    		'transform':'translate3d('+k*this.$wW+'px,0,0)'
	    	}); 
	    }
	    var f = this.index+2;
		if(f == this.$len){f = 0};
		if(f > this.$len){f = 1};
		this.$div.eq(f).css({
			'transition':'transform 0s ease-out',
			'transform':'translate3d('+this.$wW+'px,0,0)'
		}); 
	    if(m == this.$len){m = 0};
	    this.index = m;
		this.$l.removeClass('active').eq(m).addClass('active');
		
	},
	//上一张滑动
	perv: function(){
		var i = this.index-1;
	    if(i == -(this.$len+1)){
	    	i = -1;
	    }
	    for(var k =0;k<2; k++){
	    	this.li[k].css({
	    		'transition':'transform 0.2s ease-out',
	    		'transform':'translate3d('+k*this.$wW+'px,0,0)'
	    	}); 
	    }
		this.index = i;
		this.$l.removeClass('active').eq(i).addClass('active');	
	},
	//用一个数组存在三张幻灯片，获取当前张放在数组中间，跟前后两张
	pushArry: function(){
		var i = this.index-1;
		this.li = [];
		for(i; i<this.index+2;i++){
			var c = i;
			if(i == this.$len){c = 0;}; 
			if(-i == this.$len+1){c = -1};
			this.li.push(this.$div.eq(c)); 
		}
	},
	// 自动播放
	goPlay: function(){
		var me = this;
		me.play = setInterval(function(){
				me.next();
				me.hd = true;
		},this.time);
	}
};

//封装到jQuery
(function($){
	$.fn.extend({
		touch: function(obj){
			var container = this[0];
			obj['container'] = container;
			return new Touch(obj);
		}
	})
})(jQuery)