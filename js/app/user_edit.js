define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true, //启用右滑关闭功能
		beforeback: function() {
			avatar = plus.storage.getItem('avatar');
			nickname = plus.storage.getItem('nickname');
			if(avatar !== null) {
				userimg = "http://" + bucketP + ".oss-cn-qingdao.aliyuncs.com/" + userSsoId + '/' + avatar + '.jpg';
			} else {
				userimg = 'images/logo.jpg';
			}
			document.querySelector('.img-logo').setAttribute('src', userimg);
			document.getElementById('nickname').value = nickname;
			return true;
		}
	});

	var oldpath;
	var userimg;
	mui.plusReady(function() {
		console.log('#user_edit plus ready');
		plus.screen.lockOrientation("portrait-primary");
		plus.webview.currentWebview().setStyle({
			scrollIndicator: 'none'
		});
		
		

		//	所有的input光标定位到最后
		mui('.mui-content').on('mousedown', 'input[type=text]', function() {
			console.log(this.value.length);
			var pos = this.value.length
			setCursorPosition(this, pos);
		});
		mui('.mui-content').on('mouseup', 'input[type=text]', function() {
			console.log(this.value.length);
			var pos = this.value.length
			setCursorPosition(this, pos);
		});

		urlBaseP = plus.storage.getItem('urlBaseP');
		bucketP = plus.storage.getItem('bucketP');
		nickname = plus.storage.getItem('nickname');
		realname = plus.storage.getItem('realname');
		avatar = plus.storage.getItem('avatar');
		zoneId = plus.storage.getItem('zoneId');
		zoneName = plus.storage.getItem('zoneName');
		userSsoId = plus.storage.getItem('userSsoId');
		mobileP = plus.storage.getItem('mobileP');
		zonearea = plus.storage.getItem('zonearea');
		console.log(userSsoId);
		console.log(urlBaseP);
		console.log(avatar);
		if(avatar !== null) {
			userimg = "http://" + bucketP + ".oss-cn-qingdao.aliyuncs.com/" + userSsoId + '/' + avatar + '.jpg';
		} else {
			userimg = 'images/logo.jpg';
		}
		console.log(userimg);
		document.querySelector('.img-logo').setAttribute('src', userimg);
		document.querySelector('.img-logo').setAttribute('logoname', userimg);
		document.getElementById('zone').value = zoneName;
		document.getElementById('area').value = zonearea;
		document.getElementById('realname').value = realname;
		document.getElementById('nickname').value = nickname;
		document.getElementById('phone').value = mobileP;

		//	图片默认赋值
//		document.querySelector('.img-logo').setAttribute('src', 'images/logo.jpg');
		//	获取sellerId
		sellerId = plus.storage.getItem('sellerId');
		urlBase = plus.storage.getItem('urlBase');

		//	修改头像
		$.tapHandler({
			selector: '.img-logo',
			callback: function() {
				console.log('点击头像');
				showActionSheetone();
				return false;
			}
		});

		//	修改信息
		$.tapHandler({
			selector: '.goods-save',
			callback: function() {
				pickerBlur();
				var newpath = document.querySelector('.img-logo').getAttribute('src');
				var oldname = document.querySelector('.img-logo').getAttribute('logoname');
				console.log("newpath" + newpath);
				console.log("oldname" + oldname);
				var oldnick = document.getElementById('nickname').value;
				console.log("oldnick" + oldnick);
				console.log("nickname" + nickname);
				
				if(oldname == newpath && oldnick == nickname) {
//					alert('没有修改数据啊');
					mui.toast('保存完成');
					return;
				} else {
					alert('修改数据了');
					if(oldname != 'images/logo.jpg' && oldname != newpath){
						var oldarry = oldname.split('/');
						console.log(oldarry);
						var j = oldarry.length - 1;
						console.log(oldarry[j]);
//						deleteFile(oldarry[j]);
					}
					appendFile(newpath);
				}

			}
		});

	});

	//	修改商家信息
	function editSeller(json) {
		plus.nativeUI.showWaiting();
		console.log('editSeller：' + JSON.stringify(json));
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/user';
		$.put(url, json).then(function(data) {
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.errCode === 0) {
				mui.toast('保存成功');
				console.log(data.data.avatar);
				console.log(data.data.nickname);
				plus.storage.setItem('avatar',data.data.avatar);
				plus.storage.setItem('nickname',data.data.nickname);
				var index = plus.webview.getWebviewById('index.html');
				mui.fire(index, 'refreshInName');

			} else if(data.code !== 0) {
				mui.toast(data.message);
				return;
			} else {
				mui.toast('商家不存在');
			}

		}).fail(function(status) {
			console.log('修改商家信息' + status)
			statusHandler(status);
		});
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

	function getImage() {
		console.log('开始拍照：');

		//	安卓7.0系统以上调用原生拍照
		var version = plus.os.version;
		var system = plus.os.name;
		if(parseInt(version) >= 7 && system == 'Android') {
			var imgPath;
			PropertyPluginFn();
			plus.PropertyPlugin.nativeTakePhoto(null, function(result) {
				console.log(result);
				imgPath = result;
				var filearry = result.split('/');
				var filename = filearry[filearry.length - 1];
				goShowImg("file://" + imgPath, filename, 1);
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
					goShowImg(path, filename, 1);
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
			plus.io.resolveLocalFileSystemURL(path, function(entry) {
				var path = entry.toLocalURL();
				var filename = entry.name;
				var image = new Image();
				image.src = path;
				goShowImg(path, filename, 0);
			}, function(e) {
				plus.nativeUI.toast("读取相册文件错误：" + e.message);
			});

		}, function(e) {
			console.log("取消选择图片");
		}, {
			filter: "image"
		});
	}

	//	跳转到裁剪页面
	function goShowImg(path, filename, camera) {
		mui.openWindow({
			url: 'clip_img.html',
			id: 'clip_img.html',
			extras: {
				path: path,
				filename: filename,
				idName: 'user_edit.html',
				camera: camera
			},
			show: {
				autoShow: false
			}
		});
	}
	//	获得图片裁剪的值
	window.addEventListener('userEditClip', clipImage);

	function clipImage(e) {
		var path = e.detail.path;
		var filename = e.detail.filename;
		var top = e.detail.top;
		var left = e.detail.left;
		var width = e.detail.width;
		var height = e.detail.height;
		sellerImgClip(path, filename, top, left, width, height)

	}
	//	图片裁剪
	function sellerImgClip(path, filename, top, left, width, height) {
		filename = new Date().getTime() + '.jpg';
		plus.nativeUI.showWaiting('裁剪中');
		plus.zip.compressImage({
				src: path,
				dst: '_downloads/' + filename,
				quality: 100,
				clip: {
					top: top,
					left: left,
					width: width,
					height: height
				}
			},
			function(event) {
				plus.nativeUI.closeWaiting();
				compressImage(event.target, filename);
			},
			function(error) {
				plus.nativeUI.closeWaiting();
			});
	}

	//	图像压缩
	function compressImage(path, filename) {
		plus.nativeUI.showWaiting('压缩中');
		plus.zip.compressImage({
				src: path,
				dst: '_downloads/' + 'zip_' + filename,
				quality: 60
			},
			function(event) {
				plus.nativeUI.closeWaiting();
				document.querySelector('.img-logo').setAttribute('src', event.target);

			},
			function(error) {
				mui.toast('选取失败');
			});

	}
	//	图片上传
	function appendFile(path) {
		plus.nativeUI.showWaiting('上传中');
		console.log("图片的路径" + path);
		$.ossUpload(path).then(function(file) {
			console.log('upload done:' + file);
			plus.nativeUI.closeWaiting();
			getValue(file);
		}).fail(function(status) { 
			console.log('failed to upload');
			statusHandler(status);
		});

	}
	//	图片删除
	function deleteFile(oldname) {
		bucket = plus.storage.getItem('bucket');
		var delfile = [{
			bucket: bucket,
			object: oldname
		}]
		plus.nativeUI.showWaiting('删除中');
		console.log('删除的文件名字： ' + delfile);
		var url = urlBase + '/oss/del';
		$.post(url, delfile).then(function(data) {
			plus.nativeUI.closeWaiting();
			if(data.code === 0) {
				mui.toast('头像更换成功')
			}

		}).fail(function(status) {
			plus.nativeUI.closeWaiting();
			console.log('图片删除' + status);
			statusHandler(status);
		})
	}

	//	提交数据
	function getValue(imgname) {
		var nickname = document.getElementById('nickname').value;
		imgname = imgname.substring(0,32);
		var json = {
			nickname: nickname,
			sex: 0,
			avatar: imgname

		}
		if(json.nickname == '') {
			mui.toast('昵称不能为空')
			return;
		} else {
			editSeller(json);

		}

	}

});