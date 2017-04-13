# Lightings
[中文文档](https://github.com/JayZangwill/lightings/blob/master/doc/README-zh.md) | [English](https://github.com/JayZangwill/lightings/blob/master/README.md)

一个基于es6 `Promise`的轻量级ajax框架，支持模板渲染。

## 安装

npm install lightings

## 目录结构：

	lightings
		|---src
		|    |---lightings.js (es6 源码)
		|    |---promise.js (让低版本浏览器支持 Promise)
		|
		|---dist
	     	     |---lightings.js (使用bable编译后的es5源码)
		     |---lightings.min.js
		 
**提示**：如果您的浏览器支持es6语法可直接使用 **src** 目录下的es6源码。

## 使用例子

**提示**：例子的json数据统一使用：
```
{
	"name": "Lightings",
	"author": {
		"firstName": "Jay",
		"lastName": "Zangwill"
	}
}
```
执行get请求（使用模板渲染）
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

执行get请求（不使用模板渲染）
```
lightings.get('test.json')
	.then(function(data){
		console.log(data);
		//dom operation and other operation
	}).catch(function(error){
		console.log(error);
	});
```

执行跨域请求
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

**注意**：
1. 当使用options作为第二个参数的时候需要传入一个`config:true`属性，例如：
```
lightings.get('test.json',{
	config:true,
	...
});
```

2. jsonp不支持，模板渲染、`timeout`、`progress`

## 参数options（可配置项）
1. el：用于模板渲染时lightings的挂载元素。（仅在数据格式为json支持get、post）
2. dataType：服务端数据的返回格式。默认为json，可选值：json，xml，html，text。
3. async: 是否异步。默认异步。
4. contentType： 请求头。（仅支持post请求）
5. timeout： 超时时间。默认0。（即不设置超时）
6. progress：在ajax发送请求过程中进行的函数。
## 更新日志
### 2017 3.15 v1.1.0

1. 添加`timeout`配置项。(jsonp暂不支持timeout)
3. 添加`progress`配置项。(jsonp暂不支持timeout)

### 2017 3.27 v1.2.0

修正低版本浏览器`Promise`函数

### 2017 4.5 v1.3.0

1. 修正在ie9下报错bug
2. 支持模板渲染(jsonp暂不支持)

### 2017 4.7 v2.0.0

修改lighting api，废除一些过时的配置方式

### 2017 4.7 v2.0.1

优化模板渲染

### 2017 4.13 v2.0.2

1. 修正async无法设置为false的问题
2. 修正async设置为false时无法获取数据的问题