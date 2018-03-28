define(['mui', 'mall', ], function(mui, $) {

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
	//	var category = 1;
	//	var totalLikesArry = [];
	mui.plusReady(function() {
		console.log('#community_dynamics_sub plusReady()');
		webviewInit();
		//		//	跳转到表扬信息详情
		//		$.tapHandler({
		//			selector: '.user-logo',
		//			id: 'praiseId',
		//			event: 'getComment',
		//			url: 'praise_property_detail.html',
		//			callback: function(id) {
		//				console.log(id)
		//			}
		//		});
		// 	点赞和取消赞
		//		mui("body").on('tap', '.praise-hand', function() {
		//			var src = this.getAttribute('src');
		//			var praise = this.getAttribute('praise');
		//			var id = this.getAttribute('classId');
		//			console.log(src);
		//			console.log(praise);
		//			var that = this;
		//			if(praise == 'yes') {
		//				//	取消赞
		//				praiseNo(id, that);
		//
		//			} else {
		//				//	点赞
		//				praiseYes(id, that);
		//
		//			}
		//		});

		//	图片预览
		mui('.comment-all').on('tap', '.imgs', function() {
			var src = this.getAttribute('src');
			src = src.split("?");
			console.log(src[0]);
			goSeeImg(src[0]);

		});

		//	获取社区动态
		window.addEventListener('communityRefresh', function() {
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
		refreshCommunityList(0, size, false);
	}

	//	上拉加载
	function pullupRefresh() {
		console.log("获取社区动态");
		//		mui.toast('获取社区动态啊')
		page++;
		refreshCommunityList(page, size, true);
	}

	//	获取社区动态信息
	function refreshCommunityList(page, size, isUp) {
		console.log('refreshCommunityList(' + page + ',' + size + ',' + isUp + ')');
		plus.nativeUI.showWaiting();
		urlBase = plus.storage.getItem('urlBase');
		bucket = plus.storage.getItem('bucket');
		var url = urlBase + '/campusSale/search/' + page + '/' + size;
		console.log(url);
		$.get(url).then(function(data) {
			console.log('refreshCommunityList ' + JSON.stringify(data));
			if(data.errCode == 0) {
				console.log(data.dataList)
				document.querySelector('.search-result').classList.add('mui-hidden')
				mui.each(data.dataList, function(index, item) {
					console.log(item.image)
					item.createTime = GMTToStr(item.createTime);
					console.log(item.createTime)
					console.log(plus.storage.getItem('role'))
					console.log(plus.storage.getItem('userId'))
					console.log(item.userId)
					if(item.userId == plus.storage.getItem('userId') || parseInt(plus.storage.getItem('role')) == 2) {
						item.delShow = ""
					} else {
						item.delShow = 'delShow'
					}
					if(item.image != null) {
						item.image = item.image.split("|");
						if(item.image.length != 0) {
							item.boxshow = 'content-img';
							for(var i = 0; i < item.image.length; i++) {
								if(item.image[i] != "") {
									item.image[i] = 'http://' + bucket + '.oss-cn-qingdao.aliyuncs.com/' + item.image[i] + '.jpg?x-oss-process=style/thumbnail';
									item.show = 'imgs';
								} else {
									item.show = 'mui-hidden';
								}
							}
							item.avatar = 'http://' + bucket + '.oss-cn-qingdao.aliyuncs.com/' + item.avatar;
						} else {
							item.boxshow = 'mui-hidden';
						}
					}

				});
				var dataJson = {
					dataList: data.dataList
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
			//			{"errCode":0,"errMsg":"获取数据成功","totalRecords":3,"dataList":[{"id":"1eddf6d1d96c4feca906cca659714364","userId":"0c493e4cd99144bfbe6e7f0d73ddc98b","content":"ddd","image":null,"createTime":"2018-03-26T14:28:21.000Z","likes":null},{"id":"469736d1463740ae99e64902f39e34e2","userId":"0c493e4cd99144bfbe6e7f0d73ddc98b","content":"ddd","image":null,"createTime":"2018-03-26T14:28:10.000Z","likes":null},{"id":"9e5ebc55d91b4661913cd8de71f6d440","userId":"0c493e4cd99144bfbe6e7f0d73ddc98b","content":"ddd","image":null,"createTime":"2018-03-26T14:28:21.000Z","likes":null}]}
			//			if(data != null && data.length != 0) {
			//				document.querySelector('.search-result').classList.add('mui-hidden');
			//				mui.each(data, function(index, item) {
			//					//					console.log(item);
			//					var timeStamp = item.publishTime;
			//					item.publishTime = getDateTimeBefor(item.publishTime);
			//
			//					item.images = item.images.split("|");
			//					if(item.like) {
			//						item.handsrc = 'images/good.svg';
			//						item.praise = 'yes';
			//					} else {
			//						item.handsrc = 'images/praise.svg'
			//						item.praise = 'no';
			//					}
			//					console.log(item.images);
			//					console.log(item.images.length);
			//					if(item.images.length != 0){
			//						item.boxshow = 'content-img';
			//						for(var i = 0; i < item.images.length; i++) {
			//							if(item.images[i] != "") {
			//								item.images[i] = 'http://' + bucketP + '.oss-cn-qingdao.aliyuncs.com/' + item.userSsoId + '/' + item.images[i] + '.jpg?x-oss-process=style/thumbnail';
			//								item.show = 'imgs';
			//							}else{
			//								item.show = 'mui-hidden';
			//							}
			//						}
			//						item.avatar = 'http://' + bucketP + '.oss-cn-qingdao.aliyuncs.com/' + item.userSsoId + '/' + item.avatar + '.jpg';
			//					}else{
			//						item.boxshow = 'mui-hidden';
			//					}
			//					
			//					console.log(item.totalLikes);
			//					totalLikesArry.push(item.id);
			//					console.log(item.images);
			//				})
			//				console.log(JSON.stringify(data))
			//				var dataJson = {
			//					dataList: data
			//				};
			//				return $.render('tpl/community_dynamics_sub_data.html', dataJson)
			//			} else {
			//				if(isUp === true) {
			//					mui.toast('没有更多数据了');
			//					showTag('.comment-all li');
			//				} else {
			//					document.querySelector(".comment-all").innerHTML = '';
			//					document.querySelector('.search-result').classList.remove('mui-hidden');
			//				}
			//			}

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

			//	点击评论跳转到评论详情
			//			$.tapHandler({
			//				selector: '.comment-detail',
			//				url: 'community_dynamics_detail.html',
			//				id: 'infoId',
			//				event: 'showComment'
			//			});

			//			点击删除评论
			$.tapHandler({
				selector: '.delInfo',
				id: 'infoId',
				callback: function(id) {
					delSaleInfo(id);
					console.log(id);
				}
			});

			plus.nativeUI.closeWaiting();
		}).fail(function(status) {
			stopDownRefresh('#refreshList', isUp);
			console.log('按照页数刷新商品列表' + status)
			plus.nativeUI.closeWaiting();
			if(status == 204 || status == null) {
				mui.toast('没有更多数据了');
			} else {
				statusHandler(status);
			}
		});
	}

	//	删除动态
	function delSaleInfo(id) {
		console.log('删除动态id(' + id + ')');
		//	弹出删除框
		mui.confirm('确认删除该动态', '', ['是', '否'],
			function(event) {
				if(event.index === 0) {
					submitDelSale(id);
				}
			});
	}

	//	删除动态
	function submitDelSale(id) {
		plus.nativeUI.showWaiting();
		console.log('submitDelSale(' + id + ')');
		urlBase = plus.storage.getItem('urlBase');
		var url = urlBase + '/campusSale/delete/' + id;
		$.del(url).then(function(data) {
			console.log('删除动态: ' + JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			//	判断删除操作
			if(data.errCode == 0) {
				mui.toast('删除成功');
				mui('#refreshList').pullRefresh().pulldownLoading();
			} else {
				mui.toast('删除失败');
			}

		}).fail(function(status) {
			console.log('删除动态' + status)
			statusHandler(status);
		});
	}

	//	点赞
	//	function praiseYes(id, that) {
	//		urlBaseP = plus.storage.getItem('urlBaseP');
	//		var url = urlBaseP + "/user/feed/" + id + "/like";
	//		console.log(url)
	//		$.get(url).then(function(data) {
	//			console.log(JSON.stringify(data))
	//			if(data.errCode == 0) {
	//				mui.toast('点赞成功');
	//				that.setAttribute('src', 'images/good.svg');
	//				that.setAttribute('praise', 'yes');
	//				var commentClass = that.getAttribute('classId');
	//				var info = that.getAttribute('infoId');
	//				info = info.split(':');
	//				info[2] = data.data.totalLikes;
	//				info[3] = 'true';
	//				info= info.join(":");
	//				document.getElementById(data.data.id).innerText = data.data.totalLikes;
	//				document.getElementById(commentClass+'id').setAttribute('infoId',info);
	//				console.log(data.data.id);
	//				
	//			} else {
	//				mui.toast('点赞失败');
	//			}
	//		}).fail(function(status) {
	//			statusHandler(status);
	//		});
	//	}

	//	取消赞
	//	function praiseNo(id, that) {
	//		urlBaseP = plus.storage.getItem('urlBaseP');
	//		var url = urlBaseP + "/user/feed/" + id + "/cancelLike";
	//		console.log(url)
	//		$.get(url).then(function(data) {
	//			if(data.errCode == 0) {
	//				console.log(JSON.stringify(data));
	//				mui.toast('取消赞');
	//				that.setAttribute('src', 'images/praise.svg');
	//				that.setAttribute('praise', 'no');
	//				var commentClass = that.getAttribute('classId');
	//				var info = that.getAttribute('infoId');
	//				info = info.split(':');
	//				info[2] = data.data.totalLikes;
	//				info[3] = 'false';
	//				info= info.join(":");
	//				document.getElementById(data.data.id).innerText = data.data.totalLikes;
	//				document.getElementById(commentClass+'id').setAttribute('infoId',info);
	//				console.log(data.data.id);
	//			} else {
	//				mui.toast('取消失败');
	//			}
	//		}).fail(function(status) {
	//			statusHandler(status);
	//		});
	//	}

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