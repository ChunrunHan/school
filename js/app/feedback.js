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
		plus.screen.lockOrientation("portrait-primary");

		//	通过监听输入框的变化，开启计数功能
		document.getElementById('textarea').addEventListener('input', function() {
			document.getElementById('count-text').innerHTML = document.getElementById('textarea').value.length;
		});
		
		document.getElementById('textarea').addEventListener('keydown', function(event) {
			checkEnter(event);
		});
		
		//	提交反馈操作
		$.tapHandler({
			selector: '.feedback-save',
			callback: function(id) {
				pickerBlur();
				var content = document.getElementById('textarea').value;
				var mobile = document.getElementById('feedback-phone').value;
				var name = document.getElementById('feedback-name').value;
				if(content == ''){
					mui.toast('内容不能为空');
					return;
				}else if(name == ''){
					mui.toast('姓名不能为空');
					return;
				} else if(mobile == '') {
					mui.toast('手机号不能为空');
					return;
				} else if(checkMobile(mobile)) {
					console.log(content);
					var json = $.serialize();
					var addJson = {
						content: content
					}
					var newJson = mui.extend(newJson, json, addJson);
					console.log(JSON.stringify(newJson));
					if(json !== null) {
						submitFeedback(newJson);
					}
				}

				return false;
			}
		});
		var old_back = mui.back;
		mui.back = function() {
			pickerBlur();
			clearFeedbackInput();
			old_back();
		}

	})

	//	清空内容
	function clearFeedbackInput() {
		document.getElementById('textarea').value = '';
		$.bind({
			name: '',
			phone: ''
		});
		document.getElementById('count-text').innerText = 0;
	}

	//	提交反馈
	function submitFeedback(json) {
		console.log('submitFeedback(' + JSON.stringify(json) + ')');
		//		plus.storage.setItem('token', demoToken);
		urlBase = plus.storage.getItem('urlBase');
		var url = urlBase + '/feedback';
		$.post(url, json).then(function(data) {
			if(data.code === 0) {
				mui.toast('提交反馈成功！');
				clearFeedbackInput();
			} else if(data.code === 85) {
				mui.toast("用户不存在");

			}
		}).fail(function(status) {
			console.log('提交反馈'+status)
			statusHandler(status);
		})
	}
	
	//	textarea禁止换行
	function checkEnter(e)
	{
	    var et=e||window.event;
	    var keycode=et.charCode||et.keyCode;   
	    if(keycode==13)
	    {
	        if(window.event)
	           window.event.returnValue = false;
	         else
	           e.preventDefault();//for firefox
	    }
	}

});