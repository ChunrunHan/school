define(['mui', 'md5', 'mall', 'updata'], function(mui, md5, $, updata) {
	mui.init();
	
	mui.plusReady(function() {
		console.log('login plus ready');
		plus.screen.lockOrientation("portrait-primary");
		plus.navigator.setStatusBarBackground("#c01e2f");

		
		//	跳转到忘记密码页面
		$.tapHandler('#forget-password', 'forget_password.html');
		
		//	用户注册
		$.tapHandler('#user-regist', 'user_regist.html');
		
		//	点击登录
		$.tapHandler({
			selector: '#login-btn',
			callback: function() {
				pickerBlur();
				var mobileP = document.querySelector('#mobile').value;
				var password = document.querySelector('#password').value;
				localStorage.lastmobileP = mobileP;
				console.log('用户手机号' + mobileP);
				console.log('用户密码' + password);
				console.log(md5(password));

				if(mobileP == '' || password == '') {
					mui.toast('手机号和密码不能为空');
					return false;
				} else {
					if(checkMobile(mobileP)) {
						console.log('手机号：' + mobileP);
						userLogin1(mobileP, md5(password));
					}
				}

			}
		});
		
		// 自动登录
		if(plus.storage.getItem('autologin') === "true") {
			var mobile = plus.storage.getItem('mobile');
			document.getElementById('mobile').value = mobile;
			plus.nativeUI.showWaiting('登录中');
			console.log("auto login");
			urlBase = plus.storage.getItem('urlBaseP');
			zoneId = plus.storage.getItem('zoneId');
//			updata.setUrl(urlBaseP);
//			updata.updata(true, 1);
//			console.log(urlBaseP);
			var url = urlBase + '/zone/feed/1/list/0/99';
			$.get(url).then(function(data) {
				console.log('返回的数据：' + JSON.stringify(data));

				console.log('预加载首页啊');

				mui.preload({
					url: 'index.html',
					id: 'index.html'
				});


			}).fail(function(status) {
				console.log('自动登录啊啊啊啊' + status);
				
			}
		}
		
		
		//	用户登录请求
		function userLogin1(mobile, password) {
			plus.nativeUI.showWaiting('登录中');
		//		urlBase = plus.storage.getItem('urlBase');
		//		updata.setUrl(urlBaseP);
		//		updata.updata(true, 1);
				var url = urlBase + '/user/login/' + mobile + '/' + password;
				console.log(url);
				$.get(url).then(function(data) {
					plus.nativeUI.closeWaiting();
					console.log(data);
					console.log(JSON.stringify(data));
					mui.toast(data.errMsg);
			
				}).fail(function(status) {
					console.log('登录失败')
					statusHandler(status);
				});
		}

	});


});