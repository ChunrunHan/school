define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '#refreshList',
			up: getPullupOptions(pullupRefresh)
		},
		beforeback: function() {
			pickerBlur();
			//返回true，继续页面关闭逻辑
			document.querySelector(".praise-list").innerHTML = '';
			document.querySelector(".comment-list").innerHTML = '';
			var criticaSubView = plus.webview.getWebviewById('critica_property_sub.html');
			mui.fire(criticaSubView, 'criticaRefresh');
			return true;
		}
	});

	var totalComments; //	评论总数
	var totalLikes; //	点赞总数
	var like; //	当前用户是否点赞
	var status = 0; // 0为评论  1为赞 
	var Cpage = 0; // 评论
	var Ppage = 0; //	点赞
	var size = 12;
	var feedId; //	新鲜事id
	var newhtml1 = '';
	var oldHtml1 = '';
	var oldHtml = '';
	var newhtml = '';
	var replyId = 0;//	对新鲜事的评论 replyId=0 对评论的回复 replyId=评论的用户id
	var old_back = mui.back;
		mui.plusReady(function() {
			console.log('critica_property_detail plusReady()');
			plus.screen.lockOrientation("portrait-primary");
			userId = plus.storage.getItem('userId');
			
			//	图片预览
			mui('body').on('tap', '.imgs', function() {
				var src = this.getAttribute('src');
				src = src.split("?");
				console.log(src[0]);
				goSeeImg(src[0]);
	
			});
			
			// 	点赞和取消赞
			mui("body").on('tap', '.praise-hand', function() {
				document.querySelector(".praise-list").innerHTML = '';
				var src = this.getAttribute('src');
				var praise = this.getAttribute('praise');
				var id = this.getAttribute('infoId');
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

			//	发表评论
			$.tapHandler({
				selector: '#send-message',
				callback: function() {
					submitComment(replyId)
				}
			});
			
			//	点击每条评论获取当前评论用户id(回复用户)
			mui('.comment-list ').on('tap', 'li', function() {
				var id = this.getAttribute('userId');
				id = id.split(":");
				replyId = id[0];
				var name = id[1];
				var cId = id[2];
				if(parseInt(replyId) == parseInt(userId)) {
					replyId = 0;
					delComment(cId);
					document.getElementById('input-message').blur();
				} else {
					document.getElementById('input-message').focus();
					document.getElementById('input-message').setAttribute('placeholder', '回复' + id[1]);
				}
			});
			
//			//	删除新鲜事
//			$.tapHandler({
//				selector: '.del-list',
//				callback: function() {
//					delFeedId(feedId);
//				}
//			});
			

			//	获取评论和单条信息
			$.receiveHandler(function(infoId) {
//				alert('新鲜事id: ' + infoId);
				infoId = infoId.split(":");
				feedId = infoId[0];
				totalComments = infoId[1];
				totalLikes = infoId[2];
				like = infoId[3];
				document.getElementById('totalComments').innerText = totalComments;
				document.getElementById('totalLikes').innerText = totalLikes;
				getInfo(feedId);
				comment();
			}, 'getCritica');

			//	获得按钮
			span = document.querySelectorAll(".income-tap div span");

			//	点击评论
			span[0].addEventListener("tap", comment);

			//	点击赞
			span[1].addEventListener("tap", praise);

		});
	//	事件函数
	function comment() {
		document.querySelector('#praise .search-result').classList.add('mui-hidden');
		span[0].classList.add('select');
		span[1].classList.remove('select');
		document.querySelector('.comment-box').style.display = 'block';
		document.querySelector('.comment-list').style.display = 'block';
		document.querySelector('.praise-list').style.display = 'none';
		newhtml1 = '';
		oldHtml1 = '';
		oldHtml = '';
		newhtml = '';
		status = 0;
		Cpage = 0;
		document.querySelector(".praise-list").innerHTML = '';
		getComment(feedId, Cpage, size, true);
	}

	function praise() {
		document.querySelector('#comment .search-result').classList.add('mui-hidden');
		span[0].classList.remove('select');
		span[1].classList.add('select');
		document.querySelector('.comment-box').style.display = 'none';
		document.querySelector('.praise-list').style.display = 'block';
		document.querySelector('.comment-list').style.display = 'none';
		newhtml1 = '';
		oldHtml1 = '';
		oldHtml = '';
		newhtml = '';
		status = 1;
		Ppage = 0;
		document.querySelector(".comment-list").innerHTML = '';
		getPraise(feedId, Ppage, size, true);
	}

	//	上拉加载
	function pullupRefresh() {
		if(status == 0) {
			//			mui.toast('获取评论啊');
			Cpage++;
			getComment(feedId, Cpage, size, true);

		} else if(status == 1) {
			//			mui.toast('获取点赞啊');
			Ppage++;
			getPraise(feedId, Ppage, size, true);
		}
	}

	//	获取单条新鲜事信息
	function getInfo(infoId) {
		plus.nativeUI.showWaiting();
		bucketP = plus.storage.getItem('bucketP');
		var url = plus.storage.getItem('urlBaseP');
		url = url + "/sns/feed/" + infoId;
		console.log(url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('单条信息数据： ' + JSON.stringify(data));
			//	控制删除按钮显示隐藏
//			if(data.userId == parseInt(userId)){
//				document.querySelector('.del-list').style.display = 'inline-block';
//			}else{
//				document.querySelector('.del-list').style.display = 'none';
//			}
			data.publishTime = getDateTimeBefor(data.publishTime);
			data.avatar = 'http://' + bucketP + '.oss-cn-qingdao.aliyuncs.com/' + data.userSsoId + '/' + data.avatar + '.jpg';
			data.like = like;
			if(like == 'true') {
				data.handsrc = 'images/good.svg';
				data.praise = 'yes';
			} else {
				data.handsrc = 'images/praise.svg'
				data.praise = 'no';
			}
			data.images = data.images.split("|");
			data.totalLikes = totalLikes;
			for(var i = 0; i < data.images.length; i++) {
				if(data.images[i] != "") {
					data.images[i] = 'http://' + bucketP + '.oss-cn-qingdao.aliyuncs.com/' + data.userSsoId + '/' + data.images[i] + '.jpg?x-oss-process=style/thumbnail';
					data.show = 'imgs';
				} else {
					data.show = 'mui-hidden';
				}
			}

			$.render('tpl/community_dynamics_detail.html', data).then(function(html) {
				$.setValue('.comment-top', html);
			});

		}).fail(function(status) {
			console.log('got fail status:' + status);
			console.log('getInfo' + status);
			statusHandler(status);
		});
	}

	// 获取新鲜事的评论
	function getComment(infoId, page, size, isUp) {
		plus.nativeUI.showWaiting();
		bucketP = plus.storage.getItem('bucketP');
		var url = plus.storage.getItem('urlBaseP');
		url = url + "/sns/feed/" + infoId + '/comment/list/' + page + '/' + size;
		console.log(url);
		$.get(url).then(function(data) {
			console.log('getcomment ' + JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data != null && data.length != 0) {
				document.querySelector('#comment .search-result').classList.add('mui-hidden');
				mui.each(data, function(index, item) {
					//					console.log(item);
					item.publishTime = getDateTimeBefor(item.publishTime);
					item.avatar = 'http://' + bucketP + '.oss-cn-qingdao.aliyuncs.com/' + item.userSsoId + '/' + item.avatar + '.jpg';
					console.log(item.replynickName);
					if(item.replyId == 0) {
						item.huifu = '';
						item.maohao = '';
						item.replynickName = "";
					} else {
						item.huifu = '回复';
						item.maohao = '：';
					}
				})
				console.log(JSON.stringify(data))
				var dataJson = {
					dataList: data
				};
				return $.render('tpl/community_dynamics_comment_data.html', dataJson)
			} else {
				if(isUp === true) {
					mui.toast('没有更多数据了');
					showDomTag('.comment-list li','#comment .search-result');
				} else {
					document.querySelector(".comment-list").innerHTML = '';
					document.querySelector('#comment .search-result').classList.remove('mui-hidden');
				}
			}

		}).then(function(html) {
			if(isUp === true) {
				if(html == undefined) {
					html = '';
				}
				newhtml1 = oldHtml1 + html;
				mui('#refreshList').pullRefresh().endPullupToRefresh(false);
			} else {
				newhtml1 = html || '';
				mui('#refreshList').pullRefresh().endPulldownToRefresh();

			}
			oldHtml1 = newhtml1;
			if(!newhtml1 || !oldHtml1) {
				newhtml1 = '';
			}

			$.setValue('.comment-list', newhtml1);

//			//	点击每条评论获取当前评论用户id(回复用户)
//			$.tapHandler({
//				selector: '.comment-list li',
//				id: 'userId',
//				callback: function(id){
////					alert(id);
////					userId="{{userId}}:{{nickName}}:{{id}}">
//					id = id.split(":");
//					replyId = id[0];
//					var name = id[1];
//					var cId =  id[2];
////					alert(userId)
////					alert(replyId)
//					if(parseInt(replyId) == parseInt(userId)){
//						replyId = 0;
//						delComment(cId);
//					}else{
//						document.getElementById('input-message').setAttribute('placeholder','回复'+id[1]);
//						document.getElementById('input-message').focus();
//					}
//					
//				}
//			});

			plus.nativeUI.closeWaiting();
		}).fail(function(status) {
			stopDownRefresh('#refreshList', isUp);
			console.log('获取评论列表' + status)
			plus.nativeUi.closeWaiting();
			if(status == 204 || status == null){
				showDomTag('.comment-list li','#comment .search-result');
			}else {
				statusHandler(status);		
			}
		
			
		});
	}

	// 获取新鲜事的点赞
	function getPraise(infoId, page, size, isUp) {
		bucketP = plus.storage.getItem('bucketP');
		var url = plus.storage.getItem('urlBaseP');
		url = url + "/sns/feed/" + infoId + '/like/list/' + page + '/' + size;
		console.log(url);
		$.get(url).then(function(data) {
			console.log('getPraise ' + JSON.stringify(data));
			if(data != null && data.length != 0) {
				document.querySelector('#praise .search-result').classList.add('mui-hidden');
				mui.each(data, function(index, item) {
					//					console.log(item);
					item.likeTime = getDateTimeBefor(parseInt(item.likeTime));
					console.log(item.likeTime);
					item.avatar = 'http://' + bucketP + '.oss-cn-qingdao.aliyuncs.com/' + item.userSsoId + '/' + item.avatar + '.jpg';
					console.log(item.avatar);
				})
				console.log(JSON.stringify(data))
				var dataJson = {
					dataList: data
				};
				return $.render('tpl/community_dynamics_praise_data.html', dataJson)
			} else {
				console.log('无数据')
				console.log('当前状态：' + isUp);
				if(isUp === true) {
					mui.toast('没有更多数据了');
					showDomTag('.praise-list li','#praise .search-result');

				} else {
					document.querySelector(".praise-list").innerHTML = '';
					document.querySelector('#praise .search-result').classList.remove('mui-hidden');
				}
			}

		}).then(function(html) {
			if(isUp === true) {
				if(html == undefined) {
					html = '';
				}
				newhtml = oldHtml + html;
				mui('#refreshList').pullRefresh().endPullupToRefresh(false);
			}
			oldHtml = newhtml;
			if(!newhtml || !oldHtml) {
				newhtml = '';
			}

			$.setValue('.praise-list', newhtml);

			plus.nativeUI.closeWaiting();
		}).fail(function(status) {
			stopDownRefresh('#refreshList', isUp);
			console.log('获取点赞列表' + status);
			plus.nativeUI.closeWaiting();
			if(status == 204 || status == null){
				showDomTag('.praise-list li','#praise .search-result');
			}else {
				statusHandler(status);	
			}
			
		});
	}

	//	点赞
	function praiseYes(id, that) {
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + "/user/feed/" + id + "/like";
		$.get(url).then(function(data) {
			console.log(JSON.stringify(data))
			if(data.errCode == 0) {
				mui.toast('点赞成功');
				that.setAttribute('src', 'images/good.svg');
				that.setAttribute('praise', 'yes');
				console.log(data.data.id);
				var oldvalue = document.getElementById(data.data.id).innerText;
				document.getElementById(data.data.id).innerText = data.data.totalLikes;
				document.getElementById('totalLikes').innerText = data.data.totalLikes;
				praise();
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
		$.get(url).then(function(data) {
			if(data.errCode == 0) {
				console.log(JSON.stringify(data));
				mui.toast('取消赞');
				that.setAttribute('src', 'images/praise.svg');
				that.setAttribute('praise', 'no');
				console.log(data.data.id);
				console.log(data.data.totalLikes);
				var oldvalue = document.getElementById(data.data.id).innerText;
				document.getElementById(data.data.id).innerText = data.data.totalLikes;
				document.getElementById('totalLikes').innerText = data.data.totalLikes;
				praise();
			} else {
				mui.toast('取消失败');
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}

	//	用户发表对某条新鲜事的评论
	function submitComment(replyId) {
		plus.nativeUI.showWaiting();
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + "/user/feed/comment";
		var text = document.getElementById('input-message').value;
		if(text == "") {
			mui.toast('评论内容不能为空');
			return;
		}
		feedId = parseInt(feedId);
		replyId = parseInt(replyId);
		var json = {
			text: text,
			feedId: feedId,
			replyId: replyId
		};
		console.log(JSON.stringify(json))
		$.post(url, json).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('发表评论返回数据 :' + JSON.stringify(data));
			if(data.errCode === 0) {
				mui.toast('评论成功');
				document.getElementById('input-message').value = "";
				document.getElementById('totalComments').innerText = data.data.totalComments;
				comment();
			} else {
				mui.toast('评论失败');
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}
	
	//	删除自己的评论
	function delComment(commentId) {
		console.log('评论的id(' + commentId + ')');
		//	弹出删除框
		mui.confirm('删除该评论', '', ['是', '否'],
			function(event) {
				if(event.index === 0) {
					submitDelComment(commentId);
				}
			});
	}

	//	删除自己的评论
	function submitDelComment(commentId) {
		plus.nativeUI.showWaiting();
		console.log('submitDelComment(' + commentId + ')');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/user/feed/comment/'+ commentId +'/delete';
		$.del(url).then(function(data) {
			console.log('got from server: ' + JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			//	判断删除操作
			if(data.errCode == 0) {
				mui.toast('删除成功');
				document.querySelector(".comment-list").innerHTML = '';
				comment();
				document.getElementById('totalComments').innerText = data.data.totalComments;
				
			} else {
				mui.toast('删除失败');
			}

		}).fail(function(status) {
			console.log('删除物业公告' + status)
			statusHandler(status);
		});
	}
	
//	//	删除新鲜事
//	function delFeedId(feedId){
//		console.log('新鲜事的id(' + feedId + ')');
//		//	弹出删除框
//		mui.confirm('删除该评论', '', ['是', '否'],
//			function(event) {
//				if(event.index === 0) {
//					submitDelFeed(feedId);
//				}
//			});
//	}
//	
//	//	删除自己的新鲜事
//	function submitDelFeed(feedId) {
//		plus.nativeUI.showWaiting();
//		console.log('submitDelFeed(' + feedId + ')');
//		urlBaseP = plus.storage.getItem('urlBaseP');
//		var url = urlBaseP + '/user/feed/'+ feedId +'/delete';
//		$.del(url).then(function(data) {
//			console.log('got from server: ' + JSON.stringify(data));
//			plus.nativeUI.closeWaiting();
//			//	判断删除操作
//			if(data.code == 0) {
//				mui.toast('删除成功');
//				mui.back();
//				
//			} else {
//				mui.toast('删除失败');
//			}
//
//		}).fail(function(status) {
//			console.log('删除物业公告' + status)
//			statusHandler(status);
//		});
//	}
	
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

	// 返回清空数据
	mui.back = function(){
		document.querySelector('.user-logo').setAttribute('src','images/default_header.png');
		document.querySelector('.praise-comment').innerText = '';
		var html = '';
			html += '<img class="imgs" src="images/default_goods.png" alt="" width="30%" height="auto">';
			html += '';
		document.querySelector('.content-img').innerHTML = html;
		document.querySelector('.praise-num').innerText = '0';
		document.querySelector('.praise-list').innerHTML = '';
		document.querySelector('.comment-list').innerHTML = '';
		old_back();
	}

});