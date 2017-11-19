define(['mui', 'md5', 'mall'], function(mui, md5, $) {
	mui.init({
		swipeBack: true, //启用右滑关闭功能
		beforeback: function(){
			pickerBlur();
			//返回true，继续页面关闭逻辑
			return true;
		}
	});


	var intervalid;
	mui.plusReady(function() {
		console.log('forget_password plus ready');
		plus.screen.lockOrientation("portrait-primary");
		
		document.getElementById('smscode').addEventListener('blur', function() {
			//	验证码不能为汉字
			if(isNaN(this.value)) {
				mui.toast('验证码非法字符');
				this.value = '';
			}
		});

		var oldmobile = plus.storage.getItem('mobileP');
		document.getElementById('mobile').value = oldmobile;
		//	手机获取验证码请求
		$.tapHandler({
			selector: '.get-smscode',
			callback: function() {
				var mobile = document.getElementById('mobile').value;
				if(mobile == '') {
					mui.toast('手机号不能为空');
					return false;
				} else {
					if(checkMobile(mobile)) {
						console.log('手机号：' + mobile);
						openRunTime();
						getSmscode(mobile);
					}
				}
			}
		});

		//	修改密码请求
		$.tapHandler({
			selector: '#edit-btn',
			callback: function() {
				var newpassword = document.querySelector('#newpassword').value;
				var smscode = document.querySelector('#smscode').value;
				var mobile = document.getElementById('mobile').value;
				if(mobile == ''){
					mui.toast('手机号不能为空');
					return;
				}else if(smscode == '' || newpassword == '') {
					mui.toast('验证码和新密码不能为空');
					return;
				} else {
					//	获得密码MD5加密
					console.log('新密码：' + newpassword);
					md5(newpassword);
					console.log('md5加密后的数据 ：' + md5(newpassword));

					var json = $.serialize();
					json.newPassword = md5(newpassword);
					console.log(json);
					if(json !== null) {
						modifyPassword(json);
					}
				}

			}
		});

	});

	//	获取手机验证码
	function getSmscode(mobile) {
		console.log('获取手机验证码');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/user/sms/' + mobile + '/pwd';
		console.log(url);
		$.get(url).then(function(data) {
			console.log('验证码返回数据：' + JSON.stringify(data));

			if(data.code === 0) {
				mui.toast('请注意查收验证码');
			} else if(data.code === 181) {
				mui.toast('手机号码已被注册');
				closeRunTime();
			} else if(data.code === 182) {
				mui.toast('用户不存在');
				closeRunTime();
			} else if(data.code === 231) {
				mui.toast('验证码次数超过限制');
				closeRunTime();
			} else if(data.code === 232) {
				mui.toast('验证码依然有效');
				closeRunTime();
			}

		}).fail(function(status) {
			closeRunTime();
			console.log('获取手机验证码'+status)
			statusHandler(status);
		});
	}

	//	修改密码请求
	function modifyPassword(json) {
		plus.nativeUI.showWaiting('修改中');
		console.log('modifyPassword：' + JSON.stringify(json));
		//		plus.storage.setItem('token', demoToken);
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/user/reset/password';
		$.post(url, json).then(function(data) {
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.code === 182) {
				mui.toast('用户不存在');
			} else if(data.code === 90) {
				mui.toast('错误的密码格式');
			} else if(data.code === 85) {
				mui.toast('用户不存在');
			} else if(data.code === 234) {
				mui.toast('无效的验证码');
			} else if(data.code === 233) {
				mui.toast('验证码过期');
			} else {
				mui.toast('修改成功');
				setTimeout(function() {
					delDeviceTokenFromAndroid();
					plus.storage.clear();
					plus.runtime.restart();
				}, 1000);
			}

		}).fail(function(status) {
			console.log('修改密码请求'+status)
			statusHandler(status);
		});
	}
	
	function delDeviceTokenFromAndroid() {
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/user/reset/devicetoken/null';
		console.log('updateDeviceToken' + url);
		$.put(url).then(function(data) {
			console.log(JSON.stringify(data));
			if(data.code === 0) {
	//			mui.toast('成功');
			} else {
	//			mui.toast('出错了');
			}
	
		}).fail(function(status) {
			statusHandler(status);
			console.log('updateDeviceToken失败' + status)
		});
	}

});