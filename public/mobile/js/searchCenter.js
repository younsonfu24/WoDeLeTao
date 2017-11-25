$(function() {
	// 渲染搜索记录列表
	loadHistoty();

	// 判断加载页面时是否有记录，根据有无判断是否显示没有记录的提示
	showTips()

	// 给“搜索”按钮注册事件
	$('.search button').on('tap', function() {
		var input = $('.search input').val();
		if (!input.trim()) {
			return false;
		}

		var ls = localStorage;

		// 如果有数据就获取，没有，就获取空数组
		var arr = (ls.getItem('LT_his') && JSON.parse(ls.getItem('LT_his'))) || [];

	 	// 去重处理：将搜索重复的内容删除，添加一个到历史记录前头
	 	for (var i=0;i<arr.length;i++) {
	 		if (arr[i]==input) {
	 			// .splice(要删除的值的索引，要删除几个)
		 		arr.splice(i, 1);
	 		}	
	 	}

	 	// 在历史记录的最前头添加一条记录
	 	arr.unshift(input);

	 	// 在搜索之后清空搜索框中的字符
		$('.search input').val('');

	 	// 将最新的数据传到 localStorage
	 	ls.setItem('LT_his', JSON.stringify(arr));

	 	// 加载 localStorage 的数据
	 	loadHistoty();
	 	showTips()
 	});

 	// 清空历史记录（事件委托）
 	$('body').on('tap','.clearAll',function() {
 		localStorage.setItem('LT_his', JSON.stringify([]));
 		loadHistoty();
 		showTips();
 	});

 	// 删除单条记录（事件委托）		// 重新渲染（注意！自己删除自己，又自己绑定，容易出错）
 	$('body').on('tap', '.delete', function() {
 		// 获取父元素的索引
 		var index = $(this).parent().index();
 		var ls = localStorage;
		var arr = (ls.getItem('LT_his') && JSON.parse(ls.getItem('LT_his'))) || [];

		// 删除数组中的元素
		arr.splice(index, 1);

		// 存值
		ls.setItem('LT_his', JSON.stringify(arr));

		loadHistoty();
 		showTips();
 	});

	// 渲染搜索记录列表的函数
	function loadHistoty() {
		var ls = localStorage;

		// localStorage中获取数据，没有就获取空数组
		var arr = (ls.getItem('LT_his') && JSON.parse(ls.getItem('LT_his'))) || [];

		// 判断有无数据，没有就 不在 ul 中显示任何内容
		if (arr.length < 1) {
			$('.history_list').html('');
			return;
		}

		// 拼字符串~
		var strArr = [];
		for (var index=0; index<arr.length; index++) {
			strArr.push('<li>'+arr[index]+'<span class="fa fa-times delete"></span></li>');
		}

		// 渲染列表数据
		$('.history_list').html(strArr.join(''));
	}
});

	// 当历史记录为空的时候显示提示，当再次搜索的时候又显示出原来元素的函数
	function showTips() {	
		if (!$.trim($('.history_list').html())) {
			$('.history .title').html('没有历史搜索记录。');
		} else {
			$('.history .title').html('	<span>搜索历史</span><a class="clearAll" href="javascript:"><span class="fa fa-trash"></span>清空记录</a>');
		}
	}

	
/*
	shift 删除数组头部的第一个元素
	unshift 往数组的头部添加数据
	pop 删除数组最后的第一个元素
	push 数组的尾部加数据
 */

/*
 JSON.parse() 和 JSON.stringify()
	1、JSON.parse() 用来将一个字符串解析为 json 对象
	2、JSON.stringify() 用来将一个对象解析为字符串
*/