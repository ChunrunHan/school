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
	var category = 2;
	var totalLikesArry = [];
	mui.plusReady(function() {
		console.log('#praise_property_sub plusReady()');
		webviewInit();

		// 	点赞和取消赞
		mui("body").on('tap', '.praise-hand', function() {
			var src = this.getAttribute('src');
			var praise = this.getAttribute('praise');
			var id = this.getAttribute('classId');
			console.log(src);
			console.log(praise);
			var that = this;
			if(praise == 'yes') {
				//	取消赞
				praiseNo(id, that);

			} else {
				//	点赞
				praiseYes(id, that);

			}
		});

		//	图片预览
		mui('.comment-all').on('tap', '.imgs', function() {
			var src = this.getAttribute('src');
			src = src.split("?");
			console.log(src[0]);
			goSeeImg(src[0]);

		});

		//	获取社区动态
		window.addEventListener('praiseRefresh', function() {
			mui('#refreshList').pullRefresh().pulldownLoading();
			var contentWebview = plus.webview.currentWebview();
			contentWebview.evalJS("mui('#refreshList').pullRefresh().scrollTo(0,0,100)");
		});

		//	点击图片隐藏查看图片
		mui(".box").on('tap', '.img-show', function() {
			document.querySelector('.show-box').style.display = 'none';
		})
		mui("html").on('tap', '.show-box', function() {
			document.querySelector('.show-box').style.display = 'none';
		})


	});

	//	下拉刷新
	function pulldownRefresh() {
		console.log("获取社区动态");
		//		mui.toast('获取社区动态啊')
		page = 0;
		refreshCommunityList(category, 0, size, false);
	}

	//	上拉加载
	function pullupRefresh() {
		console.log("获取社区动态");
		//		mui.toast('获取社区动态啊')
		page++;
		refreshCommunityList(category, page, size, true);
	}

	//	获取社区动态信息
	function refreshCommunityList(category, page, size, isUp) {
		console.log('refreshCommunityList(' + category + ',' + page + ',' + size + ',' + isUp + ')');
		plus.nativeUI.showWaiting();
		urlBaseP = plus.storage.getItem('urlBaseP');
		bucketP = plus.storage.getItem('bucketP');
		var url = urlBaseP + '/zone/feed/' + category + '/list/' + page + '/' + size;
		console.log(url);
		$.get(url).then(function(data) {
			console.log('refreshCommunityList ' + JSON.stringify(data));
			if( data != null && data.length != 0) {
				document.querySelector('.search-result').classList.add('mui-hidden');
				mui.each(data, function(index, item) {
					//					console.log(item);
					var timeStamp = item.publishTime;
					item.publishTime = getDateTimeBefor(item.publishTime);
					//					item.time = formatDateTime(timeStamp);
					//					item.week = formatDay(timeStamp);
					//					item.week = getMyDay(new Date(item.week));

					item.images = item.images.split("|");
//					console.log(item.userSsoId);
//					console.log(item.avatar);
//					console.log(item.like);
					if(item.like) {
						item.handsrc = 'images/good.svg';
						item.praise = 'yes';
					} else {
						item.handsrc = 'images/praise.svg'
						item.praise = 'no';
					}
					if(item.images.length != 0){
						for(var i = 0; i < item.images.length; i++) {
							if(item.images[i] != "") {
								item.images[i] = 'http://' + bucketP + '.oss-cn-qingdao.aliyuncs.com/' + item.userSsoId + '/' + item.images[i] + '.jpg?x-oss-process=style/thumbnail';
								item.show = 'imgs';
							} else {
								item.show = 'mui-hidden';
							}
						}
						item.avatar = 'http://' + bucketP + '.oss-cn-qingdao.aliyuncs.com/' + item.userSsoId + '/' + item.avatar + '.jpg';	
					}
					
					console.log(item.totalLikes);
					totalLikesArry.push(item.id);
					console.log(item.images);
				})
				console.log(JSON.stringify(data))
				var dataJson = {
					dataList: data
				};
				return $.render('tpl/community_dynamics_sub_data.html', dataJson)
			} else {
				if(isUp === true) {
					mui.toast('没有更多数据了');
					showTag('.comment-all li');
				} else {
					document.querySelector(".comment-all").innerHTML = '';
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

			$.setValue('.comment-all', newhtml);
			
//			var imgs = document.querySelectorAll('.comment-all .imgs');
////			alert(imgs.length)
//			for(var i=0;i<imgs.length;i++){
//				imgs[i].height = imgs[i].width;
//			}

			//	点击评论跳转到评论详情
			$.tapHandler({
				selector: '.comment-detail',
				url: 'praise_property_detail.html',
				id: 'infoId',
				event: 'getPraise'
			});

			plus.nativeUI.closeWaiting();
		}).fail(function(status) {
			stopDownRefresh('#refreshList', isUp);
			plus.nativeUI.closeWaiting();
			console.log('按照页数刷新商品列表' + status)
//			statusHandler(status);
			if(status == 204 || status == null){
				mui.toast('没有更多数据了');
			}else{
				statusHandler(status);
			}
		});
	}

	//	点赞
	function praiseYes(id, that) {
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + "/user/feed/" + id + "/like";
		console.log(url)
		$.get(url).then(function(data) {
			console.log(JSON.stringify(data))
			if(data.errCode == 0) {
				mui.toast('点赞成功');
				that.setAttribute('src', 'images/good.svg');
				that.setAttribute('praise', 'yes');
				var commentClass = that.getAttribute('classId');
				var info = that.getAttribute('infoId');
				info = info.split(':');
				info[2] = data.data.totalLikes;
				info[3] = 'true';
				info= info.join(":");
				document.getElementById(data.data.id).innerText = data.data.totalLikes;
				document.getElementById(commentClass+'id').setAttribute('infoId',info);
				console.log(data.data.id);
				
			} else {
				mui.toast('点赞失败');
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}

	//	取消赞
	function praiseNo(id, that) {
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + "/user/feed/" + id + "/cancelLike";
		console.log(url)
		$.get(url).then(function(data) {
			if(data.errCode == 0) {
				console.log(JSON.stringify(data));
				mui.toast('取消赞');
				that.setAttribute('src', 'images/praise.svg');
				that.setAttribute('praise', 'no');
				var commentClass = that.getAttribute('classId');
				var info = that.getAttribute('infoId');
				info = info.split(':');
				info[2] = data.data.totalLikes;
				info[3] = 'false';
				info= info.join(":");
				document.getElementById(data.data.id).innerText = data.data.totalLikes;
				document.getElementById(commentClass+'id').setAttribute('infoId',info);
				console.log(data.data.id);
			} else {
				mui.toast('取消失败');
			}
		}).fail(function(status) {
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