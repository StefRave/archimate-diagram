var qr=Object.defineProperty;var Hr=(s,e,t)=>e in s?qr(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var N=(s,e,t)=>(Hr(s,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerpolicy&&(r.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?r.credentials="include":i.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();var Te,ct,Ir,ge,Qn,ze={},Ar=[],Zr=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function Bt(s,e){for(var t in e)s[t]=e[t];return s}function Cr(s){var e=s.parentNode;e&&e.removeChild(s)}function $r(s,e,t){var n,i,r,o={};for(r in e)r=="key"?n=e[r]:r=="ref"?i=e[r]:o[r]=e[r];if(arguments.length>2&&(o.children=arguments.length>3?Te.call(arguments,2):t),typeof s=="function"&&s.defaultProps!=null)for(r in s.defaultProps)o[r]===void 0&&(o[r]=s.defaultProps[r]);return Ee(s,o,n,i,null)}function Ee(s,e,t,n,i){var r={type:s,props:e,key:t,ref:n,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:i==null?++Ir:i};return i==null&&ct.vnode!=null&&ct.vnode(r),r}function Vr(){return{current:null}}function Re(s){return s.children}function Tt(s,e){this.props=s,this.context=e}function ve(s,e){if(e==null)return s.__?ve(s.__,s.__.__k.indexOf(s)+1):null;for(var t;e<s.__k.length;e++)if((t=s.__k[e])!=null&&t.__e!=null)return t.__e;return typeof s.type=="function"?ve(s):null}function Or(s){var e,t;if((s=s.__)!=null&&s.__c!=null){for(s.__e=s.__c.base=null,e=0;e<s.__k.length;e++)if((t=s.__k[e])!=null&&t.__e!=null){s.__e=s.__c.base=t.__e;break}return Or(s)}}function tr(s){(!s.__d&&(s.__d=!0)&&ge.push(s)&&!De.__r++||Qn!==ct.debounceRendering)&&((Qn=ct.debounceRendering)||setTimeout)(De)}function De(){for(var s;De.__r=ge.length;)s=ge.sort(function(e,t){return e.__v.__b-t.__v.__b}),ge=[],s.some(function(e){var t,n,i,r,o,a;e.__d&&(o=(r=(t=e).__v).__e,(a=t.__P)&&(n=[],(i=Bt({},r)).__v=r.__v+1,qn(a,r,i,t.__n,a.ownerSVGElement!==void 0,r.__h!=null?[o]:null,n,o==null?ve(r):o,r.__h),Pr(n,r),r.__e!=o&&Or(r)))})}function Mr(s,e,t,n,i,r,o,a,c,m){var u,w,y,h,g,f,v,p=n&&n.__k||Ar,_=p.length;for(t.__k=[],u=0;u<e.length;u++)if((h=t.__k[u]=(h=e[u])==null||typeof h=="boolean"?null:typeof h=="string"||typeof h=="number"||typeof h=="bigint"?Ee(null,h,null,null,h):Array.isArray(h)?Ee(Re,{children:h},null,null,null):h.__b>0?Ee(h.type,h.props,h.key,h.ref?h.ref:null,h.__v):h)!=null){if(h.__=t,h.__b=t.__b+1,(y=p[u])===null||y&&h.key==y.key&&h.type===y.type)p[u]=void 0;else for(w=0;w<_;w++){if((y=p[w])&&h.key==y.key&&h.type===y.type){p[w]=void 0;break}y=null}qn(s,h,y=y||ze,i,r,o,a,c,m),g=h.__e,(w=h.ref)&&y.ref!=w&&(v||(v=[]),y.ref&&v.push(y.ref,null,h),v.push(w,h.__c||g,h)),g!=null?(f==null&&(f=g),typeof h.type=="function"&&h.__k===y.__k?h.__d=c=zr(h,c,s):c=Dr(s,h,y,p,g,c),typeof t.type=="function"&&(t.__d=c)):c&&y.__e==c&&c.parentNode!=s&&(c=ve(y))}for(t.__e=f,u=_;u--;)p[u]!=null&&Tr(p[u],p[u]);if(v)for(u=0;u<v.length;u++)Br(v[u],v[++u],v[++u])}function zr(s,e,t){for(var n,i=s.__k,r=0;i&&r<i.length;r++)(n=i[r])&&(n.__=s,e=typeof n.type=="function"?zr(n,e,t):Dr(t,n,n,i,n.__e,e));return e}function Dr(s,e,t,n,i,r){var o,a,c;if(e.__d!==void 0)o=e.__d,e.__d=void 0;else if(t==null||i!=r||i.parentNode==null)t:if(r==null||r.parentNode!==s)s.appendChild(i),o=null;else{for(a=r,c=0;(a=a.nextSibling)&&c<n.length;c+=2)if(a==i)break t;s.insertBefore(i,r),o=r}return o!==void 0?o:i.nextSibling}function Yr(s,e,t,n,i){var r;for(r in t)r==="children"||r==="key"||r in e||Pe(s,r,null,t[r],n);for(r in e)i&&typeof e[r]!="function"||r==="children"||r==="key"||r==="value"||r==="checked"||t[r]===e[r]||Pe(s,r,e[r],t[r],n)}function er(s,e,t){e[0]==="-"?s.setProperty(e,t):s[e]=t==null?"":typeof t!="number"||Zr.test(e)?t:t+"px"}function Pe(s,e,t,n,i){var r;t:if(e==="style")if(typeof t=="string")s.style.cssText=t;else{if(typeof n=="string"&&(s.style.cssText=n=""),n)for(e in n)t&&e in t||er(s.style,e,"");if(t)for(e in t)n&&t[e]===n[e]||er(s.style,e,t[e])}else if(e[0]==="o"&&e[1]==="n")r=e!==(e=e.replace(/Capture$/,"")),e=e.toLowerCase()in s?e.toLowerCase().slice(2):e.slice(2),s.l||(s.l={}),s.l[e+r]=t,t?n||s.addEventListener(e,r?rr:nr,r):s.removeEventListener(e,r?rr:nr,r);else if(e!=="dangerouslySetInnerHTML"){if(i)e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(e!=="href"&&e!=="list"&&e!=="form"&&e!=="tabIndex"&&e!=="download"&&e in s)try{s[e]=t==null?"":t;break t}catch{}typeof t=="function"||(t==null||t===!1&&e.indexOf("-")==-1?s.removeAttribute(e):s.setAttribute(e,t))}}function nr(s){this.l[s.type+!1](ct.event?ct.event(s):s)}function rr(s){this.l[s.type+!0](ct.event?ct.event(s):s)}function qn(s,e,t,n,i,r,o,a,c){var m,u,w,y,h,g,f,v,p,_,S,A,I,B=e.type;if(e.constructor!==void 0)return null;t.__h!=null&&(c=t.__h,a=e.__e=t.__e,e.__h=null,r=[a]),(m=ct.__b)&&m(e);try{t:if(typeof B=="function"){for(v=e.props,p=(m=B.contextType)&&n[m.__c],_=m?p?p.props.value:m.__:n,t.__c?f=(u=e.__c=t.__c).__=u.__E:("prototype"in B&&B.prototype.render?e.__c=u=new B(v,_):(e.__c=u=new Tt(v,_),u.constructor=B,u.render=Kr),p&&p.sub(u),u.props=v,u.state||(u.state={}),u.context=_,u.__n=n,w=u.__d=!0,u.__h=[],u._sb=[]),u.__s==null&&(u.__s=u.state),B.getDerivedStateFromProps!=null&&(u.__s==u.state&&(u.__s=Bt({},u.__s)),Bt(u.__s,B.getDerivedStateFromProps(v,u.__s))),y=u.props,h=u.state,m=0;m<u._sb.length;m++)u.__h.push(u._sb[m]),u._sb=[];if(w)B.getDerivedStateFromProps==null&&u.componentWillMount!=null&&u.componentWillMount(),u.componentDidMount!=null&&u.__h.push(u.componentDidMount);else{if(B.getDerivedStateFromProps==null&&v!==y&&u.componentWillReceiveProps!=null&&u.componentWillReceiveProps(v,_),!u.__e&&u.shouldComponentUpdate!=null&&u.shouldComponentUpdate(v,u.__s,_)===!1||e.__v===t.__v){u.props=v,u.state=u.__s,e.__v!==t.__v&&(u.__d=!1),u.__v=e,e.__e=t.__e,e.__k=t.__k,e.__k.forEach(function(D){D&&(D.__=e)}),u.__h.length&&o.push(u);break t}u.componentWillUpdate!=null&&u.componentWillUpdate(v,u.__s,_),u.componentDidUpdate!=null&&u.__h.push(function(){u.componentDidUpdate(y,h,g)})}if(u.context=_,u.props=v,u.__v=e,u.__P=s,S=ct.__r,A=0,"prototype"in B&&B.prototype.render)u.state=u.__s,u.__d=!1,S&&S(e),m=u.render(u.props,u.state,u.context);else do u.__d=!1,S&&S(e),m=u.render(u.props,u.state,u.context),u.state=u.__s;while(u.__d&&++A<25);u.state=u.__s,u.getChildContext!=null&&(n=Bt(Bt({},n),u.getChildContext())),w||u.getSnapshotBeforeUpdate==null||(g=u.getSnapshotBeforeUpdate(y,h)),I=m!=null&&m.type===Re&&m.key==null?m.props.children:m,Mr(s,Array.isArray(I)?I:[I],e,t,n,i,r,o,a,c),u.base=e.__e,e.__h=null,u.__h.length&&o.push(u),f&&(u.__E=u.__=null),u.__e=!1}else r==null&&e.__v===t.__v?(e.__k=t.__k,e.__e=t.__e):e.__e=Xr(t.__e,e,t,n,i,r,o,c);(m=ct.diffed)&&m(e)}catch(D){e.__v=null,(c||r!=null)&&(e.__e=a,e.__h=!!c,r[r.indexOf(a)]=null),ct.__e(D,e,t)}}function Pr(s,e){ct.__c&&ct.__c(e,s),s.some(function(t){try{s=t.__h,t.__h=[],s.some(function(n){n.call(t)})}catch(n){ct.__e(n,t.__v)}})}function Xr(s,e,t,n,i,r,o,a){var c,m,u,w=t.props,y=e.props,h=e.type,g=0;if(h==="svg"&&(i=!0),r!=null){for(;g<r.length;g++)if((c=r[g])&&"setAttribute"in c==!!h&&(h?c.localName===h:c.nodeType===3)){s=c,r[g]=null;break}}if(s==null){if(h===null)return document.createTextNode(y);s=i?document.createElementNS("http://www.w3.org/2000/svg",h):document.createElement(h,y.is&&y),r=null,a=!1}if(h===null)w===y||a&&s.data===y||(s.data=y);else{if(r=r&&Te.call(s.childNodes),m=(w=t.props||ze).dangerouslySetInnerHTML,u=y.dangerouslySetInnerHTML,!a){if(r!=null)for(w={},g=0;g<s.attributes.length;g++)w[s.attributes[g].name]=s.attributes[g].value;(u||m)&&(u&&(m&&u.__html==m.__html||u.__html===s.innerHTML)||(s.innerHTML=u&&u.__html||""))}if(Yr(s,y,w,i,a),u)e.__k=[];else if(g=e.props.children,Mr(s,Array.isArray(g)?g:[g],e,t,n,i&&h!=="foreignObject",r,o,r?r[0]:t.__k&&ve(t,0),a),r!=null)for(g=r.length;g--;)r[g]!=null&&Cr(r[g]);a||("value"in y&&(g=y.value)!==void 0&&(g!==s.value||h==="progress"&&!g||h==="option"&&g!==w.value)&&Pe(s,"value",g,w.value,!1),"checked"in y&&(g=y.checked)!==void 0&&g!==s.checked&&Pe(s,"checked",g,w.checked,!1))}return s}function Br(s,e,t){try{typeof s=="function"?s(e):s.current=e}catch(n){ct.__e(n,t)}}function Tr(s,e,t){var n,i;if(ct.unmount&&ct.unmount(s),(n=s.ref)&&(n.current&&n.current!==s.__e||Br(n,null,e)),(n=s.__c)!=null){if(n.componentWillUnmount)try{n.componentWillUnmount()}catch(r){ct.__e(r,e)}n.base=n.__P=null,s.__c=void 0}if(n=s.__k)for(i=0;i<n.length;i++)n[i]&&Tr(n[i],e,t||typeof s.type!="function");t||s.__e==null||Cr(s.__e),s.__=s.__e=s.__d=void 0}function Kr(s,e,t){return this.constructor(s,t)}function Jr(s,e,t){var n,i,r;ct.__&&ct.__(s,e),i=(n=typeof t=="function")?null:t&&t.__k||e.__k,r=[],qn(e,s=(!n&&t||e).__k=$r(Re,null,[s]),i||ze,ze,e.ownerSVGElement!==void 0,!n&&t?[t]:i?null:e.firstChild?Te.call(e.childNodes):null,r,!n&&t?t:i?i.__e:e.firstChild,n),Pr(r,s)}Te=Ar.slice,ct={__e:function(s,e,t,n){for(var i,r,o;e=e.__;)if((i=e.__c)&&!i.__)try{if((r=i.constructor)&&r.getDerivedStateFromError!=null&&(i.setState(r.getDerivedStateFromError(s)),o=i.__d),i.componentDidCatch!=null&&(i.componentDidCatch(s,n||{}),o=i.__d),o)return i.__E=i}catch(a){s=a}throw s}},Ir=0,Tt.prototype.setState=function(s,e){var t;t=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=Bt({},this.state),typeof s=="function"&&(s=s(Bt({},t),this.props)),s&&Bt(t,s),s!=null&&this.__v&&(e&&this._sb.push(e),tr(this))},Tt.prototype.forceUpdate=function(s){this.__v&&(this.__e=!0,s&&this.__h.push(s),tr(this))},Tt.prototype.render=Re,ge=[],De.__r=0;var Gn=function(s,e){return Number(s.slice(0,-1*e.length))},Qr=function(s){return s.endsWith("px")?{value:s,type:"px",numeric:Gn(s,"px")}:s.endsWith("fr")?{value:s,type:"fr",numeric:Gn(s,"fr")}:s.endsWith("%")?{value:s,type:"%",numeric:Gn(s,"%")}:s==="auto"?{value:s,type:"auto"}:null},Rr=function(s){return s.split(" ").map(Qr)},ti=function(s,e,t,n){t===void 0&&(t=0),n===void 0&&(n=!1);var i=n?s+1:s,r=e.slice(0,i).reduce(function(a,c){return a+c.numeric},0),o=t?s*t:0;return r+o},Nr=function(s,e,t){return e.concat(t).map(function(n){return n.style[s]}).filter(function(n){return n!==void 0&&n!==""})},ei=function(s,e){return e.endsWith(s)?Number(e.slice(0,-1*s.length)):null},ir=function(s){for(var e=0;e<s.length;e++)if(s[e].numeric>0)return e;return null},Ut=function(){return!1},ni=function(s,e,t){s.style[e]=t},ft=function(s,e,t){var n=s[e];return n!==void 0?n:t};function jr(s){var e;return(e=[]).concat.apply(e,Array.from(s.ownerDocument.styleSheets).map(function(t){var n=[];try{n=Array.from(t.cssRules||[])}catch{}return n})).filter(function(t){var n=!1;try{n=s.matches(t.selectorText)}catch{}return n})}var ri="grid-template-columns",ii="grid-template-rows",vt=function(e,t,n){this.direction=e,this.element=t.element,this.track=t.track,e==="column"?(this.gridTemplateProp=ri,this.gridGapProp="grid-column-gap",this.cursor=ft(n,"columnCursor",ft(n,"cursor","col-resize")),this.snapOffset=ft(n,"columnSnapOffset",ft(n,"snapOffset",30)),this.dragInterval=ft(n,"columnDragInterval",ft(n,"dragInterval",1)),this.clientAxis="clientX",this.optionStyle=ft(n,"gridTemplateColumns")):e==="row"&&(this.gridTemplateProp=ii,this.gridGapProp="grid-row-gap",this.cursor=ft(n,"rowCursor",ft(n,"cursor","row-resize")),this.snapOffset=ft(n,"rowSnapOffset",ft(n,"snapOffset",30)),this.dragInterval=ft(n,"rowDragInterval",ft(n,"dragInterval",1)),this.clientAxis="clientY",this.optionStyle=ft(n,"gridTemplateRows")),this.onDragStart=ft(n,"onDragStart",Ut),this.onDragEnd=ft(n,"onDragEnd",Ut),this.onDrag=ft(n,"onDrag",Ut),this.writeStyle=ft(n,"writeStyle",ni),this.startDragging=this.startDragging.bind(this),this.stopDragging=this.stopDragging.bind(this),this.drag=this.drag.bind(this),this.minSizeStart=t.minSizeStart,this.minSizeEnd=t.minSizeEnd,t.element&&(this.element.addEventListener("mousedown",this.startDragging),this.element.addEventListener("touchstart",this.startDragging))};vt.prototype.getDimensions=function(){var e=this.grid.getBoundingClientRect(),t=e.width,n=e.height,i=e.top,r=e.bottom,o=e.left,a=e.right;this.direction==="column"?(this.start=i,this.end=r,this.size=n):this.direction==="row"&&(this.start=o,this.end=a,this.size=t)};vt.prototype.getSizeAtTrack=function(e,t){return ti(e,this.computedPixels,this.computedGapPixels,t)};vt.prototype.getSizeOfTrack=function(e){return this.computedPixels[e].numeric};vt.prototype.getRawTracks=function(){var e=Nr(this.gridTemplateProp,[this.grid],jr(this.grid));if(!e.length){if(this.optionStyle)return this.optionStyle;throw Error("Unable to determine grid template tracks from styles.")}return e[0]};vt.prototype.getGap=function(){var e=Nr(this.gridGapProp,[this.grid],jr(this.grid));return e.length?e[0]:null};vt.prototype.getRawComputedTracks=function(){return window.getComputedStyle(this.grid)[this.gridTemplateProp]};vt.prototype.getRawComputedGap=function(){return window.getComputedStyle(this.grid)[this.gridGapProp]};vt.prototype.setTracks=function(e){this.tracks=e.split(" "),this.trackValues=Rr(e)};vt.prototype.setComputedTracks=function(e){this.computedTracks=e.split(" "),this.computedPixels=Rr(e)};vt.prototype.setGap=function(e){this.gap=e};vt.prototype.setComputedGap=function(e){this.computedGap=e,this.computedGapPixels=ei("px",this.computedGap)||0};vt.prototype.getMousePosition=function(e){return"touches"in e?e.touches[0][this.clientAxis]:e[this.clientAxis]};vt.prototype.startDragging=function(e){if(!("button"in e&&e.button!==0)){e.preventDefault(),this.element?this.grid=this.element.parentNode:this.grid=e.target.parentNode,this.getDimensions(),this.setTracks(this.getRawTracks()),this.setComputedTracks(this.getRawComputedTracks()),this.setGap(this.getGap()),this.setComputedGap(this.getRawComputedGap());var t=this.trackValues.filter(function(a){return a.type==="%"}),n=this.trackValues.filter(function(a){return a.type==="fr"});if(this.totalFrs=n.length,this.totalFrs){var i=ir(n);i!==null&&(this.frToPixels=this.computedPixels[i].numeric/n[i].numeric)}if(t.length){var r=ir(t);r!==null&&(this.percentageToPixels=this.computedPixels[r].numeric/t[r].numeric)}var o=this.getSizeAtTrack(this.track,!1)+this.start;if(this.dragStartOffset=this.getMousePosition(e)-o,this.aTrack=this.track-1,this.track<this.tracks.length-1)this.bTrack=this.track+1;else throw Error("Invalid track index: "+this.track+". Track must be between two other tracks and only "+this.tracks.length+" tracks were found.");this.aTrackStart=this.getSizeAtTrack(this.aTrack,!1)+this.start,this.bTrackEnd=this.getSizeAtTrack(this.bTrack,!0)+this.start,this.dragging=!0,window.addEventListener("mouseup",this.stopDragging),window.addEventListener("touchend",this.stopDragging),window.addEventListener("touchcancel",this.stopDragging),window.addEventListener("mousemove",this.drag),window.addEventListener("touchmove",this.drag),this.grid.addEventListener("selectstart",Ut),this.grid.addEventListener("dragstart",Ut),this.grid.style.userSelect="none",this.grid.style.webkitUserSelect="none",this.grid.style.MozUserSelect="none",this.grid.style.pointerEvents="none",this.grid.style.cursor=this.cursor,window.document.body.style.cursor=this.cursor,this.onDragStart(this.direction,this.track)}};vt.prototype.stopDragging=function(){this.dragging=!1,this.cleanup(),this.onDragEnd(this.direction,this.track),this.needsDestroy&&(this.element&&(this.element.removeEventListener("mousedown",this.startDragging),this.element.removeEventListener("touchstart",this.startDragging)),this.destroyCb(),this.needsDestroy=!1,this.destroyCb=null)};vt.prototype.drag=function(e){var t=this.getMousePosition(e),n=this.getSizeOfTrack(this.track),i=this.aTrackStart+this.minSizeStart+this.dragStartOffset+this.computedGapPixels,r=this.bTrackEnd-this.minSizeEnd-this.computedGapPixels-(n-this.dragStartOffset),o=i+this.snapOffset,a=r-this.snapOffset;t<o&&(t=i),t>a&&(t=r),t<i?t=i:t>r&&(t=r);var c=t-this.aTrackStart-this.dragStartOffset-this.computedGapPixels,m=this.bTrackEnd-t+this.dragStartOffset-n-this.computedGapPixels;if(this.dragInterval>1){var u=Math.round(c/this.dragInterval)*this.dragInterval;m-=u-c,c=u}if(c<this.minSizeStart&&(c=this.minSizeStart),m<this.minSizeEnd&&(m=this.minSizeEnd),this.trackValues[this.aTrack].type==="px")this.tracks[this.aTrack]=c+"px";else if(this.trackValues[this.aTrack].type==="fr")if(this.totalFrs===1)this.tracks[this.aTrack]="1fr";else{var w=c/this.frToPixels;this.tracks[this.aTrack]=w+"fr"}else if(this.trackValues[this.aTrack].type==="%"){var y=c/this.percentageToPixels;this.tracks[this.aTrack]=y+"%"}if(this.trackValues[this.bTrack].type==="px")this.tracks[this.bTrack]=m+"px";else if(this.trackValues[this.bTrack].type==="fr")if(this.totalFrs===1)this.tracks[this.bTrack]="1fr";else{var h=m/this.frToPixels;this.tracks[this.bTrack]=h+"fr"}else if(this.trackValues[this.bTrack].type==="%"){var g=m/this.percentageToPixels;this.tracks[this.bTrack]=g+"%"}var f=this.tracks.join(" ");this.writeStyle(this.grid,this.gridTemplateProp,f),this.onDrag(this.direction,this.track,f)};vt.prototype.cleanup=function(){window.removeEventListener("mouseup",this.stopDragging),window.removeEventListener("touchend",this.stopDragging),window.removeEventListener("touchcancel",this.stopDragging),window.removeEventListener("mousemove",this.drag),window.removeEventListener("touchmove",this.drag),this.grid&&(this.grid.removeEventListener("selectstart",Ut),this.grid.removeEventListener("dragstart",Ut),this.grid.style.userSelect="",this.grid.style.webkitUserSelect="",this.grid.style.MozUserSelect="",this.grid.style.pointerEvents="",this.grid.style.cursor=""),window.document.body.style.cursor=""};vt.prototype.destroy=function(e,t){e===void 0&&(e=!0),e||this.dragging===!1?(this.cleanup(),this.element&&(this.element.removeEventListener("mousedown",this.startDragging),this.element.removeEventListener("touchstart",this.startDragging)),t&&t()):(this.needsDestroy=!0,t&&(this.destroyCb=t))};var sr=function(s,e,t){return e in s?s[e]:t},Yt=function(s,e){return function(t){if(t.track<1)throw Error("Invalid track index: "+t.track+". Track must be between two other tracks.");var n=s==="column"?e.columnMinSizes||{}:e.rowMinSizes||{},i=s==="column"?"columnMinSize":"rowMinSize";return new vt(s,Object.assign({},{minSizeStart:sr(n,t.track-1,ft(e,i,ft(e,"minSize",0))),minSizeEnd:sr(n,t.track+1,ft(e,i,ft(e,"minSize",0)))},t),e)}},Gt=function(e){var t=this;this.columnGutters={},this.rowGutters={},this.options=Object.assign({},{columnGutters:e.columnGutters||[],rowGutters:e.rowGutters||[],columnMinSizes:e.columnMinSizes||{},rowMinSizes:e.rowMinSizes||{}},e),this.options.columnGutters.forEach(function(n){t.columnGutters[n.track]=Yt("column",t.options)(n)}),this.options.rowGutters.forEach(function(n){t.rowGutters[n.track]=Yt("row",t.options)(n)})};Gt.prototype.addColumnGutter=function(e,t){this.columnGutters[t]&&this.columnGutters[t].destroy(),this.columnGutters[t]=Yt("column",this.options)({element:e,track:t})};Gt.prototype.addRowGutter=function(e,t){this.rowGutters[t]&&this.rowGutters[t].destroy(),this.rowGutters[t]=Yt("row",this.options)({element:e,track:t})};Gt.prototype.removeColumnGutter=function(e,t){var n=this;t===void 0&&(t=!0),this.columnGutters[e]&&this.columnGutters[e].destroy(t,function(){delete n.columnGutters[e]})};Gt.prototype.removeRowGutter=function(e,t){var n=this;t===void 0&&(t=!0),this.rowGutters[e]&&this.rowGutters[e].destroy(t,function(){delete n.rowGutters[e]})};Gt.prototype.handleDragStart=function(e,t,n){t==="column"?(this.columnGutters[n]&&this.columnGutters[n].destroy(),this.columnGutters[n]=Yt("column",this.options)({track:n}),this.columnGutters[n].startDragging(e)):t==="row"&&(this.rowGutters[n]&&this.rowGutters[n].destroy(),this.rowGutters[n]=Yt("row",this.options)({track:n}),this.rowGutters[n].startDragging(e))};Gt.prototype.destroy=function(e){var t=this;e===void 0&&(e=!0),Object.keys(this.columnGutters).forEach(function(n){return t.columnGutters[n].destroy(e,function(){delete t.columnGutters[n]})}),Object.keys(this.rowGutters).forEach(function(n){return t.rowGutters[n].destroy(e,function(){delete t.rowGutters[n]})})};function si(s){return new Gt(s)}var oi=0;function at(s,e,t,n,i){var r,o,a={};for(o in e)o=="ref"?r=e[o]:a[o]=e[o];var c={type:s,props:a,key:t,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:--oi,__source:i,__self:n};if(typeof s=="function"&&(r=s.defaultProps))for(o in r)a[o]===void 0&&(a[o]=r[o]);return ct.vnode&&ct.vnode(c),c}class ai extends Tt{toggleFolder(e){const t=e.target;t.parentElement.querySelector(".nested").classList.toggle("active"),t.classList.toggle("caret-down")}render(){var t;const e=(t=this.props.project)==null?void 0:t.folders.find(n=>n.type=="diagrams");return this.renderChildren(e)}renderChildren(e){if(e==null||e.diagrams.length+e.folders.length==0)return null;const t=[...e.folders];t.sort((o,a)=>o.name.localeCompare(a.name));const n=[...e.diagrams];n.sort((o,a)=>o.name.localeCompare(a.name));const i=t.map(o=>this.renderFolder(o)),r=n.map(o=>this.renderDiagramElement(o));return i.concat(r)}renderFolder(e){return at("li",{children:[at("span",{onClick:t=>this.toggleFolder(t),class:"caret caret-down",children:e.name}),at("ul",{class:"nested active",children:this.renderChildren(e)})]})}renderDiagramElement(e){const t=e.id,n=t==this.props.active?"active":"";return at("li",{"data-id":t,class:n,onClick:i=>this.onDiagramClick(i),children:e.name})}onDiagramClick(e){var i,r;const t=e.target,n=t.getAttribute("data-id");!n||((r=(i=this.base.parentElement.querySelector("li.active"))==null?void 0:i.classList)==null||r.remove("active"),t.classList.toggle("active"),this.props.active=n,this.props.onDiagramSelected(n))}}var $t=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},or=function s(e,t){if(e===t)return!0;if(e&&t&&typeof e=="object"&&typeof t=="object"){if(e.constructor!==t.constructor)return!1;var n,i,r;if(Array.isArray(e)){if(n=e.length,n!=t.length)return!1;for(i=n;i--!==0;)if(!s(e[i],t[i]))return!1;return!0}if(e.constructor===RegExp)return e.source===t.source&&e.flags===t.flags;if(e.valueOf!==Object.prototype.valueOf)return e.valueOf()===t.valueOf();if(e.toString!==Object.prototype.toString)return e.toString()===t.toString();if(r=Object.keys(e),n=r.length,n!==Object.keys(t).length)return!1;for(i=n;i--!==0;)if(!Object.prototype.hasOwnProperty.call(t,r[i]))return!1;for(i=n;i--!==0;){var o=r[i];if(!s(e[o],t[o]))return!1}return!0}return e!==e&&t!==t};class xe{static undoChange(e){return{action:e.action,diagramId:e.diagramId,chainedToParent:e.chainedToParent,move:t(e.move),connection:n(e.connection),edit:i(e.edit),addRemoveElement:r(e.addRemoveElement)};function t(o){return o?{elementId:o.elementId,parentIdNew:o.parentIdOld,parentIdOld:o.parentIdNew,positionNew:o.positionOld,positionOld:o.positionNew}:null}function n(o){return o?{sourceConnectionId:o.sourceConnectionId,index:o.index,bendPointsNew:o.bendPointsOld,bendPointsOld:o.bendPointsNew,targetOffset:o.targetOffset}:null}function i(o){return o?{elementId:o.elementId,textNew:o.textOld,textOld:o.textNew}:null}function r(o){return o?{entity:o.entity,element:o.element,adding:!o.adding}:null}}static isChanged(e){if(e.move)return t(e.move);if(e.connection)return n(e.connection);if(e.edit)return i(e.edit);if(e.addRemoveElement)return!0;throw new Error("unknown change type");function t(r){return r.parentIdNew!=r.parentIdOld||!or(r.positionNew,r.positionOld)}function n(r){return!or(r.bendPointsNew,r.bendPointsOld)}function i(r){return r.textNew!=r.textOld}}}var lt=(s=>(s[s.Move=1]="Move",s[s.Resize=2]="Resize",s[s.Connection=3]="Connection",s[s.Edit=4]="Edit",s[s.AddRemoveElement=5]="AddRemoveElement",s))(lt||{});class Ne{static fromUint8Array(e){return btoa(Ne.uint8ToString(e))}static toArrayBuffer(e){const t=window.atob(e),n=t.length,i=new Uint8Array(n);for(let r=0;r<n;r++)i[r]=t.charCodeAt(r);return i}static uint8ToString(e){const n=[];for(let i=0;i<e.length;i+=32768)n.push(String.fromCharCode.apply(null,e.subarray(i,i+32768)));return n.join("")}}class li{constructor(e,t){N(this,"cache",new Map);N(this,"urlPromises",new Map);N(this,"uniqueIds",new Set);this.project=e,this.imageDefs=t}getImage(e){var o;const t=this.cache.get(e);if(t)return new Promise(a=>a(t));const n=new ci,i=new Promise((a,c)=>{n.resolveSelf=a,n.rejectSelf=c}),r=(o=this.urlPromises.get(e))!=null?o:[];return r.push(n),this.urlPromises.set(e,r),r.length==1&&this.loadImage(e),i}async loadImage(e){const t=await this.project.getImage(e),n=Ne.fromUint8Array(t),i=e.split(".").pop(),r=document.createElement("img");r.setAttribute("src",`data:image/${i};base64, ${n}`),r.onload=()=>{const o=/[\w\-\:\.]/g;let a="img_"+e.replace(o,"");this.uniqueIds.has(a)?a=a+Math.random().toString(36).substring(2,10):this.uniqueIds.add(a);const c=document.createElementNS("http://www.w3.org/2000/svg","image");c.id=a,c.setAttribute("href",`data:image/${i};base64, ${n}`),this.imageDefs.appendChild(c);const m=new hi(r.width,r.height,a);this.cache.set(e,m);const u=this.urlPromises.get(e);this.urlPromises.delete(e),u.forEach(w=>w.resolveSelf(m))}}}class ci{constructor(){N(this,"resolveSelf");N(this,"rejectSelf")}}class hi{constructor(e,t,n){this.width=e,this.height=t,this.defsId=n}}class At{constructor(e,t,n){N(this,"svgDocument");N(this,"svgContent");N(this,"groupEditInfo");N(this,"groupElementSelection");N(this,"sourceConnectionMiddlePoints");N(this,"imageCache");N(this,"elementSelections",new Map);N(this,"_editInfo");N(this,"_highlightedElementId");N(this,"_selectedRelationId");this.project=e,this.diagram=t,this.template=n,this.svgDocument=this.template.getEmptySvg(),this.svgContent=this.svgDocument.getElementById("content"),this.groupEditInfo=this.createSvgGElement(),this.svgContent.parentElement.appendChild(this.groupEditInfo),this.groupElementSelection=this.createSvgGElement(),this.svgContent.parentElement.appendChild(this.groupElementSelection),this.sourceConnectionMiddlePoints=new Map,this.imageCache=new li(e,this.svgDocument.getElementById("imageDefs"))}get svg(){return this.svgContent.ownerSVGElement}buildSvg(){const e=this.createSvgGElement();return e.id=this.diagram.id,this.svgContent.appendChild(e),this.addElements(this.diagram.children,e),this.addRelations(),this.setViewBoxSize(),this.svgDocument}createSvgGElement(){return this.svgContent.ownerDocument.createElementNS(this.svgContent.namespaceURI,"g")}setViewBoxSize(){const e=this.diagram.descendants[0].AbsolutePosition;let[t,n]=[e.x,e.y],[i,r]=[0,0];this.diagram.descendants.forEach(o=>{t=Math.min(t,o.AbsolutePosition.x),n=Math.min(n,o.AbsolutePosition.y),i=Math.max(i,o.AbsolutePosition.x+o.bounds.width),r=Math.max(r,o.AbsolutePosition.y+o.bounds.height)}),this.svgDocument.firstElementChild.setAttribute("viewBox",`${(t-10).toFixed(0)} ${(n-10).toFixed(0)} ${(i-t+20).toFixed(0)} ${(r-n+20).toFixed(0)}`),this.svgDocument.firstElementChild.setAttribute("width",`${(i-t+20).toFixed(0)}`),this.svgDocument.firstElementChild.setAttribute("height",`${(r-n+20).toFixed(0)}`)}addElements(e,t){e.forEach(n=>this.addElement(n,t))}addElement(e,t){var w,y;let n=this.project.getById(e.entityId);n==null&&(n=new ye,n.entityType=e.entityType,n.name=e.name);const i=this.template.getElementByType(n,e),r=i.querySelector(":scope>foreignObject>div>div");if(i.classList.contains("note")){let h=(w=e.content)!=null?w:"";h=h.replace(/[\uf0b7\uf0a7]/g,"\u2022").replace(/\r/g,""),n.name=h}n.documentation=e.documentation;const o=i.querySelector(":scope>use.img");if(o){const h=e.imagePath;o.setAttribute("href",""),h&&this.imageCache.getImage(h).then(g=>{o.setAttribute("href","#"+g.defsId);const f=e.imagePosition!=null?e.imagePosition:e.entityType.endsWith("CanvasModelImage")?Ae.Fill:Ae.TopRight;if(f===Ae.Fill)o.setAttribute("transform",`matrix(${e.bounds.width/g.width},0,0,${e.bounds.height/g.height},0,0)`);else{let v=e.bounds.width-g.width,p=e.bounds.height-g.height;switch(f%3){case 0:v=0;break;case 1:v/=2;break}switch(Math.floor(f/3)){case 0:p=0;break;case 1:p/=2;break}o.setAttribute("transform",`matrix(1,0,0,1,${v},${p})`)}})}if(e.alpha!=null&&i.firstElementChild.setAttribute("fill-opacity",`${e.alpha/255}`),e.textPosition!=null)switch(e.textPosition){case Ce.Top:r.classList.add("top");break;case Ce.Middle:r.classList.add("middle");break;case Ce.Bottom:r.classList.add("bottom");break}if(e.textAlignment!=null)switch(e.textAlignment){case Oe.Left:r.classList.add("left");break;case Oe.Centre:r.classList.add("center");break;case Oe.Right:r.classList.add("right");break}const a=i.querySelector(":scope>rect");if(e.borderColor&&a.setAttribute("stroke",e.borderColor),i.setAttribute("id",e.id.toString()),r!=null)if(r.setAttribute("contenteditable","true"),!i.classList.contains("grouping")&&!i.classList.contains("note")){r.textContent=n.name;const h=i.ownerDocument.createElementNS(r.namespaceURI,"div");h.textContent=n.entityType,h.setAttribute("class","elementType"),r.parentNode.appendChild(h)}else r.textContent="",((y=n.name)!=null?y:"").split(`
`).forEach(h=>{const g=i.ownerDocument.createElementNS(r.namespaceURI,"div");h!=""&&(g.textContent=h),r.appendChild(g)});u();let c="";if(e.fillColor&&(c+="fill: "+e.fillColor+" "),c!==""&&Array.from(i.children).filter(g=>g.nodeName=="rect"||g.nodeName=="path").forEach(g=>g.setAttribute("style",c.trimEnd())),c="",e.font){const h=e.font.split("|"),g=h[1],f=h[2],v=parseInt(h[3]);c="font: ",v&1&&(c+="bold "),v&2&&(c+="italic "),c+=`${f}pt ${g} `;const p=[];v&4&&p.push("underline"),v&8&&p.push("line-through"),p.length>1&&(c+=`font-decoration: ${p.join(" ")} `),c=c.trimEnd()+";"}e.fontColor&&(c+=`color: ${e.fontColor} `),r&&c!=""&&r.setAttribute("style",c.trimEnd());const m=this.getElementSelection(e.id);return m&&(m.setPosition(e.AbsolutePosition.x,e.AbsolutePosition.y,e.bounds.width,e.bounds.height),m.lastSelected=!0),t.append(i),this.addElements(e.children,i),i;function u(){if(n.documentation){const h=i.ownerDocument.createElementNS(i.namespaceURI,"title");h.textContent=n.documentation,i.insertBefore(h,i.firstChild)}}}clearRelations(){this.svgContent.parentElement.querySelectorAll("g.con").forEach(t=>t.remove()),this.sourceConnectionMiddlePoints.clear()}addRelations(){let e=this.diagram.descendants.flatMap(n=>n.sourceConnections),t=[];for(this.sourceConnectionMiddlePoints.clear();e.length>0;){t=e,e=[];for(const n of t){const[i,r]=this.getAbsolutePositionAndBounds(this.diagram.getDiagramObjectById(n.targetId));if(i!=null){const[o,a]=this.getAbsolutePositionAndBounds(n.source),c=At.calculateConnectionCoords(o,a,i,r,n);if(c.length>1){const m=this.project.getById(n.relationShipId);this.addRelation(c,n,m)}this.sourceConnectionMiddlePoints.set(n.id,c.length%2===1?c[(c.length-1)/2]:c[c.length/2-1].add(c[c.length/2]).multiply(.5))}else e.push(n)}}}getAbsolutePositionAndBounds(e){if(e instanceof Ln){const t=e.AbsolutePosition.add(new xt(e.bounds.width/2,e.bounds.height/2)),n=new xt(e.bounds.width/2,e.bounds.height/2);return[t,n]}else{const t=this.sourceConnectionMiddlePoints.get(e.id);return t!=null?[t,xt.Zero]:[null,null]}}addRelation(e,t,n){const i=At.coordsToPathD(e),r=At.addEditPointGroup(this.svgContent,t,n);At.addConnectionPath(r,n,i,t),At.addConnectionPathDetectLine(r,i),At.addConnectionText(r,t,e),At.addDragPoints(r,e),(t.source.id==this.highlightedElementId||t.targetId==this.highlightedElementId)&&r.classList.add("highlight"),this.selectedRelationId==t.id&&r.classList.add("selected")}static addDragPoints(e,t){for(let n=0;n<t.length;n++){const i=t[n];let r;if(n>0){const o=t[n-1];r=e.ownerDocument.createElementNS(e.namespaceURI,"circle"),r.setAttribute("cx",((i.x+o.x)/2).toString()),r.setAttribute("cy",((i.y+o.y)/2).toString()),r.setAttribute("r","2"),e.appendChild(r)}r=e.ownerDocument.createElementNS(e.namespaceURI,"circle"),r.setAttribute("cx",i.x.toString()),r.setAttribute("cy",i.y.toString()),r.setAttribute("r","3"),(n===0||n===t.length-1)&&r.classList.add("end"),e.appendChild(r)}}static addConnectionPathDetectLine(e,t){const n=e.ownerDocument.createElementNS(e.namespaceURI,"path");n.setAttribute("d",t),n.setAttribute("class","RelationshipDetect"),e.appendChild(n)}static addConnectionText(e,t,n){if(!t.name)return;let i;const r=Math.floor((n.length-1)/2);n.length&1?i=n[r]:i=n[r].add(n[r+1]).multiply(.5);const o=e.ownerDocument.createElementNS(e.namespaceURI,"text");o.setAttribute("x",`${i.x}`),o.setAttribute("y",`${i.y}`),o.textContent=t.name,e.appendChild(o)}static addEditPointGroup(e,t,n){const i=e.ownerDocument.createElementNS(e.namespaceURI,"g");return i.setAttribute("id",t.id),i.setAttribute("class","con"),n&&i.setAttribute("data-rel",n.id),e.appendChild(i),i}static addConnectionPath(e,t,n,i){var m;const r=t==null?void 0:t.entityType;let o=(m=r==null?void 0:r.replace("Relationship"," Relationship"))!=null?m:"Relationship";if(r==="AccessRelationShip"){let u;switch(t.element.getAttribute("accessType")){case"1":u="Read";break;case"2":u="Access";break;case"3":u="Read Write";break;default:u="Write";break}o+=o+" "+u}const a=e.ownerDocument.createElementNS(e.namespaceURI,"path");if(a.setAttribute("d",n),a.setAttribute("class",o),!r){const u=Number(i.type);let w=null,y=null,h=null;u&Dt.ArrowFillTarget&&(y="Closed"),u&Dt.ArrowHollowTarget&&(y="Hollow"),u&Dt.ArrowLineTarget&&(y="Open"),u&Dt.ArrowFillSource&&(w="Closed"),u&Dt.ArrowHollowSource&&(w="Hollow"),u&Dt.ArrowLineSource&&(w="Open"),u&Dt.LineDashed&&(h="6 4"),u&Dt.LineDotted&&(h="2 4"),w&&a.setAttribute("marker-start",`url(#arrow${w}Start)`),y&&a.setAttribute("marker-end",`url(#arrow${y})`),h&&a.setAttribute("stroke-dasharray",h)}let c="";i.lineWidth!=null&&(c+="stroke-width:"+i.lineWidth+";"),i.lineColor!=null&&(c+="stroke:"+i.lineColor+";"),c!==""&&a.setAttribute("style",c),e.appendChild(a)}static coordsToPathD(e){let t="";t+=`M ${+e[0].x.toFixed(2)} ${+e[0].y.toFixed(2)} `;const n=12;for(let i=1;i<e.length-1;i++){let r=e[i-1];const o=e[i];let a=e[i+1];const c=Math.sqrt(Math.pow(o.x-r.x,2)+Math.pow(o.y-r.y,2)),m=Math.sqrt(Math.pow(o.x-a.x,2)+Math.pow(o.y-a.y,2));if(c<n*2||m<n*2){t+=`L ${o.x} ${o.y} `;continue}r=r.add(o.subtract(r).multiply((c-n)*(1/c))),a=o.add(a.subtract(o).multiply(n*(1/m))),t+=`L ${+r.x.toFixed(2)} ${+r.y.toFixed(2)} Q ${+o.x.toFixed(2)} ${+o.y.toFixed(2)} ${+a.x.toFixed(2)} ${+a.y.toFixed(2)} `}return t+=`L ${+e.slice(-1)[0].x.toFixed(2)} ${+e.slice(-1)[0].y.toFixed(2)} `,t}static calculateConnectionCoords(e,t,n,i,r){e=new xt(e.x,e.y),n=new xt(n.x,n.y);const o=r.bendPoints.map(m=>e.add(new xt(m.x,m.y))),a=[];let c=e;return o.forEach(m=>{At.determineStartAndEnd(c,t,m,xt.Zero),a.push(c),t=xt.Zero,c=m}),At.determineStartAndEnd(c,t,n,i),a.push(c),(c.x!==n.x||c.y!==n.y)&&a.push(n),a}static determineStartAndEnd(e,t,n,i){if(e.y-t.y>n.y+i.y)e.y=e.y-t.y,n.y=n.y+i.y;else if(e.y+t.y<n.y-i.y)e.y=e.y+t.y,n.y=n.y-i.y;else{const r=Math.max(e.y-t.y,n.y-i.y),o=Math.min(e.y+t.y,n.y+i.y),a=(r+o)/2;e.y=a,n.y=a}if(e.x-t.x>n.x+i.x)e.x=e.x-t.x,n.x=n.x+i.x;else if(e.x+t.x<n.x-i.x)e.x=e.x+t.x,n.x=n.x-i.x;else{const r=Math.max(e.x-t.x,n.x-i.x),o=Math.min(e.x+t.x,n.x+i.x),a=(r+o)/2;e.x=a,n.x=a}}get editInfo(){return this._editInfo||(this._editInfo=this.template.createEditInfo(),this.groupEditInfo.appendChild(this._editInfo.element)),this._editInfo}removeEditInfo(){this._editInfo=null,this.groupEditInfo.replaceChildren()}getElementSelections(){return Array.from(this.elementSelections.values())}getElementSelection(e){return this.elementSelections.get(e)}removeElementSelection(e){const t=this.elementSelections.get(e);t&&(t.element.remove(),this.elementSelections.delete(e))}removeElementSelections(){this.elementSelections.forEach(e=>e.element.remove()),this.elementSelections.clear()}addElementSelection(e){let t=this.elementSelections.get(e);return t=this.template.createElementSelection(e),this.elementSelections.set(e,t),this.svgContent.appendChild(t.element),t}get highlightedElementId(){return this._highlightedElementId}set highlightedElementId(e){e!=this._highlightedElementId&&(this._highlightedElementId!=null&&this.svgContent.querySelectorAll("g.con.highlight").forEach(t=>t.classList.remove("highlight")),this._highlightedElementId=e,e&&this.diagram.descendantsWithSourceConnections.filter(n=>n instanceof Wr&&(n.source.id==e||n.targetId==e)).forEach(n=>{const i=this.svg.getElementById(n.id);i&&i.classList.add("highlight")}))}get selectedRelationId(){return this._selectedRelationId}set selectedRelationId(e){var t;if(e!=this._selectedRelationId&&(this._selectedRelationId&&((t=this.svg.getElementById(this._selectedRelationId))==null||t.classList.remove("selected")),this._selectedRelationId=e,e)){const n=this.svg.getElementById(this._selectedRelationId);if(n){n.classList.add("selected");const i=n.parentElement;n.remove(),i.appendChild(n)}}}}function _e(s){throw new Error('Could not dynamically require "'+s+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Fr={exports:{}};/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/(function(s,e){(function(t){s.exports=t()})(function(){return function t(n,i,r){function o(m,u){if(!i[m]){if(!n[m]){var w=typeof _e=="function"&&_e;if(!u&&w)return w(m,!0);if(a)return a(m,!0);var y=new Error("Cannot find module '"+m+"'");throw y.code="MODULE_NOT_FOUND",y}var h=i[m]={exports:{}};n[m][0].call(h.exports,function(g){var f=n[m][1][g];return o(f||g)},h,h.exports,t,n,i,r)}return i[m].exports}for(var a=typeof _e=="function"&&_e,c=0;c<r.length;c++)o(r[c]);return o}({1:[function(t,n,i){var r=t("./utils"),o=t("./support"),a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";i.encode=function(c){for(var m,u,w,y,h,g,f,v=[],p=0,_=c.length,S=_,A=r.getTypeOf(c)!=="string";p<c.length;)S=_-p,w=A?(m=c[p++],u=p<_?c[p++]:0,p<_?c[p++]:0):(m=c.charCodeAt(p++),u=p<_?c.charCodeAt(p++):0,p<_?c.charCodeAt(p++):0),y=m>>2,h=(3&m)<<4|u>>4,g=1<S?(15&u)<<2|w>>6:64,f=2<S?63&w:64,v.push(a.charAt(y)+a.charAt(h)+a.charAt(g)+a.charAt(f));return v.join("")},i.decode=function(c){var m,u,w,y,h,g,f=0,v=0,p="data:";if(c.substr(0,p.length)===p)throw new Error("Invalid base64 input, it looks like a data url.");var _,S=3*(c=c.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(c.charAt(c.length-1)===a.charAt(64)&&S--,c.charAt(c.length-2)===a.charAt(64)&&S--,S%1!=0)throw new Error("Invalid base64 input, bad content length.");for(_=o.uint8array?new Uint8Array(0|S):new Array(0|S);f<c.length;)m=a.indexOf(c.charAt(f++))<<2|(y=a.indexOf(c.charAt(f++)))>>4,u=(15&y)<<4|(h=a.indexOf(c.charAt(f++)))>>2,w=(3&h)<<6|(g=a.indexOf(c.charAt(f++))),_[v++]=m,h!==64&&(_[v++]=u),g!==64&&(_[v++]=w);return _}},{"./support":30,"./utils":32}],2:[function(t,n,i){var r=t("./external"),o=t("./stream/DataWorker"),a=t("./stream/Crc32Probe"),c=t("./stream/DataLengthProbe");function m(u,w,y,h,g){this.compressedSize=u,this.uncompressedSize=w,this.crc32=y,this.compression=h,this.compressedContent=g}m.prototype={getContentWorker:function(){var u=new o(r.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new c("data_length")),w=this;return u.on("end",function(){if(this.streamInfo.data_length!==w.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),u},getCompressedWorker:function(){return new o(r.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},m.createWorkerFrom=function(u,w,y){return u.pipe(new a).pipe(new c("uncompressedSize")).pipe(w.compressWorker(y)).pipe(new c("compressedSize")).withStreamInfo("compression",w)},n.exports=m},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(t,n,i){var r=t("./stream/GenericWorker");i.STORE={magic:"\0\0",compressWorker:function(){return new r("STORE compression")},uncompressWorker:function(){return new r("STORE decompression")}},i.DEFLATE=t("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(t,n,i){var r=t("./utils"),o=function(){for(var a,c=[],m=0;m<256;m++){a=m;for(var u=0;u<8;u++)a=1&a?3988292384^a>>>1:a>>>1;c[m]=a}return c}();n.exports=function(a,c){return a!==void 0&&a.length?r.getTypeOf(a)!=="string"?function(m,u,w,y){var h=o,g=y+w;m^=-1;for(var f=y;f<g;f++)m=m>>>8^h[255&(m^u[f])];return-1^m}(0|c,a,a.length,0):function(m,u,w,y){var h=o,g=y+w;m^=-1;for(var f=y;f<g;f++)m=m>>>8^h[255&(m^u.charCodeAt(f))];return-1^m}(0|c,a,a.length,0):0}},{"./utils":32}],5:[function(t,n,i){i.base64=!1,i.binary=!1,i.dir=!1,i.createFolders=!0,i.date=null,i.compression=null,i.compressionOptions=null,i.comment=null,i.unixPermissions=null,i.dosPermissions=null},{}],6:[function(t,n,i){var r=null;r=typeof Promise<"u"?Promise:t("lie"),n.exports={Promise:r}},{lie:37}],7:[function(t,n,i){var r=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Uint32Array<"u",o=t("pako"),a=t("./utils"),c=t("./stream/GenericWorker"),m=r?"uint8array":"array";function u(w,y){c.call(this,"FlateWorker/"+w),this._pako=null,this._pakoAction=w,this._pakoOptions=y,this.meta={}}i.magic="\b\0",a.inherits(u,c),u.prototype.processChunk=function(w){this.meta=w.meta,this._pako===null&&this._createPako(),this._pako.push(a.transformTo(m,w.data),!1)},u.prototype.flush=function(){c.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},u.prototype.cleanUp=function(){c.prototype.cleanUp.call(this),this._pako=null},u.prototype._createPako=function(){this._pako=new o[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var w=this;this._pako.onData=function(y){w.push({data:y,meta:w.meta})}},i.compressWorker=function(w){return new u("Deflate",w)},i.uncompressWorker=function(){return new u("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(t,n,i){function r(h,g){var f,v="";for(f=0;f<g;f++)v+=String.fromCharCode(255&h),h>>>=8;return v}function o(h,g,f,v,p,_){var S,A,I=h.file,B=h.compression,D=_!==m.utf8encode,W=a.transformTo("string",_(I.name)),P=a.transformTo("string",m.utf8encode(I.name)),Z=I.comment,J=a.transformTo("string",_(Z)),k=a.transformTo("string",m.utf8encode(Z)),T=P.length!==I.name.length,d=k.length!==Z.length,j="",tt="",U="",et=I.dir,G=I.date,Q={crc32:0,compressedSize:0,uncompressedSize:0};g&&!f||(Q.crc32=h.crc32,Q.compressedSize=h.compressedSize,Q.uncompressedSize=h.uncompressedSize);var M=0;g&&(M|=8),D||!T&&!d||(M|=2048);var O=0,K=0;et&&(O|=16),p==="UNIX"?(K=798,O|=function($,ht){var mt=$;return $||(mt=ht?16893:33204),(65535&mt)<<16}(I.unixPermissions,et)):(K=20,O|=function($){return 63&($||0)}(I.dosPermissions)),S=G.getUTCHours(),S<<=6,S|=G.getUTCMinutes(),S<<=5,S|=G.getUTCSeconds()/2,A=G.getUTCFullYear()-1980,A<<=4,A|=G.getUTCMonth()+1,A<<=5,A|=G.getUTCDate(),T&&(tt=r(1,1)+r(u(W),4)+P,j+="up"+r(tt.length,2)+tt),d&&(U=r(1,1)+r(u(J),4)+k,j+="uc"+r(U.length,2)+U);var V="";return V+=`
\0`,V+=r(M,2),V+=B.magic,V+=r(S,2),V+=r(A,2),V+=r(Q.crc32,4),V+=r(Q.compressedSize,4),V+=r(Q.uncompressedSize,4),V+=r(W.length,2),V+=r(j.length,2),{fileRecord:w.LOCAL_FILE_HEADER+V+W+j,dirRecord:w.CENTRAL_FILE_HEADER+r(K,2)+V+r(J.length,2)+"\0\0\0\0"+r(O,4)+r(v,4)+W+j+J}}var a=t("../utils"),c=t("../stream/GenericWorker"),m=t("../utf8"),u=t("../crc32"),w=t("../signature");function y(h,g,f,v){c.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=g,this.zipPlatform=f,this.encodeFileName=v,this.streamFiles=h,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}a.inherits(y,c),y.prototype.push=function(h){var g=h.meta.percent||0,f=this.entriesCount,v=this._sources.length;this.accumulate?this.contentBuffer.push(h):(this.bytesWritten+=h.data.length,c.prototype.push.call(this,{data:h.data,meta:{currentFile:this.currentFile,percent:f?(g+100*(f-v-1))/f:100}}))},y.prototype.openedSource=function(h){this.currentSourceOffset=this.bytesWritten,this.currentFile=h.file.name;var g=this.streamFiles&&!h.file.dir;if(g){var f=o(h,g,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:f.fileRecord,meta:{percent:0}})}else this.accumulate=!0},y.prototype.closedSource=function(h){this.accumulate=!1;var g=this.streamFiles&&!h.file.dir,f=o(h,g,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(f.dirRecord),g)this.push({data:function(v){return w.DATA_DESCRIPTOR+r(v.crc32,4)+r(v.compressedSize,4)+r(v.uncompressedSize,4)}(h),meta:{percent:100}});else for(this.push({data:f.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},y.prototype.flush=function(){for(var h=this.bytesWritten,g=0;g<this.dirRecords.length;g++)this.push({data:this.dirRecords[g],meta:{percent:100}});var f=this.bytesWritten-h,v=function(p,_,S,A,I){var B=a.transformTo("string",I(A));return w.CENTRAL_DIRECTORY_END+"\0\0\0\0"+r(p,2)+r(p,2)+r(_,4)+r(S,4)+r(B.length,2)+B}(this.dirRecords.length,f,h,this.zipComment,this.encodeFileName);this.push({data:v,meta:{percent:100}})},y.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},y.prototype.registerPrevious=function(h){this._sources.push(h);var g=this;return h.on("data",function(f){g.processChunk(f)}),h.on("end",function(){g.closedSource(g.previous.streamInfo),g._sources.length?g.prepareNextSource():g.end()}),h.on("error",function(f){g.error(f)}),this},y.prototype.resume=function(){return!!c.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},y.prototype.error=function(h){var g=this._sources;if(!c.prototype.error.call(this,h))return!1;for(var f=0;f<g.length;f++)try{g[f].error(h)}catch{}return!0},y.prototype.lock=function(){c.prototype.lock.call(this);for(var h=this._sources,g=0;g<h.length;g++)h[g].lock()},n.exports=y},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(t,n,i){var r=t("../compressions"),o=t("./ZipFileWorker");i.generateWorker=function(a,c,m){var u=new o(c.streamFiles,m,c.platform,c.encodeFileName),w=0;try{a.forEach(function(y,h){w++;var g=function(_,S){var A=_||S,I=r[A];if(!I)throw new Error(A+" is not a valid compression method !");return I}(h.options.compression,c.compression),f=h.options.compressionOptions||c.compressionOptions||{},v=h.dir,p=h.date;h._compressWorker(g,f).withStreamInfo("file",{name:y,dir:v,date:p,comment:h.comment||"",unixPermissions:h.unixPermissions,dosPermissions:h.dosPermissions}).pipe(u)}),u.entriesCount=w}catch(y){u.error(y)}return u}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(t,n,i){function r(){if(!(this instanceof r))return new r;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var o=new r;for(var a in this)typeof this[a]!="function"&&(o[a]=this[a]);return o}}(r.prototype=t("./object")).loadAsync=t("./load"),r.support=t("./support"),r.defaults=t("./defaults"),r.version="3.10.1",r.loadAsync=function(o,a){return new r().loadAsync(o,a)},r.external=t("./external"),n.exports=r},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(t,n,i){var r=t("./utils"),o=t("./external"),a=t("./utf8"),c=t("./zipEntries"),m=t("./stream/Crc32Probe"),u=t("./nodejsUtils");function w(y){return new o.Promise(function(h,g){var f=y.decompressed.getContentWorker().pipe(new m);f.on("error",function(v){g(v)}).on("end",function(){f.streamInfo.crc32!==y.decompressed.crc32?g(new Error("Corrupted zip : CRC32 mismatch")):h()}).resume()})}n.exports=function(y,h){var g=this;return h=r.extend(h||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:a.utf8decode}),u.isNode&&u.isStream(y)?o.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):r.prepareContent("the loaded zip file",y,!0,h.optimizedBinaryString,h.base64).then(function(f){var v=new c(h);return v.load(f),v}).then(function(f){var v=[o.Promise.resolve(f)],p=f.files;if(h.checkCRC32)for(var _=0;_<p.length;_++)v.push(w(p[_]));return o.Promise.all(v)}).then(function(f){for(var v=f.shift(),p=v.files,_=0;_<p.length;_++){var S=p[_],A=S.fileNameStr,I=r.resolve(S.fileNameStr);g.file(I,S.decompressed,{binary:!0,optimizedBinaryString:!0,date:S.date,dir:S.dir,comment:S.fileCommentStr.length?S.fileCommentStr:null,unixPermissions:S.unixPermissions,dosPermissions:S.dosPermissions,createFolders:h.createFolders}),S.dir||(g.file(I).unsafeOriginalName=A)}return v.zipComment.length&&(g.comment=v.zipComment),g})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(t,n,i){var r=t("../utils"),o=t("../stream/GenericWorker");function a(c,m){o.call(this,"Nodejs stream input adapter for "+c),this._upstreamEnded=!1,this._bindStream(m)}r.inherits(a,o),a.prototype._bindStream=function(c){var m=this;(this._stream=c).pause(),c.on("data",function(u){m.push({data:u,meta:{percent:0}})}).on("error",function(u){m.isPaused?this.generatedError=u:m.error(u)}).on("end",function(){m.isPaused?m._upstreamEnded=!0:m.end()})},a.prototype.pause=function(){return!!o.prototype.pause.call(this)&&(this._stream.pause(),!0)},a.prototype.resume=function(){return!!o.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},n.exports=a},{"../stream/GenericWorker":28,"../utils":32}],13:[function(t,n,i){var r=t("readable-stream").Readable;function o(a,c,m){r.call(this,c),this._helper=a;var u=this;a.on("data",function(w,y){u.push(w)||u._helper.pause(),m&&m(y)}).on("error",function(w){u.emit("error",w)}).on("end",function(){u.push(null)})}t("../utils").inherits(o,r),o.prototype._read=function(){this._helper.resume()},n.exports=o},{"../utils":32,"readable-stream":16}],14:[function(t,n,i){n.exports={isNode:typeof Buffer<"u",newBufferFrom:function(r,o){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(r,o);if(typeof r=="number")throw new Error('The "data" argument must not be a number');return new Buffer(r,o)},allocBuffer:function(r){if(Buffer.alloc)return Buffer.alloc(r);var o=new Buffer(r);return o.fill(0),o},isBuffer:function(r){return Buffer.isBuffer(r)},isStream:function(r){return r&&typeof r.on=="function"&&typeof r.pause=="function"&&typeof r.resume=="function"}}},{}],15:[function(t,n,i){function r(I,B,D){var W,P=a.getTypeOf(B),Z=a.extend(D||{},u);Z.date=Z.date||new Date,Z.compression!==null&&(Z.compression=Z.compression.toUpperCase()),typeof Z.unixPermissions=="string"&&(Z.unixPermissions=parseInt(Z.unixPermissions,8)),Z.unixPermissions&&16384&Z.unixPermissions&&(Z.dir=!0),Z.dosPermissions&&16&Z.dosPermissions&&(Z.dir=!0),Z.dir&&(I=p(I)),Z.createFolders&&(W=v(I))&&_.call(this,W,!0);var J=P==="string"&&Z.binary===!1&&Z.base64===!1;D&&D.binary!==void 0||(Z.binary=!J),(B instanceof w&&B.uncompressedSize===0||Z.dir||!B||B.length===0)&&(Z.base64=!1,Z.binary=!0,B="",Z.compression="STORE",P="string");var k=null;k=B instanceof w||B instanceof c?B:g.isNode&&g.isStream(B)?new f(I,B):a.prepareContent(I,B,Z.binary,Z.optimizedBinaryString,Z.base64);var T=new y(I,k,Z);this.files[I]=T}var o=t("./utf8"),a=t("./utils"),c=t("./stream/GenericWorker"),m=t("./stream/StreamHelper"),u=t("./defaults"),w=t("./compressedObject"),y=t("./zipObject"),h=t("./generate"),g=t("./nodejsUtils"),f=t("./nodejs/NodejsStreamInputAdapter"),v=function(I){I.slice(-1)==="/"&&(I=I.substring(0,I.length-1));var B=I.lastIndexOf("/");return 0<B?I.substring(0,B):""},p=function(I){return I.slice(-1)!=="/"&&(I+="/"),I},_=function(I,B){return B=B!==void 0?B:u.createFolders,I=p(I),this.files[I]||r.call(this,I,null,{dir:!0,createFolders:B}),this.files[I]};function S(I){return Object.prototype.toString.call(I)==="[object RegExp]"}var A={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(I){var B,D,W;for(B in this.files)W=this.files[B],(D=B.slice(this.root.length,B.length))&&B.slice(0,this.root.length)===this.root&&I(D,W)},filter:function(I){var B=[];return this.forEach(function(D,W){I(D,W)&&B.push(W)}),B},file:function(I,B,D){if(arguments.length!==1)return I=this.root+I,r.call(this,I,B,D),this;if(S(I)){var W=I;return this.filter(function(Z,J){return!J.dir&&W.test(Z)})}var P=this.files[this.root+I];return P&&!P.dir?P:null},folder:function(I){if(!I)return this;if(S(I))return this.filter(function(P,Z){return Z.dir&&I.test(P)});var B=this.root+I,D=_.call(this,B),W=this.clone();return W.root=D.name,W},remove:function(I){I=this.root+I;var B=this.files[I];if(B||(I.slice(-1)!=="/"&&(I+="/"),B=this.files[I]),B&&!B.dir)delete this.files[I];else for(var D=this.filter(function(P,Z){return Z.name.slice(0,I.length)===I}),W=0;W<D.length;W++)delete this.files[D[W].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(I){var B,D={};try{if((D=a.extend(I||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:o.utf8encode})).type=D.type.toLowerCase(),D.compression=D.compression.toUpperCase(),D.type==="binarystring"&&(D.type="string"),!D.type)throw new Error("No output type specified.");a.checkSupport(D.type),D.platform!=="darwin"&&D.platform!=="freebsd"&&D.platform!=="linux"&&D.platform!=="sunos"||(D.platform="UNIX"),D.platform==="win32"&&(D.platform="DOS");var W=D.comment||this.comment||"";B=h.generateWorker(this,D,W)}catch(P){(B=new c("error")).error(P)}return new m(B,D.type||"string",D.mimeType)},generateAsync:function(I,B){return this.generateInternalStream(I).accumulate(B)},generateNodeStream:function(I,B){return(I=I||{}).type||(I.type="nodebuffer"),this.generateInternalStream(I).toNodejsStream(B)}};n.exports=A},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(t,n,i){n.exports=t("stream")},{stream:void 0}],17:[function(t,n,i){var r=t("./DataReader");function o(a){r.call(this,a);for(var c=0;c<this.data.length;c++)a[c]=255&a[c]}t("../utils").inherits(o,r),o.prototype.byteAt=function(a){return this.data[this.zero+a]},o.prototype.lastIndexOfSignature=function(a){for(var c=a.charCodeAt(0),m=a.charCodeAt(1),u=a.charCodeAt(2),w=a.charCodeAt(3),y=this.length-4;0<=y;--y)if(this.data[y]===c&&this.data[y+1]===m&&this.data[y+2]===u&&this.data[y+3]===w)return y-this.zero;return-1},o.prototype.readAndCheckSignature=function(a){var c=a.charCodeAt(0),m=a.charCodeAt(1),u=a.charCodeAt(2),w=a.charCodeAt(3),y=this.readData(4);return c===y[0]&&m===y[1]&&u===y[2]&&w===y[3]},o.prototype.readData=function(a){if(this.checkOffset(a),a===0)return[];var c=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,c},n.exports=o},{"../utils":32,"./DataReader":18}],18:[function(t,n,i){var r=t("../utils");function o(a){this.data=a,this.length=a.length,this.index=0,this.zero=0}o.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<this.zero+a||a<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(){},readInt:function(a){var c,m=0;for(this.checkOffset(a),c=this.index+a-1;c>=this.index;c--)m=(m<<8)+this.byteAt(c);return this.index+=a,m},readString:function(a){return r.transformTo("string",this.readData(a))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var a=this.readInt(4);return new Date(Date.UTC(1980+(a>>25&127),(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1))}},n.exports=o},{"../utils":32}],19:[function(t,n,i){var r=t("./Uint8ArrayReader");function o(a){r.call(this,a)}t("../utils").inherits(o,r),o.prototype.readData=function(a){this.checkOffset(a);var c=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,c},n.exports=o},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(t,n,i){var r=t("./DataReader");function o(a){r.call(this,a)}t("../utils").inherits(o,r),o.prototype.byteAt=function(a){return this.data.charCodeAt(this.zero+a)},o.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)-this.zero},o.prototype.readAndCheckSignature=function(a){return a===this.readData(4)},o.prototype.readData=function(a){this.checkOffset(a);var c=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,c},n.exports=o},{"../utils":32,"./DataReader":18}],21:[function(t,n,i){var r=t("./ArrayReader");function o(a){r.call(this,a)}t("../utils").inherits(o,r),o.prototype.readData=function(a){if(this.checkOffset(a),a===0)return new Uint8Array(0);var c=this.data.subarray(this.zero+this.index,this.zero+this.index+a);return this.index+=a,c},n.exports=o},{"../utils":32,"./ArrayReader":17}],22:[function(t,n,i){var r=t("../utils"),o=t("../support"),a=t("./ArrayReader"),c=t("./StringReader"),m=t("./NodeBufferReader"),u=t("./Uint8ArrayReader");n.exports=function(w){var y=r.getTypeOf(w);return r.checkSupport(y),y!=="string"||o.uint8array?y==="nodebuffer"?new m(w):o.uint8array?new u(r.transformTo("uint8array",w)):new a(r.transformTo("array",w)):new c(w)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(t,n,i){i.LOCAL_FILE_HEADER="PK",i.CENTRAL_FILE_HEADER="PK",i.CENTRAL_DIRECTORY_END="PK",i.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK\x07",i.ZIP64_CENTRAL_DIRECTORY_END="PK",i.DATA_DESCRIPTOR="PK\x07\b"},{}],24:[function(t,n,i){var r=t("./GenericWorker"),o=t("../utils");function a(c){r.call(this,"ConvertWorker to "+c),this.destType=c}o.inherits(a,r),a.prototype.processChunk=function(c){this.push({data:o.transformTo(this.destType,c.data),meta:c.meta})},n.exports=a},{"../utils":32,"./GenericWorker":28}],25:[function(t,n,i){var r=t("./GenericWorker"),o=t("../crc32");function a(){r.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}t("../utils").inherits(a,r),a.prototype.processChunk=function(c){this.streamInfo.crc32=o(c.data,this.streamInfo.crc32||0),this.push(c)},n.exports=a},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(t,n,i){var r=t("../utils"),o=t("./GenericWorker");function a(c){o.call(this,"DataLengthProbe for "+c),this.propName=c,this.withStreamInfo(c,0)}r.inherits(a,o),a.prototype.processChunk=function(c){if(c){var m=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=m+c.data.length}o.prototype.processChunk.call(this,c)},n.exports=a},{"../utils":32,"./GenericWorker":28}],27:[function(t,n,i){var r=t("../utils"),o=t("./GenericWorker");function a(c){o.call(this,"DataWorker");var m=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,c.then(function(u){m.dataIsReady=!0,m.data=u,m.max=u&&u.length||0,m.type=r.getTypeOf(u),m.isPaused||m._tickAndRepeat()},function(u){m.error(u)})}r.inherits(a,o),a.prototype.cleanUp=function(){o.prototype.cleanUp.call(this),this.data=null},a.prototype.resume=function(){return!!o.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,r.delay(this._tickAndRepeat,[],this)),!0)},a.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(r.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},a.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var c=null,m=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":c=this.data.substring(this.index,m);break;case"uint8array":c=this.data.subarray(this.index,m);break;case"array":case"nodebuffer":c=this.data.slice(this.index,m)}return this.index=m,this.push({data:c,meta:{percent:this.max?this.index/this.max*100:0}})},n.exports=a},{"../utils":32,"./GenericWorker":28}],28:[function(t,n,i){function r(o){this.name=o||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}r.prototype={push:function(o){this.emit("data",o)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(o){this.emit("error",o)}return!0},error:function(o){return!this.isFinished&&(this.isPaused?this.generatedError=o:(this.isFinished=!0,this.emit("error",o),this.previous&&this.previous.error(o),this.cleanUp()),!0)},on:function(o,a){return this._listeners[o].push(a),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(o,a){if(this._listeners[o])for(var c=0;c<this._listeners[o].length;c++)this._listeners[o][c].call(this,a)},pipe:function(o){return o.registerPrevious(this)},registerPrevious:function(o){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=o.streamInfo,this.mergeStreamInfo(),this.previous=o;var a=this;return o.on("data",function(c){a.processChunk(c)}),o.on("end",function(){a.end()}),o.on("error",function(c){a.error(c)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var o=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),o=!0),this.previous&&this.previous.resume(),!o},flush:function(){},processChunk:function(o){this.push(o)},withStreamInfo:function(o,a){return this.extraStreamInfo[o]=a,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var o in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,o)&&(this.streamInfo[o]=this.extraStreamInfo[o])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var o="Worker "+this.name;return this.previous?this.previous+" -> "+o:o}},n.exports=r},{}],29:[function(t,n,i){var r=t("../utils"),o=t("./ConvertWorker"),a=t("./GenericWorker"),c=t("../base64"),m=t("../support"),u=t("../external"),w=null;if(m.nodestream)try{w=t("../nodejs/NodejsStreamOutputAdapter")}catch{}function y(g,f){return new u.Promise(function(v,p){var _=[],S=g._internalType,A=g._outputType,I=g._mimeType;g.on("data",function(B,D){_.push(B),f&&f(D)}).on("error",function(B){_=[],p(B)}).on("end",function(){try{var B=function(D,W,P){switch(D){case"blob":return r.newBlob(r.transformTo("arraybuffer",W),P);case"base64":return c.encode(W);default:return r.transformTo(D,W)}}(A,function(D,W){var P,Z=0,J=null,k=0;for(P=0;P<W.length;P++)k+=W[P].length;switch(D){case"string":return W.join("");case"array":return Array.prototype.concat.apply([],W);case"uint8array":for(J=new Uint8Array(k),P=0;P<W.length;P++)J.set(W[P],Z),Z+=W[P].length;return J;case"nodebuffer":return Buffer.concat(W);default:throw new Error("concat : unsupported type '"+D+"'")}}(S,_),I);v(B)}catch(D){p(D)}_=[]}).resume()})}function h(g,f,v){var p=f;switch(f){case"blob":case"arraybuffer":p="uint8array";break;case"base64":p="string"}try{this._internalType=p,this._outputType=f,this._mimeType=v,r.checkSupport(p),this._worker=g.pipe(new o(p)),g.lock()}catch(_){this._worker=new a("error"),this._worker.error(_)}}h.prototype={accumulate:function(g){return y(this,g)},on:function(g,f){var v=this;return g==="data"?this._worker.on(g,function(p){f.call(v,p.data,p.meta)}):this._worker.on(g,function(){r.delay(f,arguments,v)}),this},resume:function(){return r.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(g){if(r.checkSupport("nodestream"),this._outputType!=="nodebuffer")throw new Error(this._outputType+" is not supported by this method");return new w(this,{objectMode:this._outputType!=="nodebuffer"},g)}},n.exports=h},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(t,n,i){if(i.base64=!0,i.array=!0,i.string=!0,i.arraybuffer=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u",i.nodebuffer=typeof Buffer<"u",i.uint8array=typeof Uint8Array<"u",typeof ArrayBuffer>"u")i.blob=!1;else{var r=new ArrayBuffer(0);try{i.blob=new Blob([r],{type:"application/zip"}).size===0}catch{try{var o=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);o.append(r),i.blob=o.getBlob("application/zip").size===0}catch{i.blob=!1}}}try{i.nodestream=!!t("readable-stream").Readable}catch{i.nodestream=!1}},{"readable-stream":16}],31:[function(t,n,i){for(var r=t("./utils"),o=t("./support"),a=t("./nodejsUtils"),c=t("./stream/GenericWorker"),m=new Array(256),u=0;u<256;u++)m[u]=252<=u?6:248<=u?5:240<=u?4:224<=u?3:192<=u?2:1;m[254]=m[254]=1;function w(){c.call(this,"utf-8 decode"),this.leftOver=null}function y(){c.call(this,"utf-8 encode")}i.utf8encode=function(h){return o.nodebuffer?a.newBufferFrom(h,"utf-8"):function(g){var f,v,p,_,S,A=g.length,I=0;for(_=0;_<A;_++)(64512&(v=g.charCodeAt(_)))==55296&&_+1<A&&(64512&(p=g.charCodeAt(_+1)))==56320&&(v=65536+(v-55296<<10)+(p-56320),_++),I+=v<128?1:v<2048?2:v<65536?3:4;for(f=o.uint8array?new Uint8Array(I):new Array(I),_=S=0;S<I;_++)(64512&(v=g.charCodeAt(_)))==55296&&_+1<A&&(64512&(p=g.charCodeAt(_+1)))==56320&&(v=65536+(v-55296<<10)+(p-56320),_++),v<128?f[S++]=v:(v<2048?f[S++]=192|v>>>6:(v<65536?f[S++]=224|v>>>12:(f[S++]=240|v>>>18,f[S++]=128|v>>>12&63),f[S++]=128|v>>>6&63),f[S++]=128|63&v);return f}(h)},i.utf8decode=function(h){return o.nodebuffer?r.transformTo("nodebuffer",h).toString("utf-8"):function(g){var f,v,p,_,S=g.length,A=new Array(2*S);for(f=v=0;f<S;)if((p=g[f++])<128)A[v++]=p;else if(4<(_=m[p]))A[v++]=65533,f+=_-1;else{for(p&=_===2?31:_===3?15:7;1<_&&f<S;)p=p<<6|63&g[f++],_--;1<_?A[v++]=65533:p<65536?A[v++]=p:(p-=65536,A[v++]=55296|p>>10&1023,A[v++]=56320|1023&p)}return A.length!==v&&(A.subarray?A=A.subarray(0,v):A.length=v),r.applyFromCharCode(A)}(h=r.transformTo(o.uint8array?"uint8array":"array",h))},r.inherits(w,c),w.prototype.processChunk=function(h){var g=r.transformTo(o.uint8array?"uint8array":"array",h.data);if(this.leftOver&&this.leftOver.length){if(o.uint8array){var f=g;(g=new Uint8Array(f.length+this.leftOver.length)).set(this.leftOver,0),g.set(f,this.leftOver.length)}else g=this.leftOver.concat(g);this.leftOver=null}var v=function(_,S){var A;for((S=S||_.length)>_.length&&(S=_.length),A=S-1;0<=A&&(192&_[A])==128;)A--;return A<0||A===0?S:A+m[_[A]]>S?A:S}(g),p=g;v!==g.length&&(o.uint8array?(p=g.subarray(0,v),this.leftOver=g.subarray(v,g.length)):(p=g.slice(0,v),this.leftOver=g.slice(v,g.length))),this.push({data:i.utf8decode(p),meta:h.meta})},w.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:i.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},i.Utf8DecodeWorker=w,r.inherits(y,c),y.prototype.processChunk=function(h){this.push({data:i.utf8encode(h.data),meta:h.meta})},i.Utf8EncodeWorker=y},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(t,n,i){var r=t("./support"),o=t("./base64"),a=t("./nodejsUtils"),c=t("./external");function m(f){return f}function u(f,v){for(var p=0;p<f.length;++p)v[p]=255&f.charCodeAt(p);return v}t("setimmediate"),i.newBlob=function(f,v){i.checkSupport("blob");try{return new Blob([f],{type:v})}catch{try{var p=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return p.append(f),p.getBlob(v)}catch{throw new Error("Bug : can't construct the Blob.")}}};var w={stringifyByChunk:function(f,v,p){var _=[],S=0,A=f.length;if(A<=p)return String.fromCharCode.apply(null,f);for(;S<A;)v==="array"||v==="nodebuffer"?_.push(String.fromCharCode.apply(null,f.slice(S,Math.min(S+p,A)))):_.push(String.fromCharCode.apply(null,f.subarray(S,Math.min(S+p,A)))),S+=p;return _.join("")},stringifyByChar:function(f){for(var v="",p=0;p<f.length;p++)v+=String.fromCharCode(f[p]);return v},applyCanBeUsed:{uint8array:function(){try{return r.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch{return!1}}(),nodebuffer:function(){try{return r.nodebuffer&&String.fromCharCode.apply(null,a.allocBuffer(1)).length===1}catch{return!1}}()}};function y(f){var v=65536,p=i.getTypeOf(f),_=!0;if(p==="uint8array"?_=w.applyCanBeUsed.uint8array:p==="nodebuffer"&&(_=w.applyCanBeUsed.nodebuffer),_)for(;1<v;)try{return w.stringifyByChunk(f,p,v)}catch{v=Math.floor(v/2)}return w.stringifyByChar(f)}function h(f,v){for(var p=0;p<f.length;p++)v[p]=f[p];return v}i.applyFromCharCode=y;var g={};g.string={string:m,array:function(f){return u(f,new Array(f.length))},arraybuffer:function(f){return g.string.uint8array(f).buffer},uint8array:function(f){return u(f,new Uint8Array(f.length))},nodebuffer:function(f){return u(f,a.allocBuffer(f.length))}},g.array={string:y,array:m,arraybuffer:function(f){return new Uint8Array(f).buffer},uint8array:function(f){return new Uint8Array(f)},nodebuffer:function(f){return a.newBufferFrom(f)}},g.arraybuffer={string:function(f){return y(new Uint8Array(f))},array:function(f){return h(new Uint8Array(f),new Array(f.byteLength))},arraybuffer:m,uint8array:function(f){return new Uint8Array(f)},nodebuffer:function(f){return a.newBufferFrom(new Uint8Array(f))}},g.uint8array={string:y,array:function(f){return h(f,new Array(f.length))},arraybuffer:function(f){return f.buffer},uint8array:m,nodebuffer:function(f){return a.newBufferFrom(f)}},g.nodebuffer={string:y,array:function(f){return h(f,new Array(f.length))},arraybuffer:function(f){return g.nodebuffer.uint8array(f).buffer},uint8array:function(f){return h(f,new Uint8Array(f.length))},nodebuffer:m},i.transformTo=function(f,v){if(v=v||"",!f)return v;i.checkSupport(f);var p=i.getTypeOf(v);return g[p][f](v)},i.resolve=function(f){for(var v=f.split("/"),p=[],_=0;_<v.length;_++){var S=v[_];S==="."||S===""&&_!==0&&_!==v.length-1||(S===".."?p.pop():p.push(S))}return p.join("/")},i.getTypeOf=function(f){return typeof f=="string"?"string":Object.prototype.toString.call(f)==="[object Array]"?"array":r.nodebuffer&&a.isBuffer(f)?"nodebuffer":r.uint8array&&f instanceof Uint8Array?"uint8array":r.arraybuffer&&f instanceof ArrayBuffer?"arraybuffer":void 0},i.checkSupport=function(f){if(!r[f.toLowerCase()])throw new Error(f+" is not supported by this platform")},i.MAX_VALUE_16BITS=65535,i.MAX_VALUE_32BITS=-1,i.pretty=function(f){var v,p,_="";for(p=0;p<(f||"").length;p++)_+="\\x"+((v=f.charCodeAt(p))<16?"0":"")+v.toString(16).toUpperCase();return _},i.delay=function(f,v,p){setImmediate(function(){f.apply(p||null,v||[])})},i.inherits=function(f,v){function p(){}p.prototype=v.prototype,f.prototype=new p},i.extend=function(){var f,v,p={};for(f=0;f<arguments.length;f++)for(v in arguments[f])Object.prototype.hasOwnProperty.call(arguments[f],v)&&p[v]===void 0&&(p[v]=arguments[f][v]);return p},i.prepareContent=function(f,v,p,_,S){return c.Promise.resolve(v).then(function(A){return r.blob&&(A instanceof Blob||["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(A))!==-1)&&typeof FileReader<"u"?new c.Promise(function(I,B){var D=new FileReader;D.onload=function(W){I(W.target.result)},D.onerror=function(W){B(W.target.error)},D.readAsArrayBuffer(A)}):A}).then(function(A){var I=i.getTypeOf(A);return I?(I==="arraybuffer"?A=i.transformTo("uint8array",A):I==="string"&&(S?A=o.decode(A):p&&_!==!0&&(A=function(B){return u(B,r.uint8array?new Uint8Array(B.length):new Array(B.length))}(A))),A):c.Promise.reject(new Error("Can't read the data of '"+f+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(t,n,i){var r=t("./reader/readerFor"),o=t("./utils"),a=t("./signature"),c=t("./zipEntry"),m=t("./support");function u(w){this.files=[],this.loadOptions=w}u.prototype={checkSignature:function(w){if(!this.reader.readAndCheckSignature(w)){this.reader.index-=4;var y=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+o.pretty(y)+", expected "+o.pretty(w)+")")}},isSignature:function(w,y){var h=this.reader.index;this.reader.setIndex(w);var g=this.reader.readString(4)===y;return this.reader.setIndex(h),g},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var w=this.reader.readData(this.zipCommentLength),y=m.uint8array?"uint8array":"array",h=o.transformTo(y,w);this.zipComment=this.loadOptions.decodeFileName(h)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var w,y,h,g=this.zip64EndOfCentralSize-44;0<g;)w=this.reader.readInt(2),y=this.reader.readInt(4),h=this.reader.readData(y),this.zip64ExtensibleData[w]={id:w,length:y,value:h}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var w,y;for(w=0;w<this.files.length;w++)y=this.files[w],this.reader.setIndex(y.localHeaderOffset),this.checkSignature(a.LOCAL_FILE_HEADER),y.readLocalPart(this.reader),y.handleUTF8(),y.processAttributes()},readCentralDir:function(){var w;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER);)(w=new c({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(w);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var w=this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);if(w<0)throw this.isSignature(0,a.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(w);var y=w;if(this.checkSignature(a.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===o.MAX_VALUE_16BITS||this.diskWithCentralDirStart===o.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===o.MAX_VALUE_16BITS||this.centralDirRecords===o.MAX_VALUE_16BITS||this.centralDirSize===o.MAX_VALUE_32BITS||this.centralDirOffset===o.MAX_VALUE_32BITS){if(this.zip64=!0,(w=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(w),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,a.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var h=this.centralDirOffset+this.centralDirSize;this.zip64&&(h+=20,h+=12+this.zip64EndOfCentralSize);var g=y-h;if(0<g)this.isSignature(y,a.CENTRAL_FILE_HEADER)||(this.reader.zero=g);else if(g<0)throw new Error("Corrupted zip: missing "+Math.abs(g)+" bytes.")},prepareReader:function(w){this.reader=r(w)},load:function(w){this.prepareReader(w),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},n.exports=u},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(t,n,i){var r=t("./reader/readerFor"),o=t("./utils"),a=t("./compressedObject"),c=t("./crc32"),m=t("./utf8"),u=t("./compressions"),w=t("./support");function y(h,g){this.options=h,this.loadOptions=g}y.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(h){var g,f;if(h.skip(22),this.fileNameLength=h.readInt(2),f=h.readInt(2),this.fileName=h.readData(this.fileNameLength),h.skip(f),this.compressedSize===-1||this.uncompressedSize===-1)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if((g=function(v){for(var p in u)if(Object.prototype.hasOwnProperty.call(u,p)&&u[p].magic===v)return u[p];return null}(this.compressionMethod))===null)throw new Error("Corrupted zip : compression "+o.pretty(this.compressionMethod)+" unknown (inner file : "+o.transformTo("string",this.fileName)+")");this.decompressed=new a(this.compressedSize,this.uncompressedSize,this.crc32,g,h.readData(this.compressedSize))},readCentralPart:function(h){this.versionMadeBy=h.readInt(2),h.skip(2),this.bitFlag=h.readInt(2),this.compressionMethod=h.readString(2),this.date=h.readDate(),this.crc32=h.readInt(4),this.compressedSize=h.readInt(4),this.uncompressedSize=h.readInt(4);var g=h.readInt(2);if(this.extraFieldsLength=h.readInt(2),this.fileCommentLength=h.readInt(2),this.diskNumberStart=h.readInt(2),this.internalFileAttributes=h.readInt(2),this.externalFileAttributes=h.readInt(4),this.localHeaderOffset=h.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");h.skip(g),this.readExtraFields(h),this.parseZIP64ExtraField(h),this.fileComment=h.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var h=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),h==0&&(this.dosPermissions=63&this.externalFileAttributes),h==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!=="/"||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var h=r(this.extraFields[1].value);this.uncompressedSize===o.MAX_VALUE_32BITS&&(this.uncompressedSize=h.readInt(8)),this.compressedSize===o.MAX_VALUE_32BITS&&(this.compressedSize=h.readInt(8)),this.localHeaderOffset===o.MAX_VALUE_32BITS&&(this.localHeaderOffset=h.readInt(8)),this.diskNumberStart===o.MAX_VALUE_32BITS&&(this.diskNumberStart=h.readInt(4))}},readExtraFields:function(h){var g,f,v,p=h.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});h.index+4<p;)g=h.readInt(2),f=h.readInt(2),v=h.readData(f),this.extraFields[g]={id:g,length:f,value:v};h.setIndex(p)},handleUTF8:function(){var h=w.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=m.utf8decode(this.fileName),this.fileCommentStr=m.utf8decode(this.fileComment);else{var g=this.findExtraFieldUnicodePath();if(g!==null)this.fileNameStr=g;else{var f=o.transformTo(h,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(f)}var v=this.findExtraFieldUnicodeComment();if(v!==null)this.fileCommentStr=v;else{var p=o.transformTo(h,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(p)}}},findExtraFieldUnicodePath:function(){var h=this.extraFields[28789];if(h){var g=r(h.value);return g.readInt(1)!==1||c(this.fileName)!==g.readInt(4)?null:m.utf8decode(g.readData(h.length-5))}return null},findExtraFieldUnicodeComment:function(){var h=this.extraFields[25461];if(h){var g=r(h.value);return g.readInt(1)!==1||c(this.fileComment)!==g.readInt(4)?null:m.utf8decode(g.readData(h.length-5))}return null}},n.exports=y},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(t,n,i){function r(g,f,v){this.name=g,this.dir=v.dir,this.date=v.date,this.comment=v.comment,this.unixPermissions=v.unixPermissions,this.dosPermissions=v.dosPermissions,this._data=f,this._dataBinary=v.binary,this.options={compression:v.compression,compressionOptions:v.compressionOptions}}var o=t("./stream/StreamHelper"),a=t("./stream/DataWorker"),c=t("./utf8"),m=t("./compressedObject"),u=t("./stream/GenericWorker");r.prototype={internalStream:function(g){var f=null,v="string";try{if(!g)throw new Error("No output type specified.");var p=(v=g.toLowerCase())==="string"||v==="text";v!=="binarystring"&&v!=="text"||(v="string"),f=this._decompressWorker();var _=!this._dataBinary;_&&!p&&(f=f.pipe(new c.Utf8EncodeWorker)),!_&&p&&(f=f.pipe(new c.Utf8DecodeWorker))}catch(S){(f=new u("error")).error(S)}return new o(f,v,"")},async:function(g,f){return this.internalStream(g).accumulate(f)},nodeStream:function(g,f){return this.internalStream(g||"nodebuffer").toNodejsStream(f)},_compressWorker:function(g,f){if(this._data instanceof m&&this._data.compression.magic===g.magic)return this._data.getCompressedWorker();var v=this._decompressWorker();return this._dataBinary||(v=v.pipe(new c.Utf8EncodeWorker)),m.createWorkerFrom(v,g,f)},_decompressWorker:function(){return this._data instanceof m?this._data.getContentWorker():this._data instanceof u?this._data:new a(this._data)}};for(var w=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],y=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},h=0;h<w.length;h++)r.prototype[w[h]]=y;n.exports=r},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(t,n,i){(function(r){var o,a,c=r.MutationObserver||r.WebKitMutationObserver;if(c){var m=0,u=new c(g),w=r.document.createTextNode("");u.observe(w,{characterData:!0}),o=function(){w.data=m=++m%2}}else if(r.setImmediate||r.MessageChannel===void 0)o="document"in r&&"onreadystatechange"in r.document.createElement("script")?function(){var f=r.document.createElement("script");f.onreadystatechange=function(){g(),f.onreadystatechange=null,f.parentNode.removeChild(f),f=null},r.document.documentElement.appendChild(f)}:function(){setTimeout(g,0)};else{var y=new r.MessageChannel;y.port1.onmessage=g,o=function(){y.port2.postMessage(0)}}var h=[];function g(){var f,v;a=!0;for(var p=h.length;p;){for(v=h,h=[],f=-1;++f<p;)v[f]();p=h.length}a=!1}n.exports=function(f){h.push(f)!==1||a||o()}}).call(this,typeof $t<"u"?$t:typeof self<"u"?self:typeof window<"u"?window:{})},{}],37:[function(t,n,i){var r=t("immediate");function o(){}var a={},c=["REJECTED"],m=["FULFILLED"],u=["PENDING"];function w(p){if(typeof p!="function")throw new TypeError("resolver must be a function");this.state=u,this.queue=[],this.outcome=void 0,p!==o&&f(this,p)}function y(p,_,S){this.promise=p,typeof _=="function"&&(this.onFulfilled=_,this.callFulfilled=this.otherCallFulfilled),typeof S=="function"&&(this.onRejected=S,this.callRejected=this.otherCallRejected)}function h(p,_,S){r(function(){var A;try{A=_(S)}catch(I){return a.reject(p,I)}A===p?a.reject(p,new TypeError("Cannot resolve promise with itself")):a.resolve(p,A)})}function g(p){var _=p&&p.then;if(p&&(typeof p=="object"||typeof p=="function")&&typeof _=="function")return function(){_.apply(p,arguments)}}function f(p,_){var S=!1;function A(D){S||(S=!0,a.reject(p,D))}function I(D){S||(S=!0,a.resolve(p,D))}var B=v(function(){_(I,A)});B.status==="error"&&A(B.value)}function v(p,_){var S={};try{S.value=p(_),S.status="success"}catch(A){S.status="error",S.value=A}return S}(n.exports=w).prototype.finally=function(p){if(typeof p!="function")return this;var _=this.constructor;return this.then(function(S){return _.resolve(p()).then(function(){return S})},function(S){return _.resolve(p()).then(function(){throw S})})},w.prototype.catch=function(p){return this.then(null,p)},w.prototype.then=function(p,_){if(typeof p!="function"&&this.state===m||typeof _!="function"&&this.state===c)return this;var S=new this.constructor(o);return this.state!==u?h(S,this.state===m?p:_,this.outcome):this.queue.push(new y(S,p,_)),S},y.prototype.callFulfilled=function(p){a.resolve(this.promise,p)},y.prototype.otherCallFulfilled=function(p){h(this.promise,this.onFulfilled,p)},y.prototype.callRejected=function(p){a.reject(this.promise,p)},y.prototype.otherCallRejected=function(p){h(this.promise,this.onRejected,p)},a.resolve=function(p,_){var S=v(g,_);if(S.status==="error")return a.reject(p,S.value);var A=S.value;if(A)f(p,A);else{p.state=m,p.outcome=_;for(var I=-1,B=p.queue.length;++I<B;)p.queue[I].callFulfilled(_)}return p},a.reject=function(p,_){p.state=c,p.outcome=_;for(var S=-1,A=p.queue.length;++S<A;)p.queue[S].callRejected(_);return p},w.resolve=function(p){return p instanceof this?p:a.resolve(new this(o),p)},w.reject=function(p){var _=new this(o);return a.reject(_,p)},w.all=function(p){var _=this;if(Object.prototype.toString.call(p)!=="[object Array]")return this.reject(new TypeError("must be an array"));var S=p.length,A=!1;if(!S)return this.resolve([]);for(var I=new Array(S),B=0,D=-1,W=new this(o);++D<S;)P(p[D],D);return W;function P(Z,J){_.resolve(Z).then(function(k){I[J]=k,++B!==S||A||(A=!0,a.resolve(W,I))},function(k){A||(A=!0,a.reject(W,k))})}},w.race=function(p){var _=this;if(Object.prototype.toString.call(p)!=="[object Array]")return this.reject(new TypeError("must be an array"));var S=p.length,A=!1;if(!S)return this.resolve([]);for(var I=-1,B=new this(o);++I<S;)D=p[I],_.resolve(D).then(function(W){A||(A=!0,a.resolve(B,W))},function(W){A||(A=!0,a.reject(B,W))});var D;return B}},{immediate:36}],38:[function(t,n,i){var r={};(0,t("./lib/utils/common").assign)(r,t("./lib/deflate"),t("./lib/inflate"),t("./lib/zlib/constants")),n.exports=r},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(t,n,i){var r=t("./zlib/deflate"),o=t("./utils/common"),a=t("./utils/strings"),c=t("./zlib/messages"),m=t("./zlib/zstream"),u=Object.prototype.toString,w=0,y=-1,h=0,g=8;function f(p){if(!(this instanceof f))return new f(p);this.options=o.assign({level:y,method:g,chunkSize:16384,windowBits:15,memLevel:8,strategy:h,to:""},p||{});var _=this.options;_.raw&&0<_.windowBits?_.windowBits=-_.windowBits:_.gzip&&0<_.windowBits&&_.windowBits<16&&(_.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new m,this.strm.avail_out=0;var S=r.deflateInit2(this.strm,_.level,_.method,_.windowBits,_.memLevel,_.strategy);if(S!==w)throw new Error(c[S]);if(_.header&&r.deflateSetHeader(this.strm,_.header),_.dictionary){var A;if(A=typeof _.dictionary=="string"?a.string2buf(_.dictionary):u.call(_.dictionary)==="[object ArrayBuffer]"?new Uint8Array(_.dictionary):_.dictionary,(S=r.deflateSetDictionary(this.strm,A))!==w)throw new Error(c[S]);this._dict_set=!0}}function v(p,_){var S=new f(_);if(S.push(p,!0),S.err)throw S.msg||c[S.err];return S.result}f.prototype.push=function(p,_){var S,A,I=this.strm,B=this.options.chunkSize;if(this.ended)return!1;A=_===~~_?_:_===!0?4:0,typeof p=="string"?I.input=a.string2buf(p):u.call(p)==="[object ArrayBuffer]"?I.input=new Uint8Array(p):I.input=p,I.next_in=0,I.avail_in=I.input.length;do{if(I.avail_out===0&&(I.output=new o.Buf8(B),I.next_out=0,I.avail_out=B),(S=r.deflate(I,A))!==1&&S!==w)return this.onEnd(S),!(this.ended=!0);I.avail_out!==0&&(I.avail_in!==0||A!==4&&A!==2)||(this.options.to==="string"?this.onData(a.buf2binstring(o.shrinkBuf(I.output,I.next_out))):this.onData(o.shrinkBuf(I.output,I.next_out)))}while((0<I.avail_in||I.avail_out===0)&&S!==1);return A===4?(S=r.deflateEnd(this.strm),this.onEnd(S),this.ended=!0,S===w):A!==2||(this.onEnd(w),!(I.avail_out=0))},f.prototype.onData=function(p){this.chunks.push(p)},f.prototype.onEnd=function(p){p===w&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=p,this.msg=this.strm.msg},i.Deflate=f,i.deflate=v,i.deflateRaw=function(p,_){return(_=_||{}).raw=!0,v(p,_)},i.gzip=function(p,_){return(_=_||{}).gzip=!0,v(p,_)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(t,n,i){var r=t("./zlib/inflate"),o=t("./utils/common"),a=t("./utils/strings"),c=t("./zlib/constants"),m=t("./zlib/messages"),u=t("./zlib/zstream"),w=t("./zlib/gzheader"),y=Object.prototype.toString;function h(f){if(!(this instanceof h))return new h(f);this.options=o.assign({chunkSize:16384,windowBits:0,to:""},f||{});var v=this.options;v.raw&&0<=v.windowBits&&v.windowBits<16&&(v.windowBits=-v.windowBits,v.windowBits===0&&(v.windowBits=-15)),!(0<=v.windowBits&&v.windowBits<16)||f&&f.windowBits||(v.windowBits+=32),15<v.windowBits&&v.windowBits<48&&(15&v.windowBits)==0&&(v.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new u,this.strm.avail_out=0;var p=r.inflateInit2(this.strm,v.windowBits);if(p!==c.Z_OK)throw new Error(m[p]);this.header=new w,r.inflateGetHeader(this.strm,this.header)}function g(f,v){var p=new h(v);if(p.push(f,!0),p.err)throw p.msg||m[p.err];return p.result}h.prototype.push=function(f,v){var p,_,S,A,I,B,D=this.strm,W=this.options.chunkSize,P=this.options.dictionary,Z=!1;if(this.ended)return!1;_=v===~~v?v:v===!0?c.Z_FINISH:c.Z_NO_FLUSH,typeof f=="string"?D.input=a.binstring2buf(f):y.call(f)==="[object ArrayBuffer]"?D.input=new Uint8Array(f):D.input=f,D.next_in=0,D.avail_in=D.input.length;do{if(D.avail_out===0&&(D.output=new o.Buf8(W),D.next_out=0,D.avail_out=W),(p=r.inflate(D,c.Z_NO_FLUSH))===c.Z_NEED_DICT&&P&&(B=typeof P=="string"?a.string2buf(P):y.call(P)==="[object ArrayBuffer]"?new Uint8Array(P):P,p=r.inflateSetDictionary(this.strm,B)),p===c.Z_BUF_ERROR&&Z===!0&&(p=c.Z_OK,Z=!1),p!==c.Z_STREAM_END&&p!==c.Z_OK)return this.onEnd(p),!(this.ended=!0);D.next_out&&(D.avail_out!==0&&p!==c.Z_STREAM_END&&(D.avail_in!==0||_!==c.Z_FINISH&&_!==c.Z_SYNC_FLUSH)||(this.options.to==="string"?(S=a.utf8border(D.output,D.next_out),A=D.next_out-S,I=a.buf2string(D.output,S),D.next_out=A,D.avail_out=W-A,A&&o.arraySet(D.output,D.output,S,A,0),this.onData(I)):this.onData(o.shrinkBuf(D.output,D.next_out)))),D.avail_in===0&&D.avail_out===0&&(Z=!0)}while((0<D.avail_in||D.avail_out===0)&&p!==c.Z_STREAM_END);return p===c.Z_STREAM_END&&(_=c.Z_FINISH),_===c.Z_FINISH?(p=r.inflateEnd(this.strm),this.onEnd(p),this.ended=!0,p===c.Z_OK):_!==c.Z_SYNC_FLUSH||(this.onEnd(c.Z_OK),!(D.avail_out=0))},h.prototype.onData=function(f){this.chunks.push(f)},h.prototype.onEnd=function(f){f===c.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=f,this.msg=this.strm.msg},i.Inflate=h,i.inflate=g,i.inflateRaw=function(f,v){return(v=v||{}).raw=!0,g(f,v)},i.ungzip=g},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(t,n,i){var r=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Int32Array<"u";i.assign=function(c){for(var m=Array.prototype.slice.call(arguments,1);m.length;){var u=m.shift();if(u){if(typeof u!="object")throw new TypeError(u+"must be non-object");for(var w in u)u.hasOwnProperty(w)&&(c[w]=u[w])}}return c},i.shrinkBuf=function(c,m){return c.length===m?c:c.subarray?c.subarray(0,m):(c.length=m,c)};var o={arraySet:function(c,m,u,w,y){if(m.subarray&&c.subarray)c.set(m.subarray(u,u+w),y);else for(var h=0;h<w;h++)c[y+h]=m[u+h]},flattenChunks:function(c){var m,u,w,y,h,g;for(m=w=0,u=c.length;m<u;m++)w+=c[m].length;for(g=new Uint8Array(w),m=y=0,u=c.length;m<u;m++)h=c[m],g.set(h,y),y+=h.length;return g}},a={arraySet:function(c,m,u,w,y){for(var h=0;h<w;h++)c[y+h]=m[u+h]},flattenChunks:function(c){return[].concat.apply([],c)}};i.setTyped=function(c){c?(i.Buf8=Uint8Array,i.Buf16=Uint16Array,i.Buf32=Int32Array,i.assign(i,o)):(i.Buf8=Array,i.Buf16=Array,i.Buf32=Array,i.assign(i,a))},i.setTyped(r)},{}],42:[function(t,n,i){var r=t("./common"),o=!0,a=!0;try{String.fromCharCode.apply(null,[0])}catch{o=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{a=!1}for(var c=new r.Buf8(256),m=0;m<256;m++)c[m]=252<=m?6:248<=m?5:240<=m?4:224<=m?3:192<=m?2:1;function u(w,y){if(y<65537&&(w.subarray&&a||!w.subarray&&o))return String.fromCharCode.apply(null,r.shrinkBuf(w,y));for(var h="",g=0;g<y;g++)h+=String.fromCharCode(w[g]);return h}c[254]=c[254]=1,i.string2buf=function(w){var y,h,g,f,v,p=w.length,_=0;for(f=0;f<p;f++)(64512&(h=w.charCodeAt(f)))==55296&&f+1<p&&(64512&(g=w.charCodeAt(f+1)))==56320&&(h=65536+(h-55296<<10)+(g-56320),f++),_+=h<128?1:h<2048?2:h<65536?3:4;for(y=new r.Buf8(_),f=v=0;v<_;f++)(64512&(h=w.charCodeAt(f)))==55296&&f+1<p&&(64512&(g=w.charCodeAt(f+1)))==56320&&(h=65536+(h-55296<<10)+(g-56320),f++),h<128?y[v++]=h:(h<2048?y[v++]=192|h>>>6:(h<65536?y[v++]=224|h>>>12:(y[v++]=240|h>>>18,y[v++]=128|h>>>12&63),y[v++]=128|h>>>6&63),y[v++]=128|63&h);return y},i.buf2binstring=function(w){return u(w,w.length)},i.binstring2buf=function(w){for(var y=new r.Buf8(w.length),h=0,g=y.length;h<g;h++)y[h]=w.charCodeAt(h);return y},i.buf2string=function(w,y){var h,g,f,v,p=y||w.length,_=new Array(2*p);for(h=g=0;h<p;)if((f=w[h++])<128)_[g++]=f;else if(4<(v=c[f]))_[g++]=65533,h+=v-1;else{for(f&=v===2?31:v===3?15:7;1<v&&h<p;)f=f<<6|63&w[h++],v--;1<v?_[g++]=65533:f<65536?_[g++]=f:(f-=65536,_[g++]=55296|f>>10&1023,_[g++]=56320|1023&f)}return u(_,g)},i.utf8border=function(w,y){var h;for((y=y||w.length)>w.length&&(y=w.length),h=y-1;0<=h&&(192&w[h])==128;)h--;return h<0||h===0?y:h+c[w[h]]>y?h:y}},{"./common":41}],43:[function(t,n,i){n.exports=function(r,o,a,c){for(var m=65535&r|0,u=r>>>16&65535|0,w=0;a!==0;){for(a-=w=2e3<a?2e3:a;u=u+(m=m+o[c++]|0)|0,--w;);m%=65521,u%=65521}return m|u<<16|0}},{}],44:[function(t,n,i){n.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(t,n,i){var r=function(){for(var o,a=[],c=0;c<256;c++){o=c;for(var m=0;m<8;m++)o=1&o?3988292384^o>>>1:o>>>1;a[c]=o}return a}();n.exports=function(o,a,c,m){var u=r,w=m+c;o^=-1;for(var y=m;y<w;y++)o=o>>>8^u[255&(o^a[y])];return-1^o}},{}],46:[function(t,n,i){var r,o=t("../utils/common"),a=t("./trees"),c=t("./adler32"),m=t("./crc32"),u=t("./messages"),w=0,y=4,h=0,g=-2,f=-1,v=4,p=2,_=8,S=9,A=286,I=30,B=19,D=2*A+1,W=15,P=3,Z=258,J=Z+P+1,k=42,T=113,d=1,j=2,tt=3,U=4;function et(l,R){return l.msg=u[R],R}function G(l){return(l<<1)-(4<l?9:0)}function Q(l){for(var R=l.length;0<=--R;)l[R]=0}function M(l){var R=l.state,z=R.pending;z>l.avail_out&&(z=l.avail_out),z!==0&&(o.arraySet(l.output,R.pending_buf,R.pending_out,z,l.next_out),l.next_out+=z,R.pending_out+=z,l.total_out+=z,l.avail_out-=z,R.pending-=z,R.pending===0&&(R.pending_out=0))}function O(l,R){a._tr_flush_block(l,0<=l.block_start?l.block_start:-1,l.strstart-l.block_start,R),l.block_start=l.strstart,M(l.strm)}function K(l,R){l.pending_buf[l.pending++]=R}function V(l,R){l.pending_buf[l.pending++]=R>>>8&255,l.pending_buf[l.pending++]=255&R}function $(l,R){var z,b,x=l.max_chain_length,E=l.strstart,F=l.prev_length,L=l.nice_match,C=l.strstart>l.w_size-J?l.strstart-(l.w_size-J):0,q=l.window,Y=l.w_mask,H=l.prev,X=l.strstart+Z,st=q[E+F-1],rt=q[E+F];l.prev_length>=l.good_match&&(x>>=2),L>l.lookahead&&(L=l.lookahead);do if(q[(z=R)+F]===rt&&q[z+F-1]===st&&q[z]===q[E]&&q[++z]===q[E+1]){E+=2,z++;do;while(q[++E]===q[++z]&&q[++E]===q[++z]&&q[++E]===q[++z]&&q[++E]===q[++z]&&q[++E]===q[++z]&&q[++E]===q[++z]&&q[++E]===q[++z]&&q[++E]===q[++z]&&E<X);if(b=Z-(X-E),E=X-Z,F<b){if(l.match_start=R,L<=(F=b))break;st=q[E+F-1],rt=q[E+F]}}while((R=H[R&Y])>C&&--x!=0);return F<=l.lookahead?F:l.lookahead}function ht(l){var R,z,b,x,E,F,L,C,q,Y,H=l.w_size;do{if(x=l.window_size-l.lookahead-l.strstart,l.strstart>=H+(H-J)){for(o.arraySet(l.window,l.window,H,H,0),l.match_start-=H,l.strstart-=H,l.block_start-=H,R=z=l.hash_size;b=l.head[--R],l.head[R]=H<=b?b-H:0,--z;);for(R=z=H;b=l.prev[--R],l.prev[R]=H<=b?b-H:0,--z;);x+=H}if(l.strm.avail_in===0)break;if(F=l.strm,L=l.window,C=l.strstart+l.lookahead,q=x,Y=void 0,Y=F.avail_in,q<Y&&(Y=q),z=Y===0?0:(F.avail_in-=Y,o.arraySet(L,F.input,F.next_in,Y,C),F.state.wrap===1?F.adler=c(F.adler,L,Y,C):F.state.wrap===2&&(F.adler=m(F.adler,L,Y,C)),F.next_in+=Y,F.total_in+=Y,Y),l.lookahead+=z,l.lookahead+l.insert>=P)for(E=l.strstart-l.insert,l.ins_h=l.window[E],l.ins_h=(l.ins_h<<l.hash_shift^l.window[E+1])&l.hash_mask;l.insert&&(l.ins_h=(l.ins_h<<l.hash_shift^l.window[E+P-1])&l.hash_mask,l.prev[E&l.w_mask]=l.head[l.ins_h],l.head[l.ins_h]=E,E++,l.insert--,!(l.lookahead+l.insert<P)););}while(l.lookahead<J&&l.strm.avail_in!==0)}function mt(l,R){for(var z,b;;){if(l.lookahead<J){if(ht(l),l.lookahead<J&&R===w)return d;if(l.lookahead===0)break}if(z=0,l.lookahead>=P&&(l.ins_h=(l.ins_h<<l.hash_shift^l.window[l.strstart+P-1])&l.hash_mask,z=l.prev[l.strstart&l.w_mask]=l.head[l.ins_h],l.head[l.ins_h]=l.strstart),z!==0&&l.strstart-z<=l.w_size-J&&(l.match_length=$(l,z)),l.match_length>=P)if(b=a._tr_tally(l,l.strstart-l.match_start,l.match_length-P),l.lookahead-=l.match_length,l.match_length<=l.max_lazy_match&&l.lookahead>=P){for(l.match_length--;l.strstart++,l.ins_h=(l.ins_h<<l.hash_shift^l.window[l.strstart+P-1])&l.hash_mask,z=l.prev[l.strstart&l.w_mask]=l.head[l.ins_h],l.head[l.ins_h]=l.strstart,--l.match_length!=0;);l.strstart++}else l.strstart+=l.match_length,l.match_length=0,l.ins_h=l.window[l.strstart],l.ins_h=(l.ins_h<<l.hash_shift^l.window[l.strstart+1])&l.hash_mask;else b=a._tr_tally(l,0,l.window[l.strstart]),l.lookahead--,l.strstart++;if(b&&(O(l,!1),l.strm.avail_out===0))return d}return l.insert=l.strstart<P-1?l.strstart:P-1,R===y?(O(l,!0),l.strm.avail_out===0?tt:U):l.last_lit&&(O(l,!1),l.strm.avail_out===0)?d:j}function nt(l,R){for(var z,b,x;;){if(l.lookahead<J){if(ht(l),l.lookahead<J&&R===w)return d;if(l.lookahead===0)break}if(z=0,l.lookahead>=P&&(l.ins_h=(l.ins_h<<l.hash_shift^l.window[l.strstart+P-1])&l.hash_mask,z=l.prev[l.strstart&l.w_mask]=l.head[l.ins_h],l.head[l.ins_h]=l.strstart),l.prev_length=l.match_length,l.prev_match=l.match_start,l.match_length=P-1,z!==0&&l.prev_length<l.max_lazy_match&&l.strstart-z<=l.w_size-J&&(l.match_length=$(l,z),l.match_length<=5&&(l.strategy===1||l.match_length===P&&4096<l.strstart-l.match_start)&&(l.match_length=P-1)),l.prev_length>=P&&l.match_length<=l.prev_length){for(x=l.strstart+l.lookahead-P,b=a._tr_tally(l,l.strstart-1-l.prev_match,l.prev_length-P),l.lookahead-=l.prev_length-1,l.prev_length-=2;++l.strstart<=x&&(l.ins_h=(l.ins_h<<l.hash_shift^l.window[l.strstart+P-1])&l.hash_mask,z=l.prev[l.strstart&l.w_mask]=l.head[l.ins_h],l.head[l.ins_h]=l.strstart),--l.prev_length!=0;);if(l.match_available=0,l.match_length=P-1,l.strstart++,b&&(O(l,!1),l.strm.avail_out===0))return d}else if(l.match_available){if((b=a._tr_tally(l,0,l.window[l.strstart-1]))&&O(l,!1),l.strstart++,l.lookahead--,l.strm.avail_out===0)return d}else l.match_available=1,l.strstart++,l.lookahead--}return l.match_available&&(b=a._tr_tally(l,0,l.window[l.strstart-1]),l.match_available=0),l.insert=l.strstart<P-1?l.strstart:P-1,R===y?(O(l,!0),l.strm.avail_out===0?tt:U):l.last_lit&&(O(l,!1),l.strm.avail_out===0)?d:j}function it(l,R,z,b,x){this.good_length=l,this.max_lazy=R,this.nice_length=z,this.max_chain=b,this.func=x}function pt(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=_,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new o.Buf16(2*D),this.dyn_dtree=new o.Buf16(2*(2*I+1)),this.bl_tree=new o.Buf16(2*(2*B+1)),Q(this.dyn_ltree),Q(this.dyn_dtree),Q(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new o.Buf16(W+1),this.heap=new o.Buf16(2*A+1),Q(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new o.Buf16(2*A+1),Q(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function dt(l){var R;return l&&l.state?(l.total_in=l.total_out=0,l.data_type=p,(R=l.state).pending=0,R.pending_out=0,R.wrap<0&&(R.wrap=-R.wrap),R.status=R.wrap?k:T,l.adler=R.wrap===2?0:1,R.last_flush=w,a._tr_init(R),h):et(l,g)}function Et(l){var R=dt(l);return R===h&&function(z){z.window_size=2*z.w_size,Q(z.head),z.max_lazy_match=r[z.level].max_lazy,z.good_match=r[z.level].good_length,z.nice_match=r[z.level].nice_length,z.max_chain_length=r[z.level].max_chain,z.strstart=0,z.block_start=0,z.lookahead=0,z.insert=0,z.match_length=z.prev_length=P-1,z.match_available=0,z.ins_h=0}(l.state),R}function St(l,R,z,b,x,E){if(!l)return g;var F=1;if(R===f&&(R=6),b<0?(F=0,b=-b):15<b&&(F=2,b-=16),x<1||S<x||z!==_||b<8||15<b||R<0||9<R||E<0||v<E)return et(l,g);b===8&&(b=9);var L=new pt;return(l.state=L).strm=l,L.wrap=F,L.gzhead=null,L.w_bits=b,L.w_size=1<<L.w_bits,L.w_mask=L.w_size-1,L.hash_bits=x+7,L.hash_size=1<<L.hash_bits,L.hash_mask=L.hash_size-1,L.hash_shift=~~((L.hash_bits+P-1)/P),L.window=new o.Buf8(2*L.w_size),L.head=new o.Buf16(L.hash_size),L.prev=new o.Buf16(L.w_size),L.lit_bufsize=1<<x+6,L.pending_buf_size=4*L.lit_bufsize,L.pending_buf=new o.Buf8(L.pending_buf_size),L.d_buf=1*L.lit_bufsize,L.l_buf=3*L.lit_bufsize,L.level=R,L.strategy=E,L.method=z,Et(l)}r=[new it(0,0,0,0,function(l,R){var z=65535;for(z>l.pending_buf_size-5&&(z=l.pending_buf_size-5);;){if(l.lookahead<=1){if(ht(l),l.lookahead===0&&R===w)return d;if(l.lookahead===0)break}l.strstart+=l.lookahead,l.lookahead=0;var b=l.block_start+z;if((l.strstart===0||l.strstart>=b)&&(l.lookahead=l.strstart-b,l.strstart=b,O(l,!1),l.strm.avail_out===0)||l.strstart-l.block_start>=l.w_size-J&&(O(l,!1),l.strm.avail_out===0))return d}return l.insert=0,R===y?(O(l,!0),l.strm.avail_out===0?tt:U):(l.strstart>l.block_start&&(O(l,!1),l.strm.avail_out),d)}),new it(4,4,8,4,mt),new it(4,5,16,8,mt),new it(4,6,32,32,mt),new it(4,4,16,16,nt),new it(8,16,32,32,nt),new it(8,16,128,128,nt),new it(8,32,128,256,nt),new it(32,128,258,1024,nt),new it(32,258,258,4096,nt)],i.deflateInit=function(l,R){return St(l,R,_,15,8,0)},i.deflateInit2=St,i.deflateReset=Et,i.deflateResetKeep=dt,i.deflateSetHeader=function(l,R){return l&&l.state?l.state.wrap!==2?g:(l.state.gzhead=R,h):g},i.deflate=function(l,R){var z,b,x,E;if(!l||!l.state||5<R||R<0)return l?et(l,g):g;if(b=l.state,!l.output||!l.input&&l.avail_in!==0||b.status===666&&R!==y)return et(l,l.avail_out===0?-5:g);if(b.strm=l,z=b.last_flush,b.last_flush=R,b.status===k)if(b.wrap===2)l.adler=0,K(b,31),K(b,139),K(b,8),b.gzhead?(K(b,(b.gzhead.text?1:0)+(b.gzhead.hcrc?2:0)+(b.gzhead.extra?4:0)+(b.gzhead.name?8:0)+(b.gzhead.comment?16:0)),K(b,255&b.gzhead.time),K(b,b.gzhead.time>>8&255),K(b,b.gzhead.time>>16&255),K(b,b.gzhead.time>>24&255),K(b,b.level===9?2:2<=b.strategy||b.level<2?4:0),K(b,255&b.gzhead.os),b.gzhead.extra&&b.gzhead.extra.length&&(K(b,255&b.gzhead.extra.length),K(b,b.gzhead.extra.length>>8&255)),b.gzhead.hcrc&&(l.adler=m(l.adler,b.pending_buf,b.pending,0)),b.gzindex=0,b.status=69):(K(b,0),K(b,0),K(b,0),K(b,0),K(b,0),K(b,b.level===9?2:2<=b.strategy||b.level<2?4:0),K(b,3),b.status=T);else{var F=_+(b.w_bits-8<<4)<<8;F|=(2<=b.strategy||b.level<2?0:b.level<6?1:b.level===6?2:3)<<6,b.strstart!==0&&(F|=32),F+=31-F%31,b.status=T,V(b,F),b.strstart!==0&&(V(b,l.adler>>>16),V(b,65535&l.adler)),l.adler=1}if(b.status===69)if(b.gzhead.extra){for(x=b.pending;b.gzindex<(65535&b.gzhead.extra.length)&&(b.pending!==b.pending_buf_size||(b.gzhead.hcrc&&b.pending>x&&(l.adler=m(l.adler,b.pending_buf,b.pending-x,x)),M(l),x=b.pending,b.pending!==b.pending_buf_size));)K(b,255&b.gzhead.extra[b.gzindex]),b.gzindex++;b.gzhead.hcrc&&b.pending>x&&(l.adler=m(l.adler,b.pending_buf,b.pending-x,x)),b.gzindex===b.gzhead.extra.length&&(b.gzindex=0,b.status=73)}else b.status=73;if(b.status===73)if(b.gzhead.name){x=b.pending;do{if(b.pending===b.pending_buf_size&&(b.gzhead.hcrc&&b.pending>x&&(l.adler=m(l.adler,b.pending_buf,b.pending-x,x)),M(l),x=b.pending,b.pending===b.pending_buf_size)){E=1;break}E=b.gzindex<b.gzhead.name.length?255&b.gzhead.name.charCodeAt(b.gzindex++):0,K(b,E)}while(E!==0);b.gzhead.hcrc&&b.pending>x&&(l.adler=m(l.adler,b.pending_buf,b.pending-x,x)),E===0&&(b.gzindex=0,b.status=91)}else b.status=91;if(b.status===91)if(b.gzhead.comment){x=b.pending;do{if(b.pending===b.pending_buf_size&&(b.gzhead.hcrc&&b.pending>x&&(l.adler=m(l.adler,b.pending_buf,b.pending-x,x)),M(l),x=b.pending,b.pending===b.pending_buf_size)){E=1;break}E=b.gzindex<b.gzhead.comment.length?255&b.gzhead.comment.charCodeAt(b.gzindex++):0,K(b,E)}while(E!==0);b.gzhead.hcrc&&b.pending>x&&(l.adler=m(l.adler,b.pending_buf,b.pending-x,x)),E===0&&(b.status=103)}else b.status=103;if(b.status===103&&(b.gzhead.hcrc?(b.pending+2>b.pending_buf_size&&M(l),b.pending+2<=b.pending_buf_size&&(K(b,255&l.adler),K(b,l.adler>>8&255),l.adler=0,b.status=T)):b.status=T),b.pending!==0){if(M(l),l.avail_out===0)return b.last_flush=-1,h}else if(l.avail_in===0&&G(R)<=G(z)&&R!==y)return et(l,-5);if(b.status===666&&l.avail_in!==0)return et(l,-5);if(l.avail_in!==0||b.lookahead!==0||R!==w&&b.status!==666){var L=b.strategy===2?function(C,q){for(var Y;;){if(C.lookahead===0&&(ht(C),C.lookahead===0)){if(q===w)return d;break}if(C.match_length=0,Y=a._tr_tally(C,0,C.window[C.strstart]),C.lookahead--,C.strstart++,Y&&(O(C,!1),C.strm.avail_out===0))return d}return C.insert=0,q===y?(O(C,!0),C.strm.avail_out===0?tt:U):C.last_lit&&(O(C,!1),C.strm.avail_out===0)?d:j}(b,R):b.strategy===3?function(C,q){for(var Y,H,X,st,rt=C.window;;){if(C.lookahead<=Z){if(ht(C),C.lookahead<=Z&&q===w)return d;if(C.lookahead===0)break}if(C.match_length=0,C.lookahead>=P&&0<C.strstart&&(H=rt[X=C.strstart-1])===rt[++X]&&H===rt[++X]&&H===rt[++X]){st=C.strstart+Z;do;while(H===rt[++X]&&H===rt[++X]&&H===rt[++X]&&H===rt[++X]&&H===rt[++X]&&H===rt[++X]&&H===rt[++X]&&H===rt[++X]&&X<st);C.match_length=Z-(st-X),C.match_length>C.lookahead&&(C.match_length=C.lookahead)}if(C.match_length>=P?(Y=a._tr_tally(C,1,C.match_length-P),C.lookahead-=C.match_length,C.strstart+=C.match_length,C.match_length=0):(Y=a._tr_tally(C,0,C.window[C.strstart]),C.lookahead--,C.strstart++),Y&&(O(C,!1),C.strm.avail_out===0))return d}return C.insert=0,q===y?(O(C,!0),C.strm.avail_out===0?tt:U):C.last_lit&&(O(C,!1),C.strm.avail_out===0)?d:j}(b,R):r[b.level].func(b,R);if(L!==tt&&L!==U||(b.status=666),L===d||L===tt)return l.avail_out===0&&(b.last_flush=-1),h;if(L===j&&(R===1?a._tr_align(b):R!==5&&(a._tr_stored_block(b,0,0,!1),R===3&&(Q(b.head),b.lookahead===0&&(b.strstart=0,b.block_start=0,b.insert=0))),M(l),l.avail_out===0))return b.last_flush=-1,h}return R!==y?h:b.wrap<=0?1:(b.wrap===2?(K(b,255&l.adler),K(b,l.adler>>8&255),K(b,l.adler>>16&255),K(b,l.adler>>24&255),K(b,255&l.total_in),K(b,l.total_in>>8&255),K(b,l.total_in>>16&255),K(b,l.total_in>>24&255)):(V(b,l.adler>>>16),V(b,65535&l.adler)),M(l),0<b.wrap&&(b.wrap=-b.wrap),b.pending!==0?h:1)},i.deflateEnd=function(l){var R;return l&&l.state?(R=l.state.status)!==k&&R!==69&&R!==73&&R!==91&&R!==103&&R!==T&&R!==666?et(l,g):(l.state=null,R===T?et(l,-3):h):g},i.deflateSetDictionary=function(l,R){var z,b,x,E,F,L,C,q,Y=R.length;if(!l||!l.state||(E=(z=l.state).wrap)===2||E===1&&z.status!==k||z.lookahead)return g;for(E===1&&(l.adler=c(l.adler,R,Y,0)),z.wrap=0,Y>=z.w_size&&(E===0&&(Q(z.head),z.strstart=0,z.block_start=0,z.insert=0),q=new o.Buf8(z.w_size),o.arraySet(q,R,Y-z.w_size,z.w_size,0),R=q,Y=z.w_size),F=l.avail_in,L=l.next_in,C=l.input,l.avail_in=Y,l.next_in=0,l.input=R,ht(z);z.lookahead>=P;){for(b=z.strstart,x=z.lookahead-(P-1);z.ins_h=(z.ins_h<<z.hash_shift^z.window[b+P-1])&z.hash_mask,z.prev[b&z.w_mask]=z.head[z.ins_h],z.head[z.ins_h]=b,b++,--x;);z.strstart=b,z.lookahead=P-1,ht(z)}return z.strstart+=z.lookahead,z.block_start=z.strstart,z.insert=z.lookahead,z.lookahead=0,z.match_length=z.prev_length=P-1,z.match_available=0,l.next_in=L,l.input=C,l.avail_in=F,z.wrap=E,h},i.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(t,n,i){n.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(t,n,i){n.exports=function(r,o){var a,c,m,u,w,y,h,g,f,v,p,_,S,A,I,B,D,W,P,Z,J,k,T,d,j;a=r.state,c=r.next_in,d=r.input,m=c+(r.avail_in-5),u=r.next_out,j=r.output,w=u-(o-r.avail_out),y=u+(r.avail_out-257),h=a.dmax,g=a.wsize,f=a.whave,v=a.wnext,p=a.window,_=a.hold,S=a.bits,A=a.lencode,I=a.distcode,B=(1<<a.lenbits)-1,D=(1<<a.distbits)-1;t:do{S<15&&(_+=d[c++]<<S,S+=8,_+=d[c++]<<S,S+=8),W=A[_&B];e:for(;;){if(_>>>=P=W>>>24,S-=P,(P=W>>>16&255)===0)j[u++]=65535&W;else{if(!(16&P)){if((64&P)==0){W=A[(65535&W)+(_&(1<<P)-1)];continue e}if(32&P){a.mode=12;break t}r.msg="invalid literal/length code",a.mode=30;break t}Z=65535&W,(P&=15)&&(S<P&&(_+=d[c++]<<S,S+=8),Z+=_&(1<<P)-1,_>>>=P,S-=P),S<15&&(_+=d[c++]<<S,S+=8,_+=d[c++]<<S,S+=8),W=I[_&D];n:for(;;){if(_>>>=P=W>>>24,S-=P,!(16&(P=W>>>16&255))){if((64&P)==0){W=I[(65535&W)+(_&(1<<P)-1)];continue n}r.msg="invalid distance code",a.mode=30;break t}if(J=65535&W,S<(P&=15)&&(_+=d[c++]<<S,(S+=8)<P&&(_+=d[c++]<<S,S+=8)),h<(J+=_&(1<<P)-1)){r.msg="invalid distance too far back",a.mode=30;break t}if(_>>>=P,S-=P,(P=u-w)<J){if(f<(P=J-P)&&a.sane){r.msg="invalid distance too far back",a.mode=30;break t}if(T=p,(k=0)===v){if(k+=g-P,P<Z){for(Z-=P;j[u++]=p[k++],--P;);k=u-J,T=j}}else if(v<P){if(k+=g+v-P,(P-=v)<Z){for(Z-=P;j[u++]=p[k++],--P;);if(k=0,v<Z){for(Z-=P=v;j[u++]=p[k++],--P;);k=u-J,T=j}}}else if(k+=v-P,P<Z){for(Z-=P;j[u++]=p[k++],--P;);k=u-J,T=j}for(;2<Z;)j[u++]=T[k++],j[u++]=T[k++],j[u++]=T[k++],Z-=3;Z&&(j[u++]=T[k++],1<Z&&(j[u++]=T[k++]))}else{for(k=u-J;j[u++]=j[k++],j[u++]=j[k++],j[u++]=j[k++],2<(Z-=3););Z&&(j[u++]=j[k++],1<Z&&(j[u++]=j[k++]))}break}}break}}while(c<m&&u<y);c-=Z=S>>3,_&=(1<<(S-=Z<<3))-1,r.next_in=c,r.next_out=u,r.avail_in=c<m?m-c+5:5-(c-m),r.avail_out=u<y?y-u+257:257-(u-y),a.hold=_,a.bits=S}},{}],49:[function(t,n,i){var r=t("../utils/common"),o=t("./adler32"),a=t("./crc32"),c=t("./inffast"),m=t("./inftrees"),u=1,w=2,y=0,h=-2,g=1,f=852,v=592;function p(k){return(k>>>24&255)+(k>>>8&65280)+((65280&k)<<8)+((255&k)<<24)}function _(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new r.Buf16(320),this.work=new r.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function S(k){var T;return k&&k.state?(T=k.state,k.total_in=k.total_out=T.total=0,k.msg="",T.wrap&&(k.adler=1&T.wrap),T.mode=g,T.last=0,T.havedict=0,T.dmax=32768,T.head=null,T.hold=0,T.bits=0,T.lencode=T.lendyn=new r.Buf32(f),T.distcode=T.distdyn=new r.Buf32(v),T.sane=1,T.back=-1,y):h}function A(k){var T;return k&&k.state?((T=k.state).wsize=0,T.whave=0,T.wnext=0,S(k)):h}function I(k,T){var d,j;return k&&k.state?(j=k.state,T<0?(d=0,T=-T):(d=1+(T>>4),T<48&&(T&=15)),T&&(T<8||15<T)?h:(j.window!==null&&j.wbits!==T&&(j.window=null),j.wrap=d,j.wbits=T,A(k))):h}function B(k,T){var d,j;return k?(j=new _,(k.state=j).window=null,(d=I(k,T))!==y&&(k.state=null),d):h}var D,W,P=!0;function Z(k){if(P){var T;for(D=new r.Buf32(512),W=new r.Buf32(32),T=0;T<144;)k.lens[T++]=8;for(;T<256;)k.lens[T++]=9;for(;T<280;)k.lens[T++]=7;for(;T<288;)k.lens[T++]=8;for(m(u,k.lens,0,288,D,0,k.work,{bits:9}),T=0;T<32;)k.lens[T++]=5;m(w,k.lens,0,32,W,0,k.work,{bits:5}),P=!1}k.lencode=D,k.lenbits=9,k.distcode=W,k.distbits=5}function J(k,T,d,j){var tt,U=k.state;return U.window===null&&(U.wsize=1<<U.wbits,U.wnext=0,U.whave=0,U.window=new r.Buf8(U.wsize)),j>=U.wsize?(r.arraySet(U.window,T,d-U.wsize,U.wsize,0),U.wnext=0,U.whave=U.wsize):(j<(tt=U.wsize-U.wnext)&&(tt=j),r.arraySet(U.window,T,d-j,tt,U.wnext),(j-=tt)?(r.arraySet(U.window,T,d-j,j,0),U.wnext=j,U.whave=U.wsize):(U.wnext+=tt,U.wnext===U.wsize&&(U.wnext=0),U.whave<U.wsize&&(U.whave+=tt))),0}i.inflateReset=A,i.inflateReset2=I,i.inflateResetKeep=S,i.inflateInit=function(k){return B(k,15)},i.inflateInit2=B,i.inflate=function(k,T){var d,j,tt,U,et,G,Q,M,O,K,V,$,ht,mt,nt,it,pt,dt,Et,St,l,R,z,b,x=0,E=new r.Buf8(4),F=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!k||!k.state||!k.output||!k.input&&k.avail_in!==0)return h;(d=k.state).mode===12&&(d.mode=13),et=k.next_out,tt=k.output,Q=k.avail_out,U=k.next_in,j=k.input,G=k.avail_in,M=d.hold,O=d.bits,K=G,V=Q,R=y;t:for(;;)switch(d.mode){case g:if(d.wrap===0){d.mode=13;break}for(;O<16;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}if(2&d.wrap&&M===35615){E[d.check=0]=255&M,E[1]=M>>>8&255,d.check=a(d.check,E,2,0),O=M=0,d.mode=2;break}if(d.flags=0,d.head&&(d.head.done=!1),!(1&d.wrap)||(((255&M)<<8)+(M>>8))%31){k.msg="incorrect header check",d.mode=30;break}if((15&M)!=8){k.msg="unknown compression method",d.mode=30;break}if(O-=4,l=8+(15&(M>>>=4)),d.wbits===0)d.wbits=l;else if(l>d.wbits){k.msg="invalid window size",d.mode=30;break}d.dmax=1<<l,k.adler=d.check=1,d.mode=512&M?10:12,O=M=0;break;case 2:for(;O<16;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}if(d.flags=M,(255&d.flags)!=8){k.msg="unknown compression method",d.mode=30;break}if(57344&d.flags){k.msg="unknown header flags set",d.mode=30;break}d.head&&(d.head.text=M>>8&1),512&d.flags&&(E[0]=255&M,E[1]=M>>>8&255,d.check=a(d.check,E,2,0)),O=M=0,d.mode=3;case 3:for(;O<32;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}d.head&&(d.head.time=M),512&d.flags&&(E[0]=255&M,E[1]=M>>>8&255,E[2]=M>>>16&255,E[3]=M>>>24&255,d.check=a(d.check,E,4,0)),O=M=0,d.mode=4;case 4:for(;O<16;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}d.head&&(d.head.xflags=255&M,d.head.os=M>>8),512&d.flags&&(E[0]=255&M,E[1]=M>>>8&255,d.check=a(d.check,E,2,0)),O=M=0,d.mode=5;case 5:if(1024&d.flags){for(;O<16;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}d.length=M,d.head&&(d.head.extra_len=M),512&d.flags&&(E[0]=255&M,E[1]=M>>>8&255,d.check=a(d.check,E,2,0)),O=M=0}else d.head&&(d.head.extra=null);d.mode=6;case 6:if(1024&d.flags&&(G<($=d.length)&&($=G),$&&(d.head&&(l=d.head.extra_len-d.length,d.head.extra||(d.head.extra=new Array(d.head.extra_len)),r.arraySet(d.head.extra,j,U,$,l)),512&d.flags&&(d.check=a(d.check,j,$,U)),G-=$,U+=$,d.length-=$),d.length))break t;d.length=0,d.mode=7;case 7:if(2048&d.flags){if(G===0)break t;for($=0;l=j[U+$++],d.head&&l&&d.length<65536&&(d.head.name+=String.fromCharCode(l)),l&&$<G;);if(512&d.flags&&(d.check=a(d.check,j,$,U)),G-=$,U+=$,l)break t}else d.head&&(d.head.name=null);d.length=0,d.mode=8;case 8:if(4096&d.flags){if(G===0)break t;for($=0;l=j[U+$++],d.head&&l&&d.length<65536&&(d.head.comment+=String.fromCharCode(l)),l&&$<G;);if(512&d.flags&&(d.check=a(d.check,j,$,U)),G-=$,U+=$,l)break t}else d.head&&(d.head.comment=null);d.mode=9;case 9:if(512&d.flags){for(;O<16;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}if(M!==(65535&d.check)){k.msg="header crc mismatch",d.mode=30;break}O=M=0}d.head&&(d.head.hcrc=d.flags>>9&1,d.head.done=!0),k.adler=d.check=0,d.mode=12;break;case 10:for(;O<32;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}k.adler=d.check=p(M),O=M=0,d.mode=11;case 11:if(d.havedict===0)return k.next_out=et,k.avail_out=Q,k.next_in=U,k.avail_in=G,d.hold=M,d.bits=O,2;k.adler=d.check=1,d.mode=12;case 12:if(T===5||T===6)break t;case 13:if(d.last){M>>>=7&O,O-=7&O,d.mode=27;break}for(;O<3;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}switch(d.last=1&M,O-=1,3&(M>>>=1)){case 0:d.mode=14;break;case 1:if(Z(d),d.mode=20,T!==6)break;M>>>=2,O-=2;break t;case 2:d.mode=17;break;case 3:k.msg="invalid block type",d.mode=30}M>>>=2,O-=2;break;case 14:for(M>>>=7&O,O-=7&O;O<32;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}if((65535&M)!=(M>>>16^65535)){k.msg="invalid stored block lengths",d.mode=30;break}if(d.length=65535&M,O=M=0,d.mode=15,T===6)break t;case 15:d.mode=16;case 16:if($=d.length){if(G<$&&($=G),Q<$&&($=Q),$===0)break t;r.arraySet(tt,j,U,$,et),G-=$,U+=$,Q-=$,et+=$,d.length-=$;break}d.mode=12;break;case 17:for(;O<14;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}if(d.nlen=257+(31&M),M>>>=5,O-=5,d.ndist=1+(31&M),M>>>=5,O-=5,d.ncode=4+(15&M),M>>>=4,O-=4,286<d.nlen||30<d.ndist){k.msg="too many length or distance symbols",d.mode=30;break}d.have=0,d.mode=18;case 18:for(;d.have<d.ncode;){for(;O<3;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}d.lens[F[d.have++]]=7&M,M>>>=3,O-=3}for(;d.have<19;)d.lens[F[d.have++]]=0;if(d.lencode=d.lendyn,d.lenbits=7,z={bits:d.lenbits},R=m(0,d.lens,0,19,d.lencode,0,d.work,z),d.lenbits=z.bits,R){k.msg="invalid code lengths set",d.mode=30;break}d.have=0,d.mode=19;case 19:for(;d.have<d.nlen+d.ndist;){for(;it=(x=d.lencode[M&(1<<d.lenbits)-1])>>>16&255,pt=65535&x,!((nt=x>>>24)<=O);){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}if(pt<16)M>>>=nt,O-=nt,d.lens[d.have++]=pt;else{if(pt===16){for(b=nt+2;O<b;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}if(M>>>=nt,O-=nt,d.have===0){k.msg="invalid bit length repeat",d.mode=30;break}l=d.lens[d.have-1],$=3+(3&M),M>>>=2,O-=2}else if(pt===17){for(b=nt+3;O<b;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}O-=nt,l=0,$=3+(7&(M>>>=nt)),M>>>=3,O-=3}else{for(b=nt+7;O<b;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}O-=nt,l=0,$=11+(127&(M>>>=nt)),M>>>=7,O-=7}if(d.have+$>d.nlen+d.ndist){k.msg="invalid bit length repeat",d.mode=30;break}for(;$--;)d.lens[d.have++]=l}}if(d.mode===30)break;if(d.lens[256]===0){k.msg="invalid code -- missing end-of-block",d.mode=30;break}if(d.lenbits=9,z={bits:d.lenbits},R=m(u,d.lens,0,d.nlen,d.lencode,0,d.work,z),d.lenbits=z.bits,R){k.msg="invalid literal/lengths set",d.mode=30;break}if(d.distbits=6,d.distcode=d.distdyn,z={bits:d.distbits},R=m(w,d.lens,d.nlen,d.ndist,d.distcode,0,d.work,z),d.distbits=z.bits,R){k.msg="invalid distances set",d.mode=30;break}if(d.mode=20,T===6)break t;case 20:d.mode=21;case 21:if(6<=G&&258<=Q){k.next_out=et,k.avail_out=Q,k.next_in=U,k.avail_in=G,d.hold=M,d.bits=O,c(k,V),et=k.next_out,tt=k.output,Q=k.avail_out,U=k.next_in,j=k.input,G=k.avail_in,M=d.hold,O=d.bits,d.mode===12&&(d.back=-1);break}for(d.back=0;it=(x=d.lencode[M&(1<<d.lenbits)-1])>>>16&255,pt=65535&x,!((nt=x>>>24)<=O);){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}if(it&&(240&it)==0){for(dt=nt,Et=it,St=pt;it=(x=d.lencode[St+((M&(1<<dt+Et)-1)>>dt)])>>>16&255,pt=65535&x,!(dt+(nt=x>>>24)<=O);){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}M>>>=dt,O-=dt,d.back+=dt}if(M>>>=nt,O-=nt,d.back+=nt,d.length=pt,it===0){d.mode=26;break}if(32&it){d.back=-1,d.mode=12;break}if(64&it){k.msg="invalid literal/length code",d.mode=30;break}d.extra=15&it,d.mode=22;case 22:if(d.extra){for(b=d.extra;O<b;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}d.length+=M&(1<<d.extra)-1,M>>>=d.extra,O-=d.extra,d.back+=d.extra}d.was=d.length,d.mode=23;case 23:for(;it=(x=d.distcode[M&(1<<d.distbits)-1])>>>16&255,pt=65535&x,!((nt=x>>>24)<=O);){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}if((240&it)==0){for(dt=nt,Et=it,St=pt;it=(x=d.distcode[St+((M&(1<<dt+Et)-1)>>dt)])>>>16&255,pt=65535&x,!(dt+(nt=x>>>24)<=O);){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}M>>>=dt,O-=dt,d.back+=dt}if(M>>>=nt,O-=nt,d.back+=nt,64&it){k.msg="invalid distance code",d.mode=30;break}d.offset=pt,d.extra=15&it,d.mode=24;case 24:if(d.extra){for(b=d.extra;O<b;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}d.offset+=M&(1<<d.extra)-1,M>>>=d.extra,O-=d.extra,d.back+=d.extra}if(d.offset>d.dmax){k.msg="invalid distance too far back",d.mode=30;break}d.mode=25;case 25:if(Q===0)break t;if($=V-Q,d.offset>$){if(($=d.offset-$)>d.whave&&d.sane){k.msg="invalid distance too far back",d.mode=30;break}ht=$>d.wnext?($-=d.wnext,d.wsize-$):d.wnext-$,$>d.length&&($=d.length),mt=d.window}else mt=tt,ht=et-d.offset,$=d.length;for(Q<$&&($=Q),Q-=$,d.length-=$;tt[et++]=mt[ht++],--$;);d.length===0&&(d.mode=21);break;case 26:if(Q===0)break t;tt[et++]=d.length,Q--,d.mode=21;break;case 27:if(d.wrap){for(;O<32;){if(G===0)break t;G--,M|=j[U++]<<O,O+=8}if(V-=Q,k.total_out+=V,d.total+=V,V&&(k.adler=d.check=d.flags?a(d.check,tt,V,et-V):o(d.check,tt,V,et-V)),V=Q,(d.flags?M:p(M))!==d.check){k.msg="incorrect data check",d.mode=30;break}O=M=0}d.mode=28;case 28:if(d.wrap&&d.flags){for(;O<32;){if(G===0)break t;G--,M+=j[U++]<<O,O+=8}if(M!==(4294967295&d.total)){k.msg="incorrect length check",d.mode=30;break}O=M=0}d.mode=29;case 29:R=1;break t;case 30:R=-3;break t;case 31:return-4;case 32:default:return h}return k.next_out=et,k.avail_out=Q,k.next_in=U,k.avail_in=G,d.hold=M,d.bits=O,(d.wsize||V!==k.avail_out&&d.mode<30&&(d.mode<27||T!==4))&&J(k,k.output,k.next_out,V-k.avail_out)?(d.mode=31,-4):(K-=k.avail_in,V-=k.avail_out,k.total_in+=K,k.total_out+=V,d.total+=V,d.wrap&&V&&(k.adler=d.check=d.flags?a(d.check,tt,V,k.next_out-V):o(d.check,tt,V,k.next_out-V)),k.data_type=d.bits+(d.last?64:0)+(d.mode===12?128:0)+(d.mode===20||d.mode===15?256:0),(K==0&&V===0||T===4)&&R===y&&(R=-5),R)},i.inflateEnd=function(k){if(!k||!k.state)return h;var T=k.state;return T.window&&(T.window=null),k.state=null,y},i.inflateGetHeader=function(k,T){var d;return k&&k.state?(2&(d=k.state).wrap)==0?h:((d.head=T).done=!1,y):h},i.inflateSetDictionary=function(k,T){var d,j=T.length;return k&&k.state?(d=k.state).wrap!==0&&d.mode!==11?h:d.mode===11&&o(1,T,j,0)!==d.check?-3:J(k,T,j,j)?(d.mode=31,-4):(d.havedict=1,y):h},i.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(t,n,i){var r=t("../utils/common"),o=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],a=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],c=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],m=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];n.exports=function(u,w,y,h,g,f,v,p){var _,S,A,I,B,D,W,P,Z,J=p.bits,k=0,T=0,d=0,j=0,tt=0,U=0,et=0,G=0,Q=0,M=0,O=null,K=0,V=new r.Buf16(16),$=new r.Buf16(16),ht=null,mt=0;for(k=0;k<=15;k++)V[k]=0;for(T=0;T<h;T++)V[w[y+T]]++;for(tt=J,j=15;1<=j&&V[j]===0;j--);if(j<tt&&(tt=j),j===0)return g[f++]=20971520,g[f++]=20971520,p.bits=1,0;for(d=1;d<j&&V[d]===0;d++);for(tt<d&&(tt=d),k=G=1;k<=15;k++)if(G<<=1,(G-=V[k])<0)return-1;if(0<G&&(u===0||j!==1))return-1;for($[1]=0,k=1;k<15;k++)$[k+1]=$[k]+V[k];for(T=0;T<h;T++)w[y+T]!==0&&(v[$[w[y+T]]++]=T);if(D=u===0?(O=ht=v,19):u===1?(O=o,K-=257,ht=a,mt-=257,256):(O=c,ht=m,-1),k=d,B=f,et=T=M=0,A=-1,I=(Q=1<<(U=tt))-1,u===1&&852<Q||u===2&&592<Q)return 1;for(;;){for(W=k-et,Z=v[T]<D?(P=0,v[T]):v[T]>D?(P=ht[mt+v[T]],O[K+v[T]]):(P=96,0),_=1<<k-et,d=S=1<<U;g[B+(M>>et)+(S-=_)]=W<<24|P<<16|Z|0,S!==0;);for(_=1<<k-1;M&_;)_>>=1;if(_!==0?(M&=_-1,M+=_):M=0,T++,--V[k]==0){if(k===j)break;k=w[y+v[T]]}if(tt<k&&(M&I)!==A){for(et===0&&(et=tt),B+=d,G=1<<(U=k-et);U+et<j&&!((G-=V[U+et])<=0);)U++,G<<=1;if(Q+=1<<U,u===1&&852<Q||u===2&&592<Q)return 1;g[A=M&I]=tt<<24|U<<16|B-f|0}}return M!==0&&(g[B+M]=k-et<<24|64<<16|0),p.bits=tt,0}},{"../utils/common":41}],51:[function(t,n,i){n.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(t,n,i){var r=t("../utils/common"),o=0,a=1;function c(x){for(var E=x.length;0<=--E;)x[E]=0}var m=0,u=29,w=256,y=w+1+u,h=30,g=19,f=2*y+1,v=15,p=16,_=7,S=256,A=16,I=17,B=18,D=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],W=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],P=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],Z=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],J=new Array(2*(y+2));c(J);var k=new Array(2*h);c(k);var T=new Array(512);c(T);var d=new Array(256);c(d);var j=new Array(u);c(j);var tt,U,et,G=new Array(h);function Q(x,E,F,L,C){this.static_tree=x,this.extra_bits=E,this.extra_base=F,this.elems=L,this.max_length=C,this.has_stree=x&&x.length}function M(x,E){this.dyn_tree=x,this.max_code=0,this.stat_desc=E}function O(x){return x<256?T[x]:T[256+(x>>>7)]}function K(x,E){x.pending_buf[x.pending++]=255&E,x.pending_buf[x.pending++]=E>>>8&255}function V(x,E,F){x.bi_valid>p-F?(x.bi_buf|=E<<x.bi_valid&65535,K(x,x.bi_buf),x.bi_buf=E>>p-x.bi_valid,x.bi_valid+=F-p):(x.bi_buf|=E<<x.bi_valid&65535,x.bi_valid+=F)}function $(x,E,F){V(x,F[2*E],F[2*E+1])}function ht(x,E){for(var F=0;F|=1&x,x>>>=1,F<<=1,0<--E;);return F>>>1}function mt(x,E,F){var L,C,q=new Array(v+1),Y=0;for(L=1;L<=v;L++)q[L]=Y=Y+F[L-1]<<1;for(C=0;C<=E;C++){var H=x[2*C+1];H!==0&&(x[2*C]=ht(q[H]++,H))}}function nt(x){var E;for(E=0;E<y;E++)x.dyn_ltree[2*E]=0;for(E=0;E<h;E++)x.dyn_dtree[2*E]=0;for(E=0;E<g;E++)x.bl_tree[2*E]=0;x.dyn_ltree[2*S]=1,x.opt_len=x.static_len=0,x.last_lit=x.matches=0}function it(x){8<x.bi_valid?K(x,x.bi_buf):0<x.bi_valid&&(x.pending_buf[x.pending++]=x.bi_buf),x.bi_buf=0,x.bi_valid=0}function pt(x,E,F,L){var C=2*E,q=2*F;return x[C]<x[q]||x[C]===x[q]&&L[E]<=L[F]}function dt(x,E,F){for(var L=x.heap[F],C=F<<1;C<=x.heap_len&&(C<x.heap_len&&pt(E,x.heap[C+1],x.heap[C],x.depth)&&C++,!pt(E,L,x.heap[C],x.depth));)x.heap[F]=x.heap[C],F=C,C<<=1;x.heap[F]=L}function Et(x,E,F){var L,C,q,Y,H=0;if(x.last_lit!==0)for(;L=x.pending_buf[x.d_buf+2*H]<<8|x.pending_buf[x.d_buf+2*H+1],C=x.pending_buf[x.l_buf+H],H++,L===0?$(x,C,E):($(x,(q=d[C])+w+1,E),(Y=D[q])!==0&&V(x,C-=j[q],Y),$(x,q=O(--L),F),(Y=W[q])!==0&&V(x,L-=G[q],Y)),H<x.last_lit;);$(x,S,E)}function St(x,E){var F,L,C,q=E.dyn_tree,Y=E.stat_desc.static_tree,H=E.stat_desc.has_stree,X=E.stat_desc.elems,st=-1;for(x.heap_len=0,x.heap_max=f,F=0;F<X;F++)q[2*F]!==0?(x.heap[++x.heap_len]=st=F,x.depth[F]=0):q[2*F+1]=0;for(;x.heap_len<2;)q[2*(C=x.heap[++x.heap_len]=st<2?++st:0)]=1,x.depth[C]=0,x.opt_len--,H&&(x.static_len-=Y[2*C+1]);for(E.max_code=st,F=x.heap_len>>1;1<=F;F--)dt(x,q,F);for(C=X;F=x.heap[1],x.heap[1]=x.heap[x.heap_len--],dt(x,q,1),L=x.heap[1],x.heap[--x.heap_max]=F,x.heap[--x.heap_max]=L,q[2*C]=q[2*F]+q[2*L],x.depth[C]=(x.depth[F]>=x.depth[L]?x.depth[F]:x.depth[L])+1,q[2*F+1]=q[2*L+1]=C,x.heap[1]=C++,dt(x,q,1),2<=x.heap_len;);x.heap[--x.heap_max]=x.heap[1],function(rt,bt){var Rt,It,Nt,ut,qt,Kt,kt=bt.dyn_tree,Jt=bt.max_code,Wn=bt.stat_desc.static_tree,we=bt.stat_desc.has_stree,Qt=bt.stat_desc.extra_bits,jt=bt.stat_desc.extra_base,Ft=bt.stat_desc.max_length,Ht=0;for(ut=0;ut<=v;ut++)rt.bl_count[ut]=0;for(kt[2*rt.heap[rt.heap_max]+1]=0,Rt=rt.heap_max+1;Rt<f;Rt++)Ft<(ut=kt[2*kt[2*(It=rt.heap[Rt])+1]+1]+1)&&(ut=Ft,Ht++),kt[2*It+1]=ut,Jt<It||(rt.bl_count[ut]++,qt=0,jt<=It&&(qt=Qt[It-jt]),Kt=kt[2*It],rt.opt_len+=Kt*(ut+qt),we&&(rt.static_len+=Kt*(Wn[2*It+1]+qt)));if(Ht!==0){do{for(ut=Ft-1;rt.bl_count[ut]===0;)ut--;rt.bl_count[ut]--,rt.bl_count[ut+1]+=2,rt.bl_count[Ft]--,Ht-=2}while(0<Ht);for(ut=Ft;ut!==0;ut--)for(It=rt.bl_count[ut];It!==0;)Jt<(Nt=rt.heap[--Rt])||(kt[2*Nt+1]!==ut&&(rt.opt_len+=(ut-kt[2*Nt+1])*kt[2*Nt],kt[2*Nt+1]=ut),It--)}}(x,E),mt(q,st,x.bl_count)}function l(x,E,F){var L,C,q=-1,Y=E[1],H=0,X=7,st=4;for(Y===0&&(X=138,st=3),E[2*(F+1)+1]=65535,L=0;L<=F;L++)C=Y,Y=E[2*(L+1)+1],++H<X&&C===Y||(H<st?x.bl_tree[2*C]+=H:C!==0?(C!==q&&x.bl_tree[2*C]++,x.bl_tree[2*A]++):H<=10?x.bl_tree[2*I]++:x.bl_tree[2*B]++,q=C,st=(H=0)===Y?(X=138,3):C===Y?(X=6,3):(X=7,4))}function R(x,E,F){var L,C,q=-1,Y=E[1],H=0,X=7,st=4;for(Y===0&&(X=138,st=3),L=0;L<=F;L++)if(C=Y,Y=E[2*(L+1)+1],!(++H<X&&C===Y)){if(H<st)for(;$(x,C,x.bl_tree),--H!=0;);else C!==0?(C!==q&&($(x,C,x.bl_tree),H--),$(x,A,x.bl_tree),V(x,H-3,2)):H<=10?($(x,I,x.bl_tree),V(x,H-3,3)):($(x,B,x.bl_tree),V(x,H-11,7));q=C,st=(H=0)===Y?(X=138,3):C===Y?(X=6,3):(X=7,4)}}c(G);var z=!1;function b(x,E,F,L){V(x,(m<<1)+(L?1:0),3),function(C,q,Y,H){it(C),H&&(K(C,Y),K(C,~Y)),r.arraySet(C.pending_buf,C.window,q,Y,C.pending),C.pending+=Y}(x,E,F,!0)}i._tr_init=function(x){z||(function(){var E,F,L,C,q,Y=new Array(v+1);for(C=L=0;C<u-1;C++)for(j[C]=L,E=0;E<1<<D[C];E++)d[L++]=C;for(d[L-1]=C,C=q=0;C<16;C++)for(G[C]=q,E=0;E<1<<W[C];E++)T[q++]=C;for(q>>=7;C<h;C++)for(G[C]=q<<7,E=0;E<1<<W[C]-7;E++)T[256+q++]=C;for(F=0;F<=v;F++)Y[F]=0;for(E=0;E<=143;)J[2*E+1]=8,E++,Y[8]++;for(;E<=255;)J[2*E+1]=9,E++,Y[9]++;for(;E<=279;)J[2*E+1]=7,E++,Y[7]++;for(;E<=287;)J[2*E+1]=8,E++,Y[8]++;for(mt(J,y+1,Y),E=0;E<h;E++)k[2*E+1]=5,k[2*E]=ht(E,5);tt=new Q(J,D,w+1,y,v),U=new Q(k,W,0,h,v),et=new Q(new Array(0),P,0,g,_)}(),z=!0),x.l_desc=new M(x.dyn_ltree,tt),x.d_desc=new M(x.dyn_dtree,U),x.bl_desc=new M(x.bl_tree,et),x.bi_buf=0,x.bi_valid=0,nt(x)},i._tr_stored_block=b,i._tr_flush_block=function(x,E,F,L){var C,q,Y=0;0<x.level?(x.strm.data_type===2&&(x.strm.data_type=function(H){var X,st=4093624447;for(X=0;X<=31;X++,st>>>=1)if(1&st&&H.dyn_ltree[2*X]!==0)return o;if(H.dyn_ltree[18]!==0||H.dyn_ltree[20]!==0||H.dyn_ltree[26]!==0)return a;for(X=32;X<w;X++)if(H.dyn_ltree[2*X]!==0)return a;return o}(x)),St(x,x.l_desc),St(x,x.d_desc),Y=function(H){var X;for(l(H,H.dyn_ltree,H.l_desc.max_code),l(H,H.dyn_dtree,H.d_desc.max_code),St(H,H.bl_desc),X=g-1;3<=X&&H.bl_tree[2*Z[X]+1]===0;X--);return H.opt_len+=3*(X+1)+5+5+4,X}(x),C=x.opt_len+3+7>>>3,(q=x.static_len+3+7>>>3)<=C&&(C=q)):C=q=F+5,F+4<=C&&E!==-1?b(x,E,F,L):x.strategy===4||q===C?(V(x,2+(L?1:0),3),Et(x,J,k)):(V(x,4+(L?1:0),3),function(H,X,st,rt){var bt;for(V(H,X-257,5),V(H,st-1,5),V(H,rt-4,4),bt=0;bt<rt;bt++)V(H,H.bl_tree[2*Z[bt]+1],3);R(H,H.dyn_ltree,X-1),R(H,H.dyn_dtree,st-1)}(x,x.l_desc.max_code+1,x.d_desc.max_code+1,Y+1),Et(x,x.dyn_ltree,x.dyn_dtree)),nt(x),L&&it(x)},i._tr_tally=function(x,E,F){return x.pending_buf[x.d_buf+2*x.last_lit]=E>>>8&255,x.pending_buf[x.d_buf+2*x.last_lit+1]=255&E,x.pending_buf[x.l_buf+x.last_lit]=255&F,x.last_lit++,E===0?x.dyn_ltree[2*F]++:(x.matches++,E--,x.dyn_ltree[2*(d[F]+w+1)]++,x.dyn_dtree[2*O(E)]++),x.last_lit===x.lit_bufsize-1},i._tr_align=function(x){V(x,2,3),$(x,S,J),function(E){E.bi_valid===16?(K(E,E.bi_buf),E.bi_buf=0,E.bi_valid=0):8<=E.bi_valid&&(E.pending_buf[E.pending++]=255&E.bi_buf,E.bi_buf>>=8,E.bi_valid-=8)}(x)}},{"../utils/common":41}],53:[function(t,n,i){n.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(t,n,i){(function(r){(function(o,a){if(!o.setImmediate){var c,m,u,w,y=1,h={},g=!1,f=o.document,v=Object.getPrototypeOf&&Object.getPrototypeOf(o);v=v&&v.setTimeout?v:o,c={}.toString.call(o.process)==="[object process]"?function(A){process.nextTick(function(){_(A)})}:function(){if(o.postMessage&&!o.importScripts){var A=!0,I=o.onmessage;return o.onmessage=function(){A=!1},o.postMessage("","*"),o.onmessage=I,A}}()?(w="setImmediate$"+Math.random()+"$",o.addEventListener?o.addEventListener("message",S,!1):o.attachEvent("onmessage",S),function(A){o.postMessage(w+A,"*")}):o.MessageChannel?((u=new MessageChannel).port1.onmessage=function(A){_(A.data)},function(A){u.port2.postMessage(A)}):f&&"onreadystatechange"in f.createElement("script")?(m=f.documentElement,function(A){var I=f.createElement("script");I.onreadystatechange=function(){_(A),I.onreadystatechange=null,m.removeChild(I),I=null},m.appendChild(I)}):function(A){setTimeout(_,0,A)},v.setImmediate=function(A){typeof A!="function"&&(A=new Function(""+A));for(var I=new Array(arguments.length-1),B=0;B<I.length;B++)I[B]=arguments[B+1];var D={callback:A,args:I};return h[y]=D,c(y),y++},v.clearImmediate=p}function p(A){delete h[A]}function _(A){if(g)setTimeout(_,0,A);else{var I=h[A];if(I){g=!0;try{(function(B){var D=B.callback,W=B.args;switch(W.length){case 0:D();break;case 1:D(W[0]);break;case 2:D(W[0],W[1]);break;case 3:D(W[0],W[1],W[2]);break;default:D.apply(a,W)}})(I)}finally{p(A),g=!1}}}}function S(A){A.source===o&&typeof A.data=="string"&&A.data.indexOf(w)===0&&_(+A.data.slice(w.length))}})(typeof self>"u"?r===void 0?this:r:self)}).call(this,typeof $t<"u"?$t:typeof self<"u"?self:typeof window<"u"?window:{})},{}]},{},[10])(10)})})(Fr);const di=Fr.exports;var gt={},je={};Object.defineProperty(je,"__esModule",{value:!0});je.All=void 0;var ui=function(){function s(){}return s.prototype.all=function(e){for(var t=this.iterator.next();!t.done;t=this.iterator.next())if(!e(t.value))return!1;return!0},s}();je.All=ui;var Fe={};Object.defineProperty(Fe,"__esModule",{value:!0});Fe.Any=void 0;var fi=function(){function s(){}return s.prototype.any=function(e){if(e==null)return!this.iterator.next().done;for(var t=this.iterator.next();!t.done;t=this.iterator.next())if(e(t.value))return!0;return!1},s}();Fe.Any=fi;var Le={};Object.defineProperty(Le,"__esModule",{value:!0});Le.AsIterable=void 0;var pi=function(){function s(){}return s.prototype.asIterable=function(){var e,t=this.iterator;return e={},e[Symbol.iterator]=function(){return t},e},s}();Le.AsIterable=pi;var Ue={};Object.defineProperty(Ue,"__esModule",{value:!0});Ue.Associate=void 0;var gi=function(){function s(){}return s.prototype.associate=function(e){for(var t=new Map,n=this.iterator.next();!n.done;n=this.iterator.next()){var i=e(n.value);t.set(i[0],i[1])}return t},s}();Ue.Associate=gi;var We={};Object.defineProperty(We,"__esModule",{value:!0});We.AssociateBy=void 0;var mi=function(){function s(){}return s.prototype.associateBy=function(e,t){for(var n=typeof e=="function"?e:function(m){return m[e]},i=new Map,r=t!=null?t:function(m){return m},o=this.iterator.next();!o.done;o=this.iterator.next()){var a=n(o.value),c=r(o.value);i.set(a,c)}return i},s}();We.AssociateBy=mi;var Ge={};Object.defineProperty(Ge,"__esModule",{value:!0});Ge.Average=void 0;var vi=function(){function s(){}return s.prototype.average=function(){for(var e=0,t=0,n=this.iterator.next();!n.done;n=this.iterator.next())e+=n.value,t++;return t===0?Number.NaN:e/t},s}();Ge.Average=vi;var qe={};Object.defineProperty(qe,"__esModule",{value:!0});qe.Chunk=void 0;var yi=function(){function s(){}return s.prototype.chunk=function(e){if(e<1)throw new Error("chunkSize must be > 0 but is "+e);for(var t=[],n=0,i=this.iterator.next();!i.done;i=this.iterator.next()){var r=Math.floor(n/e);t[r]==null?t[r]=[i.value]:t[r].push(i.value),n++}return t},s}();qe.Chunk=yi;var He={};Object.defineProperty(He,"__esModule",{value:!0});He.Contains=void 0;var wi=function(){function s(){}return s.prototype.contains=function(e){for(var t=this.iterator.next();!t.done;t=this.iterator.next())if(e===t.value)return!0;return!1},s}();He.Contains=wi;var Ze={};Object.defineProperty(Ze,"__esModule",{value:!0});Ze.Count=void 0;var xi=function(){function s(){}return s.prototype.count=function(e){var t=0;if(e==null)for(var n=this.iterator.next();!n.done;n=this.iterator.next())t++;else for(var n=this.iterator.next();!n.done;n=this.iterator.next())e(n.value)&&t++;return t},s}();Ze.Count=xi;var te={},ar;function _i(){if(ar)return te;ar=1,Object.defineProperty(te,"__esModule",{value:!0}),te.Distinct=void 0;var s=_t(),e=function(){function n(i){this.iterator=i,this.set=new Set}return n.prototype.next=function(i){for(var r=this.iterator.next();!r.done;r=this.iterator.next()){var o=this.set.size;if(this.set.add(r.value),this.set.size>o)return{done:!1,value:r.value}}return this.set.clear(),{done:!0,value:void 0}},n}(),t=function(){function n(){}return n.prototype.distinct=function(){return(0,s.createSequence)(new e(this.iterator))},n}();return te.Distinct=t,te}var ee={},lr;function bi(){if(lr)return ee;lr=1,Object.defineProperty(ee,"__esModule",{value:!0}),ee.DistinctBy=void 0;var s=_t(),e=function(){function n(i,r){this.iterator=i,this.selector=r,this.set=new Set}return n.prototype.next=function(i){for(var r=this.iterator.next();!r.done;r=this.iterator.next()){var o=this.selector(r.value),a=this.set.size;if(this.set.add(o),this.set.size>a)return{done:!1,value:r.value}}return this.set.clear(),{done:!0,value:void 0}},n}(),t=function(){function n(){}return n.prototype.distinctBy=function(i){return(0,s.createSequence)(new e(this.iterator,i))},n}();return ee.DistinctBy=t,ee}var $e={};Object.defineProperty($e,"__esModule",{value:!0});$e.Drop=void 0;var ki=function(){function s(){}return s.prototype.drop=function(e){return this.withIndex().dropWhile(function(t){return t.index<e}).map(function(t){return t.value})},s}();$e.Drop=ki;var ne={},cr;function Si(){if(cr)return ne;cr=1,Object.defineProperty(ne,"__esModule",{value:!0}),ne.DropWhile=void 0;var s=_t(),e=function(){function n(i,r){this.iterator=i,this.predicate=r,this.dropping=!0}return n.prototype.next=function(i){for(var r=this.iterator.next();!r.done;r=this.iterator.next()){if(!this.dropping)return{done:!1,value:r.value};var o=this.predicate(r.value);if(!o)return this.dropping=!1,{done:!1,value:r.value}}return{done:!0,value:void 0}},n}(),t=function(){function n(){}return n.prototype.dropWhile=function(i){return(0,s.createSequence)(new e(this.iterator,i))},n}();return ne.DropWhile=t,ne}var Ve={};Object.defineProperty(Ve,"__esModule",{value:!0});Ve.ElementAt=void 0;var Ei=function(){function s(){}return s.prototype.elementAt=function(e){for(var t=0,n=this.iterator.next();!n.done;n=this.iterator.next()){if(t===e)return n.value;t++}throw new Error("Index out of bounds: "+e)},s}();Ve.ElementAt=Ei;var Ye={};Object.defineProperty(Ye,"__esModule",{value:!0});Ye.ElementAtOrElse=void 0;var Ii=function(){function s(){}return s.prototype.elementAtOrElse=function(e,t){for(var n=0,i=this.iterator.next();!i.done;i=this.iterator.next()){if(n===e)return i.value;n++}return t(e)},s}();Ye.ElementAtOrElse=Ii;var Xe={};Object.defineProperty(Xe,"__esModule",{value:!0});Xe.ElementAtOrNull=void 0;var Ai=function(){function s(){}return s.prototype.elementAtOrNull=function(e){for(var t=0,n=this.iterator.next();!n.done;n=this.iterator.next()){if(t===e)return n.value;t++}return null},s}();Xe.ElementAtOrNull=Ai;var re={},hr;function Ci(){if(hr)return re;hr=1,Object.defineProperty(re,"__esModule",{value:!0}),re.Filter=void 0;var s=_t(),e=function(){function n(i,r){this.predicate=i,this.iterator=r}return n.prototype.next=function(i){for(var r=this.iterator.next();!r.done;r=this.iterator.next())if(this.predicate(r.value))return{done:!1,value:r.value};return{done:!0,value:void 0}},n}(),t=function(){function n(){}return n.prototype.filter=function(i){return(0,s.createSequence)(new e(i,this.iterator))},n}();return re.Filter=t,re}var Ke={};Object.defineProperty(Ke,"__esModule",{value:!0});Ke.FilterIndexed=void 0;var Oi=function(){function s(){}return s.prototype.filterIndexed=function(e){return this.withIndex().filter(function(t){return e(t.index,t.value)}).map(function(t){return t.value})},s}();Ke.FilterIndexed=Oi;var Je={};Object.defineProperty(Je,"__esModule",{value:!0});Je.FilterNot=void 0;var Mi=function(){function s(){}return s.prototype.filterNot=function(e){return this.filter(function(t){return!e(t)})},s}();Je.FilterNot=Mi;var Qe={};Object.defineProperty(Qe,"__esModule",{value:!0});Qe.FilterNotNull=void 0;var zi=function(){function s(){}return s.prototype.filterNotNull=function(){return this.filter(function(e){return e!==null})},s}();Qe.FilterNotNull=zi;var tn={};Object.defineProperty(tn,"__esModule",{value:!0});tn.First=void 0;var Di=function(){function s(){}return s.prototype.first=function(e){if(e!=null)return this.filter(e).first();var t=this.iterator.next();if(t.done)throw new Error("No such element");return t.value},s}();tn.First=Di;var en={};Object.defineProperty(en,"__esModule",{value:!0});en.FirstOrNull=void 0;var Pi=function(){function s(){}return s.prototype.firstOrNull=function(e){if(e!=null)return this.filter(e).firstOrNull();var t=this.iterator.next();return t.done?null:t.value},s.prototype.find=function(e){return this.firstOrNull(e)},s}();en.FirstOrNull=Pi;var ie={},dr;function Bi(){if(dr)return ie;dr=1,Object.defineProperty(ie,"__esModule",{value:!0}),ie.FlatMap=void 0;var s=_t(),e=function(){function n(i,r){this.transform=i,this.iterator=r}return n.prototype.next=function(i){if(this.current!=null){var r=this.current.next();if(!r.done)return r}var o=this.iterator.next();if(!o.done){var a=this.transform(o.value);return this.current=a.iterator,this.next()}return{done:!0,value:void 0}},n}(),t=function(){function n(){}return n.prototype.flatMap=function(i){return(0,s.createSequence)(new e(i,this.iterator))},n}();return ie.FlatMap=t,ie}var se={},ur;function Ti(){if(ur)return se;ur=1,Object.defineProperty(se,"__esModule",{value:!0}),se.Flatten=void 0;var s=_t(),e=function(){function t(){}return t.prototype.flatten=function(){return this.flatMap(function(n){return(0,s.isSequence)(n)?n:(0,s.asSequence)(n)})},t}();return se.Flatten=e,se}var nn={};Object.defineProperty(nn,"__esModule",{value:!0});nn.Fold=void 0;var Ri=function(){function s(){}return s.prototype.fold=function(e,t){for(var n=e,i=this.iterator.next();!i.done;i=this.iterator.next())n=t(n,i.value);return n},s}();nn.Fold=Ri;var rn={};Object.defineProperty(rn,"__esModule",{value:!0});rn.FoldIndexed=void 0;var Ni=function(){function s(){}return s.prototype.foldIndexed=function(e,t){for(var n=e,i=0,r=this.iterator.next();!r.done;r=this.iterator.next())n=t(i,n,r.value),i++;return n},s}();rn.FoldIndexed=Ni;var sn={};Object.defineProperty(sn,"__esModule",{value:!0});sn.ForEach=void 0;var ji=function(){function s(){}return s.prototype.forEach=function(e){for(var t=this.iterator.next();!t.done;t=this.iterator.next())e(t.value)},s}();sn.ForEach=ji;var on={};Object.defineProperty(on,"__esModule",{value:!0});on.ForEachIndexed=void 0;var Fi=function(){function s(){}return s.prototype.forEachIndexed=function(e){this.withIndex().forEach(function(t){return e(t.index,t.value)})},s}();on.ForEachIndexed=Fi;var an={};Object.defineProperty(an,"__esModule",{value:!0});an.GroupBy=void 0;var Li=function(){function s(){}return s.prototype.groupBy=function(e){for(var t=new Map,n=this.iterator.next();!n.done;n=this.iterator.next()){var i=e(n.value),r=t.get(i);r==null?t.set(i,[n.value]):r.push(n.value)}return t},s}();an.GroupBy=Li;var ln={};Object.defineProperty(ln,"__esModule",{value:!0});ln.IndexOf=void 0;var Ui=function(){function s(){}return s.prototype.indexOf=function(e){for(var t=0,n=this.iterator.next();!n.done;n=this.iterator.next()){if(e===n.value)return t;t++}return-1},s}();ln.IndexOf=Ui;var cn={};Object.defineProperty(cn,"__esModule",{value:!0});cn.IndexOfFirst=void 0;var Wi=function(){function s(){}return s.prototype.indexOfFirst=function(e){for(var t=0,n=this.iterator.next();!n.done;n=this.iterator.next()){if(e(n.value))return t;t++}return-1},s}();cn.IndexOfFirst=Wi;var hn={};Object.defineProperty(hn,"__esModule",{value:!0});hn.IndexOfLast=void 0;var Gi=function(){function s(){}return s.prototype.indexOfLast=function(e){for(var t=0,n=-1,i=this.iterator.next();!i.done;i=this.iterator.next())e(i.value)&&(n=t),t++;return n},s}();hn.IndexOfLast=Gi;var dn={};Object.defineProperty(dn,"__esModule",{value:!0});dn.JoinToString=void 0;var zt={value:"",separator:", ",prefix:"",postfix:"",limit:-1,truncated:"...",transform:void 0},qi=function(){function s(){}return s.prototype.joinToString=function(e){e===void 0&&(e=zt);for(var t=e.value,n=t===void 0?zt.value:t,i=e.separator,r=i===void 0?zt.separator:i,o=e.prefix,a=o===void 0?zt.prefix:o,c=e.postfix,m=c===void 0?zt.postfix:c,u=e.limit,w=u===void 0?zt.limit:u,y=e.truncated,h=y===void 0?zt.truncated:y,g=e.transform,f=g===void 0?zt.transform:g,v="".concat(n).concat(a),p=0,_=this.iterator.next();!_.done&&(p++,p>1&&(v+=r),w<0||p<=w);_=this.iterator.next())v+=f!=null?f(_.value):String(_.value);return w>=0&&p>w&&(v+=h),v+=m,v},s.prototype.joinTo=function(e){return e===void 0&&(e=zt),this.joinToString(e)},s}();dn.JoinToString=qi;var un={};Object.defineProperty(un,"__esModule",{value:!0});un.Last=void 0;var Hi=function(){function s(){}return s.prototype.last=function(e){if(e!=null)return this.filter(e).last();for(var t,n=!0,i=this.iterator.next();!i.done;i=this.iterator.next())t=i.value,n=!1;if(n)throw new Error("No such element");return t},s}();un.Last=Hi;var fn={};Object.defineProperty(fn,"__esModule",{value:!0});fn.LastOrNull=void 0;var Zi=function(){function s(){}return s.prototype.lastOrNull=function(e){if(e!=null)return this.filter(e).lastOrNull();for(var t=null,n=this.iterator.next();!n.done;n=this.iterator.next())t=n.value;return t},s.prototype.findLast=function(e){return this.lastOrNull(e)},s}();fn.LastOrNull=Zi;var oe={},fr;function $i(){if(fr)return oe;fr=1,Object.defineProperty(oe,"__esModule",{value:!0}),oe.Map=void 0;var s=_t(),e=function(){function n(i,r){this.transform=i,this.iterator=r}return n.prototype.next=function(i){var r=this.iterator.next();return r.done?{done:!0,value:void 0}:{done:!1,value:this.transform(r.value)}},n}(),t=function(){function n(){}return n.prototype.map=function(i){return(0,s.createSequence)(new e(i,this.iterator))},n}();return oe.Map=t,oe}var pn={};Object.defineProperty(pn,"__esModule",{value:!0});pn.MapIndexed=void 0;var Vi=function(){function s(){}return s.prototype.mapIndexed=function(e){return this.withIndex().map(function(t){return e(t.index,t.value)})},s}();pn.MapIndexed=Vi;var ae={},pr;function Yi(){if(pr)return ae;pr=1,Object.defineProperty(ae,"__esModule",{value:!0}),ae.MapNotNull=void 0;var s=_t(),e=function(){function t(){}return t.prototype.mapNotNull=function(n){return this.flatMap(function(i){var r=n(i);return r!==null?(0,s.sequenceOf)(r):(0,s.emptySequence)()})},t}();return ae.MapNotNull=e,ae}var gn={};Object.defineProperty(gn,"__esModule",{value:!0});gn.Max=void 0;var Xi=function(){function s(){}return s.prototype.max=function(){for(var e=null,t=this.iterator.next();!t.done;t=this.iterator.next())(e==null||t.value>e)&&(e=t.value);return e},s}();gn.Max=Xi;var mn={};Object.defineProperty(mn,"__esModule",{value:!0});mn.MaxBy=void 0;var Ki=function(){function s(){}return s.prototype.maxBy=function(e){for(var t=null,n=null,i=this.iterator.next();!i.done;i=this.iterator.next()){var r=e(i.value);(n==null||r>n)&&(n=r,t=i.value)}return t},s}();mn.MaxBy=Ki;var vn={};Object.defineProperty(vn,"__esModule",{value:!0});vn.MaxWith=void 0;var Ji=function(){function s(){}return s.prototype.maxWith=function(e){for(var t=null,n=this.iterator.next();!n.done;n=this.iterator.next())(t==null||e(n.value,t)>0)&&(t=n.value);return t},s}();vn.MaxWith=Ji;var le={},gr;function Qi(){if(gr)return le;gr=1;var s=$t&&$t.__spreadArray||function(n,i,r){if(r||arguments.length===2)for(var o=0,a=i.length,c;o<a;o++)(c||!(o in i))&&(c||(c=Array.prototype.slice.call(i,0,o)),c[o]=i[o]);return n.concat(c||Array.prototype.slice.call(i))};Object.defineProperty(le,"__esModule",{value:!0}),le.Merge=void 0;var e=_t(),t=function(){function n(){}return n.prototype.merge=function(i,r,o){o===void 0&&(o=!1);var a=(0,e.isSequence)(i)?i.toArray():(0,e.asSequence)(i).toArray(),c=this.toArray(),m=c.map(function(u){var w=r(u),y=(0,e.asSequence)(a).find(function(h){return r(h)===w});return y!=null?(a=a.filter(function(h){return h!==y}),y):u});return o?(0,e.asSequence)(s(s([],a,!0),m,!0)):(0,e.asSequence)(s(s([],m,!0),a,!0))},n}();return le.Merge=t,le}var yn={};Object.defineProperty(yn,"__esModule",{value:!0});yn.Min=void 0;var ts=function(){function s(){}return s.prototype.min=function(){for(var e=null,t=this.iterator.next();!t.done;t=this.iterator.next())(e==null||t.value<e)&&(e=t.value);return e},s}();yn.Min=ts;var wn={};Object.defineProperty(wn,"__esModule",{value:!0});wn.MinBy=void 0;var es=function(){function s(){}return s.prototype.minBy=function(e){for(var t=null,n=null,i=this.iterator.next();!i.done;i=this.iterator.next()){var r=e(i.value);(n==null||r<n)&&(n=r,t=i.value)}return t},s}();wn.MinBy=es;var ce={},mr;function ns(){if(mr)return ce;mr=1,Object.defineProperty(ce,"__esModule",{value:!0}),ce.Minus=void 0;var s=_t(),e=function(){function t(){}return t.prototype.minus=function(n){if((0,s.isSequence)(n)){var i=n.toArray();return this.filter(function(r){return i.indexOf(r)<0})}else return n instanceof Array?this.filter(function(r){return n.indexOf(r)<0}):this.filter(function(r){return r!==n})},t}();return ce.Minus=e,ce}var xn={};Object.defineProperty(xn,"__esModule",{value:!0});xn.MinWith=void 0;var rs=function(){function s(){}return s.prototype.minWith=function(e){for(var t=null,n=this.iterator.next();!n.done;n=this.iterator.next())(t==null||e(n.value,t)<0)&&(t=n.value);return t},s}();xn.MinWith=rs;var _n={};Object.defineProperty(_n,"__esModule",{value:!0});_n.None=void 0;var is=function(){function s(){}return s.prototype.none=function(e){var t,n;if(e==null)return(n=(t=this.iterator.next())===null||t===void 0?void 0:t.done)!==null&&n!==void 0?n:!1;for(var i=this.iterator.next();!i.done;i=this.iterator.next())if(e(i.value))return!1;return!0},s}();_n.None=is;var bn={};Object.defineProperty(bn,"__esModule",{value:!0});bn.OnEach=void 0;var ss=function(){function s(){}return s.prototype.onEach=function(e){return this.map(function(t){return e(t),t})},s}();bn.OnEach=ss;var kn={};Object.defineProperty(kn,"__esModule",{value:!0});kn.Partition=void 0;var os=function(){function s(){}return s.prototype.partition=function(e){for(var t=[],n=[],i=this.iterator.next();!i.done;i=this.iterator.next())e(i.value)?t.push(i.value):n.push(i.value);return{true:t,false:n}},s}();kn.Partition=os;var he={},vr;function as(){if(vr)return he;vr=1,Object.defineProperty(he,"__esModule",{value:!0}),he.Plus=void 0;var s=_t(),e=function(){function n(i,r){this.first=i,this.second=r}return n.prototype.next=function(i){var r=this.first.next();if(!r.done)return{done:!1,value:r.value};var o=this.second.next();return o.done?{done:!0,value:void 0}:{done:!1,value:o.value}},n}(),t=function(){function n(){}return n.prototype.plus=function(i){if((0,s.isSequence)(i))return(0,s.createSequence)(new e(this.iterator,i.iterator));if(i instanceof Array){var r=i[Symbol.iterator]();return(0,s.createSequence)(new e(this.iterator,r))}else{var r=[i][Symbol.iterator]();return(0,s.createSequence)(new e(this.iterator,r))}},n}();return he.Plus=t,he}var Sn={};Object.defineProperty(Sn,"__esModule",{value:!0});Sn.Reduce=void 0;var ls=function(){function s(){}return s.prototype.reduce=function(e){var t=this.iterator.next();if(t.done)throw new Error("Cannot reduce empty sequence");for(var n=t.value,i=this.iterator.next();!i.done;i=this.iterator.next())n=e(n,i.value);return n},s}();Sn.Reduce=ls;var En={};Object.defineProperty(En,"__esModule",{value:!0});En.ReduceIndexed=void 0;var cs=function(){function s(){}return s.prototype.reduceIndexed=function(e){var t=this.iterator.next();if(t.done)throw new Error("Cannot reduce empty sequence");for(var n=1,i=t.value,r=this.iterator.next();!r.done;r=this.iterator.next())i=e(n,i,r.value),n++;return i},s}();En.ReduceIndexed=cs;var In={};Object.defineProperty(In,"__esModule",{value:!0});In.Reverse=void 0;var hs=function(){function s(){}return s.prototype.reverse=function(){return this.withIndex().sortedByDescending(function(e){return e.index}).map(function(e){return e.value})},s}();In.Reverse=hs;var An={};Object.defineProperty(An,"__esModule",{value:!0});An.Single=void 0;var ds=function(){function s(){}return s.prototype.single=function(e){if(e!=null)return this.filter(e).single();var t=this.iterator.next();if(t.done)throw new Error("No such element");if(!this.iterator.next().done)throw new Error("Expect single element");return t.value},s}();An.Single=ds;var Cn={};Object.defineProperty(Cn,"__esModule",{value:!0});Cn.SingleOrNull=void 0;var us=function(){function s(){}return s.prototype.singleOrNull=function(e){if(e!=null)return this.filter(e).singleOrNull();var t=this.iterator.next();return t.done||!this.iterator.next().done?null:t.value},s}();Cn.SingleOrNull=us;var de={},Hn={};Object.defineProperty(Hn,"__esModule",{value:!0});function Ct(s){return Object.assign(s,{reversed:function(){return Ct(function(e,t){return s(e,t)*-1})},then:function(e){return Ct(function(t,n){var i=s(t,n);return i!==0?i:e(t,n)})},thenDescending:function(e){return this.then(Ct(e).reversed())},thenBy:function(e){var t=Be(e);return this.then(function(n,i){return Xt(t(n),t(i))})},thenByDescending:function(e){var t=Be(e);return this.then(Ct(function(n,i){return Xt(t(n),t(i))}).reversed())}})}function fs(s){var e=Be(s);return Ct(function(t,n){return Xt(e(t),e(n))})}function ps(s){var e=Be(s);return Ct(function(t,n){return Xt(e(n),e(t))})}function Be(s){return typeof s=="function"?s:function(e){return e[s]}}function Xt(s,e){return s<e?-1:s>e?1:0}function gs(){return Ct(Xt)}function ms(){return Ct(Xt).reversed()}function vs(){return Ct(function(s,e){return s===null?1:e===null?-1:0})}function ys(){return Ct(function(s,e){return s===null?-1:e===null?1:0})}function ws(){return{compare:Ct,compareBy:fs,compareByDescending:ps,naturalOrder:gs,reverseOrder:ms,nullsFirst:ys,nullsLast:vs}}Hn.default=ws;var yr;function xs(){if(yr)return de;yr=1,Object.defineProperty(de,"__esModule",{value:!0}),de.Sorted=void 0;var s=_t(),e=Hn,t=function(){function n(){}return n.prototype.sorted=function(i){for(var r=[],o=this.iterator.next();!o.done;o=this.iterator.next())r.push(o.value);if(i==null)r.sort();else{var a=(0,e.default)(),c=i(a);r.sort(c)}var m=r[Symbol.iterator]();return(0,s.createSequence)(m)},n}();return de.Sorted=t,de}var On={};Object.defineProperty(On,"__esModule",{value:!0});On.SortedBy=void 0;var _s=function(){function s(){}return s.prototype.sortedBy=function(e){return this.sorted(function(t){return t.compareBy(e)})},s}();On.SortedBy=_s;var Mn={};Object.defineProperty(Mn,"__esModule",{value:!0});Mn.SortedByDescending=void 0;var bs=function(){function s(){}return s.prototype.sortedByDescending=function(e){return this.sorted(function(t){return t.compareByDescending(e)})},s}();Mn.SortedByDescending=bs;var zn={};Object.defineProperty(zn,"__esModule",{value:!0});zn.SortedDescending=void 0;var ks=function(){function s(){}return s.prototype.sortedDescending=function(){return this.sorted(function(e){return e.reverseOrder()})},s}();zn.SortedDescending=ks;var Dn={};Object.defineProperty(Dn,"__esModule",{value:!0});Dn.SortedWith=void 0;var Ss=function(){function s(){}return s.prototype.sortedWith=function(e){return this.sorted(function(t){return t.compare(e)})},s}();Dn.SortedWith=Ss;var Pn={};Object.defineProperty(Pn,"__esModule",{value:!0});Pn.Sum=void 0;var Es=function(){function s(){}return s.prototype.sum=function(){for(var e=0,t=this.iterator.next();!t.done;t=this.iterator.next())e+=t.value;return e},s}();Pn.Sum=Es;var Bn={};Object.defineProperty(Bn,"__esModule",{value:!0});Bn.SumBy=void 0;var Is=function(){function s(){}return s.prototype.sumBy=function(e){for(var t=0,n=this.iterator.next();!n.done;n=this.iterator.next())t+=e(n.value);return t},s}();Bn.SumBy=Is;var Tn={};Object.defineProperty(Tn,"__esModule",{value:!0});Tn.Take=void 0;var As=function(){function s(){}return s.prototype.take=function(e){return this.withIndex().takeWhile(function(t){return t.index<e}).map(function(t){return t.value})},s}();Tn.Take=As;var ue={},wr;function Cs(){if(wr)return ue;wr=1,Object.defineProperty(ue,"__esModule",{value:!0}),ue.TakeWhile=void 0;var s=_t(),e=function(){function n(i,r){this.iterator=i,this.predicate=r}return n.prototype.next=function(i){var r=this.iterator.next();if(!r.done){var o=this.predicate(r.value);if(o)return{done:!1,value:r.value}}return{done:!0,value:void 0}},n}(),t=function(){function n(){}return n.prototype.takeWhile=function(i){return(0,s.createSequence)(new e(this.iterator,i))},n}();return ue.TakeWhile=t,ue}var Rn={};Object.defineProperty(Rn,"__esModule",{value:!0});Rn.ToArray=void 0;var Os=function(){function s(){}return s.prototype.toArray=function(e){for(var t=e||[],n=this.iterator.next();!n.done;n=this.iterator.next())t.push(n.value);return t},s.prototype.toList=function(e){return this.toArray(e)},s}();Rn.ToArray=Os;var Nn={};Object.defineProperty(Nn,"__esModule",{value:!0});Nn.ToMap=void 0;var Ms=function(){function s(){}return s.prototype.toMap=function(e){for(var t=e||new Map,n=this.iterator.next();!n.done;n=this.iterator.next()){var i=n.value,r=i[0],o=i[1];t.set(r,o)}return t},s}();Nn.ToMap=Ms;var jn={};Object.defineProperty(jn,"__esModule",{value:!0});jn.ToSet=void 0;var zs=function(){function s(){}return s.prototype.toSet=function(e){for(var t=e||new Set,n=this.iterator.next();!n.done;n=this.iterator.next())t.add(n.value);return t},s}();jn.ToSet=zs;var Fn={};Object.defineProperty(Fn,"__esModule",{value:!0});Fn.Unzip=void 0;var Ds=function(){function s(){}return s.prototype.unzip=function(){for(var e=[],t=[],n=this.iterator.next();!n.done;n=this.iterator.next()){var i=n.value,r=i[0],o=i[1];e.push(r),t.push(o)}return[e,t]},s}();Fn.Unzip=Ds;var fe={},xr;function Ps(){if(xr)return fe;xr=1,Object.defineProperty(fe,"__esModule",{value:!0}),fe.WithIndex=void 0;var s=_t(),e=function(){function n(i){this.iterator=i,this.index=-1}return n.prototype.next=function(i){var r=this.iterator.next();return r.done?{done:!0,value:void 0}:(this.index++,{done:!1,value:{index:this.index,value:r.value}})},n}(),t=function(){function n(){}return n.prototype.withIndex=function(){return(0,s.createSequence)(new e(this.iterator))},n}();return fe.WithIndex=t,fe}var pe={},_r;function Bs(){if(_r)return pe;_r=1,Object.defineProperty(pe,"__esModule",{value:!0}),pe.Zip=void 0;var s=_t(),e=function(){function n(i,r){this.iterator1=i,this.iterator2=r}return n.prototype.next=function(i){var r=this.iterator1.next(),o=this.iterator2.next();return r.done||o.done?{done:!0,value:void 0}:{done:!1,value:[r.value,o.value]}},n}(),t=function(){function n(){}return n.prototype.zip=function(i){return(0,s.createSequence)(new e(this.iterator,i.iterator))},n}();return pe.Zip=t,pe}var Zn={};Object.defineProperty(Zn,"__esModule",{value:!0});var Ts=function(){function s(e){this.nextFunction=e}return s.prototype.next=function(e){var t=this.nextFunction();return{done:t==null,value:t}},s}();Zn.default=Ts;var $n={};Object.defineProperty($n,"__esModule",{value:!0});var Rs=function(){function s(e,t){this.seed=e,this.nextFunction=t}return s.prototype.next=function(e){if(this.prevItem==null)return this.prevItem=this.seed,{done:!1,value:this.seed};var t=this.nextFunction(this.prevItem);return t==null?{done:!0,value:void 0}:(this.prevItem=t,{done:!1,value:t})},s}();$n.default=Rs;var br;function _t(){if(br)return gt;br=1,Object.defineProperty(gt,"__esModule",{value:!0}),gt.range=gt.generateSequence=gt.extendSequence=gt.isSequence=gt.createSequence=gt.asSequence=gt.emptySequence=gt.sequenceOf=void 0;var s=je,e=Fe,t=Le,n=Ue,i=We,r=Ge,o=qe,a=He,c=Ze,m=_i(),u=bi(),w=$e,y=Si(),h=Ve,g=Ye,f=Xe,v=Ci(),p=Ke,_=Je,S=Qe,A=tn,I=en,B=Bi(),D=Ti(),W=nn,P=rn,Z=sn,J=on,k=an,T=ln,d=cn,j=hn,tt=dn,U=un,et=fn,G=$i(),Q=pn,M=Yi(),O=gn,K=mn,V=vn,$=Qi(),ht=yn,mt=wn,nt=ns(),it=xn,pt=_n,dt=bn,Et=kn,St=as(),l=Sn,R=En,z=In,b=An,x=Cn,E=xs(),F=On,L=Mn,C=zn,q=Dn,Y=Pn,H=Bn,X=Tn,st=Cs(),rt=Rn,bt=Nn,Rt=jn,It=Fn,Nt=Ps(),ut=Bs(),qt=Zn,Kt=$n,kt=function(){function ot(yt){this.iterator=yt}return ot}();Jt(kt,[s.All,e.Any,t.AsIterable,n.Associate,i.AssociateBy,r.Average,o.Chunk,a.Contains,c.Count,m.Distinct,u.DistinctBy,w.Drop,y.DropWhile,h.ElementAt,g.ElementAtOrElse,f.ElementAtOrNull,v.Filter,p.FilterIndexed,_.FilterNot,S.FilterNotNull,A.First,I.FirstOrNull,B.FlatMap,D.Flatten,W.Fold,P.FoldIndexed,Z.ForEach,J.ForEachIndexed,k.GroupBy,T.IndexOf,d.IndexOfFirst,j.IndexOfLast,tt.JoinToString,U.Last,et.LastOrNull,G.Map,Q.MapIndexed,M.MapNotNull,O.Max,K.MaxBy,V.MaxWith,$.Merge,ht.Min,mt.MinBy,nt.Minus,it.MinWith,pt.None,dt.OnEach,Et.Partition,St.Plus,l.Reduce,R.ReduceIndexed,z.Reverse,b.Single,x.SingleOrNull,E.Sorted,F.SortedBy,L.SortedByDescending,C.SortedDescending,q.SortedWith,Y.Sum,H.SumBy,X.Take,st.TakeWhile,rt.ToArray,bt.ToMap,Rt.ToSet,It.Unzip,Nt.WithIndex,ut.Zip]);function Jt(ot,yt){yt.forEach(function(Mt){Object.getOwnPropertyNames(Mt.prototype).forEach(function(Zt){ot.prototype[Zt]=Mt.prototype[Zt]})})}function Wn(){for(var ot=[],yt=0;yt<arguments.length;yt++)ot[yt]=arguments[yt];return Qt(ot)}gt.sequenceOf=Wn;function we(){return Qt([])}gt.emptySequence=we;function Qt(ot){if(ot===null)throw new Error("Cannot create sequence for input: null");if(ot===void 0)throw new Error("Cannot create sequence for input: undefined");if(ot[Symbol.iterator]==null)throw new Error("Cannot create sequence for non-iterable input: "+ot);var yt=ot[Symbol.iterator]();return jt(yt)}gt.asSequence=Qt;function jt(ot){return new kt(ot)}gt.createSequence=jt;function Ft(ot){return ot instanceof kt}gt.isSequence=Ft;function Ht(ot){Jt(kt,[ot])}gt.extendSequence=Ht;function Jn(ot,yt){if(typeof ot=="function"&&yt==null)return jt(new qt.default(ot));var Mt=typeof ot=="function"?ot():ot;return Mt!=null?jt(new Kt.default(Mt,yt)):we()}gt.generateSequence=Jn;function Gr(ot,yt,Mt){if(Mt===void 0&&(Mt=1),ot>yt)throw new Error("start [".concat(ot,"] must be lower then endInclusive [").concat(yt,"]"));var Zt=ot;return Jn(function(){try{return Zt<=yt?Zt:void 0}finally{Zt+=Mt}})}return gt.range=Gr,gt}var be=_t();const Ns=""+new URL("Archisurance.f50715de.archimate",import.meta.url).href;class me{static async GetDefaultProjectData(){return(await fetch(Ns)).arrayBuffer()}static async GetProjectFromArrayBuffer(e){const t=new Int8Array(e.slice(0,2));let n=e,i=null;new TextDecoder().decode(t)==="PK"&&(i=await di.loadAsync(e),n=await i.file("model.xml").async("arraybuffer"));const r=new TextDecoder().decode(n),a=new DOMParser().parseFromString(r,"application/xml");return me.GetFromDocument(a,i)}static GetFromDocument(e,t){const n=Array.from(e.children[0].children).map(i=>this.ToFolder(i));return new Vn(n,e.firstElementChild,t)}static ToFolder(e){const t=new js;return t.name=e.getAttribute("name"),t.id=e.getAttribute("id"),t.type=e.getAttribute("type"),t.diagrams=[],t.folders=[],Array.from(e.children).forEach(n=>{n.localName=="folder"?t.folders.push(this.ToFolder(n)):n.localName=="element"?t.diagrams.push(this.ToArchiObject(n)):n.localName=="purpose"}),t}static ToArchiObject(e){let t=e.getAttribute("xsi:type");t.startsWith("archimate:")&&(t=t.substring(10)),t.startsWith("canvas:")&&(t=t.substring(7));let n;return t.endsWith("Relationship")?n=this.deserializeRelationShip(t,e):t==="ArchimateDiagramModel"?n=this.deserializeDiagram(t,e):t==="CanvasModel"?n=this.deserializeDiagram(t,e):t=="SketchModel"?n=this.deserializeDiagram(t,e):n=this.deserializeEntity(t,e),n}static deserializeDiagram(e,t){const n=Array.from(t.children).filter(r=>r.nodeName=="children"||r.nodeName=="child").map(r=>this.deserializeDiagramChild(r,null)),i=new Lr(n);return this.deserializeEntity(e,t,i),i}static deserializeRelationShip(e,t){var i,r;const n=new Ie;return n.source=(i=t.getAttribute("source"))!=null?i:ke(t.getElementsByTagName("source")[0]),n.target=(r=t.getAttribute("target"))!=null?r:ke(t.getElementsByTagName("target")[0]),this.deserializeEntity(e,t,n),n}static deserializeEntity(e,t,n=null){var i,r;return n=n!=null?n:new ye,n.entityType=e,n.id=t.getAttribute("id"),n.name=t.getAttribute("name"),n.documentation=(r=t.getAttribute("documentation"))!=null?r:(i=t.getElementsByTagName("documentation")[0])==null?void 0:i.textContent,n.subType=t.getAttribute("type"),n.element=t,n}static deserializeArchiSourceConnection(e,t){var o;const n=new Wr;n.source=t,n.targetId=e.getAttribute("target"),n.name=e.getAttribute("name"),n.relationShipId=(o=e.getAttribute("archimateRelationship"))!=null?o:ke(e.getElementsByTagName("archimateRelationship")[0]);const i=Array.from(e.children).filter(a=>a.nodeName==="bendpoints"||a.nodeName==="bendpoint");n.bendPoints=i.map(a=>{var c,m;return new xt(parseFloat((c=a.getAttribute("startX"))!=null?c:"0"),parseFloat((m=a.getAttribute("startY"))!=null?m:"0"))}),n.lineWidth=e.getAttribute("lineWidth"),n.lineColor=e.getAttribute("lineColor");const r=e.getAttribute("type");return r&&(n.type=parseInt(r)),this.deserializeDiagramObject(e,n),n}static deserializeDiagramChild(e,t){var w,y,h,g,f,v,p,_;const n=new Ln;n.parent=t,n.entityType=e.getAttribute("xsi:type"),n.entityType.startsWith("archimate:")&&(n.entityType=n.entityType.substring(10)),n.name=e.getAttribute("name"),n.documentation=e.getAttribute("documentation"),n.imagePath=e.getAttribute("imagePath");const i=e.getAttribute("imagePosition");i&&(n.imagePosition=parseInt(i));const r=e.getAttribute("opacity");r&&(n.opacity=Number(r));const o=e.getAttribute("outlineOpacity");o&&(n.outlineOpacity=Number(o));const a=e.getAttribute("alpha");a&&(n.alpha=Number(a));const c=e.getAttribute("textPosition");c&&(n.textPosition=parseInt(c));const m=e.getAttribute("textAlignment");m&&(n.textAlignment=parseInt(m)),n.borderColor=e.getAttribute("borderColor"),n.entityId=(y=(w=e.getAttribute("archimateElement"))!=null?w:e.getAttribute("model"))!=null?y:ke(e.getElementsByClassName("archimateElement")[0]),n.figureType=parseInt((h=e.getAttribute("type"))!=null?h:"0");const u=e.getElementsByTagName("bounds")[0];return n.bounds=new Wt(parseFloat((g=u.getAttribute("x"))!=null?g:"0"),parseFloat((f=u.getAttribute("y"))!=null?f:"0"),parseFloat((v=u.getAttribute("width"))!=null?v:"165"),parseFloat((p=u.getAttribute("height"))!=null?p:"58")),n.fillColor=e.getAttribute("fillColor"),n.fontColor=e.getAttribute("fontColor"),n.font=e.getAttribute("font"),n.content=(_=e.querySelector(":scope>content"))==null?void 0:_.textContent,n.children=Array.from(e.children).filter(S=>S.nodeName=="children"||S.nodeName=="child").map(S=>this.deserializeDiagramChild(S,n)),this.deserializeDiagramObject(e,n),n}static deserializeDiagramObject(e,t){t.element=e,t.id=e.getAttribute("id");const n=Array.from(e.children).filter(i=>i.nodeName.startsWith("sourceConnection"));t.sourceConnections=n.map(i=>this.deserializeArchiSourceConnection(i,t))}}class Vn{constructor(e,t,n){N(this,"element");N(this,"name");N(this,"id");N(this,"version");N(this,"entitiesById");N(this,"relationshipsById");N(this,"getById",e=>this.entitiesById.get(e));N(this,"getTargetRelationShips",(e,t)=>this.relationships.filter(n=>n.target===e&&(!t||t==n.entityType)));N(this,"getSourceRelationShips",(e,t)=>this.relationships.filter(n=>n.source===e&&(!t||t==n.entityType)));N(this,"getRelatedElementForTarget",(e,t,n)=>this.getTargetRelationShips(e,t).map(i=>this.getById(i.source)).filter(i=>!n||n==i.entityType));N(this,"getRelatedElementForSource",(e,t,n)=>this.getSourceRelationShips(e,t).map(i=>this.getById(i.target)).filter(i=>!n||n==i.entityType));N(this,"getDiagramsWithElementId",e=>this.diagrams.filter(t=>t.descendants.some(n=>n.id===e)));this.folders=e,this.zip=n,this.element=t,this.name=t.getAttribute("name"),this.version=t.getAttribute("version"),this.id=t.getAttribute("id");const i=Vn.getEntitiesFromFolders(e);this.entitiesById=new Map,i.forEach(r=>this.entitiesById.set(r.id,r)),this.relationshipsById=new Map,i.filter(r=>r instanceof Ie).forEach(r=>this.relationshipsById.set(r.id,r))}get diagrams(){return be.asSequence(this.entitiesById.values()).filter(e=>e instanceof Lr).map(e=>e).toArray()}get relationships(){return be.asSequence(this.relationshipsById.values())}get entities(){return be.asSequence(this.entitiesById.values()).filter(e=>!(e instanceof Ie))}static getEntitiesFromFolders(e){const t=[];return e.forEach(n=>this.getArchiEntities(n,t)),t}static getArchiEntities(e,t){e.folders.forEach(n=>this.getArchiEntities(n,t)),e.diagrams.forEach(n=>t.push(n))}getImage(e){return this.zip?this.zip.file(e).async("uint8array"):null}getUnused(){const e=this.diagrams.flatMap(i=>i.descendantsWithSourceConnections).map(i=>{var r;return(r=i.entityId)!=null?r:i.relationShipId}).filter(i=>i).concat(this.diagrams.map(i=>i.id)),t=new Set(e);return be.asSequence(this.entitiesById.values()).filter(i=>!t.has(i.id)).toArray()}removeEntity(e){this.entitiesById.delete(e.id),e instanceof Ie&&this.relationshipsById.delete(e.id)}addEntity(e){this.entitiesById.set(e.id,e)}}class js{constructor(){N(this,"name");N(this,"id");N(this,"type");N(this,"diagrams");N(this,"folders")}}class ye{constructor(){N(this,"element");N(this,"entityType");N(this,"filePath");N(this,"name");N(this,"id");N(this,"documentation");N(this,"subType")}}class Ie extends ye{constructor(){super(...arguments);N(this,"source");N(this,"target")}}class Lr extends ye{constructor(t){super();N(this,"children");N(this,"childById");this.children=t,this.childById=new Map(this.descendantsWithSourceConnections.map(n=>[n.id,n]))}getDiagramObjectById(t){return this.childById.get(t)}get descendants(){return this.Flatten(this.children)}get descendantsWithSourceConnections(){return this.flattenWithSourceConnections(this.children)}Flatten(t){return t.concat(t.flatMap(n=>this.Flatten(n.children)))}flattenWithSourceConnections(t){return t.concat(t.flatMap(n=>{let i=this.flattenWithSourceConnections(n.sourceConnections);return n instanceof Ln&&(i=i.concat(this.flattenWithSourceConnections(n.children))),i}))}setElement(t,n){t.parent?t.parent.children=t.parent.children.filter(i=>i.id!=t.id):this.children=this.children.filter(i=>i.id!=t.id),this.childById.set(t.id,t),n?n.children=[...n.children,t]:this.children=[...this.children,t],t.parent=n}removeElement(t){this.childById.delete(t.id),t.parent?t.parent.children=t.parent.children.filter(n=>n.id!=t.id):this.children=this.children.filter(n=>n.id!=t.id),t.parent=null}}class Ur{constructor(){N(this,"element");N(this,"id");N(this,"sourceConnections")}}class Ln extends Ur{constructor(){super(...arguments);N(this,"parent");N(this,"children");N(this,"name");N(this,"documentation");N(this,"entityType");N(this,"entityId");N(this,"bounds");N(this,"fillColor");N(this,"fontColor");N(this,"font");N(this,"figureType");N(this,"content");N(this,"imagePath");N(this,"imagePosition");N(this,"alpha");N(this,"textPosition");N(this,"textAlignment");N(this,"borderColor");N(this,"outlineOpacity");N(this,"opacity")}get AbsolutePosition(){var n,i;return((i=(n=this.parent)==null?void 0:n.AbsolutePosition)!=null?i:xt.Zero).add(new xt(this.bounds.x,this.bounds.y))}}var Ae=(s=>(s[s.TopLeft=0]="TopLeft",s[s.TopCentre=1]="TopCentre",s[s.TopRight=2]="TopRight",s[s.MiddleLeft=3]="MiddleLeft",s[s.MiddleCentre=4]="MiddleCentre",s[s.MiddleRight=5]="MiddleRight",s[s.BottomLeft=6]="BottomLeft",s[s.BottomCentre=7]="BottomCentre",s[s.BottomRight=8]="BottomRight",s[s.Fill=9]="Fill",s))(Ae||{}),Ce=(s=>(s[s.Top=0]="Top",s[s.Middle=1]="Middle",s[s.Bottom=2]="Bottom",s))(Ce||{}),Oe=(s=>(s[s.Left=0]="Left",s[s.Centre=2]="Centre",s[s.Right=4]="Right",s))(Oe||{});class Wr extends Ur{constructor(){super(...arguments);N(this,"bendPoints");N(this,"targetId");N(this,"relationShipId");N(this,"lineWidth");N(this,"lineColor");N(this,"fillColor");N(this,"name");N(this,"source");N(this,"type")}}var Dt=(s=>(s[s.LineSolid=0]="LineSolid",s[s.ArrowFillTarget=1]="ArrowFillTarget",s[s.LineDashed=2]="LineDashed",s[s.LineDotted=4]="LineDotted",s[s.ArrowFillSource=8]="ArrowFillSource",s[s.ArrowHollowTarget=16]="ArrowHollowTarget",s[s.ArrowHollowSource=32]="ArrowHollowSource",s[s.ArrowLineTarget=64]="ArrowLineTarget",s[s.ArrowLineSource=128]="ArrowLineSource",s))(Dt||{});function ke(s){return s==null?null:s.getAttribute("href").split("#")[1]}const Lt=class{constructor(e,t){N(this,"clone",()=>new Lt(this.x,this.y));N(this,"add",e=>new Lt(this.x+e.x,this.y+e.y));N(this,"subtract",e=>new Lt(this.x-e.x,this.y-e.y));N(this,"multiply",e=>new Lt(this.x*e,this.y*e));this.x=e,this.y=t}static IsInsideBounds(e,t,n={x:0,y:0},i=4){return e.x>=t.x-Math.max(n.x,i)&&e.x<=t.x+Math.max(n.x,i)&&e.y>=t.y-Math.max(n.y,i)&&e.y<=t.y+Math.max(n.y,i)}};let xt=Lt;N(xt,"Zero",new Lt(0,0));const Xn=class{constructor(e,t,n,i){this.x=e,this.y=t,this.width=n,this.height=i}};let Wt=Xn;N(Wt,"Zero",new Xn(0,0,0,0));class Ot{constructor(e,t,n,i){N(this,"contentElement");N(this,"selectedElementId");N(this,"selectedElementIdDoubleClicked");N(this,"startDragMousePosition");N(this,"startDragMouseOffset");N(this,"activeDragging");N(this,"changeManager");N(this,"keyDownFunction",e=>this.onKeyDown(e));N(this,"pointerMoveFunction",e=>this.onPointerMove(e));N(this,"pointerUpFunction",e=>this.onPointerUp(e));this.svg=e,this.project=t,this.diagram=n,this.renderer=i,this.contentElement=e.querySelector("svg>g"),this.changeManager=new Ws(t,new Yn(i,t))}get selectedElement(){return this.contentElement.ownerSVGElement.getElementById(this.selectedElementId)}makeDraggable(){this.svg.addEventListener("touchstart",e=>this.onTouchStart(e)),this.svg.addEventListener("pointerdown",e=>this.onPointerDown(e)),this.svg.addEventListener("focusout",e=>this.onFocusOut(e)),this.svg.addEventListener("input",e=>this.onInput(e)),this.svg.ownerDocument.addEventListener("keydown",this.keyDownFunction),this.svg.ownerDocument.addEventListener("pointermove",this.pointerMoveFunction),this.svg.ownerDocument.addEventListener("pointerup",this.pointerUpFunction)}dispose(){this.svg.ownerDocument.removeEventListener("keydown",this.keyDownFunction),this.svg.ownerDocument.removeEventListener("pointermove",this.pointerMoveFunction),this.svg.ownerDocument.removeEventListener("pointerup",this.pointerUpFunction)}onKeyDown(e){const n=e.target.closest(".element");e.key=="Enter"&&!n.classList.contains("note")||e.key=="Escape"?(e.target.blur(),this.selectedElementId=null,this.renderer.highlightedElementId=null,this.renderer.selectedRelationId=null,this.renderer.removeElementSelections()):e.key=="F2"?this.selectedElementId&&this.editElementText(this.selectedElement):e.key=="z"&&e.ctrlKey?this.changeManager.undo():e.key=="y"&&e.ctrlKey&&this.changeManager.redo()}onFocusOut(e){if(this.changeManager.activeAction==lt.Edit){const t=this.changeManager.currentChange.edit,i=e.target.closest(".element");if((i==null?void 0:i.id)==t.elementId){const r=this.svg.getElementById(t.elementId);t.textNew=this.getTextFromElement(r),this.changeManager.finalizeChange()}}}onInput(e){if(this.changeManager.activeAction==lt.Edit){const t=this.changeManager.currentChange.edit,n=this.svg.getElementById(t.elementId);let i=this.getTextFromElement(n);if(i.length==t.textNew.length+2&&i.substring(0,i.length-2)==t.textNew&&i[i.length-2]==`
`){const r=n.querySelector(":scope>foreignObject>div>div");r.childNodes[r.childNodes.length-2].remove(),i=i.substring(0,i.length)}t.textNew=i,this.changeManager.updateChange()}}onTouchStart(e){console.log("onTouchStart "+this.changeManager.activeAction||this.selectedElement),(this.changeManager.activeAction||this.selectedElement)&&(e.preventDefault(),e.stopImmediatePropagation())}onPointerDown(e){var r,o;if(this.changeManager.activeAction==lt.Edit)return;if(this.changeManager.activeAction){this.changeManager.finalizeChange();return}const t=e.target;let n=(r=t.closest(".element"))==null?void 0:r.id;t.tagName==="circle"&&t.parentElement.classList.contains("selection")&&(n=t.parentElement.getAttribute("data-element-id")),this.selectedElementIdDoubleClicked=n==this.selectedElementId,this.selectedElementId=n,this.renderer.highlightedElementId=n,this.renderer.selectedRelationId=(o=t.closest(".con"))==null?void 0:o.id;const i=e.ctrlKey;this.activeDragging=!1,e.preventDefault(),e.stopImmediatePropagation(),this.startDragMousePosition=this.getMousePosition(e),t.tagName==="circle"&&t.parentElement.classList.contains("selection")?this.editResizeStart(t):this.selectedElementId?this.editMoveStart():t.tagName==="circle"&&t.parentElement.classList.contains("con")&&!t.classList.contains("end")&&this.editConnectionStart(t),this.doElementSelection(i)}onPointerMove(e){if(!this.changeManager.isActive||this.changeManager.activeAction==lt.Edit)return;const t=this.getMousePosition(e),n={x:t.x-this.startDragMousePosition.x,y:t.y-this.startDragMousePosition.y},i=Math.sqrt(n.x**2+n.y**2);if(this.activeDragging||i>=5&&(this.activeDragging=!0),!this.activeDragging)return;document.activeElement instanceof HTMLElement&&document.activeElement.blur();const r=!e.ctrlKey;this.changeManager.activeAction==lt.Move?this.editMoveMove(t,r):this.changeManager.activeAction==lt.Resize?this.editResizeMove(n,r):this.changeManager.activeAction==lt.Connection&&this.editConnectionEdit(n,t,r)}onPointerUp(e){if(!!this.changeManager.isActive&&this.changeManager.activeAction!=lt.Edit){if(this.activeDragging)this.changeManager.finalizeChange();else{const t=e.ctrlKey,n=e.target;if(this.selectedElementId!==null&&this.selectedElementIdDoubleClicked&&!t&&!n.parentElement.classList.contains("selection")){this.editElementText(this.selectedElement);return}this.changeManager.undoActive()}this.activeDragging=!1}}doElementSelection(e){const t=this.renderer.getElementSelection(this.selectedElementId);if(this.renderer.getElementSelections().forEach(n=>{(!e||n.id==this.selectedElementId)&&this.renderer.removeElementSelection(n.id),n.lastSelected&&(n.lastSelected=!1)}),this.selectedElement&&(!e||!t)){const n=this.diagram.getDiagramObjectById(this.selectedElement.id),i=this.renderer.addElementSelection(this.selectedElementId);i.setPosition(n.AbsolutePosition.x,n.AbsolutePosition.y,n.bounds.width,n.bounds.height),i.lastSelected=!0}}getTextFromElement(e){var n;if(!e.classList.contains("note"))return(n=e.querySelector(":scope>foreignObject>div>div"))==null?void 0:n.textContent;const t=e.querySelector(":scope>foreignObject>div>div");return Array.from(t.childNodes).map(i=>i.textContent).reduce((i,r)=>i+`
`+r)}editElementText(e){const t=e.querySelector(":scope>foreignObject>div>div");if(!t)return;const n=this.getTextFromElement(e);this.changeManager.startChange({action:lt.Edit,diagramId:this.diagram.id,edit:{elementId:e.id,textNew:n,textOld:n}}),this.getDiagramElement(document.activeElement)!==e&&setTimeout(function(){t.focus();const r=document.createRange();r.selectNodeContents(t);const o=window.getSelection();o.removeAllRanges(),o.addRange(r)},100)}getDiagramElement(e){for(;e!=null&&!(e instanceof SVGGElement);)e=e.parentElement;return e}finalizeAction(e){this.changeManager.finalizeChange(e)}startDragging(e,t,n=!1){this.startDragMousePosition=t,this.activeDragging=!1,this.selectedElementId=e,this.renderer.highlightedElementId=e,this.renderer.removeElementSelections(),this.renderer.addElementSelection(this.selectedElementId),this.editMoveStart(n)}editMoveStart(e=!1){var n,i;const t=this.diagram.getDiagramObjectById(this.selectedElement.id);this.startDragMouseOffset={x:this.startDragMousePosition.x-t.AbsolutePosition.x,y:this.startDragMousePosition.y-t.AbsolutePosition.y},this.changeManager.startChange({action:lt.Move,diagramId:this.diagram.id,chainedToParent:e,move:{elementId:this.selectedElement.id,positionNew:{x:t.AbsolutePosition.x,y:t.AbsolutePosition.y,width:t.bounds.width,height:t.bounds.height},positionOld:{x:t.bounds.x,y:t.bounds.y,width:t.bounds.width,height:t.bounds.height},parentIdNew:this.diagram.id,parentIdOld:(i=(n=t.parent)==null?void 0:n.id)!=null?i:this.diagram.id}})}static toGrid(e,t){return t?Math.round(e/12)*12:e}editMoveMove(e,t){const n={x:Ot.toGrid(e.x-this.startDragMouseOffset.x,t),y:Ot.toGrid(e.y-this.startDragMouseOffset.y,t)},i=this.changeManager.currentChange.move;i.positionNew.x=n.x,i.positionNew.y=n.y,this.changeManager.updateChange()}editResizeStart(e){var n,i,r,o;const t=this.diagram.getDiagramObjectById(this.selectedElement.id);this.changeManager.startChange({action:lt.Resize,diagramId:this.diagram.id,move:{elementId:this.selectedElement.id,positionNew:{x:t.bounds.x,y:t.bounds.y,width:t.bounds.width,height:t.bounds.height},positionOld:{x:t.bounds.x,y:t.bounds.y,width:t.bounds.width,height:t.bounds.height},parentIdNew:(i=(n=t.parent)==null?void 0:n.id)!=null?i:this.diagram.id,parentIdOld:(o=(r=t.parent)==null?void 0:r.id)!=null?o:this.diagram.id,dragCorner:e.classList.item(0)}})}editResizeMove(e,t){const n=this.changeManager.currentChange.move;if(n.dragCorner.indexOf("w")>=0){const i=n.positionOld.x+e.x;n.positionNew.x=Ot.toGrid(i,t),e.x+=n.positionNew.x-i,n.positionNew.width=n.positionOld.width-e.x,n.positionNew.width<12&&(n.positionNew.x-=12-n.positionNew.width,n.positionNew.width=12)}if(n.dragCorner.indexOf("e")>=0&&(n.positionNew.width=Ot.toGrid(n.positionOld.width+e.x,t),n.positionNew.width<12&&(n.positionNew.width=12)),n.dragCorner.indexOf("n")>=0){const i=n.positionOld.y+e.y;n.positionNew.y=Ot.toGrid(i,t),e.y+=n.positionNew.y-i,n.positionNew.height=n.positionOld.height-e.y,n.positionNew.height<12&&(n.positionNew.y-=12-n.positionNew.height,n.positionNew.height=12)}n.dragCorner.indexOf("s")>=0&&(n.positionNew.height=Ot.toGrid(n.positionOld.height+e.y,t),n.positionNew.height<12&&(n.positionNew.height=12)),this.changeManager.updateChange()}editConnectionStart(e){let t=0,n=e.previousElementSibling;for(;n.tagName=="circle";)t++,n=n.previousElementSibling;const i=this.diagram.getDiagramObjectById(e.parentElement.id),r=i.bendPoints.map(c=>({x:c.x,y:c.y})),[o]=this.renderer.getAbsolutePositionAndBounds(i.source),[a]=this.renderer.getAbsolutePositionAndBounds(this.diagram.getDiagramObjectById(i.targetId));this.changeManager.startChange({action:lt.Connection,diagramId:this.diagram.id,connection:{index:t,sourceConnectionId:i.id,bendPointsOld:r,bendPointsNew:r,targetOffset:{x:a.x-o.x,y:a.y-o.y}}})}editConnectionEdit(e,t,n){const i=this.changeManager.currentChange.connection;i.bendPointsNew=i.bendPointsOld.map(y=>({x:y.x,y:y.y}));let r=-1;const o=this.diagram.getDiagramObjectById(i.sourceConnectionId),[a,c]=this.renderer.getAbsolutePositionAndBounds(o.source),[m,u]=this.renderer.getAbsolutePositionAndBounds(this.diagram.getDiagramObjectById(o.targetId)),w=At.calculateConnectionCoords(a,c,m,u,o);if(i.index%2==1){const y={x:this.startDragMousePosition.x-a.x,y:this.startDragMousePosition.y-a.y};r=(i.index-1)/2,i.bendPointsNew=[...i.bendPointsNew.slice(0,r),{x:y.x,y:y.y},...i.bendPointsNew.slice(r)]}else i.index>0&&i.index/2-1<i.bendPointsNew.length&&(r=i.index/2-1);if(r>=0&&(i.bendPointsNew[r].x=Ot.toGrid(a.x+i.bendPointsNew[r].x+e.x,n)-a.x,i.bendPointsNew[r].y=Ot.toGrid(a.y+i.bendPointsNew[r].y+e.y,n)-a.y),xt.IsInsideBounds(t,a,c))i.bendPointsNew=i.bendPointsNew.slice(r+1);else if(xt.IsInsideBounds(t,m,u))i.bendPointsNew=i.bendPointsNew.slice(0,r);else for(let y=0;y<w.length-2;y++)if(y!=r&&xt.IsInsideBounds(t,w[y+1])){y<r?i.bendPointsNew=[...i.bendPointsNew.slice(0,y+1),...i.bendPointsNew.slice(r+1)]:i.bendPointsNew=[...i.bendPointsNew.slice(0,r),...i.bendPointsNew.slice(y)];break}this.changeManager.updateChange()}getMousePosition(e){const t=this.svg.getScreenCTM();return{x:(e.clientX-t.e)/t.a,y:(e.clientY-t.f)/t.d}}}class Yn{constructor(e,t){N(this,"_change");N(this,"_action");this.renderer=e,this.project=t}get action(){return this._action}get change(){return this._change}set change(e){this._change=e,this._action=e?Yn.getAction(e.action):null}static getAction(e){switch(e){case lt.Move:return new kr;case lt.Resize:return new kr;case lt.Connection:return new Fs;case lt.Edit:return new Ls;case lt.AddRemoveElement:return new Us;default:throw new Error(`Unimplemented action for ${lt[e]}`)}}doDiagramChange(e=Pt.Final){this.action.doDiagramChange(this.change,this.renderer,this.project,e)}doSvgChange(e=Pt.Final){this.action.doSvgChange(this.change,this.renderer,e)}}class Un{}class kr extends Un{constructor(){super(...arguments);N(this,"selectedDropTarget")}doDiagramChange(t,n,i,r){const o=t.move;if(t.action==lt.Move&&r==Pt.Final&&this.selectedDropTarget){const m=n.diagram.getDiagramObjectById(this.selectedDropTarget.id);o.parentIdNew=this.selectedDropTarget.id,o.positionNew.x-=m.AbsolutePosition.x,o.positionNew.y-=m.AbsolutePosition.y}const a=n.diagram.getDiagramObjectById(o.elementId),c=o.parentIdNew==n.diagram.id?null:n.diagram.getDiagramObjectById(o.parentIdNew);a.parent!=c&&i.diagrams.find(u=>u.id==t.diagramId).setElement(a,c),a.bounds=new Wt(o.positionNew.x,o.positionNew.y,o.positionNew.width,o.positionNew.height)}doSvgChange(t,n,i){const r=t.move;let o=n.svg.getElementById(r.elementId);const a=n.svg.getElementById(r.parentIdNew),c=n.diagram.getDiagramObjectById(r.elementId);if(o.remove(),o=n.addElement(c,a),n.clearRelations(),n.addRelations(),i==Pt.Active){t.action==lt.Move&&this.setDropTargetAttributes(n);const m=t.action==lt.Move?`${r.positionNew.x}, ${r.positionNew.y}`:`${r.positionNew.width} x ${r.positionNew.height}`;n.editInfo.setText(m,c.AbsolutePosition.x+10,c.AbsolutePosition.y+r.positionNew.height+5),o.classList.add("dragging"),n.svg.classList.add("dragging")}else i==Pt.Final&&(n.removeEditInfo(),o.classList.remove("dragging"),n.svg.classList.remove("dragging"),n.svg.querySelectorAll("g.drop").forEach(m=>m.classList.remove("drop")))}setDropTargetAttributes(t){const n=t.svg.querySelectorAll("g.element:hover"),i=n?n[n.length-1]:null;i?this.selectedDropTarget!==i&&(this.selectedDropTarget&&this.selectedDropTarget.classList.remove("drop"),this.selectedDropTarget=i,this.selectedDropTarget.classList.add("drop")):this.selectedDropTarget&&(this.selectedDropTarget.classList.remove("drop"),this.selectedDropTarget=null)}}class Fs extends Un{doDiagramChange(e,t,n,i){const r=e.connection,o=t.diagram.getDiagramObjectById(r.sourceConnectionId),a=r.bendPointsNew.map(c=>({x:c.x,y:c.y}));o.bendPoints=a}doSvgChange(e,t){t.clearRelations(),t.addRelations()}}class Ls extends Un{doDiagramChange(e,t,n,i){const r=e.edit,o=t.diagram.getDiagramObjectById(r.elementId);if(o.entityId){const a=n.getById(o.entityId);a.name=r.textNew}else o.content=r.textNew}doSvgChange(e,t,n){const i=e.edit;if(n==Pt.Final){const r=t.svg.getElementById(i.elementId),o=r.parentElement,a=t.diagram.getDiagramObjectById(i.elementId);r.remove(),t.addElement(a,o)}}}class Us extends Un{doDiagramChange(e,t,n,i){if(i!=Pt.Final)return;const r=e.addRemoveElement;if(r.adding){if(r.entity){let o=n.getById(r.entity.id);o||(o={...r.entity},n.addEntity(o))}t.diagram.setElement(r.element,null)}else r.entity&&n.removeEntity(r.entity),t.diagram.removeElement(r.element)}doSvgChange(e,t,n){if(n!=Pt.Final)return;const i=e.addRemoveElement,r=t.svg.getElementById(i.element.id);if(r&&r.remove(),i.adding){const o=t.diagram.getDiagramObjectById(i.element.id),a=t.svg.getElementById(o.parent!=null?o.parent.id:t.diagram.id);t.addElement(o,a)}}}var Pt=(s=>(s[s.Init=0]="Init",s[s.Active=1]="Active",s[s.Final=2]="Final",s))(Pt||{});class Ws{constructor(e,t){N(this,"changeHistory",[]);N(this,"changeHistoryIndex",0);this.project=e,this.changer=t}set currentChange(e){this.changer.change!=e&&(this.changer.change=e)}get currentChange(){return this.changer.change}get isActive(){return!!this.currentChange}get activeAction(){var e;return(e=this.currentChange)==null?void 0:e.action}undoActive(){if(!!this.isActive){for(this.currentChange=xe.undoChange(this.currentChange),this.changer.doDiagramChange(),this.changer.doSvgChange();this.currentChange.chainedToParent;)this.currentChange=this.changeHistory.pop(),this.changeHistoryIndex--,this.currentChange=xe.undoChange(this.currentChange),this.changer.doDiagramChange(),this.changer.doSvgChange();this.currentChange=null}}startChange(e){console.log(`startChange ${lt[e.action]}`),this.currentChange=e}updateChange(e=this.currentChange){this.currentChange=e,this.changer.doDiagramChange(1),this.changer.doSvgChange(1)}finalizeChange(e=this.currentChange){var t;console.log(`finalizeChange ${lt[(t=this.currentChange)==null?void 0:t.action]}`),this.currentChange=e,this.changer.doDiagramChange(),this.changer.doSvgChange(),xe.isChanged(e)&&(this.changeHistory=this.changeHistory.slice(0,this.changeHistoryIndex),this.changeHistory.push(e),this.changeHistoryIndex++),this.currentChange=null}undo(){if(this.isActive){this.undoActive();return}for(;!(this.changeHistoryIndex==0||(this.changeHistoryIndex--,this.currentChange=xe.undoChange(this.changeHistory[this.changeHistoryIndex]),this.changer.doDiagramChange(),this.changer.doSvgChange(),!this.currentChange.chainedToParent)););this.currentChange=null}redo(){if(this.isActive){this.undoActive();return}for(;;){if(this.changeHistoryIndex>=this.changeHistory.length)return;if(this.currentChange=this.changeHistory[this.changeHistoryIndex],this.changeHistoryIndex++,this.changer.doDiagramChange(),this.changer.doSvgChange(),this.changeHistoryIndex>=this.changeHistory.length||!this.changeHistory[this.changeHistoryIndex].chainedToParent)break}this.currentChange=null}}const Gs=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="920"
  height="1200" class='hideElementType'>
  <style>
    svg.dragging {
      cursor: move !important;
    }

    g.business {
      --mainColor: #ffff99;
    }

    g.application {
      --mainColor: #B5FFFF;
    }

    g.technology, g.physical {
      --mainColor: #C9E7B7;
    }

    g.motivation {
      --mainColor: #d9cfff;
    }

    g.strategy {
      --mainColor: #F5DEAA;
    }

    g.implementation {
      --mainColor: #FFE0E0;
    }

    g.plateau {
      --mainColor: #E0FFE0;
    }

    g.location {
      --mainColor: #FBB875;
    }
    g.grouping {
      --mainColor: #fff;
    }

    g.diagram {
      --mainColor: #DCEBEB;
    }

    g.undefined {
      --mainColor: #ccc;
    }

    g.canvas {
      --mainColor: #fff;
      border: none;
    }

    g.element {
      fill: var(--mainColor);
      stroke: #000;
    }
    .content g.element>use.symbol {
      fill: var(--mainColor);
      stroke: #777;
      stroke-width: 1.5;
      x: 0px;
      y: 0px;
    }

    .content g.element>use {
      stroke-width: 0.5;
      fill: none;
    }
    .content g.element>use:not(.symbol):not(.img) {
      transform: translate(-9px,9px);
    }
    
    #icons>g.element>use {
      stroke-width: 0.5;
      transform: translate(10px,10px);
    }
    #icons>g.element>rect {
      stroke: #000;
      fill: none;
    }
    defs rect,path,ellipse {
      vector-effect: non-scaling-stroke;
    }
    
    foreignObject {
      pointer-events: none;
      user-select: none;
      font-family: "Segoe UI", Verdana, Geneva, Tahoma, sans-serif;
      color: #000;
      font-size: 12px;
    }
    g.con>text {
      font-family: "Segoe UI", Verdana, Geneva, Tahoma, sans-serif;
      color: #000;
      font-size: 12px;
      alignment-baseline: middle;
      text-anchor: middle;
      fill: #000; 
      stroke: #fff;
      paint-order: stroke;
    }
    g.con>foreignObject>div {
      /* background-color: #7779; */
      display: flex;
      justify-content: center;
      align-items: center;

      width: 100%;
      height: 100%;
      padding: 0;
      white-space: normal;
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-word;
      hyphens: auto;
      text-overflow: ellipse;
    }
    
    g.con>foreignObject>div>div {
      background-color: #fff9;
      padding: 0px 0px 2px 0px;
    }

    g.element>foreignObject>div {
      padding: 2px;
      display: flex;
    }

    g.element>foreignObject div {
      text-align: center;

      width: 100%;
      flex-wrap: wrap;
      flex-direction: column;
      box-sizing: border-box;
      /* background-color: #7779; */
      white-space: normal;
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-word;
      hyphens: auto;
      text-overflow: ellipse;
      overflow: hidden;
      line-height: 1.2em;
    }
    g.element>foreignObject>div>div.right {
      text-align: right !important;
    }
    g.element>foreignObject>div>div.left {
      text-align: left !important;
    }
    g.element>foreignObject>div>div.top {
      margin-top: 0px !important;
      margin-bottom: auto !important;
    }
    g.element>foreignObject>div>div.bottom {
      margin-top: auto !important;
      margin-bottom: 0px !important;
    }

    g.element.structure>foreignObject div {
      padding: 2px 2px 2px 2px;
    }

    g.element>foreignObject>div>div:first-child {
      margin-bottom: auto;
      /* Make it push flex items to the center */
    }

    g.element:not(.note)>foreignObject:last-child>div>div:first-child {
      margin-top: auto;
      /* Make it push flex items to the center */
    }

    g.element>foreignObject div.elementType {
      /* background-color: #6066; */
      font-size: x-small;
      height: auto;
      padding: 0px;
    }
    svg.hideElementType div.elementType {
      display: none;
    }

    g.element>foreignObject div:focus {
      pointer-events: all;
      display: block;
    }

    g.element.grouping>foreignObject div {
      align-items: flex-start;
      padding: 1px 2px 0px 2px;
      height: 18px !important;
    }

    g.element.note>foreignObject div {
      text-align: left;
      align-items: flex-start;
      margin-top: 0px;
      white-space: pre-wrap;
      margin-bottom: auto;
    }

    [contenteditable="true"]:active,
    [contenteditable="true"]:focus {
      border: none;
      outline: none;
      background-color: #fff;
      min-height: 1em;
    }

    g.element.junction.or {
      fill: #fff;
    }

    g.element.behavior>rect {
      rx: 10px;
      ry: 10px;
    }

    g.element {
      filter: drop-shadow(0px 2px 2px #777);
    }

    g.element:hover {
      filter: drop-shadow(0px 0px 4px #666);
    }

    g.element.drop:hover,
    g.element.drop {
      filter: drop-shadow(0px 0px 4px #66f);
    }

    g.element.dragging {
      z-index: 10;
      opacity: 0.5;
      pointer-events: none;
    }

    path.Composition.Relationship {
      marker-start: url(#arrowComposition);
    }

    path.Aggregation.Relationship {
      marker-start: url(#arrowAggregate);
    }

    path.Specialization.Relationship {
      marker-end: url(#arrowOpen);
    }

    path.Triggering.Relationship {
      marker-end: url(#arrowClosed);
    }

    path.Access.Relationship {
      stroke-dasharray: 2 4;
    }

    path.Access.Relationship.Write,
    path.Access.Relationship.Access {
      marker-end: url(#arrowPointed);
    }

    path.Access.Relationship.Read {
      marker-start: url(#arrowPointedStart);
    }

    path.Realization.Relationship {
      marker-end: url(#arrowOpen);
      stroke-dasharray: 4 4;
    }

    path.Influence.Relationship {
      marker-end: url(#arrowPointed);
      stroke-dasharray: 6 4;
    }

    path.Assignment.Relationship {
      marker-end: url(#arrowClosed);
      marker-start: url(#arrowCircle);
    }

    path.Serving.Relationship {
      marker-end: url(#arrowPointed);
    }

    path.Flow.Relationship {
      marker-end: url(#arrowClosed);
      stroke-dasharray: 8 4;
    }

    path.Relationship {
      fill: none;
      stroke: #000000;
      stroke-linecap: butt;
    }

    path.RelationshipDetect {
      fill: none;
      stroke-width: 4;
      stroke: #0000;
    }

    path.RelationshipDetect:Hover {
      stroke: #5555;
    }

    g.con.highlight path.RelationshipDetect {
      stroke: #44a5;
    }

    g.con.selected path.RelationshipDetect {
      stroke: #44a5;
    }

    g.con circle {
      display: none;
      stroke: #fff;
      fill: #000;
    }

    g.con.selected circle {
      display: initial;
      cursor: move;
    }

    g.con.selected circle.end {
      cursor: crosshair;
    }
    g.selection {
      display: none;
      stroke: #000;
      fill: #fff;
    }

    g.selection  {
      display: initial;
    }

    g.selection.lastSelection circle {
      fill: #000;
      stroke: #fff;
    }

    g.selection circle.re { cursor: e-resize; }
    g.selection circle.rw { cursor: w-resize; }
    g.selection circle.rs { cursor: s-resize; }
    g.selection circle.rn { cursor: n-resize; }
    g.selection circle.rne { cursor: ne-resize; }
    g.selection circle.rnw { cursor: nw-resize; }
    g.selection circle.rse { cursor: se-resize; }
    g.selection circle.rsw { cursor: sw-resize; }

    g.editInfo>rect {
      fill: #fffa;
      rx: 5px;
      ry: 5px;
    }
    g.editInfo>text {
      font-family: "Segoe UI", Verdana, Geneva, Tahoma, sans-serif;
      font-size: 12px;
    }
  </style>
  <defs>
    <!-- https://css-tricks.com/use-and-reuse-everything-in-svg-even-animations/ -->
    <g id="ActorIcon">
      <path d="m0-2 0 4m-4-2.5 8 0m-7 7.5 3-5m0 0 3 5m-3-9a1 1 0 000-5 1 1 0 000 5" />
    </g>
    <g id="RoleIcon">
      <path d="m-4.5 -5c-3.3 0 -3.3 10 0 10 h9 c3.3 0 3.3 -10 0 -10z m9 0 c-3.3 0-3.3 10 0 10" />
    </g>
    <g id="CollaborationIcon">
      <ellipse cx="-3" rx="5" ry="5" />
      <ellipse cx="3" rx="5" ry="5" />
      <ellipse cx="-3" rx="5" ry="5" style="fill: none" />
    </g>
    <g id="InterfaceIcon">
      <ellipse cx="1" rx="5" ry="5" />
      <path d="M -4 0 h -5" />
    </g>
    <g id="ProcessIcon">
      <path d="m -7, -2.5 l 10 0 l 0 -2.5 l 4 5 l -4 5 l 0 -2.5 l -10 0 z"/>
    </g>
    <g id="FunctionIcon">
      <path d="M0 -5 l7 1.5 l0 8.5 l-7 -2 l-7 2 l0 -8.5 z" />
    </g>
    <g id="InteractionIcon">
      <path d="m 1 -5 a 1 1 0 0 1 0 10 z m -2 0 a 1 1 0 0 0 0 10 z" />
    </g>
    <g id="ServiceIcon">
      <path d="M3-5a1 1 0 0 10 10l-6 0a1 1 0 01-1-10z" />
    </g>
    <g id="ArtifactIcon">
      <path d="M2 -6 h-7 v12 h11 v-8 h-3.6 v-3.6 l4 4z" />
    </g>
    <g id="EventIcon">
      <path d="m2 -5a1 1 0 0 10 10l-10 0 5-5-5-5z" />
    </g>
    <g id="SystemSoftwareIcon">
      <path d="m2 4 a 1 1 0 0 0 -7 -7 a 1 1 0 0 0 7 7 c 9.14 -6.61 -1.76 -15.14 -6.46 -7.43" />
    </g>
    <g id="CommunicationNetworkIcon">
      <path d="m4-5 h-8 l-2 8 h8 z" />
      <ellipse cx="4" cy="-5" rx="1.2" ry="1.2" fill="black" />
      <ellipse cx="-4" cy="-5" rx="1.2" ry="1.2" fill="black" />
      <ellipse cx="2" cy="3" rx="1.2" ry="1.2" fill="black" />
      <ellipse cx="-6" cy="3" rx="1.2" ry="1.2" fill="black" />
    </g>
    <g id="PathIcon">
      <path d="m -5 4 l -4 -4 l 4 -4 m 8 8 l 4 -4 l -4 -4" fill="none" />
      <path d="m -9 0 h16" stroke-dasharray="2 2" />
    </g>
    <g id="MaterialIcon">
      <path d="M -7 1 l 4 -6 l 6 0 l 4 6 l -4 6 l -6 0 l -4 -6 m 3 0 l 2.7 -4 m -1.245 6.993 l 5.183 0 m 1.327 -2.999 l -2.7 -4" />
    </g>
    <g id="DistributionNetworkIcon">
      <path d="m-5.5-1.5 2.5-2.5-4 4 4 4-2.5-2.5 11 0 -2.5 2.5 4 -4 -4 -4 2.5 2.5z" />
    </g>
    <g id="DiagramIcon">
      <path d="m -8 -5  h 3 v 3 h -3z m 0 8 h 3 v 3 h -3z m 5 -6 l 8 0 m -8 7 l 8 0 m -7 -3 a 0.5 0.5 0 0 0 0 -1 a 0.5 0.5 0 1 0 0 1 m 2 -0.5 l 5 0" />
    </g>
    <g id="FacilityIcon">
      <path d="M -8 -4 v12 h15 v-8 l-4 3 v-3 l-4 3 v-3 l-4 3 v-7z" />
    </g>
    <g id="ComponentIcon">
      <rect x="-6" y="-7" width="11" height="12" />
      <rect x="-8" y="-4" width="6.5" height="2.3" />
      <rect x="-8" y="0" width="6.5" height="2.3" />
    </g>
    <g id="CapabilityIcon">
      <path d="m-7 2v4h12v-12h-4v4h-4v4zm4 0v4m4 0v-8m4 4h-8m4-4h4" />
    </g>
    <g id="ValueStreamIcon">
      <path d="m -8 -5 h10 l5 5 l-5 5 h-10 l5 -5z" />
    </g>
    <g id="ResourceIcon">
      <path d="m-8-4h9c3 0 3 0 3 2v5c0 2 0 2-2 2h-9c-2 0-2 0-2-2v-5c0-2 0-2 2-2m.5 2v5m3 0v-5m3 0v5m4.5-.5h1.5c1.5 0 1.5 0 1.5-1.5v-1c0-1.5 0-1.5-2-1.5h-1" />
    </g>
    <g id="EquipmentIcon">
      <path d="m2 4l 0.85 0.49 c 0.1 0.06 0.14 0.17 0.11 0.28 c -0.22 0.71 -0.6 1.36 -1.09 1.89 a 0.24 0.24 90 0 1 -0.3 0.05 l -0.85 -0.49 a 3.83 3.83 90 0 1 -1.22 0.7 v 0.98 a 0.24 0.24 90 0 1 -0.19 0.23 c -0.7 0.16 -1.45 0.17 -2.18 0 c -0.11 -0.02 -0.19 -0.12 -0.19 -0.23 v -0.98 a 3.83 3.83 90 0 1 -1.22 -0.7 l -0.85 0.49 a 0.24 0.24 90 0 1 -0.3 -0.05 c -0.49 -0.53 -0.87 -1.18 -1.09 -1.89 c -0.03 -0.11 0.01 -0.22 0.11 -0.28 l 0.85 -0.49 a 3.87 3.87 90 0 1 0 -1.4 l -0.85 -0.49 c -0.1 -0.06 -0.14 -0.17 -0.11 -0.28 c 0.22 -0.71 0.6 -1.36 1.09 -1.89 a 0.24 0.24 90 0 1 0.3 -0.05 l 0.85 0.49 a 3.83 3.83 90 0 1 1.22 -0.7 v -0.98 a 0.24 0.24 90 0 1 0.19 -0.23 c 0.7 -0.16 1.45 -0.17 2.18 -0 c 0.11 0.02 0.19 0.12 0.19 0.23 v 0.98 a 3.83 3.83 90 0 1 1.22 0.7 l 0.85 -0.49 a 0.24 0.24 90 0 1 0.3 0.05 c 0.49 0.53 0.87 1.18 1.09 1.89 c 0.03 0.11 -0.01 0.22 -0.11 0.28 l -0.85 0.49 a 3.87 3.87 90 0 1 0 1.4 z m -2.18 -0.7 c 0 -0.88 -0.72 -1.6 -1.6 -1.6 s -1.6 0.72 -1.6 1.6 s 0.72 1.6 1.6 1.6 s 1.6 -0.72 1.6 -1.6 zm 6.23 -4.6 l 0.59 0.34 c 0.07 0.04 0.1 0.12 0.08 0.2 c -0.15 0.5 -0.42 0.95 -0.76 1.32 a 0.17 0.17 90 0 1 -0.21 0.03 l -0.59 -0.34 a 2.68 2.68 90 0 1 -0.85 0.49 v 0.69 a 0.17 0.17 90 0 1 -0.13 0.16 c -0.49 0.11 -1.01 0.12 -1.53 0 c -0.08 -0.01 -0.13 -0.08 -0.13 -0.16 v -0.69 a 2.68 2.68 90 0 1 -0.85 -0.49 l -0.59 0.34 a 0.17 0.17 90 0 1 -0.21 -0.03 c -0.34 -0.37 -0.61 -0.83 -0.76 -1.32 c -0.02 -0.08 0.01 -0.15 0.08 -0.2 l 0.59 -0.34 a 2.71 2.71 90 0 1 0 -0.98 l -0.59 -0.34 c -0.07 -0.04 -0.1 -0.12 -0.08 -0.2 c 0.15 -0.5 0.42 -0.95 0.76 -1.32 a 0.17 0.17 90 0 1 0.21 -0.03 l 0.59 0.34 a 2.68 2.68 90 0 1 0.85 -0.49 v -0.69 a 0.17 0.17 90 0 1 0.13 -0.16 c 0.49 -0.11 1.01 -0.12 1.53 0 c 0.08 0.01 0.13 0.08 0.13 0.16 v 0.69 a 2.68 2.68 90 0 1 0.85 0.49 l 0.59 -0.34 a 0.17 0.17 90 0 1 0.21 0.03 c 0.34 0.37 0.61 0.83 0.76 1.32 c 0.02 0.08 -0.01 0.15 -0.08 0.2 l -0.59 0.34 a 2.71 2.71 90 0 1 0 0.98 z m -1.53 -0.49 c 0 -0.62 -0.5 -1.12 -1.12 -1.12 s -1.12 0.5 -1.12 1.12 s 0.5 1.12 1.12 1.12 s 1.12 -0.5 1.12 -1.12 z" />
    </g>
    <g id="GoalIcon">
      <ellipse rx="7.5" ry="7.5" />
      <ellipse rx="4.5" ry="4.5" fill="none" />
      <ellipse rx="1.5" ry="1.5" fill="black" />
    </g>
    <g id="CourseOfActionIcon">
      <ellipse rx="6.5" ry="6.5" />
      <ellipse rx="1.5" ry="1.5" fill="black" />
      <ellipse rx="4" ry="4" fill="none" />
      <path d="m-6.5 2 4 0-1.3 3.3-.9-1.2c-.8 0-1.3 1.3-1.3 2l-1 0c0-1.2.4-2.4 1.6-2.9l-1.1-1.2z" fill="#000" />
    </g>
    <g id="AssessmentIcon">
      <ellipse cx="1" cy="-1" rx="4.5" ry="4.5" />
      <path d="M-2.2 2.2 l-4 4" />
    </g>
    <g id="DriverIcon">
      <ellipse rx="6" ry="6" />
      <ellipse rx="1" ry="1" fill="black" />
      <path d="m0 -7 l 0 14 m -7 -7 l 14 0 m -12.6 -5.6 l 11.2 11.2 m 0 -11.2 l -11.2 11.2" />
    </g>
    <g id="ConstraintIcon">
      <path d="m7-4 h-11 l -4 8 h 11 z m -9 0 l -4 8" />
    </g>
    <g id="RequirementIcon">
      <path d="M7-4 h-11 l-4 8 h11z" />
    </g>
    <g id="OutcomeIcon">
      <ellipse rx="7" ry="7" />
      <ellipse rx="4" ry="4" />
      <ellipse rx="1" ry="1" fill="#000" />
      <path fill="black" stroke-width="1.5" d="M0 0 l 1.5 -4.5 l 3 3 Z" />
      <path fill="none" stroke-width="1" stroke-linecap="round" d="M0 0 l 6 -6" />
      <path fill="none" stroke-width="0.5" stroke-linecap="round" d="M5.5-7.5 l -1 3 l 3 -1" />
    </g>
    <g id="PrincipleIcon">
      <path d="m -7-5 c 1 -1 12 -1 13 0 c 1 1 1 12 0 13 c -1 1 -12 1 -13 0 c -1 -1 -1 -12 0 -13 z" />
      <path fill="#000" d="m -1-2 v2 l0.3 4 h0.4 l0.3 -4 v-2z  " />
      <rect width="0.6" height="0.6" x="-0.8" y="6" stroke="#000" fill="#000" />
    </g>

    <g id="LocationIcon">
      <path d="m4-3 a 1 1 0 0 0 -10 0 q 0 3 5 10 q 5 -7 5 -10z" />
    </g>
    <g id="GapIcon">
      <ellipse rx="6" ry="6" />
      <path d="m -8 -1.5 h 16 m -15 3 h 16" fill="none" />
    </g>
    <g id="PlateauIcon">
      <path d="m-4 -3 h11 m-13 3 h 11 m -13 3 h 11" fill="none" />
    </g>
    <g id="TodoIcon">
      <text x="-2" y="6" fill="#000000" font-family="Helvetica" font-size="16px" text-anchor="middle">&#x1F937;</text>
    </g>
    <g id="ExperimentIcon">
      <text x="-2" y="6" fill="#000000" font-family="Helvetica" font-size="16px" text-anchor="middle">&#x1F9ea;</text>
    </g>
    <g id="ObjectIcon">
      <rect x="-8" y="-7" width="14" height="12" />
      <path d="M -8 -4 l 14 0" />
    </g>
    <g id="ContractIcon">
      <rect x="-8" y="-7" width="14" height="12" />
      <path d="M -8 -4 l 14 0" />
      <path d="M -8 2 l 14 0" />
    </g>
    <g id="RepresentationIcon">
      <path d="m-8-7 14 0 0 10c-7-6-7 6-14 0zm0 3 14 0" />
    </g>
    <g id="ProductIcon">
      <rect x="-8" y="-7" width="14" height="12" />
      <path d="M -8 -4 l 8 0 l 0 -3" fill="none" />
    </g>
    <g id="NodeIcon">
      <path d="M -8 -4 l 3 -3 l 12 0 l 0 10 l -3 3 l -13 0z" />
      <rect x="-8" y="-4" width="12" height="10" />
      <path d="M4 -4 l 3 -3"  />
    </g>
    <g id="DeviceIcon">
      <path d="M-5 2 l -3 3 l 14 0 l -3 -3z" />
      <rect x="-8" y="-7" width="14" height="9" rx="2" />
    </g>
    <g id="WorkPackageIcon">
      <rect x="-8" y="-7" width="14" height="11" rx="4" />
    </g>
    <g id="DeliverableIcon">
      <path d="M-8 -6 l 14 0 l 0 10c -7 -6 -7 6 -14 0 Z" />
    </g>
    <g id="MeaningIcon">
      <path d="M.1-4.1C1.1-4.8 3.1-5.3 5.2-4.5 6.3-5.4 7.9-2.9 6.3-2.1 7.2-2.9 7.4 2.5 6.1 2.8 5.9 5.1 4.1 5.4 1.4 4.6-.5 5-6.3 5.4-5.3 4-7.3 4-7.5-1.8-6.2-2.3-8-4.2-5.6-5.7-3.5-4.5-2.6-5.4-.4-4.8.1-4.1" />
    </g>
    <g id="NoteIcon">
      <path d="m-7 -7 h14 v8 l-3 3 h-11 z" />
    </g>
    <g id="GroupingIcon">
      <path d="m-7 -5 h14 v9 h-14 v-11 h6 v2" />
    </g>
    <g id="ValueIcon">
      <ellipse rx="8" ry="4" />
    </g>
    <g id="imageDefs">
      <image id="imgSample" href="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" />
    </g>
    <pattern id="smallGrid" width="12" height="12" patternUnits="userSpaceOnUse">
     <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#ddd" stroke-width="1px" vector-effect="non-scaling-stroke" />
    </pattern>
    <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
      <rect width="120" height="120" fill="url(#smallGrid)" stroke="#ccc" stroke-width="1px"
        vector-effect="non-scaling-stroke" />
    </pattern>

    <marker id="arrowAggregate" markerWidth="13" markerHeight="10" refX="0.4" refY="5" orient="auto"
      markerUnits="userSpaceOnUse">
      <path d="M12.8 5 l -6 4 l-6 -4 l6 -4 z" fill="#fff" stroke="#000" />
    </marker>
    <marker id="arrowComposition" markerWidth="14" markerHeight="10" refX="0.4" refY="5" orient="auto"
      markerUnits="userSpaceOnUse">
      <path d="M12.8 5 l -6 4 l-6 -4 l6 -4 z z" fill="#000" stroke="#000" />
    </marker>
    <marker id="arrowClosed" markerWidth="11" markerHeight="10" refX="10.5" refY="5" orient="auto"
      markerUnits="userSpaceOnUse">
      <path d="M 10 5 l -7 3.5 l0 -7z" fill="#000" stroke="#000" />
    </marker>
    <marker id="arrowClosedStart" markerWidth="11" markerHeight="10" refX="3.5" refY="5" orient="auto"
      markerUnits="userSpaceOnUse">
      <path d="M 3 5 l 7 3.5 l0 -7z" fill="#000" stroke="#000" />
    </marker>
    <marker id="arrowHollow" markerWidth="11" markerHeight="10" refX="10.5" refY="5" orient="auto"
      markerUnits="userSpaceOnUse">
      <path d="M 10 5 l -7 3.5 l0 -7z" fill="#fff" stroke="#000" />
    </marker>
    <marker id="arrowHollowStart" markerWidth="11" markerHeight="10" refX="3.5" refY="5" orient="auto"
      markerUnits="userSpaceOnUse">
      <path d="M 3 5 l 7 3.5 l0 -7z" fill="#fff" stroke="#000" />
    </marker>
    <marker id="arrowOpen" markerWidth="21" markerHeight="16" refX="20.5" refY="8" orient="auto"
      markerUnits="userSpaceOnUse">
      <path d="M 20 8 l -14 7 l0 -14z" fill="#fff" stroke="#000" />
    </marker>
    <marker id="arrowPointed" markerWidth="11" markerHeight="8" refX="10.5" refY="4" orient="auto"
      markerUnits="userSpaceOnUse">
      <path d="M 3 0.5 l 7 3.5 l -7 3.5" fill="none" stroke="#000" />
    </marker>
    <marker id="arrowPointedStart" markerWidth="11" markerHeight="8" refX="3.5" refY="4" orient="auto"
      markerUnits="userSpaceOnUse">
      <path d="M 10 0.5 l -7 3.5 l 7 3.5" fill="none" stroke="#000" />
    </marker>
    <marker id="arrowCircle" markerWidth="11" markerHeight="8" refX="2" refY="4" orient="auto"
      markerUnits="userSpaceOnUse">
      <ellipse cx="5" cy="4" rx="3" ry="3" fill="#000000" stroke="#000000" />
    </marker>
  </defs>

  <rect x="-12000" y="-12000" width="24000" height="24000" fill="url(#grid)" style="pointer-events: none" />
  <g id="content" class="content">
    <g id="BusinessActor" transform="translate(12, 24)" class="business active element icon">
      <rect width="168" height="60" />
      <use href="#ActorIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Actor</div>
        </div>
      </foreignObject>
    </g>
    <g id="BusinessRole" transform="translate(12, 96)" class="business active element">
      <rect width="168" height="60" />
      <use href="#RoleIcon" x="168" y="0" />
      <path class="symbol" d="m2.5 0c-3.3 0 -3.3 10 0 10 h13 c3.3 0 3.3 -10 0 -10z m13 0 c-3.3 0-3.3 10 0 10" data-size-hint="5 10 13" transform="scale(6)" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Role</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessCollaboration" transform="translate(12, 168)" class="business active element">
      <rect width="168" height="60" />
      <use href="#CollaborationIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Collaboration</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessInterface" transform="translate(12, 240)" class="business active element">
      <rect width="168" height="60" />
      <use href="#InterfaceIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Interface</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessProcess" transform="translate(192, 24)" class="business behavior element">
      <rect width="168" height="60" />
      <use href="#ProcessIcon" x="168" y="0" />
      <path class="symbol" d="m0 8.5v-7h14l0-1.5l4 5l-4 5l0-1.5z" data-size-hint="4 10 14" transform="matrix(6,0,0,6,0,0)" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Process</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessFunction" transform="translate(192, 96)" class="business behavior element">
      <rect width="168" height="60" />
      <use href="#FunctionIcon" x="168" y="0" />
      <path class="symbol"  d="M0 1.5 l7 -1.5 l7 1.5 l0 8.5 l-7 -1.5 l-7 1.5z" data-size-hint="14 10 s" transform="matrix(6,0,0,6,0,0)" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Function</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessInteraction" transform="translate(192, 168)" class="business behavior element">
      <rect width="168" height="60" />
      <use href="#InteractionIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Interaction</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessService" transform="translate(192, 240)" class="business behavior element">
      <rect width="168" height="60" />
      <use href="#ServiceIcon" x="168" y="0" />
      <path class="symbol" d="M5 0a1 1 0 000 10h8a1 1 0 000-10z" data-size-hint="10 10 8" transform="scale(6)" />

      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Service</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessEvent" transform="translate(192, 312)" class="business behavior element">
      <rect width="168" height="60" />
      <use href="#EventIcon" x="168" y="0" />
      <path class="symbol" d="m0 0h13a1 1 0 0 10 10h-13l4-5-4-5z" data-size-hint="5 10 13" transform="scale(6)" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Event</div>
        </div>
      </foreignObject>
    </g>

    <g id="Capability" transform="translate(192, 456)" class="strategy behavior element">
      <rect width="168" height="60" />
      <use href="#CapabilityIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Capability</div>
        </div>
      </foreignObject>
    </g>

    <g id="Resource" transform="translate(12, 456)" class="strategy behavior element">
      <rect width="168" height="60" />
      <use href="#ResourceIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Resource</div>
        </div>
      </foreignObject>
    </g>
    <g id="ValueStream" transform="translate(372, 456)" class="strategy behavior element">
      <rect width="168" height="60" />
      <use href="#ValueStreamIcon" x="168" y="0" />
      <path class="symbol" d="m0 0 l5 5 l-5 5 h13 l5 -5 l-5 -5z" data-size-hint="5 10 13" transform="scale(6)" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Value Stream</div>
        </div>
      </foreignObject>
    </g>
    <g id="CourseOfAction" transform="translate(552, 456)" class="strategy behavior element">
      <rect width="168" height="60" />
      <use href="#CourseOfActionIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Course of Action</div>
        </div>
      </foreignObject>
    </g>
    <g id="Artifact" transform="translate(12, 600)" class="technology static element">
      <rect width="168" height="60" />
      <use href="#ArtifactIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Artifact</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessObject" transform="translate(372, 24)" class="business structure element">
      <rect width="168" height="60" />
      <path d="M 0 8 l 168 0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Object</div>
        </div>
      </foreignObject>
    </g>

    <g id="Contract" transform="translate(372, 96)" class="business structure element">
      <rect width="168" height="60" />
      <path d="M 0 8 l 168 0" />
      <path d="M 0 60 l 0 -8 l 168 0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Contract</div>
        </div>
      </foreignObject>
    </g>


    <g id="Product" transform="translate(372, 168)" class="business structure element">
      <rect width="168" height="60" />
      <path d="M 0 8 l 90 0 l 0 -8" fill="none" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Product</div>
        </div>
      </foreignObject>
    </g>


    <g id="Representation" transform="translate(372, 240)" class="business structure element">
      <path d="M 0 0 l 168 0 l 0 56 c -84 -16 -84 16 -168 0 Z m 0 8 l 168 0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Representation</div>
        </div>
      </foreignObject>
    </g>

    <g id="Grouping" transform="translate(12, 312)" class="grouping element">
      <path fill="white" d="M168,18 l-12,0 l0,-18 l-156,0 l0,60 l168,0 z" stroke-dasharray="8,4" />
      <path fill="none" stroke-dasharray="8,4" d="M 0 18 l 156 0" />
      <foreignObject width="156px" height="16px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 156; height: 16px">
          <div>Grouping</div>
        </div>
      </foreignObject>
    </g>

    <g id="Note" transform="translate(372, 312)" class="note element">
      <path fill="white" d="M0,60 v-60 h168 v52 l-8 8  z" />
      <use class="img" href="#imgSample" transform='matrix(1,0,0,1,0,0)' />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div contenteditable="true"><div>Note</div><div>multi line</div></div>
        </div>
      </foreignObject>
    </g>

    <g id="Group" transform="translate(12, 384)" class="grouping element">
      <path fill="#ccc" d="M168,18 l-12,0 l0,-18 l-156,0 l0,60 l168,0 z" />
      <path d="M 0 18 l 156 0" stroke="#eee\`" />
      <foreignObject width="156px" height="16px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 156px; height: 16px">
          <div>Group</div>
        </div>
      </foreignObject>
    </g>

    <g id="SystemSoftware" transform="translate(372, 600)" class="technology active element">
      <rect width="168" height="60" />
      <use href="#SystemSoftwareIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>System Software</div>
        </div>
      </foreignObject>
    </g>

    <g id="Node" transform="translate(372, 670)" class="technology structure element">
      <path fill="rgb(180,207,164)" d="M 0 8 l 8 -8 l 160 0 l 0 52 l -8 8 l -160 0zM168 0 l -8 8" />
      <rect x="0" y="8" width="160" height="52" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Node</div>
        </div>
      </foreignObject>
    </g>
    <g id="Equipment" transform="translate(192, 670)" class="technology structure element">
      <path fill="rgb(180,207,164)" d="M 0 8 l 8 -8 l 160 0 l 0 52 l -8 8 l -160 0zM168 0 l -8 8" />
      <rect x="0" y="8" width="160" height="52" />
      <use href="#EquipmentIcon" x="160" y="8" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Equipment</div>
        </div>
      </foreignObject>
    </g>
    <g id="Facility" transform="translate(12, 670)" class="technology structure element">
      <path fill="rgb(180,207,164)" d="M 0 8 l 8 -8 l 160 0 l 0 52 l -8 8 l -160 0zM168 0 l -8 8" />
      <rect x="0" y="8" width="160" height="52" />
      <use href="#FacilityIcon" x="160" y="8" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Facility</div>
        </div>
      </foreignObject>
    </g>
    <g id="DistributionNetwork" transform="translate(12, 742)" class="technology active element">
      <rect width="168" height="60" />
      <use href="#DistributionNetworkIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>DistributionNetwork</div>
        </div>
      </foreignObject>
    </g>
    <g id="ArchimateDiagramModel" transform="translate(12, 808)" class="diagram element">
      <rect width="168" height="60" />
      <use href="#DiagramIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Diagram</div>
        </div>
      </foreignObject>
    </g>
    <g id="Material" transform="translate(192, 742)" class="technology active element">
      <rect width="168" height="60" />
      <use href="#MaterialIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Material</div>
        </div>
      </foreignObject>
    </g>

    <g id="Path" transform="translate(552, 670)" class="technology active element">
      <rect width="168" height="60" />
      <use href="#PathIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Path</div>
        </div>
      </foreignObject>
    </g>
    <g id="Device" transform="translate(372, 740)" class="technology active element">
      <path fill="rgb(180,207,164)" d="M 8 52 l -8 8 l 168 0 l -8 -8z" />
      <rect x="0" y="0" fill="rgb(201,231,183)" width="168" height="52" rx="8" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Device</div>
        </div>
      </foreignObject>
    </g>

    <g id="CommunicationNetwork" transform="translate(552, 600)" class="technology active element">
      <rect width="168" height="60" />
      <use href="#CommunicationNetworkIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Communication Network</div>
        </div>
      </foreignObject>
    </g>

    <g id="todo" transform="translate(192, 600)" class="undefined element">
      <rect width="168" height="60" />
      <use href="#TodoIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Work in progress</div>
        </div>
      </foreignObject>
    </g>

    <g id="Goal" transform="translate(192, 948)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use href="#GoalIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Goal</div>
        </div>
      </foreignObject>
    </g>

    <g id="Assessment" transform="translate(12, 948)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use href="#AssessmentIcon" x="166" y="2" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Assessment</div>
        </div>
      </foreignObject>
    </g>

    <g id="Driver" transform="translate(12, 1018)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use href="#DriverIcon" x="166" y="2" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Driver</div>
        </div>
      </foreignObject>
    </g>

    <g id="Requirement" transform="translate(192, 1018)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use href="#RequirementIcon" x="166" y="2" />
      <path class="symbol" d="m4 0h12l-4 10h-12z" data-size-hint="4 10 12" transform="scale(6)" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Requirement</div>
        </div>
      </foreignObject>
    </g>

    <g id="Constraint" transform="translate(372, 1018)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use href="#ConstraintIcon" x="166" y="2" />
      <path class="symbol" d="m4 0h12l-4 10h-12zm2 0-4 10" data-size-hint="4 10 12" transform="scale(6)" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Constraint</div>
        </div>
      </foreignObject>
    </g>

    <g id="Stakeholder" transform="translate(552, 1018)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use href="#RoleIcon" x="166" y="2" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Stakeholder</div>
        </div>
      </foreignObject>
    </g>

    <g id="Meaning" transform="translate(732, 947)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use href="#MeaningIcon" x="166" y="2" />
      <path class="symbol" d="M7.1.9C8.1.2 10.1-.3 12.2.5 13.3-.4 14.9 2.1 13.3 2.9 14.2 2.1 14.4 7.5 13.1 7.8 12.9 10.1 11.1 10.4 8.4 9.6 6.5 10 .7 10.4 1.7 9-.3 9-.5 3.2.8 2.7-1 .8 1.4-.7 3.5.5 4.4-.4 6.6.2 7.1.9" data-size-hint="14 10 s" transform="matrix(6,0,0,6,0,0)" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Meaning</div>
        </div>
      </foreignObject>
    </g>

    <g id="Value" transform="translate(732, 1018)" class="motivation element">
      <ellipse cx="84" cy="30" rx="84" ry="30" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Value</div>
        </div>
      </foreignObject>
    </g>
    <g id="Outcome" transform="translate(372, 948)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use href="#OutcomeIcon" x="166" y="2" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Outcome</div>
        </div>
      </foreignObject> 
    </g>

    <g id="Principle" transform="translate(552, 948)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use href="#PrincipleIcon" x="166" y="2" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Principle</div>
        </div>
      </foreignObject>
    </g>

    <g id="ApplicationComponent" transform="translate(372, 384)" class="application active element">
      <rect width="168" height="60" />
      <use href="#ComponentIcon" x="168" y="0" />
      <rect x="8" y="0" width="160" height="60" />
      <rect x="0" y="12" width="16" height="10" />
      <rect x="0" y="28" width="16" height="10" />
      <foreignObject x="0px" width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Application Component</div>
        </div>
      </foreignObject>
    </g>
    <g id="IconTemplate" transform="translate(552, 384)" class="application active element icon">
      <use class="symbol" href="#DriverIcon" transform="matrix(4,0,0,4,84,30)" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Icon Template</div>
        </div>
      </foreignObject>
    </g>
    <g id="DataObject" transform="translate(192, 384)" class="application structure element">
      <rect width="168" height="60" />
      <path d="M 0 8 l 168 0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Data Object</div>
        </div>
      </foreignObject>
    </g>

    <g id="Location" transform="translate(552, 878)" class="location element">
      <rect width="168" height="60" />
      <use href="#LocationIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Location</div>
        </div>
      </foreignObject>
    </g>

    <g id="Gap" transform="translate(372, 808)" class="plateau element">
      <path d="M 0 0 l 168 0 l 0 56 c -84 -16 -84 16 -168 0 Z" />
      <use href="#GapIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Gap</div>
        </div>
      </foreignObject>
    </g>

    <g id="Plateau" transform="translate(552, 808)" class="plateau structure element">
      <path d="M 0 8 l 8 -8 l 160 0 l 0 52 l -8 8 l -160 0zM168 0 l -8 8" />
      <rect x="0" y="8" width="160" height="52" />
      <use href="#PlateauIcon" x="160" y="8" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Plateau</div>
        </div>
      </foreignObject>
    </g>

    <g id="WorkPackage" transform="translate(192, 878)" class="behavior implementation element">
      <rect width="168" height="60" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Work Package</div>
        </div>
      </foreignObject>
    </g>

    <g id="Deliverable" transform="translate(372, 878)" class="implementation element">
      <path d="M 0 0 l 168 0 l 0 56 c -84 -16 -84 16 -168 0 Z" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Deliverable</div>
        </div>
      </foreignObject>
    </g>

    <g id="ElementSelected" transform="translate(12, 528)" class="undefined element">
      <rect width="168" height="60" />
      <use href="#ExperimentIcon" x="168" y="0" />
      <g class="selection">
        <circle class="rnw" cx="0" cy="0" r="3"></circle>
        <circle class="rsw" cx="0" cy="60" r="3"></circle>
        <circle class="rne" cx="168" cy="0" r="3"></circle>
        <circle class="rse" cx="168" cy="60" r="3"></circle>
        <circle class="rn" cx="84" cy="0" r="2"></circle>
        <circle class="re" cx="168" cy="30" r="2"></circle>
        <circle class="rs" cx="84" cy="60" r="2"></circle>
        <circle class="rw" cx="0" cy="30" r="2"></circle>
      </g>
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div class="left bottom">Selected</div>
          <div class="elementType">type</div>
        </div>
      </foreignObject>
    </g>

    <g id="ElementLastSelected" transform="translate(192, 528)" class="undefined element">
      <rect width="168" height="60" />
      <use href="#ExperimentIcon" x="168" y="0" />
      <g class="selection lastSelection">
        <circle class="rnw" cx="0" cy="0" r="3"></circle>
        <circle class="rsw" cx="0" cy="60" r="3"></circle>
        <circle class="rne" cx="168" cy="0" r="3"></circle>
        <circle class="rse" cx="168" cy="60" r="3"></circle>
        <circle class="rn" cx="84" cy="0" r="2"></circle>
        <circle class="re" cx="168" cy="30" r="2"></circle>
        <circle class="rs" cx="84" cy="60" r="2"></circle>
        <circle class="rw" cx="0" cy="30" r="2"></circle>
      </g>
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Selected, LastSelection</div>
          <div class="elementType">type</div>
        </div>
      </foreignObject>
    </g>

    <g id="ElementWithChild" transform="translate(372, 528)" class="undefined element">
      <rect width="168" height="60" />
      <use href="#ExperimentIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Parent</div>
        </div>
      </foreignObject>
      <g id="ElementWithChild" transform="translate(12, 20)" class="undefined element">
        <rect width="84" height="32" />
        <foreignObject width="84px" height="32px">
          <div xmlns="http://www.w3.org/1999/xhtml" style="width: 84px; height: 32px">
            <div>Child</div>
          </div>
        </foreignObject>
      </g>
    </g>
    <g id="CanvasModelImage" transform="translate(552, 528)" class="canvas element">
      <use class="img" href="#imgSample" transform='matrix(1,0,0,1,0,0)' />
    </g>
    <g id="CanvasModelSticky" transform="translate(732, 598)" class="canvas note element">
      <rect width="168px" height="60px" stroke="none" fill="#fff" />
      <use class="img" href="#imgSample" transform='matrix(1,0,0,1,0,0)' />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168; height: 60px">
          <div>CanvasModelSticky</div>
        </div>
      </foreignObject>
    </g>
    <g id="CanvasModelBlock" transform="translate(732, 528)" class="canvas note element">
      <rect width="168px" height="60px" stroke="none" fill="#fff" />
      <use class="img" href="#imgSample" transform='matrix(1,0,0,1,0,0)' />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168; height: 60px">
          <div>CanvasModelBlock</div>
        </div>
      </foreignObject>
    </g>

    <g id="Junction" transform="translate(552, 24)" class="element junction">
      <ellipse cx="5" cy="5" rx="5" ry="5" />
    </g>

    <g id="JunctionOr" transform="translate(552, 44)" class="element junction or">
      <ellipse cx="5" cy="5" rx="5" ry="5" />
    </g>

    <text x="80" y="14" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">Active
      Structure elements</text>
    <text x="270" y="14" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">Behavior
      elements</text>
    <text x="455" y="14" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">Passive
      Structure elements</text>
    <g transform="translate(580, 24)">
      <text x="0" y="10" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="flow">Composition</text>
      <path d="M 70 10 h 100" class="Composition Relationship" />

      <text x="0" y="25" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="flow">Aggregation</text>
      <path d="M 70 25 h 100" class="Aggregation Relationship" />

      <text x="0" y="40" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="flow">Triggering</text>
      <path d="M 70 40 h 100" class="Triggering Relationship" />

      <text x="0" y="55" fill="#000000" font-family="Helvetica" font-size="11px"
        text-anchor="flow">Specialization</text>
      <path d="M 70 55 h 100" class="Specialization Relationship" />

      <text x="0" y="70" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="flow">Access</text>
      <path d="M 70 70 h 100" class="Access Relationship Read Write" />

      <text x="0" y="85" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="flow">Realization</text>
      <path d="M 70 85 h 100" class="Realization Relationship" />

      <text x="0" y="100" fill="#000000" font-family="Helvetica" font-size="11px"
        text-anchor="flow">Flow</text>
      <path d="M 70 100 h 100" class="Flow Relationship" />

      <text x="0" y="115" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="flow">Assignment</text>
      <path d="M 70 115 h 100" class="Assignment Relationship" />

      <text x="0" y="130" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="flow">Serving</text>
      <path d="M 70 130 h 100" class="Serving Relationship" />

      <text x="0" y="145" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="flow">Influence</text>
      <path d="M 70 145 h 100" class="Influence Relationship" />
      <text x="150" y="140" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="middle">+/-</text>

      <path fill="none" d="M20,160 v20 q0,10,10,10 h 40" stroke="black" />
      <path fill="none" d="M40,160 v25 a20,10,0,0,0,0,10 v 20" stroke="black" />

      <g class="con selected">
        <path d="M 0 240 l 150 0 " class="Assignment Relationship" />
        <path d="M 0 240 l 150 0 " class="RelationshipDetect" />
        <foreignObject x="0" y="220" width="160px" height="40px">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <div>Line Text</div>
          </div>
        </foreignObject>
        <circle cx="0" cy="240" r="3"></circle>
        <circle cx="150" cy="240" r="3"></circle>
        <circle cx="75" cy="240" r="2"></circle>
      </g>
      <g class="con highlight">
        <path d="M 0 255 l 150 0" class="Assignment Relationship" />
        <path d="M 0 255 l 150 0" marker-end="url(#arrowHollow)" />
        <text x="75" y="255" alignment-baseline="middle" text-anchor="middle">Highlight</text>
      </g>
      <g class="con">
        <path d="M 0 275 l 150 0" marker-start="url(#arrowClosedStart)" class="Relationship" />
        <foreignObject x="0" y="255" width="160px" height="40px">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <div>Arrow closed start</div>
          </div>
        </foreignObject>
      </g>
      <g class="con">
        <path d="M 0 290 l 150 0" marker-start="url(#arrowHollowStart)" class="Relationship" />
        <foreignObject x="0" y="270" width="160px" height="40px">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <div>Arrow hollow start</div>
          </div>
        </foreignObject>
      </g>
      <g class="con">
        <path d="M 0 305 l 150 0" marker-start="url(#arrowPointedStart)" class="Relationship" />
        <foreignObject x="0" y="285" width="160px" height="40px">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <div>Arrow line start</div>
          </div>
        </foreignObject>
      </g>
      <g id="editInfo" class="editInfo" transform="translate(0, 330)">
        <rect width="80" height="20" />
        <text x="3" y="10" alignment-baseline="central">100, 100</text>
      </g>
    </g>
  </g>
  <g transform="translate(770, 24)" id="icons">
    <g transform="translate(0, 0)" class="business element">
      <rect width="20" height="20" />
      <use href="#ActorIcon" />
    </g>
    <g transform="translate(20, 0)" class="business element">
      <rect width="20" height="20" />
      <use href="#RoleIcon" />
    </g>
    <g transform="translate(40, 0)" class="business element">
      <rect width="20" height="20" />
      <use href="#CollaborationIcon" />
    </g>
    <g transform="translate(60, 0)" class="business element">
      <rect width="20" height="20" />
      <use href="#InterfaceIcon" />
    </g>
    <g transform="translate(80, 0)" class="business element">
      <rect width="20" height="20" />
      <use href="#ProcessIcon" />
    </g>
    <g transform="translate(0, 24)" class="business element">
      <rect width="20" height="20" />
      <use href="#FunctionIcon" />
    </g>
    <g transform="translate(20, 24)" class="business element">
      <rect width="20" height="20" />
      <use href="#InteractionIcon" />
    </g>
    <g transform="translate(40, 24)" class="business element">
      <rect width="20" height="20" />
      <use href="#EventIcon" />
    </g>
    <g transform="translate(60, 24)" class="business element">
      <rect width="20" height="20" />
      <use href="#ServiceIcon" />
    </g>
    <g transform="translate(80, 24)" class="business element">
      <rect width="20" height="20" />
      <use href="#ObjectIcon" />
    </g>
    <g transform="translate(0, 48)" class="business element">
      <rect width="20" height="20" />
      <use href="#ContractIcon" />
    </g>
    <g transform="translate(20, 48)" class="business element">
      <rect width="20" height="20" />
      <use href="#RepresentationIcon" />
    </g>
    <g transform="translate(40, 48)" class="business element">
      <rect width="20" height="20" />
      <use href="#ProductIcon" />
    </g>
    <g transform="translate(60, 48)" class="application element">
      <rect width="20" height="20" />
      <use href="#ComponentIcon" />
    </g>
    <g transform="translate(80, 48)" class="location element">
      <rect width="20" height="20" />
      <use href="#LocationIcon" />
    </g>
    <g transform="translate(0, 72)" class="technology element">
      <rect width="20" height="20" />
      <use href="#NodeIcon" />
    </g>
    <g transform="translate(20, 72)" class="technology element">
      <rect width="20" height="20" />
      <use href="#DeviceIcon" />
    </g>
    <g transform="translate(40, 72)" class="technology element">
      <rect width="20" height="20" />
      <use href="#SystemSoftwareIcon" />
    </g>
    <g transform="translate(80, 96)" class="technology element">
      <rect width="20" height="20" />
      <use href="#PathIcon" />
    </g>
    <g transform="translate(60, 72)" class="technology element">
      <rect width="20" height="20" />
      <use href="#CommunicationNetworkIcon" />
    </g>
    <g transform="translate(80, 72)" class="technology element">
      <rect width="20" height="20" />
      <use href="#ArtifactIcon" />
    </g>
    <g transform="translate(0, 96)" class="technology element">
      <rect width="20" height="20" />
      <use href="#EquipmentIcon" />
    </g>
    <g transform="translate(20, 96)" class="technology element">
      <rect width="20" height="20" />
      <use href="#FacilityIcon" />
    </g>
    <g transform="translate(40, 96)" class="technology element">
      <rect width="20" height="20" />
      <use href="#DistributionNetworkIcon" />
    </g>
    <g transform="translate(60, 96)" class="technology element">
      <rect width="20" height="20" />
      <use href="#MaterialIcon" />
    </g>
    <g transform="translate(0, 120)" class="implementation element">
      <rect width="20" height="20" />
      <use href="#WorkPackageIcon" />
    </g>
    <g transform="translate(20, 120)" class="implementation element">
      <rect width="20" height="20" />
      <use href="#DeliverableIcon" />
    </g>
    <g transform="translate(40, 120)" class="implementation element">
      <rect width="20" height="20" />
      <use href="#EventIcon" />
    </g>
    <g transform="translate(60, 120)" class="gap element">
      <rect width="20" height="20" />
      <use href="#PlateauIcon" />
    </g>
    <g transform="translate(80, 120)" class="gap element">
      <rect width="20" height="20" />
      <use href="#GapIcon" />
    </g>
    <g transform="translate(0, 144)" class="motivation element">
      <rect width="20" height="20" />
      <use href="#DriverIcon" />
    </g>
    <g transform="translate(20, 144)" class="motivation element">
      <rect width="20" height="20" />
      <use href="#AssessmentIcon" />
    </g>
    <g transform="translate(40, 144)" class="motivation element">
      <rect width="20" height="20" />
      <use href="#GoalIcon" />
    </g>
      <g transform="translate(60, 144)" class="motivation element">
      <rect width="20" height="20" />
      <use href="#OutcomeIcon" />
    </g>
    <g transform="translate(80, 144)" class="motivation element">
      <rect width="20" height="20" />
      <use href="#PrincipleIcon" />
    </g>
    <g transform="translate(0, 168)" class="motivation element">
      <rect width="20" height="20" />
      <use href="#RequirementIcon" />
    </g>
    <g transform="translate(20, 168)" class="motivation element">
      <rect width="20" height="20" />
      <use href="#ConstraintIcon" />
    </g>
    <g transform="translate(40, 168)" class="motivation element">
      <rect width="20" height="20" />
      <use href="#MeaningIcon" />
    </g>
    <g transform="translate(60, 168)" class="motivation element">
      <rect width="20" height="20" />
      <use href="#ValueIcon" />
    </g>
    <g transform="translate(80, 168)" class="strategy element">
      <rect width="20" height="20" />
      <use href="#CourseOfActionIcon" />
    </g>
    <g transform="translate(0, 192)" class="undefined element">
      <rect width="20" height="20" />
      <use href="#NoteIcon" />
    </g>
    <g transform="translate(20, 192)" class="undefined element">
      <rect width="20" height="20" />
      <use href="#GroupingIcon" />
    </g>
    <g transform="translate(0, 216)" class="strategy element">
      <rect width="20" height="20" />
      <use href="#ValueStreamIcon" />
    </g>
    <g transform="translate(20, 216)" class="strategy element">
      <rect width="20" height="20" />
      <use href="#ResourceIcon" />
    </g>
    <g transform="translate(40, 216)" class="strategy element">
      <rect width="20" height="20" />
      <use href="#CapabilityIcon" />
    </g>
  </g>
</svg>
`,Kn=class{constructor(e){N(this,"elementByType");N(this,"elementSelection");N(this,"templateEditInfo");N(this,"icons");this.templateDoc=e;const t=e.getElementById("content");this.elementSelection=t.querySelector("g#ElementSelected>g.selection"),this.templateEditInfo=e.getElementById("editInfo");const n=Array.from(t.querySelectorAll("g.element"));this.elementByType=new Map(n.map(r=>[r.id,r])),t.replaceChildren(),e.getElementById("imageDefs").replaceChildren();const i=e.getElementById("icons");this.icons=Array.from(i.children).map(r=>{var a;(a=r.querySelector("rect"))==null||a.remove();const o=r.getAttributeNode("transform");return o&&r.removeAttributeNode(o),r}),i.remove()}static getFromDrawing(){if(!this.instance){const t=new DOMParser().parseFromString(Gs,"application/xml");this.instance=new Kn(t)}return this.instance}getEmptySvg(){return this.templateDoc.cloneNode(!0)}getElementByType(e,t){const n=e.entityType.split(":").pop();let i=this.createCloneOfType(n);const{width:r,height:o}=t.bounds;if(i=i.replace(/\d{2,}/g,u=>{switch(u){case"168":return`${r}`;case"156":return`${r-12}`;case"152":return`${r-16}`;case"160":return`${r-8}`;case"166":return`${r-2}`;case"84":return`${r/2}`;case"60":return`${o}`;case"52":return`${o-8}`;case"56":return`${o-4}`;case"44":return`${o-16}`;case"30":return`${o/2}`;default:return u}}),n==="Junction"){e.subType==="or"&&(i=i.replace("class='","class='or "));const u=+(r/2).toFixed(2);i=i.replace('cx="5" cy="5" rx="5" ry="5"',`cx='${u}' cy='${u}' rx='${u}' ry='${u}'`)}const c=new DOMParser().parseFromString(i,"text/xml").firstChild;c.setAttribute("transform",`translate(${t.bounds.x}, ${t.bounds.y})`);const m=c.querySelector(":scope>path.symbol");if(m)if(t.figureType==1||e.entityType==="Meaning"){c.removeChild(c.children[0]),c.removeChild(c.children[0]);const u=m.getAttributeNode("d"),w=m.getAttributeNode("data-size-hint");if(w){m.removeAttributeNode(w);const y=w.value.split(" ");if(isNaN(parseFloat(y[2]))){const h=r/parseFloat(y[0]),g=o/parseFloat(y[1]);m.setAttribute("transform",`matrix(${h},0,0,${g},0,0)`)}else{const h=o/parseFloat(y[1]);m.setAttribute("transform",`scale(${h})`);const g=(r-h*parseFloat(y[0]))/h;u.value=u.value.replaceAll(y[2],`${g}`)}}}else c.removeChild(m);else if(e.entityType=="ApplicationComponent")t.figureType==1?(c.removeChild(c.children[2]),c.removeChild(c.children[2]),c.removeChild(c.children[2])):(c.removeChild(c.children[0]),c.removeChild(c.children[0]));else if(t.figureType==1||e.entityType=="SketchModelActor"){const u=c.querySelector(":scope>use");if(u){for(;c.children[0].tagName!="use";)c.removeChild(c.children[0]);u.classList.add("symbol");const w=o/14;u.setAttribute("transform",`matrix(${w},0,0,${w},${r/2},${o/2})`)}}return c}createCloneOfType(e){const t=this.elementByType;let n=r(e);if(n!=null)return n;const i=e.match(/^Technology|^Application|^Implementation/);if(i&&(n=r(e.replace(i[0],"Business")),n!=null))return n.replace("business",i[0].toLowerCase());if(e=="SketchModelActor")return r("BusinessActor");if(e=="SketchModelSticky")return r("CanvasModelSticky");return r("todo");function r(o){var c;const a=(c=t.get(o))==null?void 0:c.cloneNode(!0);return a==null?void 0:a.outerHTML}}getIcon(e){let t=e.replace(/^Business|^Technology|^Application|^Implementation|^Data/,"");return t=="Stakeholder"&&(t="Role"),this.templateDoc.getElementById(t+"Icon").cloneNode(!0)}createEditInfo(){return new qs(this.templateEditInfo.cloneNode(!0))}createElementSelection(e){const t=this.elementSelection.cloneNode(!0);return t.setAttribute("data-element-id",e),new Hs(e,t)}};let Vt=Kn;N(Vt,"instance");class qs{constructor(e){N(this,"text");N(this,"rect");this.element=e,this.text=e.querySelector("text"),this.rect=e.querySelector("rect")}setText(e,t,n){this.text.textContent=e;const i=this.text.getBBox();this.rect.setAttribute("width",`${i.width+10}px`),this.rect.setAttribute("height",`${i.height+4}px`),this.element.setAttribute("transform",`translate(${t},${n})`)}}class Hs{constructor(e,t){N(this,"_lastSelected");this.id=e,this.element=t}get lastSelected(){return this._lastSelected}set lastSelected(e){e!=this._lastSelected&&(this._lastSelected=e,e?this.element.classList.add("lastSelection"):this.element.classList.remove("lastSelection"))}remove(){this.element.remove()}setPosition(e,t,n,i){this.element.setAttribute("transform",`translate(${e},${t})`),this.element.childNodes.forEach(r=>{if(r instanceof SVGCircleElement){const o=r.classList[0];let a=n/2,c=i/2;o.indexOf("e")>=0?a=n:o.indexOf("w")>=0&&(a=0),o.indexOf("s")>=0?c=i:o.indexOf("n")>=0&&(c=0),r.cx.baseVal.value=a,r.cy.baseVal.value=c}})}}class Zs{static getElementInfo(){const e=`4          Generic Metamodel
    4.1      Behavior and Structure Elements
    4.1.1        Active Structure Elements
    4.1.2        Behavior Elements
    4.1.3        Passive Structure Elements
    4.2      Specializations of Structure and Behavior Elements
    4.3      Summary of Structure and Behavior Elements
    4.4      Motivation Elements
    4.5      Composite Elements
    4.5.1        Grouping
    4.5.2        Location
    5          Relationships
    5.1      Structural Relationships
    5.1.1        Composition Relationship
    5.1.2        Aggregation Relationship
    5.1.3        Assignment Relationship
    5.1.4        Realization Relationship
    5.1.5        Semantics of Structural Relationships
    5.2      Dependency Relationships
    5.2.1        Serving Relationship
    5.2.2        Access Relationship
    5.2.3        Influence Relationship
    5.2.4        Association Relationship
    5.2.5        Semantics of Dependency Relationships
    5.3      Dynamic Relationships
    5.3.1        Triggering Relationship
    5.3.2        Flow Relationship
    5.3.3        Semantics of Dynamic Relationships
    5.4      Other Relationships
    5.4.1        Specialization Relationship
    5.4.2        Semantics of Other Relationships
    5.5      Relationship Connectors
    5.5.1        Junction
    5.6      Summary of Relationships
    5.7      Derivation of Relationships
    6          Motivation Elements
    6.1      Motivation Elements Metamodel
    6.2      Stakeholder, Driver, and Assessment
    6.2.1        Stakeholder
    6.2.2        Driver
    6.2.3        Assessment
    6.2.4        Example
    6.3      Goal, Outcome, Principle, Requirement, and Constraint
    6.3.1        Goal
    6.3.2        Outcome
    6.3.3        Principle
    6.3.4        Requirement
    6.3.5        Constraint
    6.3.6        Example
    6.4      Meaning and Value
    6.4.1        Meaning
    6.4.2        Value
    6.4.3        Example
    6.5      Summary of Motivation Elements
    6.6      Relationships with Core Elements
    7          Strategy Elements
    7.1      Strategy Elements Metamodel
    7.2      Structure Elements
    7.2.1        Resource
    7.3      Behavior Elements
    7.3.1        Capability
    7.3.2        Value Stream
    7.3.3        Course of Action
    7.4      Example
    7.5      Summary of Strategy Elements
    7.6      Relationships with Motivation and Core Elements
    8          Business Layer
    8.1      Business Layer Metamodel
    8.2      Active Structure Elements
    8.2.1        Business Actor
    8.2.2        Business Role
    8.2.3        Business Collaboration
    8.2.4        Business Interface
    8.2.5        Example
    8.3      Behavior Elements
    8.3.1        Business Process
    8.3.2        Business Function
    8.3.3        Business Interaction
    8.3.4        Business Event
    8.3.5        Business Service
    8.3.6        Example
    8.4      Passive Structure Elements
    8.4.1        Business Object
    8.4.2        Contract
    8.4.3        Representation
    8.4.4        Example
    8.5      Composite Elements
    8.5.1        Product
    8.5.2        Example
    8.6      Summary of Business Layer Elements
    9          Application Layer
    9.1      Application Layer Metamodel
    9.2      Active Structure Elements
    9.2.1        Application Component
    9.2.2        Application Collaboration
    9.2.3        Application Interface
    9.2.4        Example
    9.3      Behavior Elements
    9.3.1        Application Function
    9.3.2        Application Interaction
    9.3.3        Application Process
    9.3.4        Application Event
    9.3.5        Application Service
    9.3.6        Example
    9.4      Passive Structure Elements
    9.4.1        Data Object
    9.4.2        Example
    9.5      Summary of Application Layer Elements
    10       Technology Layer
    10.1   Technology Layer Metamodel
    10.2   Active Structure Elements
    10.2.1      Node
    10.2.2      Device
    10.2.3      System Software
    10.2.4      Technology Collaboration
    10.2.5      Technology Interface
    10.2.6      Path
    10.2.7      Communication Network
    10.2.8      Example
    10.3   Behavior Elements
    10.3.1      Technology Function
    10.3.2      Technology Process
    10.3.3      Technology Interaction
    10.3.4      Technology Event
    10.3.5      Technology Service
    10.3.6      Example
    10.4   Passive Structure Elements
    10.4.1      Artifact
    10.4.2      Example
    10.5   Summary of Technology Layer Elements
    11       Physical Elements
    11.1   Physical Elements Metamodel
    11.2   Active Structure Elements
    11.2.1      Equipment
    11.2.2      Facility
    11.2.3      Distribution Network
    11.3   Behavior Elements
    11.4   Passive Structure Elements
    11.4.1      Material
    11.5   Example
    11.6   Summary of Physical Elements
    12       Relationships Between Core Layers
    12.1   Alignment of the Business Layer and Lower Layers
    12.2   Alignment of the Application and Technology Layers
    12.3   Example
    13       Implementation and Migration Elements
    13.1   Implementation and Migration Elements Metamodel
    13.2   Implementation and Migration Elements
    13.2.1      Work Package
    13.2.2      Deliverable
    13.2.3      Implementation Event
    13.2.4      Plateau
    13.2.5      Gap
    13.2.6      Example
    13.2.7      Summary of Implementation and Migration Elements
    13.3   Relationships
    13.4   Relationships with Other Aspects and Layers
    14       Stakeholders, Architecture Views, and Viewpoints
    14.1   Introduction
    14.2   Stakeholders and Concerns
    14.3   Architecture Views and Viewpoints
    14.4   Viewpoint Mechanism
    14.4.1      Defining and Classifying Viewpoints
    14.4.2      Creating the View
    14.5   Example Viewpoints
    `,t=/((?:\.?\d+)+) *(.*)/g,n=e.matchAll(t),i=[];let r="",o=null,a=!1;return[...n].forEach(c=>{const m=c[1].split("."),w=c[2].toLowerCase().split(" ");if(m.length==1&&(r=w[0],o=null,a=["elements","layer","metamodel"].includes(w.pop())),!!a&&(m.length==2&&w[w.length-1]=="elements"&&(o=w[0]),m.length==3&&w[0]!="example"&&w[0]!="summary")){const y=w.map(g=>g[0].toUpperCase()+g.substring(1)).join(" ");let h=o;if(r=="generic"){if(o!="composite")return;h=y.toLowerCase()}y=="Plateau"&&(o=h=y.toLowerCase()),i.push({elementName:y,group:r,type:h})}}),i}}const $s="_palettePreview_fk7uo_1",Vs="_palette_fk7uo_1",Me={palettePreview:$s,palette:Vs};class Ys extends Tt{constructor(t,n){super(t,n);N(this,"pointerMoveFunction",t=>this.onPointerMove(t));N(this,"ref");N(this,"active");N(this,"template",Vt.getFromDrawing());this.props=t,this.state=n,this.state.previewX=10,this.state.previewY=250,this.ref=Vr()}componentDidMount(){document.addEventListener("pointermove",this.pointerMoveFunction)}componentWillUnmount(){document.removeEventListener("pointermove",this.pointerMoveFunction)}renderIcon(t){const n=this.template.getIcon(t.elementName.replaceAll(" ",""));return n.classList.add(t.group),n.classList.add(t.type),n.classList.add("element"),n.id="",at("svg",{"data-element-name":t.elementName,width:"20",height:"20",viewBox:"-10 -10 20 20",ref:i=>{i==null||i.replaceChildren(),i==null||i.appendChild(n)},xmlns:"http://www.w3.org/2000/svg"})}render(){const t=Zs.getElementInfo();return at("div",{class:Me.palette,ref:this.ref,onPointerDown:n=>this.onPointerDown(n),onPointerUp:n=>this.onPointerUp(n),children:[t.map(n=>at("span",{onMouseEnter:i=>this.onMouseEnter(i),children:this.renderIcon(n)})),at("div",{children:at(Xs,{elementType:this.state.elementType,x:this.state.previewX,y:this.state.previewY})})]})}onPointerDown(t){t.buttons==1&&(this.placeElement(t),this.active=!0)}onPointerUp(t){this.setState({elementType:null}),this.active=!1}onPointerMove(t){t.buttons!=1||!this.active||(t.preventDefault(),t.stopImmediatePropagation(),this.placeElement(t))}placeElement(t){var r;const n=this.ref.current.querySelector("div."+Me.palettePreview),i=document.body.getBoundingClientRect();n.style.top=`${t.clientY-i.y-52/2}px`,n.style.left=`${t.clientX-i.y-122/2}px`,(r=window.getSelection())==null||r.removeAllRanges(),t.clientX-i.x>this.state.previewX&&this.props.onDragging&&(this.setState({elementType:null}),this.active=!1,this.props.onDragging&&this.props.onDragging(this.state.elementType,t))}onMouseEnter(t){if(t.buttons==1)return;const n=t.target.closest("."+Me.palette),i=document.body.getBoundingClientRect(),r=n.getBoundingClientRect(),c=t.target.closest("span").querySelector("svg").getAttribute("data-element-name");this.setState({previewX:r.x+r.width-i.x,previewY:t.clientY-i.y,elementType:c})}}class Xs extends Tt{constructor(t){super(t);N(this,"template",Vt.getFromDrawing());this.props=t}render(){if(!this.props.elementType)return at("div",{});const t=this.template.getElementByType({entityType:this.props.elementType.replaceAll(" ",""),subType:""},{bounds:new Wt(1,1,120,50),figureType:0}),n=t.querySelector(":scope>foreignObject>div>div");return n.textContent=this.props.elementType,at("div",{class:"content "+Me.palettePreview,style:`position: absolute;  
      top: ${this.props.y-26}px; left: ${this.props.x}px;
      width: 122px; height: 52px; background-color: #ff00;`,children:at("svg",{width:"122",height:"52",ref:r=>i(r)})});function i(r){r==null||r.replaceChildren(),r==null||r.appendChild(t)}}}let Se;const Ks=new Uint8Array(16);function Js(){if(!Se&&(Se=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!Se))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return Se(Ks)}const wt=[];for(let s=0;s<256;++s)wt.push((s+256).toString(16).slice(1));function Qs(s,e=0){return(wt[s[e+0]]+wt[s[e+1]]+wt[s[e+2]]+wt[s[e+3]]+"-"+wt[s[e+4]]+wt[s[e+5]]+"-"+wt[s[e+6]]+wt[s[e+7]]+"-"+wt[s[e+8]]+wt[s[e+9]]+"-"+wt[s[e+10]]+wt[s[e+11]]+wt[s[e+12]]+wt[s[e+13]]+wt[s[e+14]]+wt[s[e+15]]).toLowerCase()}const to=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),Sr={randomUUID:to};function Er(s,e,t){if(Sr.randomUUID&&!e&&!s)return Sr.randomUUID();s=s||{};const n=s.random||(s.rng||Js)();if(n[6]=n[6]&15|64,n[8]=n[8]&63|128,e){t=t||0;for(let i=0;i<16;++i)e[t+i]=n[i];return e}return Qs(n)}class eo extends Tt{constructor(){super(...arguments);N(this,"diagramEditor");N(this,"svgTarget");N(this,"diagramTemplate",Vt.getFromDrawing())}async componentWillMount(){var a;let t;const n=window.localStorage.getItem("lastProject");n?t=Ne.toArrayBuffer(n):t=await me.GetDefaultProjectData();const i=await me.GetProjectFromArrayBuffer(t),r=window.location.hash.slice(1),o=parseInt(r)?i.diagrams[parseInt(r)]:(a=i.diagrams.filter(c=>c.name===r)[0])!=null?a:i.diagrams[0];this.activateLoadedProject(i,o)}componentDidMount(){si({columnGutters:[{track:1,element:document.querySelector(".vertical-gutter")}]})}async changeView(t){var i;const n=(i=this.state.project.diagrams.filter(r=>r.id===t)[0])!=null?i:this.state.project.diagrams[0];this.displayDiagram(this.state.project,n)}save(){const t=new Blob([new XMLSerializer().serializeToString(this.state.project.element.ownerDocument)],{type:"text/xml;charset=utf-8"}),n=document.createElement("a"),i=URL.createObjectURL(t);n.href=i,n.download="test.xml",document.body.appendChild(n),n.click(),setTimeout(function(){document.body.removeChild(n),window.URL.revokeObjectURL(i)},0)}async activateLoadedProject(t,n){this.setState({project:t,diagram:n}),this.displayDiagram(t,n)}async displayDiagram(t,n){var a;(a=this.diagramEditor)==null||a.dispose();const i=new At(t,n,this.diagramTemplate),r=i.buildSvg();this.svgTarget=document.getElementById("svgTarget"),this.svgTarget.innerHTML="";const o=this.svgTarget.appendChild(r.firstChild);this.diagramEditor=new Ot(o,t,n,i),this.diagramEditor.makeDraggable()}async uploadFile(){const t=document.createElement("input");t.type="file",t.name="fileUpload",t.click(),t.onchange=()=>{const n=new FileReader;n.readAsArrayBuffer(t.files[0]),n.onload=async()=>{const i=await me.GetProjectFromArrayBuffer(n.result);this.activateLoadedProject(i,i.diagrams[0])},n.onerror=function(){console.log(n.error)}}}getCleanedSvgForExport(){const n=this.svgTarget.childNodes[0].cloneNode(!0);return n.querySelector(":scope>rect").setAttribute("fill","#fff"),n}async downloadSvg(){const t=this.getCleanedSvgForExport(),n=new Blob([t.outerHTML],{type:"image/svg+xml;charset=utf-8"}),i=URL.createObjectURL(n),r=document.createElement("a");r.download="archi.svg",r.href=i,r.click()}async downloadPng(){const t=this.getCleanedSvgForExport(),n=document.createElement("canvas"),i=n.getContext("2d"),r=new Image;r.width=n.width=t.width.baseVal.value,r.height=n.height=t.height.baseVal.value,r.onload=function(){i.drawImage(r,0,0,r.width,r.height);const a=document.createElement("a");a.download="archi.png",a.href=n.toDataURL(),a.click()};const o=t.outerHTML;r.src="data:image/svg+xml,"+encodeURIComponent(o)}render(){var t;return at("div",{children:[at("p",{children:[at("button",{onClick:()=>this.uploadFile(),children:"Open Achi File"}),"\xA0",at("button",{onClick:()=>this.downloadSvg(),children:"Download SVG"}),at("button",{onClick:()=>this.downloadPng(),children:"Download PNG"})]}),at("div",{class:"grid",children:[at("div",{id:"leftThing",class:"split split-horizontal",children:[at("ul",{id:"diagramTree",children:at(ai,{project:this.state.project,active:(t=this.state.diagram)==null?void 0:t.id,onDiagramSelected:n=>this.changeView(n)})}),at(Ys,{onDragging:(n,i)=>this.onDragging(n,i)})]}),at("div",{class:"vertical-gutter"}),at("div",{id:"svgTarget",class:"split split-horizontal"})]})]})}onDragging(t,n){if(!this.diagramEditor)return;const i=this.diagramEditor.getMousePosition(n),r=new ye;r.id="id-"+Er(),r.name=t,r.entityType="archimate:"+t.replaceAll(" ","");const o=new Ln;o.id="id-"+Er(),o.entityType="archimate:DiagramObject",o.bounds=new Wt(i.x-168/2,i.y-60/2,168,60),o.entityId=r.id,o.children=[],o.sourceConnections=[],this.diagramEditor.finalizeAction({action:lt.AddRemoveElement,diagramId:this.state.diagram.id,addRemoveElement:{adding:!0,entity:r,element:o}}),this.diagramEditor.startDragging(o.id,i,!0)}}Jr(at(eo,{}),document.querySelector("#app"));
