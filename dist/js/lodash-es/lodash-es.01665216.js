const t="object"==typeof global&&global&&global.Object===Object&&global;var r="object"==typeof self&&self&&self.Object===Object&&self;const n=t||r||Function("return this")();const e=n.Symbol;var o=Object.prototype,i=o.hasOwnProperty,a=o.toString,u=e?e.toStringTag:void 0;var c=Object.prototype.toString;var s="[object Null]",f="[object Undefined]",l=e?e.toStringTag:void 0;function p(t){return null==t?void 0===t?f:s:l&&l in Object(t)?function(t){var r=i.call(t,u),n=t[u];try{t[u]=void 0;var e=!0}catch(c){}var o=a.call(t);return e&&(r?t[u]=n:delete t[u]),o}(t):function(t){return c.call(t)}(t)}var v="[object Symbol]";function h(t){return"symbol"==typeof t||function(t){return null!=t&&"object"==typeof t}(t)&&p(t)==v}const _=Array.isArray;var y=1/0,d=e?e.prototype:void 0,g=d?d.toString:void 0;function b(t){if("string"==typeof t)return t;if(_(t))return function(t,r){for(var n=-1,e=null==t?0:t.length,o=Array(e);++n<e;)o[n]=r(t[n],n,t);return o}(t,b)+"";if(h(t))return g?g.call(t):"";var r=t+"";return"0"==r&&1/t==-y?"-0":r}var j=/\s/;var m=/^\s+/;function O(t){return t?t.slice(0,function(t){for(var r=t.length;r--&&j.test(t.charAt(r)););return r}(t)+1).replace(m,""):t}function w(t){var r=typeof t;return null!=t&&("object"==r||"function"==r)}var x=NaN,z=/^[-+]0x[0-9a-f]+$/i,T=/^0b[01]+$/i,$=/^0o[0-7]+$/i,S=parseInt;function E(t){if("number"==typeof t)return t;if(h(t))return x;if(w(t)){var r="function"==typeof t.valueOf?t.valueOf():t;t=w(r)?r+"":r}if("string"!=typeof t)return 0===t?t:+t;t=O(t);var n=T.test(t);return n||$.test(t)?S(t.slice(2),n?2:8):z.test(t)?x:+t}var A="[object AsyncFunction]",P="[object Function]",F="[object GeneratorFunction]",C="[object Proxy]";const M=n["__core-js_shared__"];var N,W=(N=/[^.]+$/.exec(M&&M.keys&&M.keys.IE_PROTO||""))?"Symbol(src)_1."+N:"";var k=Function.prototype.toString;var I=/^\[object .+?Constructor\]$/,R=Function.prototype,D=Object.prototype,G=R.toString,U=D.hasOwnProperty,q=RegExp("^"+G.call(U).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function B(t){if(!w(t)||(r=t,W&&W in r))return!1;var r,n=function(t){if(!w(t))return!1;var r=p(t);return r==P||r==F||r==A||r==C}(t)?q:I;return n.test(function(t){if(null!=t){try{return k.call(t)}catch(r){}try{return t+""}catch(r){}}return""}(t))}function H(t,r){var n=function(t,r){return null==t?void 0:t[r]}(t,r);return B(n)?n:void 0}var J=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,K=/^\w*$/;const L=H(Object,"create");var Q=Object.prototype.hasOwnProperty;var V=Object.prototype.hasOwnProperty;function X(t){var r=-1,n=null==t?0:t.length;for(this.clear();++r<n;){var e=t[r];this.set(e[0],e[1])}}function Y(t,r){for(var n,e,o=t.length;o--;)if((n=t[o][0])===(e=r)||n!=n&&e!=e)return o;return-1}X.prototype.clear=function(){this.__data__=L?L(null):{},this.size=0},X.prototype.delete=function(t){var r=this.has(t)&&delete this.__data__[t];return this.size-=r?1:0,r},X.prototype.get=function(t){var r=this.__data__;if(L){var n=r[t];return"__lodash_hash_undefined__"===n?void 0:n}return Q.call(r,t)?r[t]:void 0},X.prototype.has=function(t){var r=this.__data__;return L?void 0!==r[t]:V.call(r,t)},X.prototype.set=function(t,r){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=L&&void 0===r?"__lodash_hash_undefined__":r,this};var Z=Array.prototype.splice;function tt(t){var r=-1,n=null==t?0:t.length;for(this.clear();++r<n;){var e=t[r];this.set(e[0],e[1])}}tt.prototype.clear=function(){this.__data__=[],this.size=0},tt.prototype.delete=function(t){var r=this.__data__,n=Y(r,t);return!(n<0)&&(n==r.length-1?r.pop():Z.call(r,n,1),--this.size,!0)},tt.prototype.get=function(t){var r=this.__data__,n=Y(r,t);return n<0?void 0:r[n][1]},tt.prototype.has=function(t){return Y(this.__data__,t)>-1},tt.prototype.set=function(t,r){var n=this.__data__,e=Y(n,t);return e<0?(++this.size,n.push([t,r])):n[e][1]=r,this};const rt=H(n,"Map");function nt(t,r){var n,e,o=t.__data__;return("string"==(e=typeof(n=r))||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==n:null===n)?o["string"==typeof r?"string":"hash"]:o.map}function et(t){var r=-1,n=null==t?0:t.length;for(this.clear();++r<n;){var e=t[r];this.set(e[0],e[1])}}et.prototype.clear=function(){this.size=0,this.__data__={hash:new X,map:new(rt||tt),string:new X}},et.prototype.delete=function(t){var r=nt(this,t).delete(t);return this.size-=r?1:0,r},et.prototype.get=function(t){return nt(this,t).get(t)},et.prototype.has=function(t){return nt(this,t).has(t)},et.prototype.set=function(t,r){var n=nt(this,t),e=n.size;return n.set(t,r),this.size+=n.size==e?0:1,this};var ot="Expected a function";function it(t,r){if("function"!=typeof t||null!=r&&"function"!=typeof r)throw new TypeError(ot);var n=function(){var e=arguments,o=r?r.apply(this,e):e[0],i=n.cache;if(i.has(o))return i.get(o);var a=t.apply(this,e);return n.cache=i.set(o,a)||i,a};return n.cache=new(it.Cache||et),n}it.Cache=et;var at,ut,ct,st=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,ft=/\\(\\)?/g,lt=(at=function(t){var r=[];return 46===t.charCodeAt(0)&&r.push(""),t.replace(st,(function(t,n,e,o){r.push(e?o.replace(ft,"$1"):n||t)})),r},ut=it(at,(function(t){return 500===ct.size&&ct.clear(),t})),ct=ut.cache,ut);const pt=lt;function vt(t,r){return _(t)?t:function(t,r){if(_(t))return!1;var n=typeof t;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=t&&!h(t))||K.test(t)||!J.test(t)||null!=r&&t in Object(r)}(t,r)?[t]:pt(function(t){return null==t?"":b(t)}(t))}var ht=1/0;function _t(t){if("string"==typeof t||h(t))return t;var r=t+"";return"0"==r&&1/t==-ht?"-0":r}function yt(t,r,n){var e=null==t?void 0:function(t,r){for(var n=0,e=(r=vt(r,t)).length;null!=t&&n<e;)t=t[_t(r[n++])];return n&&n==e?t:void 0}(t,r);return void 0===e?n:e}const dt=function(){return n.Date.now()};var gt="Expected a function",bt=Math.max,jt=Math.min;function mt(t,r,n){var e,o,i,a,u,c,s=0,f=!1,l=!1,p=!0;if("function"!=typeof t)throw new TypeError(gt);function v(r){var n=e,i=o;return e=o=void 0,s=r,a=t.apply(i,n)}function h(t){var n=t-c;return void 0===c||n>=r||n<0||l&&t-s>=i}function _(){var t=dt();if(h(t))return y(t);u=setTimeout(_,function(t){var n=r-(t-c);return l?jt(n,i-(t-s)):n}(t))}function y(t){return u=void 0,p&&e?v(t):(e=o=void 0,a)}function d(){var t=dt(),n=h(t);if(e=arguments,o=this,c=t,n){if(void 0===u)return function(t){return s=t,u=setTimeout(_,r),f?v(t):a}(c);if(l)return clearTimeout(u),u=setTimeout(_,r),v(c)}return void 0===u&&(u=setTimeout(_,r)),a}return r=E(r)||0,w(n)&&(f=!!n.leading,i=(l="maxWait"in n)?bt(E(n.maxWait)||0,r):i,p="trailing"in n?!!n.trailing:p),d.cancel=function(){void 0!==u&&clearTimeout(u),s=0,e=c=o=u=void 0},d.flush=function(){return void 0===u?a:y(dt())},d}function Ot(t){for(var r=-1,n=null==t?0:t.length,e={};++r<n;){var o=t[r];e[o[0]]=o[1]}return e}function wt(t){return null==t}function xt(t,r,n){var e=!0,o=!0;if("function"!=typeof t)throw new TypeError("Expected a function");return w(n)&&(e="leading"in n?!!n.leading:e,o="trailing"in n?!!n.trailing:o),mt(t,r,{leading:e,maxWait:r,trailing:o})}export{Ot as f,yt as g,wt as i,xt as t};
