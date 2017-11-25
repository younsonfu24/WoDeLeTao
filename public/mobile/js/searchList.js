$(function() {

	/*给“筛选框”的按钮注册事件*/

	$('.filter a').on('tap', function() {

		// 改变箭头方向
		if ($(this).hasClass('active')) {
			$(this).children().toggleClass('fa-angle-down fa-angle-up');
		} else {
			$(this).siblings().children().removeClass('fa-angle-up').addClass('fa-angle-down');
		}
		$(this).addClass('active').siblings().removeClass('active');

		// 判断箭头是往上，还是往下
		var sort = -1;
		if ($(this).find('.fa').hasClass('fa-angle-up')) {
			// 升序
			sort = 1;
		} else {
			// 降序
			sort = 2;
		}

		// 获取要排序的关键字
		if ($(this).data('sortname') == 'price') {
			querObj.price = sort;
			queryObj.num = "";
		}
		if ($(this).data('sortname') == 'num') {
			queryObj.num = sort;
			queryObj.price = "";
		}

		// 手动触发下拉
		mui("#refreshContainer").pullRefresh().pulldownLoading();
	});

	/*配置全局查询参数对象*/

	var queryObj = {
		proName:"",
		brandId: "",
		price: "",
		num: "",
		page: 1,
		pageSize: 6
	};

	queryObj.proName = getURLParams('key');

	/*总页数*/

	var Count = 1;

	/*下拉刷新、上拉加载方法参数配置*/

	mui.init({
		pullRefresh: {
			container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
			down: {
				height: 50,//可选,默认50.触发下拉刷新拖动距离,
				auto: true,//可选,默认false.首次加载自动下拉刷新一次
				contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
				contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
				contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
				callback: function() {
					setTimeout(function() {
						queryObj.page = 1;
						queryProduct(function(result) {
							Count = result.count;
							var html = template("productsTpl", result);
							$('.productsList').html(html);
							// 结束下拉刷新
							mui("#refreshContainer").pullRefresh().endPulldownToRefresh(false);
							// 重置上拉控件的用户提示
							mui('#refreshContainer').pullRefresh().refresh(true);
						});
					}, 1000);
				}
			},
			up: {
				height: 50,
				auto: true,
				contentrefresh: "正在加载...",
				contentnomore: "没有更多数据了",
				callback: function() {
					var totalPage = Math.ceil(Count/queryObj.pageSize);
					setTimeout(function() {
						if (queryObj.page < totalPage) {
							// 继续请求数据
							queryObj.page++;
							queryProduct(function(result) {
								var html = template('productsTpl', result);
								$('.productsList').append(html);
								// 有数据，传入；false，姐没什么显示
								mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
							});
						} else {
							// 没有数据就传入 true，给用户提示：没有数据了
							mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
						}
					}, 1000);
				}
			}
		}
	});

	 /*获取 URL 上的参数*/

	function getURLParams(name) {
	 	var reg = new RegExp('(^|&)'+name+'=([^&*])(&|$)','i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
		return unescape(r[2]);
		}
		return null;
	}

	/*发送请求*/

	function queryProduct(callback) {
		$.ajax({
			url: "/product/queryProduct",
			data: queryObj,
			success: function(result) {
				callback && callback(result);
			}
		});
	}

	/*点击搜索*/

	$('.search button').on('tap', function() {
		var input = $('.search input').val();
		if (!$.trim(input)) {
			mui.toast('请输入关键字');
		} else {
			queryObj.proName = input;

			// 手动触发下拉
			mui().pullRefresh().pulldownLoading();
		}
	});
});