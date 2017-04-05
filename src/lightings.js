/*!
 * Lightings v1.3.0
 * 2017 by Jay Zangwill
 */
'use strict';
(function() {
	function Lightings(options) {
		return new Lightings.prototype.init(options);
	}
	Lightings.prototype = {
		constructor: Lightings,
		init: function(options) {
			this.el = options.el;
			this.url = options.url;
			this.success = options.success;
			this.error = options.error;
			this.start = options.start;
			this.progress = options.progress;
			this.timeout = options.timeout || 0;
			this.type = options.type || "get";
			//this.flag用于判断返回值
			this.flag = this.dataType = options.dataType || "json";
			this.contentType = options.contentType || "application/x-www-form-urlencoded; charset=UTF-8";
			this.data = options.data || null;
			this.callbackName = options.callbackName || "callback";
			this.async = options.async || true;
			this.xhr = new XMLHttpRequest();
			this.isIe9 = navigator.userAgent.indexOf("MSIE 9.0") > 0;
			if(!this.url) {
				throw Error("url is not defined");
			}
			if(this.dataType === "xml" || this.dataType === "html") {
				this.dataType = "";
			}
			if(typeof this.async !== "boolean") {
				this.async = true;
			}
			//data格式化
			if(this.data && this.data.toString() === "[object Object]") {
				let temp = [];
				for(let key in this.data) {
					temp.push(`${key}=${this.data[key]}`);
				}
				this.data = temp.join("&");
			} else if(typeof this.data !== "string") {
				this.data = undefined;
			}
			//jsonp
			if(this.dataType === "jsonp") {
				let script = document.createElement("script"),
					random = "" + Math.random() + Math.random(),
					time;
				random = random.replace(/0\./g, "_");
				script.src = this.data ?
					`${this.url}?${this.callbackName}=Lightings${random}&${this.data}` :
					`${this.url}?${this.callbackName}=Lightings${random}`;
				document.body.appendChild(script);
				if(this.success && typeof this.success === "function") {
					window["Lightings" + random] = this.success;
				}
				document.body.removeChild(script);
				//如果是用户使jsonp就不走ajax请求了直接return
				return this;
			}
			//调用get请求
			if(this.type === "get") {
				this.get().then((data) => {
					_echo(data, this);
					this.success && this.success.call(this, data);
				}).catch((err) => {
					this.error && this.error.call(this, err);
				});
			}
			//调用post请求
			if(this.type === "post") {
				this.post().then((data) => {
					_echo(data, this);
					this.success && this.success.call(this, data);
				}).catch((err) => {
					this.error && this.error.call(this, err);
				});
			}
			return this;
		},
		//get请求
		get() {
			return _promise("get", this);
		},
		//post请求
		post() {
			return _promise("post", this);
		}
	}
	Lightings.prototype.init.prototype = Lightings.prototype;

	function _promise(method, context) {
		let timer;

		return new Promise((resolve, reject) => {
			context.xhr.responseType = context.dataType.toLowerCase();
			if(method === "get") {
				//如果是get请求，如果有数据，则吧数据添加在连接上发送到服务端
				let url = context.url;
				if(context.data) {
					url += `?${context.data}`;
				}
				context.xhr.open(context.type, url, context.async);
				context.xhr.send(null);
			} else if(method === "post") {
				//如果是post请求需要设置请求头，并且把数据作为send的参数
				context.xhr.open(context.type, context.url, context.async);
				context.xhr.setRequestHeader("Content-type", context.contentType);
				context.xhr.send(context.data);
			}
			context.xhr.onreadystatechange = function() {
				if(this.readyState === 4) {
					if(this.status >= 200 && this.status < 300 || this.status === 304) {
						context.flag === "xml" ?
							resolve(this.responseXML) :
							context.isIe9 ?
							resolve(JSON.parse(this.responseText)) :
							resolve(this.response);
						if(timer) {
							clearTimeout(timer)
						}
					} else {
						reject(this.status, this.statusText);
					}
				}
			}
			if(context.async && context.timeout > 0) {
				timer = setTimeout(() => {
					context.xhr.abort();
					reject("timeout");
				}, context.timeout);
			}
			context.xhr.onloadstart = function(e) {
				context.start && context.start.call(this, e);
			}
			context.xhr.onprogress = function(e) {
				context.progress && context.progress.call(this, e);
			}
		});
	}

	// 模板渲染
	function _echo(data, context) {
		if(context.el) {
			let dom = document.querySelectorAll(context.el)[0],
				content = dom.innerHTML,
				key,
				variable = data,
				result,
				first = true,
				brace = /{{(.+?)}}/g;
			if(typeof dom === "undefined") {
				throw Error(`Cannot find element: ${context.el}`);
			}
			if(dom.nodeName.toLowerCase() === "body" || dom.nodeName.toLowerCase() === "html") {
				throw Error("Do not mount Lightings to <html> or <body> - mount to normal elements instead.");
			}
			while(brace.exec(content)) {
				variable = data;
				key = RegExp.$1.split(".");
				key.forEach((item) => {
					variable = variable[item];
				});

				// 让模板能正确解析
				if(first) {
					result = content.replace(/{{.+?}}/, variable);
					first = false;
				} else {
					result = result.replace(/{{.+?}}/, variable);
				}
			}
			if(result) {
				dom.innerHTML = result;
			}
		}
	}
	window.Lightings = Lightings;
})();