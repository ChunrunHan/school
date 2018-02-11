define(['q', 'md5', 'mui', 'mustache'], function(Q, md5, mui, m) {
	// depend on the 'token' & 'mobile' in storage
	var idSelectorRE = /^#([\w-]+)$/;
	var classSelectorRE = /^\.([\w-]+)$/;
	var tagSelectorRE = /^[\w-]+$/;
	
	var token = function() {
		var token = plus.storage.getItem("token");

		if(token != null && token != undefined) {
			token = plus.storage.getItem("token");
		} else {
			token = appKey;
		}
		return token;
	};
	
    var sign = function(url, json, time) {
        var key = token() != null ? token() : appKey;
        var rawData = key + time + url;
        if(json !== undefined) {
            if (typeof(json) === 'object')
                json = JSON.stringify(json);
            rawData += json;
        }
        return md5(rawData);
    };
    var header = function(url, json) {
        var time = Date.parse(new Date());
//      console.log("HEADERS : "+sign(url,json,time))
//      console.log("HEADERS : "+token());
//      console.log("HEADERS : "+time.toString());
        return {
            "Content-Type": "application/json",
            source: appSource,
            ver: appVer,
            timestamp: time.toString(),
            token: token(),
            sign: sign(url, json, time)
        };
   
    };
	var uuid = function() {
		var lut = [];
		for(var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }
		var d0 = Math.random() * 0xffffffff | 0;
		var d1 = Math.random() * 0xffffffff | 0;
		var d2 = Math.random() * 0xffffffff | 0;
		var d3 = Math.random() * 0xffffffff | 0;
		return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + 
			lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + 
			lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
			lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
	};
	cachedView = {};
	var getView = function(name) {
		if(cachedView.name === undefined) {
			cachedView.name = plus.webview.getWebviewById(name);
		}
		return cachedView.name;
	};
	var timeout = 10000;
	var __dump = function(obj) {
		var result = "";
		for(var i in obj) {
			var property = obj[i];
			result += i + " = " + property + "\n\n";
		}
		alert(result);
	};
	var __tapHandler = function(url, id, extra, trigger, event, callback, styles) {
		var idValue = trigger.currentTarget.getAttribute(id);
		//console.log('__tapHandler: [url=' + url + '][id=' + id + '][idvalue=' + idValue + '][event=' + event + ']');
		
		if(idValue !== undefined || extra !== undefined) {
			
			if (event === undefined || event === null) {
				event = "receiver";
			}
			
			var callbackResult = true;
			if (typeof(callback) === "function") {
				callbackResult = callback(idValue, trigger);
				
				if (callbackResult === undefined) callbackResult = true;
			}
			
			if (callbackResult && url !== null) {
				var webview = plus.webview.getWebviewById(url);		//suppose url is same w/ id in cache
				if (!webview) {
					console.log(url + " not exist");
					//webview = plus.webview.create(url, url, styles, {preload: true}, {id: idValue, extra: extra});
					plus.nativeUI.showWaiting('加载中');
					webview = mui.preload({url: url, id: url});
					
					webview.addEventListener('loaded', function() {
						setTimeout(function() {
							mui.fire(webview, event, { id: idValue, extra: extra });
							console.log('fire event[' + event + ']: id=' + idValue + ', extra=' + JSON.stringify(extra));
						}, 300);
					});
					
					webview.addEventListener('rendered', function() {
						plus.nativeUI.closeWaiting();
						mui.openWindow({ url: url });
					});
					
				} else {
					mui.fire(webview, event, { id: idValue, extra: extra });
					console.log('fire event[' + event + ']: id=' + idValue + ', extra=' + JSON.stringify(extra));
					mui.openWindow({ url: url });
				}	
			}
		}
	};

	return {

		// AJAX

		get: function(url) {
			var defer = Q.defer();
			mui.ajax(url, {
				dataType: 'json',
				crossDomain: true,
				type: 'get',
				timeout: timeout,
//				headers: header(url),
				headers:{'Content-Type':'application/json'},
				success: function(data) {
					//defer.notify(data);
					defer.resolve(data);
				},
				error: function(xhr, type, errorThrown) {
					defer.reject(xhr.status);
				}
			});
			return defer.promise;
		},
		post: function(url, data) {
			if (typeof(data) === "string") {
				data = JSON.parse(data);
			}
			
			var defer = Q.defer();
			mui.ajax(url, {
				data: data,
				dataType: 'json',
				crossDomain: true,
				type: 'post',
				timeout: timeout,
//				headers: header(url, data),
//				headers:{'Content-Type':'application/json'},
				success: function(data) {
					//defer.notify(data);
					defer.resolve(data);
				},
				error: function(xhr, type, errorThrown) {
					defer.reject(xhr.status);
				}
			});
			return defer.promise;
		},
		put: function(url, data) {
			if (typeof(data) === "string") {
				data = JSON.parse(data);
			}
			
			var defer = Q.defer();
			mui.ajax(url, {
				data: data,
				dataType: 'json',
				crossDomain: true,
				type: 'put',
				timeout: timeout,
//				headers: header(url, data),
				headers:{'Content-Type':'application/json'},
				success: function(data) {
					//defer.notify(data);
					defer.resolve(data);
				},
				error: function(xhr, type, errorThrown) {
					defer.reject(xhr.status);
				}
			});
			return defer.promise;
		},
		del: function(url) {
			var defer = Q.defer();
			mui.ajax(url, {
				crossDomain: true,
				type: 'delete',
				timeout: timeout,
//				headers: header(url),
				headers:{'Content-Type':'application/json'},
				success: function(data) {
					//defer.notify(data);
					defer.resolve(data);
				},
				error: function(xhr, type, errorThrown) {
					defer.reject(xhr.status);
				}
			});
			return defer.promise;
		},

		// UTILITIES

		setToken: function(token) {
			plus.storage.setItem('token', token);
		},
		getToken: function() {
			return plus.storage.getItem("token");
		},
		dump: function(obj) {
			var result = "";
			for(var i in obj) {
				var property = obj[i];
				result += i + " = " + property + "\n\n";
			}
			alert(result);
		},
		setValue: function(selector, value) {
			var doms = document.querySelectorAll(selector);
			if(doms === undefined || doms.length == 0) {
				console.log('not find the dom: ' + selector);
				return;
			}

			doms[0].innerHTML = value;
		},
		showWaiting: function(msg) {
			var msg = msg !== undefined ? msg : '加载中';
			plus.nativeUI.showWaiting('加载中');
		},
		closeWaiting: function() {
			plus.nativeUI.closeWaiting();
		},
		isNullOrUndefined: function(obj) {
			if (obj === undefined || obj === '' || obj === null) 
				return true;
			return false;
		},
		
		// OSS RELEATED
		
		// source is file object, target is OSS object name with full path (string)
		// only allow to upload into yzb-mall/yezhubao-mall
		ossUpload: function(source) {
			console.log('ossUpload(' + source + ')');
			var defer = Q.defer();
			if (this.isNullOrUndefined(source)) {
				defer.reject(ERROR.FILE_INVALID);
				return defer.promise;
			}

			this.stsUpdate().then(function(sts) {
				console.log(JSON.stringify(sts))
				var accessKeyId = sts.AccessKeyId;
				var accessKeySecret = sts.AccessKeySecret;
				var stsToken = sts.SecurityToken;
				var endpoint = 'oss-cn-qingdao.aliyuncs.com';
				var bucket = 'zaoyuan';
				var host = 'http://zaoyuan.oss-cn-qingdao.aliyuncs.com';
				
				var pos = source.lastIndexOf('.');
				var suffix = source.substring(pos).toLowerCase();
//				alert('suffix' + suffix);
				if(suffix !== '.jpg'){
					defer.reject(ERROR.FILE_INVALID);
					mui.toast('请上传jpg格式图片')
					return;
				}
				var filename = uuid().replace(/-/,'') + suffix;
				var keyname = filename;
				console.log(keyname)
				
				var task = plus.uploader.createUpload(host, {
						method: "POST"
					},
					function(t, status) {
						plus.nativeUI.closeWaiting();
						console.log(JSON.stringify(t));
						console.log(status)
						if(status == 200) {
							mui.toast('上传成功');
							defer.resolve(filename);
						} else {
							defer.reject(status);
						}
					}
				);
				
				task.addData("key", keyname);
				task.addData("accessKeyId", accessKeyId);
				task.addData("accessKeySecret", accessKeySecret);
				task.addData("success_action_status", "200");
				task.addData("stsToken", stsToken);
				task.addData("bucket", bucket);
				task.addData("endpoint", endpoint);

				task.addFile(source, {
					key: "file",
					name: "file",
					mime: "image/jpeg"
				});
				task.start();
				
			});
			
			return defer.promise;
		},
		// 上传图片
		imgUpdate: function(dir,source){
			console.log('ossUpload(' + source + ')');
			var defer = Q.defer();
			if (this.isNullOrUndefined(source)) {
				defer.reject(ERROR.FILE_INVALID);
				return defer.promise;
			}
			var host = urlBaseP + '/imgUpdate';
			console.log(host);
			var pos = source.lastIndexOf('.');
			var suffix = source.substring(pos).toLowerCase();
			var filename = uuid().replace(/-/,'') + suffix;
			var keyname = dir +'/'+ filename;
			
			plus.nativeUI.showWaiting('上传中');
			var task = 	plus.uploader.createUpload(host,{
				method: 'POST'
			},function(upload,status){
				if(status == 200 ){
					mui.toast('上传成功');
					defer.resolve(filename);
				}else{
					defer.reject(status);
				}
				
			});
			
			task.addFile(source, {
					key: "file",
					name: keyname,
					mime: "image/jpeg"
				});
			task.start();
		},
		
		// get post signature
		stsUpdate: function(forceUpdate) {
			var defer = Q.defer();
			
//			var mobileP = plus.storage.getItem('mobileP');
//			var cache = plus.storage.getItem(mobileP);
			
//			if (!this.isNullOrUndefined(cache)) {
//				cache = JSON.parse(cache);
//				var storedExpire = cache.sts.expiration;
//				
//				var nowTime = Date.parse(new Date());
//				if (forceUpdate !== true && storedExpire > nowTime) {
//					//console.log('not expired sts');
//					defer.resolve(cache.sts);
//					return defer.promise;
//				}
//			}
//			urlBaseP = plus.storage.getItem('urlBaseP');
//			var url = urlBaseP + '/sts';
			var url = urlBase + '/sts';
			console.log(url)
			this.get(url).then(function(sts) {
				if (sts.StatusCode !== 200) defer.reject(sts.errorCode);
				console.log('sts=' + JSON.stringify(sts));
        
//	            var data = new Object();
//	            data.sts = sts.data;
//	            plus.storage.setItem(mobileP, JSON.stringify(data));
	            defer.resolve(sts);
	            
			}).fail(function(status) {
				console.log('fail to update sts: ' + status);
				plus.nativeUI.closeWaiting();
				mui.toast('上传失败');
				defer.reject(status);
			});
			
			return defer.promise;
		},
		
		// DATA BINDING
		
		bind: function(json) {
			if (typeof(json) === "string") {
				json = JSON.parse(json);
			}
			
			// querySelectorAll("[data-bind]") only return the static node,
			// not the live nodes which generated by render dynamictly
			var matchedElements = [];
			var allElements = document.getElementsByTagName('*');
			for(var i = 0; i < allElements.length; i++) {
				if (allElements[i].getAttribute('data-bind') !== null) {
					matchedElements.push(allElements[i]);
				}
			}
			
			var idx = 0;
			matchedElements.forEach(function(bindedKey) {
				var bindedKey = matchedElements[idx].getAttribute('data-bind');
				//console.log('binded key = ' + bindedKey + ', ' + json[bindedKey] + ', ' + typeof(json[bindedKey]) + ', ' + bindedKey.split(".").length);
				bindedKey = bindedKey.indexOf('|') > 0 ? bindedKey.substring(0, bindedKey.indexOf('|')) : bindedKey;
				var splits = bindedKey.split(".");
				if (splits.length == 1) {
					if (json[bindedKey] != null) {
						var type = typeof(json[bindedKey]);
						if(type !== "undefined" && type !== "function" && type !=="object") {
							if (matchedElements[idx].tagName === 'INPUT')
								matchedElements[idx].value = json[bindedKey];
							else	 // DIV etc
								matchedElements[idx].innerHTML  = json[bindedKey] + '';
						}
					}
				} else if (splits.length == 2) {
					if (json[splits[0]][splits[1]] != null) {
						var type = typeof(json[splits[0]][splits[1]]);
						if(type !== "undefined" && type !== "function" && type !== "object") {
							if (matchedElements[idx].tagName === 'INPUT')
								matchedElements[idx].value = json[splits[0]][splits[1]];
							else	 // DIV etc
								matchedElements[idx].innerHTML  = json[splits[0]][splits[1]] + '';
						}
					}
				}
				
				idx ++;
			})
		},
		serialize: function() {
			
			var Reg = {
				num: /^[0-9]{1,20}$/,		//  /num.(\d+),(\d+)/
				decimal: /^(-?\\d+)(\\.\\d+)?$/,
				mobile: /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/,
				post: /^[a-zA-Z0-9 ]{3,12}$/, //邮编
				ip: /^[0-9.]{1,20}$/,
				password: /^(\w){6,20}$/, // 6-20位
				name: /^[a-zA-Z]{2,10}$/,
				username: /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,20}$/
			};
	
			// querySelectorAll("[data-bind]") only return the static node,
			// not the live nodes which generated by render dynamictly
			var json = new Object();
			var allElements = document.getElementsByTagName('*');
			for(var i = 0; i < allElements.length; i++) {
				var bindedKey = allElements[i].getAttribute('data-bind');
				if (bindedKey !== null) {
					
					var constraint, toast;
					var source = bindedKey.split('|');
					var len = source.length;
					if (len === 1) {
						bindedKey = source[0];
						constraint = null;
						toast = null;
					} else if (len === 2) {
						bindedKey = source[0];
						constraint = source[1];
						toast = '数据不合法';
					} else if (len === 3) {
						bindedKey = source[0];
						constraint = source[1];
						toast = source[2];
					}
					//console.log('### bindedKey=' + bindedKey + ', constraint=' + constraint + ', toast=' + toast);
					
					var splits = bindedKey.split(".");
					if (splits.length == 1) {
						if (allElements[i].tagName === 'INPUT')
							json[bindedKey] = allElements[i].value;
						else	 // DIV etc
							json[bindedKey] = allElements[i].innerHTML;
						
						if (constraint !== undefined && constraint !== null) {
							if (!Reg[constraint].test(json[bindedKey])) {
								mui.toast(toast);
								return null;
							}
						}
						
					} else if (splits.length == 2) {
						if (json[splits[0]] === null || json[splits[0]] === undefined) {
							json[splits[0]] = new Object();
						}
						
						if (allElements[i].tagName === 'INPUT')
							json[splits[0]][splits[1]] = allElements[i].value;
						else
							json[splits[0]][splits[1]] = allElements[i].innerHTML;
							
						if (constraint !== undefined) {
							if (!Reg[constraint].test(json[splits[0]][splits[1]])) {
								mui.toast(toast);
								return null;
							}
						}
					}
					
				}
			}
			//console.log('SERIALIZE=' + JSON.stringify(json));
			return json;
		},

		// TEMPLATE

		//		tpl: function(tplText) {
		//			var id = uuid();
		//			tplId = id;
		//
		//			var js = document.createElement("script");
		//			js.type = 'text/html';
		//			js.id = id;
		//			js.text = tplText;
		//			document.body.appendChild(js);
		//			return this;
		//		},
		//		render: function(selector, json) {
		//			var tplHtml = document.getElementById(tplId).innerHTML;
		//			t(tplHtml).render(json, function(html) {
		//				var dom = document.querySelector(selector);
		//				if(dom == null || dom === undefined) {
		//					console.log('not find the dom: ' + selector);
		//					return;
		//				}
		//				dom.innerHTML = html;
		//			});
		//		},

		render: function(url, json) {
			var defer = Q.defer();
			mui.get(url, function(data) {
				defer.resolve(m.render(data, json));
			});
			return defer.promise;
		},

		// EVENT HANDLER

		// wrap the mui tap event, the selector support .class|tag|#id|p.child|[attr='val'],
		// query selector register all matched element, only H5
		tapHandler: function(selector, url, id, extra, event, stopPropagation, callback) {
			
			var opts = {
				selector: '',
				url: null,
				id: null,
				extra: null,
				stopPropagation: true,
				callback: function(id) {return true;}//,
				//styles: {scalable: false, bounce: ""}		// windowOptions in mui
			}
			
			if (arguments.length === 1) {
				opts = mui.extend(opts, arguments[0]);
			} else {
				opts.id = id;
				opts.selector = selector;
				opts.url = url;
				opts.extra = extra;
				opts.event = event;
				opts.stopPropagation = stopPropagation;
				opts.callback = callback;
				
				if (typeof(extra) === "string") {
					opts.extra = JSON.parse(extra);
				}
			}
			
			//console.log('tapHandler: [' + selector + '][' + url + '][' + id + '][' + extra + ']');
//			console.log('tapHandler: ' + JSON.stringify(opts));
			
			var doms = classSelectorRE.test(opts.selector) ? document.getElementsByClassName(RegExp.$1) : idSelectorRE.test(opts.selector) ? document.getElementById(RegExp.$1) : tagSelectorRE.test(opts.selector) ? document.getElementsByTagName(opts.selector) : document.querySelectorAll(opts.selector);
			if(doms === undefined || doms === null) {
				//console.log('not find the dom: ' + selector);
				return;
			}
			
			var handler = function(trigger) {
				if (opts.stopPropagation) trigger.stopPropagation();
				__tapHandler(opts.url, opts.id, opts.extra, trigger, opts.event, opts.callback, opts.styles);
			};
			
			// getElementById, getElementsByClassName return object w/ len=1, getElementById return objectt w/o length
			//console.log('doms=' + JSON.stringify(doms));
			if (typeof(doms) === "object" && (typeof(doms.length) === "undefined" /*|| doms.length == 0*/)) {
				doms.removeEventListener('tap', handler); //avoid to registering duplicated
				doms.addEventListener('tap', handler);
			} else {
				for(var i = 0; i < doms.length; i++) {
					doms[i].removeEventListener('tap', handler);
					doms[i].addEventListener('tap', handler);
				}
			}
		},
		receiveHandler: function(callback, event) {
			console.log('receiveHandler: [' + event + ']');
			if (event !== undefined) {
				window.addEventListener(event, function(event) {
					//console.log('receive: [' + event + '][' + event.detail.id + '][' + JSON.stringify(event.detail.extra) + ']');
					callback(event.detail.id, event.detail.extra);
				});
			} else {
				window.addEventListener('receiver', function(event) {
					//console.log('receive: [receiver][' + event.detail.id + '][' + JSON.stringify(event.detail.extra) + ']');
					callback(event.detail.id, event.detail.extra);
				});
			}
		}
	}
});