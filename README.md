# Lightings

A lightweight Ajax framework based on ES6 `Promise`.

## Fast use

1. install： `npm install lightings`
2. configure：

```javascript
	Lightings({
		url:"http://www.example.com",
		success:function(data){
			console.log(data);
		}
	})
```

## Directory structure：

	lightings
		|---src
		|    |---lightings.js (es6 source)
		|
		|---dist
	     	|---lightings.js (use bable compiler source code es5)
		 	|---lightings.min.js
		 
**tip：**If your browser supports ES6 syntax can be directly used in the **src** directory of the ES6 source code.

## Configuration parameter

<table>
	<tr>
		<th>parameter</th>
		<th>explain</th>
		<th>default value</th>
		<th>possible value</th>
		<th>remarks</th>
	</tr>
	<tr>
		<td>
			url
		</td>
		<td>
			requested data address
		</td>
		<td>
			undefined
		</td>
		<td>
			user define
		</td>
		<td>
			must
		</td>
	</tr>
	<tr>
		<td>
			success
		</td>
		<td>
			a function called after the request data is successful
		</td>
		<td>
			undefined
		</td>
		<td>
			user define
		</td>
		<td>
			must
		</td>
	</tr>
	<tr>
		<td>
			error
		</td>
		<td>
			A function called after the request data failed
		</td>
		<td>
			undefined
		</td>
		<td>
			user define
		</td>
		<td>
			depending on the user's situation
		</td>
	</tr>
	<tr>
		<td>
			data
		</td>
		<td>
			data sent to server
		</td>
		<td>
			undefined
		</td>
		<td>
			user define
		</td>
		<td>
			must not
		</td>
	</tr>
	<tr>
		<td>
			dataType
		</td>
		<td>
			data return format
		</td>
		<td>
			json
		</td>
		<td>
			json | jsonp | html | xml | text
		</td>
		<td>
			must not
		</td>
	</tr>
	<tr>
		<td>
			contentType
		</td>
		<td>
			request header
		</td>
		<td>
			"application/x-www-form-urlencoded"
		</td>
		<td>
			"application/x-www-form-urlencoded" | user define
		</td>
		<td>
			must not
		</td>
	</tr>
	<tr>
		<td>
			async
		</td>
		<td>
			asynchronous request
		</td>
		<td>
			true
		</td>
		<td>
			true | false
		</td>
		<td>
			must not
		</td>
	</tr>
	<tr>
		<td>
			callbackName
		</td>
		<td>
			when dataType is set to jsonp, the callback function name returned by the server
		</td>
		<td>
			callback
		</td>
		<td>
			callback | user define
		</td>
		<td>
			when dataTpye is jsonp and the callback function name returned by the server is not callback
		</td>
	</tr>
</table>

**tip：**If the `dataType` is set to `jsonp`, only support the `get` request.