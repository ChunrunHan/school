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
			url: 'community_dynamics.html',
			id: 'community_dynamics.html'
		});
//		
//		mui.preload({
//			url: 'property_announcement',
//			id: 'property_announcement'
//		});
//		
//		mui.preload({
//			url: 'property_announcement',
//			id: 'property_announcement'
//		});
//		
//		mui.preload({
//			url: 'property_announcement',
//			id: 'property_announcement'
//		});

		//	关闭右滑关闭功能
		var wv = plus.webview.currentWebview();
		wv.setStyle({
			popGesture: 'none'
		});

		var avatar = plus.storage.getItem('avatar');
		var nickname = plus.storage.getItem('username');
		var rolename = plus.storage.getItem('role');
		
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

		//	用户信息
//		$.tapHandler({
//			selector: '.top-logo',
//			url: 'user_edit.html'
//		});

		//	活动报名
		$.tapHandler({
			selector: '.nine-goactivity',
			url: 'property_announcement.html',
			event: 'getPropertyAnno'
		});

		//	校园特卖
		$.tapHandler({
			selector: '.nine-gosale',
			url: 'community_dynamics.html',
			event: 'getCoumunityDynamics'
		});

		//	学习交流
		$.tapHandler({
			selector: '.nine-gostudy',
			url: 'repair.html',
			event: 'getRepair'
		});

		//	勤工俭学
		$.tapHandler({
			selector: '.nine-gowork',
			url: 'advise_property.html',
			event: 'getAdivise'
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