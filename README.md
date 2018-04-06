# Lightings
[中文文档](https://github.com/JayZangwill/lightings/blob/master/doc/README-zh.md) | [English](https://github.com/JayZangwill/lightings/blob/master/README.md)

A lightweight Ajax framework based on ES6 `Promise`, support for template rendering.

## Installing

 `npm install lightings`

## Directory structure：

	lightings
		|---src
		|    |---lightings.js (es6 source)
		|    |---promise.js (low browser support Promise)
		|
		|---dist
	     	     |---lightings.js (use bable compiler source code es5)
		     |---lightings.min.js
		 
**tip**:If your browser supports ES6 syntax can be directly used in the **src** directory of the ES6 source code.

## Example

**tip**:Examples of uniform use of JSON data:
```
{
	"name": "Lightings",
	"author": {
		"firstName": "Jay",
		"lastName": "Zangwill"
	}
}
```
Performing a GET request(using template rendering)
```
lightings.get('test.json',{
	config: true,
	el: '#app'
}).then(function(data){
		console.log(data);
		//other operation
}).catch(function(error){
	console.log(error);
});
```

```
<!-- html -->
<div id="app">
	<p>author: {{author.firstName}} {{author.lastName}}</p>
	<p>name: {{name}}</p>
</div>
```
Performing a GET request(do not use template rendering)
```
lightings.get('test.json')
	.then(function(data){
		console.log(data);
		//dom operation and other operation
	}).catch(function(error){
		console.log(error);
	});
```
Cross domain request
```
lightings.jsonp('http://jayzangwill.cn/test.json')
	.then(function(data){
		console.log(data);
		//dom operation and other operation
	}).catch(function(error){
		console.log(error);
	});
```

## lightings API
**lightings.get(url[,data,[options]])**

**lightings.post(url[,data,[options]])**

**lightings.jsonp(url[,data,[options]])**

**NOTE**：
1. When using options as the second argument, you need to pass a `config:true` property, such as
```
lightings.get('test.json',{
	config:true,
	...
});
```
2. jsonp does not support template rendering, `timeout`, `progress`

## parameter `options`（configurable item）
1. el：lightings mount elements for template rendering.(Only in the data format for JSON support get, post)
2. dataType：server data return format,default is JSON, optional value: JSON,XML, HTML, text.
3. async: whether asynchronous.default asynchronous.
4. contentType： request header.（only support post requests）
5. timeout： timeout. default 0 (no timeout is set)
6. progress：a function in the process of sending a request to the Ajax

## Update log

### 2017 3.15 v1.1.0

1. Add `timeout` configuration item. (jsonp does not support timeout)
2. Add `progress` configuration item. (jsonp does not support timeout)

### 2017 3.27 v1.2.0

Fixed low browser `Promise` function

### 2017 4.5 v1.3.0

1. Fixed a bug in IE9 under bug
2. Support template rendering(jsonp does not support)

### 2017 4.7 v2.0.0

modify lightings API, abolish some outdated configuration

### 2017 4.7 v2.0.1

optimized template rendering

### 2017 4.13 v2.0.2

1. Fixed issue where async could not be set to false
2. Fixed issue with false unable to get data when set to Async

### 2018 4.06 V2.0.3
1. Fixe some bug