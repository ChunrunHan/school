define(['mui', 'mall', 'md5'], function(mui, $, md5) {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});

	var old_back = mui.back;

	mui.plusReady(function() {
		console.log('seller_edit plus ready');
		plus.screen.lockOrientation("portrait-primary");
		plus.webview.currentWebview().setStyle({
			scrollIndicator: 'none'
		});

		//	提交申请注册
		$.tapHandler({
			selector: '.seller-save',
			callback: function() {
				getUserInfo();
//				var path = document.querySelector('.img-logo').getAttribute('src');
//				alert(path);
//				if(path == "images/header1.png") {
//					mui.alert('请上传头像')
//				} else {
//					appendFile(path)
//				}

			}
		});

		//	修改头像
		$.tapHandler({
			selector: '.img-logo',
			callback: function() {
				console.log('点击头像');
				//				showActionSheetone();
				galleryImg()
				return false;
			}
		});

	});

	document.getElementById('file').addEventListener('change', function(e) {
		var file = e.target.files[0];
		console.log(file)
		readerFile(file);

		console.log(file)
		var storeAs = uuid() + postf(file.name);
		console.log(postf(file.name));
		console.log(file.name + ' => ' + storeAs);
		var stsurl = urlBase + '/sts';
		console.log(stsurl)
		OSS.urllib.request(stsurl, {
				method: 'GET'
			},
			function(err, response) {
				if(err) {
					return alert(err);
				}
				try {
					result = JSON.parse(response);
				} catch(e) {
					return alert('parse sts response info error: ' + e.message);
				}
				console.log(result)
				console.log(JSON.stringify(result))
				var client = new OSS.Wrapper({
					accessKeyId: result.AccessKeyId,
					accessKeySecret: result.AccessKeySecret,
					stsToken: result.SecurityToken,
					endpoint: 'oss-cn-qingdao.aliyuncs.com',
					bucket: 'zaoyuan'
				});
				client.multipartUpload(storeAs, file).then(function(result) {
					console.log(JSON.stringify(result));
				}).catch(function(err) {
					console.log(err);
				});
			});
	});

	function postf(fileName) {
		return fileName.substring(fileName.lastIndexOf("."), fileName.length); //后缀名
	}

	function uuid() {
		var lut = [];
		for(var i = 0; i < 256; i++) {
			lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
		}
		var d0 = Math.random() * 0xffffffff | 0;
		var d1 = Math.random() * 0xffffffff | 0;
		var d2 = Math.random() * 0xffffffff | 0;
		var d3 = Math.random() * 0xffffffff | 0;
		return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] +
			lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] +
			lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
			lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
	}

	function readerFile(file) {
		//	新建阅读器
		var reader = new FileReader();

		//根据文件类型选择阅读方式
		switch(file.type) {
			//图像类型读取方式
			case 'image/jpeg':
			case 'image/jpg':
			case 'image/png':
			case 'image/gif':
			case 'image/bmp':
				reader.readAsDataURL(file);
				break;

		}
		//        当文件阅读结束后执行的方法
		reader.addEventListener('load', function() {
			switch(file.type) {
				//图像读取和创建标签
				case 'image/jpeg':
				case 'image/png':
				case 'image/gif':
				case 'image/bmp':
				case 'image/jpg':

					var space = reader.result;
					//							console.log(space)
					//							document.getElementById('imgs').setAttribute('src', space)
					document.querySelector('.img-logo').setAttribute('src', space)
					break;
			}
		});

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
				idName: 'user_regist.html',
				camera: camera
			},
			show: {
				autoShow: false
			}
		});
	}
	//	获得图片裁剪的值
	window.addEventListener('userRegistClip', clipImage);

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
			//			getValue(file);
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
	function getUserInfo() {
		var username = document.getElementById('name').value;
		var mobile = document.getElementById('mobile').value;
		var password = document.getElementById('password').value;
		var repassword = document.getElementById('repassword').value;
		if(username == '' || mobile == '' || password == '') {
			mui.toast('用户名、手机号、密码不能为空');
		} else {
			if(repassword == '') {
				mui.toast('请输入确认密码');
			} else {
				if(password != repassword) {
					mui.toast('两次输入的密码不一致，请重新输入');
				} else {
					password = md5(password);
					if(checkMobile(mobile)) {
						console.log('手机号：' + mobile);
						var json = {
							username: username,
							mobile: mobile,
							password: password,
							role:0
						}
						console.log(json);
						userRegion(json)
					}

				}
			}
		}

	}

	//	用户注册函数
	function userRegion(data) {
		console.log('获取的数据：' + JSON.stringify(data));
		var url = urlBase + '/user/register';
		$.post(url, data).then(function(data) {
			console.log(data);
			console.log(JSON.stringify(data));
			mui.toast(data.errMsg);
			mui.back();
		}).fail(function(status) {
			statusHandler(status);
			console.log(status);
		});
	}

	mui.back = function() {
		pickerBlur();
		clearinput();
		old_back();
	}

	//	清空数据内容
	function clearinput() {
		document.getElementById('name').value = '';
		document.getElementById('mobile').value = '';
		document.getElementById('password').value = '';
		document.getElementById('repassword').value = '';
	}

});