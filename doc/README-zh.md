# Lightings
[中文文档](https://github.com/JayZangwill/lightings/blob/master/doc/README-zh.md) | [English](https://github.com/JayZangwill/lightings/blob/master/README.md)

一个基于es6 `Promise`的轻量级ajax框架。

## 快速使用

1. 安装： `npm install lightings`
2. 配置：

```javascript
	Lightings({
		url:"http://www.example.com",
		success:function(data){
			console.log(data);
		}
	})
```

## 目录结构：

	lightings
		|---src
		|    |---lightings.js (es6源码)
		|    |---promise.js (低版本浏览器支持Promise)
		|
		|---dist
	     	     |---lightings.js (使用bable编译后的源码es5)
		     |---lightings.min.js
		 
**tip**如果您的浏览器支持es6语法可以直接用src目录里的es6源码。

## 配置参数

<table>
	<tr>
		<th>参数</th>
		<th>说明</th>
		<th>默认值</th>
		<th>可能值</th>
		<th>备注</th>
	</tr>
	<tr>
		<td>
			url
		</td>
		<td>
			请求数据的地址
		</td>
		<td>
			undefined
		</td>
		<td>
			由用户定义
		</td>
		<td>
			必须
		</td>
	</tr>
	<tr>
		<td>
			success
		</td>
		<td>
			请求数据成功后调用的函数
		</td>
		<td>
			undefined
		</td>
		<td>
			由用户定义
		</td>
		<td>
			必须
		</td>
	</tr>
	<tr>
		<td>
			error
		</td>
		<td>
			请求数据失败后调用的函数
		</td>
		<td>
			undefined
		</td>
		<td>
			由用户定义
		</td>
		<td>
			视用户的情况而定
		</td>
	</tr>
	<tr>
		<td>
			data
		</td>
		<td>
			连同请求一起发送到后台的数据
		</td>
		<td>
			undefined
		</td>
		<td>
			由用户定义(可以传对象，例如:{dataKey:data})
		</td>
		<td>
			非必须
		</td>
	</tr>
	<tr>
		<td>
			dataType
		</td>
		<td>
			数据返回的格式
		</td>
		<td>
			json
		</td>
		<td>
			json | jsonp | html | xml | text
		</td>
		<td>
			非必须
		</td>
	</tr>
	<tr>
		<td>
			contentType
		</td>
		<td>
			请求头
		</td>
		<td>
			"application/x-www-form-urlencoded"
		</td>
		<td>
			"application/x-www-form-urlencoded" | 用户定义
		</td>
		<td>
			非必须
		</td>
	</tr>
	<tr>
		<td>
			async
		</td>
		<td>
			是否异步请求
		</td>
		<td>
			true
		</td>
		<td>
			true | false
		</td>
		<td>
			非必须
		</td>
	</tr>
	<tr>
		<td>
			callbackName
		</td>
		<td>
			设置dataType为jsonp时，服务端返回的回调函数名
		</td>
		<td>
			callback
		</td>
		<td>
			callback | 用户定义
		</td>
		<td>
			dataTpye为jsonp时且服务端返回的回调函数名不为callback时必须
		</td>
	</tr>
	<tr>
		<td>
			timeout
		</td>
		<td>
			设置ajax的超时时长
		</td>
		<td>
			0
		</td>
		<td>
			 用户定义
		</td>
		<td>
			jsonp暂时不支持timeout
		</td>
	</tr>
	<tr>
		<td>
			start
		</td>
		<td>
			设置ajax请求发送前的回调函数，相当于`onloadstart`
		</td>
		<td>
			undefined
		</td>
		<td>
			 用户定义
		</td>
		<td>
			jsonp暂时不支持start
		</td>
	</tr>
	<tr>
		<td>
			progress
		</td>
		<td>
			设置ajax请求发中的回调函数，相当于`onprogress`
		</td>
		<td>
			undefined
		</td>
		<td>
			 用户定义
		</td>
		<td>
			jsonp暂时不支持progress，且ie10一下浏览器不能用
		</td>
	</tr>
</table>

**tip**如果设置了`dataType`为`jsonp`的话只支持`get`请求

## 更新日志

### 2017 3.15 v1.1.0

1. 添加`timeout`配置项。(jsonp暂不支持timeout)
2. 添加`start`配置项。(jsonp暂不支持timeout)
3. 添加`progress`配置项。(jsonp暂不支持timeout)

### 2017 3.27 v1.2.0

修正低版本浏览器`Promise`函数
