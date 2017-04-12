/*!
 * Lightings v2.0.1
 * Copyright (c) 2017 Jay Zangwill
 */
'use strict';
(function() {
	function Lightings() {
		this.xhr = new XMLHttpRequest();
		this.isIe9 = navigator.userAgent.indexOf('MSIE 9.0') > 0;
	}
	Lightings.prototype = {
		constructor: Lightings,
		get(url, data, options) {
			init.call(this, url, data, options);
			return promise('get', this);
		},
		post(url, data, options) {
			init.call(this, url, data, options);
			return promise('post', this);
		},
		jsonp(url, data, options) {
			let self = this,
				script = document.createElement('script'),
				random = '' + Math.random() + Math.random();
			return new Promise(function(resolve, reject) {
				try {
					init.call(self, url, data, options, true);
					random = random.replace(/0\./g, '_');
					script.src = self.data ?
						`${self.url}?${self.callbackName}=Lightings${random}&${self.data}` :
						`${self.url}?${self.callbackName}=Lightings${random}`;
					document.body.appendChild(script);
					window['Lightings' + random] = resolve;
					document.body.removeChild(script);
				} catch(e) {
					reject(e);
				}
			});
		}
	}

	function isObject(obj) {
		return obj.toString() === '[object Object]';
	}

	function formate(data) {
		let temp = [];
		for(let key in data) {
			temp.push(`${key}=${data[key]}`);
		}
		data = temp.join('&');
		return data;
	}

	function init(url, data, options, jsonp) {
		if(typeof url === 'string') {
			this.url = url;
		} else {
			throw Error('url is no define or illegal');
		}
		if(typeof data === 'string') {
			this.data = data;
			this.options = options;
		} else if(data && typeof data === 'object' && typeof optoins === 'undefined' && data.config) { // 如果用户不传data直接传options
			options = {};
			for(let key in data) {
				options[key] = data[key];
			}
			data = undefined;
		} else if(data && isObject(data)) {
			this.data = formate(data);
		}
		if(jsonp) {
			this.callbackName = (options && options.callbackName) || 'callback';
			return;
		}
		this.el = options && options.el;
		//this.flag用于判断是不是xml
		this.flag = this.dataType = (options && options.dataType) || 'json';
		this.async = (options && options.async === false) || true;
		this.contentType = (options && options.contentType) || 'application/x-www-form-urlencoded; charset=UTF-8';
		this.timeout = (options && options.timeout) || 0;
		this.progress = options && options.progress;
		if(this.dataType === 'xml' || this.dataType === 'html') {
			this.dataType = '';
		}
	}

	function promise(method, context) {
		let timer;

		return new Promise((resolve, reject) => {
			context.xhr.responseType = context.dataType.toLowerCase();
			if(method === 'get') {
				//如果是get请求，如果有数据，则吧数据添加在连接上发送到服务端
				let url = context.url;
				if(context.data) {
					url += `?${context.data}`;
				}
				context.xhr.open(method, url, context.async);
				context.xhr.send(null);
			} else if(method === 'post') {
				//如果是post请求需要设置请求头，并且把数据作为send的参数
				context.xhr.open(method, context.url, context.async);
				context.xhr.setRequestHeader('Content-type', context.contentType);
				context.xhr.send(context.data);
			}
			context.xhr.onreadystatechange = function() {
				if(this.readyState === 4) {
					if(this.status >= 200 && this.status < 300 || this.status === 304) {
						if(context.flag === 'xml') {
							resolve(this.responseXML);
						} else if(context.isIe9) {
							resolve(JSON.parse(this.responseText));
							compile.call(context, JSON.parse(this.responseText));
						} else {
							resolve(this.response);
							compile.call(context, this.response);
						}
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
					reject('timeout');
				}, context.timeout);
			}
			context.xhr.onprogress = function(e) {
				context.progress && context.progress.call(this, e);
			}
		});
	}

	// 模板渲染
	function compile(data) {
		let dom = document.querySelector(this.el),
			key,
			variable = data,
			result,
			childs,
			text,
			first = true,
			fragment = document.createDocumentFragment(),
			brace = /{{(.+?)}}/g;

		if(this.el && dom && this.dataType === 'json') {
			if(typeof dom === 'undefined') {
				throw Error(`Cannot find element: ${this.el}`);
			}
			if(dom.nodeName.toLowerCase() === 'body' || dom.nodeName.toLowerCase() === 'html') {
				throw Error('Do not mount Lightings to <html> or <body> - mount to normal elements instead.');
			}
			while(dom.firstChild) {
				fragment.appendChild(dom.firstChild);
			}
			childs = fragment.childNodes;
			Array.prototype.slice.call(childs).forEach((node) => {
				first = true;
				result = '';
				text = node.textContent;
				while(brace.test(text)) {
					variable = data;
					key = RegExp.$1.trim().split('.');
					key.forEach((item) => {
						variable = variable[item];
					});

					// 让模板能正确解析
					if(first) {
						result = text.replace(/{{.+?}}/, variable);
						first = false;
					} else {
						result = result.replace(/{{.+?}}/, variable);
					}
				}
				node.textContent = result;
			});
			dom.appendChild(fragment);
		}
	}
	window.lightings = new Lightings();
})();