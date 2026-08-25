function Jd(e,t){for(var n=0;n<t.length;n++){const r=t[n];if(typeof r!="string"&&!Array.isArray(r)){for(const a in r)if(a!=="default"&&!(a in e)){const i=Object.getOwnPropertyDescriptor(r,a);i&&Object.defineProperty(e,a,i.get?i:{enumerable:!0,get:()=>r[a]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();var Kv=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Zd(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var mc={exports:{}},ja={},gc={exports:{}},M={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var pr=Symbol.for("react.element"),eh=Symbol.for("react.portal"),th=Symbol.for("react.fragment"),nh=Symbol.for("react.strict_mode"),rh=Symbol.for("react.profiler"),ah=Symbol.for("react.provider"),ih=Symbol.for("react.context"),sh=Symbol.for("react.forward_ref"),oh=Symbol.for("react.suspense"),lh=Symbol.for("react.memo"),ch=Symbol.for("react.lazy"),Mo=Symbol.iterator;function uh(e){return e===null||typeof e!="object"?null:(e=Mo&&e[Mo]||e["@@iterator"],typeof e=="function"?e:null)}var yc={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},vc=Object.assign,wc={};function xn(e,t,n){this.props=e,this.context=t,this.refs=wc,this.updater=n||yc}xn.prototype.isReactComponent={};xn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};xn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function bc(){}bc.prototype=xn.prototype;function Ms(e,t,n){this.props=e,this.context=t,this.refs=wc,this.updater=n||yc}var js=Ms.prototype=new bc;js.constructor=Ms;vc(js,xn.prototype);js.isPureReactComponent=!0;var jo=Array.isArray,kc=Object.prototype.hasOwnProperty,Os={current:null},xc={key:!0,ref:!0,__self:!0,__source:!0};function Sc(e,t,n){var r,a={},i=null,s=null;if(t!=null)for(r in t.ref!==void 0&&(s=t.ref),t.key!==void 0&&(i=""+t.key),t)kc.call(t,r)&&!xc.hasOwnProperty(r)&&(a[r]=t[r]);var o=arguments.length-2;if(o===1)a.children=n;else if(1<o){for(var l=Array(o),c=0;c<o;c++)l[c]=arguments[c+2];a.children=l}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)a[r]===void 0&&(a[r]=o[r]);return{$$typeof:pr,type:e,key:i,ref:s,props:a,_owner:Os.current}}function dh(e,t){return{$$typeof:pr,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Bs(e){return typeof e=="object"&&e!==null&&e.$$typeof===pr}function hh(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Oo=/\/+/g;function ri(e,t){return typeof e=="object"&&e!==null&&e.key!=null?hh(""+e.key):t.toString(36)}function $r(e,t,n,r,a){var i=typeof e;(i==="undefined"||i==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(i){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case pr:case eh:s=!0}}if(s)return s=e,a=a(s),e=r===""?"."+ri(s,0):r,jo(a)?(n="",e!=null&&(n=e.replace(Oo,"$&/")+"/"),$r(a,t,n,"",function(c){return c})):a!=null&&(Bs(a)&&(a=dh(a,n+(!a.key||s&&s.key===a.key?"":(""+a.key).replace(Oo,"$&/")+"/")+e)),t.push(a)),1;if(s=0,r=r===""?".":r+":",jo(e))for(var o=0;o<e.length;o++){i=e[o];var l=r+ri(i,o);s+=$r(i,t,n,l,a)}else if(l=uh(e),typeof l=="function")for(e=l.call(e),o=0;!(i=e.next()).done;)i=i.value,l=r+ri(i,o++),s+=$r(i,t,n,l,a);else if(i==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function Tr(e,t,n){if(e==null)return e;var r=[],a=0;return $r(e,r,"","",function(i){return t.call(n,i,a++)}),r}function fh(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var he={current:null},Hr={transition:null},ph={ReactCurrentDispatcher:he,ReactCurrentBatchConfig:Hr,ReactCurrentOwner:Os};function Cc(){throw Error("act(...) is not supported in production builds of React.")}M.Children={map:Tr,forEach:function(e,t,n){Tr(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Tr(e,function(){t++}),t},toArray:function(e){return Tr(e,function(t){return t})||[]},only:function(e){if(!Bs(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};M.Component=xn;M.Fragment=th;M.Profiler=rh;M.PureComponent=Ms;M.StrictMode=nh;M.Suspense=oh;M.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ph;M.act=Cc;M.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=vc({},e.props),a=e.key,i=e.ref,s=e._owner;if(t!=null){if(t.ref!==void 0&&(i=t.ref,s=Os.current),t.key!==void 0&&(a=""+t.key),e.type&&e.type.defaultProps)var o=e.type.defaultProps;for(l in t)kc.call(t,l)&&!xc.hasOwnProperty(l)&&(r[l]=t[l]===void 0&&o!==void 0?o[l]:t[l])}var l=arguments.length-2;if(l===1)r.children=n;else if(1<l){o=Array(l);for(var c=0;c<l;c++)o[c]=arguments[c+2];r.children=o}return{$$typeof:pr,type:e.type,key:a,ref:i,props:r,_owner:s}};M.createContext=function(e){return e={$$typeof:ih,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:ah,_context:e},e.Consumer=e};M.createElement=Sc;M.createFactory=function(e){var t=Sc.bind(null,e);return t.type=e,t};M.createRef=function(){return{current:null}};M.forwardRef=function(e){return{$$typeof:sh,render:e}};M.isValidElement=Bs;M.lazy=function(e){return{$$typeof:ch,_payload:{_status:-1,_result:e},_init:fh}};M.memo=function(e,t){return{$$typeof:lh,type:e,compare:t===void 0?null:t}};M.startTransition=function(e){var t=Hr.transition;Hr.transition={};try{e()}finally{Hr.transition=t}};M.unstable_act=Cc;M.useCallback=function(e,t){return he.current.useCallback(e,t)};M.useContext=function(e){return he.current.useContext(e)};M.useDebugValue=function(){};M.useDeferredValue=function(e){return he.current.useDeferredValue(e)};M.useEffect=function(e,t){return he.current.useEffect(e,t)};M.useId=function(){return he.current.useId()};M.useImperativeHandle=function(e,t,n){return he.current.useImperativeHandle(e,t,n)};M.useInsertionEffect=function(e,t){return he.current.useInsertionEffect(e,t)};M.useLayoutEffect=function(e,t){return he.current.useLayoutEffect(e,t)};M.useMemo=function(e,t){return he.current.useMemo(e,t)};M.useReducer=function(e,t,n){return he.current.useReducer(e,t,n)};M.useRef=function(e){return he.current.useRef(e)};M.useState=function(e){return he.current.useState(e)};M.useSyncExternalStore=function(e,t,n){return he.current.useSyncExternalStore(e,t,n)};M.useTransition=function(){return he.current.useTransition()};M.version="18.3.1";gc.exports=M;var k=gc.exports;const mh=Zd(k),gh=Jd({__proto__:null,default:mh},[k]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var yh=k,vh=Symbol.for("react.element"),wh=Symbol.for("react.fragment"),bh=Object.prototype.hasOwnProperty,kh=yh.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,xh={key:!0,ref:!0,__self:!0,__source:!0};function Tc(e,t,n){var r,a={},i=null,s=null;n!==void 0&&(i=""+n),t.key!==void 0&&(i=""+t.key),t.ref!==void 0&&(s=t.ref);for(r in t)bh.call(t,r)&&!xh.hasOwnProperty(r)&&(a[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)a[r]===void 0&&(a[r]=t[r]);return{$$typeof:vh,type:e,key:i,ref:s,props:a,_owner:kh.current}}ja.Fragment=wh;ja.jsx=Tc;ja.jsxs=Tc;mc.exports=ja;var b=mc.exports,Ec={exports:{}},Ce={},Pc={exports:{}},Ac={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(P,I){var D=P.length;P.push(I);e:for(;0<D;){var G=D-1>>>1,Z=P[G];if(0<a(Z,I))P[G]=I,P[D]=Z,D=G;else break e}}function n(P){return P.length===0?null:P[0]}function r(P){if(P.length===0)return null;var I=P[0],D=P.pop();if(D!==I){P[0]=D;e:for(var G=0,Z=P.length,Sr=Z>>>1;G<Sr;){var Rt=2*(G+1)-1,ni=P[Rt],Nt=Rt+1,Cr=P[Nt];if(0>a(ni,D))Nt<Z&&0>a(Cr,ni)?(P[G]=Cr,P[Nt]=D,G=Nt):(P[G]=ni,P[Rt]=D,G=Rt);else if(Nt<Z&&0>a(Cr,D))P[G]=Cr,P[Nt]=D,G=Nt;else break e}}return I}function a(P,I){var D=P.sortIndex-I.sortIndex;return D!==0?D:P.id-I.id}if(typeof performance=="object"&&typeof performance.now=="function"){var i=performance;e.unstable_now=function(){return i.now()}}else{var s=Date,o=s.now();e.unstable_now=function(){return s.now()-o}}var l=[],c=[],u=1,d=null,f=3,g=!1,y=!1,v=!1,S=typeof setTimeout=="function"?setTimeout:null,p=typeof clearTimeout=="function"?clearTimeout:null,h=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function m(P){for(var I=n(c);I!==null;){if(I.callback===null)r(c);else if(I.startTime<=P)r(c),I.sortIndex=I.expirationTime,t(l,I);else break;I=n(c)}}function w(P){if(v=!1,m(P),!y)if(n(l)!==null)y=!0,Lt(C);else{var I=n(c);I!==null&&En(w,I.startTime-P)}}function C(P,I){y=!1,v&&(v=!1,p(_),_=-1),g=!0;var D=f;try{for(m(I),d=n(l);d!==null&&(!(d.expirationTime>I)||P&&!B());){var G=d.callback;if(typeof G=="function"){d.callback=null,f=d.priorityLevel;var Z=G(d.expirationTime<=I);I=e.unstable_now(),typeof Z=="function"?d.callback=Z:d===n(l)&&r(l),m(I)}else r(l);d=n(l)}if(d!==null)var Sr=!0;else{var Rt=n(c);Rt!==null&&En(w,Rt.startTime-I),Sr=!1}return Sr}finally{d=null,f=D,g=!1}}var T=!1,A=null,_=-1,N=5,L=-1;function B(){return!(e.unstable_now()-L<N)}function Ie(){if(A!==null){var P=e.unstable_now();L=P;var I=!0;try{I=A(!0,P)}finally{I?Ve():(T=!1,A=null)}}else T=!1}var Ve;if(typeof h=="function")Ve=function(){h(Ie)};else if(typeof MessageChannel<"u"){var Qe=new MessageChannel,Ee=Qe.port2;Qe.port1.onmessage=Ie,Ve=function(){Ee.postMessage(null)}}else Ve=function(){S(Ie,0)};function Lt(P){A=P,T||(T=!0,Ve())}function En(P,I){_=S(function(){P(e.unstable_now())},I)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(P){P.callback=null},e.unstable_continueExecution=function(){y||g||(y=!0,Lt(C))},e.unstable_forceFrameRate=function(P){0>P||125<P?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):N=0<P?Math.floor(1e3/P):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_getFirstCallbackNode=function(){return n(l)},e.unstable_next=function(P){switch(f){case 1:case 2:case 3:var I=3;break;default:I=f}var D=f;f=I;try{return P()}finally{f=D}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(P,I){switch(P){case 1:case 2:case 3:case 4:case 5:break;default:P=3}var D=f;f=P;try{return I()}finally{f=D}},e.unstable_scheduleCallback=function(P,I,D){var G=e.unstable_now();switch(typeof D=="object"&&D!==null?(D=D.delay,D=typeof D=="number"&&0<D?G+D:G):D=G,P){case 1:var Z=-1;break;case 2:Z=250;break;case 5:Z=1073741823;break;case 4:Z=1e4;break;default:Z=5e3}return Z=D+Z,P={id:u++,callback:I,priorityLevel:P,startTime:D,expirationTime:Z,sortIndex:-1},D>G?(P.sortIndex=D,t(c,P),n(l)===null&&P===n(c)&&(v?(p(_),_=-1):v=!0,En(w,D-G))):(P.sortIndex=Z,t(l,P),y||g||(y=!0,Lt(C))),P},e.unstable_shouldYield=B,e.unstable_wrapCallback=function(P){var I=f;return function(){var D=f;f=I;try{return P.apply(this,arguments)}finally{f=D}}}})(Ac);Pc.exports=Ac;var Sh=Pc.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ch=k,Se=Sh;function x(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var _c=new Set,Gn={};function Ht(e,t){pn(e,t),pn(e+"Capture",t)}function pn(e,t){for(Gn[e]=t,e=0;e<t.length;e++)_c.add(t[e])}var Ze=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ri=Object.prototype.hasOwnProperty,Th=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Bo={},zo={};function Eh(e){return Ri.call(zo,e)?!0:Ri.call(Bo,e)?!1:Th.test(e)?zo[e]=!0:(Bo[e]=!0,!1)}function Ph(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Ah(e,t,n,r){if(t===null||typeof t>"u"||Ph(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function fe(e,t,n,r,a,i,s){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=a,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=i,this.removeEmptyString=s}var ae={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){ae[e]=new fe(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];ae[t]=new fe(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){ae[e]=new fe(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){ae[e]=new fe(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){ae[e]=new fe(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){ae[e]=new fe(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){ae[e]=new fe(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){ae[e]=new fe(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){ae[e]=new fe(e,5,!1,e.toLowerCase(),null,!1,!1)});var zs=/[\-:]([a-z])/g;function qs(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(zs,qs);ae[t]=new fe(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(zs,qs);ae[t]=new fe(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(zs,qs);ae[t]=new fe(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){ae[e]=new fe(e,1,!1,e.toLowerCase(),null,!1,!1)});ae.xlinkHref=new fe("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){ae[e]=new fe(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ws(e,t,n,r){var a=ae.hasOwnProperty(t)?ae[t]:null;(a!==null?a.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(Ah(t,n,a,r)&&(n=null),r||a===null?Eh(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):a.mustUseProperty?e[a.propertyName]=n===null?a.type===3?!1:"":n:(t=a.attributeName,r=a.attributeNamespace,n===null?e.removeAttribute(t):(a=a.type,n=a===3||a===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var rt=Ch.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Er=Symbol.for("react.element"),Gt=Symbol.for("react.portal"),Kt=Symbol.for("react.fragment"),Fs=Symbol.for("react.strict_mode"),Ni=Symbol.for("react.profiler"),Lc=Symbol.for("react.provider"),Rc=Symbol.for("react.context"),Us=Symbol.for("react.forward_ref"),Ii=Symbol.for("react.suspense"),Di=Symbol.for("react.suspense_list"),$s=Symbol.for("react.memo"),it=Symbol.for("react.lazy"),Nc=Symbol.for("react.offscreen"),qo=Symbol.iterator;function Pn(e){return e===null||typeof e!="object"?null:(e=qo&&e[qo]||e["@@iterator"],typeof e=="function"?e:null)}var H=Object.assign,ai;function Mn(e){if(ai===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);ai=t&&t[1]||""}return`
`+ai+e}var ii=!1;function si(e,t){if(!e||ii)return"";ii=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(c){var r=c}Reflect.construct(e,[],t)}else{try{t.call()}catch(c){r=c}e.call(t.prototype)}else{try{throw Error()}catch(c){r=c}e()}}catch(c){if(c&&r&&typeof c.stack=="string"){for(var a=c.stack.split(`
`),i=r.stack.split(`
`),s=a.length-1,o=i.length-1;1<=s&&0<=o&&a[s]!==i[o];)o--;for(;1<=s&&0<=o;s--,o--)if(a[s]!==i[o]){if(s!==1||o!==1)do if(s--,o--,0>o||a[s]!==i[o]){var l=`
`+a[s].replace(" at new "," at ");return e.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",e.displayName)),l}while(1<=s&&0<=o);break}}}finally{ii=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?Mn(e):""}function _h(e){switch(e.tag){case 5:return Mn(e.type);case 16:return Mn("Lazy");case 13:return Mn("Suspense");case 19:return Mn("SuspenseList");case 0:case 2:case 15:return e=si(e.type,!1),e;case 11:return e=si(e.type.render,!1),e;case 1:return e=si(e.type,!0),e;default:return""}}function Mi(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Kt:return"Fragment";case Gt:return"Portal";case Ni:return"Profiler";case Fs:return"StrictMode";case Ii:return"Suspense";case Di:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Rc:return(e.displayName||"Context")+".Consumer";case Lc:return(e._context.displayName||"Context")+".Provider";case Us:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case $s:return t=e.displayName||null,t!==null?t:Mi(e.type)||"Memo";case it:t=e._payload,e=e._init;try{return Mi(e(t))}catch{}}return null}function Lh(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Mi(t);case 8:return t===Fs?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function kt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Ic(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Rh(e){var t=Ic(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var a=n.get,i=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return a.call(this)},set:function(s){r=""+s,i.call(this,s)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(s){r=""+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Pr(e){e._valueTracker||(e._valueTracker=Rh(e))}function Dc(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=Ic(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function sa(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function ji(e,t){var n=t.checked;return H({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Wo(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=kt(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Mc(e,t){t=t.checked,t!=null&&Ws(e,"checked",t,!1)}function Oi(e,t){Mc(e,t);var n=kt(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Bi(e,t.type,n):t.hasOwnProperty("defaultValue")&&Bi(e,t.type,kt(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Fo(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Bi(e,t,n){(t!=="number"||sa(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var jn=Array.isArray;function ln(e,t,n,r){if(e=e.options,t){t={};for(var a=0;a<n.length;a++)t["$"+n[a]]=!0;for(n=0;n<e.length;n++)a=t.hasOwnProperty("$"+e[n].value),e[n].selected!==a&&(e[n].selected=a),a&&r&&(e[n].defaultSelected=!0)}else{for(n=""+kt(n),t=null,a=0;a<e.length;a++){if(e[a].value===n){e[a].selected=!0,r&&(e[a].defaultSelected=!0);return}t!==null||e[a].disabled||(t=e[a])}t!==null&&(t.selected=!0)}}function zi(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(x(91));return H({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Uo(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(x(92));if(jn(n)){if(1<n.length)throw Error(x(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:kt(n)}}function jc(e,t){var n=kt(t.value),r=kt(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function $o(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Oc(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function qi(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Oc(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Ar,Bc=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,a){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,a)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Ar=Ar||document.createElement("div"),Ar.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Ar.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Kn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var zn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Nh=["Webkit","ms","Moz","O"];Object.keys(zn).forEach(function(e){Nh.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),zn[t]=zn[e]})});function zc(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||zn.hasOwnProperty(e)&&zn[e]?(""+t).trim():t+"px"}function qc(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,a=zc(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,a):e[n]=a}}var Ih=H({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Wi(e,t){if(t){if(Ih[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(x(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(x(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(x(61))}if(t.style!=null&&typeof t.style!="object")throw Error(x(62))}}function Fi(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ui=null;function Hs(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var $i=null,cn=null,un=null;function Ho(e){if(e=yr(e)){if(typeof $i!="function")throw Error(x(280));var t=e.stateNode;t&&(t=Wa(t),$i(e.stateNode,e.type,t))}}function Wc(e){cn?un?un.push(e):un=[e]:cn=e}function Fc(){if(cn){var e=cn,t=un;if(un=cn=null,Ho(e),t)for(e=0;e<t.length;e++)Ho(t[e])}}function Uc(e,t){return e(t)}function $c(){}var oi=!1;function Hc(e,t,n){if(oi)return e(t,n);oi=!0;try{return Uc(e,t,n)}finally{oi=!1,(cn!==null||un!==null)&&($c(),Fc())}}function Xn(e,t){var n=e.stateNode;if(n===null)return null;var r=Wa(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(x(231,t,typeof n));return n}var Hi=!1;if(Ze)try{var An={};Object.defineProperty(An,"passive",{get:function(){Hi=!0}}),window.addEventListener("test",An,An),window.removeEventListener("test",An,An)}catch{Hi=!1}function Dh(e,t,n,r,a,i,s,o,l){var c=Array.prototype.slice.call(arguments,3);try{t.apply(n,c)}catch(u){this.onError(u)}}var qn=!1,oa=null,la=!1,Vi=null,Mh={onError:function(e){qn=!0,oa=e}};function jh(e,t,n,r,a,i,s,o,l){qn=!1,oa=null,Dh.apply(Mh,arguments)}function Oh(e,t,n,r,a,i,s,o,l){if(jh.apply(this,arguments),qn){if(qn){var c=oa;qn=!1,oa=null}else throw Error(x(198));la||(la=!0,Vi=c)}}function Vt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Vc(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Vo(e){if(Vt(e)!==e)throw Error(x(188))}function Bh(e){var t=e.alternate;if(!t){if(t=Vt(e),t===null)throw Error(x(188));return t!==e?null:e}for(var n=e,r=t;;){var a=n.return;if(a===null)break;var i=a.alternate;if(i===null){if(r=a.return,r!==null){n=r;continue}break}if(a.child===i.child){for(i=a.child;i;){if(i===n)return Vo(a),e;if(i===r)return Vo(a),t;i=i.sibling}throw Error(x(188))}if(n.return!==r.return)n=a,r=i;else{for(var s=!1,o=a.child;o;){if(o===n){s=!0,n=a,r=i;break}if(o===r){s=!0,r=a,n=i;break}o=o.sibling}if(!s){for(o=i.child;o;){if(o===n){s=!0,n=i,r=a;break}if(o===r){s=!0,r=i,n=a;break}o=o.sibling}if(!s)throw Error(x(189))}}if(n.alternate!==r)throw Error(x(190))}if(n.tag!==3)throw Error(x(188));return n.stateNode.current===n?e:t}function Qc(e){return e=Bh(e),e!==null?Gc(e):null}function Gc(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Gc(e);if(t!==null)return t;e=e.sibling}return null}var Kc=Se.unstable_scheduleCallback,Qo=Se.unstable_cancelCallback,zh=Se.unstable_shouldYield,qh=Se.unstable_requestPaint,K=Se.unstable_now,Wh=Se.unstable_getCurrentPriorityLevel,Vs=Se.unstable_ImmediatePriority,Xc=Se.unstable_UserBlockingPriority,ca=Se.unstable_NormalPriority,Fh=Se.unstable_LowPriority,Yc=Se.unstable_IdlePriority,Oa=null,$e=null;function Uh(e){if($e&&typeof $e.onCommitFiberRoot=="function")try{$e.onCommitFiberRoot(Oa,e,void 0,(e.current.flags&128)===128)}catch{}}var Be=Math.clz32?Math.clz32:Vh,$h=Math.log,Hh=Math.LN2;function Vh(e){return e>>>=0,e===0?32:31-($h(e)/Hh|0)|0}var _r=64,Lr=4194304;function On(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function ua(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,a=e.suspendedLanes,i=e.pingedLanes,s=n&268435455;if(s!==0){var o=s&~a;o!==0?r=On(o):(i&=s,i!==0&&(r=On(i)))}else s=n&~a,s!==0?r=On(s):i!==0&&(r=On(i));if(r===0)return 0;if(t!==0&&t!==r&&!(t&a)&&(a=r&-r,i=t&-t,a>=i||a===16&&(i&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-Be(t),a=1<<n,r|=e[n],t&=~a;return r}function Qh(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Gh(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,a=e.expirationTimes,i=e.pendingLanes;0<i;){var s=31-Be(i),o=1<<s,l=a[s];l===-1?(!(o&n)||o&r)&&(a[s]=Qh(o,t)):l<=t&&(e.expiredLanes|=o),i&=~o}}function Qi(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Jc(){var e=_r;return _r<<=1,!(_r&4194240)&&(_r=64),e}function li(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function mr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Be(t),e[t]=n}function Kh(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var a=31-Be(n),i=1<<a;t[a]=0,r[a]=-1,e[a]=-1,n&=~i}}function Qs(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Be(n),a=1<<r;a&t|e[r]&t&&(e[r]|=t),n&=~a}}var O=0;function Zc(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var eu,Gs,tu,nu,ru,Gi=!1,Rr=[],ht=null,ft=null,pt=null,Yn=new Map,Jn=new Map,ot=[],Xh="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Go(e,t){switch(e){case"focusin":case"focusout":ht=null;break;case"dragenter":case"dragleave":ft=null;break;case"mouseover":case"mouseout":pt=null;break;case"pointerover":case"pointerout":Yn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Jn.delete(t.pointerId)}}function _n(e,t,n,r,a,i){return e===null||e.nativeEvent!==i?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:i,targetContainers:[a]},t!==null&&(t=yr(t),t!==null&&Gs(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,a!==null&&t.indexOf(a)===-1&&t.push(a),e)}function Yh(e,t,n,r,a){switch(t){case"focusin":return ht=_n(ht,e,t,n,r,a),!0;case"dragenter":return ft=_n(ft,e,t,n,r,a),!0;case"mouseover":return pt=_n(pt,e,t,n,r,a),!0;case"pointerover":var i=a.pointerId;return Yn.set(i,_n(Yn.get(i)||null,e,t,n,r,a)),!0;case"gotpointercapture":return i=a.pointerId,Jn.set(i,_n(Jn.get(i)||null,e,t,n,r,a)),!0}return!1}function au(e){var t=Mt(e.target);if(t!==null){var n=Vt(t);if(n!==null){if(t=n.tag,t===13){if(t=Vc(n),t!==null){e.blockedOn=t,ru(e.priority,function(){tu(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Vr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Ki(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);Ui=r,n.target.dispatchEvent(r),Ui=null}else return t=yr(n),t!==null&&Gs(t),e.blockedOn=n,!1;t.shift()}return!0}function Ko(e,t,n){Vr(e)&&n.delete(t)}function Jh(){Gi=!1,ht!==null&&Vr(ht)&&(ht=null),ft!==null&&Vr(ft)&&(ft=null),pt!==null&&Vr(pt)&&(pt=null),Yn.forEach(Ko),Jn.forEach(Ko)}function Ln(e,t){e.blockedOn===t&&(e.blockedOn=null,Gi||(Gi=!0,Se.unstable_scheduleCallback(Se.unstable_NormalPriority,Jh)))}function Zn(e){function t(a){return Ln(a,e)}if(0<Rr.length){Ln(Rr[0],e);for(var n=1;n<Rr.length;n++){var r=Rr[n];r.blockedOn===e&&(r.blockedOn=null)}}for(ht!==null&&Ln(ht,e),ft!==null&&Ln(ft,e),pt!==null&&Ln(pt,e),Yn.forEach(t),Jn.forEach(t),n=0;n<ot.length;n++)r=ot[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<ot.length&&(n=ot[0],n.blockedOn===null);)au(n),n.blockedOn===null&&ot.shift()}var dn=rt.ReactCurrentBatchConfig,da=!0;function Zh(e,t,n,r){var a=O,i=dn.transition;dn.transition=null;try{O=1,Ks(e,t,n,r)}finally{O=a,dn.transition=i}}function ef(e,t,n,r){var a=O,i=dn.transition;dn.transition=null;try{O=4,Ks(e,t,n,r)}finally{O=a,dn.transition=i}}function Ks(e,t,n,r){if(da){var a=Ki(e,t,n,r);if(a===null)vi(e,t,r,ha,n),Go(e,r);else if(Yh(a,e,t,n,r))r.stopPropagation();else if(Go(e,r),t&4&&-1<Xh.indexOf(e)){for(;a!==null;){var i=yr(a);if(i!==null&&eu(i),i=Ki(e,t,n,r),i===null&&vi(e,t,r,ha,n),i===a)break;a=i}a!==null&&r.stopPropagation()}else vi(e,t,r,null,n)}}var ha=null;function Ki(e,t,n,r){if(ha=null,e=Hs(r),e=Mt(e),e!==null)if(t=Vt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Vc(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return ha=e,null}function iu(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Wh()){case Vs:return 1;case Xc:return 4;case ca:case Fh:return 16;case Yc:return 536870912;default:return 16}default:return 16}}var ct=null,Xs=null,Qr=null;function su(){if(Qr)return Qr;var e,t=Xs,n=t.length,r,a="value"in ct?ct.value:ct.textContent,i=a.length;for(e=0;e<n&&t[e]===a[e];e++);var s=n-e;for(r=1;r<=s&&t[n-r]===a[i-r];r++);return Qr=a.slice(e,1<r?1-r:void 0)}function Gr(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Nr(){return!0}function Xo(){return!1}function Te(e){function t(n,r,a,i,s){this._reactName=n,this._targetInst=a,this.type=r,this.nativeEvent=i,this.target=s,this.currentTarget=null;for(var o in e)e.hasOwnProperty(o)&&(n=e[o],this[o]=n?n(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?Nr:Xo,this.isPropagationStopped=Xo,this}return H(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Nr)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Nr)},persist:function(){},isPersistent:Nr}),t}var Sn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ys=Te(Sn),gr=H({},Sn,{view:0,detail:0}),tf=Te(gr),ci,ui,Rn,Ba=H({},gr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Js,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Rn&&(Rn&&e.type==="mousemove"?(ci=e.screenX-Rn.screenX,ui=e.screenY-Rn.screenY):ui=ci=0,Rn=e),ci)},movementY:function(e){return"movementY"in e?e.movementY:ui}}),Yo=Te(Ba),nf=H({},Ba,{dataTransfer:0}),rf=Te(nf),af=H({},gr,{relatedTarget:0}),di=Te(af),sf=H({},Sn,{animationName:0,elapsedTime:0,pseudoElement:0}),of=Te(sf),lf=H({},Sn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),cf=Te(lf),uf=H({},Sn,{data:0}),Jo=Te(uf),df={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},hf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},ff={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function pf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=ff[e])?!!t[e]:!1}function Js(){return pf}var mf=H({},gr,{key:function(e){if(e.key){var t=df[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Gr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?hf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Js,charCode:function(e){return e.type==="keypress"?Gr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Gr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),gf=Te(mf),yf=H({},Ba,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Zo=Te(yf),vf=H({},gr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Js}),wf=Te(vf),bf=H({},Sn,{propertyName:0,elapsedTime:0,pseudoElement:0}),kf=Te(bf),xf=H({},Ba,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Sf=Te(xf),Cf=[9,13,27,32],Zs=Ze&&"CompositionEvent"in window,Wn=null;Ze&&"documentMode"in document&&(Wn=document.documentMode);var Tf=Ze&&"TextEvent"in window&&!Wn,ou=Ze&&(!Zs||Wn&&8<Wn&&11>=Wn),el=" ",tl=!1;function lu(e,t){switch(e){case"keyup":return Cf.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function cu(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Xt=!1;function Ef(e,t){switch(e){case"compositionend":return cu(t);case"keypress":return t.which!==32?null:(tl=!0,el);case"textInput":return e=t.data,e===el&&tl?null:e;default:return null}}function Pf(e,t){if(Xt)return e==="compositionend"||!Zs&&lu(e,t)?(e=su(),Qr=Xs=ct=null,Xt=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return ou&&t.locale!=="ko"?null:t.data;default:return null}}var Af={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function nl(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Af[e.type]:t==="textarea"}function uu(e,t,n,r){Wc(r),t=fa(t,"onChange"),0<t.length&&(n=new Ys("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Fn=null,er=null;function _f(e){ku(e,0)}function za(e){var t=Zt(e);if(Dc(t))return e}function Lf(e,t){if(e==="change")return t}var du=!1;if(Ze){var hi;if(Ze){var fi="oninput"in document;if(!fi){var rl=document.createElement("div");rl.setAttribute("oninput","return;"),fi=typeof rl.oninput=="function"}hi=fi}else hi=!1;du=hi&&(!document.documentMode||9<document.documentMode)}function al(){Fn&&(Fn.detachEvent("onpropertychange",hu),er=Fn=null)}function hu(e){if(e.propertyName==="value"&&za(er)){var t=[];uu(t,er,e,Hs(e)),Hc(_f,t)}}function Rf(e,t,n){e==="focusin"?(al(),Fn=t,er=n,Fn.attachEvent("onpropertychange",hu)):e==="focusout"&&al()}function Nf(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return za(er)}function If(e,t){if(e==="click")return za(t)}function Df(e,t){if(e==="input"||e==="change")return za(t)}function Mf(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var qe=typeof Object.is=="function"?Object.is:Mf;function tr(e,t){if(qe(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var a=n[r];if(!Ri.call(t,a)||!qe(e[a],t[a]))return!1}return!0}function il(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function sl(e,t){var n=il(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=il(n)}}function fu(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?fu(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function pu(){for(var e=window,t=sa();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=sa(e.document)}return t}function eo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function jf(e){var t=pu(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&fu(n.ownerDocument.documentElement,n)){if(r!==null&&eo(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var a=n.textContent.length,i=Math.min(r.start,a);r=r.end===void 0?i:Math.min(r.end,a),!e.extend&&i>r&&(a=r,r=i,i=a),a=sl(n,i);var s=sl(n,r);a&&s&&(e.rangeCount!==1||e.anchorNode!==a.node||e.anchorOffset!==a.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(t=t.createRange(),t.setStart(a.node,a.offset),e.removeAllRanges(),i>r?(e.addRange(t),e.extend(s.node,s.offset)):(t.setEnd(s.node,s.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Of=Ze&&"documentMode"in document&&11>=document.documentMode,Yt=null,Xi=null,Un=null,Yi=!1;function ol(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Yi||Yt==null||Yt!==sa(r)||(r=Yt,"selectionStart"in r&&eo(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Un&&tr(Un,r)||(Un=r,r=fa(Xi,"onSelect"),0<r.length&&(t=new Ys("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=Yt)))}function Ir(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Jt={animationend:Ir("Animation","AnimationEnd"),animationiteration:Ir("Animation","AnimationIteration"),animationstart:Ir("Animation","AnimationStart"),transitionend:Ir("Transition","TransitionEnd")},pi={},mu={};Ze&&(mu=document.createElement("div").style,"AnimationEvent"in window||(delete Jt.animationend.animation,delete Jt.animationiteration.animation,delete Jt.animationstart.animation),"TransitionEvent"in window||delete Jt.transitionend.transition);function qa(e){if(pi[e])return pi[e];if(!Jt[e])return e;var t=Jt[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in mu)return pi[e]=t[n];return e}var gu=qa("animationend"),yu=qa("animationiteration"),vu=qa("animationstart"),wu=qa("transitionend"),bu=new Map,ll="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function St(e,t){bu.set(e,t),Ht(t,[e])}for(var mi=0;mi<ll.length;mi++){var gi=ll[mi],Bf=gi.toLowerCase(),zf=gi[0].toUpperCase()+gi.slice(1);St(Bf,"on"+zf)}St(gu,"onAnimationEnd");St(yu,"onAnimationIteration");St(vu,"onAnimationStart");St("dblclick","onDoubleClick");St("focusin","onFocus");St("focusout","onBlur");St(wu,"onTransitionEnd");pn("onMouseEnter",["mouseout","mouseover"]);pn("onMouseLeave",["mouseout","mouseover"]);pn("onPointerEnter",["pointerout","pointerover"]);pn("onPointerLeave",["pointerout","pointerover"]);Ht("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ht("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ht("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ht("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ht("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ht("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Bn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),qf=new Set("cancel close invalid load scroll toggle".split(" ").concat(Bn));function cl(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,Oh(r,t,void 0,e),e.currentTarget=null}function ku(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],a=r.event;r=r.listeners;e:{var i=void 0;if(t)for(var s=r.length-1;0<=s;s--){var o=r[s],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==i&&a.isPropagationStopped())break e;cl(a,o,c),i=l}else for(s=0;s<r.length;s++){if(o=r[s],l=o.instance,c=o.currentTarget,o=o.listener,l!==i&&a.isPropagationStopped())break e;cl(a,o,c),i=l}}}if(la)throw e=Vi,la=!1,Vi=null,e}function q(e,t){var n=t[ns];n===void 0&&(n=t[ns]=new Set);var r=e+"__bubble";n.has(r)||(xu(t,e,2,!1),n.add(r))}function yi(e,t,n){var r=0;t&&(r|=4),xu(n,e,r,t)}var Dr="_reactListening"+Math.random().toString(36).slice(2);function nr(e){if(!e[Dr]){e[Dr]=!0,_c.forEach(function(n){n!=="selectionchange"&&(qf.has(n)||yi(n,!1,e),yi(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Dr]||(t[Dr]=!0,yi("selectionchange",!1,t))}}function xu(e,t,n,r){switch(iu(t)){case 1:var a=Zh;break;case 4:a=ef;break;default:a=Ks}n=a.bind(null,t,n,e),a=void 0,!Hi||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(a=!0),r?a!==void 0?e.addEventListener(t,n,{capture:!0,passive:a}):e.addEventListener(t,n,!0):a!==void 0?e.addEventListener(t,n,{passive:a}):e.addEventListener(t,n,!1)}function vi(e,t,n,r,a){var i=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var o=r.stateNode.containerInfo;if(o===a||o.nodeType===8&&o.parentNode===a)break;if(s===4)for(s=r.return;s!==null;){var l=s.tag;if((l===3||l===4)&&(l=s.stateNode.containerInfo,l===a||l.nodeType===8&&l.parentNode===a))return;s=s.return}for(;o!==null;){if(s=Mt(o),s===null)return;if(l=s.tag,l===5||l===6){r=i=s;continue e}o=o.parentNode}}r=r.return}Hc(function(){var c=i,u=Hs(n),d=[];e:{var f=bu.get(e);if(f!==void 0){var g=Ys,y=e;switch(e){case"keypress":if(Gr(n)===0)break e;case"keydown":case"keyup":g=gf;break;case"focusin":y="focus",g=di;break;case"focusout":y="blur",g=di;break;case"beforeblur":case"afterblur":g=di;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":g=Yo;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":g=rf;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":g=wf;break;case gu:case yu:case vu:g=of;break;case wu:g=kf;break;case"scroll":g=tf;break;case"wheel":g=Sf;break;case"copy":case"cut":case"paste":g=cf;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":g=Zo}var v=(t&4)!==0,S=!v&&e==="scroll",p=v?f!==null?f+"Capture":null:f;v=[];for(var h=c,m;h!==null;){m=h;var w=m.stateNode;if(m.tag===5&&w!==null&&(m=w,p!==null&&(w=Xn(h,p),w!=null&&v.push(rr(h,w,m)))),S)break;h=h.return}0<v.length&&(f=new g(f,y,null,n,u),d.push({event:f,listeners:v}))}}if(!(t&7)){e:{if(f=e==="mouseover"||e==="pointerover",g=e==="mouseout"||e==="pointerout",f&&n!==Ui&&(y=n.relatedTarget||n.fromElement)&&(Mt(y)||y[et]))break e;if((g||f)&&(f=u.window===u?u:(f=u.ownerDocument)?f.defaultView||f.parentWindow:window,g?(y=n.relatedTarget||n.toElement,g=c,y=y?Mt(y):null,y!==null&&(S=Vt(y),y!==S||y.tag!==5&&y.tag!==6)&&(y=null)):(g=null,y=c),g!==y)){if(v=Yo,w="onMouseLeave",p="onMouseEnter",h="mouse",(e==="pointerout"||e==="pointerover")&&(v=Zo,w="onPointerLeave",p="onPointerEnter",h="pointer"),S=g==null?f:Zt(g),m=y==null?f:Zt(y),f=new v(w,h+"leave",g,n,u),f.target=S,f.relatedTarget=m,w=null,Mt(u)===c&&(v=new v(p,h+"enter",y,n,u),v.target=m,v.relatedTarget=S,w=v),S=w,g&&y)t:{for(v=g,p=y,h=0,m=v;m;m=Qt(m))h++;for(m=0,w=p;w;w=Qt(w))m++;for(;0<h-m;)v=Qt(v),h--;for(;0<m-h;)p=Qt(p),m--;for(;h--;){if(v===p||p!==null&&v===p.alternate)break t;v=Qt(v),p=Qt(p)}v=null}else v=null;g!==null&&ul(d,f,g,v,!1),y!==null&&S!==null&&ul(d,S,y,v,!0)}}e:{if(f=c?Zt(c):window,g=f.nodeName&&f.nodeName.toLowerCase(),g==="select"||g==="input"&&f.type==="file")var C=Lf;else if(nl(f))if(du)C=Df;else{C=Nf;var T=Rf}else(g=f.nodeName)&&g.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(C=If);if(C&&(C=C(e,c))){uu(d,C,n,u);break e}T&&T(e,f,c),e==="focusout"&&(T=f._wrapperState)&&T.controlled&&f.type==="number"&&Bi(f,"number",f.value)}switch(T=c?Zt(c):window,e){case"focusin":(nl(T)||T.contentEditable==="true")&&(Yt=T,Xi=c,Un=null);break;case"focusout":Un=Xi=Yt=null;break;case"mousedown":Yi=!0;break;case"contextmenu":case"mouseup":case"dragend":Yi=!1,ol(d,n,u);break;case"selectionchange":if(Of)break;case"keydown":case"keyup":ol(d,n,u)}var A;if(Zs)e:{switch(e){case"compositionstart":var _="onCompositionStart";break e;case"compositionend":_="onCompositionEnd";break e;case"compositionupdate":_="onCompositionUpdate";break e}_=void 0}else Xt?lu(e,n)&&(_="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(_="onCompositionStart");_&&(ou&&n.locale!=="ko"&&(Xt||_!=="onCompositionStart"?_==="onCompositionEnd"&&Xt&&(A=su()):(ct=u,Xs="value"in ct?ct.value:ct.textContent,Xt=!0)),T=fa(c,_),0<T.length&&(_=new Jo(_,e,null,n,u),d.push({event:_,listeners:T}),A?_.data=A:(A=cu(n),A!==null&&(_.data=A)))),(A=Tf?Ef(e,n):Pf(e,n))&&(c=fa(c,"onBeforeInput"),0<c.length&&(u=new Jo("onBeforeInput","beforeinput",null,n,u),d.push({event:u,listeners:c}),u.data=A))}ku(d,t)})}function rr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function fa(e,t){for(var n=t+"Capture",r=[];e!==null;){var a=e,i=a.stateNode;a.tag===5&&i!==null&&(a=i,i=Xn(e,n),i!=null&&r.unshift(rr(e,i,a)),i=Xn(e,t),i!=null&&r.push(rr(e,i,a))),e=e.return}return r}function Qt(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function ul(e,t,n,r,a){for(var i=t._reactName,s=[];n!==null&&n!==r;){var o=n,l=o.alternate,c=o.stateNode;if(l!==null&&l===r)break;o.tag===5&&c!==null&&(o=c,a?(l=Xn(n,i),l!=null&&s.unshift(rr(n,l,o))):a||(l=Xn(n,i),l!=null&&s.push(rr(n,l,o)))),n=n.return}s.length!==0&&e.push({event:t,listeners:s})}var Wf=/\r\n?/g,Ff=/\u0000|\uFFFD/g;function dl(e){return(typeof e=="string"?e:""+e).replace(Wf,`
`).replace(Ff,"")}function Mr(e,t,n){if(t=dl(t),dl(e)!==t&&n)throw Error(x(425))}function pa(){}var Ji=null,Zi=null;function es(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var ts=typeof setTimeout=="function"?setTimeout:void 0,Uf=typeof clearTimeout=="function"?clearTimeout:void 0,hl=typeof Promise=="function"?Promise:void 0,$f=typeof queueMicrotask=="function"?queueMicrotask:typeof hl<"u"?function(e){return hl.resolve(null).then(e).catch(Hf)}:ts;function Hf(e){setTimeout(function(){throw e})}function wi(e,t){var n=t,r=0;do{var a=n.nextSibling;if(e.removeChild(n),a&&a.nodeType===8)if(n=a.data,n==="/$"){if(r===0){e.removeChild(a),Zn(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=a}while(n);Zn(t)}function mt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function fl(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Cn=Math.random().toString(36).slice(2),Ue="__reactFiber$"+Cn,ar="__reactProps$"+Cn,et="__reactContainer$"+Cn,ns="__reactEvents$"+Cn,Vf="__reactListeners$"+Cn,Qf="__reactHandles$"+Cn;function Mt(e){var t=e[Ue];if(t)return t;for(var n=e.parentNode;n;){if(t=n[et]||n[Ue]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=fl(e);e!==null;){if(n=e[Ue])return n;e=fl(e)}return t}e=n,n=e.parentNode}return null}function yr(e){return e=e[Ue]||e[et],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Zt(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(x(33))}function Wa(e){return e[ar]||null}var rs=[],en=-1;function Ct(e){return{current:e}}function W(e){0>en||(e.current=rs[en],rs[en]=null,en--)}function z(e,t){en++,rs[en]=e.current,e.current=t}var xt={},ce=Ct(xt),ge=Ct(!1),qt=xt;function mn(e,t){var n=e.type.contextTypes;if(!n)return xt;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var a={},i;for(i in n)a[i]=t[i];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=a),a}function ye(e){return e=e.childContextTypes,e!=null}function ma(){W(ge),W(ce)}function pl(e,t,n){if(ce.current!==xt)throw Error(x(168));z(ce,t),z(ge,n)}function Su(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var a in r)if(!(a in t))throw Error(x(108,Lh(e)||"Unknown",a));return H({},n,r)}function ga(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||xt,qt=ce.current,z(ce,e),z(ge,ge.current),!0}function ml(e,t,n){var r=e.stateNode;if(!r)throw Error(x(169));n?(e=Su(e,t,qt),r.__reactInternalMemoizedMergedChildContext=e,W(ge),W(ce),z(ce,e)):W(ge),z(ge,n)}var Ke=null,Fa=!1,bi=!1;function Cu(e){Ke===null?Ke=[e]:Ke.push(e)}function Gf(e){Fa=!0,Cu(e)}function Tt(){if(!bi&&Ke!==null){bi=!0;var e=0,t=O;try{var n=Ke;for(O=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Ke=null,Fa=!1}catch(a){throw Ke!==null&&(Ke=Ke.slice(e+1)),Kc(Vs,Tt),a}finally{O=t,bi=!1}}return null}var tn=[],nn=0,ya=null,va=0,Pe=[],Ae=0,Wt=null,Xe=1,Ye="";function It(e,t){tn[nn++]=va,tn[nn++]=ya,ya=e,va=t}function Tu(e,t,n){Pe[Ae++]=Xe,Pe[Ae++]=Ye,Pe[Ae++]=Wt,Wt=e;var r=Xe;e=Ye;var a=32-Be(r)-1;r&=~(1<<a),n+=1;var i=32-Be(t)+a;if(30<i){var s=a-a%5;i=(r&(1<<s)-1).toString(32),r>>=s,a-=s,Xe=1<<32-Be(t)+a|n<<a|r,Ye=i+e}else Xe=1<<i|n<<a|r,Ye=e}function to(e){e.return!==null&&(It(e,1),Tu(e,1,0))}function no(e){for(;e===ya;)ya=tn[--nn],tn[nn]=null,va=tn[--nn],tn[nn]=null;for(;e===Wt;)Wt=Pe[--Ae],Pe[Ae]=null,Ye=Pe[--Ae],Pe[Ae]=null,Xe=Pe[--Ae],Pe[Ae]=null}var xe=null,ke=null,F=!1,Oe=null;function Eu(e,t){var n=_e(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function gl(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,xe=e,ke=mt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,xe=e,ke=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Wt!==null?{id:Xe,overflow:Ye}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=_e(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,xe=e,ke=null,!0):!1;default:return!1}}function as(e){return(e.mode&1)!==0&&(e.flags&128)===0}function is(e){if(F){var t=ke;if(t){var n=t;if(!gl(e,t)){if(as(e))throw Error(x(418));t=mt(n.nextSibling);var r=xe;t&&gl(e,t)?Eu(r,n):(e.flags=e.flags&-4097|2,F=!1,xe=e)}}else{if(as(e))throw Error(x(418));e.flags=e.flags&-4097|2,F=!1,xe=e}}}function yl(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;xe=e}function jr(e){if(e!==xe)return!1;if(!F)return yl(e),F=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!es(e.type,e.memoizedProps)),t&&(t=ke)){if(as(e))throw Pu(),Error(x(418));for(;t;)Eu(e,t),t=mt(t.nextSibling)}if(yl(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(x(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ke=mt(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ke=null}}else ke=xe?mt(e.stateNode.nextSibling):null;return!0}function Pu(){for(var e=ke;e;)e=mt(e.nextSibling)}function gn(){ke=xe=null,F=!1}function ro(e){Oe===null?Oe=[e]:Oe.push(e)}var Kf=rt.ReactCurrentBatchConfig;function Nn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(x(309));var r=n.stateNode}if(!r)throw Error(x(147,e));var a=r,i=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===i?t.ref:(t=function(s){var o=a.refs;s===null?delete o[i]:o[i]=s},t._stringRef=i,t)}if(typeof e!="string")throw Error(x(284));if(!n._owner)throw Error(x(290,e))}return e}function Or(e,t){throw e=Object.prototype.toString.call(t),Error(x(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function vl(e){var t=e._init;return t(e._payload)}function Au(e){function t(p,h){if(e){var m=p.deletions;m===null?(p.deletions=[h],p.flags|=16):m.push(h)}}function n(p,h){if(!e)return null;for(;h!==null;)t(p,h),h=h.sibling;return null}function r(p,h){for(p=new Map;h!==null;)h.key!==null?p.set(h.key,h):p.set(h.index,h),h=h.sibling;return p}function a(p,h){return p=wt(p,h),p.index=0,p.sibling=null,p}function i(p,h,m){return p.index=m,e?(m=p.alternate,m!==null?(m=m.index,m<h?(p.flags|=2,h):m):(p.flags|=2,h)):(p.flags|=1048576,h)}function s(p){return e&&p.alternate===null&&(p.flags|=2),p}function o(p,h,m,w){return h===null||h.tag!==6?(h=Pi(m,p.mode,w),h.return=p,h):(h=a(h,m),h.return=p,h)}function l(p,h,m,w){var C=m.type;return C===Kt?u(p,h,m.props.children,w,m.key):h!==null&&(h.elementType===C||typeof C=="object"&&C!==null&&C.$$typeof===it&&vl(C)===h.type)?(w=a(h,m.props),w.ref=Nn(p,h,m),w.return=p,w):(w=ta(m.type,m.key,m.props,null,p.mode,w),w.ref=Nn(p,h,m),w.return=p,w)}function c(p,h,m,w){return h===null||h.tag!==4||h.stateNode.containerInfo!==m.containerInfo||h.stateNode.implementation!==m.implementation?(h=Ai(m,p.mode,w),h.return=p,h):(h=a(h,m.children||[]),h.return=p,h)}function u(p,h,m,w,C){return h===null||h.tag!==7?(h=zt(m,p.mode,w,C),h.return=p,h):(h=a(h,m),h.return=p,h)}function d(p,h,m){if(typeof h=="string"&&h!==""||typeof h=="number")return h=Pi(""+h,p.mode,m),h.return=p,h;if(typeof h=="object"&&h!==null){switch(h.$$typeof){case Er:return m=ta(h.type,h.key,h.props,null,p.mode,m),m.ref=Nn(p,null,h),m.return=p,m;case Gt:return h=Ai(h,p.mode,m),h.return=p,h;case it:var w=h._init;return d(p,w(h._payload),m)}if(jn(h)||Pn(h))return h=zt(h,p.mode,m,null),h.return=p,h;Or(p,h)}return null}function f(p,h,m,w){var C=h!==null?h.key:null;if(typeof m=="string"&&m!==""||typeof m=="number")return C!==null?null:o(p,h,""+m,w);if(typeof m=="object"&&m!==null){switch(m.$$typeof){case Er:return m.key===C?l(p,h,m,w):null;case Gt:return m.key===C?c(p,h,m,w):null;case it:return C=m._init,f(p,h,C(m._payload),w)}if(jn(m)||Pn(m))return C!==null?null:u(p,h,m,w,null);Or(p,m)}return null}function g(p,h,m,w,C){if(typeof w=="string"&&w!==""||typeof w=="number")return p=p.get(m)||null,o(h,p,""+w,C);if(typeof w=="object"&&w!==null){switch(w.$$typeof){case Er:return p=p.get(w.key===null?m:w.key)||null,l(h,p,w,C);case Gt:return p=p.get(w.key===null?m:w.key)||null,c(h,p,w,C);case it:var T=w._init;return g(p,h,m,T(w._payload),C)}if(jn(w)||Pn(w))return p=p.get(m)||null,u(h,p,w,C,null);Or(h,w)}return null}function y(p,h,m,w){for(var C=null,T=null,A=h,_=h=0,N=null;A!==null&&_<m.length;_++){A.index>_?(N=A,A=null):N=A.sibling;var L=f(p,A,m[_],w);if(L===null){A===null&&(A=N);break}e&&A&&L.alternate===null&&t(p,A),h=i(L,h,_),T===null?C=L:T.sibling=L,T=L,A=N}if(_===m.length)return n(p,A),F&&It(p,_),C;if(A===null){for(;_<m.length;_++)A=d(p,m[_],w),A!==null&&(h=i(A,h,_),T===null?C=A:T.sibling=A,T=A);return F&&It(p,_),C}for(A=r(p,A);_<m.length;_++)N=g(A,p,_,m[_],w),N!==null&&(e&&N.alternate!==null&&A.delete(N.key===null?_:N.key),h=i(N,h,_),T===null?C=N:T.sibling=N,T=N);return e&&A.forEach(function(B){return t(p,B)}),F&&It(p,_),C}function v(p,h,m,w){var C=Pn(m);if(typeof C!="function")throw Error(x(150));if(m=C.call(m),m==null)throw Error(x(151));for(var T=C=null,A=h,_=h=0,N=null,L=m.next();A!==null&&!L.done;_++,L=m.next()){A.index>_?(N=A,A=null):N=A.sibling;var B=f(p,A,L.value,w);if(B===null){A===null&&(A=N);break}e&&A&&B.alternate===null&&t(p,A),h=i(B,h,_),T===null?C=B:T.sibling=B,T=B,A=N}if(L.done)return n(p,A),F&&It(p,_),C;if(A===null){for(;!L.done;_++,L=m.next())L=d(p,L.value,w),L!==null&&(h=i(L,h,_),T===null?C=L:T.sibling=L,T=L);return F&&It(p,_),C}for(A=r(p,A);!L.done;_++,L=m.next())L=g(A,p,_,L.value,w),L!==null&&(e&&L.alternate!==null&&A.delete(L.key===null?_:L.key),h=i(L,h,_),T===null?C=L:T.sibling=L,T=L);return e&&A.forEach(function(Ie){return t(p,Ie)}),F&&It(p,_),C}function S(p,h,m,w){if(typeof m=="object"&&m!==null&&m.type===Kt&&m.key===null&&(m=m.props.children),typeof m=="object"&&m!==null){switch(m.$$typeof){case Er:e:{for(var C=m.key,T=h;T!==null;){if(T.key===C){if(C=m.type,C===Kt){if(T.tag===7){n(p,T.sibling),h=a(T,m.props.children),h.return=p,p=h;break e}}else if(T.elementType===C||typeof C=="object"&&C!==null&&C.$$typeof===it&&vl(C)===T.type){n(p,T.sibling),h=a(T,m.props),h.ref=Nn(p,T,m),h.return=p,p=h;break e}n(p,T);break}else t(p,T);T=T.sibling}m.type===Kt?(h=zt(m.props.children,p.mode,w,m.key),h.return=p,p=h):(w=ta(m.type,m.key,m.props,null,p.mode,w),w.ref=Nn(p,h,m),w.return=p,p=w)}return s(p);case Gt:e:{for(T=m.key;h!==null;){if(h.key===T)if(h.tag===4&&h.stateNode.containerInfo===m.containerInfo&&h.stateNode.implementation===m.implementation){n(p,h.sibling),h=a(h,m.children||[]),h.return=p,p=h;break e}else{n(p,h);break}else t(p,h);h=h.sibling}h=Ai(m,p.mode,w),h.return=p,p=h}return s(p);case it:return T=m._init,S(p,h,T(m._payload),w)}if(jn(m))return y(p,h,m,w);if(Pn(m))return v(p,h,m,w);Or(p,m)}return typeof m=="string"&&m!==""||typeof m=="number"?(m=""+m,h!==null&&h.tag===6?(n(p,h.sibling),h=a(h,m),h.return=p,p=h):(n(p,h),h=Pi(m,p.mode,w),h.return=p,p=h),s(p)):n(p,h)}return S}var yn=Au(!0),_u=Au(!1),wa=Ct(null),ba=null,rn=null,ao=null;function io(){ao=rn=ba=null}function so(e){var t=wa.current;W(wa),e._currentValue=t}function ss(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function hn(e,t){ba=e,ao=rn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(me=!0),e.firstContext=null)}function Re(e){var t=e._currentValue;if(ao!==e)if(e={context:e,memoizedValue:t,next:null},rn===null){if(ba===null)throw Error(x(308));rn=e,ba.dependencies={lanes:0,firstContext:e}}else rn=rn.next=e;return t}var jt=null;function oo(e){jt===null?jt=[e]:jt.push(e)}function Lu(e,t,n,r){var a=t.interleaved;return a===null?(n.next=n,oo(t)):(n.next=a.next,a.next=n),t.interleaved=n,tt(e,r)}function tt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var st=!1;function lo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Ru(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Je(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function gt(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,j&2){var a=r.pending;return a===null?t.next=t:(t.next=a.next,a.next=t),r.pending=t,tt(e,n)}return a=r.interleaved,a===null?(t.next=t,oo(r)):(t.next=a.next,a.next=t),r.interleaved=t,tt(e,n)}function Kr(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Qs(e,n)}}function wl(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var a=null,i=null;if(n=n.firstBaseUpdate,n!==null){do{var s={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};i===null?a=i=s:i=i.next=s,n=n.next}while(n!==null);i===null?a=i=t:i=i.next=t}else a=i=t;n={baseState:r.baseState,firstBaseUpdate:a,lastBaseUpdate:i,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function ka(e,t,n,r){var a=e.updateQueue;st=!1;var i=a.firstBaseUpdate,s=a.lastBaseUpdate,o=a.shared.pending;if(o!==null){a.shared.pending=null;var l=o,c=l.next;l.next=null,s===null?i=c:s.next=c,s=l;var u=e.alternate;u!==null&&(u=u.updateQueue,o=u.lastBaseUpdate,o!==s&&(o===null?u.firstBaseUpdate=c:o.next=c,u.lastBaseUpdate=l))}if(i!==null){var d=a.baseState;s=0,u=c=l=null,o=i;do{var f=o.lane,g=o.eventTime;if((r&f)===f){u!==null&&(u=u.next={eventTime:g,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var y=e,v=o;switch(f=t,g=n,v.tag){case 1:if(y=v.payload,typeof y=="function"){d=y.call(g,d,f);break e}d=y;break e;case 3:y.flags=y.flags&-65537|128;case 0:if(y=v.payload,f=typeof y=="function"?y.call(g,d,f):y,f==null)break e;d=H({},d,f);break e;case 2:st=!0}}o.callback!==null&&o.lane!==0&&(e.flags|=64,f=a.effects,f===null?a.effects=[o]:f.push(o))}else g={eventTime:g,lane:f,tag:o.tag,payload:o.payload,callback:o.callback,next:null},u===null?(c=u=g,l=d):u=u.next=g,s|=f;if(o=o.next,o===null){if(o=a.shared.pending,o===null)break;f=o,o=f.next,f.next=null,a.lastBaseUpdate=f,a.shared.pending=null}}while(!0);if(u===null&&(l=d),a.baseState=l,a.firstBaseUpdate=c,a.lastBaseUpdate=u,t=a.shared.interleaved,t!==null){a=t;do s|=a.lane,a=a.next;while(a!==t)}else i===null&&(a.shared.lanes=0);Ut|=s,e.lanes=s,e.memoizedState=d}}function bl(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],a=r.callback;if(a!==null){if(r.callback=null,r=n,typeof a!="function")throw Error(x(191,a));a.call(r)}}}var vr={},He=Ct(vr),ir=Ct(vr),sr=Ct(vr);function Ot(e){if(e===vr)throw Error(x(174));return e}function co(e,t){switch(z(sr,t),z(ir,e),z(He,vr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:qi(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=qi(t,e)}W(He),z(He,t)}function vn(){W(He),W(ir),W(sr)}function Nu(e){Ot(sr.current);var t=Ot(He.current),n=qi(t,e.type);t!==n&&(z(ir,e),z(He,n))}function uo(e){ir.current===e&&(W(He),W(ir))}var U=Ct(0);function xa(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var ki=[];function ho(){for(var e=0;e<ki.length;e++)ki[e]._workInProgressVersionPrimary=null;ki.length=0}var Xr=rt.ReactCurrentDispatcher,xi=rt.ReactCurrentBatchConfig,Ft=0,$=null,Y=null,ee=null,Sa=!1,$n=!1,or=0,Xf=0;function ie(){throw Error(x(321))}function fo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!qe(e[n],t[n]))return!1;return!0}function po(e,t,n,r,a,i){if(Ft=i,$=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Xr.current=e===null||e.memoizedState===null?ep:tp,e=n(r,a),$n){i=0;do{if($n=!1,or=0,25<=i)throw Error(x(301));i+=1,ee=Y=null,t.updateQueue=null,Xr.current=np,e=n(r,a)}while($n)}if(Xr.current=Ca,t=Y!==null&&Y.next!==null,Ft=0,ee=Y=$=null,Sa=!1,t)throw Error(x(300));return e}function mo(){var e=or!==0;return or=0,e}function Fe(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ee===null?$.memoizedState=ee=e:ee=ee.next=e,ee}function Ne(){if(Y===null){var e=$.alternate;e=e!==null?e.memoizedState:null}else e=Y.next;var t=ee===null?$.memoizedState:ee.next;if(t!==null)ee=t,Y=e;else{if(e===null)throw Error(x(310));Y=e,e={memoizedState:Y.memoizedState,baseState:Y.baseState,baseQueue:Y.baseQueue,queue:Y.queue,next:null},ee===null?$.memoizedState=ee=e:ee=ee.next=e}return ee}function lr(e,t){return typeof t=="function"?t(e):t}function Si(e){var t=Ne(),n=t.queue;if(n===null)throw Error(x(311));n.lastRenderedReducer=e;var r=Y,a=r.baseQueue,i=n.pending;if(i!==null){if(a!==null){var s=a.next;a.next=i.next,i.next=s}r.baseQueue=a=i,n.pending=null}if(a!==null){i=a.next,r=r.baseState;var o=s=null,l=null,c=i;do{var u=c.lane;if((Ft&u)===u)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),r=c.hasEagerState?c.eagerState:e(r,c.action);else{var d={lane:u,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(o=l=d,s=r):l=l.next=d,$.lanes|=u,Ut|=u}c=c.next}while(c!==null&&c!==i);l===null?s=r:l.next=o,qe(r,t.memoizedState)||(me=!0),t.memoizedState=r,t.baseState=s,t.baseQueue=l,n.lastRenderedState=r}if(e=n.interleaved,e!==null){a=e;do i=a.lane,$.lanes|=i,Ut|=i,a=a.next;while(a!==e)}else a===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Ci(e){var t=Ne(),n=t.queue;if(n===null)throw Error(x(311));n.lastRenderedReducer=e;var r=n.dispatch,a=n.pending,i=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do i=e(i,s.action),s=s.next;while(s!==a);qe(i,t.memoizedState)||(me=!0),t.memoizedState=i,t.baseQueue===null&&(t.baseState=i),n.lastRenderedState=i}return[i,r]}function Iu(){}function Du(e,t){var n=$,r=Ne(),a=t(),i=!qe(r.memoizedState,a);if(i&&(r.memoizedState=a,me=!0),r=r.queue,go(Ou.bind(null,n,r,e),[e]),r.getSnapshot!==t||i||ee!==null&&ee.memoizedState.tag&1){if(n.flags|=2048,cr(9,ju.bind(null,n,r,a,t),void 0,null),te===null)throw Error(x(349));Ft&30||Mu(n,t,a)}return a}function Mu(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=$.updateQueue,t===null?(t={lastEffect:null,stores:null},$.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function ju(e,t,n,r){t.value=n,t.getSnapshot=r,Bu(t)&&zu(e)}function Ou(e,t,n){return n(function(){Bu(t)&&zu(e)})}function Bu(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!qe(e,n)}catch{return!0}}function zu(e){var t=tt(e,1);t!==null&&ze(t,e,1,-1)}function kl(e){var t=Fe();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:lr,lastRenderedState:e},t.queue=e,e=e.dispatch=Zf.bind(null,$,e),[t.memoizedState,e]}function cr(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=$.updateQueue,t===null?(t={lastEffect:null,stores:null},$.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function qu(){return Ne().memoizedState}function Yr(e,t,n,r){var a=Fe();$.flags|=e,a.memoizedState=cr(1|t,n,void 0,r===void 0?null:r)}function Ua(e,t,n,r){var a=Ne();r=r===void 0?null:r;var i=void 0;if(Y!==null){var s=Y.memoizedState;if(i=s.destroy,r!==null&&fo(r,s.deps)){a.memoizedState=cr(t,n,i,r);return}}$.flags|=e,a.memoizedState=cr(1|t,n,i,r)}function xl(e,t){return Yr(8390656,8,e,t)}function go(e,t){return Ua(2048,8,e,t)}function Wu(e,t){return Ua(4,2,e,t)}function Fu(e,t){return Ua(4,4,e,t)}function Uu(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function $u(e,t,n){return n=n!=null?n.concat([e]):null,Ua(4,4,Uu.bind(null,t,e),n)}function yo(){}function Hu(e,t){var n=Ne();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&fo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Vu(e,t){var n=Ne();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&fo(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Qu(e,t,n){return Ft&21?(qe(n,t)||(n=Jc(),$.lanes|=n,Ut|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,me=!0),e.memoizedState=n)}function Yf(e,t){var n=O;O=n!==0&&4>n?n:4,e(!0);var r=xi.transition;xi.transition={};try{e(!1),t()}finally{O=n,xi.transition=r}}function Gu(){return Ne().memoizedState}function Jf(e,t,n){var r=vt(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Ku(e))Xu(t,n);else if(n=Lu(e,t,n,r),n!==null){var a=de();ze(n,e,r,a),Yu(n,t,r)}}function Zf(e,t,n){var r=vt(e),a={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Ku(e))Xu(t,a);else{var i=e.alternate;if(e.lanes===0&&(i===null||i.lanes===0)&&(i=t.lastRenderedReducer,i!==null))try{var s=t.lastRenderedState,o=i(s,n);if(a.hasEagerState=!0,a.eagerState=o,qe(o,s)){var l=t.interleaved;l===null?(a.next=a,oo(t)):(a.next=l.next,l.next=a),t.interleaved=a;return}}catch{}finally{}n=Lu(e,t,a,r),n!==null&&(a=de(),ze(n,e,r,a),Yu(n,t,r))}}function Ku(e){var t=e.alternate;return e===$||t!==null&&t===$}function Xu(e,t){$n=Sa=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Yu(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Qs(e,n)}}var Ca={readContext:Re,useCallback:ie,useContext:ie,useEffect:ie,useImperativeHandle:ie,useInsertionEffect:ie,useLayoutEffect:ie,useMemo:ie,useReducer:ie,useRef:ie,useState:ie,useDebugValue:ie,useDeferredValue:ie,useTransition:ie,useMutableSource:ie,useSyncExternalStore:ie,useId:ie,unstable_isNewReconciler:!1},ep={readContext:Re,useCallback:function(e,t){return Fe().memoizedState=[e,t===void 0?null:t],e},useContext:Re,useEffect:xl,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Yr(4194308,4,Uu.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Yr(4194308,4,e,t)},useInsertionEffect:function(e,t){return Yr(4,2,e,t)},useMemo:function(e,t){var n=Fe();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Fe();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Jf.bind(null,$,e),[r.memoizedState,e]},useRef:function(e){var t=Fe();return e={current:e},t.memoizedState=e},useState:kl,useDebugValue:yo,useDeferredValue:function(e){return Fe().memoizedState=e},useTransition:function(){var e=kl(!1),t=e[0];return e=Yf.bind(null,e[1]),Fe().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=$,a=Fe();if(F){if(n===void 0)throw Error(x(407));n=n()}else{if(n=t(),te===null)throw Error(x(349));Ft&30||Mu(r,t,n)}a.memoizedState=n;var i={value:n,getSnapshot:t};return a.queue=i,xl(Ou.bind(null,r,i,e),[e]),r.flags|=2048,cr(9,ju.bind(null,r,i,n,t),void 0,null),n},useId:function(){var e=Fe(),t=te.identifierPrefix;if(F){var n=Ye,r=Xe;n=(r&~(1<<32-Be(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=or++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Xf++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},tp={readContext:Re,useCallback:Hu,useContext:Re,useEffect:go,useImperativeHandle:$u,useInsertionEffect:Wu,useLayoutEffect:Fu,useMemo:Vu,useReducer:Si,useRef:qu,useState:function(){return Si(lr)},useDebugValue:yo,useDeferredValue:function(e){var t=Ne();return Qu(t,Y.memoizedState,e)},useTransition:function(){var e=Si(lr)[0],t=Ne().memoizedState;return[e,t]},useMutableSource:Iu,useSyncExternalStore:Du,useId:Gu,unstable_isNewReconciler:!1},np={readContext:Re,useCallback:Hu,useContext:Re,useEffect:go,useImperativeHandle:$u,useInsertionEffect:Wu,useLayoutEffect:Fu,useMemo:Vu,useReducer:Ci,useRef:qu,useState:function(){return Ci(lr)},useDebugValue:yo,useDeferredValue:function(e){var t=Ne();return Y===null?t.memoizedState=e:Qu(t,Y.memoizedState,e)},useTransition:function(){var e=Ci(lr)[0],t=Ne().memoizedState;return[e,t]},useMutableSource:Iu,useSyncExternalStore:Du,useId:Gu,unstable_isNewReconciler:!1};function Me(e,t){if(e&&e.defaultProps){t=H({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function os(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:H({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var $a={isMounted:function(e){return(e=e._reactInternals)?Vt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=de(),a=vt(e),i=Je(r,a);i.payload=t,n!=null&&(i.callback=n),t=gt(e,i,a),t!==null&&(ze(t,e,a,r),Kr(t,e,a))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=de(),a=vt(e),i=Je(r,a);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=gt(e,i,a),t!==null&&(ze(t,e,a,r),Kr(t,e,a))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=de(),r=vt(e),a=Je(n,r);a.tag=2,t!=null&&(a.callback=t),t=gt(e,a,r),t!==null&&(ze(t,e,r,n),Kr(t,e,r))}};function Sl(e,t,n,r,a,i,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,i,s):t.prototype&&t.prototype.isPureReactComponent?!tr(n,r)||!tr(a,i):!0}function Ju(e,t,n){var r=!1,a=xt,i=t.contextType;return typeof i=="object"&&i!==null?i=Re(i):(a=ye(t)?qt:ce.current,r=t.contextTypes,i=(r=r!=null)?mn(e,a):xt),t=new t(n,i),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=$a,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=a,e.__reactInternalMemoizedMaskedChildContext=i),t}function Cl(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&$a.enqueueReplaceState(t,t.state,null)}function ls(e,t,n,r){var a=e.stateNode;a.props=n,a.state=e.memoizedState,a.refs={},lo(e);var i=t.contextType;typeof i=="object"&&i!==null?a.context=Re(i):(i=ye(t)?qt:ce.current,a.context=mn(e,i)),a.state=e.memoizedState,i=t.getDerivedStateFromProps,typeof i=="function"&&(os(e,t,i,n),a.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof a.getSnapshotBeforeUpdate=="function"||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(t=a.state,typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount(),t!==a.state&&$a.enqueueReplaceState(a,a.state,null),ka(e,n,a,r),a.state=e.memoizedState),typeof a.componentDidMount=="function"&&(e.flags|=4194308)}function wn(e,t){try{var n="",r=t;do n+=_h(r),r=r.return;while(r);var a=n}catch(i){a=`
Error generating stack: `+i.message+`
`+i.stack}return{value:e,source:t,stack:a,digest:null}}function Ti(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function cs(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var rp=typeof WeakMap=="function"?WeakMap:Map;function Zu(e,t,n){n=Je(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Ea||(Ea=!0,ws=r),cs(e,t)},n}function ed(e,t,n){n=Je(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var a=t.value;n.payload=function(){return r(a)},n.callback=function(){cs(e,t)}}var i=e.stateNode;return i!==null&&typeof i.componentDidCatch=="function"&&(n.callback=function(){cs(e,t),typeof r!="function"&&(yt===null?yt=new Set([this]):yt.add(this));var s=t.stack;this.componentDidCatch(t.value,{componentStack:s!==null?s:""})}),n}function Tl(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new rp;var a=new Set;r.set(t,a)}else a=r.get(t),a===void 0&&(a=new Set,r.set(t,a));a.has(n)||(a.add(n),e=yp.bind(null,e,t,n),t.then(e,e))}function El(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Pl(e,t,n,r,a){return e.mode&1?(e.flags|=65536,e.lanes=a,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Je(-1,1),t.tag=2,gt(n,t,1))),n.lanes|=1),e)}var ap=rt.ReactCurrentOwner,me=!1;function ue(e,t,n,r){t.child=e===null?_u(t,null,n,r):yn(t,e.child,n,r)}function Al(e,t,n,r,a){n=n.render;var i=t.ref;return hn(t,a),r=po(e,t,n,r,i,a),n=mo(),e!==null&&!me?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~a,nt(e,t,a)):(F&&n&&to(t),t.flags|=1,ue(e,t,r,a),t.child)}function _l(e,t,n,r,a){if(e===null){var i=n.type;return typeof i=="function"&&!To(i)&&i.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=i,td(e,t,i,r,a)):(e=ta(n.type,null,r,t,t.mode,a),e.ref=t.ref,e.return=t,t.child=e)}if(i=e.child,!(e.lanes&a)){var s=i.memoizedProps;if(n=n.compare,n=n!==null?n:tr,n(s,r)&&e.ref===t.ref)return nt(e,t,a)}return t.flags|=1,e=wt(i,r),e.ref=t.ref,e.return=t,t.child=e}function td(e,t,n,r,a){if(e!==null){var i=e.memoizedProps;if(tr(i,r)&&e.ref===t.ref)if(me=!1,t.pendingProps=r=i,(e.lanes&a)!==0)e.flags&131072&&(me=!0);else return t.lanes=e.lanes,nt(e,t,a)}return us(e,t,n,r,a)}function nd(e,t,n){var r=t.pendingProps,a=r.children,i=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},z(sn,we),we|=n;else{if(!(n&1073741824))return e=i!==null?i.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,z(sn,we),we|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=i!==null?i.baseLanes:n,z(sn,we),we|=r}else i!==null?(r=i.baseLanes|n,t.memoizedState=null):r=n,z(sn,we),we|=r;return ue(e,t,a,n),t.child}function rd(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function us(e,t,n,r,a){var i=ye(n)?qt:ce.current;return i=mn(t,i),hn(t,a),n=po(e,t,n,r,i,a),r=mo(),e!==null&&!me?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~a,nt(e,t,a)):(F&&r&&to(t),t.flags|=1,ue(e,t,n,a),t.child)}function Ll(e,t,n,r,a){if(ye(n)){var i=!0;ga(t)}else i=!1;if(hn(t,a),t.stateNode===null)Jr(e,t),Ju(t,n,r),ls(t,n,r,a),r=!0;else if(e===null){var s=t.stateNode,o=t.memoizedProps;s.props=o;var l=s.context,c=n.contextType;typeof c=="object"&&c!==null?c=Re(c):(c=ye(n)?qt:ce.current,c=mn(t,c));var u=n.getDerivedStateFromProps,d=typeof u=="function"||typeof s.getSnapshotBeforeUpdate=="function";d||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(o!==r||l!==c)&&Cl(t,s,r,c),st=!1;var f=t.memoizedState;s.state=f,ka(t,r,s,a),l=t.memoizedState,o!==r||f!==l||ge.current||st?(typeof u=="function"&&(os(t,n,u,r),l=t.memoizedState),(o=st||Sl(t,n,o,r,f,l,c))?(d||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),s.props=r,s.state=l,s.context=c,r=o):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{s=t.stateNode,Ru(e,t),o=t.memoizedProps,c=t.type===t.elementType?o:Me(t.type,o),s.props=c,d=t.pendingProps,f=s.context,l=n.contextType,typeof l=="object"&&l!==null?l=Re(l):(l=ye(n)?qt:ce.current,l=mn(t,l));var g=n.getDerivedStateFromProps;(u=typeof g=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(o!==d||f!==l)&&Cl(t,s,r,l),st=!1,f=t.memoizedState,s.state=f,ka(t,r,s,a);var y=t.memoizedState;o!==d||f!==y||ge.current||st?(typeof g=="function"&&(os(t,n,g,r),y=t.memoizedState),(c=st||Sl(t,n,c,r,f,y,l)||!1)?(u||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(r,y,l),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(r,y,l)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=y),s.props=r,s.state=y,s.context=l,r=c):(typeof s.componentDidUpdate!="function"||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return ds(e,t,n,r,i,a)}function ds(e,t,n,r,a,i){rd(e,t);var s=(t.flags&128)!==0;if(!r&&!s)return a&&ml(t,n,!1),nt(e,t,i);r=t.stateNode,ap.current=t;var o=s&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&s?(t.child=yn(t,e.child,null,i),t.child=yn(t,null,o,i)):ue(e,t,o,i),t.memoizedState=r.state,a&&ml(t,n,!0),t.child}function ad(e){var t=e.stateNode;t.pendingContext?pl(e,t.pendingContext,t.pendingContext!==t.context):t.context&&pl(e,t.context,!1),co(e,t.containerInfo)}function Rl(e,t,n,r,a){return gn(),ro(a),t.flags|=256,ue(e,t,n,r),t.child}var hs={dehydrated:null,treeContext:null,retryLane:0};function fs(e){return{baseLanes:e,cachePool:null,transitions:null}}function id(e,t,n){var r=t.pendingProps,a=U.current,i=!1,s=(t.flags&128)!==0,o;if((o=s)||(o=e!==null&&e.memoizedState===null?!1:(a&2)!==0),o?(i=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(a|=1),z(U,a&1),e===null)return is(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(s=r.children,e=r.fallback,i?(r=t.mode,i=t.child,s={mode:"hidden",children:s},!(r&1)&&i!==null?(i.childLanes=0,i.pendingProps=s):i=Qa(s,r,0,null),e=zt(e,r,n,null),i.return=t,e.return=t,i.sibling=e,t.child=i,t.child.memoizedState=fs(n),t.memoizedState=hs,e):vo(t,s));if(a=e.memoizedState,a!==null&&(o=a.dehydrated,o!==null))return ip(e,t,s,r,o,a,n);if(i){i=r.fallback,s=t.mode,a=e.child,o=a.sibling;var l={mode:"hidden",children:r.children};return!(s&1)&&t.child!==a?(r=t.child,r.childLanes=0,r.pendingProps=l,t.deletions=null):(r=wt(a,l),r.subtreeFlags=a.subtreeFlags&14680064),o!==null?i=wt(o,i):(i=zt(i,s,n,null),i.flags|=2),i.return=t,r.return=t,r.sibling=i,t.child=r,r=i,i=t.child,s=e.child.memoizedState,s=s===null?fs(n):{baseLanes:s.baseLanes|n,cachePool:null,transitions:s.transitions},i.memoizedState=s,i.childLanes=e.childLanes&~n,t.memoizedState=hs,r}return i=e.child,e=i.sibling,r=wt(i,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function vo(e,t){return t=Qa({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Br(e,t,n,r){return r!==null&&ro(r),yn(t,e.child,null,n),e=vo(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function ip(e,t,n,r,a,i,s){if(n)return t.flags&256?(t.flags&=-257,r=Ti(Error(x(422))),Br(e,t,s,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(i=r.fallback,a=t.mode,r=Qa({mode:"visible",children:r.children},a,0,null),i=zt(i,a,s,null),i.flags|=2,r.return=t,i.return=t,r.sibling=i,t.child=r,t.mode&1&&yn(t,e.child,null,s),t.child.memoizedState=fs(s),t.memoizedState=hs,i);if(!(t.mode&1))return Br(e,t,s,null);if(a.data==="$!"){if(r=a.nextSibling&&a.nextSibling.dataset,r)var o=r.dgst;return r=o,i=Error(x(419)),r=Ti(i,r,void 0),Br(e,t,s,r)}if(o=(s&e.childLanes)!==0,me||o){if(r=te,r!==null){switch(s&-s){case 4:a=2;break;case 16:a=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:a=32;break;case 536870912:a=268435456;break;default:a=0}a=a&(r.suspendedLanes|s)?0:a,a!==0&&a!==i.retryLane&&(i.retryLane=a,tt(e,a),ze(r,e,a,-1))}return Co(),r=Ti(Error(x(421))),Br(e,t,s,r)}return a.data==="$?"?(t.flags|=128,t.child=e.child,t=vp.bind(null,e),a._reactRetry=t,null):(e=i.treeContext,ke=mt(a.nextSibling),xe=t,F=!0,Oe=null,e!==null&&(Pe[Ae++]=Xe,Pe[Ae++]=Ye,Pe[Ae++]=Wt,Xe=e.id,Ye=e.overflow,Wt=t),t=vo(t,r.children),t.flags|=4096,t)}function Nl(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),ss(e.return,t,n)}function Ei(e,t,n,r,a){var i=e.memoizedState;i===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:a}:(i.isBackwards=t,i.rendering=null,i.renderingStartTime=0,i.last=r,i.tail=n,i.tailMode=a)}function sd(e,t,n){var r=t.pendingProps,a=r.revealOrder,i=r.tail;if(ue(e,t,r.children,n),r=U.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Nl(e,n,t);else if(e.tag===19)Nl(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(z(U,r),!(t.mode&1))t.memoizedState=null;else switch(a){case"forwards":for(n=t.child,a=null;n!==null;)e=n.alternate,e!==null&&xa(e)===null&&(a=n),n=n.sibling;n=a,n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null),Ei(t,!1,a,n,i);break;case"backwards":for(n=null,a=t.child,t.child=null;a!==null;){if(e=a.alternate,e!==null&&xa(e)===null){t.child=a;break}e=a.sibling,a.sibling=n,n=a,a=e}Ei(t,!0,n,null,i);break;case"together":Ei(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Jr(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function nt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Ut|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(x(153));if(t.child!==null){for(e=t.child,n=wt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=wt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function sp(e,t,n){switch(t.tag){case 3:ad(t),gn();break;case 5:Nu(t);break;case 1:ye(t.type)&&ga(t);break;case 4:co(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,a=t.memoizedProps.value;z(wa,r._currentValue),r._currentValue=a;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(z(U,U.current&1),t.flags|=128,null):n&t.child.childLanes?id(e,t,n):(z(U,U.current&1),e=nt(e,t,n),e!==null?e.sibling:null);z(U,U.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return sd(e,t,n);t.flags|=128}if(a=t.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),z(U,U.current),r)break;return null;case 22:case 23:return t.lanes=0,nd(e,t,n)}return nt(e,t,n)}var od,ps,ld,cd;od=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};ps=function(){};ld=function(e,t,n,r){var a=e.memoizedProps;if(a!==r){e=t.stateNode,Ot(He.current);var i=null;switch(n){case"input":a=ji(e,a),r=ji(e,r),i=[];break;case"select":a=H({},a,{value:void 0}),r=H({},r,{value:void 0}),i=[];break;case"textarea":a=zi(e,a),r=zi(e,r),i=[];break;default:typeof a.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=pa)}Wi(n,r);var s;n=null;for(c in a)if(!r.hasOwnProperty(c)&&a.hasOwnProperty(c)&&a[c]!=null)if(c==="style"){var o=a[c];for(s in o)o.hasOwnProperty(s)&&(n||(n={}),n[s]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Gn.hasOwnProperty(c)?i||(i=[]):(i=i||[]).push(c,null));for(c in r){var l=r[c];if(o=a!=null?a[c]:void 0,r.hasOwnProperty(c)&&l!==o&&(l!=null||o!=null))if(c==="style")if(o){for(s in o)!o.hasOwnProperty(s)||l&&l.hasOwnProperty(s)||(n||(n={}),n[s]="");for(s in l)l.hasOwnProperty(s)&&o[s]!==l[s]&&(n||(n={}),n[s]=l[s])}else n||(i||(i=[]),i.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(i=i||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(i=i||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Gn.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&q("scroll",e),i||o===l||(i=[])):(i=i||[]).push(c,l))}n&&(i=i||[]).push("style",n);var c=i;(t.updateQueue=c)&&(t.flags|=4)}};cd=function(e,t,n,r){n!==r&&(t.flags|=4)};function In(e,t){if(!F)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function se(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var a=e.child;a!==null;)n|=a.lanes|a.childLanes,r|=a.subtreeFlags&14680064,r|=a.flags&14680064,a.return=e,a=a.sibling;else for(a=e.child;a!==null;)n|=a.lanes|a.childLanes,r|=a.subtreeFlags,r|=a.flags,a.return=e,a=a.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function op(e,t,n){var r=t.pendingProps;switch(no(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return se(t),null;case 1:return ye(t.type)&&ma(),se(t),null;case 3:return r=t.stateNode,vn(),W(ge),W(ce),ho(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(jr(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Oe!==null&&(xs(Oe),Oe=null))),ps(e,t),se(t),null;case 5:uo(t);var a=Ot(sr.current);if(n=t.type,e!==null&&t.stateNode!=null)ld(e,t,n,r,a),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(x(166));return se(t),null}if(e=Ot(He.current),jr(t)){r=t.stateNode,n=t.type;var i=t.memoizedProps;switch(r[Ue]=t,r[ar]=i,e=(t.mode&1)!==0,n){case"dialog":q("cancel",r),q("close",r);break;case"iframe":case"object":case"embed":q("load",r);break;case"video":case"audio":for(a=0;a<Bn.length;a++)q(Bn[a],r);break;case"source":q("error",r);break;case"img":case"image":case"link":q("error",r),q("load",r);break;case"details":q("toggle",r);break;case"input":Wo(r,i),q("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!i.multiple},q("invalid",r);break;case"textarea":Uo(r,i),q("invalid",r)}Wi(n,i),a=null;for(var s in i)if(i.hasOwnProperty(s)){var o=i[s];s==="children"?typeof o=="string"?r.textContent!==o&&(i.suppressHydrationWarning!==!0&&Mr(r.textContent,o,e),a=["children",o]):typeof o=="number"&&r.textContent!==""+o&&(i.suppressHydrationWarning!==!0&&Mr(r.textContent,o,e),a=["children",""+o]):Gn.hasOwnProperty(s)&&o!=null&&s==="onScroll"&&q("scroll",r)}switch(n){case"input":Pr(r),Fo(r,i,!0);break;case"textarea":Pr(r),$o(r);break;case"select":case"option":break;default:typeof i.onClick=="function"&&(r.onclick=pa)}r=a,t.updateQueue=r,r!==null&&(t.flags|=4)}else{s=a.nodeType===9?a:a.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Oc(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=s.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=s.createElement(n,{is:r.is}):(e=s.createElement(n),n==="select"&&(s=e,r.multiple?s.multiple=!0:r.size&&(s.size=r.size))):e=s.createElementNS(e,n),e[Ue]=t,e[ar]=r,od(e,t,!1,!1),t.stateNode=e;e:{switch(s=Fi(n,r),n){case"dialog":q("cancel",e),q("close",e),a=r;break;case"iframe":case"object":case"embed":q("load",e),a=r;break;case"video":case"audio":for(a=0;a<Bn.length;a++)q(Bn[a],e);a=r;break;case"source":q("error",e),a=r;break;case"img":case"image":case"link":q("error",e),q("load",e),a=r;break;case"details":q("toggle",e),a=r;break;case"input":Wo(e,r),a=ji(e,r),q("invalid",e);break;case"option":a=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},a=H({},r,{value:void 0}),q("invalid",e);break;case"textarea":Uo(e,r),a=zi(e,r),q("invalid",e);break;default:a=r}Wi(n,a),o=a;for(i in o)if(o.hasOwnProperty(i)){var l=o[i];i==="style"?qc(e,l):i==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&Bc(e,l)):i==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&Kn(e,l):typeof l=="number"&&Kn(e,""+l):i!=="suppressContentEditableWarning"&&i!=="suppressHydrationWarning"&&i!=="autoFocus"&&(Gn.hasOwnProperty(i)?l!=null&&i==="onScroll"&&q("scroll",e):l!=null&&Ws(e,i,l,s))}switch(n){case"input":Pr(e),Fo(e,r,!1);break;case"textarea":Pr(e),$o(e);break;case"option":r.value!=null&&e.setAttribute("value",""+kt(r.value));break;case"select":e.multiple=!!r.multiple,i=r.value,i!=null?ln(e,!!r.multiple,i,!1):r.defaultValue!=null&&ln(e,!!r.multiple,r.defaultValue,!0);break;default:typeof a.onClick=="function"&&(e.onclick=pa)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return se(t),null;case 6:if(e&&t.stateNode!=null)cd(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(x(166));if(n=Ot(sr.current),Ot(He.current),jr(t)){if(r=t.stateNode,n=t.memoizedProps,r[Ue]=t,(i=r.nodeValue!==n)&&(e=xe,e!==null))switch(e.tag){case 3:Mr(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Mr(r.nodeValue,n,(e.mode&1)!==0)}i&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Ue]=t,t.stateNode=r}return se(t),null;case 13:if(W(U),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(F&&ke!==null&&t.mode&1&&!(t.flags&128))Pu(),gn(),t.flags|=98560,i=!1;else if(i=jr(t),r!==null&&r.dehydrated!==null){if(e===null){if(!i)throw Error(x(318));if(i=t.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(x(317));i[Ue]=t}else gn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;se(t),i=!1}else Oe!==null&&(xs(Oe),Oe=null),i=!0;if(!i)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||U.current&1?J===0&&(J=3):Co())),t.updateQueue!==null&&(t.flags|=4),se(t),null);case 4:return vn(),ps(e,t),e===null&&nr(t.stateNode.containerInfo),se(t),null;case 10:return so(t.type._context),se(t),null;case 17:return ye(t.type)&&ma(),se(t),null;case 19:if(W(U),i=t.memoizedState,i===null)return se(t),null;if(r=(t.flags&128)!==0,s=i.rendering,s===null)if(r)In(i,!1);else{if(J!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(s=xa(e),s!==null){for(t.flags|=128,In(i,!1),r=s.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)i=n,e=r,i.flags&=14680066,s=i.alternate,s===null?(i.childLanes=0,i.lanes=e,i.child=null,i.subtreeFlags=0,i.memoizedProps=null,i.memoizedState=null,i.updateQueue=null,i.dependencies=null,i.stateNode=null):(i.childLanes=s.childLanes,i.lanes=s.lanes,i.child=s.child,i.subtreeFlags=0,i.deletions=null,i.memoizedProps=s.memoizedProps,i.memoizedState=s.memoizedState,i.updateQueue=s.updateQueue,i.type=s.type,e=s.dependencies,i.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return z(U,U.current&1|2),t.child}e=e.sibling}i.tail!==null&&K()>bn&&(t.flags|=128,r=!0,In(i,!1),t.lanes=4194304)}else{if(!r)if(e=xa(s),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),In(i,!0),i.tail===null&&i.tailMode==="hidden"&&!s.alternate&&!F)return se(t),null}else 2*K()-i.renderingStartTime>bn&&n!==1073741824&&(t.flags|=128,r=!0,In(i,!1),t.lanes=4194304);i.isBackwards?(s.sibling=t.child,t.child=s):(n=i.last,n!==null?n.sibling=s:t.child=s,i.last=s)}return i.tail!==null?(t=i.tail,i.rendering=t,i.tail=t.sibling,i.renderingStartTime=K(),t.sibling=null,n=U.current,z(U,r?n&1|2:n&1),t):(se(t),null);case 22:case 23:return So(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?we&1073741824&&(se(t),t.subtreeFlags&6&&(t.flags|=8192)):se(t),null;case 24:return null;case 25:return null}throw Error(x(156,t.tag))}function lp(e,t){switch(no(t),t.tag){case 1:return ye(t.type)&&ma(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return vn(),W(ge),W(ce),ho(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return uo(t),null;case 13:if(W(U),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(x(340));gn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return W(U),null;case 4:return vn(),null;case 10:return so(t.type._context),null;case 22:case 23:return So(),null;case 24:return null;default:return null}}var zr=!1,oe=!1,cp=typeof WeakSet=="function"?WeakSet:Set,E=null;function an(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){V(e,t,r)}else n.current=null}function ms(e,t,n){try{n()}catch(r){V(e,t,r)}}var Il=!1;function up(e,t){if(Ji=da,e=pu(),eo(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var a=r.anchorOffset,i=r.focusNode;r=r.focusOffset;try{n.nodeType,i.nodeType}catch{n=null;break e}var s=0,o=-1,l=-1,c=0,u=0,d=e,f=null;t:for(;;){for(var g;d!==n||a!==0&&d.nodeType!==3||(o=s+a),d!==i||r!==0&&d.nodeType!==3||(l=s+r),d.nodeType===3&&(s+=d.nodeValue.length),(g=d.firstChild)!==null;)f=d,d=g;for(;;){if(d===e)break t;if(f===n&&++c===a&&(o=s),f===i&&++u===r&&(l=s),(g=d.nextSibling)!==null)break;d=f,f=d.parentNode}d=g}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(Zi={focusedElem:e,selectionRange:n},da=!1,E=t;E!==null;)if(t=E,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,E=e;else for(;E!==null;){t=E;try{var y=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(y!==null){var v=y.memoizedProps,S=y.memoizedState,p=t.stateNode,h=p.getSnapshotBeforeUpdate(t.elementType===t.type?v:Me(t.type,v),S);p.__reactInternalSnapshotBeforeUpdate=h}break;case 3:var m=t.stateNode.containerInfo;m.nodeType===1?m.textContent="":m.nodeType===9&&m.documentElement&&m.removeChild(m.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(x(163))}}catch(w){V(t,t.return,w)}if(e=t.sibling,e!==null){e.return=t.return,E=e;break}E=t.return}return y=Il,Il=!1,y}function Hn(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var a=r=r.next;do{if((a.tag&e)===e){var i=a.destroy;a.destroy=void 0,i!==void 0&&ms(t,n,i)}a=a.next}while(a!==r)}}function Ha(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function gs(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function ud(e){var t=e.alternate;t!==null&&(e.alternate=null,ud(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Ue],delete t[ar],delete t[ns],delete t[Vf],delete t[Qf])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function dd(e){return e.tag===5||e.tag===3||e.tag===4}function Dl(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||dd(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ys(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=pa));else if(r!==4&&(e=e.child,e!==null))for(ys(e,t,n),e=e.sibling;e!==null;)ys(e,t,n),e=e.sibling}function vs(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(vs(e,t,n),e=e.sibling;e!==null;)vs(e,t,n),e=e.sibling}var ne=null,je=!1;function at(e,t,n){for(n=n.child;n!==null;)hd(e,t,n),n=n.sibling}function hd(e,t,n){if($e&&typeof $e.onCommitFiberUnmount=="function")try{$e.onCommitFiberUnmount(Oa,n)}catch{}switch(n.tag){case 5:oe||an(n,t);case 6:var r=ne,a=je;ne=null,at(e,t,n),ne=r,je=a,ne!==null&&(je?(e=ne,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):ne.removeChild(n.stateNode));break;case 18:ne!==null&&(je?(e=ne,n=n.stateNode,e.nodeType===8?wi(e.parentNode,n):e.nodeType===1&&wi(e,n),Zn(e)):wi(ne,n.stateNode));break;case 4:r=ne,a=je,ne=n.stateNode.containerInfo,je=!0,at(e,t,n),ne=r,je=a;break;case 0:case 11:case 14:case 15:if(!oe&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){a=r=r.next;do{var i=a,s=i.destroy;i=i.tag,s!==void 0&&(i&2||i&4)&&ms(n,t,s),a=a.next}while(a!==r)}at(e,t,n);break;case 1:if(!oe&&(an(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(o){V(n,t,o)}at(e,t,n);break;case 21:at(e,t,n);break;case 22:n.mode&1?(oe=(r=oe)||n.memoizedState!==null,at(e,t,n),oe=r):at(e,t,n);break;default:at(e,t,n)}}function Ml(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new cp),t.forEach(function(r){var a=wp.bind(null,e,r);n.has(r)||(n.add(r),r.then(a,a))})}}function De(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var a=n[r];try{var i=e,s=t,o=s;e:for(;o!==null;){switch(o.tag){case 5:ne=o.stateNode,je=!1;break e;case 3:ne=o.stateNode.containerInfo,je=!0;break e;case 4:ne=o.stateNode.containerInfo,je=!0;break e}o=o.return}if(ne===null)throw Error(x(160));hd(i,s,a),ne=null,je=!1;var l=a.alternate;l!==null&&(l.return=null),a.return=null}catch(c){V(a,t,c)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)fd(t,e),t=t.sibling}function fd(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(De(t,e),We(e),r&4){try{Hn(3,e,e.return),Ha(3,e)}catch(v){V(e,e.return,v)}try{Hn(5,e,e.return)}catch(v){V(e,e.return,v)}}break;case 1:De(t,e),We(e),r&512&&n!==null&&an(n,n.return);break;case 5:if(De(t,e),We(e),r&512&&n!==null&&an(n,n.return),e.flags&32){var a=e.stateNode;try{Kn(a,"")}catch(v){V(e,e.return,v)}}if(r&4&&(a=e.stateNode,a!=null)){var i=e.memoizedProps,s=n!==null?n.memoizedProps:i,o=e.type,l=e.updateQueue;if(e.updateQueue=null,l!==null)try{o==="input"&&i.type==="radio"&&i.name!=null&&Mc(a,i),Fi(o,s);var c=Fi(o,i);for(s=0;s<l.length;s+=2){var u=l[s],d=l[s+1];u==="style"?qc(a,d):u==="dangerouslySetInnerHTML"?Bc(a,d):u==="children"?Kn(a,d):Ws(a,u,d,c)}switch(o){case"input":Oi(a,i);break;case"textarea":jc(a,i);break;case"select":var f=a._wrapperState.wasMultiple;a._wrapperState.wasMultiple=!!i.multiple;var g=i.value;g!=null?ln(a,!!i.multiple,g,!1):f!==!!i.multiple&&(i.defaultValue!=null?ln(a,!!i.multiple,i.defaultValue,!0):ln(a,!!i.multiple,i.multiple?[]:"",!1))}a[ar]=i}catch(v){V(e,e.return,v)}}break;case 6:if(De(t,e),We(e),r&4){if(e.stateNode===null)throw Error(x(162));a=e.stateNode,i=e.memoizedProps;try{a.nodeValue=i}catch(v){V(e,e.return,v)}}break;case 3:if(De(t,e),We(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Zn(t.containerInfo)}catch(v){V(e,e.return,v)}break;case 4:De(t,e),We(e);break;case 13:De(t,e),We(e),a=e.child,a.flags&8192&&(i=a.memoizedState!==null,a.stateNode.isHidden=i,!i||a.alternate!==null&&a.alternate.memoizedState!==null||(ko=K())),r&4&&Ml(e);break;case 22:if(u=n!==null&&n.memoizedState!==null,e.mode&1?(oe=(c=oe)||u,De(t,e),oe=c):De(t,e),We(e),r&8192){if(c=e.memoizedState!==null,(e.stateNode.isHidden=c)&&!u&&e.mode&1)for(E=e,u=e.child;u!==null;){for(d=E=u;E!==null;){switch(f=E,g=f.child,f.tag){case 0:case 11:case 14:case 15:Hn(4,f,f.return);break;case 1:an(f,f.return);var y=f.stateNode;if(typeof y.componentWillUnmount=="function"){r=f,n=f.return;try{t=r,y.props=t.memoizedProps,y.state=t.memoizedState,y.componentWillUnmount()}catch(v){V(r,n,v)}}break;case 5:an(f,f.return);break;case 22:if(f.memoizedState!==null){Ol(d);continue}}g!==null?(g.return=f,E=g):Ol(d)}u=u.sibling}e:for(u=null,d=e;;){if(d.tag===5){if(u===null){u=d;try{a=d.stateNode,c?(i=a.style,typeof i.setProperty=="function"?i.setProperty("display","none","important"):i.display="none"):(o=d.stateNode,l=d.memoizedProps.style,s=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=zc("display",s))}catch(v){V(e,e.return,v)}}}else if(d.tag===6){if(u===null)try{d.stateNode.nodeValue=c?"":d.memoizedProps}catch(v){V(e,e.return,v)}}else if((d.tag!==22&&d.tag!==23||d.memoizedState===null||d===e)&&d.child!==null){d.child.return=d,d=d.child;continue}if(d===e)break e;for(;d.sibling===null;){if(d.return===null||d.return===e)break e;u===d&&(u=null),d=d.return}u===d&&(u=null),d.sibling.return=d.return,d=d.sibling}}break;case 19:De(t,e),We(e),r&4&&Ml(e);break;case 21:break;default:De(t,e),We(e)}}function We(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(dd(n)){var r=n;break e}n=n.return}throw Error(x(160))}switch(r.tag){case 5:var a=r.stateNode;r.flags&32&&(Kn(a,""),r.flags&=-33);var i=Dl(e);vs(e,i,a);break;case 3:case 4:var s=r.stateNode.containerInfo,o=Dl(e);ys(e,o,s);break;default:throw Error(x(161))}}catch(l){V(e,e.return,l)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function dp(e,t,n){E=e,pd(e)}function pd(e,t,n){for(var r=(e.mode&1)!==0;E!==null;){var a=E,i=a.child;if(a.tag===22&&r){var s=a.memoizedState!==null||zr;if(!s){var o=a.alternate,l=o!==null&&o.memoizedState!==null||oe;o=zr;var c=oe;if(zr=s,(oe=l)&&!c)for(E=a;E!==null;)s=E,l=s.child,s.tag===22&&s.memoizedState!==null?Bl(a):l!==null?(l.return=s,E=l):Bl(a);for(;i!==null;)E=i,pd(i),i=i.sibling;E=a,zr=o,oe=c}jl(e)}else a.subtreeFlags&8772&&i!==null?(i.return=a,E=i):jl(e)}}function jl(e){for(;E!==null;){var t=E;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:oe||Ha(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!oe)if(n===null)r.componentDidMount();else{var a=t.elementType===t.type?n.memoizedProps:Me(t.type,n.memoizedProps);r.componentDidUpdate(a,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var i=t.updateQueue;i!==null&&bl(t,i,r);break;case 3:var s=t.updateQueue;if(s!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}bl(t,s,n)}break;case 5:var o=t.stateNode;if(n===null&&t.flags&4){n=o;var l=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var c=t.alternate;if(c!==null){var u=c.memoizedState;if(u!==null){var d=u.dehydrated;d!==null&&Zn(d)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(x(163))}oe||t.flags&512&&gs(t)}catch(f){V(t,t.return,f)}}if(t===e){E=null;break}if(n=t.sibling,n!==null){n.return=t.return,E=n;break}E=t.return}}function Ol(e){for(;E!==null;){var t=E;if(t===e){E=null;break}var n=t.sibling;if(n!==null){n.return=t.return,E=n;break}E=t.return}}function Bl(e){for(;E!==null;){var t=E;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Ha(4,t)}catch(l){V(t,n,l)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var a=t.return;try{r.componentDidMount()}catch(l){V(t,a,l)}}var i=t.return;try{gs(t)}catch(l){V(t,i,l)}break;case 5:var s=t.return;try{gs(t)}catch(l){V(t,s,l)}}}catch(l){V(t,t.return,l)}if(t===e){E=null;break}var o=t.sibling;if(o!==null){o.return=t.return,E=o;break}E=t.return}}var hp=Math.ceil,Ta=rt.ReactCurrentDispatcher,wo=rt.ReactCurrentOwner,Le=rt.ReactCurrentBatchConfig,j=0,te=null,X=null,re=0,we=0,sn=Ct(0),J=0,ur=null,Ut=0,Va=0,bo=0,Vn=null,pe=null,ko=0,bn=1/0,Ge=null,Ea=!1,ws=null,yt=null,qr=!1,ut=null,Pa=0,Qn=0,bs=null,Zr=-1,ea=0;function de(){return j&6?K():Zr!==-1?Zr:Zr=K()}function vt(e){return e.mode&1?j&2&&re!==0?re&-re:Kf.transition!==null?(ea===0&&(ea=Jc()),ea):(e=O,e!==0||(e=window.event,e=e===void 0?16:iu(e.type)),e):1}function ze(e,t,n,r){if(50<Qn)throw Qn=0,bs=null,Error(x(185));mr(e,n,r),(!(j&2)||e!==te)&&(e===te&&(!(j&2)&&(Va|=n),J===4&&lt(e,re)),ve(e,r),n===1&&j===0&&!(t.mode&1)&&(bn=K()+500,Fa&&Tt()))}function ve(e,t){var n=e.callbackNode;Gh(e,t);var r=ua(e,e===te?re:0);if(r===0)n!==null&&Qo(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Qo(n),t===1)e.tag===0?Gf(zl.bind(null,e)):Cu(zl.bind(null,e)),$f(function(){!(j&6)&&Tt()}),n=null;else{switch(Zc(r)){case 1:n=Vs;break;case 4:n=Xc;break;case 16:n=ca;break;case 536870912:n=Yc;break;default:n=ca}n=xd(n,md.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function md(e,t){if(Zr=-1,ea=0,j&6)throw Error(x(327));var n=e.callbackNode;if(fn()&&e.callbackNode!==n)return null;var r=ua(e,e===te?re:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=Aa(e,r);else{t=r;var a=j;j|=2;var i=yd();(te!==e||re!==t)&&(Ge=null,bn=K()+500,Bt(e,t));do try{mp();break}catch(o){gd(e,o)}while(!0);io(),Ta.current=i,j=a,X!==null?t=0:(te=null,re=0,t=J)}if(t!==0){if(t===2&&(a=Qi(e),a!==0&&(r=a,t=ks(e,a))),t===1)throw n=ur,Bt(e,0),lt(e,r),ve(e,K()),n;if(t===6)lt(e,r);else{if(a=e.current.alternate,!(r&30)&&!fp(a)&&(t=Aa(e,r),t===2&&(i=Qi(e),i!==0&&(r=i,t=ks(e,i))),t===1))throw n=ur,Bt(e,0),lt(e,r),ve(e,K()),n;switch(e.finishedWork=a,e.finishedLanes=r,t){case 0:case 1:throw Error(x(345));case 2:Dt(e,pe,Ge);break;case 3:if(lt(e,r),(r&130023424)===r&&(t=ko+500-K(),10<t)){if(ua(e,0)!==0)break;if(a=e.suspendedLanes,(a&r)!==r){de(),e.pingedLanes|=e.suspendedLanes&a;break}e.timeoutHandle=ts(Dt.bind(null,e,pe,Ge),t);break}Dt(e,pe,Ge);break;case 4:if(lt(e,r),(r&4194240)===r)break;for(t=e.eventTimes,a=-1;0<r;){var s=31-Be(r);i=1<<s,s=t[s],s>a&&(a=s),r&=~i}if(r=a,r=K()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*hp(r/1960))-r,10<r){e.timeoutHandle=ts(Dt.bind(null,e,pe,Ge),r);break}Dt(e,pe,Ge);break;case 5:Dt(e,pe,Ge);break;default:throw Error(x(329))}}}return ve(e,K()),e.callbackNode===n?md.bind(null,e):null}function ks(e,t){var n=Vn;return e.current.memoizedState.isDehydrated&&(Bt(e,t).flags|=256),e=Aa(e,t),e!==2&&(t=pe,pe=n,t!==null&&xs(t)),e}function xs(e){pe===null?pe=e:pe.push.apply(pe,e)}function fp(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var a=n[r],i=a.getSnapshot;a=a.value;try{if(!qe(i(),a))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function lt(e,t){for(t&=~bo,t&=~Va,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Be(t),r=1<<n;e[n]=-1,t&=~r}}function zl(e){if(j&6)throw Error(x(327));fn();var t=ua(e,0);if(!(t&1))return ve(e,K()),null;var n=Aa(e,t);if(e.tag!==0&&n===2){var r=Qi(e);r!==0&&(t=r,n=ks(e,r))}if(n===1)throw n=ur,Bt(e,0),lt(e,t),ve(e,K()),n;if(n===6)throw Error(x(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Dt(e,pe,Ge),ve(e,K()),null}function xo(e,t){var n=j;j|=1;try{return e(t)}finally{j=n,j===0&&(bn=K()+500,Fa&&Tt())}}function $t(e){ut!==null&&ut.tag===0&&!(j&6)&&fn();var t=j;j|=1;var n=Le.transition,r=O;try{if(Le.transition=null,O=1,e)return e()}finally{O=r,Le.transition=n,j=t,!(j&6)&&Tt()}}function So(){we=sn.current,W(sn)}function Bt(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Uf(n)),X!==null)for(n=X.return;n!==null;){var r=n;switch(no(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&ma();break;case 3:vn(),W(ge),W(ce),ho();break;case 5:uo(r);break;case 4:vn();break;case 13:W(U);break;case 19:W(U);break;case 10:so(r.type._context);break;case 22:case 23:So()}n=n.return}if(te=e,X=e=wt(e.current,null),re=we=t,J=0,ur=null,bo=Va=Ut=0,pe=Vn=null,jt!==null){for(t=0;t<jt.length;t++)if(n=jt[t],r=n.interleaved,r!==null){n.interleaved=null;var a=r.next,i=n.pending;if(i!==null){var s=i.next;i.next=a,r.next=s}n.pending=r}jt=null}return e}function gd(e,t){do{var n=X;try{if(io(),Xr.current=Ca,Sa){for(var r=$.memoizedState;r!==null;){var a=r.queue;a!==null&&(a.pending=null),r=r.next}Sa=!1}if(Ft=0,ee=Y=$=null,$n=!1,or=0,wo.current=null,n===null||n.return===null){J=1,ur=t,X=null;break}e:{var i=e,s=n.return,o=n,l=t;if(t=re,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,u=o,d=u.tag;if(!(u.mode&1)&&(d===0||d===11||d===15)){var f=u.alternate;f?(u.updateQueue=f.updateQueue,u.memoizedState=f.memoizedState,u.lanes=f.lanes):(u.updateQueue=null,u.memoizedState=null)}var g=El(s);if(g!==null){g.flags&=-257,Pl(g,s,o,i,t),g.mode&1&&Tl(i,c,t),t=g,l=c;var y=t.updateQueue;if(y===null){var v=new Set;v.add(l),t.updateQueue=v}else y.add(l);break e}else{if(!(t&1)){Tl(i,c,t),Co();break e}l=Error(x(426))}}else if(F&&o.mode&1){var S=El(s);if(S!==null){!(S.flags&65536)&&(S.flags|=256),Pl(S,s,o,i,t),ro(wn(l,o));break e}}i=l=wn(l,o),J!==4&&(J=2),Vn===null?Vn=[i]:Vn.push(i),i=s;do{switch(i.tag){case 3:i.flags|=65536,t&=-t,i.lanes|=t;var p=Zu(i,l,t);wl(i,p);break e;case 1:o=l;var h=i.type,m=i.stateNode;if(!(i.flags&128)&&(typeof h.getDerivedStateFromError=="function"||m!==null&&typeof m.componentDidCatch=="function"&&(yt===null||!yt.has(m)))){i.flags|=65536,t&=-t,i.lanes|=t;var w=ed(i,o,t);wl(i,w);break e}}i=i.return}while(i!==null)}wd(n)}catch(C){t=C,X===n&&n!==null&&(X=n=n.return);continue}break}while(!0)}function yd(){var e=Ta.current;return Ta.current=Ca,e===null?Ca:e}function Co(){(J===0||J===3||J===2)&&(J=4),te===null||!(Ut&268435455)&&!(Va&268435455)||lt(te,re)}function Aa(e,t){var n=j;j|=2;var r=yd();(te!==e||re!==t)&&(Ge=null,Bt(e,t));do try{pp();break}catch(a){gd(e,a)}while(!0);if(io(),j=n,Ta.current=r,X!==null)throw Error(x(261));return te=null,re=0,J}function pp(){for(;X!==null;)vd(X)}function mp(){for(;X!==null&&!zh();)vd(X)}function vd(e){var t=kd(e.alternate,e,we);e.memoizedProps=e.pendingProps,t===null?wd(e):X=t,wo.current=null}function wd(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=lp(n,t),n!==null){n.flags&=32767,X=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{J=6,X=null;return}}else if(n=op(n,t,we),n!==null){X=n;return}if(t=t.sibling,t!==null){X=t;return}X=t=e}while(t!==null);J===0&&(J=5)}function Dt(e,t,n){var r=O,a=Le.transition;try{Le.transition=null,O=1,gp(e,t,n,r)}finally{Le.transition=a,O=r}return null}function gp(e,t,n,r){do fn();while(ut!==null);if(j&6)throw Error(x(327));n=e.finishedWork;var a=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(x(177));e.callbackNode=null,e.callbackPriority=0;var i=n.lanes|n.childLanes;if(Kh(e,i),e===te&&(X=te=null,re=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||qr||(qr=!0,xd(ca,function(){return fn(),null})),i=(n.flags&15990)!==0,n.subtreeFlags&15990||i){i=Le.transition,Le.transition=null;var s=O;O=1;var o=j;j|=4,wo.current=null,up(e,n),fd(n,e),jf(Zi),da=!!Ji,Zi=Ji=null,e.current=n,dp(n),qh(),j=o,O=s,Le.transition=i}else e.current=n;if(qr&&(qr=!1,ut=e,Pa=a),i=e.pendingLanes,i===0&&(yt=null),Uh(n.stateNode),ve(e,K()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)a=t[n],r(a.value,{componentStack:a.stack,digest:a.digest});if(Ea)throw Ea=!1,e=ws,ws=null,e;return Pa&1&&e.tag!==0&&fn(),i=e.pendingLanes,i&1?e===bs?Qn++:(Qn=0,bs=e):Qn=0,Tt(),null}function fn(){if(ut!==null){var e=Zc(Pa),t=Le.transition,n=O;try{if(Le.transition=null,O=16>e?16:e,ut===null)var r=!1;else{if(e=ut,ut=null,Pa=0,j&6)throw Error(x(331));var a=j;for(j|=4,E=e.current;E!==null;){var i=E,s=i.child;if(E.flags&16){var o=i.deletions;if(o!==null){for(var l=0;l<o.length;l++){var c=o[l];for(E=c;E!==null;){var u=E;switch(u.tag){case 0:case 11:case 15:Hn(8,u,i)}var d=u.child;if(d!==null)d.return=u,E=d;else for(;E!==null;){u=E;var f=u.sibling,g=u.return;if(ud(u),u===c){E=null;break}if(f!==null){f.return=g,E=f;break}E=g}}}var y=i.alternate;if(y!==null){var v=y.child;if(v!==null){y.child=null;do{var S=v.sibling;v.sibling=null,v=S}while(v!==null)}}E=i}}if(i.subtreeFlags&2064&&s!==null)s.return=i,E=s;else e:for(;E!==null;){if(i=E,i.flags&2048)switch(i.tag){case 0:case 11:case 15:Hn(9,i,i.return)}var p=i.sibling;if(p!==null){p.return=i.return,E=p;break e}E=i.return}}var h=e.current;for(E=h;E!==null;){s=E;var m=s.child;if(s.subtreeFlags&2064&&m!==null)m.return=s,E=m;else e:for(s=h;E!==null;){if(o=E,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:Ha(9,o)}}catch(C){V(o,o.return,C)}if(o===s){E=null;break e}var w=o.sibling;if(w!==null){w.return=o.return,E=w;break e}E=o.return}}if(j=a,Tt(),$e&&typeof $e.onPostCommitFiberRoot=="function")try{$e.onPostCommitFiberRoot(Oa,e)}catch{}r=!0}return r}finally{O=n,Le.transition=t}}return!1}function ql(e,t,n){t=wn(n,t),t=Zu(e,t,1),e=gt(e,t,1),t=de(),e!==null&&(mr(e,1,t),ve(e,t))}function V(e,t,n){if(e.tag===3)ql(e,e,n);else for(;t!==null;){if(t.tag===3){ql(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(yt===null||!yt.has(r))){e=wn(n,e),e=ed(t,e,1),t=gt(t,e,1),e=de(),t!==null&&(mr(t,1,e),ve(t,e));break}}t=t.return}}function yp(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=de(),e.pingedLanes|=e.suspendedLanes&n,te===e&&(re&n)===n&&(J===4||J===3&&(re&130023424)===re&&500>K()-ko?Bt(e,0):bo|=n),ve(e,t)}function bd(e,t){t===0&&(e.mode&1?(t=Lr,Lr<<=1,!(Lr&130023424)&&(Lr=4194304)):t=1);var n=de();e=tt(e,t),e!==null&&(mr(e,t,n),ve(e,n))}function vp(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),bd(e,n)}function wp(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(x(314))}r!==null&&r.delete(t),bd(e,n)}var kd;kd=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||ge.current)me=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return me=!1,sp(e,t,n);me=!!(e.flags&131072)}else me=!1,F&&t.flags&1048576&&Tu(t,va,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;Jr(e,t),e=t.pendingProps;var a=mn(t,ce.current);hn(t,n),a=po(null,t,r,e,a,n);var i=mo();return t.flags|=1,typeof a=="object"&&a!==null&&typeof a.render=="function"&&a.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,ye(r)?(i=!0,ga(t)):i=!1,t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,lo(t),a.updater=$a,t.stateNode=a,a._reactInternals=t,ls(t,r,e,n),t=ds(null,t,r,!0,i,n)):(t.tag=0,F&&i&&to(t),ue(null,t,a,n),t=t.child),t;case 16:r=t.elementType;e:{switch(Jr(e,t),e=t.pendingProps,a=r._init,r=a(r._payload),t.type=r,a=t.tag=kp(r),e=Me(r,e),a){case 0:t=us(null,t,r,e,n);break e;case 1:t=Ll(null,t,r,e,n);break e;case 11:t=Al(null,t,r,e,n);break e;case 14:t=_l(null,t,r,Me(r.type,e),n);break e}throw Error(x(306,r,""))}return t;case 0:return r=t.type,a=t.pendingProps,a=t.elementType===r?a:Me(r,a),us(e,t,r,a,n);case 1:return r=t.type,a=t.pendingProps,a=t.elementType===r?a:Me(r,a),Ll(e,t,r,a,n);case 3:e:{if(ad(t),e===null)throw Error(x(387));r=t.pendingProps,i=t.memoizedState,a=i.element,Ru(e,t),ka(t,r,null,n);var s=t.memoizedState;if(r=s.element,i.isDehydrated)if(i={element:r,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=i,t.memoizedState=i,t.flags&256){a=wn(Error(x(423)),t),t=Rl(e,t,r,n,a);break e}else if(r!==a){a=wn(Error(x(424)),t),t=Rl(e,t,r,n,a);break e}else for(ke=mt(t.stateNode.containerInfo.firstChild),xe=t,F=!0,Oe=null,n=_u(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(gn(),r===a){t=nt(e,t,n);break e}ue(e,t,r,n)}t=t.child}return t;case 5:return Nu(t),e===null&&is(t),r=t.type,a=t.pendingProps,i=e!==null?e.memoizedProps:null,s=a.children,es(r,a)?s=null:i!==null&&es(r,i)&&(t.flags|=32),rd(e,t),ue(e,t,s,n),t.child;case 6:return e===null&&is(t),null;case 13:return id(e,t,n);case 4:return co(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=yn(t,null,r,n):ue(e,t,r,n),t.child;case 11:return r=t.type,a=t.pendingProps,a=t.elementType===r?a:Me(r,a),Al(e,t,r,a,n);case 7:return ue(e,t,t.pendingProps,n),t.child;case 8:return ue(e,t,t.pendingProps.children,n),t.child;case 12:return ue(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,a=t.pendingProps,i=t.memoizedProps,s=a.value,z(wa,r._currentValue),r._currentValue=s,i!==null)if(qe(i.value,s)){if(i.children===a.children&&!ge.current){t=nt(e,t,n);break e}}else for(i=t.child,i!==null&&(i.return=t);i!==null;){var o=i.dependencies;if(o!==null){s=i.child;for(var l=o.firstContext;l!==null;){if(l.context===r){if(i.tag===1){l=Je(-1,n&-n),l.tag=2;var c=i.updateQueue;if(c!==null){c=c.shared;var u=c.pending;u===null?l.next=l:(l.next=u.next,u.next=l),c.pending=l}}i.lanes|=n,l=i.alternate,l!==null&&(l.lanes|=n),ss(i.return,n,t),o.lanes|=n;break}l=l.next}}else if(i.tag===10)s=i.type===t.type?null:i.child;else if(i.tag===18){if(s=i.return,s===null)throw Error(x(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),ss(s,n,t),s=i.sibling}else s=i.child;if(s!==null)s.return=i;else for(s=i;s!==null;){if(s===t){s=null;break}if(i=s.sibling,i!==null){i.return=s.return,s=i;break}s=s.return}i=s}ue(e,t,a.children,n),t=t.child}return t;case 9:return a=t.type,r=t.pendingProps.children,hn(t,n),a=Re(a),r=r(a),t.flags|=1,ue(e,t,r,n),t.child;case 14:return r=t.type,a=Me(r,t.pendingProps),a=Me(r.type,a),_l(e,t,r,a,n);case 15:return td(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,a=t.pendingProps,a=t.elementType===r?a:Me(r,a),Jr(e,t),t.tag=1,ye(r)?(e=!0,ga(t)):e=!1,hn(t,n),Ju(t,r,a),ls(t,r,a,n),ds(null,t,r,!0,e,n);case 19:return sd(e,t,n);case 22:return nd(e,t,n)}throw Error(x(156,t.tag))};function xd(e,t){return Kc(e,t)}function bp(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function _e(e,t,n,r){return new bp(e,t,n,r)}function To(e){return e=e.prototype,!(!e||!e.isReactComponent)}function kp(e){if(typeof e=="function")return To(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Us)return 11;if(e===$s)return 14}return 2}function wt(e,t){var n=e.alternate;return n===null?(n=_e(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function ta(e,t,n,r,a,i){var s=2;if(r=e,typeof e=="function")To(e)&&(s=1);else if(typeof e=="string")s=5;else e:switch(e){case Kt:return zt(n.children,a,i,t);case Fs:s=8,a|=8;break;case Ni:return e=_e(12,n,t,a|2),e.elementType=Ni,e.lanes=i,e;case Ii:return e=_e(13,n,t,a),e.elementType=Ii,e.lanes=i,e;case Di:return e=_e(19,n,t,a),e.elementType=Di,e.lanes=i,e;case Nc:return Qa(n,a,i,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Lc:s=10;break e;case Rc:s=9;break e;case Us:s=11;break e;case $s:s=14;break e;case it:s=16,r=null;break e}throw Error(x(130,e==null?e:typeof e,""))}return t=_e(s,n,t,a),t.elementType=e,t.type=r,t.lanes=i,t}function zt(e,t,n,r){return e=_e(7,e,r,t),e.lanes=n,e}function Qa(e,t,n,r){return e=_e(22,e,r,t),e.elementType=Nc,e.lanes=n,e.stateNode={isHidden:!1},e}function Pi(e,t,n){return e=_e(6,e,null,t),e.lanes=n,e}function Ai(e,t,n){return t=_e(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function xp(e,t,n,r,a){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=li(0),this.expirationTimes=li(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=li(0),this.identifierPrefix=r,this.onRecoverableError=a,this.mutableSourceEagerHydrationData=null}function Eo(e,t,n,r,a,i,s,o,l){return e=new xp(e,t,n,o,l),t===1?(t=1,i===!0&&(t|=8)):t=0,i=_e(3,null,null,t),e.current=i,i.stateNode=e,i.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},lo(i),e}function Sp(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Gt,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function Sd(e){if(!e)return xt;e=e._reactInternals;e:{if(Vt(e)!==e||e.tag!==1)throw Error(x(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(ye(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(x(171))}if(e.tag===1){var n=e.type;if(ye(n))return Su(e,n,t)}return t}function Cd(e,t,n,r,a,i,s,o,l){return e=Eo(n,r,!0,e,a,i,s,o,l),e.context=Sd(null),n=e.current,r=de(),a=vt(n),i=Je(r,a),i.callback=t??null,gt(n,i,a),e.current.lanes=a,mr(e,a,r),ve(e,r),e}function Ga(e,t,n,r){var a=t.current,i=de(),s=vt(a);return n=Sd(n),t.context===null?t.context=n:t.pendingContext=n,t=Je(i,s),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=gt(a,t,s),e!==null&&(ze(e,a,s,i),Kr(e,a,s)),s}function _a(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Wl(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Po(e,t){Wl(e,t),(e=e.alternate)&&Wl(e,t)}function Cp(){return null}var Td=typeof reportError=="function"?reportError:function(e){console.error(e)};function Ao(e){this._internalRoot=e}Ka.prototype.render=Ao.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(x(409));Ga(e,t,null,null)};Ka.prototype.unmount=Ao.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;$t(function(){Ga(null,e,null,null)}),t[et]=null}};function Ka(e){this._internalRoot=e}Ka.prototype.unstable_scheduleHydration=function(e){if(e){var t=nu();e={blockedOn:null,target:e,priority:t};for(var n=0;n<ot.length&&t!==0&&t<ot[n].priority;n++);ot.splice(n,0,e),n===0&&au(e)}};function _o(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Xa(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Fl(){}function Tp(e,t,n,r,a){if(a){if(typeof r=="function"){var i=r;r=function(){var c=_a(s);i.call(c)}}var s=Cd(t,r,e,0,null,!1,!1,"",Fl);return e._reactRootContainer=s,e[et]=s.current,nr(e.nodeType===8?e.parentNode:e),$t(),s}for(;a=e.lastChild;)e.removeChild(a);if(typeof r=="function"){var o=r;r=function(){var c=_a(l);o.call(c)}}var l=Eo(e,0,!1,null,null,!1,!1,"",Fl);return e._reactRootContainer=l,e[et]=l.current,nr(e.nodeType===8?e.parentNode:e),$t(function(){Ga(t,l,n,r)}),l}function Ya(e,t,n,r,a){var i=n._reactRootContainer;if(i){var s=i;if(typeof a=="function"){var o=a;a=function(){var l=_a(s);o.call(l)}}Ga(t,s,e,a)}else s=Tp(n,t,e,a,r);return _a(s)}eu=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=On(t.pendingLanes);n!==0&&(Qs(t,n|1),ve(t,K()),!(j&6)&&(bn=K()+500,Tt()))}break;case 13:$t(function(){var r=tt(e,1);if(r!==null){var a=de();ze(r,e,1,a)}}),Po(e,1)}};Gs=function(e){if(e.tag===13){var t=tt(e,134217728);if(t!==null){var n=de();ze(t,e,134217728,n)}Po(e,134217728)}};tu=function(e){if(e.tag===13){var t=vt(e),n=tt(e,t);if(n!==null){var r=de();ze(n,e,t,r)}Po(e,t)}};nu=function(){return O};ru=function(e,t){var n=O;try{return O=e,t()}finally{O=n}};$i=function(e,t,n){switch(t){case"input":if(Oi(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var a=Wa(r);if(!a)throw Error(x(90));Dc(r),Oi(r,a)}}}break;case"textarea":jc(e,n);break;case"select":t=n.value,t!=null&&ln(e,!!n.multiple,t,!1)}};Uc=xo;$c=$t;var Ep={usingClientEntryPoint:!1,Events:[yr,Zt,Wa,Wc,Fc,xo]},Dn={findFiberByHostInstance:Mt,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Pp={bundleType:Dn.bundleType,version:Dn.version,rendererPackageName:Dn.rendererPackageName,rendererConfig:Dn.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:rt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Qc(e),e===null?null:e.stateNode},findFiberByHostInstance:Dn.findFiberByHostInstance||Cp,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Wr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Wr.isDisabled&&Wr.supportsFiber)try{Oa=Wr.inject(Pp),$e=Wr}catch{}}Ce.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ep;Ce.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!_o(t))throw Error(x(200));return Sp(e,t,null,n)};Ce.createRoot=function(e,t){if(!_o(e))throw Error(x(299));var n=!1,r="",a=Td;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(a=t.onRecoverableError)),t=Eo(e,1,!1,null,null,n,!1,r,a),e[et]=t.current,nr(e.nodeType===8?e.parentNode:e),new Ao(t)};Ce.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(x(188)):(e=Object.keys(e).join(","),Error(x(268,e)));return e=Qc(t),e=e===null?null:e.stateNode,e};Ce.flushSync=function(e){return $t(e)};Ce.hydrate=function(e,t,n){if(!Xa(t))throw Error(x(200));return Ya(null,e,t,!0,n)};Ce.hydrateRoot=function(e,t,n){if(!_o(e))throw Error(x(405));var r=n!=null&&n.hydratedSources||null,a=!1,i="",s=Td;if(n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(i=n.identifierPrefix),n.onRecoverableError!==void 0&&(s=n.onRecoverableError)),t=Cd(t,null,e,1,n??null,a,!1,i,s),e[et]=t.current,nr(e),r)for(e=0;e<r.length;e++)n=r[e],a=n._getVersion,a=a(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,a]:t.mutableSourceEagerHydrationData.push(n,a);return new Ka(t)};Ce.render=function(e,t,n){if(!Xa(t))throw Error(x(200));return Ya(null,e,t,!1,n)};Ce.unmountComponentAtNode=function(e){if(!Xa(e))throw Error(x(40));return e._reactRootContainer?($t(function(){Ya(null,null,e,!1,function(){e._reactRootContainer=null,e[et]=null})}),!0):!1};Ce.unstable_batchedUpdates=xo;Ce.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Xa(n))throw Error(x(200));if(e==null||e._reactInternals===void 0)throw Error(x(38));return Ya(e,t,n,!1,r)};Ce.version="18.3.1-next-f1338f8080-20240426";function Ed(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Ed)}catch(e){console.error(e)}}Ed(),Ec.exports=Ce;var Ap=Ec.exports,Pd,Ul=Ap;Pd=Ul.createRoot,Ul.hydrateRoot;/**
 * @remix-run/router v1.23.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function dr(){return dr=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},dr.apply(null,arguments)}var dt;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(dt||(dt={}));const $l="popstate";function _p(e){e===void 0&&(e={});function t(r,a){let{pathname:i,search:s,hash:o}=r.location;return Ss("",{pathname:i,search:s,hash:o},a.state&&a.state.usr||null,a.state&&a.state.key||"default")}function n(r,a){return typeof a=="string"?a:La(a)}return Rp(t,n,null,e)}function Q(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function Lo(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function Lp(){return Math.random().toString(36).substr(2,8)}function Hl(e,t){return{usr:e.state,key:e.key,idx:t}}function Ss(e,t,n,r){return n===void 0&&(n=null),dr({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?Tn(t):t,{state:n,key:t&&t.key||r||Lp()})}function La(e){let{pathname:t="/",search:n="",hash:r=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),r&&r!=="#"&&(t+=r.charAt(0)==="#"?r:"#"+r),t}function Tn(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let r=e.indexOf("?");r>=0&&(t.search=e.substr(r),e=e.substr(0,r)),e&&(t.pathname=e)}return t}function Rp(e,t,n,r){r===void 0&&(r={});let{window:a=document.defaultView,v5Compat:i=!1}=r,s=a.history,o=dt.Pop,l=null,c=u();c==null&&(c=0,s.replaceState(dr({},s.state,{idx:c}),""));function u(){return(s.state||{idx:null}).idx}function d(){o=dt.Pop;let S=u(),p=S==null?null:S-c;c=S,l&&l({action:o,location:v.location,delta:p})}function f(S,p){o=dt.Push;let h=Ss(v.location,S,p);c=u()+1;let m=Hl(h,c),w=v.createHref(h);try{s.pushState(m,"",w)}catch(C){if(C instanceof DOMException&&C.name==="DataCloneError")throw C;a.location.assign(w)}i&&l&&l({action:o,location:v.location,delta:1})}function g(S,p){o=dt.Replace;let h=Ss(v.location,S,p);c=u();let m=Hl(h,c),w=v.createHref(h);s.replaceState(m,"",w),i&&l&&l({action:o,location:v.location,delta:0})}function y(S){let p=a.location.origin!=="null"?a.location.origin:a.location.href,h=typeof S=="string"?S:La(S);return h=h.replace(/ $/,"%20"),Q(p,"No window.location.(origin|href) available to create URL for href: "+h),new URL(h,p)}let v={get action(){return o},get location(){return e(a,s)},listen(S){if(l)throw new Error("A history only accepts one active listener");return a.addEventListener($l,d),l=S,()=>{a.removeEventListener($l,d),l=null}},createHref(S){return t(a,S)},createURL:y,encodeLocation(S){let p=y(S);return{pathname:p.pathname,search:p.search,hash:p.hash}},push:f,replace:g,go(S){return s.go(S)}};return v}var Vl;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(Vl||(Vl={}));function Np(e,t,n){return n===void 0&&(n="/"),Ip(e,t,n)}function Ip(e,t,n,r){let a=typeof t=="string"?Tn(t):t,i=kn(a.pathname||"/",n);if(i==null)return null;let s=Ad(e);Dp(s);let o=null,l=Hp(i);for(let c=0;o==null&&c<s.length;++c)o=Up(s[c],l);return o}function Ad(e,t,n,r){t===void 0&&(t=[]),n===void 0&&(n=[]),r===void 0&&(r="");let a=(i,s,o)=>{let l={relativePath:o===void 0?i.path||"":o,caseSensitive:i.caseSensitive===!0,childrenIndex:s,route:i};l.relativePath.startsWith("/")&&(Q(l.relativePath.startsWith(r),'Absolute route path "'+l.relativePath+'" nested under path '+('"'+r+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),l.relativePath=l.relativePath.slice(r.length));let c=bt([r,l.relativePath]),u=n.concat(l);i.children&&i.children.length>0&&(Q(i.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+c+'".')),Ad(i.children,t,u,c)),!(i.path==null&&!i.index)&&t.push({path:c,score:Wp(c,i.index),routesMeta:u})};return e.forEach((i,s)=>{var o;if(i.path===""||!((o=i.path)!=null&&o.includes("?")))a(i,s);else for(let l of _d(i.path))a(i,s,l)}),t}function _d(e){let t=e.split("/");if(t.length===0)return[];let[n,...r]=t,a=n.endsWith("?"),i=n.replace(/\?$/,"");if(r.length===0)return a?[i,""]:[i];let s=_d(r.join("/")),o=[];return o.push(...s.map(l=>l===""?i:[i,l].join("/"))),a&&o.push(...s),o.map(l=>e.startsWith("/")&&l===""?"/":l)}function Dp(e){e.sort((t,n)=>t.score!==n.score?n.score-t.score:Fp(t.routesMeta.map(r=>r.childrenIndex),n.routesMeta.map(r=>r.childrenIndex)))}const Mp=/^:[\w-]+$/,jp=3,Op=2,Bp=1,zp=10,qp=-2,Ql=e=>e==="*";function Wp(e,t){let n=e.split("/"),r=n.length;return n.some(Ql)&&(r+=qp),t&&(r+=Op),n.filter(a=>!Ql(a)).reduce((a,i)=>a+(Mp.test(i)?jp:i===""?Bp:zp),r)}function Fp(e,t){return e.length===t.length&&e.slice(0,-1).every((r,a)=>r===t[a])?e[e.length-1]-t[t.length-1]:0}function Up(e,t,n){let{routesMeta:r}=e,a={},i="/",s=[];for(let o=0;o<r.length;++o){let l=r[o],c=o===r.length-1,u=i==="/"?t:t.slice(i.length)||"/",d=Cs({path:l.relativePath,caseSensitive:l.caseSensitive,end:c},u),f=l.route;if(!d)return null;Object.assign(a,d.params),s.push({params:a,pathname:bt([i,d.pathname]),pathnameBase:Xp(bt([i,d.pathnameBase])),route:f}),d.pathnameBase!=="/"&&(i=bt([i,d.pathnameBase]))}return s}function Cs(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[n,r]=$p(e.path,e.caseSensitive,e.end),a=t.match(n);if(!a)return null;let i=a[0],s=i.replace(/(.)\/+$/,"$1"),o=a.slice(1);return{params:r.reduce((c,u,d)=>{let{paramName:f,isOptional:g}=u;if(f==="*"){let v=o[d]||"";s=i.slice(0,i.length-v.length).replace(/(.)\/+$/,"$1")}const y=o[d];return g&&!y?c[f]=void 0:c[f]=(y||"").replace(/%2F/g,"/"),c},{}),pathname:i,pathnameBase:s,pattern:e}}function $p(e,t,n){t===void 0&&(t=!1),n===void 0&&(n=!0),Lo(e==="*"||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were '+('"'+e.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+e.replace(/\*$/,"/*")+'".'));let r=[],a="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(s,o,l)=>(r.push({paramName:o,isOptional:l!=null}),l?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(r.push({paramName:"*"}),a+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?a+="\\/*$":e!==""&&e!=="/"&&(a+="(?:(?=\\/|$))"),[new RegExp(a,t?void 0:"i"),r]}function Hp(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return Lo(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+t+").")),e}}function kn(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,r=e.charAt(n);return r&&r!=="/"?null:e.slice(n)||"/"}const Vp=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Qp=e=>Vp.test(e);function Gp(e,t){t===void 0&&(t="/");let{pathname:n,search:r="",hash:a=""}=typeof e=="string"?Tn(e):e,i;if(n)if(Qp(n))i=n;else{if(n.includes("//")){let s=n;n=Nd(n),Lo(!1,"Pathnames cannot have embedded double slashes - normalizing "+(s+" -> "+n))}n.startsWith("/")?i=Gl(n.substring(1),"/"):i=Gl(n,t)}else i=t;return{pathname:i,search:Yp(r),hash:Jp(a)}}function Gl(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(a=>{a===".."?n.length>1&&n.pop():a!=="."&&n.push(a)}),n.length>1?n.join("/"):"/"}function _i(e,t,n,r){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(r)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function Kp(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function Ld(e,t){let n=Kp(e);return t?n.map((r,a)=>a===n.length-1?r.pathname:r.pathnameBase):n.map(r=>r.pathnameBase)}function Rd(e,t,n,r){r===void 0&&(r=!1);let a;typeof e=="string"?a=Tn(e):(a=dr({},e),Q(!a.pathname||!a.pathname.includes("?"),_i("?","pathname","search",a)),Q(!a.pathname||!a.pathname.includes("#"),_i("#","pathname","hash",a)),Q(!a.search||!a.search.includes("#"),_i("#","search","hash",a)));let i=e===""||a.pathname==="",s=i?"/":a.pathname,o;if(s==null)o=n;else{let d=t.length-1;if(!r&&s.startsWith("..")){let f=s.split("/");for(;f[0]==="..";)f.shift(),d-=1;a.pathname=f.join("/")}o=d>=0?t[d]:"/"}let l=Gp(a,o),c=s&&s!=="/"&&s.endsWith("/"),u=(i||s===".")&&n.endsWith("/");return!l.pathname.endsWith("/")&&(c||u)&&(l.pathname+="/"),l}const Nd=e=>e.replace(/\/\/+/g,"/"),bt=e=>Nd(e.join("/")),Xp=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),Yp=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,Jp=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function Zp(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}const Id=["post","put","patch","delete"];new Set(Id);const em=["get",...Id];new Set(em);/**
 * React Router v6.30.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function hr(){return hr=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},hr.apply(null,arguments)}const Ja=k.createContext(null),Dd=k.createContext(null),Et=k.createContext(null),Za=k.createContext(null),Pt=k.createContext({outlet:null,matches:[],isDataRoute:!1}),Md=k.createContext(null);function tm(e,t){let{relative:n}=t===void 0?{}:t;wr()||Q(!1);let{basename:r,navigator:a}=k.useContext(Et),{hash:i,pathname:s,search:o}=ei(e,{relative:n}),l=s;return r!=="/"&&(l=s==="/"?r:bt([r,s])),a.createHref({pathname:l,search:o,hash:i})}function wr(){return k.useContext(Za)!=null}function br(){return wr()||Q(!1),k.useContext(Za).location}function jd(e){k.useContext(Et).static||k.useLayoutEffect(e)}function Od(){let{isDataRoute:e}=k.useContext(Pt);return e?mm():nm()}function nm(){wr()||Q(!1);let e=k.useContext(Ja),{basename:t,future:n,navigator:r}=k.useContext(Et),{matches:a}=k.useContext(Pt),{pathname:i}=br(),s=JSON.stringify(Ld(a,n.v7_relativeSplatPath)),o=k.useRef(!1);return jd(()=>{o.current=!0}),k.useCallback(function(c,u){if(u===void 0&&(u={}),!o.current)return;if(typeof c=="number"){r.go(c);return}let d=Rd(c,JSON.parse(s),i,u.relative==="path");e==null&&t!=="/"&&(d.pathname=d.pathname==="/"?t:bt([t,d.pathname])),(u.replace?r.replace:r.push)(d,u.state,u)},[t,r,s,i,e])}function rm(){let{matches:e}=k.useContext(Pt),t=e[e.length-1];return t?t.params:{}}function ei(e,t){let{relative:n}=t===void 0?{}:t,{future:r}=k.useContext(Et),{matches:a}=k.useContext(Pt),{pathname:i}=br(),s=JSON.stringify(Ld(a,r.v7_relativeSplatPath));return k.useMemo(()=>Rd(e,JSON.parse(s),i,n==="path"),[e,s,i,n])}function am(e,t){return im(e,t)}function im(e,t,n,r){wr()||Q(!1);let{navigator:a}=k.useContext(Et),{matches:i}=k.useContext(Pt),s=i[i.length-1],o=s?s.params:{};s&&s.pathname;let l=s?s.pathnameBase:"/";s&&s.route;let c=br(),u;if(t){var d;let S=typeof t=="string"?Tn(t):t;l==="/"||(d=S.pathname)!=null&&d.startsWith(l)||Q(!1),u=S}else u=c;let f=u.pathname||"/",g=f;if(l!=="/"){let S=l.replace(/^\//,"").split("/");g="/"+f.replace(/^\//,"").split("/").slice(S.length).join("/")}let y=Np(e,{pathname:g}),v=um(y&&y.map(S=>Object.assign({},S,{params:Object.assign({},o,S.params),pathname:bt([l,a.encodeLocation?a.encodeLocation(S.pathname).pathname:S.pathname]),pathnameBase:S.pathnameBase==="/"?l:bt([l,a.encodeLocation?a.encodeLocation(S.pathnameBase).pathname:S.pathnameBase])})),i,n,r);return t&&v?k.createElement(Za.Provider,{value:{location:hr({pathname:"/",search:"",hash:"",state:null,key:"default"},u),navigationType:dt.Pop}},v):v}function sm(){let e=pm(),t=Zp(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,a={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return k.createElement(k.Fragment,null,k.createElement("h2",null,"Unexpected Application Error!"),k.createElement("h3",{style:{fontStyle:"italic"}},t),n?k.createElement("pre",{style:a},n):null,null)}const om=k.createElement(sm,null);class lm extends k.Component{constructor(t){super(t),this.state={location:t.location,revalidation:t.revalidation,error:t.error}}static getDerivedStateFromError(t){return{error:t}}static getDerivedStateFromProps(t,n){return n.location!==t.location||n.revalidation!=="idle"&&t.revalidation==="idle"?{error:t.error,location:t.location,revalidation:t.revalidation}:{error:t.error!==void 0?t.error:n.error,location:n.location,revalidation:t.revalidation||n.revalidation}}componentDidCatch(t,n){console.error("React Router caught the following error during render",t,n)}render(){return this.state.error!==void 0?k.createElement(Pt.Provider,{value:this.props.routeContext},k.createElement(Md.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function cm(e){let{routeContext:t,match:n,children:r}=e,a=k.useContext(Ja);return a&&a.static&&a.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(a.staticContext._deepestRenderedBoundaryId=n.route.id),k.createElement(Pt.Provider,{value:t},r)}function um(e,t,n,r){var a;if(t===void 0&&(t=[]),n===void 0&&(n=null),r===void 0&&(r=null),e==null){var i;if(!n)return null;if(n.errors)e=n.matches;else if((i=r)!=null&&i.v7_partialHydration&&t.length===0&&!n.initialized&&n.matches.length>0)e=n.matches;else return null}let s=e,o=(a=n)==null?void 0:a.errors;if(o!=null){let u=s.findIndex(d=>d.route.id&&(o==null?void 0:o[d.route.id])!==void 0);u>=0||Q(!1),s=s.slice(0,Math.min(s.length,u+1))}let l=!1,c=-1;if(n&&r&&r.v7_partialHydration)for(let u=0;u<s.length;u++){let d=s[u];if((d.route.HydrateFallback||d.route.hydrateFallbackElement)&&(c=u),d.route.id){let{loaderData:f,errors:g}=n,y=d.route.loader&&f[d.route.id]===void 0&&(!g||g[d.route.id]===void 0);if(d.route.lazy||y){l=!0,c>=0?s=s.slice(0,c+1):s=[s[0]];break}}}return s.reduceRight((u,d,f)=>{let g,y=!1,v=null,S=null;n&&(g=o&&d.route.id?o[d.route.id]:void 0,v=d.route.errorElement||om,l&&(c<0&&f===0?(gm("route-fallback"),y=!0,S=null):c===f&&(y=!0,S=d.route.hydrateFallbackElement||null)));let p=t.concat(s.slice(0,f+1)),h=()=>{let m;return g?m=v:y?m=S:d.route.Component?m=k.createElement(d.route.Component,null):d.route.element?m=d.route.element:m=u,k.createElement(cm,{match:d,routeContext:{outlet:u,matches:p,isDataRoute:n!=null},children:m})};return n&&(d.route.ErrorBoundary||d.route.errorElement||f===0)?k.createElement(lm,{location:n.location,revalidation:n.revalidation,component:v,error:g,children:h(),routeContext:{outlet:null,matches:p,isDataRoute:!0}}):h()},null)}var Bd=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(Bd||{}),zd=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(zd||{});function dm(e){let t=k.useContext(Ja);return t||Q(!1),t}function hm(e){let t=k.useContext(Dd);return t||Q(!1),t}function fm(e){let t=k.useContext(Pt);return t||Q(!1),t}function qd(e){let t=fm(),n=t.matches[t.matches.length-1];return n.route.id||Q(!1),n.route.id}function pm(){var e;let t=k.useContext(Md),n=hm(),r=qd();return t!==void 0?t:(e=n.errors)==null?void 0:e[r]}function mm(){let{router:e}=dm(Bd.UseNavigateStable),t=qd(zd.UseNavigateStable),n=k.useRef(!1);return jd(()=>{n.current=!0}),k.useCallback(function(a,i){i===void 0&&(i={}),n.current&&(typeof a=="number"?e.navigate(a):e.navigate(a,hr({fromRouteId:t},i)))},[e,t])}const Kl={};function gm(e,t,n){Kl[e]||(Kl[e]=!0)}function ym(e,t){e==null||e.v7_startTransition,e==null||e.v7_relativeSplatPath}function na(e){Q(!1)}function vm(e){let{basename:t="/",children:n=null,location:r,navigationType:a=dt.Pop,navigator:i,static:s=!1,future:o}=e;wr()&&Q(!1);let l=t.replace(/^\/*/,"/"),c=k.useMemo(()=>({basename:l,navigator:i,static:s,future:hr({v7_relativeSplatPath:!1},o)}),[l,o,i,s]);typeof r=="string"&&(r=Tn(r));let{pathname:u="/",search:d="",hash:f="",state:g=null,key:y="default"}=r,v=k.useMemo(()=>{let S=kn(u,l);return S==null?null:{location:{pathname:S,search:d,hash:f,state:g,key:y},navigationType:a}},[l,u,d,f,g,y,a]);return v==null?null:k.createElement(Et.Provider,{value:c},k.createElement(Za.Provider,{children:n,value:v}))}function wm(e){let{children:t,location:n}=e;return am(Ts(t),n)}new Promise(()=>{});function Ts(e,t){t===void 0&&(t=[]);let n=[];return k.Children.forEach(e,(r,a)=>{if(!k.isValidElement(r))return;let i=[...t,a];if(r.type===k.Fragment){n.push.apply(n,Ts(r.props.children,i));return}r.type!==na&&Q(!1),!r.props.index||!r.props.children||Q(!1);let s={id:r.props.id||i.join("-"),caseSensitive:r.props.caseSensitive,element:r.props.element,Component:r.props.Component,index:r.props.index,path:r.props.path,loader:r.props.loader,action:r.props.action,errorElement:r.props.errorElement,ErrorBoundary:r.props.ErrorBoundary,hasErrorBoundary:r.props.ErrorBoundary!=null||r.props.errorElement!=null,shouldRevalidate:r.props.shouldRevalidate,handle:r.props.handle,lazy:r.props.lazy};r.props.children&&(s.children=Ts(r.props.children,i)),n.push(s)}),n}/**
 * React Router DOM v6.30.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Ra(){return Ra=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Ra.apply(null,arguments)}function Wd(e,t){if(e==null)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(t.indexOf(r)!==-1)continue;n[r]=e[r]}return n}function bm(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function km(e,t){return e.button===0&&(!t||t==="_self")&&!bm(e)}const xm=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],Sm=["aria-current","caseSensitive","className","end","style","to","viewTransition","children"],Cm="6";try{window.__reactRouterVersion=Cm}catch{}const Tm=k.createContext({isTransitioning:!1}),Em="startTransition",Xl=gh[Em];function Pm(e){let{basename:t,children:n,future:r,window:a}=e,i=k.useRef();i.current==null&&(i.current=_p({window:a,v5Compat:!0}));let s=i.current,[o,l]=k.useState({action:s.action,location:s.location}),{v7_startTransition:c}=r||{},u=k.useCallback(d=>{c&&Xl?Xl(()=>l(d)):l(d)},[l,c]);return k.useLayoutEffect(()=>s.listen(u),[s,u]),k.useEffect(()=>ym(r),[r]),k.createElement(vm,{basename:t,children:n,location:o.location,navigationType:o.action,navigator:s,future:r})}const Am=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",_m=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,kr=k.forwardRef(function(t,n){let{onClick:r,relative:a,reloadDocument:i,replace:s,state:o,target:l,to:c,preventScrollReset:u,viewTransition:d}=t,f=Wd(t,xm),{basename:g}=k.useContext(Et),y,v=!1;if(typeof c=="string"&&_m.test(c)&&(y=c,Am))try{let m=new URL(window.location.href),w=c.startsWith("//")?new URL(m.protocol+c):new URL(c),C=kn(w.pathname,g);w.origin===m.origin&&C!=null?c=C+w.search+w.hash:v=!0}catch{}let S=tm(c,{relative:a}),p=Nm(c,{replace:s,state:o,target:l,preventScrollReset:u,relative:a,viewTransition:d});function h(m){r&&r(m),m.defaultPrevented||p(m)}return k.createElement("a",Ra({},f,{href:y||S,onClick:v||i?r:h,ref:n,target:l}))}),Lm=k.forwardRef(function(t,n){let{"aria-current":r="page",caseSensitive:a=!1,className:i="",end:s=!1,style:o,to:l,viewTransition:c,children:u}=t,d=Wd(t,Sm),f=ei(l,{relative:d.relative}),g=br(),y=k.useContext(Dd),{navigator:v,basename:S}=k.useContext(Et),p=y!=null&&Im(f)&&c===!0,h=v.encodeLocation?v.encodeLocation(f).pathname:f.pathname,m=g.pathname,w=y&&y.navigation&&y.navigation.location?y.navigation.location.pathname:null;a||(m=m.toLowerCase(),w=w?w.toLowerCase():null,h=h.toLowerCase()),w&&S&&(w=kn(w,S)||w);const C=h!=="/"&&h.endsWith("/")?h.length-1:h.length;let T=m===h||!s&&m.startsWith(h)&&m.charAt(C)==="/",A=w!=null&&(w===h||!s&&w.startsWith(h)&&w.charAt(h.length)==="/"),_={isActive:T,isPending:A,isTransitioning:p},N=T?r:void 0,L;typeof i=="function"?L=i(_):L=[i,T?"active":null,A?"pending":null,p?"transitioning":null].filter(Boolean).join(" ");let B=typeof o=="function"?o(_):o;return k.createElement(kr,Ra({},d,{"aria-current":N,className:L,ref:n,style:B,to:l,viewTransition:c}),typeof u=="function"?u(_):u)});var Es;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(Es||(Es={}));var Yl;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(Yl||(Yl={}));function Rm(e){let t=k.useContext(Ja);return t||Q(!1),t}function Nm(e,t){let{target:n,replace:r,state:a,preventScrollReset:i,relative:s,viewTransition:o}=t===void 0?{}:t,l=Od(),c=br(),u=ei(e,{relative:s});return k.useCallback(d=>{if(km(d,n)){d.preventDefault();let f=r!==void 0?r:La(c)===La(u);l(e,{replace:f,state:a,preventScrollReset:i,relative:s,viewTransition:o})}},[c,l,u,r,a,n,e,i,s,o])}function Im(e,t){t===void 0&&(t={});let n=k.useContext(Tm);n==null&&Q(!1);let{basename:r}=Rm(Es.useViewTransitionState),a=ei(e,{relative:t.relative});if(!n.isTransitioning)return!1;let i=kn(n.currentLocation.pathname,r)||n.currentLocation.pathname,s=kn(n.nextLocation.pathname,r)||n.nextLocation.pathname;return Cs(a.pathname,s)!=null||Cs(a.pathname,i)!=null}const on={get(e,t){try{const n=window.localStorage.getItem(e);return n===null?t:JSON.parse(n)}catch{return t}},set(e,t){try{return window.localStorage.setItem(e,JSON.stringify(t)),!0}catch{return!1}},remove(e){try{window.localStorage.removeItem(e)}catch{}}},Fd="dev-nuggets:theme",Ud=k.createContext(void 0);function Dm(){var t;const e=on.get(Fd,void 0);return e==="light"||e==="dark"?e:(t=window.matchMedia)!=null&&t.call(window,"(prefers-color-scheme: dark)").matches?"dark":"light"}function Mm({children:e}){const[t,n]=k.useState(Dm);k.useEffect(()=>{document.documentElement.classList.toggle("dark",t==="dark"),on.set(Fd,t)},[t]);const r=k.useCallback(()=>{n(a=>a==="dark"?"light":"dark")},[]);return b.jsx(Ud.Provider,{value:{theme:t,toggleTheme:r},children:e})}function jm(){const e=k.useContext(Ud);if(!e)throw new Error("useTheme must be used within a ThemeProvider");return e}const Om=`## What it is

**Expand-Contract** (aka _parallel change_) is a technique for making a
backwards-incompatible change (to a database schema, an API, a function
signature) without one risky, all-at-once cutover. Instead of changing
something in place, you move through three phases:

1. **Expand** — add the new thing alongside the old thing. Both work at once.
2. **Migrate** — move callers/data over to the new thing, one at a time,
   while the old thing still works as a fallback.
3. **Contract** — once nothing depends on the old thing anymore, remove it.

\`\`\`mermaid
flowchart LR
    A["Expand<br/>add new, keep old"] --> B["Migrate<br/>move callers over"]
    B --> C["Contract<br/>remove old"]
\`\`\`

## Why it matters

Changing the shape of something in one atomic step forces every caller to
update in lockstep. That's fine for a single codebase deployed all at once,
but falls apart the moment more than one thing depends on the old shape:
multiple services, a live database with in-flight rows, mobile clients on
old app versions. Expand-contract decouples "ship the new capability" from
"finish the migration," so each step is small, reversible, and
independently deployable.

## Example: renaming a database column

Say \`users.name\` needs to become \`users.full_name\`.

**1. Expand** — add the new column, write to both:

\`\`\`sql
ALTER TABLE users ADD COLUMN full_name TEXT;
\`\`\`

\`\`\`python
def save_user(user, input_name):
    user.name = input_name       # old
    user.full_name = input_name  # new — write both during the transition
    db.save(user)
\`\`\`

**2. Migrate** — backfill existing rows, then flip readers over to the new
column one at a time:

\`\`\`sql
UPDATE users SET full_name = name WHERE full_name IS NULL;
\`\`\`

**3. Contract** — once every reader uses \`full_name\`, stop writing \`name\`
and drop it:

\`\`\`sql
ALTER TABLE users DROP COLUMN name;
\`\`\`

## Where else it applies

- **APIs** — add a new field/endpoint, deprecate the old one once clients
  have migrated, remove it in a later release.
- **Function signatures** — add a new parameter with a default, migrate
  call sites, then remove the old parameter.
- **Feature flags** — often used to control which phase of the migration is
  active for a given deployment.

## What makes it safe

The pattern trades one risky change for three small, reversible ones. At
any point before "contract," you can pause or roll back without breaking
anything: the old path still works. Safety comes from _never being in a
state where only the new thing works_, until it's been proven under real
usage.
`,Bm={id:"expand-contract",title:"Expand-Contract Pattern",tags:["patterns","migrations"],body:Om,format:"nugget"},zm=`## What it is

An operation is **idempotent** if performing it more than once has the same
effect as performing it once. \`PUT /users/5 { name: "Alex" }\` is idempotent —
running it three times leaves the same end state as running it once.
\`POST /payments { amount: 10 }\` is not — running it three times charges the
card three times.

## Why it matters

Networks fail in the middle of requests. A client that times out waiting for
a response has no way to know whether the server actually processed the
request or not. So the only safe move is to retry. Idempotency is what
makes that retry safe: if the first attempt _did_ go through, the retry is a
no-op instead of a duplicate side effect.

\`\`\`mermaid
sequenceDiagram
    participant Client
    participant Server
    Client->>Server: POST /payments (idempotency-key: abc123)
    Server-->>Client: timeout, no response
    Client->>Server: retry: POST /payments (idempotency-key: abc123)
    Server->>Server: seen abc123 already — return prior result
    Server-->>Client: 200 OK (original charge, not a new one)
\`\`\`

## Idempotency keys

For operations that aren't naturally idempotent (like "charge a card"), the
standard fix is an **idempotency key** — a client-generated unique id sent
with the request. The server remembers keys it has already processed and
returns the original result instead of repeating the side effect:

\`\`\`python
def charge_card(idempotency_key, amount):
    existing = db.find_by_idempotency_key(idempotency_key)
    if existing:
        return existing.result  # already processed — return it, don't re-charge

    result = payment_gateway.charge(amount)
    db.save_idempotency_key(idempotency_key, result)
    return result
\`\`\`

The key is usually generated once per logical user action (e.g. once per
"place order" click) and reused across all retries of that same action.
Generating a new key per retry defeats the purpose entirely.

## Where it applies

- **Payment APIs** — Stripe, for example, requires an \`Idempotency-Key\`
  header on charge creation for exactly this reason.
- **Message queues** — consumers should be idempotent, since most queues
  guarantee _at-least-once_ delivery, not _exactly-once_.
- **Serverless functions** — asynchronous invocations (see
  [Serverless & AWS Lambda](/guides/serverless-aws-lambda)) retry
  automatically on failure by default, with no code requesting it. That
  makes idempotency non-optional, not just good practice.
- **Database writes** — \`UPSERT\`/\`INSERT ... ON CONFLICT\` are idempotent by
  construction; a naive \`INSERT\` retried after a timeout can create
  duplicates.

Practically every client on a real network will eventually retry a request
it isn't sure succeeded — a timeout doesn't tell you whether the server got
the message. Idempotency, or an idempotency key standing in for it, is the
mechanism that makes that retry harmless: a duplicate charge, order, or
email doesn't happen just because the network hiccuped.
`,qm={id:"idempotency",title:"Idempotency",tags:["apis","reliability"],body:zm,format:"nugget"},Wm=`## What it is

**Exponential backoff** is a retry strategy where the wait time between
retries grows exponentially (\`base * 2^attempt\`) instead of retrying
immediately or waiting a fixed interval. **Jitter** adds randomness to that
wait time so retries from many clients don't land in sync.

## Why it matters

Retrying immediately after a failure just recreates the condition that
caused it: if a server is overloaded, a client hammering it with instant
retries only makes that worse. Spacing retries out exponentially gives the
failing system room to recover instead of getting hit again a millisecond
later.

Backoff alone isn't enough, though: if every client computes the same delay
sequence, they all back off _in lockstep_. A thousand clients that all
failed at once will all retry again at exactly the same moment: a
synchronized retry storm that can look just as bad as no backoff at all.
Jitter breaks that synchronization by adding randomness to the delay.

\`\`\`mermaid
sequenceDiagram
    participant Client
    participant Server
    Client->>Server: request
    Server-->>Client: 503 (overloaded)
    Note over Client: wait ~1s + jitter
    Client->>Server: retry 1
    Server-->>Client: 503
    Note over Client: wait ~2s + jitter
    Client->>Server: retry 2
    Server-->>Client: 200 OK
\`\`\`

## Example: full jitter

"Full jitter" (picking a random delay between 0 and the exponential cap,
rather than the exponential value plus a small random offset) tends to
spread retries out the most evenly:

\`\`\`python
import random

def backoff_delay(attempt, base=1.0, cap=30.0):
    exponential = min(cap, base * (2 ** attempt))
    return random.uniform(0, exponential)
\`\`\`

## Where it applies

- HTTP client retry logic (most SDKs — AWS, Stripe, etc. — implement this
  by default for retryable errors).
- Message queue consumers redelivering failed messages.
- Anywhere a client might retry a request against a shared, possibly
  struggling dependency — which is most distributed systems. Because
  retries assume it's _safe_ to retry, this pairs directly with
  [idempotency](/nuggets/idempotency): backoff decides _when_ to retry,
  idempotency is what makes the retry safe to send at all.

## Backoff vs. jitter

Backoff protects the failing system from being retried too aggressively by
any one client. Jitter protects it from being retried in a synchronized
wave by _all_ clients at once. They solve two different problems and are
almost always used together.
`,Fm={id:"exponential-backoff",title:"Exponential Backoff & Jitter",tags:["reliability","apis"],body:Wm,format:"nugget"},Um=`## What it is

The **outbox pattern** reliably publishes an event as part of a database
change, by writing the event to an "outbox" table in the _same_ transaction
as the business data, then relaying it to a real message broker
separately.

## Why it matters

Say an order service needs to both save an order to Postgres _and_ publish
an \`OrderCreated\` event to Kafka. Doing that as two separate steps (commit
to the database, then publish to the broker) has no atomic guarantee
across two different systems. If the process crashes between the two
steps, you either lose the event (crash before publishing) or, if you
retry the whole operation, risk creating a duplicate order. This is the
**dual-write problem**, and there's no way to wrap a database commit and a
Kafka publish in one transaction — they're different systems with no
shared coordinator.

## How it works

Instead of publishing directly, write the event to an outbox table
alongside the business data, in one transaction:

\`\`\`sql
BEGIN;
INSERT INTO orders (id, customer_id, total) VALUES ('o1', 'c1', 42.00);
INSERT INTO outbox (id, event_type, payload, sent)
  VALUES ('e1', 'OrderCreated', '{"order_id": "o1"}', false);
COMMIT;
\`\`\`

A separate relay process (polling the table, or tailing the database's
write-ahead log, Debezium-style change data capture) reads unsent outbox
rows, publishes them to the real broker, and marks them sent:

\`\`\`mermaid
flowchart LR
    A["App: write order + outbox row<br/>(one transaction)"] --> B[(Database)]
    B --> C["Relay: poll/tail outbox"]
    C --> D["Broker (Kafka, SQS, ...)"]
\`\`\`

Because the event and the business data commit atomically, the event can
never be lost, and it's never published before the data it describes
actually exists.

## Where it applies

Any service that needs "change the database" and "notify the rest of the
system" to happen together — order processing, inventory updates, anything
event-driven built on a relational store.

## The tradeoff, and why it's fine

The outbox pattern swaps an unsafe dual-write for a safe single write plus
a relay, but that safety comes as _at-least-once_ delivery, not
exactly-once: the relay can crash after publishing but before marking a
row sent, and will re-publish it on restart. Consumers of these events
need to be [idempotent](/nuggets/idempotency) for exactly this reason —
the reliability outbox buys on the publish side only pays off if the
receive side can safely handle the same event twice.
`,$m={id:"outbox-pattern",title:"Outbox Pattern",tags:["reliability","patterns","messaging"],body:Um,format:"nugget"},Hm=`The **N+1 query problem**: code fetches a list of \`N\` records, then loops
over them making one _additional_ query per record to fetch related data —
1 query to get the list, plus N more, instead of a small constant number.

## Example

Fetching 50 blog posts, then each post's author separately:

\`\`\`python
posts = db.query("SELECT * FROM posts LIMIT 50")  # 1 query

for post in posts:
    post.author = db.query(
        "SELECT * FROM users WHERE id = ?", post.author_id
    )  # 1 query, run 50 times
\`\`\`

That's 51 round-trips to the database to render one page. With a join or a
batched lookup, it's 1 or 2:

\`\`\`python
# one query with a join
posts = db.query("""
    SELECT posts.*, users.name AS author_name
    FROM posts JOIN users ON users.id = posts.author_id
    LIMIT 50
""")

# or: one query per *type*, not per row
posts = db.query("SELECT * FROM posts LIMIT 50")
author_ids = [p.author_id for p in posts]
authors = db.query("SELECT * FROM users WHERE id IN (?)", author_ids)
\`\`\`

## Why it matters

It's invisible in development. With 10 rows of test data, 11 queries is
fast enough that nothing looks wrong. In production with 5,000 rows, it's
5,001 sequential round-trips per request: the classic bug that only shows
up once there's real data, and by then it's often deep inside an ORM's
lazy-loading behavior rather than an obvious loop in application code.

## How to spot it

- Query logging or counting in tests — assert the number of queries a code
  path issues, not just its output.
- APM/tracing tools showing a request made dozens of near-identical queries
  differing only by one \`WHERE id = ?\` value.
- ORM debug logs during development are the cheapest early warning — most
  ORMs (Django, ActiveRecord, SQLAlchemy) have a query-count assertion or
  a "N+1 detected" warning mode for exactly this reason.

N+1 is about the _number_ of queries; a slow query even after fixing that
is usually a missing [index](/nuggets/database-indexing): the other half
of "why is this page slow."

## The fix, generalized

Almost every fix reduces to the same move: turn N queries into 1, either
with a join or by collecting the ids first and issuing one batched
\`WHERE id IN (...)\` query instead of querying inside the loop. Where the
data fetch sits relative to the loop is the entire bug — move it before
the loop and the N+1 disappears regardless of how it originally got
introduced.
`,Vm={id:"n-plus-one-queries",title:"The N+1 Query Problem",tags:["databases","performance"],body:Hm,format:"nugget"},Qm=`## What it is

A **circuit breaker**, named after the electrical version, stops a service
from repeatedly calling a downstream dependency that's already failing.
Instead of letting every request wait out a timeout against something
that's clearly down, it "trips" and fails fast for a cooldown period.

## The three states

\`\`\`mermaid
stateDiagram-v2
    [*] --> Closed
    Closed --> Open: failure threshold exceeded
    Open --> HalfOpen: after cooldown timeout
    HalfOpen --> Closed: trial request succeeds
    HalfOpen --> Open: trial request fails
\`\`\`

- **Closed** — normal operation. Requests pass through to the dependency;
  failures are counted.
- **Open** — the failure threshold was hit. Requests fail immediately,
  without calling the dependency at all, for a cooldown period.
- **Half-Open** — after the cooldown, a small number of trial requests are
  let through. Success closes the breaker again; failure reopens it.

## Why it matters

Without a circuit breaker, a struggling dependency gets hit by every
caller retrying (possibly with [backoff](/nuggets/exponential-backoff),
but still hit), which can be exactly what prevents it from ever recovering.
Every caller also pays the cost of waiting out a full timeout on each
failed call, tying up threads/connections for something that was never
going to succeed.

Failing fast while the breaker is open avoids both problems: the
downstream service gets a chance to recover without added load, and
callers get an immediate, predictable failure instead of hanging on a
timeout.

## Example

\`\`\`python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, cooldown_seconds=30):
        self.failures = 0
        self.state = "closed"
        self.opened_at = None
        self.failure_threshold = failure_threshold
        self.cooldown_seconds = cooldown_seconds

    def call(self, fn):
        if self.state == "open":
            if time.time() - self.opened_at < self.cooldown_seconds:
                raise CircuitOpenError()
            self.state = "half-open"

        try:
            result = fn()
        except Exception:
            self.failures += 1
            if self.state == "half-open" or self.failures >= self.failure_threshold:
                self.state = "open"
                self.opened_at = time.time()
            raise
        else:
            self.failures = 0
            self.state = "closed"
            return result
\`\`\`

## Common uses

Service-to-service calls in a microservice architecture (Netflix's Hystrix
popularized the pattern), database connection pools, and any call to an
external dependency that can degrade under load.

## Backoff vs. circuit breakers

Backoff and circuit breakers solve complementary problems: backoff helps a
_caller_ survive a transient failure by spacing out its own retries; a
circuit breaker protects the _callee_ from being overwhelmed by every
caller's retries at once. Real systems generally need both.
`,Gm={id:"circuit-breaker",title:"Circuit Breaker",tags:["reliability","patterns"],body:Qm,format:"nugget"},Km=`## What it is

The **CAP theorem**: in a distributed system, when a network partition
happens, you have to choose between **Consistency** (every read sees the
latest write) and **Availability** (every request gets a response). You
can't guarantee both at the same time.

\`\`\`mermaid
flowchart TD
    A[Network partition occurs] --> B{Respond anyway?}
    B -->|Yes: Availability| C[Might return stale or conflicting data]
    B -->|No: wait for agreement| D[Consistent, but the request times out]
\`\`\`

## Why it matters

Network partitions aren't a rare edge case to design around later — packet
loss, a crashed node, a slow link between data centers, all happen
regularly at scale. CAP forces a decision about what your system does when
that happens, and it's much better to make that decision deliberately at
design time than to discover it during an incident.

## "Pick two of three" is a bit of a misnomer

CAP is often summarized as "pick 2 of C, A, P," as if **CA** (consistent
and available, but not partition-tolerant) were a real option. In practice
it isn't. Any system distributed across more than one node will
eventually experience a partition, so partition tolerance isn't optional.
The real choice is what happens _during_ a partition: stay consistent and
refuse some requests (**CP**), or stay available and risk serving stale or
conflicting data (**AP**).

## Examples

- **CP**: systems built on consensus protocols (ZooKeeper, etcd) —
  they'd rather return an error than risk an inconsistent read.
- **AP**: Cassandra (in its default configuration), DNS — they keep
  serving during a partition and reconcile conflicting writes afterward.

## PACELC: the tradeoff CAP leaves out

CAP only describes behavior _during_ a partition: it says nothing about
the rest of the time, when the network is perfectly healthy. **PACELC**
extends it: **if Partition, choose Availability or Consistency (that's
CAP) — Else, choose Latency or Consistency.**

Even with a healthy network, a system that wants every read to see the
latest write has to synchronously confirm that write against enough
replicas before acknowledging it, which costs latency. A system that
acknowledges a write as soon as it hits one node, replicating to the
others asynchronously, is faster but a read against a different replica
immediately afterward can return stale data. That's a real tradeoff even
when there's no partition in sight.

\`\`\`mermaid
flowchart TD
    P{Partition?}
    P -->|Yes| CAP["A vs. C — this is CAP"]
    P -->|No| EL["L vs. C — the part CAP doesn't cover"]
\`\`\`

This is why "AP" doesn't fully describe a system like DynamoDB or
Cassandra: they're **PA/EL** — available over consistent during a
partition, _and_ latency over consistency the rest of the time too, by
design (no synchronous cross-replica confirmation even when the network
is fine). A traditional single-leader relational database with
synchronous replication is closer to **PC/EC** — consistent both during
and outside a partition, paying the latency cost in both cases. Naming
just the partition behavior ("it's AP") is the incomplete half of the
answer an interviewer asking about CAP is usually listening for.

## Where it applies

Choosing a database (a strongly consistent relational store vs. an
eventually consistent NoSQL store), and designing any service replicated
across multiple regions or availability zones.

## Choose it deliberately

CAP is specifically about behavior _during_ a partition — the rest of the
time, a well-designed system can be both consistent and available in the
CAP sense, though PACELC shows it still trades latency for consistency
even then. Either way, it's a tradeoff to choose deliberately up front,
not a limitation to discover under pressure mid-incident.
`,Xm={id:"cap-theorem",title:"CAP Theorem",tags:["patterns","reliability"],body:Km,format:"nugget"},Ym=`## What it is

Techniques for keeping a cache from serving stale data once the
underlying data changes. The three common strategies are **TTL**
(time-based expiry), **cache-aside** (the app reads through the cache and
explicitly invalidates on write), and **write-through** (writes go to the
cache and the database together). For the question of _whether_ and _how
stale_ a given piece of data is allowed to be in the first place, see
[Cache vs. Freshness](/nuggets/cache-vs-freshness). This nugget is about
the mechanics of keeping a cache correct once you've decided to use one.

## Why it matters

> "There are only two hard things in Computer Science: cache invalidation
> and naming things." — Phil Karlton

Caching itself is easy: store a value, return it next time. Keeping that
value correct once the source of truth changes is the actual hard part,
and getting it wrong means serving stale data silently, which is much
worse than serving no cache at all.

## Cache-aside (lazy loading)

\`\`\`mermaid
flowchart TD
    subgraph Read
    R1[App reads cache] -->|miss| R2[Read from DB] --> R3[Populate cache] --> R4[Return value]
    R1 -->|hit| R4
    end
    subgraph Write
    W1[App writes to DB] --> W2[Delete the cache key]
    end
\`\`\`

The app reads through the cache and populates it on a miss. On write, it
writes to the database, then **deletes** the cache key rather than
updating it: a delete-and-repopulate-on-next-read avoids a race where two
concurrent writes finish out of order and leave the cache holding the
_older_ write's value forever.

\`\`\`python
def get_user(user_id):
    cached = cache.get(f"user:{user_id}")
    if cached is not None:
        return cached
    user = db.query("SELECT * FROM users WHERE id = ?", user_id)
    cache.set(f"user:{user_id}", user, ttl=300)
    return user

def update_user(user_id, changes):
    db.update("users", user_id, changes)
    cache.delete(f"user:{user_id}")  # not cache.set(...) — see above
\`\`\`

## Write-through

Every write goes to the cache and the database together, as one path: the
cache is always current the instant a write happens. The cost is added
latency on every write, and a cold cache still needs a first-read fallback
(or pre-warming) for keys that have never been written since the cache
started.

## TTL as a backstop

Even with cache-aside or write-through, a short TTL is worth keeping as a
safety net: it bounds how long any missed invalidation (a bug, a write
that bypassed the normal path) can stay wrong.

## Where it applies

Anywhere a cache sits in front of a slower source of truth: Redis/Memcached
in front of a database, HTTP caching, CDNs in front of an origin server.

## Framing the design question

No strategy eliminates staleness completely; the real design question is
how much staleness is acceptable, and for how long. A cache is rarely
simply "correct" or "broken" — pick, or combine, strategies that keep
staleness within whatever bound the data actually needs.
`,Jm={id:"cache-invalidation",title:"Cache Invalidation",tags:["performance","patterns"],body:Ym,format:"nugget"},Zm=`## What it is

Rate limiting caps how many requests a client can make in a given window,
protecting a shared service from being overwhelmed by any single caller:
the server-side sibling of [Circuit Breaker](/nuggets/circuit-breaker),
which protects a _caller_ from a struggling dependency.

## Algorithms

**Token bucket**: a bucket holds up to \`capacity\` tokens and refills at a
fixed rate. Each request consumes one token; if the bucket is empty, the
request is rejected or delayed. This allows short bursts up to the bucket
size, as long as the average rate stays within the refill rate.

\`\`\`mermaid
flowchart LR
    R["Refill: +1 token/sec"] --> Bucket(("Token bucket<br/>capacity: 10"))
    Bucket --> Req["Request consumes 1 token"]
    Req -->|bucket empty| Reject["429 Too Many Requests"]
\`\`\`

**Leaky bucket**: requests queue up and are processed at a fixed rate
regardless of how bursty their arrival was. It smooths traffic to a
constant output rate rather than allowing bursts through.

\`\`\`python
class TokenBucket:
    def __init__(self, capacity, refill_rate_per_sec):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate_per_sec
        self.last_refill = time.monotonic()

    def allow(self):
        now = time.monotonic()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now

        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
\`\`\`

## Why it matters

Without rate limiting, a single misbehaving client (a bug, a retry storm,
or a malicious actor) can consume all of a shared resource, degrading the
service for every other client. It's the same class of failure that
[Exponential Backoff](/nuggets/exponential-backoff) and Circuit Breaker
protect against, but from the other side: those protect a caller from a
failing dependency, rate limiting protects a dependency from too many
callers.

## Sliding window: the more precise alternative

Token/leaky bucket track a running balance, not actual request timestamps,
which is efficient but imprecise at window boundaries: a client could
send a full burst right before a fixed window resets and another right
after, doubling up right at the seam. Two sliding-window approaches fix
that at different cost points:

- **Sliding window log** — store the timestamp of every request (e.g. in
  a Redis sorted set), and on each new request, evict everything older
  than \`now - window\` and count what's left. Exactly correct, but memory
  scales with request volume per key, not with a constant.
- **Sliding window counter** — an approximation that stays O(1): keep a
  count for the current fixed window and the previous one, and weight the
  previous window's count by how much of it still overlaps the sliding
  window:

  \`\`\`python
  def sliding_window_count(current_count, previous_count, elapsed_fraction):
      # elapsed_fraction: how far into the current window "now" is (0.0-1.0)
      return current_count + previous_count * (1 - elapsed_fraction)
  \`\`\`

  This assumes requests were spread evenly through the previous window,
  which isn't exactly true, but it's a close enough approximation for most
  rate limiters, at a fraction of the log's memory cost.

## Making it work across multiple servers

A counter that lives in one process's memory only limits requests hitting
_that_ process: behind a load balancer with 10 instances, each enforcing
"100 requests/minute" independently effectively allows 1,000. The fix is
centralizing the counter somewhere every instance shares, typically
Redis:

\`\`\`
INCR ratelimit:user:42
EXPIRE ratelimit:user:42 60
\`\`\`

Run as two separate commands, this has a race: if the process crashes (or
the connection drops) between \`INCR\` and \`EXPIRE\`, that key never expires
and silently rate-limits the user forever. The fix is making the
check-and-increment atomic — either a Lua script (Redis executes a script
as a single atomic step) or \`SET key 1 NX EX 60\` to create-with-expiry
only on the very first request in a window, then plain \`INCR\` afterward:

\`\`\`lua
-- atomic in Redis: increment, and set the expiry only on the first hit
local count = redis.call('INCR', KEYS[1])
if count == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return count
\`\`\`

## Where it applies

Public APIs (Stripe, GitHub, and most SaaS APIs rate-limit per API key),
internal service-to-service calls in a microservice architecture, and
login endpoints (rate limiting is a standard defense against brute-force
attacks).

## Complementary, not interchangeable

Rate limiting and circuit breakers are complementary, not interchangeable:
one protects a shared resource from its callers, the other protects a
caller from a failing dependency. A resilient system generally needs both,
on both sides of every important call.
`,eg={id:"rate-limiting",title:"Rate Limiting",tags:["apis","reliability"],body:Zm,format:"nugget"},tg=`## What it is

An index is an auxiliary data structure (usually a B-tree) that lets a
database find matching rows without scanning the whole table. It trades
extra storage and slower writes for much faster reads on the indexed
columns.

## Why it matters

Without an index, \`WHERE email = ?\` has to check every row (a "sequential
scan" / "table scan"): fine with a few hundred rows, catastrophic with a
few million. This is the other half of "why is this query slow" alongside
[the N+1 query problem](/nuggets/n-plus-one-queries): N+1 is about issuing
too many queries, indexing is about making each individual query fast.

## How it works, briefly

A B-tree keeps keys sorted in a shallow, wide tree structure, so a lookup
is \`O(log n)\` (a handful of comparisons) instead of \`O(n)\`, checking every
row one at a time. A composite index (built on multiple columns) is sorted
by the first column, then the second within ties, and so on. That's why
it only helps a query that filters on a matching left-to-right prefix of
those columns.

\`\`\`sql
CREATE INDEX idx_users_email ON users (email);

EXPLAIN SELECT * FROM users WHERE email = 'a@example.com';
-- without the index: Seq Scan on users
-- with the index:    Index Scan using idx_users_email
\`\`\`

## Other index types

B-tree is the default and handles equality and range queries
(\`=\`, \`<\`, \`BETWEEN\`, \`ORDER BY\`) well, but it's not the only structure:

- **Hash index** — O(1) lookup for exact-match equality, but can't serve a
  range query or an \`ORDER BY\` at all, since a hash has no notion of
  "near": two adjacent keys can hash to completely unrelated buckets.
- **GIN / GiST** (Postgres) — built for values that aren't a single
  scalar: full-text search, JSONB containment queries (\`@>\`), array
  membership, geospatial data. A B-tree can't index "does this JSONB
  column contain this key" efficiently; GIN can.
- **Bitmap index** — one bit per row per distinct value, cheap to combine
  with AND/OR across multiple conditions. Rarely created explicitly, but
  query planners (Postgres's bitmap heap scan) build one on the fly to
  merge several lower-cardinality conditions before touching the table.

## Clustered vs. non-clustered

A **clustered** index determines the actual physical order rows are
stored in on disk: there can only be one per table (rows can only be
sorted one way at once), and it's usually the primary key by default. A
**non-clustered** index is a separate structure: sorted keys that each
point back to the row's location, rather than containing the row itself.

That extra pointer-chase is why a non-clustered index lookup is often two
steps, not one: find the key in the index, then jump to the row it
points at (a "bookmark lookup"). A **covering index** avoids the second
step entirely by including every column the query needs directly in the
index itself, so the database can answer the query from the index alone
without ever touching the table (an "index-only scan"):

\`\`\`sql
-- covers a query that only selects id and email — no table lookup needed
CREATE INDEX idx_users_email_covering ON users (email) INCLUDE (id);
\`\`\`

## When it doesn't help — or actively hurts

- Every index speeds up reads on that column but slows down every
  \`INSERT\`/\`UPDATE\`/\`DELETE\` on the table, since the index has to be
  maintained too. Indexing everything "just in case" has a real,
  ongoing cost.
- Low-cardinality columns (like a boolean) often don't benefit much — the
  query planner may decide a sequential scan is cheaper than jumping in
  and out of an index for a value half the rows share.
- A composite index on \`(a, b)\` helps a query filtering on \`a\`, or on
  \`a AND b\`, but not one filtering on \`b\` alone.

## Where it applies

Any relational database, and the same idea shows up conceptually in search
backends like Elasticsearch (an inverted index) and in NoSQL stores with
secondary indexes.

## Rule of thumb

Index the columns your queries actually filter, sort, or join on — no
more, no less — and use \`EXPLAIN\` (or your database's equivalent) to
confirm a query is actually using the index you expect, rather than
assuming it.
`,ng={id:"database-indexing",title:"Database Indexing",tags:["databases","performance"],body:tg,format:"nugget"},rg=`## What it is

A model for how a healthy test suite should be shaped: many small, fast
**unit tests** at the base, fewer **integration tests** in the middle, and
a small number of slow **end-to-end tests** at the top.

\`\`\`mermaid
flowchart TD
    A["End-to-end — few, slow, high confidence"] --> B["Integration — some, moderate speed"]
    B --> C["Unit — many, fast, isolated"]
\`\`\`

## Why it matters

Inverting the pyramid (mostly end-to-end tests, few unit tests; sometimes
called the "ice cream cone") is a common trap. End-to-end tests are slow
and prone to flaking on things unrelated to the actual bug (timing,
network, test environment), so a suite dominated by them becomes slow
enough, and unreliable enough, that people start skipping it. Unit tests
are fast and precise (a failure points at almost exactly the broken
line), so they should carry the bulk of the coverage.

## The layers

- **Unit** — one function or class, in isolation, no real I/O.
  Milliseconds each; thousands can run in seconds. Should cover the
  majority of logic and edge cases.
- **Integration** — a few real pieces working together (a repository
  against a real test database, for example), which catches the bugs that
  unit tests with mocks miss, like a query that doesn't actually match the
  real schema. Fewer of these; slower.
- **End-to-end** — drives the whole system through its real interface (a
  browser, a full API call). Catches things nothing else can, like a
  button that isn't actually wired up. But it's slow and often flaky, so
  it's reserved for the critical paths only.

## Where it applies

Any codebase with more than a handful of tests, and any PR review where
the question is "is this the _right kind_ of test for what's being
verified," not just "is there a test."

## Using it as a guide, not a ratio

Treat the shape as a reminder, not a target ratio to hit exactly: test
cost and confidence trade off differently at each layer, so coverage
should sit as low (fast, isolated) as it can while still catching real
bugs, saving the expensive layers for what only they can verify.
`,ag={id:"testing-pyramid",title:"The Testing Pyramid",tags:["testing"],body:rg,format:"nugget"},ig=`## What it is

SQL injection: an attacker supplies input that gets concatenated directly
into a SQL query, changing what the query actually does. It happens
whenever a query is built by gluing strings together instead of using
parameters.

\`\`\`python
# vulnerable — user_input becomes part of the SQL itself
query = f"SELECT * FROM users WHERE email = '{user_input}'"
db.execute(query)
\`\`\`

If \`user_input\` is \`' OR '1'='1\`, the query becomes
\`WHERE email = '' OR '1'='1'\`: true for every row, returning the entire
table. If it's \`'; DROP TABLE users; --\`, the database may execute that as
a second statement entirely.

## Why it matters

It's consistently one of the most common and most damaging vulnerabilities
in software (a mainstay of the OWASP Top 10 for a reason). A successful
injection can read, modify, or delete an entire database, or bypass
authentication outright, and the vulnerable code often looks completely
unremarkable until someone tests it with the right input.

## The fix: parameterized queries

Never build SQL by concatenating or interpolating untrusted input directly
into it. Use parameterized queries (prepared statements), where the query
structure and the data are sent to the database separately: the driver
guarantees the data can never be interpreted as SQL syntax, no matter what
it contains.

\`\`\`python
# safe — value is passed separately, never interpreted as SQL
query = "SELECT * FROM users WHERE email = ?"
db.execute(query, (user_input,))
\`\`\`

Every mainstream database driver and ORM supports this. There's rarely a
good reason to build a query by string concatenation at all.

## Where it applies

Any code that builds a database query from external input — form fields,
URL parameters, HTTP headers, even values that "shouldn't" contain SQL
syntax (attackers don't respect that assumption). The same underlying bug
class (untrusted input treated as code) also shows up as command
injection and, in a different form, cross-site scripting.

## The actual rule

The real rule is never let input be interpreted as code in the first
place, not "sanitize or escape it carefully" after the fact — sanitization
has to be remembered and done correctly on every single query, and one
missed spot is all it takes. Parameterized queries make the safe behavior
the default instead of a discipline every developer has to maintain by
hand.
`,sg={id:"sql-injection",title:"SQL Injection & Parameterized Queries",tags:["security","databases"],body:ig,format:"nugget"},og=`## What it is

SemVer: a version number format \`MAJOR.MINOR.PATCH\` (e.g. \`2.4.1\`) where
each part signals a specific kind of change: **MAJOR** for a breaking
change, **MINOR** for new backwards-compatible functionality, **PATCH**
for a backwards-compatible bug fix.

## Why it matters

A version number is a promise, not just a label. If consumers can trust
that a MINOR or PATCH bump never breaks them, they can upgrade freely
without reading every changelog. If MAJOR bumps are the _only_ ones that
can break them, they know exactly when to budget time for a migration.
Break that promise once (a breaking change hidden in a patch release)
and consumers stop trusting version numbers at all, which defeats the
entire point of having them.

## The rules, briefly

- **MAJOR** — any backwards-incompatible change: a removed or renamed
  field, changed behavior, dropped support for something.
- **MINOR** — new, backwards-compatible functionality: a new optional
  field, a new endpoint, a new opt-in parameter.
- **PATCH** — a backwards-compatible bug fix, with no new functionality.
- **\`0.x.y\`** — by convention, anything can change at any version bump
  before \`1.0.0\`. Don't rely on stability from a pre-1.0 package.

## Where it applies

Published packages and libraries (npm, PyPI, and most other registries
follow SemVer), public APIs, and internal shared libraries consumed by
other teams: anywhere something is versioned and used by code you don't
control.

## The actual discipline

Treat SemVer as a promise to consumers, not paperwork filled out after
the fact: decide before shipping whether a change is genuinely
backwards-compatible, and let that decision determine which number to
bump. Bumping the number to match a change you've already shipped, rather
than deciding compatibility up front, is how the promise quietly stops
meaning anything.
`,lg={id:"semantic-versioning",title:"Semantic Versioning",tags:["apis","patterns"],body:og,format:"nugget"},cg=`## What it is

Two different ways to bring one branch's changes into another. **Merge**
creates a new commit that ties the two histories together, preserving both
exactly as they happened. **Rebase** replays one branch's commits on top
of the other, rewriting them with new commit hashes, producing a linear
history, as if they'd been written on top of the latest code all along.

\`\`\`mermaid
gitGraph
    commit id: "A"
    commit id: "B"
    branch feature
    checkout feature
    commit id: "C"
    checkout main
    commit id: "D"
    checkout feature
    merge main
\`\`\`

That's what a **merge** produces — both branches' commits stay exactly as
they were, tied together by a merge commit. A **rebase** of \`feature\` onto
\`main\` instead would produce a straight line (\`A → B → D → C'\`) where
\`C'\` is a brand-new commit with the same changes as \`C\`, but a different
hash, as if it had been written after \`D\` from the start.

## Why it matters

The choice affects both what your history looks like and how conflicts
get resolved. Merge preserves exactly what happened, including merge
commits that can clutter a log with noise. Rebase produces a clean,
linear, easy-to-read history. But it rewrites commit hashes, which is
dangerous on any branch other people have already pulled: their local
history now diverges from the rewritten one, and reconciling the two is
painful. This is the reasoning behind the rule "never rebase a branch
others have already based work on."

## Rule of thumb

- **Rebase** your own local, not-yet-shared feature branch onto the latest
  \`main\` before opening or updating a pull request: clean, linear
  history, no noise merge commits.
- **Merge** (never rebase) once a branch is shared or public, or when
  merging a completed feature branch into \`main\`: don't rewrite history
  other people depend on.

## Where it applies

Every day, for anyone using git on a team. It's also the source of the
difference between \`git pull\` (a merge by default) and
\`git pull --rebase\`.

## The short version

Rebase for a cleaner history on work only you have; merge once a branch is
shared with anyone else. The risk of rebase is entirely about rewriting
commits other people have already built on top of: on your own unshared
branch, there's nothing to break.
`,ug={id:"git-rebase-vs-merge",title:"Git Rebase vs. Merge",tags:["git"],body:cg,format:"nugget"},dg=`## What it is

A hashing scheme for distributing keys across a set of nodes (cache
servers, database shards) such that adding or removing a node only
requires remapping a small fraction of the keys, not all of them.

## Why it matters

The naive approach is \`node = hash(key) % number_of_nodes\`. It works, but
the moment the node count changes (a server added, one crashes) the
modulo result changes for almost every key at once. Nearly the entire
dataset needs to move or re-cache in one go, often at exactly the worst
time: right after a node has just failed and the system is already under
stress.

## How it works, briefly

Both nodes and keys are hashed onto the same fixed circular range: a
"ring." A key belongs to whichever node comes first going clockwise from
the key's position on the ring.

\`\`\`mermaid
flowchart LR
    K1["hash(key A)"] -.-> N1((Node 1))
    K2["hash(key B)"] -.-> N2((Node 2))
    N1 --> N2 --> N3((Node 3)) --> N1
\`\`\`

Adding or removing a node only affects the keys between it and its
neighbor on the ring. Everything else stays exactly where it was.

## Virtual nodes

In practice, each physical node is hashed onto multiple points on the
ring ("virtual nodes"), so load balances evenly even with a small number
of physical nodes. Without this, a physical node could end up owning a
disproportionately large or small arc of the ring purely by chance.

## Where it applies

Distributed caches (client-side hashing for Memcached), distributed
databases and sharding (Cassandra, DynamoDB), and load balancers
distributing sticky sessions across backend instances.

## Why this beats the naive approach

That's the entire benefit over \`hash(key) % n\`: adding or removing a node
becomes a small, local, proportional change instead of a full-dataset
reshuffle, which is what makes horizontally scaling a cache or a shard set
an ordinary operation instead of a scheduled-maintenance event.
`,hg={id:"consistent-hashing",title:"Consistent Hashing",tags:["databases","performance"],body:dg,format:"nugget"},fg=`## What it is

Observability is the ability to understand what's happening inside a
running system from its external outputs, built from three complementary
signal types: **metrics** (aggregated numbers over time — request rate,
error rate, latency), **logs** (discrete, timestamped events with detail),
and **traces** (the path a single request takes as it moves through
multiple services).

## Why it matters

Each signal answers a different question, and none of them alone is
enough:

- **Metrics** tell you _something_ is wrong: the error rate just spiked.
  Cheap to store, great for dashboards and alerts, but low detail: they
  can't tell you which specific request failed or why.
- **Logs** tell you _what happened_ for one event, in detail. But at
  scale, grepping through logs across dozens of service instances to
  reconstruct a single request's path is slow and painful.
- **Traces** tell you _where_ it went wrong across a distributed call
  graph: which of six services a slow request spent four of its five
  seconds inside.

## How they fit together

\`\`\`mermaid
flowchart LR
    A["Metrics: something's wrong"] --> B["Traces: where"]
    B --> C["Logs: why"]
\`\`\`

A typical flow: a dashboard's error-rate metric spikes, an alert fires,
traces for slow or failed requests in that window narrow down which
service is the bottleneck, and that service's logs (found via the trace
ID) give the full detail of what actually happened.

## Where it applies

Any production system beyond a single process. The tooling differs
(Prometheus/Grafana for metrics, structured logging plus a log aggregator,
OpenTelemetry/Jaeger for traces) but the three-signal model is consistent
everywhere. It's also exactly the toolkit for finding out why a
[circuit breaker](/nuggets/circuit-breaker) tripped, or why
[retries](/nuggets/exponential-backoff) aren't succeeding.

## Debugging order

Start with metrics to confirm something's wrong, traces to find where, and
logs to learn why, in that order. Jumping straight to logs, the most
common instinct, means combing through detail before knowing where to
even look, which is a big part of why debugging production incidents so
often takes longer than it should.
`,pg={id:"observability",title:"Observability: Metrics, Logs, and Traces",tags:["reliability"],body:fg,format:"nugget"},mg=`## What it is

An **API** is a contract for how one program calls another — shaped
however that service's authors chose (REST endpoints, RPC methods, a
GraphQL schema). A client has to be written specifically for that one
API. **MCP** (Model Context Protocol) is a standardized protocol for
connecting an AI model or agent to tools and data sources — one common
interface (list the available tools, call a tool, fetch a resource) that
any MCP-compatible client can speak, regardless of what's actually running
behind it.

## Why it matters

Before MCP, wiring an LLM agent up to a new tool meant writing custom glue
code that translated between the model's function-calling format and that
particular service's own API shape — every new integration, for every
client, from scratch. MCP standardizes that last mile: a server author
implements the MCP interface once, and any MCP client (Claude Desktop,
Claude Code, or anything else that speaks the protocol) can use it without
bespoke integration code.

\`\`\`mermaid
flowchart TB
    subgraph "Without a shared protocol"
    C1[Client A] --> S1["Tool 1's API"]
    C1 --> S2["Tool 2's API"]
    C2[Client B] --> S1
    C2 --> S2
    end
\`\`\`

\`\`\`mermaid
flowchart LR
    subgraph "With MCP"
    D1[Client A] --> P((MCP))
    D2[Client B] --> P
    P --> T1[Tool 1]
    P --> T2[Tool 2]
    end
\`\`\`

Without a shared protocol, connecting \`N\` clients to \`M\` tools takes up to
\`N × M\` custom integrations. With a shared protocol, it takes \`N + M\` — each
client implements MCP once, each tool exposes an MCP server once.
[Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
solved the exact same problem for code editors and language tooling, and
MCP is explicitly modeled on that idea.

## Example: what a tool call actually looks like

Calling a REST API directly means knowing its specific shape in advance,
including its base URL, its auth scheme, and this particular endpoint's
parameters:

\`\`\`
GET /repos/octocat/hello-world/issues?state=open
Authorization: Bearer <token>
\`\`\`

An MCP client never needs to know that shape ahead of time. It asks the
server what tools it offers, then calls one by name with arguments: the
same two-step shape for any MCP server, whether it's wrapping GitHub's
API, a local database, or a file system (this is simplified — the real
protocol is JSON-RPC 2.0 with additional envelope fields):

\`\`\`json
// 1. discover: "what can you do?"
{ "name": "list_issues",
  "description": "List open issues in a repo",
  "inputSchema": { "repo": "string", "state": "string" } }

// 2. call: invoke it by name, not by URL
{ "tool": "list_issues",
  "arguments": { "repo": "octocat/hello-world", "state": "open" } }
\`\`\`

## MCP doesn't replace APIs

An MCP server is very often just a thin wrapper _around_ an existing
API — a database, a REST service, a file system. MCP doesn't eliminate
the underlying API; it standardizes how an AI agent _discovers and calls_
whatever's behind that wrapper, so the agent doesn't need integration
code written specifically for that one service.

## Where it applies

Building or connecting tools for an LLM agent (file access, database
queries, third-party services): MCP is the layer between "the model wants
to take an action" and "the actual system that performs it," regardless of
what that system's own native API looks like.

## Different layers, not rivals

MCP and APIs solve different layers of the same problem: an API defines
what a service can do; MCP defines a common way for an AI agent to
discover and call _any_ service's capabilities without one-off integration
work per client, per tool.

MCP itself is a young, fast-moving spec — the discover/call shape above
is stable, but transport and session details have already changed more
than once (a 2026-07-28 revision moved the protocol to a stateless
transport, for one). Treat the mental model here as durable and check
the current spec at [modelcontextprotocol.io](https://modelcontextprotocol.io)
before relying on wire-level specifics.
`,gg={id:"mcp-vs-api",title:"MCP vs. API",tags:["ai","apis"],body:mg,format:"nugget"},yg=`## What it is

**Latency** is how long a single request takes to complete — "the response
came back in 120ms." **Throughput** is how much work a system gets through
per unit of time — "5,000 requests per second." They sound related, but
they're not the same measurement, and optimizing one can actively hurt the
other.

## Why it matters

**Batching** is the clearest example of the tradeoff. Processing items one
at a time keeps each item's latency low (it's handled immediately) but
caps throughput at whatever a single item costs. Batching many items
together amortizes fixed overhead (a network round-trip, a database
transaction) across all of them, raising throughput. But now the first
item in the batch has to wait for the batch to fill before it's processed
at all, raising its latency.

\`\`\`mermaid
flowchart LR
    subgraph "One at a time: low latency, low throughput"
    A1[item] --> B1[processed immediately]
    end
\`\`\`

\`\`\`mermaid
flowchart LR
    subgraph "Batched: higher throughput, higher latency per item"
    A2[item] --> Q[wait for batch to fill] --> B2[processed as a batch]
    end
\`\`\`

The same tension shows up with concurrency: adding more workers increases
throughput up to a point, but beyond that point, contention (lock waits,
CPU context-switching, queueing for a shared resource) starts increasing
the latency of each individual request even as total throughput keeps
climbing.

## Little's Law

A useful formula connecting the two: \`L = λW\` — the average number of
requests in a system (\`L\`) equals the arrival rate (\`λ\`) times the average
time each request spends in the system (\`W\`, i.e. latency). It's a
reminder that these numbers are mechanically linked: if throughput
(arrival rate) goes up and latency doesn't drop to compensate, the system
ends up holding more in-flight requests at once, which usually means
queueing, and queueing usually means latency gets worse next, not better.

For example: a service handling 50 requests/second (\`λ\`), each taking
200ms (\`W\` = 0.2s), has on average \`L = 50 × 0.2 = 10\` requests in flight
at any given moment: that's the concurrency it needs to sustain just to
keep up, before queueing even starts.

## Where it applies

System design generally — a search-autocomplete endpoint needs low latency
even at some throughput cost (a slow suggestion is useless even if the
backend could technically handle more), while a nightly batch ETL job wants
maximum throughput and can tolerate high latency for any single record.
Choosing between a synchronous request/response API and an async queued
one is usually a latency-vs-throughput decision in disguise.

## Which one wins

Most systems can't maximize both at once — there's a real design decision
in which one matters more for a given workload, and that answer differs by
endpoint, not just by system. Optimizing for the wrong one (batching a
user-facing request for throughput, or handling a bulk job one row at a
time for low per-row latency) is a common, avoidable performance mistake.
`,vg={id:"latency-vs-throughput",title:"Latency vs. Throughput",tags:["performance"],body:yg,format:"nugget"},wg=`## What it is

A **monolith** is a single deployable unit containing all of an
application's functionality — one codebase, one build, one deploy.
**Microservices** split the application into many independently deployable
services, each owning a narrow piece of functionality, talking to each
other over the network.

\`\`\`mermaid
flowchart TB
    subgraph Monolith
    M["Orders · Users · Payments · Inventory<br/>(one process, one deploy)"]
    end
\`\`\`

\`\`\`mermaid
flowchart LR
    Orders --> Payments
    Orders --> Inventory
    Users --> Orders
\`\`\`

## Why it matters

This is one of the most debated architecture decisions of the last
decade, and the industry consensus has genuinely shifted: from "everyone
should do microservices" in the mid-2010s to a more sober "start with a
monolith" default today, with some well-known microservices adopters
having since consolidated services back together. Both styles have real
costs that are easy to underestimate from the outside.

**Monolith tradeoffs**: simpler local development, testing, and
debugging. A stack trace is just a stack trace, not a hunt across five
services' logs. Deploys and (usually) database transactions are atomic. No
network calls between internal components means none of the distributed-
systems failure modes apply _internally_. The cost: the whole application
scales as one unit even if only one feature is actually under load, and a
large team working in one codebase creates real coordination friction.

**Microservices tradeoffs**: independent deployability (teams ship on
their own schedule) and independent scaling (scale only the service that's
hot). The cost is substantial operational complexity — service discovery,
network calls that can now fail or time out (needing
[retries with backoff](/nuggets/exponential-backoff),
[circuit breakers](/nuggets/circuit-breaker), and
[rate limiting](/nuggets/rate-limiting)), no more single-database ACID
transaction spanning the whole operation (needing patterns like the
[outbox pattern](/nuggets/outbox-pattern) and idempotent
consumers, see [idempotency](/nuggets/idempotency)), and debugging a
feature that now spans five services requires real
[observability](/nuggets/observability), not just a debugger attached to
one process. [CAP theorem](/nuggets/cap-theorem) tradeoffs, largely
invisible inside a monolith's single database, become unavoidable the
moment state is split across services.

## Where it applies

Choosing how to structure a new application, or deciding whether to split
an existing one. It's also the context behind "modular monolith": a
single deployable unit internally organized into clearly separated
modules with disciplined boundaries, aiming to keep the simplicity of one
deploy while making a future split easier if it's ever actually needed.

## Default to a monolith

Microservices trade simplicity for independent scalability and
deployability, a trade that only pays off once team size, deploy-cadence
conflicts, or real scaling needs justify the distributed-systems
complexity it costs. Adopting microservices before that need is real is a
common, expensive mistake: all of the operational cost, none of the
benefit yet. Default to a well-organized monolith, and split out a
service only when a specific, concrete pain point demands it.
`,bg={id:"monolith-vs-microservices",title:"Monolith vs. Microservices",tags:["patterns","reliability"],body:wg,format:"nugget"},kg=`## What it is

**SQL (relational) databases** store data in tables with a fixed schema
and enforce relationships between them, queried with SQL and typically
offering strong consistency and full ACID transactions. **NoSQL** is an
umbrella term for everything that isn't that — document stores (MongoDB),
key-value stores (DynamoDB, Redis), wide-column stores (Cassandra), and
graph databases — generally trading some of that structure and consistency
for flexibility or horizontal scale.

## Why it matters

The two aren't just "old vs. new"; they encode genuinely different
answers to real tradeoffs:

- **Schema**: a relational database enforces its schema on every write,
  catching malformed data immediately but making changes to that schema a
  coordinated migration (see [expand-contract](/nuggets/expand-contract)).
  Most document stores let each record's shape vary, which is flexible
  during early, fast-changing development but pushes the burden of
  validating "does this document actually look right" onto application
  code instead of the database.
- **Relationships**: SQL is built for joining related data across tables
  in a single query. NoSQL stores generally aren't — related data is
  often denormalized (duplicated) into a single document specifically to
  avoid needing a join, trading storage and update complexity for
  read speed.
- **Consistency vs. scale**: this is [CAP theorem](/nuggets/cap-theorem) in
  practice. Traditional relational databases are usually CP: strongly
  consistent, single-writer, harder to horizontally scale across regions.
  Many NoSQL stores are built AP-first: eventually consistent, but able
  to scale writes horizontally across many nodes, often using
  [consistent hashing](/nuggets/consistent-hashing) to distribute data.

\`\`\`mermaid
flowchart LR
    A["Need joins, transactions,<br/>strong consistency"] --> SQL[Relational]
    B["Need flexible schema,<br/>horizontal write scale"] --> NoSQL[NoSQL]
\`\`\`

The same data, modeled each way:

\`\`\`sql
-- SQL: related data stays normalized, joined at query time
SELECT orders.id, orders.total, customers.name
FROM orders JOIN customers ON customers.id = orders.customer_id;
\`\`\`

\`\`\`json
// Document store: the related data is denormalized into the order itself —
// no join needed to read it, but the customer's name now has to be kept in
// sync everywhere it's duplicated.
{
  "orderId": "o1",
  "total": 42.0,
  "customer": { "id": "c1", "name": "Alex" }
}
\`\`\`

## Where it applies

Choosing a primary data store for a new service, or recognizing when a
service using the "wrong" one for its access patterns is fighting its
database instead of being helped by it — a reporting system doing complex
ad-hoc joins wants SQL; a system ingesting a huge, bursty write volume of
loosely structured events often wants NoSQL.

## Picking one

Most real systems that live long enough end up using both, choosing
per-service or even per-data-type rather than committing one database to
the entire application. Framing the decision as "SQL or NoSQL" skips the
actual question, which is what this specific data needs: relationships,
transactions, and a fixed shape point toward SQL; flexible structure and
horizontal write scale point toward NoSQL. Neither wins in general, only
for a given access pattern.
`,xg={id:"sql-vs-nosql",title:"SQL vs. NoSQL",tags:["databases"],body:kg,format:"nugget"},Sg=`## What it is

Every cache makes the same trade: serve a stored answer quickly, or go get
the real, current answer slowly. **Cache** means fast, cheap, possibly
stale. **Freshness** means correct as of right now, at the cost of doing
the real work (a database query, an API call, a computation) every
single time.

## Why it matters

This is a decision to make deliberately per piece of data, not a single
global setting. Some data is expensive to compute and safe to serve
slightly stale: a product recommendation list, a dashboard's aggregate
stats, a page of mostly-static content. Other data is cheap to fetch fresh
and dangerous to serve stale: an account balance, whether a seat is still
available, a permission check. Caching the second kind for the sake of
speed can turn a performance win into a correctness bug.

\`\`\`mermaid
flowchart LR
    A["How wrong can this be,<br/>and for how long?"] -->|"a little, briefly"| B[Cache aggressively]
    A -->|"not at all"| C[Always fetch fresh]
    A -->|"somewhere between"| D["Short TTL"]
\`\`\`

## The dial: TTL

Time-to-live is the tuning knob between the two extremes — how long a
cached value is allowed to be served before it's considered stale and
refetched. A longer TTL means better performance and a bigger window where
readers might see outdated data; a shorter TTL means closer to fresh at the
cost of hitting the real source more often. There's rarely a single
correct TTL for a whole system: it should be set per piece of data, based
on how expensive it is to compute and how much staleness that particular
data can tolerate before it actually matters to whoever's reading it.

For the actual mechanics of keeping a cache correct as the underlying data
changes (cache-aside, write-through, invalidating on write), see
[Cache Invalidation](/nuggets/cache-invalidation).

## Where it applies

Every read path with a cache in front of a slower source: CDNs in front of
web content, an in-memory cache in front of a database, a client caching
an API response. Also shows up outside literal caches — a search index
that's rebuilt periodically instead of updated live is making the exact
same freshness-vs-cost trade.

## The question to actually ask

Don't ask whether to cache something; ask how stale it can get before
it's actually wrong for the person reading it. That answer is different
for nearly every piece of data in a system, which is why one TTL applied
everywhere is a mistake: a page-view counter and an account balance don't
have remotely the same tolerance for being wrong.
`,Cg={id:"cache-vs-freshness",title:"Cache vs. Freshness",tags:["performance","patterns"],body:Sg,format:"nugget"},Tg=`## What it is

**Abstraction** hides implementation details behind a simpler interface —
the caller depends on _what_ something does, not _how_. **Coupling** is
how much one part of a system depends on another's specific details.
They're related but not simple opposites: a _good_ abstraction reduces
coupling, but a leaky or badly-placed one can add layers of indirection
while the real coupling slips through underneath anyway.

\`\`\`mermaid
flowchart LR
    subgraph "Loosely coupled"
    A1[Caller] --> I[Interface] --> B1[Implementation]
    end
\`\`\`

\`\`\`mermaid
flowchart LR
    subgraph "Tightly coupled"
    A2[Caller] --> B2["Implementation details<br/>(no boundary between them)"]
    end
\`\`\`

## Example

\`\`\`python
# Tightly coupled — OrderService is locked to SMTP specifically. Switching
# email providers, or testing without sending real email, means changing
# OrderService itself.
class OrderService:
    def __init__(self):
        self.mailer = SmtpMailer("smtp.example.com")

    def complete_order(self, order):
        self.mailer.send(order.customer_email, "Order confirmed")

# Decoupled via an abstraction — OrderService depends on the Mailer
# interface, not a specific implementation. Any Mailer works, including a
# fake one in tests.
class OrderService:
    def __init__(self, mailer: Mailer):
        self.mailer = mailer

    def complete_order(self, order):
        self.mailer.send(order.customer_email, "Order confirmed")
\`\`\`

## Why it matters

The point of an abstraction is to let the implementation behind it change
without the caller needing to change too. That only works if the boundary
is drawn in the right place — at something that genuinely varies or needs
to be swappable. Draw it somewhere that doesn't actually vary, and you've
added a layer of indirection that buys nothing.

**Leaky abstractions** are the more common failure: the interface _looks_
like it hides the implementation, but callers end up depending on its
incidental behavior anyway. An ORM is the classic example — it abstracts
away writing SQL by hand, but a caller who doesn't understand what query
it actually generates can easily write code that triggers the
[N+1 query problem](/nuggets/n-plus-one-queries). The abstraction didn't
remove the coupling to the database's real behavior; it just hid it well
enough to make it easy to trip over.

## Premature abstraction

The opposite mistake is drawing a boundary before there's a second real
use case to justify it — an interface with exactly one implementation,
guessed at in advance. It adds indirection (another layer to read through,
another place a bug can hide) without buying any actual decoupling, since
there's nothing real being decoupled from yet. This is the same shape of
mistake as premature optimization: solving a flexibility problem you don't
have yet, at a real cost paid today.

## Where it applies

Interface and API design, module boundaries, and code review — a common
coupling smell is a caller reaching _through_ an abstraction to touch the
implementation's internals directly (a "leaky" import, a cast, a
documented-as-private field used anyway), which is a sign the abstraction
isn't actually where the real boundary needs to be.

## Where to draw the line

Place the boundary where change actually happens, not wherever adds the
most layers or removes the most direct calls — abstraction and coupling
are means, not scores to optimize for their own sake. A good abstraction
sits at a genuine seam and earns its indirection; a bad one is just extra
ceremony wrapped around the same underlying coupling, which still shows up
the moment something on the other side changes.
`,Eg={id:"abstraction-vs-coupling",title:"Abstraction vs. Coupling",tags:["patterns"],body:Tg,format:"nugget"},Pg=`## What it is

**Technical debt** is the cost of shortcuts taken now (skipped tests, a
hacky implementation, missing error handling, copy-pasted code) that
make future changes slower and riskier. **Time to market** is how fast
something can actually ship and get in front of real users. Doing it "the
right way" takes longer; cutting corners ships faster and defers the cost.
Neither "always do it right" nor "always ship the fastest possible thing"
is the correct answer on its own: the right balance depends on what's
actually being learned or won by shipping sooner.

## Why it matters

The debt metaphor is genuinely useful, not just a cute analogy, if taken
seriously: like financial debt, technical debt has interest. Every future
change to that hacky, undertested part of the codebase is slower and
riskier than it would have been done properly, until the debt is paid
down (refactored) or retired (that code stops being used). Left unpaid, it
compounds: each new feature built on top of a shortcut has to work around
it, and the shortcut gets more expensive to fix the longer it's load-bearing.

\`\`\`mermaid
flowchart LR
    A[Cut a corner] --> B{Deliberate and tracked?}
    B -->|Yes| C["Strategic debt — a loan taken<br/>on purpose, to be repaid later"]
    B -->|No| D["Reckless debt — accrues silently,<br/>often never repaid"]
\`\`\`

## Deliberate debt vs. reckless debt

This is the distinction that actually matters, more than "debt exists or
it doesn't." Debt taken on **deliberately** (a conscious decision to ship
the fast version first, in order to learn whether a feature is even worth
the investment, with an explicit plan to revisit it) is a legitimate
strategic tool. Debt taken on **recklessly** (not a decision at all, just
not knowing better, or running out of time and never coming back to it)
is the dangerous kind. It's invisible until it isn't, and by the time it's
visible (velocity has quietly ground down, or a "small" change turns out
to touch code nobody wants to modify) it's expensive to unwind.

## Where it applies

Startup MVPs and feature deadlines (where speed genuinely has outsized
value — a feature validated a week sooner might not need to exist at
all), sprint planning conversations about whether to refactor now or
later, and code review, where flagging a shortcut explicitly is what
turns reckless debt into deliberate, tracked debt.

## What actually matters

Taking on technical debt is sometimes the right call; taking it on
unconsciously, without a real plan to pay it back, is the actual mistake.
Name the shortcut explicitly (a TODO, a ticket, a comment explaining what
was skipped and why) so it stays a deliberate decision instead of quietly
becoming permanent.
`,Ag={id:"technical-debt-vs-time-to-market",title:"Technical Debt vs. Time to Market",tags:["process"],body:Pg,format:"nugget"},_g=`## What it is

Sharding splits a dataset across multiple database instances ("shards"),
each holding a subset of the rows, so no single machine has to store or
serve the whole dataset. The central design decision is the **shard
key** (which column(s) determine which shard a row lives on), since
that choice determines both how evenly data spreads and which queries
stay fast. For how this differs from partitioning within a single
instance, see
[Partitioning vs. Sharding](/nuggets/partitioning-vs-sharding).

## Strategies

- **Range-based**: shard by a value's range (e.g. user IDs 1–1M on shard
  A, 1M–2M on shard B). Simple, and range queries stay on one shard.
  But traffic and data are rarely uniform across ranges, creating hot
  shards (all new signups landing on the newest, single shard).
- **Hash-based**: hash the shard key and mod by shard count (or use
  [consistent hashing](/nuggets/consistent-hashing) to avoid a full
  reshuffle when shard count changes). Spreads load evenly, but a range
  query ("all orders from June") now has to fan out to every shard.
- **Directory-based**: a separate lookup service maps each key to its
  shard explicitly. Most flexible (individual keys can be rebalanced),
  but the directory itself becomes a critical, must-scale dependency and
  an extra hop on every query.

## Choosing a shard key

The right key is whatever the majority of queries filter by: sharding
by \`user_id\` is right when nearly every query is scoped to one user
(most SaaS apps); wrong if a common query needs to join across users
(e.g. "all orders in a region"), since that becomes a fan-out or
cross-shard join. There's rarely a shard key that's optimal for every
access pattern; the choice trades off which queries stay cheap.

## Hot shards

Any strategy can still concentrate load on one shard if the key
distribution is skewed: a celebrity user with 10x normal activity, a
viral product, a range of sequential IDs all created in the same burst.
Mitigations: composite keys that add entropy (\`user_id + random_suffix\`
for a write-heavy hot key), splitting an overloaded shard further, or
caching in front of the hot shard rather than resharding for one
outlier.

## Resharding

Changing the number of shards later is expensive under naive
hash-modulo sharding: nearly every key moves. The same problem
[consistent hashing](/nuggets/consistent-hashing) solves for cache
nodes applies directly to database shards, which is why systems built
for elastic scaling generally use it instead of a raw modulo.

## Where it applies

Any dataset too large or too hot for one database instance — user data
in a multi-tenant SaaS, event/analytics tables, anything sharded across
Cassandra, DynamoDB, Vitess, or Citus.

## No universal answer

There's no universally "correct" shard key, only one that matches the
dominant query pattern. Picking it is a decision about which queries
you're willing to make expensive (cross-shard) in exchange for making
the common ones cheap (single-shard).
`,Lg={id:"sharding-strategies",title:"Sharding Strategies",tags:["databases","performance","patterns"],body:_g,format:"nugget"},Rg=`## What it is

A rough set of latency, throughput, and storage figures worth having
memorized well enough to sanity-check a design on the spot — not exact
benchmarks (real numbers vary by hardware, network, and year), but the
right order of magnitude to reason about whether a design is even
plausible.

## Latency numbers

| Operation | Approximate latency |
| --- | --- |
| L1 cache reference | ~1 ns |
| Main memory (RAM) reference | ~100 ns |
| SSD random read | ~100 μs |
| Round trip within the same datacenter | ~0.5 ms |
| HDD seek | ~10 ms |
| Round trip, cross-country (e.g. US coast to coast) | ~50 ms |
| Round trip, cross-continent | ~150 ms |

The jump between rows matters more than the exact number: memory is
roughly 100x faster than SSD, which is roughly 100x faster than a
cross-country network round trip. A design that hides an unnecessary
cross-region round trip behind something that could have been served
from memory is leaving two or three orders of magnitude on the table.

## Throughput and capacity, by estimation

Back-of-envelope math in an interview usually chains a few of these:

- A single modern server can typically handle on the order of
  **thousands to tens of thousands of requests/second** for simple,
  cacheable reads; far less (hundreds to low thousands) for anything
  hitting a database with real work per query.
- A single database connection or query is usually the bottleneck well
  before the network is. This is why connection pooling and read
  replicas show up so often in scaling discussions.
- **1 million requests/day ≈ ~12 requests/second average**. But design
  for peak, not average: a 10x peak-to-average ratio is a common,
  reasonable assumption absent better data.

## Storage, by estimation

- A short text row (a tweet, a comment) is roughly **100 bytes – 1 KB**.
- A typical compressed photo is roughly **200 KB – 2 MB**; a minute of
  video, tens of MB.
- 1 million users × 1 KB of profile data ≈ **1 GB**: small. The same 1
  million users' photos at 1 MB each ≈ **1 TB**, which is usually where
  "do we need blob storage, not a database row" becomes obvious.

## Where it applies

Capacity-estimation questions ("how many servers/how much storage would
this need"), and sanity-checking any design's latency budget — if a
request's stated latency requirement is 50ms and the design routes it
through three sequential cross-region calls, the numbers alone say it
can't work before any other analysis does.

## Why memorize them

Skip the calculator and these numbers still catch the obvious break: a
design that's off by 1000x gets flagged with "wait, that can't be right"
instead of surviving an entire interview unchallenged. That's the actual
payoff of having them memorized — not precision, just a fast gut-check
that's always available.
`,Ng={id:"numbers-every-engineer-should-know",title:"Numbers Every Engineer Should Know",tags:["performance","process"],body:Rg,format:"nugget"},Ig=`## What it is

Read-heavy and write-heavy workloads scale via genuinely different
techniques, and conflating them is a common design mistake: throwing a
read-scaling technique (like a cache) at a write-heavy problem does
nothing, and vice versa.

## Scaling reads

Reads are usually the easier side, because a read can be served from a
**copy** of the data:

- **Caching** — serve hot data from memory instead of the database; see
  [Cache Invalidation](/nuggets/cache-invalidation) and
  [Cache vs. Freshness](/nuggets/cache-vs-freshness) for the correctness
  side of this.
- **Read replicas** — one or more read-only copies of the database, kept
  in sync (usually asynchronously) with the primary. Reads scale by
  adding more replicas; writes still all go through the single primary.
- **CDN** — for content that's the same for every user, push it to edge
  servers close to the reader.

The common thread: all of these add copies, and copies mean the reader
might see slightly stale data: a
[Cache vs. Freshness](/nuggets/cache-vs-freshness)-shaped tradeoff, not
a free win.

## Scaling writes

Writes are harder, because every write eventually has to land somewhere
authoritative. There's no copying your way out of needing to actually
store the new data:

- **Sharding/partitioning** — split writes across multiple database
  instances so no single machine takes all the write load; see
  [Sharding Strategies](/nuggets/sharding-strategies).
- **Write-behind / async processing** — acknowledge the write once it's
  durably queued (a message broker, a write-ahead log), and apply it to
  the actual store slightly later, trading immediate consistency for
  write throughput.
- **Batching** — combine many small writes into fewer, larger ones,
  amortizing per-write overhead (a transaction commit, a network round
  trip): the same [Latency vs. Throughput](/nuggets/latency-vs-throughput)
  tradeoff batching always makes.

## Where it applies

Any system design discussion of "how does this scale" should ask reads
and writes separately — a social feed is read-heavy (many more views
than posts) and leans on caching and replicas; a metrics ingestion
pipeline is write-heavy (constant high-volume writes, comparatively
rare reads) and leans on sharding, batching, and async ingestion.

## Reads vs. writes, the actual difference

Reads scale by adding copies; writes scale by splitting the
authoritative data itself. A design that's struggling with write load
needs sharding or async processing, not a bigger cache. A cache can
only make reads of already-written data faster; it can't absorb more
writes.
`,Dg={id:"scaling-reads-vs-scaling-writes",title:"Scaling Reads vs. Scaling Writes",tags:["performance","patterns","databases"],body:Ig,format:"nugget"},Mg=`## What it is

Two strategies for handling concurrent writes to the same data without
corrupting it. **Pessimistic locking** assumes conflicts are likely and
prevents them up front: acquire a lock before touching the data, so no
one else can write to it until you're done. **Optimistic locking**
assumes conflicts are rare — let everyone proceed without locking, but
detect a conflict at write time and reject (or retry) whichever write
loses the race.

## Pessimistic locking

\`\`\`sql
BEGIN;
SELECT * FROM inventory WHERE product_id = 42 FOR UPDATE; -- blocks other writers
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 42;
COMMIT;
\`\`\`

\`SELECT ... FOR UPDATE\` holds a row lock until the transaction commits.
Any other transaction trying to update (or lock) the same row blocks
until this one finishes. Safe by construction, but a slow or stuck
transaction holds up everyone waiting behind it, and it doesn't work at
all across services that don't share a database.

## Optimistic locking

Instead of locking, add a version column and check it hasn't changed
since you read it:

\`\`\`sql
UPDATE inventory
SET quantity = quantity - 1, version = version + 1
WHERE product_id = 42 AND version = 7; -- the version we read
-- 0 rows affected → someone else updated it first; re-read and retry
\`\`\`

No lock is ever held, so throughput under low contention is much
better. But under high contention, many writers can retry repeatedly
(each one's write invalidated by the next), which can be worse than
just queuing behind a lock in the first place.

## Choosing between them

Pessimistic locking wins when conflicts are frequent and retrying is
expensive (a multi-step checkout that's costly to redo). Optimistic
locking wins when conflicts are rare and most attempts succeed on the
first try — which describes the majority of real-world write patterns,
which is why optimistic locking (or a database's own MVCC, a form of
it) is the more common default.

## Where it applies

Any concurrent update to shared state: inventory counts, seat
reservations, account balances, collaborative document edits. It's also
the same underlying concern [Idempotency](/nuggets/idempotency)
addresses from a different angle — idempotency makes a *retried*
request safe, while locking strategy determines what happens when two
*different, concurrent* requests touch the same data at once.

## The tradeoff

Locking is a bet about how often conflicts actually happen: pessimistic
pays a cost on every write to guarantee safety, optimistic pays no cost
on the common case but a real cost when contention is higher than
assumed. Guess wrong and either throughput suffers unnecessarily, or
retries pile up under load.
`,jg={id:"optimistic-vs-pessimistic-locking",title:"Optimistic vs. Pessimistic Locking",tags:["databases","patterns","reliability"],body:Mg,format:"nugget"},Og=`## What it is

A **saga** coordinates a business operation that spans multiple
services (each with its own database) as a sequence of local
transactions, each with a defined **compensating transaction** that
undoes it if a later step fails. There's no distributed transaction
wrapping the whole thing; instead, correctness comes from being able to
unwind whatever already happened.

## Why it matters

A single-database transaction gives you atomicity for free — either
everything commits or nothing does. Once an operation spans services
(each owning its own data), there's no shared transaction coordinator
that can offer the same guarantee without unacceptable availability
cost (see [CAP Theorem](/nuggets/cap-theorem) and why two-phase commit
falls out of favor at scale). A saga accepts that intermediate states
are real and briefly visible, and designs explicitly for how to recover
if a later step fails.

## Example: booking a trip

\`\`\`mermaid
flowchart LR
    A["Reserve flight"] --> B["Reserve hotel"]
    B --> C["Charge card"]
    C -->|fails| D["Compensate: refund"]
    D --> E["Compensate: cancel hotel"]
    E --> F["Compensate: cancel flight"]
\`\`\`

If charging the card fails after the flight and hotel are already
reserved, the saga runs compensating actions in reverse: cancel the
hotel, cancel the flight, rather than leaving two paid-for reservations
behind with no successful booking to show for them.

## Orchestration vs. choreography

- **Orchestration** — a central coordinator explicitly calls each step
  and decides what to do on failure. Easier to follow and test (the
  whole flow lives in one place), at the cost of a new central
  component.
- **Choreography** — each service reacts to events from the previous
  one (via a broker) and emits its own event when done, with no central
  coordinator. No single point of control, but the overall flow is
  implicit: reconstructing "what happens when payment fails" means
  tracing event handlers across every service.

## Where it applies

Any multi-service operation with no shared database: order fulfillment
(reserve inventory → charge payment → schedule shipping), travel
booking, account provisioning across multiple systems. Publishing each
step's outcome reliably, so the next step (or a compensation) actually
fires, is exactly the problem the
[Outbox Pattern](/nuggets/outbox-pattern) solves. Sagas are usually
built on top of it, not instead of it.

## Living with partial state

The whole design commitment behind a saga is always having a way back
out if a later step fails, accepting that intermediate states are
genuinely visible along the way (someone really can see a flight
reserved with no hotel booked yet) rather than trying to hide them.
`,Bg={id:"saga-pattern",title:"Saga Pattern",tags:["patterns","reliability","messaging"],body:Og,format:"nugget"},zg=`## What it is

Routing a large file (a video, a big export, a multi-GB backup) through
your own application server (reading the whole upload into memory or
disk before forwarding it to storage) ties up a server thread or
process for the entire transfer and caps throughput at whatever one
server can handle. The standard fix is letting the client upload
**directly** to blob storage, with the app server only involved in
authorizing the upload.

## Presigned URLs

The app server generates a short-lived, cryptographically signed URL
that grants permission to upload (or download) one specific object,
without the client ever holding real storage credentials:

\`\`\`python
url = s3_client.generate_presigned_url(
    "put_object",
    Params={"Bucket": "uploads", "Key": f"user-{user_id}/{file_id}"},
    ExpiresIn=300,  # seconds the URL stays valid
)
# client PUTs the file directly to \`url\` — bypasses the app server entirely
\`\`\`

\`\`\`mermaid
sequenceDiagram
    participant Client
    participant App as App server
    participant S3 as Blob storage
    Client->>App: "I want to upload a file"
    App-->>Client: presigned URL (valid 5 min)
    Client->>S3: PUT file directly
    S3-->>Client: 200 OK
    Client->>App: "upload done" (object key)
\`\`\`

The app server's job shrinks to authorization and bookkeeping: it
never touches the file's bytes, so its resource usage doesn't scale
with upload size or volume at all.

## Chunked / multipart upload

For very large files, uploading as one request risks the whole thing
failing on any network hiccup, with no way to resume. Multipart upload
splits the file into independently-uploaded chunks (each with its own
presigned URL), retried individually on failure, and assembled
server-side (by the storage service) once every chunk has arrived, the
same idea as resumable downloads, applied to writes.

## Where it applies

Any user-facing upload of non-trivial size — video platforms,
document/backup tools, image-heavy apps. Also the receiving side of the
same problem: serving a large file back out is the same "don't proxy
bytes through the app server" idea, usually via a signed download URL
or a CDN in front of storage.

## The app server's actual job

In a large-transfer flow, the app server's job is authorization, not
data-plane transit. Every byte that flows through it instead of
directly between client and storage is throughput it didn't need to
spend.
`,qg={id:"large-file-uploads",title:"Handling Large File Uploads",tags:["apis","performance","patterns"],body:zg,format:"nugget"},Wg=`## What it is

Some operations — video transcoding, a large report generation,
training a model — take far longer than an HTTP request should stay
open for. The request that *starts* the work and the moment the
*result* is ready need to be decoupled, with a defined way for the
client to find out when it's done.

## The pattern

\`\`\`mermaid
sequenceDiagram
    participant Client
    participant API
    participant Worker as Background worker
    Client->>API: POST /reports (start job)
    API-->>Client: 202 Accepted, { job_id, status: "pending" }
    API->>Worker: enqueue job
    Note over Worker: does the actual work,<br/>possibly minutes long
    Client->>API: GET /reports/{job_id}
    API-->>Client: { status: "complete", result_url }
\`\`\`

The initial request returns immediately with a job id and a
\`202 Accepted\` (not \`200\`, since nothing is actually done yet): the
real work happens asynchronously in a worker process, decoupled from
the request/response cycle entirely.

## How the client finds out

- **Polling** — the client periodically calls \`GET /reports/{job_id}\`
  and checks status. Simple, works everywhere, but wastes requests and
  adds latency equal to the poll interval before the client notices
  completion.
- **Webhooks** — the server calls a URL the client registered, once
  done. No wasted requests, but requires the client to run something
  reachable from the server (fine for server-to-server, awkward for a
  browser).
- **WebSocket/SSE push** — the server pushes a status update over an
  already-open connection. Lowest latency, but only works while the
  client stays connected — needs a fallback (like polling on reconnect)
  for when it doesn't.

## Idempotency and retries

The worker picking up a job should be
[idempotent](/nuggets/idempotency) — a worker crash mid-job, or a
message redelivered by an at-least-once queue, means the same job can
be picked up twice. Track job state explicitly (\`pending\` → \`running\` →
\`complete\`/\`failed\`) so a duplicate pickup can check "is this already
done or in progress" before redoing the work.

## Where it applies

Any operation whose natural duration exceeds a reasonable request
timeout: exports and reports, media processing, batch imports, ML
inference on large inputs. It's also the required pattern for anything
running behind [API Gateway](/guides/api-gateway) into
[Lambda](/guides/serverless-aws-lambda), since API Gateway's own
29-second timeout is often tighter than the actual work. The underlying
mechanics (a durable job queue, idempotent workers) are shared with
[the Outbox Pattern](/nuggets/outbox-pattern) and
[the Saga Pattern](/nuggets/saga-pattern): all three are variations on
"do work reliably, outside the request/response cycle."

## Two events, two timescales

The request that kicks off long-running work and the moment it finishes
are two different events on two different timescales — trying to force
them into one request/response cycle either times out or blocks a
thread for far too long. Split them, and give the client an explicit
way to check on the gap in between.
`,Fg={id:"long-running-tasks",title:"Managing Long-Running Tasks",tags:["patterns","apis","reliability"],body:Wg,format:"nugget"},Ug=`## What it is

Finding entities "near" a given location — nearby drivers, restaurants
within a mile — efficiently, rather than checking the distance to every
row in the database (which is \`O(n)\` and gets worse as the dataset
grows). Geospatial indexes convert 2D location into something a
standard index can search quickly.

## Geohashing

Geohashing encodes a (latitude, longitude) pair into a single string,
where **nearby locations tend to share a prefix**: the longer the
shared prefix, the closer the two points (with an important caveat
below). This turns "find things near me" into "find rows whose geohash
starts with this prefix," which a normal string index (or even a
B-tree) can serve directly.

\`\`\`
geohash("40.7128, -74.0060")  → "dr5reg..."   (New York)
geohash("40.7300, -73.9950")  → "dr5ru3..."   (a mile away — shares "dr5r")
geohash("34.0522, -118.2437") → "9q5ctr..."   (Los Angeles — no shared prefix)
\`\`\`

The caveat: geohash cells are rectangular, and two points can be
geographically close while falling just across a cell boundary,
sharing almost no prefix despite being near each other. Real
implementations search several neighboring prefixes, not just an exact
match, to compensate.

## Quadtrees

A quadtree recursively divides space into four quadrants, subdividing
further wherever data is dense: a sparse rural area stays one large
cell, a dense city block subdivides many times over. This adapts cell
size to actual data density, which flat geohashing (a fixed cell size
at a given precision) doesn't do on its own.

\`\`\`mermaid
flowchart TD
    A["Whole map"] --> B[NW] & C[NE] & D[SW] & E[SE]
    E --> E1[NW] & E2[NE] & E3[SW] & E4[SE]
\`\`\`

## Where it applies

Ride-sharing and delivery apps (nearest driver), local search
(restaurants within N miles), any "what's near this point" query at
scale. PostGIS (a Postgres extension) and Elasticsearch both ship
built-in geospatial indexing using these ideas; Uber's own H3 is a
newer hexagonal-grid alternative to geohashing's rectangles, avoiding
some of the boundary distortion.

## The common trick

Both approaches do the same underlying thing: turn a 2D "nearness"
problem into something a normal index can search directly, either a 1D
value (geohash) or a space already partitioned by density (a quadtree),
instead of scanning every row and computing its distance one at a time.
That's what makes proximity search possible at real scale.
`,$g={id:"geospatial-indexing",title:"Geospatial Indexing",tags:["databases","performance","patterns"],body:Ug,format:"nugget"},Hg=`## What it is

A mechanism for ensuring only one process, across multiple machines,
can hold a given lock at a time — the multi-process equivalent of a
mutex, needed whenever
[pessimistic locking](/nuggets/optimistic-vs-pessimistic-locking) has
to work across services that don't share a database or a single
process's memory.

## The basic mechanism

\`\`\`
SET lock:invoice-42 <unique-token> NX EX 30
\`\`\`

\`NX\` ("set if not exists") makes acquisition atomic — only the first
caller succeeds; \`EX 30\` gives the lock a TTL so it's automatically
released if the holder crashes before explicitly unlocking it.
Releasing checks the token matches before deleting, so a process can't
accidentally release a lock it doesn't actually hold anymore (e.g.
after its own lock already expired and someone else acquired it).

## The gotcha: the TTL can expire mid-work

\`\`\`mermaid
sequenceDiagram
    participant A as Process A
    participant Lock as Lock (Redis)
    participant B as Process B
    A->>Lock: acquire (TTL 30s)
    Note over A: GC pause / slow I/O — 45s
    Lock-->>Lock: TTL expires at 30s
    B->>Lock: acquire — succeeds
    Note over A,B: both A and B now believe<br/>they hold the lock
\`\`\`

A long GC pause, a slow disk, or just underestimating how long the work
takes can make a process run longer than the lock's TTL: the lock
expires while the original holder is still working, a second process
acquires it, and now two processes believe they exclusively hold it.
This isn't a rare edge case; it's the central hard problem with
distributed locks.

## Fencing tokens

A longer TTL doesn't fix this; it just delays the same problem. The
actual fix is giving every acquisition a monotonically increasing
**fencing token**, and having the *protected resource itself* reject
any write from a stale token:

\`\`\`
if incoming_token < resource.highest_seen_token:
    reject()  # this holder's lock had already expired
resource.highest_seen_token = incoming_token
apply(write)
\`\`\`

This moves the actual safety check to the resource being protected,
rather than trusting that lock possession alone means exclusivity. It's
the only fully correct fix, not a workaround.

## Where it applies

Coordinating exclusive access across services: only one instance of a
scheduled job running at once, preventing two workers from processing
the same queue item, leader election. Redis (via \`SET NX EX\`, or the
multi-node Redlock algorithm) and ZooKeeper/etcd (via their own
consensus-backed primitives) are the common implementations.

## Treat possession as advisory

Without fencing tokens, a distributed lock only prevents concurrent
*acquisition*, not concurrent *access*, once a TTL can expire
mid-operation. Treat lock possession as advisory unless the protected
resource itself can reject stale writes.
`,Vg={id:"distributed-locks",title:"Distributed Locks",tags:["reliability","patterns","databases"],body:Hg,format:"nugget"},Qg=`## What it is

**Change Data Capture (CDC)** reads a database's own internal change
log: the write-ahead log (WAL) in Postgres, the binlog in MySQL. It turns
each row-level insert, update, or delete into a stream of events, without
the application ever having to explicitly publish them.

## Why it matters

The alternative is dual-writing: the application writes to the
database, then separately publishes an event describing what changed.
That's exactly [the dual-write problem](/nuggets/outbox-pattern) — two
systems, no shared transaction, no atomic guarantee that both actually
happen. CDC sidesteps it differently than the outbox pattern does:
instead of writing the event and the data in one transaction and
relaying it, CDC never asks the application to publish anything at
all: it derives the event stream from changes that already,
unavoidably, happened in the database's log.

\`\`\`mermaid
flowchart LR
    App["App writes to DB<br/>(normal write, no extra step)"] --> DB[(Database)]
    DB --> WAL["Write-ahead log"]
    WAL --> CDC["CDC tool<br/>(Debezium)"]
    CDC --> Broker["Kafka / event stream"]
\`\`\`

## CDC vs. the outbox pattern

Both solve reliable event publishing, but differently:

- **Outbox** requires an explicit outbox-table write in the same
  transaction as the business data: the application has to know to do
  it, but the event's shape is exactly whatever the app wrote.
- **CDC** requires zero application changes (any write is
  automatically captured), but the event is a raw row-level diff (this
  column changed from X to Y), which often needs transforming into a
  meaningful business event downstream, and it couples consumers to the
  database's physical schema.

## Where it applies

Replicating data into a search index or a cache without dual-writing to
both, feeding a data warehouse or lake from an OLTP database without
batch ETL jobs, and building an audit log of every change without
touching application code. Debezium (built on Kafka Connect) is the
common open-source implementation across Postgres, MySQL, and MongoDB.

## Which one to reach for

CDC and the outbox pattern both exist to avoid the dual-write problem,
but from opposite ends: outbox makes the application explicit about
what to publish; CDC makes publishing automatic by reading what already
happened. Pick CDC when zero app-code involvement matters more than
schema coupling; pick outbox when control over the event's shape
matters more than the extra plumbing.
`,Gg={id:"change-data-capture",title:"Change Data Capture",tags:["databases","patterns","messaging"],body:Qg,format:"nugget"},Kg=`## What it is

A database purpose-built for data that's fundamentally a sequence of
(timestamp, value) points (metrics, sensor readings, prices),
optimized for the access patterns that shape actually needs: fast
writes of new points arriving in roughly time order, and reads that
aggregate over a time range, rather than looking up one row by id.

## What's actually different from a general-purpose database

- **Write pattern**: near-append-only, roughly time-ordered, extremely
  high volume (a fleet of servers each emitting metrics every few
  seconds). General-purpose databases optimize for a mix of
  reads/writes/updates to arbitrary rows; time-series databases optimize
  specifically for "mostly sequential appends."
- **Storage layout**: data is typically stored column-oriented and
  partitioned by time range, so a query for "the last hour" only
  touches the relevant partition, and similar values (a metric that
  barely changes minute to minute) compress extremely well sitting next
  to each other.
- **Downsampling / retention**: raw per-second data from a year ago is
  rarely useful at that resolution: time-series databases build in
  automatic rollups (per-second → per-minute → per-hour averages) and
  expiry policies, rather than requiring an application-level cron job
  to do it.

\`\`\`mermaid
flowchart LR
    A["Raw: 1-second resolution<br/>(kept 7 days)"] --> B["Rollup: 1-minute avg<br/>(kept 90 days)"]
    B --> C["Rollup: 1-hour avg<br/>(kept forever)"]
\`\`\`

## Where it applies

Infrastructure metrics and monitoring (Prometheus, InfluxDB), IoT
sensor data, financial tick data. This is exactly what backs the
"metrics" leg of [Observability](/nuggets/observability): a metrics
backend at any real scale is a time-series database, not a
general-purpose one, precisely because of the write volume and
downsampling needs above.

## Not just a table with a timestamp column

Forcing high-volume timestamped data into a general-purpose database
works at small scale but breaks down on both ends at once: write
throughput suffers because the database isn't optimized for sequential
appends, and storage balloons because nothing is downsampling old data
automatically. A time-series database is a genuinely different set of
engineering tradeoffs, not just a relational database with an extra
column for the timestamp.
`,Xg={id:"time-series-databases",title:"Time Series Databases",tags:["databases","performance"],body:Kg,format:"nugget"},Yg=`## What it is

A database built to store high-dimensional **vectors**: numeric arrays,
often hundreds to thousands of dimensions, produced by an embedding
model to represent the "meaning" of a piece of text, image, or audio.
It answers **similarity search** — "find the vectors closest to this
one," not an exact-match lookup.

## Why a normal index doesn't work here

A B-tree index (see [Database Indexing](/nuggets/database-indexing)) is
built for exact-match and range queries on ordered scalar values:
there's no meaningful "sort order" for a 768-dimension vector that a
B-tree could exploit. Finding the true nearest neighbors requires
comparing the query vector against every stored vector (\`O(n)\`), which
doesn't scale.

## Approximate nearest neighbor (ANN)

Vector databases trade perfect accuracy for speed via **approximate**
nearest-neighbor search, close enough almost always, at a fraction of
the cost of checking every vector:

- **HNSW** (Hierarchical Navigable Small World) — builds a multi-layer
  graph where each vector links to its approximate neighbors; search
  starts at a sparse top layer and descends, narrowing in on the right
  neighborhood without visiting most of the graph.
- **IVF** (Inverted File Index) — clusters vectors ahead of time, and a
  query only searches the clusters nearest the query vector, not all of
  them.

\`\`\`mermaid
flowchart LR
    Q["Query vector"] --> S["Search only nearby<br/>clusters/graph regions"]
    S --> R["Approximate top-K<br/>nearest neighbors"]
\`\`\`

Both trade some recall (might miss the true single-closest vector
occasionally) for search that's orders of magnitude faster than an
exhaustive scan: the same kind of tradeoff
[Database Indexing](/nuggets/database-indexing) makes for scalar data,
applied to similarity instead of equality.

## Where it applies

Semantic search (find documents *similar in meaning*, not just matching
keywords), recommendation systems, RAG (retrieval-augmented generation)
pipelines feeding relevant context to an LLM: directly relevant to how
a tool built on [MCP](/nuggets/mcp-vs-api) might retrieve context for a
model. Pinecone, Weaviate, and pgvector (a Postgres extension) are
common implementations; several general-purpose databases now bolt on
vector search rather than requiring a fully separate system.

## The real difference

What's actually new here is the *query*, not the storage: "what's
similar" instead of "what matches exactly." That's why vector databases
need their own indexing structures (HNSW, IVF), entirely different from
a B-tree, even though the raw vectors could technically be stored in
any database that can hold an array column.
`,Jg={id:"vector-databases",title:"Vector Databases",tags:["databases","ai"],body:Yg,format:"nugget"},Zg=`## What it is

Both split a large dataset into smaller pieces, but at a different
scope. **Partitioning** is the general term: dividing data into pieces
by some rule (range, list, hash), which can happen entirely within
*one* database instance. **Sharding** is specifically partitioning
*across multiple* machines — every shard is a partition, but not every
partition is a shard.

## Partitioning within one instance

Most relational databases support this natively — Postgres's
declarative table partitioning, for example, splits one logical table
into several physical ones on the *same* server, transparent to
queries:

\`\`\`sql
CREATE TABLE events (
  id bigint,
  created_at timestamp,
  payload jsonb
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2026_01 PARTITION OF events
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
\`\`\`

The database can then **prune** partitions a query doesn't need: a
query filtered to \`2026-01\` never touches the other months' data at
all. This improves query and maintenance performance (dropping a whole
old partition is instant; deleting the same rows one at a time isn't),
without adding a single extra server or any of the distributed-systems
complexity sharding brings.

## Sharding: partitioning across machines

Sharding takes the same splitting idea and distributes the pieces
across multiple database *instances*, specifically to scale beyond what
one machine's storage or throughput can handle. This is where
[Sharding Strategies](/nuggets/sharding-strategies) picks up: choosing
a shard key, avoiding hot shards, handling resharding (none of which
is a concern for single-instance partitioning, since there's only ever
one machine to route to).

\`\`\`mermaid
flowchart TD
    P["Partitioning: split within<br/>ONE instance"] --> P1[Partition A] & P2[Partition B]
    S["Sharding: split ACROSS<br/>multiple instances"] --> S1["Shard A (own server)"] & S2["Shard B (own server)"]
\`\`\`

## Why the distinction matters

The two terms are often used interchangeably in casual conversation,
but conflating them misses the actual design decision: partitioning
alone doesn't add capacity (all partitions still live on one machine,
sharing its CPU, memory, and disk). It only improves organization and
query efficiency *within* that capacity. Sharding is what actually adds
capacity, at the cost of everything cross-shard queries, joins, and
transactions become harder or impossible without.

## Where it applies

Partitioning: a single database instance with a table too large to
manage or query efficiently as one block (time-series and event tables
are the classic case). Sharding: a dataset or write volume that has
genuinely outgrown what one instance can hold or serve at all.

## When partitioning alone is enough

Partitioning is an organizational technique available on a single
machine; sharding is a scaling technique that requires multiple. If a
database is struggling with query performance or table maintenance but
isn't actually running out of capacity, partitioning alone might be the
entire fix. Reaching straight for sharding's operational complexity
when partitioning would have solved it is a common overcorrection.
`,ey={id:"partitioning-vs-sharding",title:"Partitioning vs. Sharding",tags:["databases","patterns","performance"],body:Zg,format:"nugget"},ty=`## What it is

Both sit between a client and a server, forwarding requests on someone's
behalf; the difference is **whose** behalf. A **forward proxy** (usually
just called "a proxy") sits in front of *clients*, forwarding their
requests out to the internet: the destination server sees the proxy's
IP, not the client's, and the client has to be configured to use it. A
**reverse proxy** sits in front of *servers*, forwarding client requests
to whichever backend should actually handle them. The client sees only
the reverse proxy's address and has no idea how many backends exist, or
which one answered.

\`\`\`mermaid
flowchart LR
    subgraph "Forward proxy — represents the client"
    C1["Client<br/>(configured to use it)"] --> FP[Forward proxy] --> S1["Any server<br/>on the internet"]
    end
\`\`\`

\`\`\`mermaid
flowchart LR
    subgraph "Reverse proxy — represents the server"
    C2["Client<br/>(unaware it exists)"] --> RP[Reverse proxy] --> B1[Backend 1]
    RP --> B2[Backend 2]
    end
\`\`\`

## Why it matters

**Forward proxies** solve client-side problems: anonymizing outbound
traffic, enforcing a content policy across every client on a network
(a school or company blocking certain sites), or letting a group of
clients share a cache instead of each fetching the same resource
independently.

**Reverse proxies** solve server-side problems, and this is the shape
that shows up constantly in system design — almost every production
web service sits behind one:

- **TLS termination** — decrypt HTTPS once, at the proxy, and forward
  plain HTTP internally, so individual backend instances never have to
  manage certificates themselves.
- **Load balancing** — distribute requests across backend instances;
  see [Networking: Load Balancing](/guides/networking-load-balancing)
  for the algorithms this actually uses.
- **Caching and compression** — serve a cached or compressed response
  without the request ever reaching a backend.
- **Hiding topology** — the client only ever sees one address; backend
  instances can be added, removed, or replaced with no client-visible
  change.

## Reverse proxy vs. load balancer vs. API gateway

These three terms describe overlapping roles, not three different
technologies: NGINX, HAProxy, and Envoy can each be configured to act
as any of them. The distinction is *primary purpose*:

- **Reverse proxy** is the general shape: sits in front of servers,
  forwards requests.
- **Load balancer** is a reverse proxy whose main job is distributing
  traffic across instances for scale and availability.
- **[API Gateway](/guides/api-gateway)** is a reverse proxy whose main
  job is API-specific concerns — auth, rate limiting, routing to the
  right microservice.

A [CDN](/guides/cdn) is, in effect, a globally-distributed reverse
proxy: the same "hide the origin, serve from somewhere closer/cached"
idea, applied across many geographic edge locations instead of one
data center.

## The current tooling landscape (2026)

Worth knowing the actual tradeoffs, not just the names:

- **NGINX** is still the single most-used web server/reverse proxy —
  32.8% of websites with a known web server run it (W3Techs, April
  2026). But a config reload causes a real, measurable latency spike
  per worker (~50ms), which can surface as 5xx errors if health checks
  aren't tuned around it.
- **Caddy** ships automatic HTTPS by default and benchmarks meaningfully
  faster than NGINX on small static assets and HTTP/3, at the cost of
  fewer load-balancing algorithms and lighter health-check options:
  a better fit for simpler setups than heavy-duty traffic shaping.
- **Envoy** is the data plane most service meshes are built on (used
  at Lyft, and inside AWS App Mesh): deep observability and traffic
  control, at the cost of a genuinely more complex configuration model.
- **Pingora** is Cloudflare's proxy framework, written in Rust: notably
  not a pre-built binary you configure with a file, like the others,
  but a library you build a proxy *with*. Cloudflare reported ~70% less
  CPU and ~67% less memory than the NGINX setup it replaced, running at
  over 40 million requests/second.

## Where it applies

Reverse proxies: essentially every production web service, API, and
CDN edge node. Forward proxies: corporate/school network content
filtering, web scraping infrastructure, and privacy tools (a VPN is,
among other things, a forward proxy for all of a device's traffic).

## Telling them apart

**Who it represents** is the test that actually works, more than where
a box sits on a network diagram. A forward proxy sits on the client's
side, and the client knows it's there. A reverse proxy sits on the
server's side, and the client has no idea it exists at all: as far as
the client can tell, the reverse proxy *is* the server.
`,ny={id:"proxy-vs-reverse-proxy",title:"Proxy vs. Reverse Proxy",tags:["networking","security","patterns"],body:ty,format:"nugget"},Na=[Bm,qm,Fm,$m,Vm,Gm,Xm,Jm,eg,ng,ag,sg,lg,ug,hg,pg,gg,vg,bg,xg,Cg,Eg,Ag,Lg,Ng,Dg,jg,Bg,qg,Fg,$g,Vg,Gg,Xg,Jg,ey,ny],ry=`A practical checklist for building or reviewing a JSON HTTP API — the
concerns that come up in almost every non-trivial API but rarely get
written down until something breaks in production. Where a full nugget
already covers a topic in depth, this guide links to it rather than
repeating it; treat this as the map, and the linked nuggets as the
exhibits.

## Rate limiting

Every public (and most internal) endpoints should cap how often a single
client can call them. The mechanics (token bucket, leaky bucket, what to
do when the bucket is empty) are covered in full in
[Rate Limiting](/nuggets/rate-limiting). At the API-design level, the part
that's easy to skip is telling the client what happened, via response
headers:

| Header | Meaning |
| --- | --- |
| \`X-RateLimit-Limit\` | Requests allowed per window |
| \`X-RateLimit-Remaining\` | Requests left in the current window |
| \`X-RateLimit-Reset\` | Unix timestamp when the window resets |
| \`Retry-After\` | Seconds to wait before retrying (sent with a \`429\`) |

A client that gets a bare \`429\` with no other information has to guess how
long to back off; a client that gets \`Retry-After: 30\` doesn't.

Concrete limits vary a lot by traffic pattern, but real APIs anchor on
numbers like these: GitHub's REST API allows 5,000 requests/hour for an
authenticated user; Stripe's default is 100 requests/second in live mode.
Neither is a universal default to copy: the point is picking a number
deliberately from expected legitimate traffic, not leaving it unset.

## Authentication & authorization

Keep these two separate in your head even when they're adjacent in code:
**authentication** answers "who is this," **authorization** answers "what
are they allowed to do." A request can be authenticated (a valid API key)
and still be unauthorized (that key's owner doesn't have access to this
resource) — collapsing the two into one check is a common source of
privilege-escalation bugs.

- **API keys** are simplest and fine for server-to-server calls, but they
  don't expire on their own and are easy to leak into logs or client-side
  code. Never ship one in a mobile app or SPA bundle expecting it to stay
  secret.
- **OAuth 2.0** is the right tool when a *user* needs to grant a *third
  party* limited access to their account. It exists specifically to avoid
  handing out the user's actual password.
- **JWTs** are a good transport for short-lived, self-contained claims
  (user id, roles, expiry) but are not a session-revocation mechanism by
  default: a stolen JWT is valid until it expires, full stop, unless you
  add an explicit revocation list.

Whatever the mechanism, grant the narrowest scope that does the job. A key
that can only read one resource type does far less damage when it leaks
than one with blanket access.

### OAuth 2.0 grant types, briefly

Not every OAuth flow is the right tool for the same job:

- **Authorization code** (+ PKCE): the flow for anything with a user and
  a browser. The user authenticates on the provider's own page, the
  provider redirects back with a short-lived code, and the app exchanges
  that code (plus a PKCE verifier, which stops the code from being
  replayed by whatever might have intercepted the redirect) for tokens
  server-side. This is the only flow that belongs in a user-facing login.
- **Client credentials** — no user at all: one service authenticating as
  *itself* to call another. The client authenticates directly with its
  own id and secret and gets a token back.
- **Implicit** (deprecated) — used to be recommended for browser-only
  apps with no backend, returning the token directly in the redirect
  URL's fragment. Superseded by authorization code + PKCE, which never
  exposes a token in a URL at all; avoid implicit in new work.

### How a JWT is actually verified

A JWT is three base64url segments — \`header.payload.signature\`.
*Verifying* one means recomputing the signature over the header and
payload with the expected key and comparing it, not just decoding the
payload and trusting what it says. Decoding requires no key at all;
verifying is the part that actually proves the token wasn't tampered
with.

- **HS256** signs and verifies with the *same* shared secret — simple,
  but every service that verifies a token needs that secret, which means
  every one of them could also mint a valid token.
- **RS256** signs with a private key and verifies with the corresponding
  public key — a verifier never needs, or gets, the ability to mint a
  token. This is the right default once more than one service needs to
  verify tokens.
- Public keys for RS256 verification are normally published at a **JWKS**
  endpoint (\`/.well-known/jwks.json\`) and rotated by publishing a new key
  alongside the old one for an overlap period, so tokens signed just
  before rotation still verify until they naturally expire.

A JWT's \`exp\` claim is enforced by whoever verifies it. Nothing stops a
captured, still-unexpired token from being replayed until that expiry
hits. That's why short-lived access tokens (minutes, not days) paired
with a separate, revocable **refresh token** (exchanged for a new access
token, checked against a server-side revocation list) is the standard
pattern for anything that needs to support logging a user out on demand.

## Input validation

Validate at the boundary, before untrusted data touches business logic or
a query. Prefer an allow-list ("must be one of these values, this
shape") over a deny-list ("reject anything that looks like an attack"),
since a deny-list only blocks the attacks you thought of. The single most
damaging validation failure (building a database query out of unvalidated
input directly) is its own nugget:
[SQL Injection & Parameterized Queries](/nuggets/sql-injection). The same
"never let input be interpreted as code" principle extends to shell
commands, template rendering, and deserialization of untrusted payloads.

## Idempotency for unsafe operations

Any endpoint a client might reasonably retry — which, over a real network,
is most of them — needs a defined retry story. \`GET\`/\`PUT\`/\`DELETE\` are
idempotent by definition (repeating them is safe); \`POST\` generally isn't,
which is exactly the problem an **idempotency key** solves. Full mechanics,
including the client/server exchange, are in [Idempotency](/nuggets/idempotency).
If your API has a \`POST /orders\` or \`POST /payments\`-shaped endpoint and no
idempotency story, that's a gap worth closing before it causes a
double-charge in production.

## Versioning

Decide how you'll evolve the API *before* the first breaking change is
forced on you, not during the incident. There are two common approaches:
a version segment in the URL (\`/v2/users\`) or a header
(\`Accept: application/vnd.myapi.v2+json\`). They trade discoverability
(URL versions are visible in every log line and browser tab) for purity
(a resource's identity shouldn't change with its representation). Either
is defensible; picking neither and instead making silent breaking changes
to \`v1\` is the one option that isn't. See
[Semantic Versioning](/nuggets/semantic-versioning) for how to communicate
the severity of a given change once you have a scheme.

## Pagination

Offset-based pagination (\`?page=3&limit=20\`) is simple but unstable under
concurrent writes: if a row is inserted before page 3 while a client is
paging through, they'll see one row twice and skip another. Cursor-based
pagination (\`?after=<opaque-cursor>\`) avoids that by anchoring to a
specific row rather than a numeric position, at the cost of not supporting
"jump to page 7." Default to cursor-based for any collection that's
written to concurrently with being read; offset is fine for small,
mostly-static lists.

## Caching & response shape

Two performance concerns that show up in almost every API, both backed by
their own nuggets:

- **HTTP caching** — send an \`ETag\` (a hash of the response body) or
  \`Last-Modified\`, and honor conditional requests (\`If-None-Match\` /
  \`If-Modified-Since\`) with a \`304 Not Modified\` when nothing's changed,
  saving the client a full re-download. \`Cache-Control\` tells shared
  caches (a CDN, a browser) how long they may serve a response without
  asking again. Deciding how stale is acceptable, and for how long, is
  exactly [Cache vs. Freshness](/nuggets/cache-vs-freshness); keeping a
  server-side cache correct as the underlying data changes is
  [Cache Invalidation](/nuggets/cache-invalidation).
- **Nested or related resources** — an endpoint that returns a list, then
  triggers a separate lookup per item for related data (an order's line
  items, a post's author), is the API-layer shape of
  [the N+1 query problem](/nuggets/n-plus-one-queries). Whether that
  per-item lookup is a database query or a call to another internal
  service, the fix is identical: batch it, or fetch it once alongside the
  list instead of once per item in the response.

## Consistent error responses

Pick one error shape and use it everywhere, including for errors your
framework generates automatically (a raw 500 stack trace in JSON is not
that shape). At minimum:

\`\`\`json
{
  "error": {
    "code": "insufficient_funds",
    "message": "Account balance is too low to complete this transaction.",
    "request_id": "req_7f3a9c2e"
  }
}
\`\`\`

\`code\` is for programs to branch on (stable, never changes wording);
\`message\` is for humans (can change wording freely); \`request_id\` ties the
response back to your logs/traces — see Observability below. Use real HTTP
status codes for the category of failure (\`400\` for a malformed request,
\`401\`/\`403\` for auth, \`404\` for missing, \`409\` for conflict, \`429\` for rate
limiting, \`5xx\` for your fault) — don't return \`200\` with an error payload
inside it, which forces every client to parse the body just to find out if
the call succeeded.

## Transport security

TLS everywhere, no exceptions for "internal" traffic — internal networks
get breached too. Never put secrets (API keys, tokens) in a URL's query
string: query strings routinely end up in server access logs, browser
history, and \`Referer\` headers sent to third parties. Put credentials in
headers or the request body instead.

TLS itself isn't free: a full handshake costs an extra round trip or two
before the first byte of real data moves (TLS 1.2 needs two round trips;
TLS 1.3 gets a full handshake down to one, and can resume a previous
session in zero). That cost is why connection reuse (keep-alive, HTTP/2
multiplexing many requests over one connection) matters as much for
latency as it does for throughput: paying the handshake cost once per
connection instead of once per request.

## Observability

Every response (success or failure) should carry a request id the caller
can hand back to you when reporting a problem, and every log line and
trace span on your side should carry that same id. Without it, "the API
returned an error at 3:47pm" is nearly unactionable; with it, it's a direct
lookup. The full three-signal model (metrics, logs, traces) this feeds
into is covered in
[Observability: Metrics, Logs, and Traces](/nuggets/observability).

## Documentation

Write the API contract down somewhere machine-readable (OpenAPI/Swagger is
the default choice) rather than only in prose or, worse, only in the
implementation. A machine-readable spec can generate client SDKs, drive
contract tests, and be diffed in code review to catch accidental breaking
changes. A paragraph in a wiki can't do any of that, and it drifts out of
sync with the code silently.

## Where to go from here

The same handful of concerns shows up on every API that survives contact
with real traffic; none of it is exotic. Treat this guide as a checklist
to run through when starting a new API or reviewing someone else's, and
follow the links above when you need the full depth on any one topic.
`,ay={id:"api-best-practices",title:"APIs: Best Practices",tags:["apis","security","reliability"],body:ry,format:"guide"},iy=`A from-zero walkthrough for someone who's never used Docker: the core
mental model, how to get it installed, where things live in both Docker
Desktop and the terminal, and the handful of commands and gotchas that
cover almost everything you'll do day to day.

## Why Docker

Docker packages an application together with everything it needs to run
(runtime, libraries, system dependencies) into a single unit that behaves
the same on your laptop, a teammate's laptop, and a production server. It
solves "works on my machine": if it runs in the container, it runs the
same way everywhere the container runs, because the container *is* the
machine as far as the app can tell.

## Core concepts

Four terms cover almost everything:

- **Image** — a read-only, versioned snapshot of a filesystem plus the
  command to run: your app's code, its dependencies, and the instructions
  for how to start it. Immutable — you don't edit an image, you build a
  new one.
- **Container** — a running (or stopped) instance of an image, with its
  own writable filesystem layer on top. You can run many containers from
  the same image at once, each isolated from the others.
- **Volume** — a place for data a container writes that should outlive the
  container itself (a database's files, uploaded assets). Deleting a
  container never deletes its volumes.
- **Registry** — where images are stored and shared (Docker Hub is the
  public default). \`push\` sends an image there, \`pull\` fetches one down.

\`\`\`mermaid
flowchart LR
    D["Dockerfile"] -->|docker build| I["Image"]
    I -->|docker run| C["Container"]
    I -.->|push / pull| R[("Registry")]
    C --- V[("Volume")]
\`\`\`

## Under the hood: namespaces and cgroups

Underneath, a container is just an ordinary Linux process, not a
lightweight VM: there's no separate kernel or virtualized hardware
involved. Two kernel features make it merely *look* isolated:

- **Namespaces** give a process its own view of something that's normally
  global on the machine. The **PID namespace** makes a container's first
  process look like PID 1, unaware anything outside it exists. The
  **network namespace** gives it its own network interfaces, IP address,
  and routing table. The **mount namespace** gives it its own filesystem
  view: the image's filesystem, not the host's. A few others (UTS for
  hostname, IPC, user namespaces for UID remapping) round it out.
  Together, this is what "isolated" actually means.
- **cgroups** (control groups) *limit* what a process can use (CPU
  shares, memory, I/O bandwidth) rather than hiding things from it. This
  is what stops one container from starving every other process on the
  host of CPU or memory.

\`\`\`mermaid
flowchart LR
    subgraph "Host kernel"
    NS["Namespaces:<br/>own PID / net / mount view"]
    CG["cgroups:<br/>CPU / memory limits"]
    end
    P["Container =<br/>a normal process"] --> NS
    P --> CG
\`\`\`

This is also why a container starts in milliseconds while a VM takes
seconds: a container is just \`fork\`/\`exec\` plus these two kernel
features applied to the new process; there's no separate kernel or
hardware to boot. It's also why every container on a host shares that
host's kernel. A Linux container image can't run natively on a non-Linux
kernel, which is exactly why Docker Desktop on macOS/Windows runs a small
Linux VM under the hood: something has to actually provide that kernel.

## Installing Docker

- **macOS / Windows**: install **Docker Desktop**. It bundles the Docker
  engine (which actually runs containers), the \`docker\` CLI, and a GUI.
  On both platforms the engine runs inside a lightweight Linux VM Docker
  Desktop manages for you, since containers are a Linux kernel feature.
- **Linux**: install **Docker Engine** directly (no VM needed — the kernel
  containers rely on is already there) via your distro's package manager.
  Docker Desktop is also available on Linux if you want the GUI, but it's
  optional there.

Either way, \`docker --version\` and \`docker run hello-world\` are the
standard "did it actually work" check once installed.

## Docker Desktop: where everything lives

The GUI mirrors the CLI concepts directly:

- **Containers** tab — every container, running or stopped, with start,
  stop, and log-viewing controls per row. This is the fastest way to
  answer "what's currently running on my machine."
- **Images** tab — every image pulled or built locally, with disk space
  used and a delete action. This is usually where "why is my disk full"
  gets answered.
- **Volumes** tab — named volumes and how much space each is using.
- The menu-bar/tray whale icon shows engine status at a glance and is
  where you'd restart the engine if it's stuck.
- **Settings → Resources** controls how much CPU/memory/disk the VM
  (macOS/Windows) is allowed to use — worth raising if builds feel starved
  on a machine that clearly has the headroom.

Everything the GUI shows is also queryable from the terminal: the GUI is
a view onto the same engine, not a separate thing.

## The CLI: essential commands

| Command | What it does |
| --- | --- |
| \`docker build -t myapp .\` | Build an image named \`myapp\` from the \`Dockerfile\` in the current directory |
| \`docker images\` | List images stored locally |
| \`docker run -d -p 8080:80 --name web myapp\` | Start a container in the background (\`-d\`), mapping host port 8080 to the container's port 80 |
| \`docker ps\` | List *running* containers |
| \`docker ps -a\` | List *all* containers, including stopped ones |
| \`docker logs -f web\` | Stream a container's stdout/stderr (\`-f\` follows, like \`tail -f\`) |
| \`docker exec -it web sh\` | Open an interactive shell inside a running container |
| \`docker stop web\` | Stop a running container |
| \`docker rm web\` | Remove a stopped container |
| \`docker rmi myapp\` | Remove an image |
| \`docker volume ls\` | List named volumes |
| \`docker system prune\` | Remove stopped containers, unused networks, and dangling images in one pass |

\`docker ps\` empty but you *know* something's running is almost always
because it stopped — check \`docker ps -a\` and then \`docker logs\` on it to
see why.

## Writing a Dockerfile

\`\`\`dockerfile
FROM node:24-slim
WORKDIR /app

# Copy just the dependency manifest first — this layer only rebuilds
# when package.json actually changes, so unrelated code edits don't
# force a full npm ci on every build.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

Each instruction is a cached layer; Docker only rebuilds from the first
line that actually changed. Ordering instructions from least- to
most-frequently-changing (dependencies before app code, as above) is what
makes rebuilds fast during day-to-day development.

## Running multiple services with Docker Compose

Real apps are rarely one container — a backend plus a database plus a
cache, at minimum. \`docker compose\` describes the whole set in one file
and starts them together, already networked so they can reach each other
by service name:

\`\`\`yaml
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgres://postgres:postgres@db:5432/app
    depends_on:
      - db

  db:
    image: postgres:18
    environment:
      - POSTGRES_PASSWORD=postgres
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
\`\`\`

\`docker compose up -d\` starts both; \`app\` reaches \`db\` at the hostname
\`db\` (Compose sets up a private network and DNS between services
automatically — no manual IP configuration). \`docker compose down\` stops
and removes the containers; add \`-v\` to also remove the named volume, if
you actually want to wipe the database.

## Volumes vs. bind mounts: where your data actually lives

- A **named volume** (\`db-data:/var/lib/postgresql/data\` above) is managed
  by Docker itself, lives outside any container's writable layer, and
  survives \`docker rm\` on the container that used it. Use this for data
  the app owns and needs to persist — a database's files, in the example
  above.
- A **bind mount** (\`./src:/app/src\`) maps a path on your actual machine
  into the container. Use this for local development, so edits to source
  files on your host are immediately visible inside the running
  container without rebuilding the image.

Mixing these up is the source of two common confusions: "I deleted the
container and lost my database" (should have been a named volume) and
"I rebuilt the image but my code changes aren't showing up" (should have
been a bind mount, or you forgot to rebuild).

## Container security basics

A few habits worth having well before "at scale" matters:

- **Don't run as root inside the container.** By default a container's
  process runs as root (uid 0) unless told otherwise: harmless for quick
  local use, but a real gap if that process is ever compromised, since a
  container-to-host escape as root is far more dangerous than one as an
  unprivileged user. Add a non-root user in the Dockerfile and switch to
  it before \`CMD\` runs:

  \`\`\`dockerfile
  RUN adduser --disabled-password appuser
  USER appuser
  \`\`\`

- **Start from a minimal base image.** \`node:24-slim\` is already smaller
  than the full \`node:24\`; \`-alpine\` variants (or distroless images,
  which contain nothing but the app and its runtime — no shell, no
  package manager) go further. Less in the image means fewer known
  vulnerabilities shipped along with it, and less an attacker can do with
  a shell if they ever get one.
- **Never bake secrets into an image.** A value set with \`ENV\` or \`ARG\` in
  a Dockerfile is visible to anyone who can run \`docker history\` or pull
  the image, including from intermediate build-cache layers, even if a
  later instruction overwrites it. Pass secrets at runtime instead
  (\`docker run -e\`, Compose's \`environment\`/\`env_file\`, or a real secrets
  manager in production), never as a value committed into the Dockerfile.
- **Scan images for known vulnerabilities** before shipping (\`docker
  scout\` ships with Docker Desktop; Trivy and Grype are common standalone
  alternatives). A base image that was clean when the Dockerfile was
  written can accumulate newly-discovered CVEs over time in layers that
  haven't changed at all.

## Common gotchas

- **"Port is already allocated"** — something on the host (often a
  previous container you forgot was running) already owns that port.
  \`docker ps\` to find it, or pick a different host-side port in \`-p\`.
- **Forgetting \`-d\`** — without it, \`docker run\` attaches to your
  terminal and blocks; \`Ctrl+C\` stops the container, it doesn't just
  detach from it.
- **Disk filling up over time** — stopped containers, unused images, and
  build cache all accumulate. \`docker system prune\` (or Docker Desktop's
  "Clean up" action) reclaims it.
- **No \`.dockerignore\`** — without one, \`COPY . .\` sends everything in the
  directory to the build context, including \`node_modules\` and \`.git\`,
  bloating both build time and image size. Add one like you would a
  \`.gitignore\`.
- **"It works when I run it locally but not in the container"** — almost
  always an environment difference the container is correctly exposing:
  a missing environment variable, a config file that exists on your host
  but wasn't copied in, or a service the app expects to reach at
  \`localhost\` that's actually a separate container now (use the service
  name from Compose instead).

## Where to go from here

Everything above covers a single host running a handful of containers:
enough for local development, and enough to understand how a lot of real
infrastructure works under the hood. Running many containers reliably
across many machines, with scheduling, self-healing, and rolling
deploys, is a separate, much bigger topic (Kubernetes and friends),
deliberately out of scope for a getting-started guide.
`,sy={id:"docker-getting-started",title:"Docker: Getting Started",tags:["tooling"],body:iy,format:"guide"},oy=`Three different answers to "how should a client and a server talk to
each other," each optimizing for a different shape of problem. This
guide compares the three directly; for the operational concerns that
apply regardless of which you pick (auth, rate limiting, versioning,
error shapes), see [APIs: Best Practices](/guides/api-best-practices).

## REST

REST models an API as a set of **resources**, each with a URL, acted on
with standard HTTP verbs:

\`\`\`
GET    /orders/42        → fetch order 42
POST   /orders            → create an order
PATCH  /orders/42        → partially update it
DELETE /orders/42        → remove it
\`\`\`

Simple, cacheable (HTTP caching semantics apply directly — see
\`Cache-Control\`/\`ETag\` in the APIs: Best Practices guide), and universally
understood. Its weakness shows up with nested or varied data
requirements: a mobile client that only needs an order's total and a web
client that needs the full order with line items and customer details
either share one bloated response (**over-fetching**) or the API grows a
proliferation of \`?fields=\` query params and specialized endpoints to
avoid it.

## GraphQL

GraphQL exposes a single endpoint and lets the client specify exactly
what shape of data it wants in the query itself:

\`\`\`graphql
query {
  order(id: 42) {
    total
    customer { name }
  }
}
\`\`\`

The server returns exactly that shape — no more, no less — which
directly solves REST's over/under-fetching problem: one query gets one
client's mobile summary, a different query gets the web client's full
detail, from the same schema. The tradeoff moves the complexity
server-side: a naive resolver implementation that fetches each nested
field with its own lookup is precisely
[the N+1 query problem](/nuggets/n-plus-one-queries) at the API layer:
resolving \`order.customer\` once per order in a list, instead of batching
it. Tools like DataLoader exist specifically to batch and cache resolver
calls within a single request to avoid this. HTTP caching also mostly
stops working, since every query is a \`POST\` to the same URL with a
different body — caching has to happen at the application layer instead.

## gRPC

gRPC defines a service's methods and message shapes in a strongly-typed
\`.proto\` file, compiles client/server stubs in whatever languages you
need, and communicates via binary Protocol Buffers over HTTP/2 instead
of JSON over HTTP/1.1:

\`\`\`protobuf
service OrderService {
  rpc GetOrder(GetOrderRequest) returns (Order);
  rpc StreamOrderUpdates(OrderId) returns (stream OrderUpdate);
}
\`\`\`

Binary encoding is smaller and faster to (de)serialize than JSON, and
the generated stubs mean a client can't send a malformed request that
compiles — the contract is enforced by the type system, not just
documentation. HTTP/2 also gives it native support for streaming (a
server can push a sequence of messages over one call, not just one
response). The cost: it's not human-readable on the wire (no
curl-and-eyeball debugging), and it's a poor fit for a public API
consumed directly by browsers, which don't speak gRPC natively without a
proxy layer (grpc-web).

## Choosing

| | Best fit | Weak point |
| --- | --- | --- |
| REST | Public APIs, simple CRUD, anything wanting HTTP caching for free | Over/under-fetching on complex, nested data |
| GraphQL | Multiple client shapes (web/mobile) sharing one backend, complex nested queries | N+1 resolvers, weaker HTTP-level caching |
| gRPC | Internal service-to-service calls, streaming, performance-sensitive paths | Not browser-native, no human-readable payloads |

A single system commonly uses more than one: gRPC between internal
services (where performance and strict contracts matter most), REST or
GraphQL at the public edge (where broad client compatibility matters
most).

## Where to go from here

Rate limiting, auth, versioning, and consistent error handling apply to
a REST, GraphQL, or gRPC API alike; none of these three choices replaces
that other layer of API design. See
[APIs: Best Practices](/guides/api-best-practices) for those.
`,ly={id:"apis-rest-vs-graphql-vs-grpc",title:"APIs: REST vs. GraphQL vs. gRPC",tags:["apis","patterns"],body:oy,format:"guide"},cy=`The protocol layers underneath every API call, from the transport
guarantees TCP provides up through the HTTP version actually carrying
the request. This is the "what is actually happening on the wire"
layer. For choosing an API *style* on top of it, see
[APIs: REST vs. GraphQL vs. gRPC](/guides/apis-rest-vs-graphql-vs-grpc).

## The layers, briefly

\`\`\`mermaid
flowchart TD
    A["Application: HTTP, gRPC"] --> T["Transport: TCP, UDP, QUIC"]
    T --> N["Network: IP — routing packets between hosts"]
\`\`\`

Each layer solves a different problem: the network layer gets a packet
from one host to another; the transport layer decides what guarantees
that delivery has (ordered? reliable? at what cost?); the application
layer defines the actual message format two programs agree to speak.

## Transport: TCP vs. UDP vs. QUIC

- **TCP** — connection-oriented: a handshake establishes the connection
  before any data flows, and every byte is acknowledged, retransmitted
  on loss, and delivered in order. That reliability costs latency (the
  handshake, and retransmission stalls) and is why almost all
  request/response traffic (HTTP included) has historically run on it.
- **UDP** — connectionless: packets are fired off with no handshake, no
  ordering guarantee, and no automatic retransmission. Lower latency and
  overhead, at the cost of the application having to handle loss and
  reordering itself if it cares: the right tradeoff for things where a
  late or missing packet is worse than a dropped one (live video, DNS
  lookups, real-time gaming).
- **QUIC** — built on UDP, but adds TCP-like reliability *and* built-in
  TLS encryption, negotiated in a single round trip instead of TCP's
  handshake followed by a separate TLS handshake. It also solves a
  specific TCP problem, **head-of-line blocking**: in TCP, one lost
  packet stalls every stream sharing that connection until it's
  retransmitted, even for data unrelated to the lost packet; QUIC
  multiplexes independent streams so one stream's loss doesn't stall the
  others. This is the transport HTTP/3 runs on.

## HTTP/1.1 vs. HTTP/2 vs. HTTP/3

- **HTTP/1.1** — one request per connection at a time (browsers work
  around this by opening several connections in parallel, which has its
  own overhead, since each one pays a fresh TCP+TLS handshake).
  Human-readable text format.
  
- **HTTP/2** — multiplexes many requests over a *single* TCP connection
  (no more opening six connections to load six assets), plus header
  compression and server push. Because it's still built on TCP, though,
  a single lost packet stalls every multiplexed stream on that
  connection: TCP-level head-of-line blocking, one layer up from where
  HTTP/2 tried to solve it.

- **HTTP/3** — the same multiplexing model as HTTP/2, but running over
  QUIC instead of TCP, which is what actually removes the head-of-line
  blocking problem: one stream's packet loss no longer stalls the
  others, because QUIC's stream independence is enforced at the
  transport layer, not layered on top of it.

\`\`\`mermaid
flowchart LR
    H1["HTTP/1.1 over TCP:<br/>one request per connection"] --> H2["HTTP/2 over TCP:<br/>multiplexed, but one lost<br/>packet stalls everything"]
    H2 --> H3["HTTP/3 over QUIC:<br/>multiplexed, independent streams"]
\`\`\`

## Where to go from here

Once a connection model is chosen, the next questions are usually how
traffic gets distributed across servers
([Networking: Load Balancing](/guides/networking-load-balancing)) and,
for anything that needs the server to push data rather than wait for a
request, [Networking: Real-Time Communication](/guides/networking-real-time-communication).
`,uy={id:"networking-protocols",title:"Networking: Protocols",tags:["networking","apis"],body:cy,format:"guide"},dy=`Once there's more than one server, something has to decide which
request goes where. This guide covers how. For the transport-level
mechanics a load balancer sits on top of, see
[Networking: Protocols](/guides/networking-protocols).

## Layer 4 vs. Layer 7

- **L4 (transport layer)** — routes based on IP address and port alone,
  without looking at the actual request content. Fast (minimal work per
  packet) and protocol-agnostic (works for anything over TCP/UDP, not
  just HTTP), but it can't make a routing decision based on, say, a URL
  path or a header.
- **L7 (application layer)** — terminates the connection and reads the
  actual request (HTTP method, path, headers, cookies) before deciding
  where to send it. Slower per-request (more work, and it has to
  understand the protocol), but enables routing like "send \`/api/*\` to
  the API fleet and \`/static/*\` to the CDN," and content-based decisions
  L4 simply can't see.

## Algorithms

- **Round robin** — cycle through servers in order. Simple, assumes all
  servers and all requests cost roughly the same.
- **Least connections** — send the next request to whichever server
  currently has the fewest active connections. Better than round robin
  when requests have very different processing times, since it adapts
  to actual load rather than just counting turns.
- **Weighted (round robin or least-connections)** — give some servers a
  higher share of traffic, typically because they have more capacity
  (a bigger instance type) or are being gradually ramped up (a canary
  deploy).
- **IP hash** — route based on a hash of the client's IP, so the same
  client consistently lands on the same server. Useful for **sticky
  sessions** when session state lives on one server's memory rather than
  a shared store — though a shared session store is usually the better
  fix, since IP hash breaks the moment a client's IP changes (switching
  networks) or a server goes down (rehashes everyone behind it).

## Health checks

A load balancer only helps if it stops sending traffic to a server
that's actually broken: it periodically pings each backend (an HTTP
\`/health\` endpoint, or just a TCP connect) and pulls any server that
stops responding out of rotation automatically. This is what turns "one
server crashed" into "a brief capacity dip" instead of "some fraction of
requests time out forever."

## Client-side vs. dedicated load balancing

- **Dedicated load balancer** — a separate piece of infrastructure (a
  hardware appliance, or software like NGINX/HAProxy/a cloud LB) that
  every request passes through. Simple mental model, but it's a single
  additional hop, and can itself become a bottleneck or single point of
  failure if not made highly available. This is a specific case of the
  broader [reverse proxy](/nuggets/proxy-vs-reverse-proxy) shape:
  load balancing is one of several jobs a reverse proxy can do.
- **Client-side load balancing** — the calling service itself holds a
  list of healthy backend instances (via a **service registry** it
  queries or subscribes to) and picks one directly, no intermediary hop.
  Common in service-mesh architectures for internal service-to-service
  calls, where the extra hop of a dedicated LB adds latency that adds up
  across many internal calls in one request's lifecycle.

\`\`\`mermaid
flowchart LR
    subgraph Dedicated
    C1[Client] --> LB[Load Balancer] --> S1[Server A] & S2[Server B]
    end
\`\`\`

\`\`\`mermaid
flowchart LR
    subgraph "Client-side"
    C2[Client] -->|"looks up healthy<br/>instances itself"| R[Service Registry]
    C2 --> S3[Server A] & S4[Server B]
    end
\`\`\`

## Where to go from here

Load balancing distributes read *and* write traffic across stateless
servers. It doesn't, by itself, scale a database. For that, see
[Scaling Reads vs. Scaling Writes](/nuggets/scaling-reads-vs-scaling-writes)
and [Sharding Strategies](/nuggets/sharding-strategies).
`,hy={id:"networking-load-balancing",title:"Networking: Load Balancing",tags:["networking","reliability","performance"],body:dy,format:"guide"},fy=`Plain request/response HTTP assumes the client always speaks first.
Anything that needs the *server* to push data the instant it's
available (a chat message, a live score, a notification) needs a
different mechanism. This guide covers the options and how they scale;
for the underlying transport differences (TCP vs. QUIC) they build on,
see [Networking: Protocols](/guides/networking-protocols).

## Long polling

The client makes a request and the server simply **holds it open**
without responding until there's actually something to send (or a
timeout is hit), then the client immediately opens a new request. It
works over plain HTTP with no special client support, but each open
connection ties up server resources for as long as it's held, and there's
still a gap (the time to open the next request) after each response.

## Server-Sent Events (SSE)

A single long-lived HTTP connection over which the **server** streams a
sequence of text events to the client, one-directional:

\`\`\`
event: order-update
data: {"orderId": 42, "status": "shipped"}

event: order-update
data: {"orderId": 42, "status": "delivered"}
\`\`\`

Built on plain HTTP (no special protocol upgrade), with automatic
reconnection handled by the browser's \`EventSource\` API. The one-way
limitation is also its strength for this use case: if the client never
needs to send anything back over the same connection (status updates,
live feeds, notifications), SSE is simpler than WebSockets and gets
HTTP/2 multiplexing for free.

## WebSockets

A protocol upgrade from an initial HTTP request into a persistent,
**bidirectional** connection: either side can send a message at any
time, not just in response to the other. The right choice when the
client genuinely needs to send data back over the same live connection,
not just receive it (a chat app, collaborative editing, multiplayer
game state).

\`\`\`mermaid
sequenceDiagram
    participant Client
    participant Server
    Client->>Server: HTTP request with Upgrade: websocket header
    Server-->>Client: 101 Switching Protocols
    Note over Client,Server: connection is now bidirectional
    Client->>Server: message
    Server->>Client: message
    Server->>Client: message (unprompted)
\`\`\`

The cost is state: unlike a stateless HTTP request, a WebSocket
connection lives on one specific server for its whole lifetime, which
complicates horizontal scaling (see fan-out, below) and means a server
restart drops every connection it's holding, not just in-flight
requests.

## WebRTC

Peer-to-peer: once a connection is established (via a signaling
server that helps two peers find and negotiate with each other, and
usually a STUN/TURN server to work around NAT), data flows **directly**
between clients, not through the application server at all. Built for
low-latency media (video/audio calls, real-time collaboration where
the round trip through a central server would add unacceptable delay),
at the cost of significantly more connection-setup complexity than
either SSE or WebSockets, and no server in the loop to easily persist
or audit what was sent.

## Fan-out at scale

A single server can hold a bounded number of concurrent long-lived
connections (SSE or WebSocket), and protocol choice has surprisingly
little to do with how far this scales. The actual constraint is
**fan-out**: when an event happens, how does it reach every connected
client that cares, when those clients' connections are spread across
many server instances?

\`\`\`mermaid
flowchart LR
    E["Event occurs"] --> P["Publish to Redis Pub/Sub<br/>or Kafka topic"]
    P --> S1["Server A<br/>(holds clients 1-3)"]
    P --> S2["Server B<br/>(holds clients 4-6)"]
    S1 --> C1[Client 1] & C2[Client 2] & C3[Client 3]
    S2 --> C4[Client 4] & C5[Client 5] & C6[Client 6]
\`\`\`

Each server instance subscribes to a shared pub/sub layer (Redis
Pub/Sub, Kafka) rather than trying to track every other server's
connections directly: when an event occurs, it's published once, and
every server instance forwards it only to the clients actually
connected to *that* instance. This is also why sticky sessions or a
connection registry (which server holds which client) matter here in a
way they don't for stateless HTTP requests.

## Choosing

| | Direction | Best fit |
| --- | --- | --- |
| Long polling | Server → client (simulated) | Broadest compatibility, lowest implementation complexity |
| SSE | Server → client only | Live feeds, notifications, status updates |
| WebSockets | Bidirectional | Chat, collaborative editing, anything needing client → server too |
| WebRTC | Peer-to-peer | Low-latency media, when routing through a server adds unacceptable delay |

## Where to go from here

Holding open connections is only half the problem: reliably getting an
event to the right server instance to push in the first place is a
messaging problem; see [Kafka](/guides/kafka) or [Redis](/guides/redis)
for the pub/sub layer this fan-out typically runs on.
`,py={id:"networking-real-time-communication",title:"Networking: Real-Time Communication",tags:["networking","apis","patterns"],body:fy,format:"guide"},my=`Choosing how data is shaped and stored is one of the highest-leverage
decisions in a system design — harder to change later than almost
anything else, since every access pattern built on top of a schema
inherits its constraints. This guide covers choosing a database model,
schema design, and normalization; for the specific SQL-vs-NoSQL
consistency and scaling tradeoff, see
[SQL vs. NoSQL](/nuggets/sql-vs-nosql).

## Choosing a database model

- **Relational** — fixed schema, strong relationships enforced by the
  database (foreign keys, constraints), full ACID transactions. Best
  when data has genuine structure and relationships that matter (an
  order needs a valid customer; a payment needs a valid order) and you
  want the database itself to enforce that, not application code.
- **Document** — each record is a flexible, often nested JSON-like blob.
  Best when records are naturally self-contained and don't need to be
  joined against each other on every read (a user profile, a product
  catalog entry).
- **Key-value** — the simplest model: look up a value by an exact key,
  nothing else. Best for pure lookup-by-id access patterns (a session
  store, a feature flag cache) where you'd never query by anything but
  the key.
- **Wide-column** — rows can have different columns, and the schema is
  optimized for very high write throughput and horizontal scale over
  strict relationships. Best for time-ordered or write-heavy data at
  large scale (see [DynamoDB & Cassandra](/guides/dynamodb-and-cassandra)).
- **Graph** — nodes and edges are first-class, and traversing
  relationships (friends-of-friends, recommendation paths) is the
  primary query pattern, done efficiently because the database indexes
  relationships directly rather than computing joins on the fly. Best
  when the *relationships between* entities, not just the entities
  themselves, are what queries actually need — a relational database
  can model a graph, but a multi-hop traversal query degrades badly as
  join depth grows.

\`\`\`mermaid
flowchart TD
    Q{"What does the dominant<br/>query pattern need?"}
    Q -->|"Joins, transactions,<br/>enforced structure"| R[Relational]
    Q -->|"Flexible, self-contained<br/>records"| D[Document]
    Q -->|"Pure lookup by key"| KV["Key-Value"]
    Q -->|"Huge write volume,<br/>horizontal scale"| WC["Wide-Column"]
    Q -->|"Multi-hop relationship<br/>traversal"| G[Graph]
\`\`\`

## Schema design by access pattern

The right schema follows from how data will actually be *queried*, not
just what the data conceptually "is." Two apps with identical entities
(users, posts, comments) can want opposite schemas if one mostly reads a
single post with all its comments at once (favoring denormalized,
embedded comments) and the other mostly queries comments independently
across posts (favoring a normalized, separately-queryable table). Design
the schema around the three or four queries that will actually run most
often, not around a theoretically "correct" entity model.

## Normalization vs. denormalization

- **Normalized** — each fact stored exactly once, related via foreign
  keys, joined at query time. No update anomalies (change a customer's
  name once, every order referencing them sees it), at the cost of a
  join on every read that touches related data.
- **Denormalized** — related data is duplicated inline, avoiding the
  join at read time, at the cost of needing to keep every copy in sync
  when the source of truth changes.

Denormalization is the right call for read-heavy, rarely-updated data
(analytics rollups, event logs, a product listing snapshot) where the
join cost on every read outweighs the sync cost on the rare write.
Caching a computed join result is often a better middle ground than
denormalizing the schema itself — see
[Cache Invalidation](/nuggets/cache-invalidation) for keeping that
cache correct.

## Scaling a schema

Once one database instance isn't enough, the schema itself has to
support being split — see [Sharding Strategies](/nuggets/sharding-strategies)
for choosing a shard key that matches the same dominant-access-pattern
principle this guide starts from.

## Where to go from here

A schema decision made early tends to be the most expensive one to
reverse. See [Expand-Contract Pattern](/nuggets/expand-contract) for
how to actually migrate a schema safely once it needs to change.
`,gy={id:"data-modeling",title:"Data Modeling",tags:["databases","patterns"],body:my,format:"guide"},yy=`A **CDN** (Content Delivery Network) caches content at servers
geographically distributed close to readers — "edge" locations — so a
request doesn't have to round-trip all the way to a single origin
server on every request.

## Why it matters

[Numbers Every Engineer Should Know](/nuggets/numbers-every-engineer-should-know)
puts a cross-continent round trip around 150ms, before any actual
work happens on the response. A CDN turns that into a much shorter trip
to a nearby edge location instead, for anything the edge already has
cached. At scale, it also simply absorbs traffic: a viral asset served
from a hundred edge locations doesn't concentrate all that load onto one
origin server.

## How it works

\`\`\`mermaid
sequenceDiagram
    participant Client
    participant Edge as CDN edge (nearby)
    participant Origin as Origin server
    Client->>Edge: GET /logo.png
    alt cache miss
        Edge->>Origin: GET /logo.png
        Origin-->>Edge: 200 OK + Cache-Control
        Edge-->>Edge: store in cache
    end
    Edge-->>Client: 200 OK (from edge, fast)
\`\`\`

- **Origin pull** (the common default) — the edge fetches from the
  origin on the first request for an object (a cache miss) and serves
  from cache on every subsequent one, until it expires.
- **Origin push** — content is proactively uploaded to edge locations
  ahead of any request, common for large, known-popular assets (a
  software release, a video premiere) where the first-request latency
  penalty of origin pull isn't acceptable.

## Cache-Control governs everything

A CDN is a cache, and it obeys exactly the same headers described in
[APIs: Best Practices](/guides/api-best-practices)'s caching section:
\`Cache-Control\` tells the edge how long it may serve a response without
re-checking the origin, and \`ETag\`/conditional requests let it
revalidate cheaply instead of re-downloading. Getting this wrong in
either direction is a real cost: too short a TTL means the CDN barely
helps (constant origin re-fetches); too long means stale content serves
long after the origin changed. It's the exact tradeoff
[Cache vs. Freshness](/nuggets/cache-vs-freshness) describes generally,
just now with a globally-distributed cache instead of a single one.

## Static vs. dynamic content

CDNs are the obvious fit for genuinely static assets (images, JS/CSS
bundles, video) that are identical for every viewer. Modern CDNs also
accelerate *dynamic*, per-user content by running compute at the edge
(edge functions) or simply optimizing the network path to origin even
when the response itself can't be cached. The connection setup and
routing improvements still help even for a response that's never
cacheable.

## Where it applies

Any content served to geographically distributed users: web assets,
video streaming, API responses that are the same across users (public
product catalogs, not personalized feeds), and as a first line of
defense absorbing traffic spikes before they ever reach the origin.

## Where to go from here

A CDN's help is limited to requests a cache can actually serve; how the
origin itself scales is a separate problem. For that, see
[Scaling Reads vs. Scaling Writes](/nuggets/scaling-reads-vs-scaling-writes).
`,vy={id:"cdn",title:"Networking: CDN",tags:["networking","performance"],body:yy,format:"guide"},wy=`Redis is an in-memory data store: everything lives in RAM by default,
which is what makes it fast (see the RAM-vs-disk gap in
[Numbers Every Engineer Should Know](/nuggets/numbers-every-engineer-should-know)),
and it's reached for in system design far more often as a building
block than as a primary database.

## Core data structures

Unlike a plain key-value cache, Redis's values have real types with
their own operations, not just opaque blobs:

- **Strings** — the simplest type; also how counters work
  (\`INCR\`/\`DECR\` are atomic, which is exactly what backs the
  [Rate Limiting](/nuggets/rate-limiting) nugget's distributed-counter
  section).
- **Hashes** — a field → value map within one key, good for representing
  an object (a user's session data) without needing a separate key per
  field.
- **Lists** — ordered, with fast push/pop from either end, a natural
  fit for a simple queue.
- **Sets / Sorted Sets** — unique members, with sorted sets adding a
  score per member, kept in order automatically. This is what backs
  leaderboards (\`ZADD\`/\`ZRANGE\` by score) and, as mentioned in
  [Rate Limiting](/nuggets/rate-limiting), a sliding-window request log.

## Caching

The most common use case: sit Redis in front of a slower database and
serve hot reads from memory instead. The mechanics of keeping that cache
correct as underlying data changes are covered in
[Cache Invalidation](/nuggets/cache-invalidation). Redis is the
concrete implementation of the "cache" in that pattern for most systems
that aren't using a CDN or in-process cache.

## Distributed locks

\`SET key value NX EX ttl\` provides atomic, TTL-bounded mutual exclusion
across processes — see [Distributed Locks](/nuggets/distributed-locks)
for the full mechanics and the fencing-token gotcha that comes with
using Redis (or anything) this way.

## Pub/Sub

Redis can also act as a lightweight message bus: a \`PUBLISH\` to a
channel is delivered to every currently-subscribed client. It's not
durable: a subscriber that's offline when a message is published never
receives it, unlike a real queue with persistent storage (see
[Kafka](/guides/kafka)). That makes it a good fit for ephemeral
fan-out (like the real-time-update fan-out described in
[Networking: Real-Time Communication](/guides/networking-real-time-communication))
and a poor fit for anything that needs guaranteed delivery.

## Persistence, briefly

Redis is in-memory first, but isn't necessarily volatile: **RDB**
periodically snapshots the whole dataset to disk (fast to restore from,
but can lose the last few minutes of writes on a crash); **AOF**
(append-only file) logs every write operation and replays it on
restart (more durable, larger on disk, slower to restore). Many
deployments use both, or accept RDB's small data-loss window for pure
cache use cases where the source of truth lives elsewhere anyway.

## Where it applies

Caching, rate limiting, distributed locks, session storage,
leaderboards, and lightweight pub/sub: almost always as an
accelerating layer in front of or alongside a primary database, rarely
as the system of record for data that must never be lost.

## What the data structures buy you

What Redis actually buys you is the data structures, not raw speed:
sorted sets, atomic counters, and TTL-bearing keys map directly onto
specific distributed-systems problems (rate limiting, locks,
leaderboards) that would otherwise need custom logic built on top of a
plainer store.
`,by={id:"redis",title:"Redis",tags:["databases","performance","tooling"],body:wy,format:"guide"},ky=`Kafka is a distributed **log** (not a traditional queue), and that
distinction shapes almost everything about how and when it's the right
tool.

## Topics, partitions, and offsets

Messages are published to a **topic**, which is split into
**partitions** for parallelism — each partition is an ordered,
append-only log, and a message's position in it is its **offset**.
Order is only guaranteed *within* a partition, not across the whole
topic, which is why the partition key (what determines which partition
a message lands on) matters as much as a database's shard key does.
See [Sharding Strategies](/nuggets/sharding-strategies) for the same
underlying tradeoff.

\`\`\`mermaid
flowchart LR
    subgraph "Topic: orders"
    P0["Partition 0: [msg, msg, msg, msg]"]
    P1["Partition 1: [msg, msg, msg]"]
    end
    Producer --> P0 & P1
    P0 --> C1["Consumer (group A)"]
    P1 --> C2["Consumer (group A)"]
\`\`\`

## Producers, consumers, and consumer groups

Producers write to a topic; consumers read from it, tracking their own
offset (how far they've read) rather than the broker removing messages
once delivered. Multiple consumers can form a **consumer group**, and
Kafka automatically splits the topic's partitions across them: each
partition is read by exactly one consumer within a group at a time,
which is how Kafka parallelizes consumption while still preserving
per-partition order.

## Why not just a traditional queue

A traditional queue (SQS, RabbitMQ) typically **removes** a message once
it's been consumed and acknowledged: one message, one logical
consumption. Kafka instead **retains** messages for a configured period
(hours to indefinitely) regardless of whether anyone's read them yet,
and multiple independent consumer groups can each read the same topic
from their own offset, entirely independently. This is what makes Kafka
a natural fit for **event streaming**: the same order-created event can
feed a fulfillment service, an analytics pipeline, and a notification
service, each consuming at its own pace from the same retained log,
rather than a single point-to-point handoff.

## Where it applies

- **Event-driven architectures** — the relay target for
  [the Outbox Pattern](/nuggets/outbox-pattern)'s unsent-event table, or
  the destination stream for [Change Data Capture](/nuggets/change-data-capture).
- **Stream processing** — feeding a system (often paired with Flink or
  Kafka Streams) that computes over data continuously rather than in
  scheduled batches.
- **Decoupling producers from consumers** at high volume: a producer
  publishing at its own rate without needing consumers to keep up in
  real time, since the log retains what hasn't been read yet.

## Where to go from here

Kafka guarantees ordering only within a partition and delivery is
at-least-once by default. Consumers need to be
[idempotent](/nuggets/idempotency) for exactly the same reason any
at-least-once system does.
`,xy={id:"kafka",title:"Kafka",tags:["messaging","tooling"],body:ky,format:"guide"},Sy=`Elasticsearch is a search engine built around the **inverted index** —
a data structure optimized for a fundamentally different question than
what a database index answers.

## The inverted index

A normal [database index](/nuggets/database-indexing) (a B-tree) maps a
value to the rows containing it: fast for "find the row where
\`email = 'x'\`," bad at "find every row whose \`description\` *contains*
the word 'waterproof' anywhere in a paragraph of text." An inverted
index flips the relationship: it maps each individual **term** to the
list of documents containing it.

\`\`\`
"waterproof" → [doc_12, doc_47, doc_203, ...]
"jacket"     → [doc_12, doc_88, doc_203, ...]
\`\`\`

A search for "waterproof jacket" intersects both lists (documents
containing both terms), which is fast regardless of how long the
underlying text field is, unlike a \`LIKE '%waterproof%'\` scan against a
relational column, which can't use a B-tree at all and falls back to
checking every row.

## Documents, indices, and mapping

Elasticsearch stores schema-flexible JSON **documents**, grouped into an
**index** (roughly analogous to a database table, though the analogy
breaks down quickly). A **mapping** defines how each field is analyzed: whether a text field
gets tokenized and lowercased for full-text search, or stored as an
exact-match keyword (useful for filtering/aggregating, not full-text
search). Getting this wrong (e.g. mapping a field as \`keyword\` when you
needed full-text search on it) is a common source of "my search isn't
finding an obvious match" bugs.

## Relevance ranking

Unlike an exact-match database query, a text search returns *ranked*
results: Elasticsearch scores each match (commonly via **BM25**, which
weighs terms higher if they're rare across the corpus but frequent in a
specific document) so "best match first" is a first-class concept, not
something the application has to compute itself.

## When to reach for it vs. a database index

A relational database's full-text search extensions (like Postgres's
\`GIN\` index, mentioned in
[Database Indexing](/nuggets/database-indexing)) work fine for
moderate-scale, simple text search without introducing a second system.
Elasticsearch earns its place once search needs go beyond that: faceted
search (filter by category *and* price range *and* rating,
simultaneously, fast), typo tolerance (fuzzy matching), relevance tuning,
or search volume/data size that a single relational instance can't
comfortably serve alongside its transactional workload.

## Where it applies

Product search, log search/analysis (the "ELK stack" — Elasticsearch,
Logstash, Kibana — is a common [observability](/nuggets/observability)
logs backend), and full-text search over any large document collection.

## What actually makes it faster

The index structure is doing all the work here, not raw horsepower:
inverted instead of B-tree, purpose-built to answer "which documents
match these terms, ranked by relevance" — a question a B-tree was never
designed to answer efficiently at all.
`,Cy={id:"elasticsearch",title:"Elasticsearch",tags:["databases","tooling"],body:Sy,format:"guide"},Ty=`Relational databases (Postgres, MySQL, and similar) are the default
starting point for most new systems, and understanding what their ACID
guarantees actually buy you is what separates "we use Postgres" from
knowing when that's genuinely the right call. For choosing relational
vs. other models in the first place, see
[Data Modeling](/guides/data-modeling) and
[SQL vs. NoSQL](/nuggets/sql-vs-nosql).

## ACID, concretely

- **Atomicity** — a transaction's statements all commit or none do.
  Transfer $10 from account A to account B: debit A and credit B either
  both happen or neither does. There's no state where the money left A
  but never arrived at B.
- **Consistency** — a transaction can only move the database from one
  valid state to another, per its own constraints (foreign keys, unique
  constraints, checks). The database itself refuses a write that would
  violate them, rather than trusting application code to check first.
- **Isolation** — concurrent transactions don't see each other's
  uncommitted, in-progress changes — see isolation levels, below, for
  exactly how much.
- **Durability** — once a transaction commits, it survives a crash
  immediately after (via the write-ahead log, the same mechanism
  [Change Data Capture](/nuggets/change-data-capture) reads from).

## Isolation levels

Isolation is a dial, not a single guarantee, and the level chosen trades
correctness for concurrency:

| Level | Prevents | Allows |
| --- | --- | --- |
| Read Uncommitted | Nothing | Dirty reads (seeing another transaction's uncommitted writes) |
| Read Committed | Dirty reads | Non-repeatable reads (a row you re-read mid-transaction has changed) |
| Repeatable Read | Non-repeatable reads | Phantom reads (a *new* row matching your query appears on re-query) |
| Serializable | Everything | Transactions behave as if run one at a time — full safety, least concurrency |

Most applications default to Read Committed (Postgres's default) and
only reach for stricter isolation for specific operations that genuinely
need it (like the version-check pattern in
[Optimistic vs. Pessimistic Locking](/nuggets/optimistic-vs-pessimistic-locking)).
Serializable everywhere is correct but expensive, since it forces far
more transaction retries under contention.

## Postgres vs. MySQL, briefly

Both are mature, ACID-compliant, and broadly similar for most
applications; the practical differences that actually matter for a
choice are narrower than the debate around them suggests. Postgres has
richer built-in data types and extensions (\`JSONB\`, \`PostGIS\` for
[geospatial indexing](/nuggets/geospatial-indexing), \`pgvector\` for
[vector search](/nuggets/vector-databases)) and a reputation for
stricter standards compliance; MySQL has historically had a simpler
replication story and remains extremely common in existing
infrastructure. Neither is "faster" in a way that generalizes across
workloads: the extensions and ecosystem fit matter more than raw
performance for most real choices.

## Where it applies

Any data with genuine structure and relationships that benefit from the
database enforcing them — orders, accounts, inventory, anything where
"can this write even be applied validly" is a question worth the
database answering rather than trusting the application layer alone.

## Where to go from here

A single relational instance eventually hits a scaling ceiling on
writes — see [Sharding Strategies](/nuggets/sharding-strategies) and
[Scaling Reads vs. Scaling Writes](/nuggets/scaling-reads-vs-scaling-writes)
for what comes after "add a bigger server."
`,Ey={id:"relational-databases",title:"Relational Databases",tags:["databases","tooling"],body:Ty,format:"guide"},Py=`DynamoDB and Cassandra are the two wide-column/key-value stores that
come up most often in system design discussions — both built from the
start for horizontal write scale and high availability, at the cost of
the strict consistency and rich querying a relational database offers.
See [SQL vs. NoSQL](/nuggets/sql-vs-nosql) for the general tradeoff
these are concrete examples of.

## The data model

Both are built around a **partition key** that determines which node
owns a given row (via [consistent hashing](/nuggets/consistent-hashing)
in both systems), plus an optional key that orders rows *within* a
partition:

- **DynamoDB** — partition key (+ optional **sort key**). All items
  sharing a partition key are stored together and can be range-queried
  by sort key efficiently (e.g. partition key \`user_id\`, sort key
  \`timestamp\`, to fetch a user's items in time order).
- **Cassandra** — partition key (+ **clustering columns**). Same idea:
  clustering columns define the on-disk sort order within a partition.

In both, a query that doesn't specify the partition key can't be served
efficiently: there's no B-tree-style secondary index scanning the
whole dataset by default the way a relational database offers. This is
the sharp edge both systems share: the access patterns have to be
designed *before* the schema, not discovered afterward, because
changing how data is queried later often means the partition key was
wrong from the start.

## Consistency model

Both default to **eventual consistency**, and both let you dial it
per-request:

- **DynamoDB** — choose eventually-consistent (cheaper, faster) or
  strongly-consistent (reads always reflect the latest write, at a
  performance cost) per read.
- **Cassandra** — a tunable **consistency level** per query (\`ONE\`,
  \`QUORUM\`, \`ALL\`) that trades off how many replicas must acknowledge a
  read/write before it succeeds — \`QUORUM\` reads plus \`QUORUM\` writes
  guarantees you'll always see the latest write, since the two sets of
  replicas are guaranteed to overlap.

This is [CAP Theorem](/nuggets/cap-theorem) made concrete and
adjustable: both systems default toward the **AP** side, but let a
specific query trade some availability/latency back for consistency
when it actually needs it, rather than making the whole system pick
one side globally.

## When to reach for these vs. a relational database

Reach for one of these when write volume or required availability
exceeds what a single-leader relational database can offer, and the
access patterns are genuinely key-based (fetch by a known partition
key) rather than needing ad-hoc joins and complex queries across
unrelated entities. Reach for
[a relational database](/guides/relational-databases) when strong
consistency, transactions across multiple rows, and flexible querying
matter more than horizontal write scale — most applications, until
scale genuinely forces the tradeoff.

## Where to go from here

Both systems' partition-key model is the same sharding decision
described generally in
[Sharding Strategies](/nuggets/sharding-strategies): the "choose the
key that matches your dominant query pattern" principle applies
identically here, just enforced by the database rather than left to a
manual sharding scheme.
`,Ay={id:"dynamodb-and-cassandra",title:"DynamoDB & Cassandra",tags:["databases","tooling"],body:Py,format:"guide"},_y=`An API gateway sits in front of a system's backend services as the
single entry point every external request passes through, centralizing
concerns that would otherwise be duplicated in every individual
service.

## What it actually does

\`\`\`mermaid
flowchart LR
    Client --> GW["API Gateway"]
    GW --> S1["Orders service"]
    GW --> S2["Users service"]
    GW --> S3["Payments service"]
\`\`\`

- **Routing** — maps incoming paths to the right backend service
  (\`/orders/*\` → orders service), so clients don't need to know the
  internal service topology at all, and that topology can change without
  clients noticing.
- **Authentication** — verifies who's calling once, at the edge, rather
  than every downstream service independently re-implementing JWT
  verification or API key checks — see
  [APIs: Best Practices](/guides/api-best-practices) for the actual
  auth mechanics this centralizes.
- **Rate limiting** — enforces per-client limits in one place; see
  [Rate Limiting](/nuggets/rate-limiting) for the algorithms a gateway
  typically implements this with.
- **Logging & observability** — every request passes through one
  chokepoint, which is a natural place to attach the request id and
  emit the request-level metrics/traces described in
  [Observability](/nuggets/observability).

## Why centralize this instead of per-service

Without a gateway, every backend service needs its own auth
verification, rate limiting, and logging: duplicated logic, and
duplicated risk of one service implementing it slightly wrong. A gateway
also means backend services can be genuinely internal (not
individually exposed to the internet, not individually needing TLS
termination or public-facing hardening), since only the gateway is
public-facing.

## The cost

A gateway is a new critical-path component — every request passes
through it, so its own availability and latency budget matter as much
as any backend service's, and it can become a bottleneck or single
point of failure if not itself made highly available (typically behind
a [load balancer](/guides/networking-load-balancing) with multiple
gateway instances, not one). It also adds a network hop's worth of
latency to every request, which matters more for latency-sensitive
internal service-to-service calls than for public API traffic.

## Where it applies

Any system with multiple backend services behind one public surface.
Almost every microservices architecture uses one, both for the reasons
above and because it's the natural place to enforce a consistent API
contract across services that might otherwise each drift toward
inconsistent conventions. Pairing an API gateway with
[serverless functions](/guides/serverless-aws-lambda) as the backend
(API Gateway routing directly to Lambda, with no server running between
requests) is one of the most common shapes a small API takes.

## What it buys you

Nothing here is capability a single service couldn't implement on its
own — auth, rate limiting, routing, and logging can all be built into
each backend individually. What a gateway actually buys is centralizing
those correctness-critical concerns in one place, instead of trusting
every team owning a different backend service to reimplement them
identically and get all of them right.
`,Ly={id:"api-gateway",title:"APIs: Gateway",tags:["apis","networking","tooling"],body:_y,format:"guide"},Ry=`Blob storage (S3 and similar) stores arbitrary binary objects at
massive scale, and its object model is deliberately simpler than a
filesystem's: that simplicity is exactly what lets it scale the way it
does.

## The object model

Everything is a **bucket** (a top-level namespace) containing
**objects**, each addressed by a flat **key**. There's no real
directory structure underneath, even though keys with \`/\` in them
(\`photos/2024/summer.jpg\`) are commonly displayed *as if* there were
one:

\`\`\`
bucket: user-uploads
  key: user-42/avatar.jpg
  key: user-42/documents/resume.pdf
  key: user-88/avatar.jpg
\`\`\`

That \`documents/\` segment is just characters inside the key string, not
a reference to any real folder object.
This flat model is what makes blob storage horizontally scalable in a
way a traditional hierarchical filesystem isn't: there's no directory
inode that every write inside it has to update, so writes to unrelated
keys never contend with each other regardless of how "nested" their
keys look.

## What it's for (and not for)

Blob storage is built for storing and retrieving whole objects by key,
not for partial in-place updates (changing a byte range inside an
existing object generally means rewriting the whole object), not for
low-latency small reads (it trades some latency for durability and
scale — see [Numbers Every Engineer Should Know](/nuggets/numbers-every-engineer-should-know)
for roughly where it sits relative to a database or cache read), and
not for complex querying (there's no index on object *contents*, only
on the key). It's the right tool for exactly what a database row is the
wrong tool for: large binary content — images, video, backups, log
archives, ML model files.

## Uploading and serving without a bottleneck

Routing large files through an application server wastes exactly the
resource a stateless app server should be scaling independently of file
size. See
[Handling Large File Uploads](/nuggets/large-file-uploads) for the
presigned-URL pattern that lets a client upload directly to blob
storage, with the app server only issuing short-lived permission. The
same idea applies in reverse for downloads: a presigned URL or, for
anything served to many readers, a [CDN](/guides/cdn) in front of the
bucket, rather than proxying every download through the app.

## Durability and storage classes

Object storage services typically offer tiered storage classes trading
retrieval latency for cost — a "standard" tier for frequently-accessed
objects, down to "archive" tiers (minutes-to-hours retrieval time) for
data that's rarely read but must be retained (compliance archives, old
backups). Choosing the wrong tier for an access pattern is a common,
avoidable cost mistake — archival pricing looks great until something
in that tier needs to be read urgently.

## Where it applies

User-uploaded content, static website assets, data lake storage, backup
and archival, and as the durable landing zone for anything a
[long-running task](/nuggets/long-running-tasks) produces as output.

## Key insight

Blob storage's flat key/object model is a deliberate simplification
that trades filesystem-like features (partial updates, real
directories, low-latency small reads) for horizontal scale and
durability at a size a traditional filesystem was never built for.
`,Ny={id:"blob-storage",title:"Blob Storage",tags:["tooling","apis"],body:Ry,format:"guide"},Iy=`Serverless compute (AWS Lambda is the flagship example, and what most
people mean when they say "serverless") runs your code in response to
an event and bills only for the time it actually executes, with no
server to provision, patch, or keep running between invocations.

## The execution model

A Lambda function is stateless and ephemeral by design: it's invoked,
runs, returns a result, and its execution environment may or may not
still exist the next time it's invoked. Nothing written to local state
is guaranteed to survive between invocations (the \`/tmp\` directory
persists only for as long as that specific environment happens to stay
warm — not something to rely on).

\`\`\`mermaid
flowchart LR
    T1["API Gateway"] --> L[Lambda function]
    T2["S3 upload"] --> L
    T3["SQS message"] --> L
    T4["EventBridge<br/>schedule/event"] --> L
    T5["DynamoDB stream"] --> L
    L --> R[Result / side effect]
\`\`\`

Almost anything can trigger one — an HTTP request via
[API Gateway](/guides/api-gateway), a file landing in
[blob storage](/guides/blob-storage), a message on a queue, a scheduled
event, a database change stream. This is what makes serverless a
natural fit for event-driven architectures: the function is just the
"what happens when X occurs" piece, with no idle capacity sitting
around waiting for X.

## Cold starts, and how they're actually mitigated in 2026

A **cold start** is the latency penalty of provisioning a fresh
execution environment (downloading the code, starting the runtime,
running any module-level initialization) before your handler code
even begins. A **warm** invocation skips all of that and just runs the
handler directly, which is why identical requests can have wildly
different latency depending on whether an existing environment was
available to reuse.

Current mitigations, in order of how commonly they're reached for:

- **Graviton (ARM64)** — AWS's own Arm-based processors cut cold start
  latency by roughly 45-65% across runtimes compared to x86, are up to
  ~19% faster overall, and cost about 20% less. There's rarely a reason
  not to build for \`arm64\` unless a dependency genuinely requires x86.
- **Provisioned Concurrency** — pay to keep a set number of execution
  environments pre-initialized and warm at all times, so those
  invocations never pay the cold-start cost at all. The right tool for
  a latency-sensitive path with predictable traffic; wasteful for
  bursty, unpredictable traffic since you're paying for idle capacity.
- **SnapStart** (Java, Python, and .NET) — takes a snapshot of an
  initialized execution environment and resumes from it instead of
  booting from scratch, removing an estimated 70-90% of init latency
  for the runtimes it supports.

One easy-to-miss cost detail: **as of August 2025, AWS bills for the
initialization phase of a cold start**, not just handler execution time.
That's worth knowing if you're estimating cost from an older
understanding of Lambda's pricing model, especially for
initialization-heavy runtimes like Java or C#.

## Quotas that shape real designs

| Quota | Value |
| --- | --- |
| Memory | 128 MB – 10,240 MB |
| CPU | Scales with memory; 1 full vCPU at ~1,769 MB |
| Timeout | 900 seconds (15 minutes) — a hard limit, not raisable |
| Default concurrency | 1,000 executions account-wide (raisable via a quota request) |

The timeout being a hard limit matters more than it looks: a Lambda
invoked directly can run the full 15 minutes, but one invoked *through*
[API Gateway](/guides/api-gateway) inherits API Gateway's own separate
29-second hard timeout. A request that would otherwise finish in 3
minutes gets cut off at 29 seconds regardless of Lambda's own limit.
Anything that can genuinely run long needs the same pattern as
[Managing Long-Running Tasks](/nuggets/long-running-tasks): return
immediately with a job id, do the work asynchronously (a Lambda
triggered by a queue rather than a synchronous API call), and let the
client poll or get notified.

## Retries make idempotency non-optional

Asynchronous Lambda invocations (triggered by S3, SNS, EventBridge)
**retry automatically on failure** by default: a transient error in
your function can mean AWS invokes it again with the same event, with
no code on your part requesting that retry. This makes
[idempotency](/nuggets/idempotency) a hard requirement for serverless
handlers, not a nice-to-have: any function that isn't safe to run twice
on the same input will eventually run twice on the same input.

## The database connection problem

A traditional relational database has a fixed, small connection limit.
Lambda can scale from zero to hundreds of concurrent execution
environments in seconds, and if each one opens its own database
connection, a burst in traffic can exhaust the database's connection
limit before the burst even finishes. The standard fix is **RDS
Proxy** (or an equivalent connection-pooling layer) sitting between
Lambda and the database, pooling and reusing connections instead of
each invocation opening a fresh one — or reaching for a database with a
connection model designed for this (DynamoDB, Aurora Serverless) rather
than fighting a traditional one.

## Serverless vs. containers

- **Serverless (Lambda)** fits bursty or unpredictable traffic well:
  you pay per invocation, and scale-to-zero means no cost when nothing's
  happening. It fits poorly for steady, high-throughput workloads,
  where per-invocation overhead and cold starts add up to worse
  economics than a container that's already warm and handling a
  constant stream.
- **Containers** (see [Docker: Getting Started](/guides/docker-getting-started))
  fit steady workloads and anything needing more control over the
  runtime environment, long-lived connections, or execution beyond 15
  minutes — at the cost of paying for capacity whether or not it's
  currently in use.

AWS Fargate sits in between: containers, but billed and scaled more
like serverless (no server to manage). Worth knowing as the answer to
"I want container flexibility without giving up the scale-to-zero
economics."

## Where it applies

Event-driven glue code (resize an image on upload, process a queue
message), APIs with bursty or unpredictable traffic, scheduled jobs,
and anything where paying for idle capacity is the actual problem being
solved. Less of a fit for steady high-throughput services, anything
needing a long-lived connection or in-memory state across requests, or
executions that routinely approach the 15-minute ceiling.

## The real tradeoff

Serverless relocates operational complexity rather than eliminating
it: you stop managing servers and start managing cold starts, retry
semantics, connection exhaustion, and a hard timeout ceiling instead.
It's a genuinely good trade for the right workload shape (bursty,
event-driven, stateless), and a source of surprising failure modes for
the wrong one (steady, connection-heavy, long-running).
`,Dy={id:"serverless-aws-lambda",title:"Serverless & AWS Lambda",tags:["apis","tooling","performance"],body:Iy,format:"guide"},Ia=[ay,sy,ly,uy,hy,py,gy,vy,by,xy,Cy,Ey,Ay,Ly,Ny,Dy],ti=[...Na,...Ia];function My(e){return ti.find(t=>t.id===e)}function xr(e){return`/${e.format==="guide"?"guides":"nuggets"}/${e.id}`}function At(e){return Array.isArray?Array.isArray(e):Hd(e)==="[object Array]"}function jy(e){if(typeof e=="string")return e;if(typeof e=="bigint")return e.toString();const t=e+"";return t=="0"&&1/e==-1/0?"-0":t}function Ps(e){return e==null?"":jy(e)}function le(e){return typeof e=="string"}function ra(e){return typeof e=="number"}function Oy(e){return e===!0||e===!1||By(e)&&Hd(e)=="[object Boolean]"}function $d(e){return typeof e=="object"}function By(e){return $d(e)&&e!==null}function be(e){return e!=null}function Fr(e){return!e.trim().length}function Hd(e){return e==null?e===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(e)}const zy="Incorrect 'index' type",As="Invalid doc index: must be a non-negative integer within the bounds of the docs array",qy=e=>`Invalid value for key ${e}`,Wy=e=>`Pattern length exceeds max of ${e}.`,Fy=e=>`Missing ${e} property in key`,Uy=e=>`Property 'weight' in key '${e}' must be a positive integer`,$y="Fuse.match does not support useTokenSearch: token search requires corpus-level statistics (df, fieldCount) that a one-off string comparison does not have. Use new Fuse(...).search(...) instead.",Jl=Object.prototype.hasOwnProperty;var Hy=class{constructor(e){this._keys=[],this._keyMap={};let t=0;e.forEach(n=>{const r=Vd(n);this._keys.push(r),this._keyMap[r.id]=r,t+=r.weight}),this._keys.forEach(n=>{n.weight/=t})}get(e){return this._keyMap[e]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}};function Vd(e){let t=null,n=null,r=null,a=1,i=null;if(le(e)||At(e))r=e,t=Zl(e),n=aa(e);else{if(!Jl.call(e,"name"))throw new Error(Fy("name"));const s=e.name;if(r=s,Jl.call(e,"weight")&&e.weight!==void 0&&(a=e.weight,a<=0))throw new Error(Uy(aa(s)));t=Zl(s),n=aa(s),i=e.getFn??null}return{path:t,id:n,weight:a,src:r,getFn:i}}function Zl(e){return At(e)?e:e.split(".")}function aa(e){return At(e)?e.join("."):e}function Vy(e,t){const n=[];let r=!1;const a=(i,s,o,l)=>{if(be(i))if(!s[o])n.push(l!==void 0?{v:i,i:l}:i);else{const c=i[s[o]];if(!be(c))return;if(o===s.length-1&&(le(c)||ra(c)||Oy(c)||typeof c=="bigint"))n.push(l!==void 0?{v:Ps(c),i:l}:Ps(c));else if(At(c)){r=!0;for(let u=0,d=c.length;u<d;u+=1)a(c[u],s,o+1,u)}else s.length&&a(c,s,o+1,l)}};return a(e,le(t)?t.split("."):t,0),r?n:n[0]}const Qy={includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},Gy={isCaseSensitive:!1,ignoreDiacritics:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(e,t)=>e.score===t.score?e.idx<t.idx?-1:1:e.score<t.score?-1:1},Ky={location:0,threshold:.6,distance:100},Xy={useExtendedSearch:!1,useTokenSearch:!1,tokenize:void 0,tokenMatch:"any",getFn:Vy,ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1},R=Object.freeze({...Gy,...Qy,...Ky,...Xy});function Yy(e){return e>=9&&e<=13||e===32||e===160}function Jy(e=1,t=3){const n=new Map,r=Math.pow(10,t);return{get(a){let i=0,s=!1;for(let l=0;l<a.length;l++)Yy(a.charCodeAt(l))?s=!1:s||(i++,s=!0);if(i===0&&(i=1),n.has(i))return n.get(i);const o=Math.round(r/Math.pow(i,.5*e))/r;return n.set(i,o),o},clear(){n.clear()}}}var Ro=class{constructor({getFn:e=R.getFn,fieldNormWeight:t=R.fieldNormWeight}={}){this.norm=Jy(t,3),this.getFn=e,this.isCreated=!1,this.docs=[],this.keys=[],this._keysMap={},this.setIndexRecords()}setSources(e=[]){this.docs=e}setIndexRecords(e=[]){this.records=e}setKeys(e=[]){this.keys=e,this._keysMap={},e.forEach((t,n)=>{this._keysMap[t.id]=n})}create(){if(this.isCreated||!this.docs.length)return;this.isCreated=!0;const e=this.docs.length;this.records=new Array(e);let t=0;if(le(this.docs[0]))for(let n=0;n<e;n++){const r=this._createStringRecord(this.docs[n],n);r&&(this.records[t++]=r)}else for(let n=0;n<e;n++)this.records[t++]=this._createObjectRecord(this.docs[n],n);this.records.length=t,this.norm.clear()}add(e,t){if(!Number.isInteger(t)||t<0)throw new Error(As);if(le(e)){const r=this._createStringRecord(e,t);return r&&this.records.push(r),r}const n=this._createObjectRecord(e,t);return this.records.push(n),n}removeAt(e){if(!Number.isInteger(e)||e<0)throw new Error(As);for(let t=0,n=this.records.length;t<n;t+=1)if(this.records[t].i===e){this.records.splice(t,1);break}for(let t=0,n=this.records.length;t<n;t+=1)this.records[t].i>e&&(this.records[t].i-=1)}removeAll(e){const t=new Set;for(const r of e)Number.isInteger(r)&&r>=0&&t.add(r);if(t.size===0)return;this.records=this.records.filter(r=>!t.has(r.i));const n=Array.from(t).sort((r,a)=>r-a);for(const r of this.records){let a=0,i=n.length;for(;a<i;){const s=a+i>>>1;n[s]<r.i?a=s+1:i=s}r.i-=a}}getValueForItemAtKeyId(e,t){return e[this._keysMap[t]]}size(){return this.records.length}_createStringRecord(e,t){return!be(e)||Fr(e)?null:{v:e,i:t,n:this.norm.get(e)}}_createObjectRecord(e,t){const n={i:t,$:{}};for(let r=0,a=this.keys.length;r<a;r++){const i=this.keys[r],s=i.getFn?i.getFn(e):this.getFn(e,i.path);if(be(s)){if(At(s)){const o=[];for(let l=0,c=s.length;l<c;l+=1){const u=s[l];if(be(u)){if(le(u)){if(!Fr(u)){const d={v:u,i:l,n:this.norm.get(u)};o.push(d)}}else if(be(u.v)){const d=le(u.v)?u.v:Ps(u.v);if(!Fr(d)){const f={v:d,i:u.i,n:this.norm.get(d)};o.push(f)}}}}n.$[r]=o}else if(le(s)&&!Fr(s)){const o={v:s,n:this.norm.get(s)};n.$[r]=o}}}return n}toJSON(){return{keys:this.keys.map(({getFn:e,...t})=>t),records:this.records}}};function Qd(e,t,{getFn:n=R.getFn,fieldNormWeight:r=R.fieldNormWeight}={}){const a=new Ro({getFn:n,fieldNormWeight:r});return a.setKeys(e.map(Vd)),a.setSources(t),a.create(),a}function Zy(e,{getFn:t=R.getFn,fieldNormWeight:n=R.fieldNormWeight}={}){const{keys:r,records:a}=e,i=new Ro({getFn:t,fieldNormWeight:n});return i.setKeys(r),i.setIndexRecords(a),i}function ev(e=[],t=R.minMatchCharLength){const n=[];let r=-1,a=-1,i=0;for(let s=e.length;i<s;i+=1){const o=e[i];o&&r===-1?r=i:!o&&r!==-1&&(a=i-1,a-r+1>=t&&n.push([r,a]),r=-1)}return e[i-1]&&i-r>=t&&n.push([r,i-1]),n}function tv(e,t,n,{location:r=R.location,distance:a=R.distance,threshold:i=R.threshold,findAllMatches:s=R.findAllMatches,minMatchCharLength:o=R.minMatchCharLength,includeMatches:l=R.includeMatches,ignoreLocation:c=R.ignoreLocation}={}){if(t.length>32)throw new Error(Wy(32));const u=t.length,d=e.length,f=Math.max(0,Math.min(r,d));let g=i,y=f;const v=(N,L)=>{const B=N/u;if(c)return B;const Ie=Math.abs(f-L);return a?B+Ie/a:Ie?1:B},S=o>1||l,p=S?Array(d):[];let h;for(;(h=e.indexOf(t,y))>-1;){const N=v(0,h);if(g=Math.min(N,g),y=h+u,S){let L=0;for(;L<u;)p[h+L]=1,L+=1}}y=-1;let m=[],w=1,C=0,T=u+d;const A=1<<u-1;for(let N=0;N<u;N+=1){let L=0,B=T;for(;L<B;)v(N,f+B)<=g?L=B:T=B,B=Math.floor((T-L)/2+L);T=B;let Ie=Math.max(1,f-B+1);const Ve=s?d:Math.min(f+B,d)+u,Qe=Array(Ve+2);Qe[Ve+1]=(1<<N)-1;for(let Ee=Ve;Ee>=Ie;Ee-=1){const Lt=Ee-1,En=n[e[Lt]];if(Qe[Ee]=(Qe[Ee+1]<<1|1)&En,N&&(Qe[Ee]|=(m[Ee+1]|m[Ee])<<1|1|m[Ee+1]),Qe[Ee]&A&&(w=v(N,Lt),w<=g)){if(g=w,y=Lt,C=N,y<=f)break;Ie=Math.max(1,2*f-y)}}if(v(N+1,f)>g)break;m=Qe}if(S&&y>=0){const N=Math.min(d-1,y+u-1+C);for(let L=y;L<=N;L+=1)n[e[L]]&&(p[L]=1)}const _={isMatch:y>=0,score:Math.max(.001,w)};if(S){const N=ev(p,o);N.length?l&&(_.indices=N):_.isMatch=!1}return _}function nv(e){const t={};for(let n=0,r=e.length;n<r;n+=1){const a=e.charAt(n);t[a]=(t[a]||0)|1<<r-n-1}return t}function No(e){if(e.length<=1)return e;e.sort((n,r)=>n[0]-r[0]||n[1]-r[1]);const t=[e[0]];for(let n=1,r=e.length;n<r;n+=1){const a=t[t.length-1],i=e[n];i[0]<=a[1]+1?a[1]=Math.max(a[1],i[1]):t.push(i)}return t}const Gd={ł:"l",Ł:"L",đ:"d",Đ:"D",ø:"o",Ø:"O",ħ:"h",Ħ:"H",ŧ:"t",Ŧ:"T",ı:"i",ß:"ss"},rv=new RegExp("["+Object.keys(Gd).join("")+"]","g"),fr=typeof String.prototype.normalize=="function"?e=>e.normalize("NFD").replace(/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]/g,"").replace(rv,t=>Gd[t]):e=>e;var Io=class{constructor(e,{location:t=R.location,threshold:n=R.threshold,distance:r=R.distance,includeMatches:a=R.includeMatches,findAllMatches:i=R.findAllMatches,minMatchCharLength:s=R.minMatchCharLength,isCaseSensitive:o=R.isCaseSensitive,ignoreDiacritics:l=R.ignoreDiacritics,ignoreLocation:c=R.ignoreLocation}={}){if(this.options={location:t,threshold:n,distance:r,includeMatches:a,findAllMatches:i,minMatchCharLength:s,isCaseSensitive:o,ignoreDiacritics:l,ignoreLocation:c},e=o?e:e.toLowerCase(),e=l?fr(e):e,this.pattern=e,this.chunks=[],!this.pattern.length)return;const u=(f,g)=>{this.chunks.push({pattern:f,alphabet:nv(f),startIndex:g})},d=this.pattern.length;if(d>32){let f=0;const g=d%32,y=d-g;for(;f<y;)u(this.pattern.substr(f,32),f),f+=32;if(g){const v=d-32;u(this.pattern.substr(v),v)}}else u(this.pattern,0)}searchIn(e){const{isCaseSensitive:t,ignoreDiacritics:n,includeMatches:r}=this.options;if(e=t?e:e.toLowerCase(),e=n?fr(e):e,this.pattern===e){if(e.length<this.options.minMatchCharLength)return{isMatch:!1,score:1};const y={isMatch:!0,score:0};return r&&(y.indices=[[0,e.length-1]]),y}const{location:a,distance:i,threshold:s,findAllMatches:o,minMatchCharLength:l,ignoreLocation:c}=this.options,u=[];let d=0,f=!1;this.chunks.forEach(({pattern:y,alphabet:v,startIndex:S})=>{const{isMatch:p,score:h,indices:m}=tv(e,y,v,{location:a+S,distance:i,threshold:s,findAllMatches:o,minMatchCharLength:l,includeMatches:r,ignoreLocation:c});p&&(f=!0),d+=h,p&&m&&u.push(...m)});const g={isMatch:f,score:f?d/this.chunks.length:1};return f&&r&&(g.indices=No(u)),g}};const av=new Set(["fuzzy","include"]);function iv(e){return e.startsWith("inverse")}const _s=[{type:"exact",multiRegex:/^="(.*)"$/,singleRegex:/^=(.*)$/,create:e=>({type:"exact",search(t){const n=t===e;return{isMatch:n,score:n?0:1,indices:[0,e.length-1]}}})},{type:"include",multiRegex:/^'"(.*)"$/,singleRegex:/^'(.*)$/,create:e=>({type:"include",search(t){let n=0,r;const a=[],i=e.length;for(;(r=t.indexOf(e,n))>-1;)n=r+i,a.push([r,n-1]);const s=!!a.length;return{isMatch:s,score:s?0:1,indices:a}}})},{type:"prefix-exact",multiRegex:/^\^"(.*)"$/,singleRegex:/^\^(.*)$/,create:e=>({type:"prefix-exact",search(t){const n=t.startsWith(e);return{isMatch:n,score:n?0:1,indices:[0,e.length-1]}}})},{type:"inverse-prefix-exact",multiRegex:/^!\^"(.*)"$/,singleRegex:/^!\^(.*)$/,create:e=>({type:"inverse-prefix-exact",search(t){const n=!t.startsWith(e);return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}})},{type:"inverse-suffix-exact",multiRegex:/^!"(.*)"\$$/,singleRegex:/^!(.*)\$$/,create:e=>({type:"inverse-suffix-exact",search(t){const n=!t.endsWith(e);return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}})},{type:"suffix-exact",multiRegex:/^"(.*)"\$$/,singleRegex:/^(.*)\$$/,create:e=>({type:"suffix-exact",search(t){const n=t.endsWith(e);return{isMatch:n,score:n?0:1,indices:[t.length-e.length,t.length-1]}}})},{type:"inverse-exact",multiRegex:/^!"(.*)"$/,singleRegex:/^!(.*)$/,create:e=>({type:"inverse-exact",search(t){const n=t.indexOf(e)===-1;return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}})},{type:"fuzzy",multiRegex:/^"(.*)"$/,singleRegex:/^(.*)$/,create:(e,t={})=>{const n=new Io(e,{location:t.location??R.location,threshold:t.threshold??R.threshold,distance:t.distance??R.distance,includeMatches:t.includeMatches??R.includeMatches,findAllMatches:t.findAllMatches??R.findAllMatches,minMatchCharLength:t.minMatchCharLength??R.minMatchCharLength,isCaseSensitive:t.isCaseSensitive??R.isCaseSensitive,ignoreDiacritics:t.ignoreDiacritics??R.ignoreDiacritics,ignoreLocation:t.ignoreLocation??R.ignoreLocation});return{type:"fuzzy",search(r){return n.searchIn(r)}}}}],ec=_s.length,sv="\0",ov="|";function lv(e){const t=[],n=e.length;let r=0;for(;r<n;){for(;r<n&&e[r]===" ";)r++;if(r>=n)break;let a=r;for(;a<n&&e[a]!==" "&&e[a]!=='"';)a++;if(a<n&&e[a]==='"'){for(a++;a<n;){if(e[a]==='"'){const i=a+1;if(i>=n||e[i]===" "){a++;break}if(e[i]==="$"&&(i+1>=n||e[i+1]===" ")){a+=2;break}}a++}t.push(e.substring(r,a)),r=a}else{for(;a<n&&e[a]!==" ";)a++;t.push(e.substring(r,a)),r=a}}return t}function tc(e,t){const n=e.match(t);return n?n[1]:null}function cv(e,t={}){return e.replace(/\\\|/g,sv).split(ov).map(n=>{const r=lv(n.replace(/\u0000/g,"|").trim()).filter(i=>i&&!!i.trim()),a=[];for(let i=0,s=r.length;i<s;i+=1){const o=r[i];let l=!1,c=-1;for(;!l&&++c<ec;){const u=_s[c],d=tc(o,u.multiRegex);d&&(a.push(u.create(d,t)),l=!0)}if(!l)for(c=-1;++c<ec;){const u=_s[c],d=tc(o,u.singleRegex);if(d){a.push(u.create(d,t));break}}}return a})}var uv=class{constructor(e,{isCaseSensitive:t=R.isCaseSensitive,ignoreDiacritics:n=R.ignoreDiacritics,includeMatches:r=R.includeMatches,minMatchCharLength:a=R.minMatchCharLength,ignoreLocation:i=R.ignoreLocation,findAllMatches:s=R.findAllMatches,location:o=R.location,threshold:l=R.threshold,distance:c=R.distance}={}){this.query=null,this.options={isCaseSensitive:t,ignoreDiacritics:n,includeMatches:r,minMatchCharLength:a,findAllMatches:s,ignoreLocation:i,location:o,threshold:l,distance:c},e=t?e:e.toLowerCase(),e=n?fr(e):e,this.pattern=e,this.query=cv(this.pattern,this.options)}static condition(e,t){return t.useExtendedSearch}searchIn(e){const t=this.query;if(!t)return{isMatch:!1,score:1};const{includeMatches:n,isCaseSensitive:r,ignoreDiacritics:a}=this.options;e=r?e:e.toLowerCase(),e=a?fr(e):e;let i=0;const s=[];let o=0,l=!1;for(let c=0,u=t.length;c<u;c+=1){const d=t[c];s.length=0,i=0,l=!1;for(let f=0,g=d.length;f<g;f+=1){const y=d[f],{isMatch:v,indices:S,score:p}=y.search(e);if(v)i+=1,o+=p,iv(y.type)&&(l=!0),n&&(av.has(y.type)?s.push(...S):s.push(S));else{o=0,i=0,s.length=0,l=!1;break}}if(i){const f={isMatch:!0,score:o/i};return l&&(f.hasInverse=!0),n&&(f.indices=No(s)),f}}return{isMatch:!1,score:1}}};const Ls=[];function Do(...e){Ls.push(...e)}function Da(e,t){for(let n=0,r=Ls.length;n<r;n+=1){const a=Ls[n];if(a.condition(e,t))return new a(e,t)}return new Io(e,t)}const Ma={AND:"$and",OR:"$or"},Rs={PATH:"$path",PATTERN:"$val"},Ns=e=>!!(e[Ma.AND]||e[Ma.OR]),dv=e=>!!e[Rs.PATH],hv=e=>!At(e)&&$d(e)&&!Ns(e),nc=e=>({[Ma.AND]:Object.keys(e).map(t=>({[t]:e[t]}))});function Kd(e,t,{auto:n=!0}={}){const r=a=>{if(le(a)){const l={keyId:null,pattern:a};return n&&(l.searcher=Da(a,t)),l}const i=Object.keys(a),s=dv(a);if(!s&&i.length>1&&!Ns(a))return r(nc(a));if(hv(a)){const l=s?a[Rs.PATH]:i[0],c=s?a[Rs.PATTERN]:a[l];if(!le(c))throw new Error(qy(l));const u={keyId:aa(l),pattern:c};return n&&(u.searcher=Da(c,t)),u}const o={children:[],operator:i[0]};return i.forEach(l=>{const c=a[l];At(c)&&c.forEach(u=>{o.children.push(r(u))})}),o};return Ns(e)||(e=nc(e)),r(e)}function Is(e,{ignoreFieldNorm:t=R.ignoreFieldNorm}){let n=1;return e.forEach(({key:r,norm:a,score:i})=>{const s=r?r.weight:null;n*=Math.pow(i===0&&s?Number.EPSILON:i,(s||1)*(t?1:a))}),n}function fv(e,{ignoreFieldNorm:t=R.ignoreFieldNorm}){e.forEach(n=>{n.score=Is(n.matches,{ignoreFieldNorm:t})})}var pv=class{constructor(e,t){this.limit=e,this.heap=[],this.comparator=t}get size(){return this.heap.length}insert(e){this.size<this.limit?(this.heap.push(e),this._bubbleUp(this.size-1)):this.comparator(e,this.heap[0])<0&&(this.heap[0]=e,this._sinkDown(0))}extractSorted(){return this.heap.sort(this.comparator)}_bubbleUp(e){const t=this.heap;for(;e>0;){const n=e-1>>1;if(this.comparator(t[e],t[n])<=0)break;const r=t[e];t[e]=t[n],t[n]=r,e=n}}_sinkDown(e){const t=this.heap,n=t.length;let r=e;do{e=r;const a=2*e+1,i=2*e+2;if(a<n&&this.comparator(t[a],t[r])>0&&(r=a),i<n&&this.comparator(t[i],t[r])>0&&(r=i),r!==e){const s=t[e];t[e]=t[r],t[r]=s}}while(r!==e)}};function mv(e){const t=[];return e.matches.forEach(n=>{if(!be(n.indices)||!n.indices.length)return;const r={indices:n.indices,value:n.value};n.key&&(r.key=n.key.id),n.idx>-1&&(r.refIndex=n.idx),t.push(r)}),t}function gv(e,t,{includeMatches:n=R.includeMatches,includeScore:r=R.includeScore}={}){return e.map(a=>{const{idx:i}=a,s={item:t[i],refIndex:i};return n&&(s.matches=mv(a)),r&&(s.score=a.score),s})}const yv=/[\p{L}\p{M}\p{N}_]+/gu,rc=new WeakSet;function vv(e){rc.has(e)||(rc.add(e),console.warn(`[Fuse] tokenize regex ${e} lacks the global flag; only the first match per text will be returned. Add the 'g' flag.`))}function wv(e){if(typeof e=="function"){let t=!1;return n=>{const r=e(n);if(!t&&(t=!0,!Array.isArray(r)||r.some(a=>typeof a!="string")))throw new Error(`[Fuse] tokenize function must return string[]; received ${Array.isArray(r)?"array containing non-strings":typeof r}.`);return r}}return e instanceof RegExp?(e.global||vv(e),t=>t.match(e)||[]):t=>t.match(yv)||[]}function Ds({isCaseSensitive:e=!1,ignoreDiacritics:t=!1,tokenize:n}={}){const r=wv(n);return{tokenize(a){return e||(a=a.toLowerCase()),t&&(a=fr(a)),r(a)}}}var bv=class{static condition(e,t){return t.useTokenSearch}constructor(e,t){this.options=t,this.analyzer=Ds({isCaseSensitive:t.isCaseSensitive,ignoreDiacritics:t.ignoreDiacritics,tokenize:t.tokenize});const n=this.analyzer.tokenize(e),{df:r,fieldCount:a}=t._invertedIndex;this.termSearchers=[],this.idfWeights=[];for(const i of n){this.termSearchers.push(new Io(i,{location:t.location,threshold:t.threshold,distance:t.distance,includeMatches:t.includeMatches,findAllMatches:t.findAllMatches,minMatchCharLength:t.minMatchCharLength,isCaseSensitive:t.isCaseSensitive,ignoreDiacritics:t.ignoreDiacritics,ignoreLocation:!0}));const s=r.get(i)||0,o=Math.log(1+(a-s+.5)/(s+.5));this.idfWeights.push(o)}this.combineAll=t.tokenMatch==="all",this.numTerms=this.termSearchers.length,this.useMask=this.numTerms<=31}searchIn(e){if(!this.termSearchers.length)return{isMatch:!1,score:1};const t=[];let n=0,r=0,a=0,i=0;const s=this.combineAll&&!this.useMask?new Set:null;for(let c=0;c<this.termSearchers.length;c++){const u=this.termSearchers[c].searchIn(e),d=this.idfWeights[c];r+=d,u.isMatch&&(a++,n+=d*(1-u.score),u.indices&&t.push(...u.indices),this.combineAll&&(this.useMask?i|=1<<c:s.add(c)))}if(a===0)return{isMatch:!1,score:1};const o=r>0?1-n/r:0,l={isMatch:!0,score:Math.max(.001,o)};return this.options.includeMatches&&t.length&&(l.indices=No(t)),this.combineAll&&(this.useMask?l.matchedMask=i:l.matchedTerms=s,l.termCount=this.numTerms),l}};function Li(e,t,n,r){const a=r.tokenize(t);if(!a.length)return;e.fieldCount++,e.docFieldCount.set(n,(e.docFieldCount.get(n)||0)+1);const i=new Set(a);let s=e.docTermFieldHits.get(n);s||(s=new Map,e.docTermFieldHits.set(n,s));for(const o of i)s.set(o,(s.get(o)||0)+1),e.df.set(o,(e.df.get(o)||0)+1)}function Xd(e,t,n,r){const{i:a,v:i,$:s}=t;if(i!==void 0){Li(e,i,a,r);return}if(s)for(let o=0;o<n;o++){const l=s[o];if(l)if(Array.isArray(l))for(const c of l)Li(e,c.v,a,r);else Li(e,l.v,a,r)}}function kv(e,t,n){const r={fieldCount:0,df:new Map,docFieldCount:new Map,docTermFieldHits:new Map};for(const a of e)Xd(r,a,t,n);return r}function xv(e,t,n,r){Xd(e,t,n,r)}function Sv(e,t){const n=e.docFieldCount.get(t);if(n===void 0)return;e.fieldCount-=n,e.docFieldCount.delete(t);const r=e.docTermFieldHits.get(t);if(r){for(const[a,i]of r){const s=(e.df.get(a)||0)-i;s<=0?e.df.delete(a):e.df.set(a,s)}e.docTermFieldHits.delete(t)}}function ac(e,t){if(t.length===0)return;const n=Array.from(new Set(t)).sort((o,l)=>o-l);for(const o of n)Sv(e,o);const r=o=>{let l=0,c=n.length;for(;l<c;){const u=l+c>>>1;n[u]<o?l=u+1:c=u}return o-l},a=n[0],i=new Map;for(const[o,l]of e.docFieldCount)i.set(o>a?r(o):o,l);e.docFieldCount=i;const s=new Map;for(const[o,l]of e.docTermFieldHits)s.set(o>a?r(o):o,l);e.docTermFieldHits=s}var _t=class{constructor(e,t,n){this.options={...R,...t},this.options.useExtendedSearch,this.options.useTokenSearch,this._keyStore=new Hy(this.options.keys),this._docs=e,this._myIndex=null,this._invertedIndex=null,this.setCollection(e,n),this._lastQuery=null,this._lastSearcher=null}_getSearcher(e){if(this._lastQuery===e)return this._lastSearcher;const t=Da(e,this._invertedIndex?{...this.options,_invertedIndex:this._invertedIndex}:this.options);return this._lastQuery=e,this._lastSearcher=t,t}setCollection(e,t){if(this._docs=e,t&&!(t instanceof Ro))throw new Error(zy);if(this._myIndex=t||Qd(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight}),this.options.useTokenSearch){const n=Ds({isCaseSensitive:this.options.isCaseSensitive,ignoreDiacritics:this.options.ignoreDiacritics,tokenize:this.options.tokenize});this._invertedIndex=kv(this._myIndex.records,this._myIndex.keys.length,n)}this._invalidateSearcherCache()}add(e){if(!be(e))return;this._docs.push(e);const t=this._myIndex.add(e,this._docs.length-1);if(this._invertedIndex&&t){const n=Ds({isCaseSensitive:this.options.isCaseSensitive,ignoreDiacritics:this.options.ignoreDiacritics,tokenize:this.options.tokenize});xv(this._invertedIndex,t,this._myIndex.keys.length,n)}this._invalidateSearcherCache()}remove(e=()=>!1){const t=[],n=[];for(let r=0,a=this._docs.length;r<a;r+=1)e(this._docs[r],r)&&(t.push(this._docs[r]),n.push(r));if(n.length){this._invertedIndex&&ac(this._invertedIndex,n);const r=new Set(n);this._docs=this._docs.filter((a,i)=>!r.has(i)),this._myIndex.removeAll(n),this._invalidateSearcherCache()}return t}removeAt(e){if(!Number.isInteger(e)||e<0||e>=this._docs.length)throw new Error(As);this._invertedIndex&&ac(this._invertedIndex,[e]);const t=this._docs.splice(e,1)[0];return this._myIndex.removeAt(e),this._invalidateSearcherCache(),t}_invalidateSearcherCache(){this._lastQuery=null,this._lastSearcher=null}getIndex(){return this._myIndex}_normalizedKeys(){return this._myIndex.keys.map(e=>this._keyStore.get(e.id)||e)}search(e,t){const{limit:n=-1}=t||{},{includeMatches:r,includeScore:a,shouldSort:i,sortFn:s,ignoreFieldNorm:o}=this.options;if(le(e)&&!e.trim()){let f=this._docs.map((g,y)=>({item:g,refIndex:y}));return ra(n)&&n>-1&&(f=f.slice(0,n)),f}const l=i&&ra(n)&&n>0&&le(e),c=s,u=(f,g)=>c(f,g)||f.idx-g.idx;let d;if(l){const f=new pv(n,u);le(this._docs[0])?this._searchStringList(e,{heap:f,ignoreFieldNorm:o}):this._searchObjectList(e,{heap:f,ignoreFieldNorm:o}),d=f.extractSorted()}else d=le(e)?le(this._docs[0])?this._searchStringList(e):this._searchObjectList(e):this._searchLogical(e),fv(d,{ignoreFieldNorm:o}),i&&d.sort(le(e)?u:c),ra(n)&&n>-1&&(d=d.slice(0,n));return gv(d,this._docs,{includeMatches:r,includeScore:a})}_searchStringList(e,{heap:t,ignoreFieldNorm:n}={}){const r=this._getSearcher(e),a=this.options.useTokenSearch&&this.options.tokenMatch==="all",{records:i}=this._myIndex,s=t?null:[];return i.forEach(({v:o,i:l,n:c})=>{if(!be(o))return;const u=r.searchIn(o);if(u.isMatch){const d={score:u.score,value:o,norm:c,indices:u.indices};a&&(d.matchedMask=u.matchedMask,d.matchedTerms=u.matchedTerms,d.termCount=u.termCount);const f=[d];if(!a||this._coversAllTokens(f)){const g={item:o,idx:l,matches:f};t?(g.score=Is(g.matches,{ignoreFieldNorm:n}),t.insert(g)):s.push(g)}}}),s}_searchLogical(e){const t=Kd(e,this.options),n=this._normalizedKeys(),r=(o,l,c)=>{if(!("children"in o)){const{keyId:g,searcher:y}=o;let v;return g===null?(v=[],n.forEach((S,p)=>{v.push(...this._findMatches({key:S,value:l[p],searcher:y}))})):v=this._findMatches({key:this._keyStore.get(g),value:this._myIndex.getValueForItemAtKeyId(l,g),searcher:y}),v&&v.length?[{idx:c,item:l,matches:v}]:[]}const{children:u,operator:d}=o,f=[];for(let g=0,y=u.length;g<y;g+=1){const v=u[g],S=r(v,l,c);if(S.length)f.push(...S);else if(d===Ma.AND)return[]}return f},a=this._myIndex.records,i=new Map,s=[];return a.forEach(({$:o,i:l})=>{if(be(o)){const c=r(t,o,l);c.length&&(i.has(l)||(i.set(l,{idx:l,item:o,matches:[]}),s.push(i.get(l))),c.forEach(({matches:u})=>{i.get(l).matches.push(...u)}))}}),s}_searchObjectList(e,{heap:t,ignoreFieldNorm:n}={}){const r=this._getSearcher(e),a=this.options.useTokenSearch&&this.options.tokenMatch==="all",{records:i}=this._myIndex,s=this._normalizedKeys(),o=t?null:[];return i.forEach(({$:l,i:c})=>{if(!be(l))return;const u=[];let d=!1,f=!1;if(s.forEach((g,y)=>{const v=this._findMatches({key:g,value:l[y],searcher:r});v.length?(u.push(...v),v[0].hasInverse&&(f=!0)):d=!0}),!(f&&d)&&u.length&&(!a||this._coversAllTokens(u))){const g={idx:c,item:l,matches:u};t?(g.score=Is(g.matches,{ignoreFieldNorm:n}),t.insert(g)):o.push(g)}}),o}_findMatches({key:e,value:t,searcher:n}){if(!be(t))return[];const r=[];if(At(t))t.forEach(({v:a,i,n:s})=>{if(!be(a))return;const o=n.searchIn(a);if(o.isMatch){const l={score:o.score,key:e,value:a,idx:i,norm:s,indices:o.indices,hasInverse:o.hasInverse};o.termCount!==void 0&&(l.matchedMask=o.matchedMask,l.matchedTerms=o.matchedTerms,l.termCount=o.termCount),r.push(l)}});else{const{v:a,n:i}=t,s=n.searchIn(a);if(s.isMatch){const o={score:s.score,key:e,value:a,norm:i,indices:s.indices,hasInverse:s.hasInverse};s.termCount!==void 0&&(o.matchedMask=s.matchedMask,o.matchedTerms=s.matchedTerms,o.termCount=s.termCount),r.push(o)}}return r}_coversAllTokens(e){const t=e.length?e[0].termCount:void 0;if(t===void 0)return!0;if(t<=31){let r=0;for(let a=0;a<e.length;a++)r|=e[a].matchedMask||0;return r===2**t-1}const n=new Set;for(let r=0;r<e.length;r++){const a=e[r].matchedTerms;if(a)for(const i of a)n.add(i)}return n.size===t}};_t.version="7.5.0";_t.createIndex=Qd;_t.parseIndex=Zy;_t.config=R;_t.match=function(e,t,n){if(n&&n.useTokenSearch)throw new Error($y);return Da(e,{...R,...n}).searchIn(t)};_t.parseQuery=Kd;Do(uv);Do(bv);_t.use=function(...e){e.forEach(t=>Do(t))};var Cv=_t;const Tv={keys:[{name:"title",weight:2},{name:"tags",weight:1.5},{name:"body",weight:1}],threshold:.35,ignoreLocation:!0};function Ev(e,t){return t.trim()?new Cv(e,Tv).search(t).map(r=>r.item):e}const Pv={nugget:"Nugget",guide:"Guide"},Av=k.forwardRef(function(t,n){const[r,a]=k.useState(""),[i,s]=k.useState(!1),o=Od(),l=k.useMemo(()=>r.trim()?Ev(ti,r).slice(0,8):[],[r]),c=u=>{o(xr(u)),a(""),s(!1)};return b.jsxs("div",{className:"relative w-full max-w-sm",children:[b.jsx("input",{ref:n,type:"search",value:r,onChange:u=>{a(u.target.value),s(!0)},onFocus:()=>s(!0),onBlur:()=>setTimeout(()=>s(!1),100),onKeyDown:u=>{u.key==="Enter"&&l[0]&&c(l[0]),u.key==="Escape"&&(a(""),s(!1),u.currentTarget.blur())},placeholder:"Search nuggets… (Ctrl+K)","aria-label":"Search nuggets",className:"w-full rounded-md border border-border bg-bg-secondary px-3 py-1.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"}),i&&r.trim()&&b.jsx("div",{className:"absolute left-0 right-0 top-full z-40 mt-1 max-h-80 overflow-y-auto rounded-md border border-border bg-bg-primary shadow-lg",children:l.length===0?b.jsx("p",{className:"px-3 py-2 text-sm text-text-tertiary",children:"No matches."}):l.map(u=>b.jsxs("button",{type:"button",onMouseDown:()=>c(u),className:"block w-full px-3 py-2 text-left text-sm hover:bg-bg-tertiary",children:[b.jsxs("span",{className:"flex items-center gap-2",children:[b.jsx("span",{className:"font-medium text-text-primary",children:u.title}),b.jsx("span",{className:"rounded-full bg-accent/10 px-1.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-accent",children:Pv[u.format]})]}),u.tags.length>0&&b.jsx("span",{className:"text-xs text-text-tertiary",children:u.tags.join(", ")})]},u.id))})]})});function _v(){const{theme:e,toggleTheme:t}=jm();return b.jsx("button",{type:"button",onClick:t,"aria-label":`Switch to ${e==="dark"?"light":"dark"} mode`,className:"flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary",children:e==="dark"?b.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"h-4 w-4",children:[b.jsx("circle",{cx:"12",cy:"12",r:"4"}),b.jsx("path",{d:"M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"})]}):b.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"h-4 w-4",children:b.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"})})})}function Lv({searchRef:e,onToggleSidebar:t}){return b.jsx("header",{className:"sticky top-0 z-30 border-b border-border bg-bg-primary/95 backdrop-blur",children:b.jsxs("div",{className:"mx-auto flex max-w-6xl items-center gap-3 px-4 py-3",children:[b.jsx("button",{type:"button",onClick:t,"aria-label":"Toggle nugget list",className:"flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-text-secondary hover:bg-bg-tertiary md:hidden",children:b.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"h-5 w-5",children:b.jsx("path",{d:"M4 6h16M4 12h16M4 18h16"})})}),b.jsxs(kr,{to:"/",className:"flex shrink-0 items-center gap-2 text-sm font-semibold text-text-primary",children:[b.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",className:"h-5 w-5","aria-hidden":!0,children:b.jsx("path",{d:"M16 3 L27 10 L24 27 L8 27 L5 10 Z",fill:"var(--color-accent)",stroke:"var(--color-accent-hover)",strokeWidth:"1.5",strokeLinejoin:"round"})}),"Dev Nuggets"]}),b.jsx("div",{className:"flex-1",children:b.jsx(Av,{ref:e})}),b.jsx(_v,{})]})})}function Yd(e,t){return e.title.localeCompare(t.title)}const ic=[...Ia].sort(Yd),sc=[...Na].sort(Yd),Rv=({isActive:e})=>`truncate rounded-md py-1.5 pl-6 pr-3 text-sm transition-colors ${e?"bg-accent/10 font-medium text-accent":"text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"}`;function oc({title:e,items:t,showHeading:n,onNavigate:r}){const[a,i]=k.useState(!0),s=!n||a;return b.jsxs("div",{className:"flex flex-col gap-0.5",children:[n&&b.jsx("h2",{className:"px-3 pb-1",children:b.jsxs("button",{type:"button",onClick:()=>i(o=>!o),"aria-expanded":a,className:"flex w-full items-center gap-1 text-xs font-semibold uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-secondary",children:[b.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:`h-3 w-3 shrink-0 transition-transform ${a?"rotate-90":""}`,"aria-hidden":!0,children:b.jsx("path",{d:"M9 6l6 6-6 6"})}),e]})}),s&&t.map(o=>b.jsx(Lm,{to:xr(o),onClick:r,className:Rv,children:o.title},o.id))]})}function lc({onNavigate:e}){const n=[ic,sc].filter(r=>r.length>0).length>1;return b.jsxs("nav",{"aria-label":"All nuggets",className:"flex flex-col gap-4",children:[b.jsx(oc,{title:"Guides",items:ic,showHeading:n,onNavigate:e}),b.jsx(oc,{title:"Nuggets",items:sc,showHeading:n,onNavigate:e})]})}const cc="dev-nuggets:last-viewed-id",uc=e=>`dev-nuggets:scroll:${e}`,ia={getLastViewedId(){return on.get(cc,void 0)},setLastViewedId(e){on.set(cc,e)},getScrollY(e){return on.get(uc(e),0)},setScrollY(e,t){on.set(uc(e),t)}};function Nv(e){k.useEffect(()=>{if(!e)return;ia.setLastViewedId(e),window.scrollTo({top:ia.getScrollY(e)});let t=null;const n=()=>{t===null&&(t=requestAnimationFrame(()=>{ia.setScrollY(e,window.scrollY),t=null}))};return window.addEventListener("scroll",n,{passive:!0}),()=>{window.removeEventListener("scroll",n),t!==null&&cancelAnimationFrame(t)}},[e])}function Iv(e){const t=ia.getLastViewedId();return t?e.find(n=>n.id===t):void 0}function Dv(e,t=160){const n=e.replace(/```[\s\S]*?```/g," ").replace(/`([^`]+)`/g,"$1").replace(/!\[[^\]]*\]\([^)]*\)/g,"").replace(/\[([^\]]+)\]\([^)]*\)/g,"$1").replace(/^#+\s*/gm,"").replace(/[*_>~-]/g,"").replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t).trimEnd()}…`:n}function Mv({item:e}){return b.jsxs(kr,{to:xr(e),className:"block rounded-lg border border-border bg-bg-primary p-4 transition-colors hover:border-accent",children:[b.jsx("h3",{className:"text-base font-semibold text-text-primary",children:e.title}),e.body.trim()&&b.jsx("p",{className:"mt-1 line-clamp-2 text-sm text-text-secondary",children:Dv(e.body)}),b.jsx("div",{className:"mt-2 flex flex-wrap items-center gap-2 text-xs text-text-tertiary",children:e.tags.map(t=>b.jsx("span",{className:"rounded-full bg-bg-tertiary px-2 py-0.5",children:t},t))})]})}const Ur=10;function dc({items:e,label:t}){const[n,r]=k.useState(null),[a,i]=k.useState(Ur),s=k.useMemo(()=>{const d=new Set;return e.forEach(f=>f.tags.forEach(g=>d.add(g))),Array.from(d).sort()},[e]),o=k.useMemo(()=>[...n?e.filter(f=>f.tags.includes(n)):e].sort((f,g)=>f.title.localeCompare(g.title)),[e,n]),l=o.slice(0,a),c=o.length-l.length,u=d=>{r(d),i(Ur)};return b.jsxs("section",{role:"tabpanel","aria-label":t,className:"flex flex-col gap-6",children:[s.length>0&&b.jsxs("div",{className:"flex flex-wrap gap-2",children:[b.jsx("button",{type:"button",onClick:()=>u(null),className:hc(n===null),children:"All"}),s.map(d=>b.jsx("button",{type:"button",onClick:()=>u(d),className:hc(n===d),children:d},d))]}),e.length===0?b.jsx("p",{className:"text-sm text-text-tertiary",children:"Nothing here yet."}):b.jsx("ul",{className:"flex flex-col gap-3",children:l.map(d=>b.jsx("li",{children:b.jsx(Mv,{item:d})},d.id))}),c>0&&b.jsxs("button",{type:"button",onClick:()=>i(d=>d+Ur),className:"self-center rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-tertiary",children:["Load ",Math.min(Ur,c)," more"]})]})}function hc(e){const t="rounded-full border px-3 py-1 text-xs font-medium transition-colors";return e?`${t} border-accent bg-accent/10 text-accent`:`${t} border-border text-text-secondary hover:bg-bg-tertiary`}const jv=[{id:"guides",label:"Guides"},{id:"nuggets",label:"Nuggets"}];function Ov(){const e=Iv(ti),[t,n]=k.useState("guides");return Na.length===0&&Ia.length===0?b.jsxs("div",{className:"rounded-lg border border-dashed border-border p-10 text-center",children:[b.jsx("h1",{className:"text-lg font-semibold text-text-primary",children:"Nothing published yet"}),b.jsx("p",{className:"mt-2 text-sm text-text-secondary",children:"Check back soon — new nuggets are on the way."})]}):b.jsxs("div",{className:"flex flex-col gap-6",children:[e&&b.jsxs(kr,{to:xr(e),className:"flex items-center justify-between rounded-lg border border-border bg-bg-secondary px-4 py-3 text-sm transition-colors hover:border-accent",children:[b.jsxs("span",{className:"text-text-secondary",children:["Continue reading"," ",b.jsx("span",{className:"font-medium text-text-primary",children:e.title})]}),b.jsx("span",{"aria-hidden":!0,className:"text-accent",children:"→"})]}),b.jsx("div",{role:"tablist","aria-label":"Content type",className:"flex gap-4 border-b border-border",children:jv.map(r=>b.jsx("button",{type:"button",role:"tab","aria-selected":t===r.id,onClick:()=>n(r.id),className:Bv(t===r.id),children:r.label},r.id))}),t==="nuggets"?b.jsx(dc,{items:Na,label:"Nuggets"},"nuggets"):b.jsx(dc,{items:Ia,label:"Guides"},"guides")]})}function Bv(e){const t="-mb-px border-b-2 px-1 py-2 text-sm font-medium transition-colors";return e?`${t} border-accent text-accent`:`${t} border-transparent text-text-secondary hover:text-text-primary`}const zv="modulepreload",qv=function(e){return"/develop-nuggets/"+e},fc={},Wv=function(t,n,r){let a=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),o=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));a=Promise.allSettled(n.map(l=>{if(l=qv(l),l in fc)return;fc[l]=!0;const c=l.endsWith(".css"),u=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${u}`))return;const d=document.createElement("link");if(d.rel=c?"stylesheet":zv,c||(d.as="script"),d.crossOrigin="",d.href=l,o&&d.setAttribute("nonce",o),document.head.appendChild(d),c)return new Promise((f,g)=>{d.addEventListener("load",f),d.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${l}`)))})}))}function i(s){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=s,window.dispatchEvent(o),!o.defaultPrevented)throw s}return a.then(s=>{for(const o of s||[])o.status==="rejected"&&i(o.reason);return t().catch(i)})},Fv=k.lazy(()=>Wv(()=>import("./MarkdownRenderer-C2kZlhFq.js").then(e=>e.bp),[]).then(e=>({default:e.MarkdownRenderer})));function Uv({content:e}){return b.jsx(k.Suspense,{fallback:b.jsx("p",{className:"text-sm text-text-tertiary",children:"Rendering…"}),children:b.jsx(Fv,{content:e})})}const $v=3;function Hv(e,t,n=$v){const r=new Set(e.tags);return t.filter(a=>a.id!==e.id).map(a=>({candidate:a,sharedTags:a.tags.filter(i=>r.has(i)).length})).filter(({sharedTags:a})=>a>0).sort((a,i)=>i.sharedTags!==a.sharedTags?i.sharedTags-a.sharedTags:a.candidate.title.localeCompare(i.candidate.title)).slice(0,n).map(({candidate:a})=>a)}function pc(){const{id:e}=rm(),t=e?My(e):void 0;if(Nv(t==null?void 0:t.id),!t)return b.jsx("div",{className:"rounded-lg border border-dashed border-border p-10 text-center",children:b.jsx("p",{className:"text-sm text-text-secondary",children:"Content not found."})});const n=Hv(t,ti);return b.jsxs("article",{className:"flex flex-col gap-6",children:[b.jsxs("header",{className:"flex flex-col gap-3",children:[b.jsx("h1",{className:"text-2xl font-bold text-text-primary",children:t.title}),t.tags.length>0&&b.jsx("div",{className:"flex flex-wrap gap-2",children:t.tags.map(r=>b.jsx("span",{className:"rounded-full bg-bg-tertiary px-2 py-0.5 text-xs text-text-tertiary",children:r},r))})]}),b.jsx(Uv,{content:t.body}),n.length>0&&b.jsxs("footer",{className:"flex flex-col gap-3 border-t border-border pt-6",children:[b.jsx("h2",{className:"text-sm font-semibold text-text-primary",children:"Related"}),b.jsx("ul",{className:"flex flex-col gap-2",children:n.map(r=>b.jsx("li",{children:b.jsxs(kr,{to:xr(r),className:"flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-accent",children:[b.jsx("span",{className:"font-medium text-text-primary",children:r.title}),b.jsx("span",{className:"text-xs text-text-tertiary",children:r.tags.join(", ")})]})},r.id))})]})]})}function Vv({onSearch:e}){k.useEffect(()=>{const t=n=>{(n.metaKey||n.ctrlKey)&&n.key.toLowerCase()==="k"&&(n.preventDefault(),e())};return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)},[e])}function Qv(){const e=k.useRef(null),[t,n]=k.useState(!1);return Vv({onSearch:()=>{var r;return(r=e.current)==null?void 0:r.focus()}}),k.useEffect(()=>{if(!t)return;const r=a=>{a.key==="Escape"&&n(!1)};return window.addEventListener("keydown",r),()=>window.removeEventListener("keydown",r)},[t]),b.jsxs("div",{className:"min-h-screen bg-bg-primary",children:[b.jsx(Lv,{searchRef:e,onToggleSidebar:()=>n(r=>!r)}),b.jsxs("div",{className:"mx-auto flex max-w-6xl gap-8 px-4 py-8",children:[b.jsx("aside",{className:"hidden shrink-0 self-start md:sticky md:top-16 md:block md:max-h-[calc(100vh-4rem)] md:w-56 md:overflow-y-auto",children:b.jsx(lc,{})}),b.jsx("main",{className:"min-w-0 flex-1",children:b.jsx("div",{className:"mx-auto max-w-3xl",children:b.jsxs(wm,{children:[b.jsx(na,{path:"/",element:b.jsx(Ov,{})}),b.jsx(na,{path:"/nuggets/:id",element:b.jsx(pc,{})}),b.jsx(na,{path:"/guides/:id",element:b.jsx(pc,{})})]})})})]}),t&&b.jsxs("div",{role:"dialog","aria-modal":"true","aria-label":"All nuggets",className:"fixed inset-0 z-40 md:hidden",children:[b.jsx("div",{className:"absolute inset-0 bg-black/40",onClick:()=>n(!1)}),b.jsx("div",{className:"absolute inset-y-0 left-0 w-64 overflow-y-auto bg-bg-primary p-4 shadow-xl",children:b.jsx(lc,{onNavigate:()=>n(!1)})})]})]})}function Gv(){return b.jsx(Mm,{children:b.jsx(Qv,{})})}Pd(document.getElementById("root")).render(b.jsx(k.StrictMode,{children:b.jsx(Pm,{basename:"/develop-nuggets/",children:b.jsx(Gv,{})})}));export{kr as L,Wv as _,Kv as c,Zd as g,b as j,k as r,jm as u};
