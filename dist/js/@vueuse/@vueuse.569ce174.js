import{g as e,d as t,r as n,u as o,e as a,f as r,h as s,w as u}from"../@vue/@vue.18e6f8b9.js";var i;const c="undefined"!=typeof window,l=e=>"boolean"==typeof e,f=e=>"number"==typeof e,d=e=>"string"==typeof e,p=()=>{};function v(e){return"function"==typeof e?e():o(e)}function m(n){return!!e()&&(t(n),!0)}function O(e,t=200,n=!1,o=!0){return function(e,t){return function(...n){e((()=>t.apply(this,n)),{fn:t,thisArg:this,args:n})}}(function(e,t=!0,n=!0){let o,a=0,r=!0;const s=()=>{o&&(clearTimeout(o),o=void 0)};return u=>{const i=v(e),c=Date.now()-a;if(s(),i<=0)return a=Date.now(),u();c>i&&(n||!r)?(a=Date.now(),u()):t&&(o=setTimeout((()=>{a=Date.now(),r=!0,s(),u()}),i-c)),n||o||(o=setTimeout((()=>r=!0),i)),r=!1}}(t,n,o),e)}function w(e,t,o={}){const{immediate:a=!0}=o,r=n(!1);let s=null;function u(){s&&(clearTimeout(s),s=null)}function i(){r.value=!1,u()}function l(...n){u(),r.value=!0,s=setTimeout((()=>{r.value=!1,s=null,e(...n)}),v(t))}return a&&(r.value=!0,c&&l()),m(i),{isPending:r,start:l,stop:i}}function y(e){var t;const n=v(e);return null!=(t=null==n?void 0:n.$el)?t:n}c&&(null==(i=null==window?void 0:window.navigator)?void 0:i.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);const b=c?window:void 0;function g(...e){let t,n,o,a;if(d(e[0])||Array.isArray(e[0])?([n,o,a]=e,t=b):[t,n,o,a]=e,!t)return p;Array.isArray(n)||(n=[n]),Array.isArray(o)||(o=[o]);const r=[],s=()=>{r.forEach((e=>e())),r.length=0},i=u((()=>y(t)),(e=>{s(),e&&r.push(...n.flatMap((t=>o.map((n=>((e,t,n)=>(e.addEventListener(t,n,a),()=>e.removeEventListener(t,n,a)))(e,t,n))))))}),{immediate:!0,flush:"post"}),c=()=>{i(),s()};return m(c),c}function h(e,t,n={}){const{window:o=b,ignore:a=[],capture:r=!0,detectIframe:s=!1}=n;if(!o)return;let u,i=!0;const c=e=>a.some((t=>{if("string"==typeof t)return Array.from(o.document.querySelectorAll(t)).some((t=>t===e.target||e.composedPath().includes(t)));{const n=y(t);return n&&(e.target===n||e.composedPath().includes(n))}})),l=n=>{o.clearTimeout(u);const a=y(e);a&&a!==n.target&&!n.composedPath().includes(a)&&(0===n.detail&&(i=!c(n)),i?t(n):i=!0)},f=[g(o,"click",l,{passive:!0,capture:r}),g(o,"pointerdown",(t=>{const n=y(e);n&&(i=!t.composedPath().includes(n)&&!c(t))}),{passive:!0}),g(o,"pointerup",(e=>{if(0===e.button){const t=e.composedPath();e.composedPath=()=>t,u=o.setTimeout((()=>l(e)),50)}}),{passive:!0}),s&&g(o,"blur",(n=>{var a;const r=y(e);"IFRAME"!==(null==(a=o.document.activeElement)?void 0:a.tagName)||(null==r?void 0:r.contains(o.document.activeElement))||t(n)}))].filter(Boolean);return()=>f.forEach((e=>e()))}function I(e,t=!1){const o=n(),u=()=>o.value=Boolean(e());return u(),function(e,t=!0){a()?r(e):t?e():s(e)}(u,t),o}const E="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},P="__vueuse_ssr_handlers__";E[P]=E[P]||{},E[P];var T,A,Q=Object.getOwnPropertySymbols,j=Object.prototype.hasOwnProperty,N=Object.prototype.propertyIsEnumerable;function S(e,t,n={}){const o=n,{window:a=b}=o,r=((e,t)=>{var n={};for(var o in e)j.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&Q)for(var o of Q(e))t.indexOf(o)<0&&N.call(e,o)&&(n[o]=e[o]);return n})(o,["window"]);let s;const i=I((()=>a&&"ResizeObserver"in a)),c=()=>{s&&(s.disconnect(),s=void 0)},l=u((()=>y(e)),(e=>{c(),i.value&&a&&e&&(s=new ResizeObserver(t),s.observe(e,r))}),{immediate:!0,flush:"post"}),f=()=>{c(),l()};return m(f),{isSupported:i,stop:f}}(A=T||(T={})).UP="UP",A.RIGHT="RIGHT",A.DOWN="DOWN",A.LEFT="LEFT",A.NONE="NONE";var x=Object.defineProperty,C=Object.getOwnPropertySymbols,D=Object.prototype.hasOwnProperty,_=Object.prototype.propertyIsEnumerable,B=(e,t,n)=>t in e?x(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;((e,t)=>{for(var n in t||(t={}))D.call(t,n)&&B(e,n,t[n]);if(C)for(var n of C(t))_.call(t,n)&&B(e,n,t[n])})({linear:function(e){return e}},{easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]});export{f as a,l as b,g as c,O as d,w as e,S as f,c as i,h as o,m as t,y as u};