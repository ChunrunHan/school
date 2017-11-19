define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true, //启用右滑关闭功能
		beforeback: function() {
			pickerBlur();
			//返回true，继续页面关闭逻辑
			return true;
		}
	});

	var imgNum = 0; //照片
	var old_back = mui.back;
	mui.plusReady(function() {
		console.log('#committee_announcement_add plusReady()')
		plus.screen.lockOrientation("portrait-primary");

		//	通过监听输入框的变化，开启计数功能
		document.getElementById('textarea').addEventListener('input', function() {
			document.getElementById('count-text').innerHTML = document.getElementById('textarea').value.length;
		});

		document.getElementById('textarea').addEventListener('keydown', function(event) {
			checkEnter(event);
		});

		//	提交操作
		$.tapHandler({
			selector: '.feedback-save',
			callback: function(id) {
				pickerBlur();
				var text = document.getElementById('textarea').value;
				var title = document.getElementById('title').value;
				var images = filenameArray();
				console.log(images);
				var newimg = [];
				for(var i = 0; i < images.length; i++) {
					console.log(images[i]);
					console.log(typeof images[i]);
					var name = images[i].substring(0, 32);
					//							alert(name);
					newimg.push(name);
				}
				newimg = newimg.join('|');
				if(title == '') {
					mui.toast('公告标题不能为空！');
					return;
				} else if(text == '') {
					mui.toast('公告内容不能为空！');
					return;
				} else {
					var Json = {
						title: title,
						text: text,
						userHide: 0,
						images: newimg,
						categoryId: 6
					}
					console.log(JSON.stringify(Json));
					submitPropertyAnno(Json);
				}

			}

		});

		mui.back = function() {
			pickerBlur();
			clearFeedbackInput();
			var propertySubView = plus.webview.getWebviewById('committee_announcement_sub.html');
			mui.fire(propertySubView, 'propertyRefresh');
			old_back();
		}

		//	图片上传
		mui('.img-all').on('tap', '.imgadd', function() {
			showActionSheetone();
			console.log('点击上传图片按钮了');
		});

		//	图片删除
		mui('.img-all').on('tap', '.del-img', function() {
			var id = this.getAttribute('filename');
			delImg(id);
		});

		//	图片预览
		mui('.img-all').on('tap', '.img-src', function() {
			var src = this.getAttribute('src');
			goSeeImg(src);

		});

	})

	//	清空内容
	function clearFeedbackInput() {
		imgNum = 0;
		document.getElementById('textarea').value = '';
		backDelImg();
		$.bind({
			title: ''
		});
	}

	//	发表业委会公告
	function submitPropertyAnno(json) {
		plus.nativeUI.showWaiting();
		console.log('submitFeedback(' + JSON.stringify(json) + ')');
		//		plus.storage.setItem('token', demoToken);
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/user/feed';
		$.post(url, json).then(function(data) {
			console.log(JSON.stringify(data))
			plus.nativeUI.closeWaiting();
			if(data.code === 0) {
				mui.toast('业委会公告提交成功！');
				var html = '<div class="img-add imgadd">';
				html += 	'	<img src="images/iconfont-tianjia.png" alt="" width="100%" height="auto" />';
				html +=		'</div>';
				html += '';
				document.querySelector('.img-all').innerHTML = html;
				document.querySelector('.img-all').style.textAlign = 'left';
				clearFeedbackInput();
				var propertySubView = plus.webview.getWebviewById('committee_announcement_sub.html');
				mui.fire(propertySubView, 'propertyRefresh');
				old_back();
				
			} else if(data.code === 20){
				mui.toast('当前没有绑定房屋！');
				return;
			} else {
				mui.toast("业委会公告提交失败！");
			}
			
		}).fail(function(status) {
			console.log('提交业委会公告' + status)
			statusHandler(status);
		})
	}

	//	textarea禁止换行
	function checkEnter(e) {
		var et = e || window.event;
		var keycode = et.charCode || et.keyCode;
		if(keycode == 13) {
			if(window.event)
				window.event.returnValue = false;
			else
				e.preventDefault(); //for firefox
		}
	}

	//	选取图片的来源，拍照和相册  
	function showActionSheetone() {
		//	弹出系统选择按钮框
		var actionbuttons = [{
			title: "拍照"
		}, {
			title: "相册选取"
		}];

		var actionstyle = {
			title: "选择照片",
			cancel: "取消",
			buttons: actionbuttons
		};

		plus.nativeUI.actionSheet(actionstyle, function(e) {
			//	索引值从0开始,即1表示点击buttons中定义的第一个按钮
			if(e.index == 1) {
				//	拍照操作
				getImage();
			} else if(e.index == 2) {
				// 相册选取
				galleryImg();
			}
		});

	}
	//	拍照操作
	function getImage() {
		console.log('开始拍照：');

		//	安卓7.0系统以上调用原生拍照
		var version = plus.os.version;
		var system = plus.os.name;
		if(parseInt(version) >= 7 && system == 'Android') {
//			alert('调用原生拍照')
			var imgPath;
			PropertyPluginFn();
			plus.PropertyPlugin.nativeTakePhoto(null, function(result) {
				console.log(result);
				imgPath = result;
				var filearry = result.split('/');
				var filename = filearry[filearry.length - 1];
				appendFile("file://" + imgPath, filename);
			}, function(result) {
				console.log(result);
			});
			console.log(imgPath);

		} else {
			plus.camera.getCamera().captureImage(function(path) {
				console.log('path: ' + path);
				plus.io.resolveLocalFileSystemURL(path, function(entry) {
					var path = entry.toLocalURL();
					console.log(path);
					var filename = entry.name;
					console.log(filename);
					appendFile(path, filename);
				}, function(e) {
					plus.nativeUI.toast("读取拍照文件错误：" + e.message);
				});

			}, function(e) {}, {
				filename: "_doc/camera/"
			});
		}

	}

	// 相册选取
	function galleryImg() {
		plus.gallery.pick(function(path) {

			var filename = 'images.jpg';

			appendFile(path, filename);

		}, function(e) {
			console.log("取消选择图片");
		}, {
			filter: "image"
		});
	}

	//	获取图片名字数组
	function filenameArray() {
		var filename = [];
		var imgName = document.querySelectorAll('.img-box');
		for(var i = 0; i < imgName.length; i++) {
			filename.push(imgName[i].getAttribute('filename'));
		}
		return filename;
	}

	//	图片上传
	function appendFile(path, filename) {
		plus.nativeUI.showWaiting('上传中');

		console.log("图片的路径" + path);
		console.log("图片名字" + filename);
		console.log(imgNum);
		$.ossUpload(path).then(function(file) {
			console.log('upload done:' + file);

			plus.nativeUI.closeWaiting();
			showImgDetail(file, path);
			imgNum++;
			imgaddShow(imgNum);

		}).fail(function(status) {
			console.log('failed to upload');
			statusHandler(status);
		});

	}

	//	显示照片
	function showImgDetail(file, path) {
		var html = "";
		html += '<div class="img-box" id="' + file + '" filename="' + file + '">';
		html += '    <img src="' + path + '" class="img-src" alt="" data-preview-src="" data-preview-group="1" />';
		html += '    <span class="del-img icon-quan" filename="' + file + '">';
		html += '</div>';
		html += '';
		document.getElementsByClassName('img-add')[0].insertAdjacentHTML('beforeBegin', html);
//		alert(document.getElementById(file).width);
	}

	//	删除照片
	function delImg(file) {
		console.log('当前删除的文件:' + file);
		mui.confirm('确定要删除该图片吗？\n', '', ['是', '否'],
			function(event) {
				if(event.index === 0) {
					delImgFromServer(file);
				}
			});

	}

	//	oss单个文件删除
	function delImgFromServer(file) {
		bucketP = plus.storage.getItem('bucketP');
		var delfile = [{
			bucket: bucketP,
			object: file
		}]
		//		alert('bucket: '+ bucket);
		plus.nativeUI.showWaiting('删除中');
		console.log('删除的文件名字： ' + delfile);
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/oss/del';
		$.post(url, delfile).then(function(data) {
			plus.nativeUI.closeWaiting();
			if(data.code === 0) {
				mui.toast('图片删除成功！');
				delImgFromLocal(file);
				imgNum--;
				imgaddShow(imgNum);
			}

		}).fail(function(status) {
			//			plus.nativeUI.closeWaiting();
			console.log('oss单个文件删除' + status)
			statusHandler(status);
		})
	}
	//	oss返回文件删除
	function backDelImg() {
		var imgNum = document.querySelectorAll('.img-src').length;
		if(imgNum == 0) {
			old_back();
			return false;
		}
		var filename = filenameArray();
		console.log(filename);
		var delfile = [];
		for(var i = 0; i < filename.length; i++) {
			bucketP = plus.storage.getItem('bucketP');
			delfile.push({
				bucket: bucketP,
				object: filename[i]
			});
		}
		console.log('返回要删除的数据文件 ：' + delfile);
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/oss/del';
		$.post(url, delfile).then(function(data) {
			plus.nativeUI.closeWaiting();
			if(data.code === 0) {
				var html = '<div class="img-add imgadd">';
				html += '		<img src="images/iconfont-tianjia.png" alt="" width="100%" height="auto"/>';
				html += '   </div>';
				html += '';
				document.querySelector('.img-all').innerHTML = html;
				document.querySelector('.img-all').style.textAlign = 'left';
				//	图片上传
				$.tapHandler({
					selector: '.imgadd',
					callback: function() {
						showActionSheetone();
						console.log('点击上传图片按钮了');
						return false;
					}
				});
				imgNum = 0;
				imgaddShow(imgNum);
				old_back();
			}

		}).fail(function(status) {
			console.log('oss返回文件删除' + status)
			statusHandler(status);
			old_back();
		})
	}
	//	本地删除
	function delImgFromLocal(file) {
		var imgbox = document.getElementById(file);
		var imgall = document.querySelector('.img-all');
		imgall.removeChild(imgbox);
	}

	//	控制照相按钮显示隐藏
	function imgaddShow(num) {
		if(num == 6) {
			document.querySelector('.imgadd').classList.add('mui-hidden');
			//			document.querySelector('.img-all').style.textAlign = 'center';
		} else {
			document.querySelector('.imgadd').classList.remove('mui-hidden');
			document.querySelector('.img-all').style.textAlign = 'left';

		}
	}

		//	图片预览
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

});