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
			var password = plus.storage.getItem('password');
			document.getElementById('mobile').value = mobile;
			userLogin1(mobile, password);
		}
		
		
		//	用户登录请求
		function userLogin1(mobile, password) {
			var showRole = {
				0: '学生',
				1: '管理员',
				2: '超级管理员'
			}
			plus.nativeUI.showWaiting('登录中');
				var url = urlBase + '/user/login/' + mobile + '/' + password;
				console.log(url);
				$.get(url).then(function(data) {
					plus.nativeUI.closeWaiting();
					console.log(data);
					console.log(JSON.stringify(data));
					mui.toast(data.errMsg);
					if(data.errCode == 0){
						plus.storage.setItem('mobile',mobile);
						plus.storage.setItem('password',password);
						plus.storage.setItem('userId',data.dataList[0].id);
						plus.storage.setItem('username',data.dataList[0].username);
						plus.storage.setItem('avatar',data.dataList[0].avatar);
						data.dataList[0].role = showRole[data.dataList[0].role];
						plus.storage.setItem('role',data.dataList[0].role);
						mui.openWindow({
							url: 'index.html',
							id: 'index.html'
						});
						
					}
			
				}).fail(function(status) {
					console.log('登录失败')
					statusHandler(status);
				});
		}
		
		
	});


});