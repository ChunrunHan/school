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
	var category = 6; //业委会公告
//	var delimgArry = []; //	 删除的图片
	mui.plusReady(function() {
		console.log('#committee_announcement_sub plusReady()');
		webviewInit();

		//	获取业委会公告
		window.addEventListener('propertyRefresh', function() {
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
		refreshAnnoList(category, 0, size, false);
	}

	//	上拉加载
	function pullupRefresh() {
		page++;
		refreshAnnoList(category, page, size, true);
	}

	//	删除公告
	function delControl(annoid,imgs) {
		console.log('delgoods(' + annoid + ')');
		var id = annoid;
		//	弹出删除框
		mui.confirm('你确定删除该公告吗？', '', ['是', '否'],
			function(event) {
				if(event.index === 0) {
					delAnno(id,imgs);
				}
			});
	}

	//	删除物业公告请求
	function delAnno(id,imgs) {
		console.log('delAnno(' + id + ')');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/user/announce/'+ id +'/delete';
		$.del(url).then(function(data) {
			console.log('got from server: ' + JSON.stringify(data));
			//	判断删除操作
			if(data.code == 0) {
				backDelImg(imgs,id);
			} else {
				mui.toast('删除失败');
			}

		}).fail(function(status) {
			console.log('删除物业公告' + status)
			statusHandler(status);
		});
	}

	//	获取物业公告
	function refreshAnnoList(category, page, size, isUp) {
		console.log('refreshAnnoList(' + category + ',' + page + ',' + size + ',' + isUp + ')');
		plus.nativeUI.showWaiting();
		urlBaseP = plus.storage.getItem('urlBaseP');
		bucketP = plus.storage.getItem('bucketP');
		userSsoId = plus.storage.getItem('userSsoId');
		var url = urlBaseP + '/zone/feed/' + category + '/list/' + page + '/' + size;
		console.log("userSsoId: " + userSsoId);
		console.log("bucketP: " + bucketP);
		console.log(url);
		$.get(url).then(function(data) {
			console.log('refreshAnnoList ' + JSON.stringify(data));
			if(data != null && data.length != 0){
				document.querySelector('.search-result').classList.add('mui-hidden');
				mui.each(data,function(index,item){
//					console.log(item);
					var timeStamp = item.publishTime;
					item.publishTime = formatDate(item.publishTime);
					item.time = formatDateTime(timeStamp);
					item.week = formatDay(timeStamp);
					item.week = getMyDay(new Date(item.week));
					item.delimg = item.images;
					item.images = item.images.split("|");
					
					if(item.images.length != 0){
						for(var i=0;i<item.images.length;i++){
							if(item.images[i] != ""){
								item.images[i] =  'http://' + bucketP + '.oss-cn-qingdao.aliyuncs.com/' + userSsoId + '/' + item.images[i] + '.jpg?x-oss-process=style/thumbnail';
								item.show = 'imgs';
							}else{
								item.show = 'mui-hidden';
							}
						}
					}
					
					
					console.log(item.images);
				})
				console.log(JSON.stringify(data));
				var dataJson = {
					dataList: data
				};
				return $.render('tpl/committee_announcement_sub_data.html', dataJson)
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
					delControl(id,imgs);
				}
			});
			
			
			
			plus.nativeUI.closeWaiting();
		}).fail(function(status) {
			stopDownRefresh('#refreshList', isUp);
			console.log('获取公告列表' + status);
			plus.nativeUI.closeWaiting();
			if(status == 204 || status == null){
				showDomTag('.anno-all li','.search-result');
			}else{
				statusHandler(status);
			}
			
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
	
	//	oss删除图片
	function backDelImg(filename,id) {
		plus.nativeUI.showWaiting();
		filename = filename.split('|');
		var delfile = [];
		for(var i = 0; i < filename.length; i++) {
			var delimg = filename[i]+'.jpg';
			bucketP = plus.storage.getItem('bucketP');
			delfile.push({
				bucket: bucketP,
				object: delimg
			});
		}
		console.log('返回要删除的数据文件 ：' + JSON.stringify(delfile));
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/oss/del';
		$.post(url, delfile).then(function(data) {
			plus.nativeUI.closeWaiting();
			if(data.code === 0) {
				mui.toast('删除成功');
				var li = document.getElementById(id);
				document.querySelector('.anno-all').removeChild(li);
				mui('#refreshList').pullRefresh().pulldownLoading();
			}

		}).fail(function(status) {
			console.log('oss返回文件删除' + status)
			statusHandler(status);
		})
	}

});