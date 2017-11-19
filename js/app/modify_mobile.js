define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true, //启用右滑关闭功能
		beforeback: function(){
			pickerBlur();
			//返回true，继续页面关闭逻辑
			return true;
		}
	});

	mui.plusReady(function() {
		console.log('modify_mobile plusReady()');
		plus.screen.lockOrientation("portrait-primary");

		document.getElementById('smscode').addEventListener('blur', function() {
			//	验证码不能为汉字
			if(isNaN(this.value)) {
				mui.toast('验证码非法字符');
				this.value = '';
			}
		});

		var mobile = plus.storage.getItem('mobileP');
		document.getElementById('oldmobile').value = mobile;
		//	点击获取手机验证码
		$.tapHandler({
			selector: '.get-smscode',
			callback: function() {
				var oldmobile = document.getElementById('oldmobile').value;
				var newmobile = document.getElementById('newmobile').value;
				if(oldmobile == '' || newmobile == '') {
					mui.toast('手机号不能为空');
					return;
				} else if(oldmobile == newmobile) {
					mui.toast('两个手机号不能相同');
					return;
				} else if(oldmobile != mobile) {
					mui.toast('原手机号不正确');
					return;
				} else {
					if(checkMobile(newmobile) && checkMobile(oldmobile)) {
						console.log('手机号：' + newmobile);
						openRunTime();
						getSmscode(newmobile);
					}
				}

			}
		});

		//	编辑保存操作
		$.tapHandler({
			selector: '#edit-btn',
			callback: function() {
				//	后台接口要求传送数据格式
				var smscode = document.getElementById('smscode').value;
				var oldmobile = document.getElementById('oldmobile').value;
				var newmobile = document.getElementById('newmobile').value;
				if(oldmobile == '' || newmobile == '') {
					mui.toast('手机号不能为空');
					return;
				} else if(oldmobile == newmobile) {
					mui.toast('两个手机号不能相同');
					return;
				} else if(oldmobile != mobile) {
					mui.toast('原手机号不正确');
					return;
				} else if(smscode == '') {
					mui.toast('验证码不能为空');
					return;
				} else {
					if(checkMobile(newmobile) && checkMobile(oldmobile)) {
						var json = $.serialize();
						console.log('编辑提交的数据(' + JSON.stringify(json) + ')');
						if(json !== null) {
							modifyMobile(json);
						}
					}
					
				}

				return false;
			}
		});
	});

	//	提交修改商家用户手机号
	function modifyMobile(json) {
		console.log('modifyMobile：' + JSON.stringify(json));
		plus.nativeUI.showWaiting('提交中');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/user/reset/mobile';
		$.post(url, json).then(function(data) {
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.code === 85) {
				mui.toast('用户不存在');
			} else if(data.code === 81) {
				mui.toast('手机号已经存在');
			} else if(data.code === 234) {
				mui.toast('无效的验证码');
			} else if(data.code === 0) {
				mui.toast('修改成功,请重新登录');
				setTimeout(function() {
					delDeviceTokenFromAndroid();
					plus.storage.clear();
					plus.runtime.restart();
				}, 1000);

			} else if(data.code == 233) {
				mui.toast('验证码过期');
			}

		}).fail(function(status) {
			console.log('提交修改商家用户手机号'+status)
			statusHandler(status);
		});
	}

	//	获取手机验证码
	function getSmscode(newmobile) {
		console.log('获取手机验证码');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/user/sms/' + newmobile + '/sms';
		$.get(url).then(function(data) {
			console.log('验证码返回数据：' + JSON.stringify(data));

			if(data.code === 0) {
				mui.toast('请注意在新手机号查收验证码');
			} else if(data.code === 181) {
				mui.toast('手机号码已被注册');
				closeRunTime();
			} else if(data.code === 1) {
				mui.toast('用户不存在');
				closeRunTime();
			} else if(data.code === 6) {
				mui.toast('验证码次数超过限制');
				closeRunTime();
			} else if(data.code === 5) {
				mui.toast('验证码依然有效');
				closeRunTime();
			}

		}).fail(function(status) {
			closeRunTime();
			console.log('获取手机验证码'+status)
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