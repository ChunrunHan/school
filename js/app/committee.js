define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true, //启用右滑关闭功能
		beforeback: function() {
			pickerBlur();
			var index = plus.webview.getWebviewById('index.html');
			mui.fire(index, 'refreshWarnNum');
			return true;
		}
	});

	mui.plusReady(function() {
		console.log('#committee ready');
		plus.screen.lockOrientation("portrait-primary");
		//	关闭右滑关闭功能
		var wv = plus.webview.currentWebview();
		wv.setStyle({
			popGesture: 'none'
		});

		//	根据权限显示界面
		var showClass = plus.storage.getItem('newshowP');
		console.log(typeof showClass)
		console.log('neshow..........: ' + showClass);
		//	判断账号是否有角色
		if(showClass == '') {
			delDeviceTokenFromAndroid();
			console.log('当前账号没有配置权限');
			plus.nativeUI.closeWaiting();
			mui.toast('当前账号没有配置权限');
			plus.storage.clear();
			plus.runtime.restart();
			return;
		}
		showClass = showClass.split(',');
		console.log(showClass);
		for(var i = 0; i < showClass.length; i++) {
			console.log(showClass[i]);
			var others = document.getElementById(showClass[i]);
			//			alert(others);
			if(others != null) {
				document.getElementById(showClass[i]).classList.remove('mui-hidden');
				document.getElementById(showClass[i]).classList.add('showbtn');
				switch(showClass[i]) {
					case 'ownersCommitteeAnnouncement':
						mui.preload({
							url: 'committee_announcement.html',
							id: 'committee_announcement.html'
						});
						break;
					case 'ownersCommitteeFinance':
						mui.preload({
							url: 'finance_manage.html',
							id: 'finance_manage.html'
						});
						break;
				}
			} else {
				continue;
			}
		}

		// 添加样式
		var div3 = document.querySelectorAll('.nine div');
		console.log(div3);
		mui.each(div3, function(index, item) {
			console.log(index);
			if(index == 2 || index == 5 || index == 8 || index == 11) {
				console.log('3n+index : ' + index);
				div3[index].style.cssText = "float: left;width: 33%;height: 100px;border-bottom: 1px dashed #bbbbbb;border-right: 0px;text-align:center;"
			} else {
				console.log('!3n :' + index);
				div3[index].style.cssText = "float: left;width: 33%;height: 100px;border-bottom: 1px dashed #bbbbbb;border-right: 1px dashed #bbbbbb;text-align:center;"
			}
		})

		//	遍历显示的div
		var newdiv3 = document.querySelectorAll('.showbtn');
		for(var i = 0; i < newdiv3.length; i++) {
			if(i == 2 || i == 5 || i == 8 || i == 11) {
				console.log('3n+index : ' + i);
				newdiv3[i].style.cssText = "float: left;width: 33%;height: 100px;border-bottom: 1px dashed #bbbbbb;border-right: 0px;text-align:center;"
			} else {
				console.log('!3n :' + i);
				newdiv3[i].style.cssText = "float: left;width: 33%;height: 100px;border-bottom: 1px dashed #bbbbbb;border-right: 1px dashed #bbbbbb;text-align:center;"
			}
		}

//		mui.preload({
//			url: '.html',
//			id: '.html'
//		});
//
//		mui.preload({
//			url: '.html',
//			id: '.html'
//		});

		//	公告管理
		$.tapHandler({
			selector: '.nine-committee-anno',
			url: 'committee_announcement.html',
			event: 'getPropertyAnno'
		});

		//	财务管理
		$.tapHandler({
			selector: '.nine-committee-finance',
			url: 'finance_manage.html',
			event: 'showIncome'
		});

//		//	投票
//		$.tapHandler('.nine-committee-vote', '.html');
//
//		// 	提案
//		$.tapHandler('.nine-committee-proposal', '.html');

	});

});