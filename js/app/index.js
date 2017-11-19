define(['mui', 'mall'], function(mui, $) {
	mui.init();
	var userimg;
	mui.plusReady(function() {
		console.log('index plus ready');
		plus.screen.lockOrientation("portrait-primary");

		// 添加样式
//		var div3 = document.querySelectorAll('.nine div');
//		console.log(div3);
//		mui.each(div3, function(index, item) {
//			console.log(index);
//			if(index == 2 || index == 5 || index == 8 || index == 11) {
//				console.log('3n+index : ' + index);
//				div3[index].style.cssText = "float: left;width: 33%;height: 100px;border-bottom: 1px solid #bbbbbb;border-right: 0px;text-align:center;"
//			} else {
//				console.log('!3n :' + index);
//				div3[index].style.cssText = "float: left;width: 33%;height: 100px;border-bottom: 1px solid #bbbbbb;border-right: 1px solid #bbbbbb;text-align:center;"
//			}
//		})

		//	遍历显示的div
//		var newdiv3 = document.querySelectorAll('.showbtn');
//		for(var i = 0; i < newdiv3.length; i++) {
//			if(i == 2 || i == 5 || i == 8 || i == 11) {
//				console.log('3n+index : ' + i);
//				newdiv3[i].style.cssText = "float: left;width: 33%;height: 100px;border-bottom: 1px solid #bbbbbb;border-right: 0px;text-align:center;"
//			} else {
//				console.log('!3n :' + i);
//				newdiv3[i].style.cssText = "float: left;width: 33%;height: 100px;border-bottom: 1px solid #bbbbbb;border-right: 1px solid #bbbbbb;text-align:center;"
//			}
//		}

		//	关闭右滑关闭功能
		var wv = plus.webview.currentWebview();
		wv.setStyle({
			popGesture: 'none'
		});

		//	刷新用户头像
		window.addEventListener('refreshInName', function() {
			avatar = plus.storage.getItem('avatar');
			nickname = plus.storage.getItem('nickname');
			if(avatar !== null) {
				userimg = "http://" + bucketP + ".oss-cn-qingdao.aliyuncs.com/" + userSsoId + '/' + avatar + '.jpg';
			} else {
				userimg = 'images/logo.jpg';
			}
			console.log(userimg);
			document.querySelector('.top-logo').setAttribute('src', userimg);
			document.querySelector('.top-role').innerText = nickname;
		});

		

//		urlBaseP = plus.storage.getItem('urlBaseP');
//		bucketP = plus.storage.getItem('bucketP');
//		nickname = plus.storage.getItem('nickname');
//		realname = plus.storage.getItem('realname');
//		avatar = plus.storage.getItem('avatar');
//		zoneId = plus.storage.getItem('zoneId');
//		zoneName = plus.storage.getItem('zoneName');
//		userSsoId = plus.storage.getItem('userSsoId');
//		console.log(userSsoId);
//		console.log(urlBaseP);
//		console.log(avatar);
//		if(avatar !== null) {
//			userimg = "http://" + bucketP + ".oss-cn-qingdao.aliyuncs.com/" + userSsoId + '/' + avatar + '.jpg';
//		} else {
//			userimg = 'images/logo.jpg';
//		}
//		console.log(userimg);
//		document.querySelector('.top-logo').setAttribute('src', userimg);
//		document.querySelector('.zones-name').innerText = zoneName;
//		document.querySelector('.top-username').innerText = realname;
//		document.querySelector('.top-role').innerText = nickname;

		mui.toast('用户登录成功');
		plus.nativeUI.closeWaiting();
		plus.webview.currentWebview().show();

		//		---------------------------------------------------------
		
		//		----------------------------------------------------------
		//	用户信息
		$.tapHandler({
			selector: '.top-logo',
			url: 'user_edit.html'
		});

		//	物业公告
		$.tapHandler({
			selector: '.nine-goannouncement',
			url: 'property_announcement.html',
			event: 'getPropertyAnno'
		});

		//	社区动态
		$.tapHandler({
			selector: '.nine-gochat',
			url: 'community_dynamics.html',
			event: 'getCoumunityDynamics'
		});

		//	报修
		$.tapHandler({
			selector: '.nine-gooperate',
			url: 'repair.html',
			event: 'getRepair'
		});

		//	建议物业
		$.tapHandler({
			selector: '.nine-advise',
			url: 'advise_property.html',
			event: 'getAdivise'
		});

		//	表扬物业
		$.tapHandler({
			selector: '.nine-praise',
			url: 'praise_property.html',
			event: 'getPraise'
		});

		// 	投诉物业
		$.tapHandler({
			selector: '.nine-gobad',
			url: 'critica_property.html',
			event: 'getCritica'
		});
		
		//	业委会
		$.tapHandler({
			selector: '.nine-gocommittee',
			url: 'committee.html'
		});
		
		//	业主验证
		$.tapHandler({
			selector: '.nine-goauth',
			url: 'userauth.html',
			event: 'showpend'
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

		// 智慧停车
		$.tapHandler({
			selector: '.nine-gocar',
			id: 'warnnum',
			url: 'vehicle_management.html',
			event: 'showWarn'
		});

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