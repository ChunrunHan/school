define(['mui', 'mall'], function(mui, $) {
	mui.init();
	var userimg;
	mui.plusReady(function() {
		console.log('index plus ready');
		plus.screen.lockOrientation("portrait-primary");
		
		mui.preload({
			url: 'common_telephone.html',
			id: 'common_telephone.html'
		});
		
		mui.preload({
			url: 'sale.html',
			id: 'sale.html'
		});
		
		mui.preload({
			url: 'activity.html',
			id: 'activity.html'
		});
		
		mui.preload({
			url: 'study.html',
			id: 'study.html'
		});
		
		mui.preload({
			url: 'work.html',
			id: 'work.html'
		});

		//	关闭右滑关闭功能
		var wv = plus.webview.currentWebview();
		wv.setStyle({
			popGesture: 'none'
		});

		var avatar = plus.storage.getItem('avatar');
		var nickname = plus.storage.getItem('username');
		var rolename = plus.storage.getItem('roleName');
		
		if(avatar !== null) {
			userimg = "http://zaoyuan.oss-cn-qingdao.aliyuncs.com/" + avatar + '!thumbnail';
		} else {
			userimg = 'images/logo.jpg';
		}
		console.log(userimg);
		document.querySelector('.top-logo').setAttribute('src', userimg);
		document.querySelector('.top-username').innerText = nickname;
		document.querySelector('.top-userrole').innerText = rolename;
		//	刷新用户头像
		window.addEventListener('refreshInName', function() {
			var avatar = plus.storage.getItem('avatar');
			var nickname = plus.storage.getItem('username');
			if(avatar !== null) {
				userimg = "http://zaoyuan.oss-cn-qingdao.aliyuncs.com/" + avatar + '!thumbnail';
			} else {
				userimg = 'images/logo.jpg';
			}
			console.log(userimg);
			document.querySelector('.top-logo').setAttribute('src', userimg);
			document.querySelector('.top-username').innerText = nickname;
		});

		mui.toast('用户登录成功');
		plus.nativeUI.closeWaiting();
		plus.webview.currentWebview().show();

		//		---------------------------------------------------------

		//	活动报名
		$.tapHandler({
			selector: '.nine-goactivity',
			url: 'activity.html',
			event: 'getActivity'
		});

		//	校园特卖
		$.tapHandler({
			selector: '.nine-gosale',
			url: 'sale.html',
			event: 'getSale'
		});

		//	学习交流
		$.tapHandler({
			selector: '.nine-gostudy',
			url: 'study.html',
			event: 'getStudy'
		});

		//	勤工俭学
		$.tapHandler({
			selector: '.nine-gowork',
			url: 'work.html',
			event: 'getWork'
		});

		//	常用电话
		$.tapHandler({
			selector: '.nine-gomobile',
			url: 'common_telephone.html',
			event: 'getTelephone'
		});

		//	跳转到联系我们
		$.tapHandler('.nine-goabout', 'about.html');

		//	跳转到设置
		$.tapHandler('.icon-sz', 'setting.html');

		//	返回退出程序
		mui.back = function() {
			var btn = ["确定", "取消"];
			mui.confirm('确认退出当前程序？', '', btn, function(e) {
				if(e.index == 0) {
					plus.runtime.quit();
				}
			});
		}

	})

});