define(['mui', 'mall'], function(mui, $) {
	
	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '#refreshList',
			down: getPulldownOptions(pulldownRefresh),
			up: getPullupOptions(pullupRefresh)
		}
	});

	var page = 0;
	var size = 12;
//	var delimgArry = []; //	 删除的图片
	mui.plusReady(function() {
		console.log('# activity_sub plusReady()');
		webviewInit();

		//	获取信息
		window.addEventListener('activityRefresh', function() {
			mui('#refreshList').pullRefresh().pulldownLoading();
			var contentWebview = plus.webview.currentWebview();
			contentWebview.evalJS("mui('#refreshList').pullRefresh().scrollTo(0,0,100)");
		});

		mui('.anno-all').on('tap', '.imgs', function() {
			var src = this.getAttribute('src');
			src = src.split("?");
			console.log(src[0]);
			goSeeImg(src[0]);

		});

	});

	//	下拉刷新
	function pulldownRefresh() {
		page = 0;
		refreshActivity(0, size, false);
	}

	//	上拉加载
	function pullupRefresh() {
		page++;
		refreshActivity(page, size, true);
	}

	//	删除信息
	function delControl(annoid,imgs) {
		console.log('delgoods(' + annoid + ')');
		var id = annoid;
		//	弹出删除框
		mui.confirm('你确定删除该活动吗？', '', ['是', '否'],
			function(event) {
				if(event.index === 0) {
					delAnno(id,imgs);
				}
			});
	}

	//	删除活动请求
	function delAnno(id,imgs) {
		console.log('delAnno(' + id + ')');
		urlBase = plus.storage.getItem('urlBase');
		var url = urlBase + '/activity/delete/'+ id;
		$.del(url).then(function(data) {
			console.log('got from server: ' + JSON.stringify(data));
			//	判断删除操作
			if(data.errCode == 0) {
				pulldownRefresh()
			} else {
				mui.toast('删除失败');
			}

		}).fail(function(status) {
			statusHandler(status);
		});
	}

	//	获取活动信息
	function refreshActivity(page, size, isUp) {
		console.log('refreshActivity(' + ',' + page + ',' + size + ',' + isUp + ')');
		plus.nativeUI.showWaiting();
		urlBase = plus.storage.getItem('urlBase');
		var url = urlBase + '/activity/search/' + page + '/' + size;
		console.log(url);
		$.get(url).then(function(data) {
			console.log('refreshAnnoList ' + JSON.stringify(data));
			if(data.errCode == 0){
				document.querySelector('.search-result').classList.add('mui-hidden');
				mui.each(data.dataList,function(index,item){
					console.log(item.createTime);
					item.createTime = GMTToStr(item.createTime);
					var timeStamp = currentTimeItem(item.createTime)
					console.log(timeStamp)
//					item.publishTime = formatDate(item.publishTime);
					item.time = formatDateTime(timeStamp);
					item.week = formatDay(timeStamp);
					item.week = getMyDay(new Date(item.week));
					item.image = 'data:image/jpeg;base64,' + item.image;
					console.log(plus.storage.getItem('role'));
					if(parseInt(plus.storage.getItem('role')) == 2) {
						item.delShow = ""
					} else {
						item.delShow = 'delShow'
					}
				})
				console.log(JSON.stringify(data));
//				var dataJson = {
//					dataList: data
//				};
				console.log(JSON.stringify(data));
				return $.render('tpl/activity_sub_data.html', data)
			} else {
				if(isUp === true) {
					mui.toast('没有更多数据了');
					showTag('.anno-all li');
				} else {
					document.querySelector(".anno-all").innerHTML = '';
					document.querySelector('.search-result').classList.remove('mui-hidden');
				}
			}

		}).then(function(html) {
			if(isUp === true) {
				if(html == undefined) {
					html = '';
				}
				newhtml = oldHtml + html;
				mui('#refreshList').pullRefresh().endPullupToRefresh(false);
			} else {
				newhtml = html || '';
				mui('#refreshList').pullRefresh().endPulldownToRefresh();

			}
			oldHtml = newhtml;
			if(!newhtml || !oldHtml) {
				newhtml = '';
			}
			console.log(newhtml);
			$.setValue('.anno-all', newhtml);

			//	删除公告
			$.tapHandler({
				selector: '.del-anno',
				stopPropagation: true,
				id: 'annoId',
				callback: function(id) {
					var value = id.split(':');
					var id = value[0];
					var imgs = value[1];
//					alert(id);
//					alert(imgs);
//					alert(typeof imgs);
					delControl(id,imgs);
				}
			});
			
			
			
			plus.nativeUI.closeWaiting();
		}).fail(function(status) {
			stopDownRefresh('#refreshList', isUp);
			console.log('获取公告列表' + status);
			plus.nativeUI.closeWaiting();
			statusHandler(status);
			
		});
	}
	
	//	图片预览
	function goSeeImg(src) {
		mui.openWindow({
			url: 'show_img.html',
			id: 'show_img.html',
			extras: {
				path: src
			},
			show: {
				autoShow: false
			}
		});
	}

});