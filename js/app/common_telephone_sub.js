define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '#refreshContainer',
			down: getPulldownOptions(pulldownRefresh),
			up: getPullupOptions(pullupRefresh)
		}
	});

	mui.plusReady(function() {

		console.log('#common_telephone_sub plusReady()');
		webviewInit();
		
		
		//	新增电话
		$.tapHandler({
			selector: '.icon-add',
			url:'common_telephone_add.html'
		});

		//	传递参数需要预加载
		mui.preload({
			url: 'common_telephone_edit.html',
			id: 'common_telephone_edit.html'
		});

		//	主动下拉刷新
		window.addEventListener('telRefresh', function() {
			mui('#refreshContainer').pullRefresh().pulldownLoading();
			var contentWebview = plus.webview.currentWebview();
			contentWebview.evalJS("mui('#refreshContainer').pullRefresh().scrollTo(0,0,100)");
		});

	});

	//	下拉刷新
	function pulldownRefresh() {
		console.log('pulldownRefresh()');
		page = 0;
		getData(page, pageSize, false);
	}

	//	上拉加载
	function pullupRefresh() {
		page++;
		getData(page, pageSize, true);
	}

	//	删除电话
	function delControl(categoryId) {
		console.log('delCategory(' + categoryId + ')');
		//	获得categoryId
		var id = categoryId;
		//	弹出删除框
		mui.confirm('确定删除该号码吗？', '', ['是', '否'],
			function(event) {
				if(event.index === 0) {
					plus.nativeUI.showWaiting('删除中');
					delTel(id);
				}
			});
	}

	//	删除电话请求
	function delTel(id) {
		console.log('delTel(' + id + ')');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/phone/' + id;
		$.del(url).then(function(data) {
			console.log('got from server: ' + JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			//	判断删除的分类是否有商品
			if(data.code === 0) {
				mui.toast('删除成功');
				mui('#refreshContainer').pullRefresh().pulldownLoading();
				var contentWebview = plus.webview.currentWebview();
				contentWebview.evalJS("mui('#refreshContainer').pullRefresh().scrollTo(0,0,100)");
				
			} else {
				//	删除页面元素
				mui.toast('删除失败');	
			}

		}).fail(function(status) {
			console.log('删除电话请求'+ status)
			statusHandler(status);
		});
	}

	//	获取电话信息
	function getData(page, pageSize, isUp) {
		console.log('getData(' + page + ',' + pageSize + ',' + isUp + ')');
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/phone/search/' + zoneId + '//' + page + '/' + pageSize;

		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('所有的电话信息(' + JSON.stringify(data) + ')');

			if(data.errCode === 0) {
				document.querySelector('.search-result').classList.add('mui-hidden');
				return $.render('tpl/common_telephone_sub_data.html', data);
			} else {
				console.log('当前状态：'+isUp);
				document.querySelector(".classify-list").innerHTML = '';
				document.querySelector('.search-result').classList.remove('mui-hidden');
				if(isUp === true) {
					mui.toast('没有更多数据了');
					document.querySelector('.search-result').classList.add('mui-hidden');
				}
			}

		}).then(function(html) {
			if(isUp === true) {
				if(html == undefined) {
					html = '';
				}
				newhtml = oldHtml + html;
				mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);

			} else {
				newhtml = html || '';
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh();

			}
			oldHtml = newhtml;
			if(!newhtml || !oldHtml) {
				newhtml = '';
			}
			
			$.setValue('.classify-list', newhtml);

			//	点击编辑按钮跳转到edit，并发送分类名称和优先级数据
			$.tapHandler({
				selector: '.list-edit',
				url: 'common_telephone_edit.html',
				id: 'category',
				event: 'editClass'
			});
			
			//	拨打电话
			$.tapHandler({
				selector: '.tel-btn',
				id:'tel',
				callback: function(id) {
					plus.device.dial(id);
					pickerBlur();
				}
			});

			//	点击删除按钮操作
			$.tapHandler({
				selector: '.list-delete',
				stopPropagation: true,
				id: 'categoryId',
				callback: function(id) {
					delControl(id);
					return false;
				}
			});

		}).fail(function(status) {
			stopDownRefresh('#refreshContainer', isUp);
			console.log('初始化获得用户分类'+ status)
			statusHandler(status);
		});
	}

});