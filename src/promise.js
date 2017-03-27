if(!window.Promise) {
	function Promise(fn) {
		var self=this;
		this.status = 'pending';
		this.thenCache = [];
		if(!(this instanceof Promise)) {
			throw 'Defer is a constructor and should be called width "new" keyword';
		}
		if(typeof fn !== 'function') {
			throw 'Defer params must be a function';
		}
		//为了让传进来的函数在then后执行
		setTimeout(function() {
			try {
				fn.call(this, self.resolve.bind(self), self.reject.bind(self))
			} catch(e) {
				self.reject(e);
			}
		}, 0);
	}
	Promise.prototype.resolve = function(value) {
		this.value = value;
		this.status = 'resolved';
		this.triggerThen();
	}
	Promise.prototype.reject = function(reason) {
		this.value = reason;
		this.status = 'rejected';
		this.triggerThen();
	}
	Promise.prototype.then = function(onResolve, onReject) {
		this.thenCache.push({ onResolve: onResolve, onReject: onReject });
		return this;
	}
	Promise.prototype.catch = function(fn) {
		if(typeof fn === 'function') {
			this.errorHandle = fn;
		}
	};
	Promise.prototype.triggerThen = function() {
		var current = this.thenCache.shift(),
			res;
		if(!current && this.status === 'resolved') {
			return this;
		} else if(!current && this.status === 'rejected') {
			if(this.errorHandle) {
				this.value = this.errorHandle.call(undefined, this.value);
				this.status = 'resolved';
			}
			return this;
		};
		if(this.status === 'resolved') {
			res = current.onResolve;
		} else if(this.status === 'rejected') {
			res = current.onReject;
		}
		if(typeof res === "function") {
			try {
				this.value = res.call(undefined, this.value);
				this.status = 'resolved';
				this.triggerThen();
			} catch(e) {
				this.status = 'rejected';
				this.value = e;
				return this.triggerThen();
			}
		} else {
			this.triggerThen();
		}
	}
	window.Promise=Promise;
}