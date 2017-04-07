/*!
 * Lightings v2.0.0
 * Copyright (c) 2017 Jay Zangwill
 */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
	function Lightings() {
		this.xhr = new XMLHttpRequest();
		this.isIe9 = navigator.userAgent.indexOf('MSIE 9.0') > 0;
	}
	Lightings.prototype = {
		constructor: Lightings,
		get: function get(url, data, options) {
			init.call(this, url, data, options);
			return promise('get', this);
		},
		post: function post(url, data, options) {
			init.call(this, url, data, options);
			return promise('post', this);
		},
		jsonp: function jsonp(url, data, options) {
			var self = this,
			    script = document.createElement('script'),
			    random = '' + Math.random() + Math.random();
			return new Promise(function (resolve, reject) {
				try {
					init.call(self, url, data, options, true);
					random = random.replace(/0\./g, '_');
					script.src = self.data ? self.url + '?' + self.callbackName + '=Lightings' + random + '&' + self.data : self.url + '?' + self.callbackName + '=Lightings' + random;
					document.body.appendChild(script);
					window['Lightings' + random] = resolve;
					document.body.removeChild(script);
				} catch (e) {
					reject(e);
				}
			});
		}
	};

	function isObject(obj) {
		return obj.toString() === '[object Object]';
	}

	function formate(data) {
		var temp = [];
		for (var key in data) {
			temp.push(key + '=' + data[key]);
		}
		data = temp.join('&');
		return data;
	}

	function init(url, data, options, jsonp) {
		if (typeof url === 'string') {
			this.url = url;
		} else {
			throw Error('url is no define or illegal');
		}
		if (typeof data === 'string') {
			this.data = data;
			this.options = options;
		} else if (data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && typeof optoins === 'undefined' && data.config) {
			// 如果用户不传data直接传options
			options = {};
			for (var key in data) {
				options[key] = data[key];
			}
			data = undefined;
		} else if (data && isObject(data)) {
			this.data = formate(data);
		}
		if (jsonp) {
			this.callbackName = options && options.callbackName || 'callback';
			return;
		}
		this.el = options && options.el;
		//this.flag用于判断是不是xml
		this.flag = this.dataType = options && options.dataType || 'json';
		this.async = options && options.async === false || true;
		this.contentType = options && options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8';
		this.timeout = options && options.timeout || 0;
		this.progress = options && options.progress;
		if (this.dataType === 'xml' || this.dataType === 'html') {
			this.dataType = '';
		}
	}

	function promise(method, context) {
		var timer = void 0;

		return new Promise(function (resolve, reject) {
			context.xhr.responseType = context.dataType.toLowerCase();
			if (method === 'get') {
				//如果是get请求，如果有数据，则吧数据添加在连接上发送到服务端
				var url = context.url;
				if (context.data) {
					url += '?' + context.data;
				}
				context.xhr.open(method, url, context.async);
				context.xhr.send(null);
			} else if (method === 'post') {
				//如果是post请求需要设置请求头，并且把数据作为send的参数
				context.xhr.open(method, context.url, context.async);
				context.xhr.setRequestHeader('Content-type', context.contentType);
				context.xhr.send(context.data);
			}
			context.xhr.onreadystatechange = function () {
				if (this.readyState === 4) {
					if (this.status >= 200 && this.status < 300 || this.status === 304) {
						if (context.flag === 'xml') {
							resolve(this.responseXML);
						} else if (context.isIe9) {
							resolve(JSON.parse(this.responseText));
							echo.call(context, JSON.parse(this.responseText));
						} else {
							resolve(this.response);
							echo.call(context, this.response);
						}
						if (timer) {
							clearTimeout(timer);
						}
					} else {
						reject(this.status, this.statusText);
					}
				}
			};
			if (context.async && context.timeout > 0) {
				timer = setTimeout(function () {
					context.xhr.abort();
					reject('timeout');
				}, context.timeout);
			}
			context.xhr.onprogress = function (e) {
				context.progress && context.progress.call(this, e);
			};
		});
	}

	// 模板渲染
	function echo(data) {
		var _this = this;

		if (this.el && document.querySelectorAll(this.el)[0] && this.dataType === 'json') {
			(function () {
				var dom = document.querySelectorAll(_this.el)[0],
				    content = dom.innerHTML,
				    key = void 0,
				    variable = data,
				    result = void 0,
				    first = true,
				    brace = /{{(.+?)}}/g;
				if (typeof dom === 'undefined') {
					throw Error('Cannot find element: ' + _this.el);
				}
				if (dom.nodeName.toLowerCase() === 'body' || dom.nodeName.toLowerCase() === 'html') {
					throw Error('Do not mount Lightings to <html> or <body> - mount to normal elements instead.');
				}
				while (brace.exec(content)) {
					variable = data;
					key = RegExp.$1.split('.');
					key.forEach(function (item) {
						variable = variable[item];
					});

					// 让模板能正确解析
					if (first) {
						result = content.replace(/{{.+?}}/, variable);
						first = false;
					} else {
						result = result.replace(/{{.+?}}/, variable);
					}
				}
				if (result) {
					dom.innerHTML = result;
				}
			})();
		}
	}
	window.lightings = new Lightings();
})();
if (!window.Promise) {
	var _Promise = function _Promise(fn) {
		var self = this;
		this.status = 'pending';
		this.thenCache = [];
		if (!(this instanceof _Promise)) {
			throw 'Defer is a constructor and should be called width "new" keyword';
		}
		if (typeof fn !== 'function') {
			throw 'Defer params must be a function';
		}
		//为了让传进来的函数在then后执行
		setTimeout(function () {
			try {
				fn.call(this, self.resolve.bind(self), self.reject.bind(self));
			} catch (e) {
				self.reject(e);
			}
		}, 0);
	};

	_Promise.prototype.resolve = function (value) {
		this.value = value;
		this.status = 'resolved';
		this.triggerThen();
	};
	_Promise.prototype.reject = function (reason) {
		this.value = reason;
		this.status = 'rejected';
		this.triggerThen();
	};
	_Promise.prototype.then = function (onResolve, onReject) {
		this.thenCache.push({ onResolve: onResolve, onReject: onReject });
		return this;
	};
	_Promise.prototype.catch = function (fn) {
		if (typeof fn === 'function') {
			this.errorHandle = fn;
		}
	};
	_Promise.prototype.triggerThen = function () {
		var current = this.thenCache.shift(),
		    res;
		if (!current && this.status === 'resolved') {
			return this;
		} else if (!current && this.status === 'rejected') {
			if (this.errorHandle) {
				this.value = this.errorHandle.call(undefined, this.value);
				this.status = 'resolved';
			}
			return this;
		};
		if (this.status === 'resolved') {
			res = current.onResolve;
		} else if (this.status === 'rejected') {
			res = current.onReject;
		}
		if (typeof res === "function") {
			try {
				this.value = res.call(undefined, this.value);
				this.status = 'resolved';
				this.triggerThen();
			} catch (e) {
				this.status = 'rejected';
				this.value = e;
				return this.triggerThen();
			}
		} else {
			this.triggerThen();
		}
	};
	window.Promise = _Promise;
}