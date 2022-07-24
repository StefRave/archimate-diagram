const Or=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function e(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerpolicy&&(i.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?i.credentials="include":s.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=e(s);fetch(s.href,i)}};Or();class ye{constructor(t,e,n){this.project=t,this.diagram=e,this.template=n,this.svgDocument=this.template.getEmptySvg(),this.svgContent=this.svgDocument.getElementById("Content"),this.sourceConnectionMiddlePoints=new Map}buildSvg(){return this.svgContent.id=this.diagram.Id,this.addElements(this.diagram.Children,this.svgContent),this.addRelations(),this.setViewBoxSize(),this.svgDocument}setViewBoxSize(){const t=this.diagram.Descendants[0].AbsolutePosition;let[e,n]=[t.x,t.y],[s,i]=[0,0];this.diagram.Descendants.forEach(l=>{e=Math.min(e,l.AbsolutePosition.x),n=Math.min(n,l.AbsolutePosition.y),s=Math.max(s,l.AbsolutePosition.x+l.bounds.width),i=Math.max(i,l.AbsolutePosition.y+l.bounds.height)}),this.svgDocument.firstElementChild.setAttribute("viewBox",`${(e-10).toFixed(0)} ${(n-10).toFixed(0)} ${(s-e+20).toFixed(0)} ${(i-n+20).toFixed(0)}`),this.svgDocument.firstElementChild.setAttribute("width",`${(s-e+20).toFixed(0)}`),this.svgDocument.firstElementChild.setAttribute("height",`${(i-n+20).toFixed(0)}`)}addElements(t,e){t.forEach(n=>this.addElement(n,e))}addElement(t,e){var d,v;let n=this.project.getById(t.ElementId);if(n==null){if(n=new et,n.entityType=t.EntityType,n.name=t.Element.getAttribute("name"),n.entityType==="Note"){let u=(v=(d=Array.from(t.Element.childNodes).filter(x=>x.nodeName==="content")[0])==null?void 0:d.textContent)!=null?v:"";u=u.replace(/[\uf0b7\uf0a7]/g,"\u2022").replace(/\r/g,""),n.name=u}n.documentation=t.Element.getAttribute("documentation")}const s=this.template.getElementByType(n,t.bounds);s.setAttribute("transform",`translate(${t.bounds.x}, ${t.bounds.y})`),s.setAttribute("id",t.Id.toString());const i=s.querySelector("foreignObject>div>div");if(i!=null&&(i.textContent=n.name,i.setAttribute("contenteditable","true"),!s.classList.contains("group")&&!s.classList.contains("note"))){const u=s.ownerDocument.createElementNS(i.namespaceURI,"div");u.textContent=n.entityType,u.setAttribute("class","elementType"),i.parentNode.appendChild(u)}a();let l="";t.FillColor&&(l+="fill: "+t.FillColor+" "),l!==""&&Array.from(s.children).filter(x=>x.nodeName=="rect"||x.nodeName=="path").forEach(x=>x.setAttribute("style",l)),e.append(s),this.addElements(t.Children,s);function a(){if(n.documentation){const u=s.ownerDocument.createElementNS(s.namespaceURI,"title");u.textContent=n.documentation,s.insertBefore(u,s.firstChild)}}}clearRelations(){this.svgContent.parentElement.querySelectorAll("g.con").forEach(e=>e.remove()),this.sourceConnectionMiddlePoints.clear()}addRelations(){let t=this.diagram.Descendants.flatMap(n=>n.SourceConnections),e=[];for(this.sourceConnectionMiddlePoints.clear();t.length>0;){e=t,t=[];for(const n of e){const[s,i]=this.getAbsolutePositionAndBounds(this.diagram.GetDiagramObjectById(n.TargetId));if(s!=null){const[l,a]=this.getAbsolutePositionAndBounds(n.Source),d=ye.calculateConnectionCoords(l,a,s,i,n);if(d.length>1){const v=this.project.getById(n.RelationShipId);this.addRelation(d,n,v)}}else t.push(n)}}}getAbsolutePositionAndBounds(t){if(t instanceof Fe){const e=t.AbsolutePosition.add(new pe(t.bounds.width/2,t.bounds.height/2)),n=new pe(t.bounds.width/2,t.bounds.height/2);return[e,n]}else{const e=this.sourceConnectionMiddlePoints.get(t.Id);return e!=null?[e,pe.Zero]:[null,null]}}addRelation(t,e,n){const s=ye.coordsToPathD(t),i=ye.addEditPointGroup(this.svgContent,e,n);ye.addConnectionPath(i,n,s,e),ye.addConnectionPathDetectLine(i,s),ye.addDragPoints(i,t),this.sourceConnectionMiddlePoints.set(e.Id,t.length%2===1?t[(t.length-1)/2]:t[t.length/2-1].add(t[t.length/2]).multiply(.5))}static addDragPoints(t,e){for(let n=0;n<e.length;n++){const s=e[n];let i;if(n>0){const l=e[n-1];i=t.ownerDocument.createElementNS(t.namespaceURI,"circle"),i.setAttribute("cx",((s.x+l.x)/2).toString()),i.setAttribute("cy",((s.y+l.y)/2).toString()),i.setAttribute("r","2"),t.appendChild(i)}i=t.ownerDocument.createElementNS(t.namespaceURI,"circle"),i.setAttribute("cx",s.x.toString()),i.setAttribute("cy",s.y.toString()),i.setAttribute("r","3"),(n===0||n===e.length-1)&&i.classList.add("end"),t.appendChild(i)}}static addConnectionPathDetectLine(t,e){const n=t.ownerDocument.createElementNS(t.namespaceURI,"path");n.setAttribute("d",e),n.setAttribute("class","RelationshipDetect"),t.appendChild(n)}static addEditPointGroup(t,e,n){const s=t.ownerDocument.createElementNS(t.namespaceURI,"g");return s.setAttribute("id",e.Id),s.setAttribute("class","con"),n&&s.setAttribute("data-rel",n.Id),t.appendChild(s),s}static addConnectionPath(t,e,n,s){var v;const i=e==null?void 0:e.entityType;let l=(v=i==null?void 0:i.replace("Relationship"," Relationship"))!=null?v:"Relationship";if(i==="AccessRelationShip"){let u;switch(e.element.getAttribute("accessType")){case"1":u="Read";break;case"2":u="Access";break;case"3":u="Read Write";break;default:u="Write";break}l+=l+" "+u}const a=t.ownerDocument.createElementNS(t.namespaceURI,"path");a.setAttribute("d",n),a.setAttribute("class",l);let d="";s.LineWidth!=null&&(d+="stroke-width:"+s.LineWidth+";"),s.LineColor!=null&&(d+="stroke:"+s.LineColor+";"),d!==""&&a.setAttribute("style",d),t.appendChild(a)}static coordsToPathD(t){let e="";e+=`M ${+t[0].x.toFixed(2)} ${+t[0].y.toFixed(2)} `;const n=12;for(let s=1;s<t.length-1;s++){let i=t[s-1];const l=t[s];let a=t[s+1];const d=Math.sqrt(Math.pow(l.x-i.x,2)+Math.pow(l.y-i.y,2)),v=Math.sqrt(Math.pow(l.x-a.x,2)+Math.pow(l.y-a.y,2));if(d<n*2||v<n*2){e+=`L ${l.x} ${l.y} `;continue}i=i.add(l.subtract(i).multiply((d-n)*(1/d))),a=l.add(a.subtract(l).multiply(n*(1/v))),e+=`L ${+i.x.toFixed(2)} ${+i.y.toFixed(2)} Q ${+l.x.toFixed(2)} ${+l.y.toFixed(2)} ${+a.x.toFixed(2)} ${+a.y.toFixed(2)} `}return e+=`L ${+t.slice(-1)[0].x.toFixed(2)} ${+t.slice(-1)[0].y.toFixed(2)} `,e}static calculateConnectionCoords(t,e,n,s,i){t=new pe(t.x,t.y),n=new pe(n.x,n.y);const l=i.BendPoints.map(v=>t.add(new pe(v.x,v.y))),a=[];let d=t;return l.forEach(v=>{ye.determineStartAndEnd(d,e,v,pe.Zero),a.push(d),e=pe.Zero,d=v}),ye.determineStartAndEnd(d,e,n,s),a.push(d),(d.x!==n.x||d.y!==n.y)&&a.push(n),a}static determineStartAndEnd(t,e,n,s){if(t.y-e.y>n.y+s.y)t.y=t.y-e.y,n.y=n.y+s.y;else if(t.y+e.y<n.y-s.y)t.y=t.y+e.y,n.y=n.y-s.y;else{const i=Math.max(t.y-e.y,n.y-s.y),l=Math.min(t.y+e.y,n.y+s.y),a=(i+l)/2;t.y=a,n.y=a}if(t.x-e.x>n.x+s.x)t.x=t.x-e.x,n.x=n.x+s.x;else if(t.x+e.x<n.x-s.x)t.x=t.x+e.x,n.x=n.x-s.x;else{const i=Math.max(t.x-e.x,n.x-s.x),l=Math.min(t.x+e.x,n.x+s.x),a=(i+l)/2;t.x=a,n.x=a}}}var Rn=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{};function Ir(r){if(r.__esModule)return r;var t=Object.defineProperty({},"__esModule",{value:!0});return Object.keys(r).forEach(function(e){var n=Object.getOwnPropertyDescriptor(r,e);Object.defineProperty(t,e,n.get?n:{enumerable:!0,get:function(){return r[e]}})}),t}function qe(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Xn={exports:{}};/*!

JSZip v3.7.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/(function(r,t){(function(e){r.exports=e()})(function(){return function e(n,s,i){function l(v,u){if(!s[v]){if(!n[v]){var x=typeof qe=="function"&&qe;if(!u&&x)return x(v,!0);if(a)return a(v,!0);var w=new Error("Cannot find module '"+v+"'");throw w.code="MODULE_NOT_FOUND",w}var h=s[v]={exports:{}};n[v][0].call(h.exports,function(m){var b=n[v][1][m];return l(b||m)},h,h.exports,e,n,s,i)}return s[v].exports}for(var a=typeof qe=="function"&&qe,d=0;d<i.length;d++)l(i[d]);return l}({1:[function(e,n,s){var i=e("./utils"),l=e("./support"),a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";s.encode=function(d){for(var v,u,x,w,h,m,b,f=[],p=0,y=d.length,S=y,P=i.getTypeOf(d)!=="string";p<d.length;)S=y-p,x=P?(v=d[p++],u=p<y?d[p++]:0,p<y?d[p++]:0):(v=d.charCodeAt(p++),u=p<y?d.charCodeAt(p++):0,p<y?d.charCodeAt(p++):0),w=v>>2,h=(3&v)<<4|u>>4,m=1<S?(15&u)<<2|x>>6:64,b=2<S?63&x:64,f.push(a.charAt(w)+a.charAt(h)+a.charAt(m)+a.charAt(b));return f.join("")},s.decode=function(d){var v,u,x,w,h,m,b=0,f=0,p="data:";if(d.substr(0,p.length)===p)throw new Error("Invalid base64 input, it looks like a data url.");var y,S=3*(d=d.replace(/[^A-Za-z0-9\+\/\=]/g,"")).length/4;if(d.charAt(d.length-1)===a.charAt(64)&&S--,d.charAt(d.length-2)===a.charAt(64)&&S--,S%1!=0)throw new Error("Invalid base64 input, bad content length.");for(y=l.uint8array?new Uint8Array(0|S):new Array(0|S);b<d.length;)v=a.indexOf(d.charAt(b++))<<2|(w=a.indexOf(d.charAt(b++)))>>4,u=(15&w)<<4|(h=a.indexOf(d.charAt(b++)))>>2,x=(3&h)<<6|(m=a.indexOf(d.charAt(b++))),y[f++]=v,h!==64&&(y[f++]=u),m!==64&&(y[f++]=x);return y}},{"./support":30,"./utils":32}],2:[function(e,n,s){var i=e("./external"),l=e("./stream/DataWorker"),a=e("./stream/Crc32Probe"),d=e("./stream/DataLengthProbe");function v(u,x,w,h,m){this.compressedSize=u,this.uncompressedSize=x,this.crc32=w,this.compression=h,this.compressedContent=m}v.prototype={getContentWorker:function(){var u=new l(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new d("data_length")),x=this;return u.on("end",function(){if(this.streamInfo.data_length!==x.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),u},getCompressedWorker:function(){return new l(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},v.createWorkerFrom=function(u,x,w){return u.pipe(new a).pipe(new d("uncompressedSize")).pipe(x.compressWorker(w)).pipe(new d("compressedSize")).withStreamInfo("compression",x)},n.exports=v},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,n,s){var i=e("./stream/GenericWorker");s.STORE={magic:"\0\0",compressWorker:function(l){return new i("STORE compression")},uncompressWorker:function(){return new i("STORE decompression")}},s.DEFLATE=e("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,n,s){var i=e("./utils"),l=function(){for(var a,d=[],v=0;v<256;v++){a=v;for(var u=0;u<8;u++)a=1&a?3988292384^a>>>1:a>>>1;d[v]=a}return d}();n.exports=function(a,d){return a!==void 0&&a.length?i.getTypeOf(a)!=="string"?function(v,u,x,w){var h=l,m=w+x;v^=-1;for(var b=w;b<m;b++)v=v>>>8^h[255&(v^u[b])];return-1^v}(0|d,a,a.length,0):function(v,u,x,w){var h=l,m=w+x;v^=-1;for(var b=w;b<m;b++)v=v>>>8^h[255&(v^u.charCodeAt(b))];return-1^v}(0|d,a,a.length,0):0}},{"./utils":32}],5:[function(e,n,s){s.base64=!1,s.binary=!1,s.dir=!1,s.createFolders=!0,s.date=null,s.compression=null,s.compressionOptions=null,s.comment=null,s.unixPermissions=null,s.dosPermissions=null},{}],6:[function(e,n,s){var i=null;i=typeof Promise!="undefined"?Promise:e("lie"),n.exports={Promise:i}},{lie:37}],7:[function(e,n,s){var i=typeof Uint8Array!="undefined"&&typeof Uint16Array!="undefined"&&typeof Uint32Array!="undefined",l=e("pako"),a=e("./utils"),d=e("./stream/GenericWorker"),v=i?"uint8array":"array";function u(x,w){d.call(this,"FlateWorker/"+x),this._pako=null,this._pakoAction=x,this._pakoOptions=w,this.meta={}}s.magic="\b\0",a.inherits(u,d),u.prototype.processChunk=function(x){this.meta=x.meta,this._pako===null&&this._createPako(),this._pako.push(a.transformTo(v,x.data),!1)},u.prototype.flush=function(){d.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},u.prototype.cleanUp=function(){d.prototype.cleanUp.call(this),this._pako=null},u.prototype._createPako=function(){this._pako=new l[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var x=this;this._pako.onData=function(w){x.push({data:w,meta:x.meta})}},s.compressWorker=function(x){return new u("Deflate",x)},s.uncompressWorker=function(){return new u("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,n,s){function i(h,m){var b,f="";for(b=0;b<m;b++)f+=String.fromCharCode(255&h),h>>>=8;return f}function l(h,m,b,f,p,y){var S,P,E=h.file,F=h.compression,j=y!==v.utf8encode,Z=a.transformTo("string",y(E.name)),M=a.transformTo("string",v.utf8encode(E.name)),q=E.comment,K=a.transformTo("string",y(q)),k=a.transformTo("string",v.utf8encode(q)),T=M.length!==E.name.length,c=k.length!==q.length,B="",Q="",L="",ee=E.dir,W=E.date,J={crc32:0,compressedSize:0,uncompressedSize:0};m&&!b||(J.crc32=h.crc32,J.compressedSize=h.compressedSize,J.uncompressedSize=h.uncompressedSize);var A=0;m&&(A|=8),j||!T&&!c||(A|=2048);var I=0,X=0;ee&&(I|=16),p==="UNIX"?(X=798,I|=function($,le){var fe=$;return $||(fe=le?16893:33204),(65535&fe)<<16}(E.unixPermissions,ee)):(X=20,I|=function($){return 63&($||0)}(E.dosPermissions)),S=W.getUTCHours(),S<<=6,S|=W.getUTCMinutes(),S<<=5,S|=W.getUTCSeconds()/2,P=W.getUTCFullYear()-1980,P<<=4,P|=W.getUTCMonth()+1,P<<=5,P|=W.getUTCDate(),T&&(Q=i(1,1)+i(u(Z),4)+M,B+="up"+i(Q.length,2)+Q),c&&(L=i(1,1)+i(u(K),4)+k,B+="uc"+i(L.length,2)+L);var H="";return H+=`
\0`,H+=i(A,2),H+=F.magic,H+=i(S,2),H+=i(P,2),H+=i(J.crc32,4),H+=i(J.compressedSize,4),H+=i(J.uncompressedSize,4),H+=i(Z.length,2),H+=i(B.length,2),{fileRecord:x.LOCAL_FILE_HEADER+H+Z+B,dirRecord:x.CENTRAL_FILE_HEADER+i(X,2)+H+i(K.length,2)+"\0\0\0\0"+i(I,4)+i(f,4)+Z+B+K}}var a=e("../utils"),d=e("../stream/GenericWorker"),v=e("../utf8"),u=e("../crc32"),x=e("../signature");function w(h,m,b,f){d.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=m,this.zipPlatform=b,this.encodeFileName=f,this.streamFiles=h,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}a.inherits(w,d),w.prototype.push=function(h){var m=h.meta.percent||0,b=this.entriesCount,f=this._sources.length;this.accumulate?this.contentBuffer.push(h):(this.bytesWritten+=h.data.length,d.prototype.push.call(this,{data:h.data,meta:{currentFile:this.currentFile,percent:b?(m+100*(b-f-1))/b:100}}))},w.prototype.openedSource=function(h){this.currentSourceOffset=this.bytesWritten,this.currentFile=h.file.name;var m=this.streamFiles&&!h.file.dir;if(m){var b=l(h,m,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:b.fileRecord,meta:{percent:0}})}else this.accumulate=!0},w.prototype.closedSource=function(h){this.accumulate=!1;var m=this.streamFiles&&!h.file.dir,b=l(h,m,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(b.dirRecord),m)this.push({data:function(f){return x.DATA_DESCRIPTOR+i(f.crc32,4)+i(f.compressedSize,4)+i(f.uncompressedSize,4)}(h),meta:{percent:100}});else for(this.push({data:b.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},w.prototype.flush=function(){for(var h=this.bytesWritten,m=0;m<this.dirRecords.length;m++)this.push({data:this.dirRecords[m],meta:{percent:100}});var b=this.bytesWritten-h,f=function(p,y,S,P,E){var F=a.transformTo("string",E(P));return x.CENTRAL_DIRECTORY_END+"\0\0\0\0"+i(p,2)+i(p,2)+i(y,4)+i(S,4)+i(F.length,2)+F}(this.dirRecords.length,b,h,this.zipComment,this.encodeFileName);this.push({data:f,meta:{percent:100}})},w.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},w.prototype.registerPrevious=function(h){this._sources.push(h);var m=this;return h.on("data",function(b){m.processChunk(b)}),h.on("end",function(){m.closedSource(m.previous.streamInfo),m._sources.length?m.prepareNextSource():m.end()}),h.on("error",function(b){m.error(b)}),this},w.prototype.resume=function(){return!!d.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},w.prototype.error=function(h){var m=this._sources;if(!d.prototype.error.call(this,h))return!1;for(var b=0;b<m.length;b++)try{m[b].error(h)}catch{}return!0},w.prototype.lock=function(){d.prototype.lock.call(this);for(var h=this._sources,m=0;m<h.length;m++)h[m].lock()},n.exports=w},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,n,s){var i=e("../compressions"),l=e("./ZipFileWorker");s.generateWorker=function(a,d,v){var u=new l(d.streamFiles,v,d.platform,d.encodeFileName),x=0;try{a.forEach(function(w,h){x++;var m=function(y,S){var P=y||S,E=i[P];if(!E)throw new Error(P+" is not a valid compression method !");return E}(h.options.compression,d.compression),b=h.options.compressionOptions||d.compressionOptions||{},f=h.dir,p=h.date;h._compressWorker(m,b).withStreamInfo("file",{name:w,dir:f,date:p,comment:h.comment||"",unixPermissions:h.unixPermissions,dosPermissions:h.dosPermissions}).pipe(u)}),u.entriesCount=x}catch(w){u.error(w)}return u}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,n,s){function i(){if(!(this instanceof i))return new i;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var l=new i;for(var a in this)typeof this[a]!="function"&&(l[a]=this[a]);return l}}(i.prototype=e("./object")).loadAsync=e("./load"),i.support=e("./support"),i.defaults=e("./defaults"),i.version="3.7.1",i.loadAsync=function(l,a){return new i().loadAsync(l,a)},i.external=e("./external"),n.exports=i},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,n,s){var i=e("./utils"),l=e("./external"),a=e("./utf8"),d=e("./zipEntries"),v=e("./stream/Crc32Probe"),u=e("./nodejsUtils");function x(w){return new l.Promise(function(h,m){var b=w.decompressed.getContentWorker().pipe(new v);b.on("error",function(f){m(f)}).on("end",function(){b.streamInfo.crc32!==w.decompressed.crc32?m(new Error("Corrupted zip : CRC32 mismatch")):h()}).resume()})}n.exports=function(w,h){var m=this;return h=i.extend(h||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:a.utf8decode}),u.isNode&&u.isStream(w)?l.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):i.prepareContent("the loaded zip file",w,!0,h.optimizedBinaryString,h.base64).then(function(b){var f=new d(h);return f.load(b),f}).then(function(b){var f=[l.Promise.resolve(b)],p=b.files;if(h.checkCRC32)for(var y=0;y<p.length;y++)f.push(x(p[y]));return l.Promise.all(f)}).then(function(b){for(var f=b.shift(),p=f.files,y=0;y<p.length;y++){var S=p[y];m.file(S.fileNameStr,S.decompressed,{binary:!0,optimizedBinaryString:!0,date:S.date,dir:S.dir,comment:S.fileCommentStr.length?S.fileCommentStr:null,unixPermissions:S.unixPermissions,dosPermissions:S.dosPermissions,createFolders:h.createFolders})}return f.zipComment.length&&(m.comment=f.zipComment),m})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,n,s){var i=e("../utils"),l=e("../stream/GenericWorker");function a(d,v){l.call(this,"Nodejs stream input adapter for "+d),this._upstreamEnded=!1,this._bindStream(v)}i.inherits(a,l),a.prototype._bindStream=function(d){var v=this;(this._stream=d).pause(),d.on("data",function(u){v.push({data:u,meta:{percent:0}})}).on("error",function(u){v.isPaused?this.generatedError=u:v.error(u)}).on("end",function(){v.isPaused?v._upstreamEnded=!0:v.end()})},a.prototype.pause=function(){return!!l.prototype.pause.call(this)&&(this._stream.pause(),!0)},a.prototype.resume=function(){return!!l.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},n.exports=a},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,n,s){var i=e("readable-stream").Readable;function l(a,d,v){i.call(this,d),this._helper=a;var u=this;a.on("data",function(x,w){u.push(x)||u._helper.pause(),v&&v(w)}).on("error",function(x){u.emit("error",x)}).on("end",function(){u.push(null)})}e("../utils").inherits(l,i),l.prototype._read=function(){this._helper.resume()},n.exports=l},{"../utils":32,"readable-stream":16}],14:[function(e,n,s){n.exports={isNode:typeof Buffer!="undefined",newBufferFrom:function(i,l){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(i,l);if(typeof i=="number")throw new Error('The "data" argument must not be a number');return new Buffer(i,l)},allocBuffer:function(i){if(Buffer.alloc)return Buffer.alloc(i);var l=new Buffer(i);return l.fill(0),l},isBuffer:function(i){return Buffer.isBuffer(i)},isStream:function(i){return i&&typeof i.on=="function"&&typeof i.pause=="function"&&typeof i.resume=="function"}}},{}],15:[function(e,n,s){function i(E,F,j){var Z,M=a.getTypeOf(F),q=a.extend(j||{},u);q.date=q.date||new Date,q.compression!==null&&(q.compression=q.compression.toUpperCase()),typeof q.unixPermissions=="string"&&(q.unixPermissions=parseInt(q.unixPermissions,8)),q.unixPermissions&&16384&q.unixPermissions&&(q.dir=!0),q.dosPermissions&&16&q.dosPermissions&&(q.dir=!0),q.dir&&(E=p(E)),q.createFolders&&(Z=f(E))&&y.call(this,Z,!0);var K=M==="string"&&q.binary===!1&&q.base64===!1;j&&j.binary!==void 0||(q.binary=!K),(F instanceof x&&F.uncompressedSize===0||q.dir||!F||F.length===0)&&(q.base64=!1,q.binary=!0,F="",q.compression="STORE",M="string");var k=null;k=F instanceof x||F instanceof d?F:m.isNode&&m.isStream(F)?new b(E,F):a.prepareContent(E,F,q.binary,q.optimizedBinaryString,q.base64);var T=new w(E,k,q);this.files[E]=T}var l=e("./utf8"),a=e("./utils"),d=e("./stream/GenericWorker"),v=e("./stream/StreamHelper"),u=e("./defaults"),x=e("./compressedObject"),w=e("./zipObject"),h=e("./generate"),m=e("./nodejsUtils"),b=e("./nodejs/NodejsStreamInputAdapter"),f=function(E){E.slice(-1)==="/"&&(E=E.substring(0,E.length-1));var F=E.lastIndexOf("/");return 0<F?E.substring(0,F):""},p=function(E){return E.slice(-1)!=="/"&&(E+="/"),E},y=function(E,F){return F=F!==void 0?F:u.createFolders,E=p(E),this.files[E]||i.call(this,E,null,{dir:!0,createFolders:F}),this.files[E]};function S(E){return Object.prototype.toString.call(E)==="[object RegExp]"}var P={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(E){var F,j,Z;for(F in this.files)Z=this.files[F],(j=F.slice(this.root.length,F.length))&&F.slice(0,this.root.length)===this.root&&E(j,Z)},filter:function(E){var F=[];return this.forEach(function(j,Z){E(j,Z)&&F.push(Z)}),F},file:function(E,F,j){if(arguments.length!==1)return E=this.root+E,i.call(this,E,F,j),this;if(S(E)){var Z=E;return this.filter(function(q,K){return!K.dir&&Z.test(q)})}var M=this.files[this.root+E];return M&&!M.dir?M:null},folder:function(E){if(!E)return this;if(S(E))return this.filter(function(M,q){return q.dir&&E.test(M)});var F=this.root+E,j=y.call(this,F),Z=this.clone();return Z.root=j.name,Z},remove:function(E){E=this.root+E;var F=this.files[E];if(F||(E.slice(-1)!=="/"&&(E+="/"),F=this.files[E]),F&&!F.dir)delete this.files[E];else for(var j=this.filter(function(M,q){return q.name.slice(0,E.length)===E}),Z=0;Z<j.length;Z++)delete this.files[j[Z].name];return this},generate:function(E){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(E){var F,j={};try{if((j=a.extend(E||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:l.utf8encode})).type=j.type.toLowerCase(),j.compression=j.compression.toUpperCase(),j.type==="binarystring"&&(j.type="string"),!j.type)throw new Error("No output type specified.");a.checkSupport(j.type),j.platform!=="darwin"&&j.platform!=="freebsd"&&j.platform!=="linux"&&j.platform!=="sunos"||(j.platform="UNIX"),j.platform==="win32"&&(j.platform="DOS");var Z=j.comment||this.comment||"";F=h.generateWorker(this,j,Z)}catch(M){(F=new d("error")).error(M)}return new v(F,j.type||"string",j.mimeType)},generateAsync:function(E,F){return this.generateInternalStream(E).accumulate(F)},generateNodeStream:function(E,F){return(E=E||{}).type||(E.type="nodebuffer"),this.generateInternalStream(E).toNodejsStream(F)}};n.exports=P},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,n,s){n.exports=e("stream")},{stream:void 0}],17:[function(e,n,s){var i=e("./DataReader");function l(a){i.call(this,a);for(var d=0;d<this.data.length;d++)a[d]=255&a[d]}e("../utils").inherits(l,i),l.prototype.byteAt=function(a){return this.data[this.zero+a]},l.prototype.lastIndexOfSignature=function(a){for(var d=a.charCodeAt(0),v=a.charCodeAt(1),u=a.charCodeAt(2),x=a.charCodeAt(3),w=this.length-4;0<=w;--w)if(this.data[w]===d&&this.data[w+1]===v&&this.data[w+2]===u&&this.data[w+3]===x)return w-this.zero;return-1},l.prototype.readAndCheckSignature=function(a){var d=a.charCodeAt(0),v=a.charCodeAt(1),u=a.charCodeAt(2),x=a.charCodeAt(3),w=this.readData(4);return d===w[0]&&v===w[1]&&u===w[2]&&x===w[3]},l.prototype.readData=function(a){if(this.checkOffset(a),a===0)return[];var d=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,d},n.exports=l},{"../utils":32,"./DataReader":18}],18:[function(e,n,s){var i=e("../utils");function l(a){this.data=a,this.length=a.length,this.index=0,this.zero=0}l.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<this.zero+a||a<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(a){},readInt:function(a){var d,v=0;for(this.checkOffset(a),d=this.index+a-1;d>=this.index;d--)v=(v<<8)+this.byteAt(d);return this.index+=a,v},readString:function(a){return i.transformTo("string",this.readData(a))},readData:function(a){},lastIndexOfSignature:function(a){},readAndCheckSignature:function(a){},readDate:function(){var a=this.readInt(4);return new Date(Date.UTC(1980+(a>>25&127),(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1))}},n.exports=l},{"../utils":32}],19:[function(e,n,s){var i=e("./Uint8ArrayReader");function l(a){i.call(this,a)}e("../utils").inherits(l,i),l.prototype.readData=function(a){this.checkOffset(a);var d=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,d},n.exports=l},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,n,s){var i=e("./DataReader");function l(a){i.call(this,a)}e("../utils").inherits(l,i),l.prototype.byteAt=function(a){return this.data.charCodeAt(this.zero+a)},l.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)-this.zero},l.prototype.readAndCheckSignature=function(a){return a===this.readData(4)},l.prototype.readData=function(a){this.checkOffset(a);var d=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,d},n.exports=l},{"../utils":32,"./DataReader":18}],21:[function(e,n,s){var i=e("./ArrayReader");function l(a){i.call(this,a)}e("../utils").inherits(l,i),l.prototype.readData=function(a){if(this.checkOffset(a),a===0)return new Uint8Array(0);var d=this.data.subarray(this.zero+this.index,this.zero+this.index+a);return this.index+=a,d},n.exports=l},{"../utils":32,"./ArrayReader":17}],22:[function(e,n,s){var i=e("../utils"),l=e("../support"),a=e("./ArrayReader"),d=e("./StringReader"),v=e("./NodeBufferReader"),u=e("./Uint8ArrayReader");n.exports=function(x){var w=i.getTypeOf(x);return i.checkSupport(w),w!=="string"||l.uint8array?w==="nodebuffer"?new v(x):l.uint8array?new u(i.transformTo("uint8array",x)):new a(i.transformTo("array",x)):new d(x)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,n,s){s.LOCAL_FILE_HEADER="PK",s.CENTRAL_FILE_HEADER="PK",s.CENTRAL_DIRECTORY_END="PK",s.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK\x07",s.ZIP64_CENTRAL_DIRECTORY_END="PK",s.DATA_DESCRIPTOR="PK\x07\b"},{}],24:[function(e,n,s){var i=e("./GenericWorker"),l=e("../utils");function a(d){i.call(this,"ConvertWorker to "+d),this.destType=d}l.inherits(a,i),a.prototype.processChunk=function(d){this.push({data:l.transformTo(this.destType,d.data),meta:d.meta})},n.exports=a},{"../utils":32,"./GenericWorker":28}],25:[function(e,n,s){var i=e("./GenericWorker"),l=e("../crc32");function a(){i.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}e("../utils").inherits(a,i),a.prototype.processChunk=function(d){this.streamInfo.crc32=l(d.data,this.streamInfo.crc32||0),this.push(d)},n.exports=a},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,n,s){var i=e("../utils"),l=e("./GenericWorker");function a(d){l.call(this,"DataLengthProbe for "+d),this.propName=d,this.withStreamInfo(d,0)}i.inherits(a,l),a.prototype.processChunk=function(d){if(d){var v=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=v+d.data.length}l.prototype.processChunk.call(this,d)},n.exports=a},{"../utils":32,"./GenericWorker":28}],27:[function(e,n,s){var i=e("../utils"),l=e("./GenericWorker");function a(d){l.call(this,"DataWorker");var v=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,d.then(function(u){v.dataIsReady=!0,v.data=u,v.max=u&&u.length||0,v.type=i.getTypeOf(u),v.isPaused||v._tickAndRepeat()},function(u){v.error(u)})}i.inherits(a,l),a.prototype.cleanUp=function(){l.prototype.cleanUp.call(this),this.data=null},a.prototype.resume=function(){return!!l.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,i.delay(this._tickAndRepeat,[],this)),!0)},a.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(i.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},a.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var d=null,v=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":d=this.data.substring(this.index,v);break;case"uint8array":d=this.data.subarray(this.index,v);break;case"array":case"nodebuffer":d=this.data.slice(this.index,v)}return this.index=v,this.push({data:d,meta:{percent:this.max?this.index/this.max*100:0}})},n.exports=a},{"../utils":32,"./GenericWorker":28}],28:[function(e,n,s){function i(l){this.name=l||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}i.prototype={push:function(l){this.emit("data",l)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(l){this.emit("error",l)}return!0},error:function(l){return!this.isFinished&&(this.isPaused?this.generatedError=l:(this.isFinished=!0,this.emit("error",l),this.previous&&this.previous.error(l),this.cleanUp()),!0)},on:function(l,a){return this._listeners[l].push(a),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(l,a){if(this._listeners[l])for(var d=0;d<this._listeners[l].length;d++)this._listeners[l][d].call(this,a)},pipe:function(l){return l.registerPrevious(this)},registerPrevious:function(l){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=l.streamInfo,this.mergeStreamInfo(),this.previous=l;var a=this;return l.on("data",function(d){a.processChunk(d)}),l.on("end",function(){a.end()}),l.on("error",function(d){a.error(d)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var l=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),l=!0),this.previous&&this.previous.resume(),!l},flush:function(){},processChunk:function(l){this.push(l)},withStreamInfo:function(l,a){return this.extraStreamInfo[l]=a,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var l in this.extraStreamInfo)this.extraStreamInfo.hasOwnProperty(l)&&(this.streamInfo[l]=this.extraStreamInfo[l])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var l="Worker "+this.name;return this.previous?this.previous+" -> "+l:l}},n.exports=i},{}],29:[function(e,n,s){var i=e("../utils"),l=e("./ConvertWorker"),a=e("./GenericWorker"),d=e("../base64"),v=e("../support"),u=e("../external"),x=null;if(v.nodestream)try{x=e("../nodejs/NodejsStreamOutputAdapter")}catch{}function w(m,b){return new u.Promise(function(f,p){var y=[],S=m._internalType,P=m._outputType,E=m._mimeType;m.on("data",function(F,j){y.push(F),b&&b(j)}).on("error",function(F){y=[],p(F)}).on("end",function(){try{var F=function(j,Z,M){switch(j){case"blob":return i.newBlob(i.transformTo("arraybuffer",Z),M);case"base64":return d.encode(Z);default:return i.transformTo(j,Z)}}(P,function(j,Z){var M,q=0,K=null,k=0;for(M=0;M<Z.length;M++)k+=Z[M].length;switch(j){case"string":return Z.join("");case"array":return Array.prototype.concat.apply([],Z);case"uint8array":for(K=new Uint8Array(k),M=0;M<Z.length;M++)K.set(Z[M],q),q+=Z[M].length;return K;case"nodebuffer":return Buffer.concat(Z);default:throw new Error("concat : unsupported type '"+j+"'")}}(S,y),E);f(F)}catch(j){p(j)}y=[]}).resume()})}function h(m,b,f){var p=b;switch(b){case"blob":case"arraybuffer":p="uint8array";break;case"base64":p="string"}try{this._internalType=p,this._outputType=b,this._mimeType=f,i.checkSupport(p),this._worker=m.pipe(new l(p)),m.lock()}catch(y){this._worker=new a("error"),this._worker.error(y)}}h.prototype={accumulate:function(m){return w(this,m)},on:function(m,b){var f=this;return m==="data"?this._worker.on(m,function(p){b.call(f,p.data,p.meta)}):this._worker.on(m,function(){i.delay(b,arguments,f)}),this},resume:function(){return i.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(m){if(i.checkSupport("nodestream"),this._outputType!=="nodebuffer")throw new Error(this._outputType+" is not supported by this method");return new x(this,{objectMode:this._outputType!=="nodebuffer"},m)}},n.exports=h},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,n,s){if(s.base64=!0,s.array=!0,s.string=!0,s.arraybuffer=typeof ArrayBuffer!="undefined"&&typeof Uint8Array!="undefined",s.nodebuffer=typeof Buffer!="undefined",s.uint8array=typeof Uint8Array!="undefined",typeof ArrayBuffer=="undefined")s.blob=!1;else{var i=new ArrayBuffer(0);try{s.blob=new Blob([i],{type:"application/zip"}).size===0}catch{try{var l=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);l.append(i),s.blob=l.getBlob("application/zip").size===0}catch{s.blob=!1}}}try{s.nodestream=!!e("readable-stream").Readable}catch{s.nodestream=!1}},{"readable-stream":16}],31:[function(e,n,s){for(var i=e("./utils"),l=e("./support"),a=e("./nodejsUtils"),d=e("./stream/GenericWorker"),v=new Array(256),u=0;u<256;u++)v[u]=252<=u?6:248<=u?5:240<=u?4:224<=u?3:192<=u?2:1;v[254]=v[254]=1;function x(){d.call(this,"utf-8 decode"),this.leftOver=null}function w(){d.call(this,"utf-8 encode")}s.utf8encode=function(h){return l.nodebuffer?a.newBufferFrom(h,"utf-8"):function(m){var b,f,p,y,S,P=m.length,E=0;for(y=0;y<P;y++)(64512&(f=m.charCodeAt(y)))==55296&&y+1<P&&(64512&(p=m.charCodeAt(y+1)))==56320&&(f=65536+(f-55296<<10)+(p-56320),y++),E+=f<128?1:f<2048?2:f<65536?3:4;for(b=l.uint8array?new Uint8Array(E):new Array(E),y=S=0;S<E;y++)(64512&(f=m.charCodeAt(y)))==55296&&y+1<P&&(64512&(p=m.charCodeAt(y+1)))==56320&&(f=65536+(f-55296<<10)+(p-56320),y++),f<128?b[S++]=f:(f<2048?b[S++]=192|f>>>6:(f<65536?b[S++]=224|f>>>12:(b[S++]=240|f>>>18,b[S++]=128|f>>>12&63),b[S++]=128|f>>>6&63),b[S++]=128|63&f);return b}(h)},s.utf8decode=function(h){return l.nodebuffer?i.transformTo("nodebuffer",h).toString("utf-8"):function(m){var b,f,p,y,S=m.length,P=new Array(2*S);for(b=f=0;b<S;)if((p=m[b++])<128)P[f++]=p;else if(4<(y=v[p]))P[f++]=65533,b+=y-1;else{for(p&=y===2?31:y===3?15:7;1<y&&b<S;)p=p<<6|63&m[b++],y--;1<y?P[f++]=65533:p<65536?P[f++]=p:(p-=65536,P[f++]=55296|p>>10&1023,P[f++]=56320|1023&p)}return P.length!==f&&(P.subarray?P=P.subarray(0,f):P.length=f),i.applyFromCharCode(P)}(h=i.transformTo(l.uint8array?"uint8array":"array",h))},i.inherits(x,d),x.prototype.processChunk=function(h){var m=i.transformTo(l.uint8array?"uint8array":"array",h.data);if(this.leftOver&&this.leftOver.length){if(l.uint8array){var b=m;(m=new Uint8Array(b.length+this.leftOver.length)).set(this.leftOver,0),m.set(b,this.leftOver.length)}else m=this.leftOver.concat(m);this.leftOver=null}var f=function(y,S){var P;for((S=S||y.length)>y.length&&(S=y.length),P=S-1;0<=P&&(192&y[P])==128;)P--;return P<0||P===0?S:P+v[y[P]]>S?P:S}(m),p=m;f!==m.length&&(l.uint8array?(p=m.subarray(0,f),this.leftOver=m.subarray(f,m.length)):(p=m.slice(0,f),this.leftOver=m.slice(f,m.length))),this.push({data:s.utf8decode(p),meta:h.meta})},x.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},s.Utf8DecodeWorker=x,i.inherits(w,d),w.prototype.processChunk=function(h){this.push({data:s.utf8encode(h.data),meta:h.meta})},s.Utf8EncodeWorker=w},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,n,s){var i=e("./support"),l=e("./base64"),a=e("./nodejsUtils"),d=e("set-immediate-shim"),v=e("./external");function u(f){return f}function x(f,p){for(var y=0;y<f.length;++y)p[y]=255&f.charCodeAt(y);return p}s.newBlob=function(f,p){s.checkSupport("blob");try{return new Blob([f],{type:p})}catch{try{var y=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return y.append(f),y.getBlob(p)}catch{throw new Error("Bug : can't construct the Blob.")}}};var w={stringifyByChunk:function(f,p,y){var S=[],P=0,E=f.length;if(E<=y)return String.fromCharCode.apply(null,f);for(;P<E;)p==="array"||p==="nodebuffer"?S.push(String.fromCharCode.apply(null,f.slice(P,Math.min(P+y,E)))):S.push(String.fromCharCode.apply(null,f.subarray(P,Math.min(P+y,E)))),P+=y;return S.join("")},stringifyByChar:function(f){for(var p="",y=0;y<f.length;y++)p+=String.fromCharCode(f[y]);return p},applyCanBeUsed:{uint8array:function(){try{return i.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch{return!1}}(),nodebuffer:function(){try{return i.nodebuffer&&String.fromCharCode.apply(null,a.allocBuffer(1)).length===1}catch{return!1}}()}};function h(f){var p=65536,y=s.getTypeOf(f),S=!0;if(y==="uint8array"?S=w.applyCanBeUsed.uint8array:y==="nodebuffer"&&(S=w.applyCanBeUsed.nodebuffer),S)for(;1<p;)try{return w.stringifyByChunk(f,y,p)}catch{p=Math.floor(p/2)}return w.stringifyByChar(f)}function m(f,p){for(var y=0;y<f.length;y++)p[y]=f[y];return p}s.applyFromCharCode=h;var b={};b.string={string:u,array:function(f){return x(f,new Array(f.length))},arraybuffer:function(f){return b.string.uint8array(f).buffer},uint8array:function(f){return x(f,new Uint8Array(f.length))},nodebuffer:function(f){return x(f,a.allocBuffer(f.length))}},b.array={string:h,array:u,arraybuffer:function(f){return new Uint8Array(f).buffer},uint8array:function(f){return new Uint8Array(f)},nodebuffer:function(f){return a.newBufferFrom(f)}},b.arraybuffer={string:function(f){return h(new Uint8Array(f))},array:function(f){return m(new Uint8Array(f),new Array(f.byteLength))},arraybuffer:u,uint8array:function(f){return new Uint8Array(f)},nodebuffer:function(f){return a.newBufferFrom(new Uint8Array(f))}},b.uint8array={string:h,array:function(f){return m(f,new Array(f.length))},arraybuffer:function(f){return f.buffer},uint8array:u,nodebuffer:function(f){return a.newBufferFrom(f)}},b.nodebuffer={string:h,array:function(f){return m(f,new Array(f.length))},arraybuffer:function(f){return b.nodebuffer.uint8array(f).buffer},uint8array:function(f){return m(f,new Uint8Array(f.length))},nodebuffer:u},s.transformTo=function(f,p){if(p=p||"",!f)return p;s.checkSupport(f);var y=s.getTypeOf(p);return b[y][f](p)},s.getTypeOf=function(f){return typeof f=="string"?"string":Object.prototype.toString.call(f)==="[object Array]"?"array":i.nodebuffer&&a.isBuffer(f)?"nodebuffer":i.uint8array&&f instanceof Uint8Array?"uint8array":i.arraybuffer&&f instanceof ArrayBuffer?"arraybuffer":void 0},s.checkSupport=function(f){if(!i[f.toLowerCase()])throw new Error(f+" is not supported by this platform")},s.MAX_VALUE_16BITS=65535,s.MAX_VALUE_32BITS=-1,s.pretty=function(f){var p,y,S="";for(y=0;y<(f||"").length;y++)S+="\\x"+((p=f.charCodeAt(y))<16?"0":"")+p.toString(16).toUpperCase();return S},s.delay=function(f,p,y){d(function(){f.apply(y||null,p||[])})},s.inherits=function(f,p){function y(){}y.prototype=p.prototype,f.prototype=new y},s.extend=function(){var f,p,y={};for(f=0;f<arguments.length;f++)for(p in arguments[f])arguments[f].hasOwnProperty(p)&&y[p]===void 0&&(y[p]=arguments[f][p]);return y},s.prepareContent=function(f,p,y,S,P){return v.Promise.resolve(p).then(function(E){return i.blob&&(E instanceof Blob||["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(E))!==-1)&&typeof FileReader!="undefined"?new v.Promise(function(F,j){var Z=new FileReader;Z.onload=function(M){F(M.target.result)},Z.onerror=function(M){j(M.target.error)},Z.readAsArrayBuffer(E)}):E}).then(function(E){var F=s.getTypeOf(E);return F?(F==="arraybuffer"?E=s.transformTo("uint8array",E):F==="string"&&(P?E=l.decode(E):y&&S!==!0&&(E=function(j){return x(j,i.uint8array?new Uint8Array(j.length):new Array(j.length))}(E))),E):v.Promise.reject(new Error("Can't read the data of '"+f+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,"set-immediate-shim":54}],33:[function(e,n,s){var i=e("./reader/readerFor"),l=e("./utils"),a=e("./signature"),d=e("./zipEntry"),v=(e("./utf8"),e("./support"));function u(x){this.files=[],this.loadOptions=x}u.prototype={checkSignature:function(x){if(!this.reader.readAndCheckSignature(x)){this.reader.index-=4;var w=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+l.pretty(w)+", expected "+l.pretty(x)+")")}},isSignature:function(x,w){var h=this.reader.index;this.reader.setIndex(x);var m=this.reader.readString(4)===w;return this.reader.setIndex(h),m},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var x=this.reader.readData(this.zipCommentLength),w=v.uint8array?"uint8array":"array",h=l.transformTo(w,x);this.zipComment=this.loadOptions.decodeFileName(h)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var x,w,h,m=this.zip64EndOfCentralSize-44;0<m;)x=this.reader.readInt(2),w=this.reader.readInt(4),h=this.reader.readData(w),this.zip64ExtensibleData[x]={id:x,length:w,value:h}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var x,w;for(x=0;x<this.files.length;x++)w=this.files[x],this.reader.setIndex(w.localHeaderOffset),this.checkSignature(a.LOCAL_FILE_HEADER),w.readLocalPart(this.reader),w.handleUTF8(),w.processAttributes()},readCentralDir:function(){var x;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER);)(x=new d({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(x);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var x=this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);if(x<0)throw this.isSignature(0,a.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(x);var w=x;if(this.checkSignature(a.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===l.MAX_VALUE_16BITS||this.diskWithCentralDirStart===l.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===l.MAX_VALUE_16BITS||this.centralDirRecords===l.MAX_VALUE_16BITS||this.centralDirSize===l.MAX_VALUE_32BITS||this.centralDirOffset===l.MAX_VALUE_32BITS){if(this.zip64=!0,(x=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(x),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,a.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var h=this.centralDirOffset+this.centralDirSize;this.zip64&&(h+=20,h+=12+this.zip64EndOfCentralSize);var m=w-h;if(0<m)this.isSignature(w,a.CENTRAL_FILE_HEADER)||(this.reader.zero=m);else if(m<0)throw new Error("Corrupted zip: missing "+Math.abs(m)+" bytes.")},prepareReader:function(x){this.reader=i(x)},load:function(x){this.prepareReader(x),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},n.exports=u},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utf8":31,"./utils":32,"./zipEntry":34}],34:[function(e,n,s){var i=e("./reader/readerFor"),l=e("./utils"),a=e("./compressedObject"),d=e("./crc32"),v=e("./utf8"),u=e("./compressions"),x=e("./support");function w(h,m){this.options=h,this.loadOptions=m}w.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(h){var m,b;if(h.skip(22),this.fileNameLength=h.readInt(2),b=h.readInt(2),this.fileName=h.readData(this.fileNameLength),h.skip(b),this.compressedSize===-1||this.uncompressedSize===-1)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if((m=function(f){for(var p in u)if(u.hasOwnProperty(p)&&u[p].magic===f)return u[p];return null}(this.compressionMethod))===null)throw new Error("Corrupted zip : compression "+l.pretty(this.compressionMethod)+" unknown (inner file : "+l.transformTo("string",this.fileName)+")");this.decompressed=new a(this.compressedSize,this.uncompressedSize,this.crc32,m,h.readData(this.compressedSize))},readCentralPart:function(h){this.versionMadeBy=h.readInt(2),h.skip(2),this.bitFlag=h.readInt(2),this.compressionMethod=h.readString(2),this.date=h.readDate(),this.crc32=h.readInt(4),this.compressedSize=h.readInt(4),this.uncompressedSize=h.readInt(4);var m=h.readInt(2);if(this.extraFieldsLength=h.readInt(2),this.fileCommentLength=h.readInt(2),this.diskNumberStart=h.readInt(2),this.internalFileAttributes=h.readInt(2),this.externalFileAttributes=h.readInt(4),this.localHeaderOffset=h.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");h.skip(m),this.readExtraFields(h),this.parseZIP64ExtraField(h),this.fileComment=h.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var h=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),h==0&&(this.dosPermissions=63&this.externalFileAttributes),h==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!=="/"||(this.dir=!0)},parseZIP64ExtraField:function(h){if(this.extraFields[1]){var m=i(this.extraFields[1].value);this.uncompressedSize===l.MAX_VALUE_32BITS&&(this.uncompressedSize=m.readInt(8)),this.compressedSize===l.MAX_VALUE_32BITS&&(this.compressedSize=m.readInt(8)),this.localHeaderOffset===l.MAX_VALUE_32BITS&&(this.localHeaderOffset=m.readInt(8)),this.diskNumberStart===l.MAX_VALUE_32BITS&&(this.diskNumberStart=m.readInt(4))}},readExtraFields:function(h){var m,b,f,p=h.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});h.index+4<p;)m=h.readInt(2),b=h.readInt(2),f=h.readData(b),this.extraFields[m]={id:m,length:b,value:f};h.setIndex(p)},handleUTF8:function(){var h=x.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=v.utf8decode(this.fileName),this.fileCommentStr=v.utf8decode(this.fileComment);else{var m=this.findExtraFieldUnicodePath();if(m!==null)this.fileNameStr=m;else{var b=l.transformTo(h,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(b)}var f=this.findExtraFieldUnicodeComment();if(f!==null)this.fileCommentStr=f;else{var p=l.transformTo(h,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(p)}}},findExtraFieldUnicodePath:function(){var h=this.extraFields[28789];if(h){var m=i(h.value);return m.readInt(1)!==1||d(this.fileName)!==m.readInt(4)?null:v.utf8decode(m.readData(h.length-5))}return null},findExtraFieldUnicodeComment:function(){var h=this.extraFields[25461];if(h){var m=i(h.value);return m.readInt(1)!==1||d(this.fileComment)!==m.readInt(4)?null:v.utf8decode(m.readData(h.length-5))}return null}},n.exports=w},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,n,s){function i(m,b,f){this.name=m,this.dir=f.dir,this.date=f.date,this.comment=f.comment,this.unixPermissions=f.unixPermissions,this.dosPermissions=f.dosPermissions,this._data=b,this._dataBinary=f.binary,this.options={compression:f.compression,compressionOptions:f.compressionOptions}}var l=e("./stream/StreamHelper"),a=e("./stream/DataWorker"),d=e("./utf8"),v=e("./compressedObject"),u=e("./stream/GenericWorker");i.prototype={internalStream:function(m){var b=null,f="string";try{if(!m)throw new Error("No output type specified.");var p=(f=m.toLowerCase())==="string"||f==="text";f!=="binarystring"&&f!=="text"||(f="string"),b=this._decompressWorker();var y=!this._dataBinary;y&&!p&&(b=b.pipe(new d.Utf8EncodeWorker)),!y&&p&&(b=b.pipe(new d.Utf8DecodeWorker))}catch(S){(b=new u("error")).error(S)}return new l(b,f,"")},async:function(m,b){return this.internalStream(m).accumulate(b)},nodeStream:function(m,b){return this.internalStream(m||"nodebuffer").toNodejsStream(b)},_compressWorker:function(m,b){if(this._data instanceof v&&this._data.compression.magic===m.magic)return this._data.getCompressedWorker();var f=this._decompressWorker();return this._dataBinary||(f=f.pipe(new d.Utf8EncodeWorker)),v.createWorkerFrom(f,m,b)},_decompressWorker:function(){return this._data instanceof v?this._data.getContentWorker():this._data instanceof u?this._data:new a(this._data)}};for(var x=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],w=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},h=0;h<x.length;h++)i.prototype[x[h]]=w;n.exports=i},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,n,s){(function(i){var l,a,d=i.MutationObserver||i.WebKitMutationObserver;if(d){var v=0,u=new d(m),x=i.document.createTextNode("");u.observe(x,{characterData:!0}),l=function(){x.data=v=++v%2}}else if(i.setImmediate||i.MessageChannel===void 0)l="document"in i&&"onreadystatechange"in i.document.createElement("script")?function(){var b=i.document.createElement("script");b.onreadystatechange=function(){m(),b.onreadystatechange=null,b.parentNode.removeChild(b),b=null},i.document.documentElement.appendChild(b)}:function(){setTimeout(m,0)};else{var w=new i.MessageChannel;w.port1.onmessage=m,l=function(){w.port2.postMessage(0)}}var h=[];function m(){var b,f;a=!0;for(var p=h.length;p;){for(f=h,h=[],b=-1;++b<p;)f[b]();p=h.length}a=!1}n.exports=function(b){h.push(b)!==1||a||l()}}).call(this,typeof Rn!="undefined"?Rn:typeof self!="undefined"?self:typeof window!="undefined"?window:{})},{}],37:[function(e,n,s){var i=e("immediate");function l(){}var a={},d=["REJECTED"],v=["FULFILLED"],u=["PENDING"];function x(p){if(typeof p!="function")throw new TypeError("resolver must be a function");this.state=u,this.queue=[],this.outcome=void 0,p!==l&&b(this,p)}function w(p,y,S){this.promise=p,typeof y=="function"&&(this.onFulfilled=y,this.callFulfilled=this.otherCallFulfilled),typeof S=="function"&&(this.onRejected=S,this.callRejected=this.otherCallRejected)}function h(p,y,S){i(function(){var P;try{P=y(S)}catch(E){return a.reject(p,E)}P===p?a.reject(p,new TypeError("Cannot resolve promise with itself")):a.resolve(p,P)})}function m(p){var y=p&&p.then;if(p&&(typeof p=="object"||typeof p=="function")&&typeof y=="function")return function(){y.apply(p,arguments)}}function b(p,y){var S=!1;function P(j){S||(S=!0,a.reject(p,j))}function E(j){S||(S=!0,a.resolve(p,j))}var F=f(function(){y(E,P)});F.status==="error"&&P(F.value)}function f(p,y){var S={};try{S.value=p(y),S.status="success"}catch(P){S.status="error",S.value=P}return S}(n.exports=x).prototype.finally=function(p){if(typeof p!="function")return this;var y=this.constructor;return this.then(function(S){return y.resolve(p()).then(function(){return S})},function(S){return y.resolve(p()).then(function(){throw S})})},x.prototype.catch=function(p){return this.then(null,p)},x.prototype.then=function(p,y){if(typeof p!="function"&&this.state===v||typeof y!="function"&&this.state===d)return this;var S=new this.constructor(l);return this.state!==u?h(S,this.state===v?p:y,this.outcome):this.queue.push(new w(S,p,y)),S},w.prototype.callFulfilled=function(p){a.resolve(this.promise,p)},w.prototype.otherCallFulfilled=function(p){h(this.promise,this.onFulfilled,p)},w.prototype.callRejected=function(p){a.reject(this.promise,p)},w.prototype.otherCallRejected=function(p){h(this.promise,this.onRejected,p)},a.resolve=function(p,y){var S=f(m,y);if(S.status==="error")return a.reject(p,S.value);var P=S.value;if(P)b(p,P);else{p.state=v,p.outcome=y;for(var E=-1,F=p.queue.length;++E<F;)p.queue[E].callFulfilled(y)}return p},a.reject=function(p,y){p.state=d,p.outcome=y;for(var S=-1,P=p.queue.length;++S<P;)p.queue[S].callRejected(y);return p},x.resolve=function(p){return p instanceof this?p:a.resolve(new this(l),p)},x.reject=function(p){var y=new this(l);return a.reject(y,p)},x.all=function(p){var y=this;if(Object.prototype.toString.call(p)!=="[object Array]")return this.reject(new TypeError("must be an array"));var S=p.length,P=!1;if(!S)return this.resolve([]);for(var E=new Array(S),F=0,j=-1,Z=new this(l);++j<S;)M(p[j],j);return Z;function M(q,K){y.resolve(q).then(function(k){E[K]=k,++F!==S||P||(P=!0,a.resolve(Z,E))},function(k){P||(P=!0,a.reject(Z,k))})}},x.race=function(p){var y=this;if(Object.prototype.toString.call(p)!=="[object Array]")return this.reject(new TypeError("must be an array"));var S=p.length,P=!1;if(!S)return this.resolve([]);for(var E=-1,F=new this(l);++E<S;)j=p[E],y.resolve(j).then(function(Z){P||(P=!0,a.resolve(F,Z))},function(Z){P||(P=!0,a.reject(F,Z))});var j;return F}},{immediate:36}],38:[function(e,n,s){var i={};(0,e("./lib/utils/common").assign)(i,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),n.exports=i},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,n,s){var i=e("./zlib/deflate"),l=e("./utils/common"),a=e("./utils/strings"),d=e("./zlib/messages"),v=e("./zlib/zstream"),u=Object.prototype.toString,x=0,w=-1,h=0,m=8;function b(p){if(!(this instanceof b))return new b(p);this.options=l.assign({level:w,method:m,chunkSize:16384,windowBits:15,memLevel:8,strategy:h,to:""},p||{});var y=this.options;y.raw&&0<y.windowBits?y.windowBits=-y.windowBits:y.gzip&&0<y.windowBits&&y.windowBits<16&&(y.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new v,this.strm.avail_out=0;var S=i.deflateInit2(this.strm,y.level,y.method,y.windowBits,y.memLevel,y.strategy);if(S!==x)throw new Error(d[S]);if(y.header&&i.deflateSetHeader(this.strm,y.header),y.dictionary){var P;if(P=typeof y.dictionary=="string"?a.string2buf(y.dictionary):u.call(y.dictionary)==="[object ArrayBuffer]"?new Uint8Array(y.dictionary):y.dictionary,(S=i.deflateSetDictionary(this.strm,P))!==x)throw new Error(d[S]);this._dict_set=!0}}function f(p,y){var S=new b(y);if(S.push(p,!0),S.err)throw S.msg||d[S.err];return S.result}b.prototype.push=function(p,y){var S,P,E=this.strm,F=this.options.chunkSize;if(this.ended)return!1;P=y===~~y?y:y===!0?4:0,typeof p=="string"?E.input=a.string2buf(p):u.call(p)==="[object ArrayBuffer]"?E.input=new Uint8Array(p):E.input=p,E.next_in=0,E.avail_in=E.input.length;do{if(E.avail_out===0&&(E.output=new l.Buf8(F),E.next_out=0,E.avail_out=F),(S=i.deflate(E,P))!==1&&S!==x)return this.onEnd(S),!(this.ended=!0);E.avail_out!==0&&(E.avail_in!==0||P!==4&&P!==2)||(this.options.to==="string"?this.onData(a.buf2binstring(l.shrinkBuf(E.output,E.next_out))):this.onData(l.shrinkBuf(E.output,E.next_out)))}while((0<E.avail_in||E.avail_out===0)&&S!==1);return P===4?(S=i.deflateEnd(this.strm),this.onEnd(S),this.ended=!0,S===x):P!==2||(this.onEnd(x),!(E.avail_out=0))},b.prototype.onData=function(p){this.chunks.push(p)},b.prototype.onEnd=function(p){p===x&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=l.flattenChunks(this.chunks)),this.chunks=[],this.err=p,this.msg=this.strm.msg},s.Deflate=b,s.deflate=f,s.deflateRaw=function(p,y){return(y=y||{}).raw=!0,f(p,y)},s.gzip=function(p,y){return(y=y||{}).gzip=!0,f(p,y)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,n,s){var i=e("./zlib/inflate"),l=e("./utils/common"),a=e("./utils/strings"),d=e("./zlib/constants"),v=e("./zlib/messages"),u=e("./zlib/zstream"),x=e("./zlib/gzheader"),w=Object.prototype.toString;function h(b){if(!(this instanceof h))return new h(b);this.options=l.assign({chunkSize:16384,windowBits:0,to:""},b||{});var f=this.options;f.raw&&0<=f.windowBits&&f.windowBits<16&&(f.windowBits=-f.windowBits,f.windowBits===0&&(f.windowBits=-15)),!(0<=f.windowBits&&f.windowBits<16)||b&&b.windowBits||(f.windowBits+=32),15<f.windowBits&&f.windowBits<48&&(15&f.windowBits)==0&&(f.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new u,this.strm.avail_out=0;var p=i.inflateInit2(this.strm,f.windowBits);if(p!==d.Z_OK)throw new Error(v[p]);this.header=new x,i.inflateGetHeader(this.strm,this.header)}function m(b,f){var p=new h(f);if(p.push(b,!0),p.err)throw p.msg||v[p.err];return p.result}h.prototype.push=function(b,f){var p,y,S,P,E,F,j=this.strm,Z=this.options.chunkSize,M=this.options.dictionary,q=!1;if(this.ended)return!1;y=f===~~f?f:f===!0?d.Z_FINISH:d.Z_NO_FLUSH,typeof b=="string"?j.input=a.binstring2buf(b):w.call(b)==="[object ArrayBuffer]"?j.input=new Uint8Array(b):j.input=b,j.next_in=0,j.avail_in=j.input.length;do{if(j.avail_out===0&&(j.output=new l.Buf8(Z),j.next_out=0,j.avail_out=Z),(p=i.inflate(j,d.Z_NO_FLUSH))===d.Z_NEED_DICT&&M&&(F=typeof M=="string"?a.string2buf(M):w.call(M)==="[object ArrayBuffer]"?new Uint8Array(M):M,p=i.inflateSetDictionary(this.strm,F)),p===d.Z_BUF_ERROR&&q===!0&&(p=d.Z_OK,q=!1),p!==d.Z_STREAM_END&&p!==d.Z_OK)return this.onEnd(p),!(this.ended=!0);j.next_out&&(j.avail_out!==0&&p!==d.Z_STREAM_END&&(j.avail_in!==0||y!==d.Z_FINISH&&y!==d.Z_SYNC_FLUSH)||(this.options.to==="string"?(S=a.utf8border(j.output,j.next_out),P=j.next_out-S,E=a.buf2string(j.output,S),j.next_out=P,j.avail_out=Z-P,P&&l.arraySet(j.output,j.output,S,P,0),this.onData(E)):this.onData(l.shrinkBuf(j.output,j.next_out)))),j.avail_in===0&&j.avail_out===0&&(q=!0)}while((0<j.avail_in||j.avail_out===0)&&p!==d.Z_STREAM_END);return p===d.Z_STREAM_END&&(y=d.Z_FINISH),y===d.Z_FINISH?(p=i.inflateEnd(this.strm),this.onEnd(p),this.ended=!0,p===d.Z_OK):y!==d.Z_SYNC_FLUSH||(this.onEnd(d.Z_OK),!(j.avail_out=0))},h.prototype.onData=function(b){this.chunks.push(b)},h.prototype.onEnd=function(b){b===d.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=l.flattenChunks(this.chunks)),this.chunks=[],this.err=b,this.msg=this.strm.msg},s.Inflate=h,s.inflate=m,s.inflateRaw=function(b,f){return(f=f||{}).raw=!0,m(b,f)},s.ungzip=m},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,n,s){var i=typeof Uint8Array!="undefined"&&typeof Uint16Array!="undefined"&&typeof Int32Array!="undefined";s.assign=function(d){for(var v=Array.prototype.slice.call(arguments,1);v.length;){var u=v.shift();if(u){if(typeof u!="object")throw new TypeError(u+"must be non-object");for(var x in u)u.hasOwnProperty(x)&&(d[x]=u[x])}}return d},s.shrinkBuf=function(d,v){return d.length===v?d:d.subarray?d.subarray(0,v):(d.length=v,d)};var l={arraySet:function(d,v,u,x,w){if(v.subarray&&d.subarray)d.set(v.subarray(u,u+x),w);else for(var h=0;h<x;h++)d[w+h]=v[u+h]},flattenChunks:function(d){var v,u,x,w,h,m;for(v=x=0,u=d.length;v<u;v++)x+=d[v].length;for(m=new Uint8Array(x),v=w=0,u=d.length;v<u;v++)h=d[v],m.set(h,w),w+=h.length;return m}},a={arraySet:function(d,v,u,x,w){for(var h=0;h<x;h++)d[w+h]=v[u+h]},flattenChunks:function(d){return[].concat.apply([],d)}};s.setTyped=function(d){d?(s.Buf8=Uint8Array,s.Buf16=Uint16Array,s.Buf32=Int32Array,s.assign(s,l)):(s.Buf8=Array,s.Buf16=Array,s.Buf32=Array,s.assign(s,a))},s.setTyped(i)},{}],42:[function(e,n,s){var i=e("./common"),l=!0,a=!0;try{String.fromCharCode.apply(null,[0])}catch{l=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{a=!1}for(var d=new i.Buf8(256),v=0;v<256;v++)d[v]=252<=v?6:248<=v?5:240<=v?4:224<=v?3:192<=v?2:1;function u(x,w){if(w<65537&&(x.subarray&&a||!x.subarray&&l))return String.fromCharCode.apply(null,i.shrinkBuf(x,w));for(var h="",m=0;m<w;m++)h+=String.fromCharCode(x[m]);return h}d[254]=d[254]=1,s.string2buf=function(x){var w,h,m,b,f,p=x.length,y=0;for(b=0;b<p;b++)(64512&(h=x.charCodeAt(b)))==55296&&b+1<p&&(64512&(m=x.charCodeAt(b+1)))==56320&&(h=65536+(h-55296<<10)+(m-56320),b++),y+=h<128?1:h<2048?2:h<65536?3:4;for(w=new i.Buf8(y),b=f=0;f<y;b++)(64512&(h=x.charCodeAt(b)))==55296&&b+1<p&&(64512&(m=x.charCodeAt(b+1)))==56320&&(h=65536+(h-55296<<10)+(m-56320),b++),h<128?w[f++]=h:(h<2048?w[f++]=192|h>>>6:(h<65536?w[f++]=224|h>>>12:(w[f++]=240|h>>>18,w[f++]=128|h>>>12&63),w[f++]=128|h>>>6&63),w[f++]=128|63&h);return w},s.buf2binstring=function(x){return u(x,x.length)},s.binstring2buf=function(x){for(var w=new i.Buf8(x.length),h=0,m=w.length;h<m;h++)w[h]=x.charCodeAt(h);return w},s.buf2string=function(x,w){var h,m,b,f,p=w||x.length,y=new Array(2*p);for(h=m=0;h<p;)if((b=x[h++])<128)y[m++]=b;else if(4<(f=d[b]))y[m++]=65533,h+=f-1;else{for(b&=f===2?31:f===3?15:7;1<f&&h<p;)b=b<<6|63&x[h++],f--;1<f?y[m++]=65533:b<65536?y[m++]=b:(b-=65536,y[m++]=55296|b>>10&1023,y[m++]=56320|1023&b)}return u(y,m)},s.utf8border=function(x,w){var h;for((w=w||x.length)>x.length&&(w=x.length),h=w-1;0<=h&&(192&x[h])==128;)h--;return h<0||h===0?w:h+d[x[h]]>w?h:w}},{"./common":41}],43:[function(e,n,s){n.exports=function(i,l,a,d){for(var v=65535&i|0,u=i>>>16&65535|0,x=0;a!==0;){for(a-=x=2e3<a?2e3:a;u=u+(v=v+l[d++]|0)|0,--x;);v%=65521,u%=65521}return v|u<<16|0}},{}],44:[function(e,n,s){n.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,n,s){var i=function(){for(var l,a=[],d=0;d<256;d++){l=d;for(var v=0;v<8;v++)l=1&l?3988292384^l>>>1:l>>>1;a[d]=l}return a}();n.exports=function(l,a,d,v){var u=i,x=v+d;l^=-1;for(var w=v;w<x;w++)l=l>>>8^u[255&(l^a[w])];return-1^l}},{}],46:[function(e,n,s){var i,l=e("../utils/common"),a=e("./trees"),d=e("./adler32"),v=e("./crc32"),u=e("./messages"),x=0,w=4,h=0,m=-2,b=-1,f=4,p=2,y=8,S=9,P=286,E=30,F=19,j=2*P+1,Z=15,M=3,q=258,K=q+M+1,k=42,T=113,c=1,B=2,Q=3,L=4;function ee(o,D){return o.msg=u[D],D}function W(o){return(o<<1)-(4<o?9:0)}function J(o){for(var D=o.length;0<=--D;)o[D]=0}function A(o){var D=o.state,z=D.pending;z>o.avail_out&&(z=o.avail_out),z!==0&&(l.arraySet(o.output,D.pending_buf,D.pending_out,z,o.next_out),o.next_out+=z,D.pending_out+=z,o.total_out+=z,o.avail_out-=z,D.pending-=z,D.pending===0&&(D.pending_out=0))}function I(o,D){a._tr_flush_block(o,0<=o.block_start?o.block_start:-1,o.strstart-o.block_start,D),o.block_start=o.strstart,A(o.strm)}function X(o,D){o.pending_buf[o.pending++]=D}function H(o,D){o.pending_buf[o.pending++]=D>>>8&255,o.pending_buf[o.pending++]=255&D}function $(o,D){var z,_,g=o.max_chain_length,C=o.strstart,N=o.prev_length,R=o.nice_match,O=o.strstart>o.w_size-K?o.strstart-(o.w_size-K):0,U=o.window,V=o.w_mask,G=o.prev,Y=o.strstart+q,ie=U[C+N-1],ne=U[C+N];o.prev_length>=o.good_match&&(g>>=2),R>o.lookahead&&(R=o.lookahead);do if(U[(z=D)+N]===ne&&U[z+N-1]===ie&&U[z]===U[C]&&U[++z]===U[C+1]){C+=2,z++;do;while(U[++C]===U[++z]&&U[++C]===U[++z]&&U[++C]===U[++z]&&U[++C]===U[++z]&&U[++C]===U[++z]&&U[++C]===U[++z]&&U[++C]===U[++z]&&U[++C]===U[++z]&&C<Y);if(_=q-(Y-C),C=Y-q,N<_){if(o.match_start=D,R<=(N=_))break;ie=U[C+N-1],ne=U[C+N]}}while((D=G[D&V])>O&&--g!=0);return N<=o.lookahead?N:o.lookahead}function le(o){var D,z,_,g,C,N,R,O,U,V,G=o.w_size;do{if(g=o.window_size-o.lookahead-o.strstart,o.strstart>=G+(G-K)){for(l.arraySet(o.window,o.window,G,G,0),o.match_start-=G,o.strstart-=G,o.block_start-=G,D=z=o.hash_size;_=o.head[--D],o.head[D]=G<=_?_-G:0,--z;);for(D=z=G;_=o.prev[--D],o.prev[D]=G<=_?_-G:0,--z;);g+=G}if(o.strm.avail_in===0)break;if(N=o.strm,R=o.window,O=o.strstart+o.lookahead,U=g,V=void 0,V=N.avail_in,U<V&&(V=U),z=V===0?0:(N.avail_in-=V,l.arraySet(R,N.input,N.next_in,V,O),N.state.wrap===1?N.adler=d(N.adler,R,V,O):N.state.wrap===2&&(N.adler=v(N.adler,R,V,O)),N.next_in+=V,N.total_in+=V,V),o.lookahead+=z,o.lookahead+o.insert>=M)for(C=o.strstart-o.insert,o.ins_h=o.window[C],o.ins_h=(o.ins_h<<o.hash_shift^o.window[C+1])&o.hash_mask;o.insert&&(o.ins_h=(o.ins_h<<o.hash_shift^o.window[C+M-1])&o.hash_mask,o.prev[C&o.w_mask]=o.head[o.ins_h],o.head[o.ins_h]=C,C++,o.insert--,!(o.lookahead+o.insert<M)););}while(o.lookahead<K&&o.strm.avail_in!==0)}function fe(o,D){for(var z,_;;){if(o.lookahead<K){if(le(o),o.lookahead<K&&D===x)return c;if(o.lookahead===0)break}if(z=0,o.lookahead>=M&&(o.ins_h=(o.ins_h<<o.hash_shift^o.window[o.strstart+M-1])&o.hash_mask,z=o.prev[o.strstart&o.w_mask]=o.head[o.ins_h],o.head[o.ins_h]=o.strstart),z!==0&&o.strstart-z<=o.w_size-K&&(o.match_length=$(o,z)),o.match_length>=M)if(_=a._tr_tally(o,o.strstart-o.match_start,o.match_length-M),o.lookahead-=o.match_length,o.match_length<=o.max_lazy_match&&o.lookahead>=M){for(o.match_length--;o.strstart++,o.ins_h=(o.ins_h<<o.hash_shift^o.window[o.strstart+M-1])&o.hash_mask,z=o.prev[o.strstart&o.w_mask]=o.head[o.ins_h],o.head[o.ins_h]=o.strstart,--o.match_length!=0;);o.strstart++}else o.strstart+=o.match_length,o.match_length=0,o.ins_h=o.window[o.strstart],o.ins_h=(o.ins_h<<o.hash_shift^o.window[o.strstart+1])&o.hash_mask;else _=a._tr_tally(o,0,o.window[o.strstart]),o.lookahead--,o.strstart++;if(_&&(I(o,!1),o.strm.avail_out===0))return c}return o.insert=o.strstart<M-1?o.strstart:M-1,D===w?(I(o,!0),o.strm.avail_out===0?Q:L):o.last_lit&&(I(o,!1),o.strm.avail_out===0)?c:B}function te(o,D){for(var z,_,g;;){if(o.lookahead<K){if(le(o),o.lookahead<K&&D===x)return c;if(o.lookahead===0)break}if(z=0,o.lookahead>=M&&(o.ins_h=(o.ins_h<<o.hash_shift^o.window[o.strstart+M-1])&o.hash_mask,z=o.prev[o.strstart&o.w_mask]=o.head[o.ins_h],o.head[o.ins_h]=o.strstart),o.prev_length=o.match_length,o.prev_match=o.match_start,o.match_length=M-1,z!==0&&o.prev_length<o.max_lazy_match&&o.strstart-z<=o.w_size-K&&(o.match_length=$(o,z),o.match_length<=5&&(o.strategy===1||o.match_length===M&&4096<o.strstart-o.match_start)&&(o.match_length=M-1)),o.prev_length>=M&&o.match_length<=o.prev_length){for(g=o.strstart+o.lookahead-M,_=a._tr_tally(o,o.strstart-1-o.prev_match,o.prev_length-M),o.lookahead-=o.prev_length-1,o.prev_length-=2;++o.strstart<=g&&(o.ins_h=(o.ins_h<<o.hash_shift^o.window[o.strstart+M-1])&o.hash_mask,z=o.prev[o.strstart&o.w_mask]=o.head[o.ins_h],o.head[o.ins_h]=o.strstart),--o.prev_length!=0;);if(o.match_available=0,o.match_length=M-1,o.strstart++,_&&(I(o,!1),o.strm.avail_out===0))return c}else if(o.match_available){if((_=a._tr_tally(o,0,o.window[o.strstart-1]))&&I(o,!1),o.strstart++,o.lookahead--,o.strm.avail_out===0)return c}else o.match_available=1,o.strstart++,o.lookahead--}return o.match_available&&(_=a._tr_tally(o,0,o.window[o.strstart-1]),o.match_available=0),o.insert=o.strstart<M-1?o.strstart:M-1,D===w?(I(o,!0),o.strm.avail_out===0?Q:L):o.last_lit&&(I(o,!1),o.strm.avail_out===0)?c:B}function re(o,D,z,_,g){this.good_length=o,this.max_lazy=D,this.nice_length=z,this.max_chain=_,this.func=g}function ue(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=y,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new l.Buf16(2*j),this.dyn_dtree=new l.Buf16(2*(2*E+1)),this.bl_tree=new l.Buf16(2*(2*F+1)),J(this.dyn_ltree),J(this.dyn_dtree),J(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new l.Buf16(Z+1),this.heap=new l.Buf16(2*P+1),J(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new l.Buf16(2*P+1),J(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function ce(o){var D;return o&&o.state?(o.total_in=o.total_out=0,o.data_type=p,(D=o.state).pending=0,D.pending_out=0,D.wrap<0&&(D.wrap=-D.wrap),D.status=D.wrap?k:T,o.adler=D.wrap===2?0:1,D.last_flush=x,a._tr_init(D),h):ee(o,m)}function xe(o){var D=ce(o);return D===h&&function(z){z.window_size=2*z.w_size,J(z.head),z.max_lazy_match=i[z.level].max_lazy,z.good_match=i[z.level].good_length,z.nice_match=i[z.level].nice_length,z.max_chain_length=i[z.level].max_chain,z.strstart=0,z.block_start=0,z.lookahead=0,z.insert=0,z.match_length=z.prev_length=M-1,z.match_available=0,z.ins_h=0}(o.state),D}function me(o,D,z,_,g,C){if(!o)return m;var N=1;if(D===b&&(D=6),_<0?(N=0,_=-_):15<_&&(N=2,_-=16),g<1||S<g||z!==y||_<8||15<_||D<0||9<D||C<0||f<C)return ee(o,m);_===8&&(_=9);var R=new ue;return(o.state=R).strm=o,R.wrap=N,R.gzhead=null,R.w_bits=_,R.w_size=1<<R.w_bits,R.w_mask=R.w_size-1,R.hash_bits=g+7,R.hash_size=1<<R.hash_bits,R.hash_mask=R.hash_size-1,R.hash_shift=~~((R.hash_bits+M-1)/M),R.window=new l.Buf8(2*R.w_size),R.head=new l.Buf16(R.hash_size),R.prev=new l.Buf16(R.w_size),R.lit_bufsize=1<<g+6,R.pending_buf_size=4*R.lit_bufsize,R.pending_buf=new l.Buf8(R.pending_buf_size),R.d_buf=1*R.lit_bufsize,R.l_buf=3*R.lit_bufsize,R.level=D,R.strategy=C,R.method=z,xe(o)}i=[new re(0,0,0,0,function(o,D){var z=65535;for(z>o.pending_buf_size-5&&(z=o.pending_buf_size-5);;){if(o.lookahead<=1){if(le(o),o.lookahead===0&&D===x)return c;if(o.lookahead===0)break}o.strstart+=o.lookahead,o.lookahead=0;var _=o.block_start+z;if((o.strstart===0||o.strstart>=_)&&(o.lookahead=o.strstart-_,o.strstart=_,I(o,!1),o.strm.avail_out===0)||o.strstart-o.block_start>=o.w_size-K&&(I(o,!1),o.strm.avail_out===0))return c}return o.insert=0,D===w?(I(o,!0),o.strm.avail_out===0?Q:L):(o.strstart>o.block_start&&(I(o,!1),o.strm.avail_out),c)}),new re(4,4,8,4,fe),new re(4,5,16,8,fe),new re(4,6,32,32,fe),new re(4,4,16,16,te),new re(8,16,32,32,te),new re(8,16,128,128,te),new re(8,32,128,256,te),new re(32,128,258,1024,te),new re(32,258,258,4096,te)],s.deflateInit=function(o,D){return me(o,D,y,15,8,0)},s.deflateInit2=me,s.deflateReset=xe,s.deflateResetKeep=ce,s.deflateSetHeader=function(o,D){return o&&o.state?o.state.wrap!==2?m:(o.state.gzhead=D,h):m},s.deflate=function(o,D){var z,_,g,C;if(!o||!o.state||5<D||D<0)return o?ee(o,m):m;if(_=o.state,!o.output||!o.input&&o.avail_in!==0||_.status===666&&D!==w)return ee(o,o.avail_out===0?-5:m);if(_.strm=o,z=_.last_flush,_.last_flush=D,_.status===k)if(_.wrap===2)o.adler=0,X(_,31),X(_,139),X(_,8),_.gzhead?(X(_,(_.gzhead.text?1:0)+(_.gzhead.hcrc?2:0)+(_.gzhead.extra?4:0)+(_.gzhead.name?8:0)+(_.gzhead.comment?16:0)),X(_,255&_.gzhead.time),X(_,_.gzhead.time>>8&255),X(_,_.gzhead.time>>16&255),X(_,_.gzhead.time>>24&255),X(_,_.level===9?2:2<=_.strategy||_.level<2?4:0),X(_,255&_.gzhead.os),_.gzhead.extra&&_.gzhead.extra.length&&(X(_,255&_.gzhead.extra.length),X(_,_.gzhead.extra.length>>8&255)),_.gzhead.hcrc&&(o.adler=v(o.adler,_.pending_buf,_.pending,0)),_.gzindex=0,_.status=69):(X(_,0),X(_,0),X(_,0),X(_,0),X(_,0),X(_,_.level===9?2:2<=_.strategy||_.level<2?4:0),X(_,3),_.status=T);else{var N=y+(_.w_bits-8<<4)<<8;N|=(2<=_.strategy||_.level<2?0:_.level<6?1:_.level===6?2:3)<<6,_.strstart!==0&&(N|=32),N+=31-N%31,_.status=T,H(_,N),_.strstart!==0&&(H(_,o.adler>>>16),H(_,65535&o.adler)),o.adler=1}if(_.status===69)if(_.gzhead.extra){for(g=_.pending;_.gzindex<(65535&_.gzhead.extra.length)&&(_.pending!==_.pending_buf_size||(_.gzhead.hcrc&&_.pending>g&&(o.adler=v(o.adler,_.pending_buf,_.pending-g,g)),A(o),g=_.pending,_.pending!==_.pending_buf_size));)X(_,255&_.gzhead.extra[_.gzindex]),_.gzindex++;_.gzhead.hcrc&&_.pending>g&&(o.adler=v(o.adler,_.pending_buf,_.pending-g,g)),_.gzindex===_.gzhead.extra.length&&(_.gzindex=0,_.status=73)}else _.status=73;if(_.status===73)if(_.gzhead.name){g=_.pending;do{if(_.pending===_.pending_buf_size&&(_.gzhead.hcrc&&_.pending>g&&(o.adler=v(o.adler,_.pending_buf,_.pending-g,g)),A(o),g=_.pending,_.pending===_.pending_buf_size)){C=1;break}C=_.gzindex<_.gzhead.name.length?255&_.gzhead.name.charCodeAt(_.gzindex++):0,X(_,C)}while(C!==0);_.gzhead.hcrc&&_.pending>g&&(o.adler=v(o.adler,_.pending_buf,_.pending-g,g)),C===0&&(_.gzindex=0,_.status=91)}else _.status=91;if(_.status===91)if(_.gzhead.comment){g=_.pending;do{if(_.pending===_.pending_buf_size&&(_.gzhead.hcrc&&_.pending>g&&(o.adler=v(o.adler,_.pending_buf,_.pending-g,g)),A(o),g=_.pending,_.pending===_.pending_buf_size)){C=1;break}C=_.gzindex<_.gzhead.comment.length?255&_.gzhead.comment.charCodeAt(_.gzindex++):0,X(_,C)}while(C!==0);_.gzhead.hcrc&&_.pending>g&&(o.adler=v(o.adler,_.pending_buf,_.pending-g,g)),C===0&&(_.status=103)}else _.status=103;if(_.status===103&&(_.gzhead.hcrc?(_.pending+2>_.pending_buf_size&&A(o),_.pending+2<=_.pending_buf_size&&(X(_,255&o.adler),X(_,o.adler>>8&255),o.adler=0,_.status=T)):_.status=T),_.pending!==0){if(A(o),o.avail_out===0)return _.last_flush=-1,h}else if(o.avail_in===0&&W(D)<=W(z)&&D!==w)return ee(o,-5);if(_.status===666&&o.avail_in!==0)return ee(o,-5);if(o.avail_in!==0||_.lookahead!==0||D!==x&&_.status!==666){var R=_.strategy===2?function(O,U){for(var V;;){if(O.lookahead===0&&(le(O),O.lookahead===0)){if(U===x)return c;break}if(O.match_length=0,V=a._tr_tally(O,0,O.window[O.strstart]),O.lookahead--,O.strstart++,V&&(I(O,!1),O.strm.avail_out===0))return c}return O.insert=0,U===w?(I(O,!0),O.strm.avail_out===0?Q:L):O.last_lit&&(I(O,!1),O.strm.avail_out===0)?c:B}(_,D):_.strategy===3?function(O,U){for(var V,G,Y,ie,ne=O.window;;){if(O.lookahead<=q){if(le(O),O.lookahead<=q&&U===x)return c;if(O.lookahead===0)break}if(O.match_length=0,O.lookahead>=M&&0<O.strstart&&(G=ne[Y=O.strstart-1])===ne[++Y]&&G===ne[++Y]&&G===ne[++Y]){ie=O.strstart+q;do;while(G===ne[++Y]&&G===ne[++Y]&&G===ne[++Y]&&G===ne[++Y]&&G===ne[++Y]&&G===ne[++Y]&&G===ne[++Y]&&G===ne[++Y]&&Y<ie);O.match_length=q-(ie-Y),O.match_length>O.lookahead&&(O.match_length=O.lookahead)}if(O.match_length>=M?(V=a._tr_tally(O,1,O.match_length-M),O.lookahead-=O.match_length,O.strstart+=O.match_length,O.match_length=0):(V=a._tr_tally(O,0,O.window[O.strstart]),O.lookahead--,O.strstart++),V&&(I(O,!1),O.strm.avail_out===0))return c}return O.insert=0,U===w?(I(O,!0),O.strm.avail_out===0?Q:L):O.last_lit&&(I(O,!1),O.strm.avail_out===0)?c:B}(_,D):i[_.level].func(_,D);if(R!==Q&&R!==L||(_.status=666),R===c||R===Q)return o.avail_out===0&&(_.last_flush=-1),h;if(R===B&&(D===1?a._tr_align(_):D!==5&&(a._tr_stored_block(_,0,0,!1),D===3&&(J(_.head),_.lookahead===0&&(_.strstart=0,_.block_start=0,_.insert=0))),A(o),o.avail_out===0))return _.last_flush=-1,h}return D!==w?h:_.wrap<=0?1:(_.wrap===2?(X(_,255&o.adler),X(_,o.adler>>8&255),X(_,o.adler>>16&255),X(_,o.adler>>24&255),X(_,255&o.total_in),X(_,o.total_in>>8&255),X(_,o.total_in>>16&255),X(_,o.total_in>>24&255)):(H(_,o.adler>>>16),H(_,65535&o.adler)),A(o),0<_.wrap&&(_.wrap=-_.wrap),_.pending!==0?h:1)},s.deflateEnd=function(o){var D;return o&&o.state?(D=o.state.status)!==k&&D!==69&&D!==73&&D!==91&&D!==103&&D!==T&&D!==666?ee(o,m):(o.state=null,D===T?ee(o,-3):h):m},s.deflateSetDictionary=function(o,D){var z,_,g,C,N,R,O,U,V=D.length;if(!o||!o.state||(C=(z=o.state).wrap)===2||C===1&&z.status!==k||z.lookahead)return m;for(C===1&&(o.adler=d(o.adler,D,V,0)),z.wrap=0,V>=z.w_size&&(C===0&&(J(z.head),z.strstart=0,z.block_start=0,z.insert=0),U=new l.Buf8(z.w_size),l.arraySet(U,D,V-z.w_size,z.w_size,0),D=U,V=z.w_size),N=o.avail_in,R=o.next_in,O=o.input,o.avail_in=V,o.next_in=0,o.input=D,le(z);z.lookahead>=M;){for(_=z.strstart,g=z.lookahead-(M-1);z.ins_h=(z.ins_h<<z.hash_shift^z.window[_+M-1])&z.hash_mask,z.prev[_&z.w_mask]=z.head[z.ins_h],z.head[z.ins_h]=_,_++,--g;);z.strstart=_,z.lookahead=M-1,le(z)}return z.strstart+=z.lookahead,z.block_start=z.strstart,z.insert=z.lookahead,z.lookahead=0,z.match_length=z.prev_length=M-1,z.match_available=0,o.next_in=R,o.input=O,o.avail_in=N,z.wrap=C,h},s.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,n,s){n.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(e,n,s){n.exports=function(i,l){var a,d,v,u,x,w,h,m,b,f,p,y,S,P,E,F,j,Z,M,q,K,k,T,c,B;a=i.state,d=i.next_in,c=i.input,v=d+(i.avail_in-5),u=i.next_out,B=i.output,x=u-(l-i.avail_out),w=u+(i.avail_out-257),h=a.dmax,m=a.wsize,b=a.whave,f=a.wnext,p=a.window,y=a.hold,S=a.bits,P=a.lencode,E=a.distcode,F=(1<<a.lenbits)-1,j=(1<<a.distbits)-1;e:do{S<15&&(y+=c[d++]<<S,S+=8,y+=c[d++]<<S,S+=8),Z=P[y&F];t:for(;;){if(y>>>=M=Z>>>24,S-=M,(M=Z>>>16&255)===0)B[u++]=65535&Z;else{if(!(16&M)){if((64&M)==0){Z=P[(65535&Z)+(y&(1<<M)-1)];continue t}if(32&M){a.mode=12;break e}i.msg="invalid literal/length code",a.mode=30;break e}q=65535&Z,(M&=15)&&(S<M&&(y+=c[d++]<<S,S+=8),q+=y&(1<<M)-1,y>>>=M,S-=M),S<15&&(y+=c[d++]<<S,S+=8,y+=c[d++]<<S,S+=8),Z=E[y&j];n:for(;;){if(y>>>=M=Z>>>24,S-=M,!(16&(M=Z>>>16&255))){if((64&M)==0){Z=E[(65535&Z)+(y&(1<<M)-1)];continue n}i.msg="invalid distance code",a.mode=30;break e}if(K=65535&Z,S<(M&=15)&&(y+=c[d++]<<S,(S+=8)<M&&(y+=c[d++]<<S,S+=8)),h<(K+=y&(1<<M)-1)){i.msg="invalid distance too far back",a.mode=30;break e}if(y>>>=M,S-=M,(M=u-x)<K){if(b<(M=K-M)&&a.sane){i.msg="invalid distance too far back",a.mode=30;break e}if(T=p,(k=0)===f){if(k+=m-M,M<q){for(q-=M;B[u++]=p[k++],--M;);k=u-K,T=B}}else if(f<M){if(k+=m+f-M,(M-=f)<q){for(q-=M;B[u++]=p[k++],--M;);if(k=0,f<q){for(q-=M=f;B[u++]=p[k++],--M;);k=u-K,T=B}}}else if(k+=f-M,M<q){for(q-=M;B[u++]=p[k++],--M;);k=u-K,T=B}for(;2<q;)B[u++]=T[k++],B[u++]=T[k++],B[u++]=T[k++],q-=3;q&&(B[u++]=T[k++],1<q&&(B[u++]=T[k++]))}else{for(k=u-K;B[u++]=B[k++],B[u++]=B[k++],B[u++]=B[k++],2<(q-=3););q&&(B[u++]=B[k++],1<q&&(B[u++]=B[k++]))}break}}break}}while(d<v&&u<w);d-=q=S>>3,y&=(1<<(S-=q<<3))-1,i.next_in=d,i.next_out=u,i.avail_in=d<v?v-d+5:5-(d-v),i.avail_out=u<w?w-u+257:257-(u-w),a.hold=y,a.bits=S}},{}],49:[function(e,n,s){var i=e("../utils/common"),l=e("./adler32"),a=e("./crc32"),d=e("./inffast"),v=e("./inftrees"),u=1,x=2,w=0,h=-2,m=1,b=852,f=592;function p(k){return(k>>>24&255)+(k>>>8&65280)+((65280&k)<<8)+((255&k)<<24)}function y(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new i.Buf16(320),this.work=new i.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function S(k){var T;return k&&k.state?(T=k.state,k.total_in=k.total_out=T.total=0,k.msg="",T.wrap&&(k.adler=1&T.wrap),T.mode=m,T.last=0,T.havedict=0,T.dmax=32768,T.head=null,T.hold=0,T.bits=0,T.lencode=T.lendyn=new i.Buf32(b),T.distcode=T.distdyn=new i.Buf32(f),T.sane=1,T.back=-1,w):h}function P(k){var T;return k&&k.state?((T=k.state).wsize=0,T.whave=0,T.wnext=0,S(k)):h}function E(k,T){var c,B;return k&&k.state?(B=k.state,T<0?(c=0,T=-T):(c=1+(T>>4),T<48&&(T&=15)),T&&(T<8||15<T)?h:(B.window!==null&&B.wbits!==T&&(B.window=null),B.wrap=c,B.wbits=T,P(k))):h}function F(k,T){var c,B;return k?(B=new y,(k.state=B).window=null,(c=E(k,T))!==w&&(k.state=null),c):h}var j,Z,M=!0;function q(k){if(M){var T;for(j=new i.Buf32(512),Z=new i.Buf32(32),T=0;T<144;)k.lens[T++]=8;for(;T<256;)k.lens[T++]=9;for(;T<280;)k.lens[T++]=7;for(;T<288;)k.lens[T++]=8;for(v(u,k.lens,0,288,j,0,k.work,{bits:9}),T=0;T<32;)k.lens[T++]=5;v(x,k.lens,0,32,Z,0,k.work,{bits:5}),M=!1}k.lencode=j,k.lenbits=9,k.distcode=Z,k.distbits=5}function K(k,T,c,B){var Q,L=k.state;return L.window===null&&(L.wsize=1<<L.wbits,L.wnext=0,L.whave=0,L.window=new i.Buf8(L.wsize)),B>=L.wsize?(i.arraySet(L.window,T,c-L.wsize,L.wsize,0),L.wnext=0,L.whave=L.wsize):(B<(Q=L.wsize-L.wnext)&&(Q=B),i.arraySet(L.window,T,c-B,Q,L.wnext),(B-=Q)?(i.arraySet(L.window,T,c-B,B,0),L.wnext=B,L.whave=L.wsize):(L.wnext+=Q,L.wnext===L.wsize&&(L.wnext=0),L.whave<L.wsize&&(L.whave+=Q))),0}s.inflateReset=P,s.inflateReset2=E,s.inflateResetKeep=S,s.inflateInit=function(k){return F(k,15)},s.inflateInit2=F,s.inflate=function(k,T){var c,B,Q,L,ee,W,J,A,I,X,H,$,le,fe,te,re,ue,ce,xe,me,o,D,z,_,g=0,C=new i.Buf8(4),N=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!k||!k.state||!k.output||!k.input&&k.avail_in!==0)return h;(c=k.state).mode===12&&(c.mode=13),ee=k.next_out,Q=k.output,J=k.avail_out,L=k.next_in,B=k.input,W=k.avail_in,A=c.hold,I=c.bits,X=W,H=J,D=w;e:for(;;)switch(c.mode){case m:if(c.wrap===0){c.mode=13;break}for(;I<16;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}if(2&c.wrap&&A===35615){C[c.check=0]=255&A,C[1]=A>>>8&255,c.check=a(c.check,C,2,0),I=A=0,c.mode=2;break}if(c.flags=0,c.head&&(c.head.done=!1),!(1&c.wrap)||(((255&A)<<8)+(A>>8))%31){k.msg="incorrect header check",c.mode=30;break}if((15&A)!=8){k.msg="unknown compression method",c.mode=30;break}if(I-=4,o=8+(15&(A>>>=4)),c.wbits===0)c.wbits=o;else if(o>c.wbits){k.msg="invalid window size",c.mode=30;break}c.dmax=1<<o,k.adler=c.check=1,c.mode=512&A?10:12,I=A=0;break;case 2:for(;I<16;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}if(c.flags=A,(255&c.flags)!=8){k.msg="unknown compression method",c.mode=30;break}if(57344&c.flags){k.msg="unknown header flags set",c.mode=30;break}c.head&&(c.head.text=A>>8&1),512&c.flags&&(C[0]=255&A,C[1]=A>>>8&255,c.check=a(c.check,C,2,0)),I=A=0,c.mode=3;case 3:for(;I<32;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}c.head&&(c.head.time=A),512&c.flags&&(C[0]=255&A,C[1]=A>>>8&255,C[2]=A>>>16&255,C[3]=A>>>24&255,c.check=a(c.check,C,4,0)),I=A=0,c.mode=4;case 4:for(;I<16;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}c.head&&(c.head.xflags=255&A,c.head.os=A>>8),512&c.flags&&(C[0]=255&A,C[1]=A>>>8&255,c.check=a(c.check,C,2,0)),I=A=0,c.mode=5;case 5:if(1024&c.flags){for(;I<16;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}c.length=A,c.head&&(c.head.extra_len=A),512&c.flags&&(C[0]=255&A,C[1]=A>>>8&255,c.check=a(c.check,C,2,0)),I=A=0}else c.head&&(c.head.extra=null);c.mode=6;case 6:if(1024&c.flags&&(W<($=c.length)&&($=W),$&&(c.head&&(o=c.head.extra_len-c.length,c.head.extra||(c.head.extra=new Array(c.head.extra_len)),i.arraySet(c.head.extra,B,L,$,o)),512&c.flags&&(c.check=a(c.check,B,$,L)),W-=$,L+=$,c.length-=$),c.length))break e;c.length=0,c.mode=7;case 7:if(2048&c.flags){if(W===0)break e;for($=0;o=B[L+$++],c.head&&o&&c.length<65536&&(c.head.name+=String.fromCharCode(o)),o&&$<W;);if(512&c.flags&&(c.check=a(c.check,B,$,L)),W-=$,L+=$,o)break e}else c.head&&(c.head.name=null);c.length=0,c.mode=8;case 8:if(4096&c.flags){if(W===0)break e;for($=0;o=B[L+$++],c.head&&o&&c.length<65536&&(c.head.comment+=String.fromCharCode(o)),o&&$<W;);if(512&c.flags&&(c.check=a(c.check,B,$,L)),W-=$,L+=$,o)break e}else c.head&&(c.head.comment=null);c.mode=9;case 9:if(512&c.flags){for(;I<16;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}if(A!==(65535&c.check)){k.msg="header crc mismatch",c.mode=30;break}I=A=0}c.head&&(c.head.hcrc=c.flags>>9&1,c.head.done=!0),k.adler=c.check=0,c.mode=12;break;case 10:for(;I<32;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}k.adler=c.check=p(A),I=A=0,c.mode=11;case 11:if(c.havedict===0)return k.next_out=ee,k.avail_out=J,k.next_in=L,k.avail_in=W,c.hold=A,c.bits=I,2;k.adler=c.check=1,c.mode=12;case 12:if(T===5||T===6)break e;case 13:if(c.last){A>>>=7&I,I-=7&I,c.mode=27;break}for(;I<3;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}switch(c.last=1&A,I-=1,3&(A>>>=1)){case 0:c.mode=14;break;case 1:if(q(c),c.mode=20,T!==6)break;A>>>=2,I-=2;break e;case 2:c.mode=17;break;case 3:k.msg="invalid block type",c.mode=30}A>>>=2,I-=2;break;case 14:for(A>>>=7&I,I-=7&I;I<32;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}if((65535&A)!=(A>>>16^65535)){k.msg="invalid stored block lengths",c.mode=30;break}if(c.length=65535&A,I=A=0,c.mode=15,T===6)break e;case 15:c.mode=16;case 16:if($=c.length){if(W<$&&($=W),J<$&&($=J),$===0)break e;i.arraySet(Q,B,L,$,ee),W-=$,L+=$,J-=$,ee+=$,c.length-=$;break}c.mode=12;break;case 17:for(;I<14;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}if(c.nlen=257+(31&A),A>>>=5,I-=5,c.ndist=1+(31&A),A>>>=5,I-=5,c.ncode=4+(15&A),A>>>=4,I-=4,286<c.nlen||30<c.ndist){k.msg="too many length or distance symbols",c.mode=30;break}c.have=0,c.mode=18;case 18:for(;c.have<c.ncode;){for(;I<3;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}c.lens[N[c.have++]]=7&A,A>>>=3,I-=3}for(;c.have<19;)c.lens[N[c.have++]]=0;if(c.lencode=c.lendyn,c.lenbits=7,z={bits:c.lenbits},D=v(0,c.lens,0,19,c.lencode,0,c.work,z),c.lenbits=z.bits,D){k.msg="invalid code lengths set",c.mode=30;break}c.have=0,c.mode=19;case 19:for(;c.have<c.nlen+c.ndist;){for(;re=(g=c.lencode[A&(1<<c.lenbits)-1])>>>16&255,ue=65535&g,!((te=g>>>24)<=I);){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}if(ue<16)A>>>=te,I-=te,c.lens[c.have++]=ue;else{if(ue===16){for(_=te+2;I<_;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}if(A>>>=te,I-=te,c.have===0){k.msg="invalid bit length repeat",c.mode=30;break}o=c.lens[c.have-1],$=3+(3&A),A>>>=2,I-=2}else if(ue===17){for(_=te+3;I<_;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}I-=te,o=0,$=3+(7&(A>>>=te)),A>>>=3,I-=3}else{for(_=te+7;I<_;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}I-=te,o=0,$=11+(127&(A>>>=te)),A>>>=7,I-=7}if(c.have+$>c.nlen+c.ndist){k.msg="invalid bit length repeat",c.mode=30;break}for(;$--;)c.lens[c.have++]=o}}if(c.mode===30)break;if(c.lens[256]===0){k.msg="invalid code -- missing end-of-block",c.mode=30;break}if(c.lenbits=9,z={bits:c.lenbits},D=v(u,c.lens,0,c.nlen,c.lencode,0,c.work,z),c.lenbits=z.bits,D){k.msg="invalid literal/lengths set",c.mode=30;break}if(c.distbits=6,c.distcode=c.distdyn,z={bits:c.distbits},D=v(x,c.lens,c.nlen,c.ndist,c.distcode,0,c.work,z),c.distbits=z.bits,D){k.msg="invalid distances set",c.mode=30;break}if(c.mode=20,T===6)break e;case 20:c.mode=21;case 21:if(6<=W&&258<=J){k.next_out=ee,k.avail_out=J,k.next_in=L,k.avail_in=W,c.hold=A,c.bits=I,d(k,H),ee=k.next_out,Q=k.output,J=k.avail_out,L=k.next_in,B=k.input,W=k.avail_in,A=c.hold,I=c.bits,c.mode===12&&(c.back=-1);break}for(c.back=0;re=(g=c.lencode[A&(1<<c.lenbits)-1])>>>16&255,ue=65535&g,!((te=g>>>24)<=I);){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}if(re&&(240&re)==0){for(ce=te,xe=re,me=ue;re=(g=c.lencode[me+((A&(1<<ce+xe)-1)>>ce)])>>>16&255,ue=65535&g,!(ce+(te=g>>>24)<=I);){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}A>>>=ce,I-=ce,c.back+=ce}if(A>>>=te,I-=te,c.back+=te,c.length=ue,re===0){c.mode=26;break}if(32&re){c.back=-1,c.mode=12;break}if(64&re){k.msg="invalid literal/length code",c.mode=30;break}c.extra=15&re,c.mode=22;case 22:if(c.extra){for(_=c.extra;I<_;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}c.length+=A&(1<<c.extra)-1,A>>>=c.extra,I-=c.extra,c.back+=c.extra}c.was=c.length,c.mode=23;case 23:for(;re=(g=c.distcode[A&(1<<c.distbits)-1])>>>16&255,ue=65535&g,!((te=g>>>24)<=I);){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}if((240&re)==0){for(ce=te,xe=re,me=ue;re=(g=c.distcode[me+((A&(1<<ce+xe)-1)>>ce)])>>>16&255,ue=65535&g,!(ce+(te=g>>>24)<=I);){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}A>>>=ce,I-=ce,c.back+=ce}if(A>>>=te,I-=te,c.back+=te,64&re){k.msg="invalid distance code",c.mode=30;break}c.offset=ue,c.extra=15&re,c.mode=24;case 24:if(c.extra){for(_=c.extra;I<_;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}c.offset+=A&(1<<c.extra)-1,A>>>=c.extra,I-=c.extra,c.back+=c.extra}if(c.offset>c.dmax){k.msg="invalid distance too far back",c.mode=30;break}c.mode=25;case 25:if(J===0)break e;if($=H-J,c.offset>$){if(($=c.offset-$)>c.whave&&c.sane){k.msg="invalid distance too far back",c.mode=30;break}le=$>c.wnext?($-=c.wnext,c.wsize-$):c.wnext-$,$>c.length&&($=c.length),fe=c.window}else fe=Q,le=ee-c.offset,$=c.length;for(J<$&&($=J),J-=$,c.length-=$;Q[ee++]=fe[le++],--$;);c.length===0&&(c.mode=21);break;case 26:if(J===0)break e;Q[ee++]=c.length,J--,c.mode=21;break;case 27:if(c.wrap){for(;I<32;){if(W===0)break e;W--,A|=B[L++]<<I,I+=8}if(H-=J,k.total_out+=H,c.total+=H,H&&(k.adler=c.check=c.flags?a(c.check,Q,H,ee-H):l(c.check,Q,H,ee-H)),H=J,(c.flags?A:p(A))!==c.check){k.msg="incorrect data check",c.mode=30;break}I=A=0}c.mode=28;case 28:if(c.wrap&&c.flags){for(;I<32;){if(W===0)break e;W--,A+=B[L++]<<I,I+=8}if(A!==(4294967295&c.total)){k.msg="incorrect length check",c.mode=30;break}I=A=0}c.mode=29;case 29:D=1;break e;case 30:D=-3;break e;case 31:return-4;case 32:default:return h}return k.next_out=ee,k.avail_out=J,k.next_in=L,k.avail_in=W,c.hold=A,c.bits=I,(c.wsize||H!==k.avail_out&&c.mode<30&&(c.mode<27||T!==4))&&K(k,k.output,k.next_out,H-k.avail_out)?(c.mode=31,-4):(X-=k.avail_in,H-=k.avail_out,k.total_in+=X,k.total_out+=H,c.total+=H,c.wrap&&H&&(k.adler=c.check=c.flags?a(c.check,Q,H,k.next_out-H):l(c.check,Q,H,k.next_out-H)),k.data_type=c.bits+(c.last?64:0)+(c.mode===12?128:0)+(c.mode===20||c.mode===15?256:0),(X==0&&H===0||T===4)&&D===w&&(D=-5),D)},s.inflateEnd=function(k){if(!k||!k.state)return h;var T=k.state;return T.window&&(T.window=null),k.state=null,w},s.inflateGetHeader=function(k,T){var c;return k&&k.state?(2&(c=k.state).wrap)==0?h:((c.head=T).done=!1,w):h},s.inflateSetDictionary=function(k,T){var c,B=T.length;return k&&k.state?(c=k.state).wrap!==0&&c.mode!==11?h:c.mode===11&&l(1,T,B,0)!==c.check?-3:K(k,T,B,B)?(c.mode=31,-4):(c.havedict=1,w):h},s.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,n,s){var i=e("../utils/common"),l=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],a=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],d=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],v=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];n.exports=function(u,x,w,h,m,b,f,p){var y,S,P,E,F,j,Z,M,q,K=p.bits,k=0,T=0,c=0,B=0,Q=0,L=0,ee=0,W=0,J=0,A=0,I=null,X=0,H=new i.Buf16(16),$=new i.Buf16(16),le=null,fe=0;for(k=0;k<=15;k++)H[k]=0;for(T=0;T<h;T++)H[x[w+T]]++;for(Q=K,B=15;1<=B&&H[B]===0;B--);if(B<Q&&(Q=B),B===0)return m[b++]=20971520,m[b++]=20971520,p.bits=1,0;for(c=1;c<B&&H[c]===0;c++);for(Q<c&&(Q=c),k=W=1;k<=15;k++)if(W<<=1,(W-=H[k])<0)return-1;if(0<W&&(u===0||B!==1))return-1;for($[1]=0,k=1;k<15;k++)$[k+1]=$[k]+H[k];for(T=0;T<h;T++)x[w+T]!==0&&(f[$[x[w+T]]++]=T);if(j=u===0?(I=le=f,19):u===1?(I=l,X-=257,le=a,fe-=257,256):(I=d,le=v,-1),k=c,F=b,ee=T=A=0,P=-1,E=(J=1<<(L=Q))-1,u===1&&852<J||u===2&&592<J)return 1;for(;;){for(Z=k-ee,q=f[T]<j?(M=0,f[T]):f[T]>j?(M=le[fe+f[T]],I[X+f[T]]):(M=96,0),y=1<<k-ee,c=S=1<<L;m[F+(A>>ee)+(S-=y)]=Z<<24|M<<16|q|0,S!==0;);for(y=1<<k-1;A&y;)y>>=1;if(y!==0?(A&=y-1,A+=y):A=0,T++,--H[k]==0){if(k===B)break;k=x[w+f[T]]}if(Q<k&&(A&E)!==P){for(ee===0&&(ee=Q),F+=c,W=1<<(L=k-ee);L+ee<B&&!((W-=H[L+ee])<=0);)L++,W<<=1;if(J+=1<<L,u===1&&852<J||u===2&&592<J)return 1;m[P=A&E]=Q<<24|L<<16|F-b|0}}return A!==0&&(m[F+A]=k-ee<<24|64<<16|0),p.bits=Q,0}},{"../utils/common":41}],51:[function(e,n,s){n.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(e,n,s){var i=e("../utils/common"),l=0,a=1;function d(g){for(var C=g.length;0<=--C;)g[C]=0}var v=0,u=29,x=256,w=x+1+u,h=30,m=19,b=2*w+1,f=15,p=16,y=7,S=256,P=16,E=17,F=18,j=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],Z=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],M=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],q=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],K=new Array(2*(w+2));d(K);var k=new Array(2*h);d(k);var T=new Array(512);d(T);var c=new Array(256);d(c);var B=new Array(u);d(B);var Q,L,ee,W=new Array(h);function J(g,C,N,R,O){this.static_tree=g,this.extra_bits=C,this.extra_base=N,this.elems=R,this.max_length=O,this.has_stree=g&&g.length}function A(g,C){this.dyn_tree=g,this.max_code=0,this.stat_desc=C}function I(g){return g<256?T[g]:T[256+(g>>>7)]}function X(g,C){g.pending_buf[g.pending++]=255&C,g.pending_buf[g.pending++]=C>>>8&255}function H(g,C,N){g.bi_valid>p-N?(g.bi_buf|=C<<g.bi_valid&65535,X(g,g.bi_buf),g.bi_buf=C>>p-g.bi_valid,g.bi_valid+=N-p):(g.bi_buf|=C<<g.bi_valid&65535,g.bi_valid+=N)}function $(g,C,N){H(g,N[2*C],N[2*C+1])}function le(g,C){for(var N=0;N|=1&g,g>>>=1,N<<=1,0<--C;);return N>>>1}function fe(g,C,N){var R,O,U=new Array(f+1),V=0;for(R=1;R<=f;R++)U[R]=V=V+N[R-1]<<1;for(O=0;O<=C;O++){var G=g[2*O+1];G!==0&&(g[2*O]=le(U[G]++,G))}}function te(g){var C;for(C=0;C<w;C++)g.dyn_ltree[2*C]=0;for(C=0;C<h;C++)g.dyn_dtree[2*C]=0;for(C=0;C<m;C++)g.bl_tree[2*C]=0;g.dyn_ltree[2*S]=1,g.opt_len=g.static_len=0,g.last_lit=g.matches=0}function re(g){8<g.bi_valid?X(g,g.bi_buf):0<g.bi_valid&&(g.pending_buf[g.pending++]=g.bi_buf),g.bi_buf=0,g.bi_valid=0}function ue(g,C,N,R){var O=2*C,U=2*N;return g[O]<g[U]||g[O]===g[U]&&R[C]<=R[N]}function ce(g,C,N){for(var R=g.heap[N],O=N<<1;O<=g.heap_len&&(O<g.heap_len&&ue(C,g.heap[O+1],g.heap[O],g.depth)&&O++,!ue(C,R,g.heap[O],g.depth));)g.heap[N]=g.heap[O],N=O,O<<=1;g.heap[N]=R}function xe(g,C,N){var R,O,U,V,G=0;if(g.last_lit!==0)for(;R=g.pending_buf[g.d_buf+2*G]<<8|g.pending_buf[g.d_buf+2*G+1],O=g.pending_buf[g.l_buf+G],G++,R===0?$(g,O,C):($(g,(U=c[O])+x+1,C),(V=j[U])!==0&&H(g,O-=B[U],V),$(g,U=I(--R),N),(V=Z[U])!==0&&H(g,R-=W[U],V)),G<g.last_lit;);$(g,S,C)}function me(g,C){var N,R,O,U=C.dyn_tree,V=C.stat_desc.static_tree,G=C.stat_desc.has_stree,Y=C.stat_desc.elems,ie=-1;for(g.heap_len=0,g.heap_max=b,N=0;N<Y;N++)U[2*N]!==0?(g.heap[++g.heap_len]=ie=N,g.depth[N]=0):U[2*N+1]=0;for(;g.heap_len<2;)U[2*(O=g.heap[++g.heap_len]=ie<2?++ie:0)]=1,g.depth[O]=0,g.opt_len--,G&&(g.static_len-=V[2*O+1]);for(C.max_code=ie,N=g.heap_len>>1;1<=N;N--)ce(g,U,N);for(O=Y;N=g.heap[1],g.heap[1]=g.heap[g.heap_len--],ce(g,U,1),R=g.heap[1],g.heap[--g.heap_max]=N,g.heap[--g.heap_max]=R,U[2*O]=U[2*N]+U[2*R],g.depth[O]=(g.depth[N]>=g.depth[R]?g.depth[N]:g.depth[R])+1,U[2*N+1]=U[2*R+1]=O,g.heap[1]=O++,ce(g,U,1),2<=g.heap_len;);g.heap[--g.heap_max]=g.heap[1],function(ne,ge){var Pe,we,Te,he,Ue,tt,be=ge.dyn_tree,Bn=ge.max_code,Sr=ge.stat_desc.static_tree,Cr=ge.stat_desc.has_stree,Er=ge.stat_desc.extra_bits,Nn=ge.stat_desc.extra_base,De=ge.stat_desc.max_length,Ge=0;for(he=0;he<=f;he++)ne.bl_count[he]=0;for(be[2*ne.heap[ne.heap_max]+1]=0,Pe=ne.heap_max+1;Pe<b;Pe++)De<(he=be[2*be[2*(we=ne.heap[Pe])+1]+1]+1)&&(he=De,Ge++),be[2*we+1]=he,Bn<we||(ne.bl_count[he]++,Ue=0,Nn<=we&&(Ue=Er[we-Nn]),tt=be[2*we],ne.opt_len+=tt*(he+Ue),Cr&&(ne.static_len+=tt*(Sr[2*we+1]+Ue)));if(Ge!==0){do{for(he=De-1;ne.bl_count[he]===0;)he--;ne.bl_count[he]--,ne.bl_count[he+1]+=2,ne.bl_count[De]--,Ge-=2}while(0<Ge);for(he=De;he!==0;he--)for(we=ne.bl_count[he];we!==0;)Bn<(Te=ne.heap[--Pe])||(be[2*Te+1]!==he&&(ne.opt_len+=(he-be[2*Te+1])*be[2*Te],be[2*Te+1]=he),we--)}}(g,C),fe(U,ie,g.bl_count)}function o(g,C,N){var R,O,U=-1,V=C[1],G=0,Y=7,ie=4;for(V===0&&(Y=138,ie=3),C[2*(N+1)+1]=65535,R=0;R<=N;R++)O=V,V=C[2*(R+1)+1],++G<Y&&O===V||(G<ie?g.bl_tree[2*O]+=G:O!==0?(O!==U&&g.bl_tree[2*O]++,g.bl_tree[2*P]++):G<=10?g.bl_tree[2*E]++:g.bl_tree[2*F]++,U=O,ie=(G=0)===V?(Y=138,3):O===V?(Y=6,3):(Y=7,4))}function D(g,C,N){var R,O,U=-1,V=C[1],G=0,Y=7,ie=4;for(V===0&&(Y=138,ie=3),R=0;R<=N;R++)if(O=V,V=C[2*(R+1)+1],!(++G<Y&&O===V)){if(G<ie)for(;$(g,O,g.bl_tree),--G!=0;);else O!==0?(O!==U&&($(g,O,g.bl_tree),G--),$(g,P,g.bl_tree),H(g,G-3,2)):G<=10?($(g,E,g.bl_tree),H(g,G-3,3)):($(g,F,g.bl_tree),H(g,G-11,7));U=O,ie=(G=0)===V?(Y=138,3):O===V?(Y=6,3):(Y=7,4)}}d(W);var z=!1;function _(g,C,N,R){H(g,(v<<1)+(R?1:0),3),function(O,U,V,G){re(O),G&&(X(O,V),X(O,~V)),i.arraySet(O.pending_buf,O.window,U,V,O.pending),O.pending+=V}(g,C,N,!0)}s._tr_init=function(g){z||(function(){var C,N,R,O,U,V=new Array(f+1);for(O=R=0;O<u-1;O++)for(B[O]=R,C=0;C<1<<j[O];C++)c[R++]=O;for(c[R-1]=O,O=U=0;O<16;O++)for(W[O]=U,C=0;C<1<<Z[O];C++)T[U++]=O;for(U>>=7;O<h;O++)for(W[O]=U<<7,C=0;C<1<<Z[O]-7;C++)T[256+U++]=O;for(N=0;N<=f;N++)V[N]=0;for(C=0;C<=143;)K[2*C+1]=8,C++,V[8]++;for(;C<=255;)K[2*C+1]=9,C++,V[9]++;for(;C<=279;)K[2*C+1]=7,C++,V[7]++;for(;C<=287;)K[2*C+1]=8,C++,V[8]++;for(fe(K,w+1,V),C=0;C<h;C++)k[2*C+1]=5,k[2*C]=le(C,5);Q=new J(K,j,x+1,w,f),L=new J(k,Z,0,h,f),ee=new J(new Array(0),M,0,m,y)}(),z=!0),g.l_desc=new A(g.dyn_ltree,Q),g.d_desc=new A(g.dyn_dtree,L),g.bl_desc=new A(g.bl_tree,ee),g.bi_buf=0,g.bi_valid=0,te(g)},s._tr_stored_block=_,s._tr_flush_block=function(g,C,N,R){var O,U,V=0;0<g.level?(g.strm.data_type===2&&(g.strm.data_type=function(G){var Y,ie=4093624447;for(Y=0;Y<=31;Y++,ie>>>=1)if(1&ie&&G.dyn_ltree[2*Y]!==0)return l;if(G.dyn_ltree[18]!==0||G.dyn_ltree[20]!==0||G.dyn_ltree[26]!==0)return a;for(Y=32;Y<x;Y++)if(G.dyn_ltree[2*Y]!==0)return a;return l}(g)),me(g,g.l_desc),me(g,g.d_desc),V=function(G){var Y;for(o(G,G.dyn_ltree,G.l_desc.max_code),o(G,G.dyn_dtree,G.d_desc.max_code),me(G,G.bl_desc),Y=m-1;3<=Y&&G.bl_tree[2*q[Y]+1]===0;Y--);return G.opt_len+=3*(Y+1)+5+5+4,Y}(g),O=g.opt_len+3+7>>>3,(U=g.static_len+3+7>>>3)<=O&&(O=U)):O=U=N+5,N+4<=O&&C!==-1?_(g,C,N,R):g.strategy===4||U===O?(H(g,2+(R?1:0),3),xe(g,K,k)):(H(g,4+(R?1:0),3),function(G,Y,ie,ne){var ge;for(H(G,Y-257,5),H(G,ie-1,5),H(G,ne-4,4),ge=0;ge<ne;ge++)H(G,G.bl_tree[2*q[ge]+1],3);D(G,G.dyn_ltree,Y-1),D(G,G.dyn_dtree,ie-1)}(g,g.l_desc.max_code+1,g.d_desc.max_code+1,V+1),xe(g,g.dyn_ltree,g.dyn_dtree)),te(g),R&&re(g)},s._tr_tally=function(g,C,N){return g.pending_buf[g.d_buf+2*g.last_lit]=C>>>8&255,g.pending_buf[g.d_buf+2*g.last_lit+1]=255&C,g.pending_buf[g.l_buf+g.last_lit]=255&N,g.last_lit++,C===0?g.dyn_ltree[2*N]++:(g.matches++,C--,g.dyn_ltree[2*(c[N]+x+1)]++,g.dyn_dtree[2*I(C)]++),g.last_lit===g.lit_bufsize-1},s._tr_align=function(g){H(g,2,3),$(g,S,K),function(C){C.bi_valid===16?(X(C,C.bi_buf),C.bi_buf=0,C.bi_valid=0):8<=C.bi_valid&&(C.pending_buf[C.pending++]=255&C.bi_buf,C.bi_buf>>=8,C.bi_valid-=8)}(g)}},{"../utils/common":41}],53:[function(e,n,s){n.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,n,s){n.exports=typeof setImmediate=="function"?setImmediate:function(){var i=[].slice.apply(arguments);i.splice(1,0,0),setTimeout.apply(null,i)}},{}]},{},[10])(10)})})(Xn);var Ar=Xn.exports,se={},ct={};Object.defineProperty(ct,"__esModule",{value:!0});var zr=function(){function r(){}return r.prototype.all=function(t){for(var e=this.iterator.next();!e.done;e=this.iterator.next())if(!t(e.value))return!1;return!0},r}();ct.All=zr;var ht={};Object.defineProperty(ht,"__esModule",{value:!0});var Mr=function(){function r(){}return r.prototype.any=function(t){if(t==null)return!this.iterator.next().done;for(var e=this.iterator.next();!e.done;e=this.iterator.next())if(t(e.value))return!0;return!1},r}();ht.Any=Mr;var ut={};Object.defineProperty(ut,"__esModule",{value:!0});var Pr=function(){function r(){}return r.prototype.asIterable=function(){var t,e=this.iterator;return t={},t[Symbol.iterator]=function(){return e},t},r}();ut.AsIterable=Pr;var dt={};Object.defineProperty(dt,"__esModule",{value:!0});var Tr=function(){function r(){}return r.prototype.associate=function(t){for(var e=new Map,n=this.iterator.next();!n.done;n=this.iterator.next()){var s=t(n.value);e.set(s[0],s[1])}return e},r}();dt.Associate=Tr;var ft={};Object.defineProperty(ft,"__esModule",{value:!0});var Dr=function(){function r(){}return r.prototype.associateBy=function(t,e){for(var n=typeof t=="function"?t:function(v){return v[t]},s=new Map,i=e!=null?e:function(v){return v},l=this.iterator.next();!l.done;l=this.iterator.next()){var a=n(l.value),d=i(l.value);s.set(a,d)}return s},r}();ft.AssociateBy=Dr;var pt={};Object.defineProperty(pt,"__esModule",{value:!0});var jr=function(){function r(){}return r.prototype.average=function(){for(var t=0,e=0,n=this.iterator.next();!n.done;n=this.iterator.next())t+=n.value,e++;return e===0?Number.NaN:t/e},r}();pt.Average=jr;var gt={};Object.defineProperty(gt,"__esModule",{value:!0});var Br=function(){function r(){}return r.prototype.chunk=function(t){if(t<1)throw new Error("chunkSize must be > 0 but is "+t);for(var e=[],n=0,s=this.iterator.next();!s.done;s=this.iterator.next()){var i=Math.floor(n/t);e[i]==null?e[i]=[s.value]:e[i].push(s.value),n++}return e},r}();gt.Chunk=Br;var mt={};Object.defineProperty(mt,"__esModule",{value:!0});var Nr=function(){function r(){}return r.prototype.contains=function(t){for(var e=this.iterator.next();!e.done;e=this.iterator.next())if(t===e.value)return!0;return!1},r}();mt.Contains=Nr;var vt={};Object.defineProperty(vt,"__esModule",{value:!0});var Rr=function(){function r(){}return r.prototype.count=function(t){var e=0;if(t==null)for(var n=this.iterator.next();!n.done;n=this.iterator.next())e++;else for(var n=this.iterator.next();!n.done;n=this.iterator.next())t(n.value)&&e++;return e},r}();vt.Count=Rr;var yt={};Object.defineProperty(yt,"__esModule",{value:!0});var Fr=se,Lr=function(){function r(t){this.iterator=t,this.items=[]}return r.prototype.next=function(t){for(var e=this.iterator.next();!e.done;e=this.iterator.next())if(this.items.indexOf(e.value)<0)return this.items.push(e.value),{done:!1,value:e.value};return{done:!0,value:void 0}},r}(),Wr=function(){function r(){}return r.prototype.distinct=function(){return Fr.createSequence(new Lr(this.iterator))},r}();yt.Distinct=Wr;var _t={};Object.defineProperty(_t,"__esModule",{value:!0});var Ur=se,Gr=function(){function r(t,e){this.iterator=t,this.selector=e,this.keys=[]}return r.prototype.next=function(t){for(var e=this.iterator.next();!e.done;e=this.iterator.next()){var n=this.selector(e.value);if(this.keys.indexOf(n)<0)return this.keys.push(n),{done:!1,value:e.value}}return{done:!0,value:void 0}},r}(),qr=function(){function r(){}return r.prototype.distinctBy=function(t){return Ur.createSequence(new Gr(this.iterator,t))},r}();_t.DistinctBy=qr;var xt={};Object.defineProperty(xt,"__esModule",{value:!0});var Zr=function(){function r(){}return r.prototype.drop=function(t){return this.withIndex().dropWhile(function(e){return e.index<t}).map(function(e){return e.value})},r}();xt.Drop=Zr;var wt={};Object.defineProperty(wt,"__esModule",{value:!0});var $r=se,Hr=function(){function r(t,e){this.iterator=t,this.predicate=e,this.dropping=!0}return r.prototype.next=function(t){for(var e=this.iterator.next();!e.done;e=this.iterator.next()){if(!this.dropping)return{done:!1,value:e.value};var n=this.predicate(e.value);if(!n)return this.dropping=!1,{done:!1,value:e.value}}return{done:!0,value:void 0}},r}(),Vr=function(){function r(){}return r.prototype.dropWhile=function(t){return $r.createSequence(new Hr(this.iterator,t))},r}();wt.DropWhile=Vr;var bt={};Object.defineProperty(bt,"__esModule",{value:!0});var Yr=function(){function r(){}return r.prototype.elementAt=function(t){for(var e=0,n=this.iterator.next();!n.done;n=this.iterator.next()){if(e===t)return n.value;e++}throw new Error("Index out of bounds: "+t)},r}();bt.ElementAt=Yr;var kt={};Object.defineProperty(kt,"__esModule",{value:!0});var Xr=function(){function r(){}return r.prototype.elementAtOrElse=function(t,e){for(var n=0,s=this.iterator.next();!s.done;s=this.iterator.next()){if(n===t)return s.value;n++}return e(t)},r}();kt.ElementAtOrElse=Xr;var St={};Object.defineProperty(St,"__esModule",{value:!0});var Kr=function(){function r(){}return r.prototype.elementAtOrNull=function(t){for(var e=0,n=this.iterator.next();!n.done;n=this.iterator.next()){if(e===t)return n.value;e++}return null},r}();St.ElementAtOrNull=Kr;var Ct={};Object.defineProperty(Ct,"__esModule",{value:!0});var Jr=se,Qr=function(){function r(t,e){this.predicate=t,this.iterator=e}return r.prototype.next=function(t){for(var e=this.iterator.next();!e.done;e=this.iterator.next())if(this.predicate(e.value))return{done:!1,value:e.value};return{done:!0,value:void 0}},r}(),ei=function(){function r(){}return r.prototype.filter=function(t){return Jr.createSequence(new Qr(t,this.iterator))},r}();Ct.Filter=ei;var Et={};Object.defineProperty(Et,"__esModule",{value:!0});var ti=function(){function r(){}return r.prototype.filterIndexed=function(t){return this.withIndex().filter(function(e){return t(e.index,e.value)}).map(function(e){return e.value})},r}();Et.FilterIndexed=ti;var Ot={};Object.defineProperty(Ot,"__esModule",{value:!0});var ni=function(){function r(){}return r.prototype.filterNot=function(t){return this.filter(function(e){return!t(e)})},r}();Ot.FilterNot=ni;var It={};Object.defineProperty(It,"__esModule",{value:!0});var ri=function(){function r(){}return r.prototype.filterNotNull=function(){return this.filter(function(t){return t!==null})},r}();It.FilterNotNull=ri;var At={};Object.defineProperty(At,"__esModule",{value:!0});var ii=function(){function r(){}return r.prototype.first=function(t){if(t!=null)return this.filter(t).first();var e=this.iterator.next();if(e.done)throw new Error("No such element");return e.value},r}();At.First=ii;var zt={};Object.defineProperty(zt,"__esModule",{value:!0});var si=function(){function r(){}return r.prototype.firstOrNull=function(t){if(t!=null)return this.filter(t).firstOrNull();var e=this.iterator.next();return e.done?null:e.value},r.prototype.find=function(t){return this.firstOrNull(t)},r}();zt.FirstOrNull=si;var Mt={};Object.defineProperty(Mt,"__esModule",{value:!0});var oi=se,ai=function(){function r(t,e){this.transform=t,this.iterator=e}return r.prototype.next=function(t){if(this.current!=null){var e=this.current.next();if(!e.done)return e}var n=this.iterator.next();if(!n.done){var s=this.transform(n.value);return this.current=s.iterator,this.next()}return{done:!0,value:void 0}},r}(),li=function(){function r(){}return r.prototype.flatMap=function(t){return oi.createSequence(new ai(t,this.iterator))},r}();Mt.FlatMap=li;var Pt={};Object.defineProperty(Pt,"__esModule",{value:!0});var Fn=se,ci=function(){function r(){}return r.prototype.flatten=function(){return this.flatMap(function(t){return Fn.isSequence(t)?t:Fn.asSequence(t)})},r}();Pt.Flatten=ci;var Tt={};Object.defineProperty(Tt,"__esModule",{value:!0});var hi=function(){function r(){}return r.prototype.fold=function(t,e){for(var n=t,s=this.iterator.next();!s.done;s=this.iterator.next())n=e(n,s.value);return n},r}();Tt.Fold=hi;var Dt={};Object.defineProperty(Dt,"__esModule",{value:!0});var ui=function(){function r(){}return r.prototype.foldIndexed=function(t,e){for(var n=t,s=0,i=this.iterator.next();!i.done;i=this.iterator.next())n=e(s,n,i.value),s++;return n},r}();Dt.FoldIndexed=ui;var jt={};Object.defineProperty(jt,"__esModule",{value:!0});var di=function(){function r(){}return r.prototype.forEach=function(t){for(var e=this.iterator.next();!e.done;e=this.iterator.next())t(e.value)},r}();jt.ForEach=di;var Bt={};Object.defineProperty(Bt,"__esModule",{value:!0});var fi=function(){function r(){}return r.prototype.forEachIndexed=function(t){this.withIndex().forEach(function(e){return t(e.index,e.value)})},r}();Bt.ForEachIndexed=fi;var Nt={};Object.defineProperty(Nt,"__esModule",{value:!0});var pi=function(){function r(){}return r.prototype.groupBy=function(t){for(var e=new Map,n=this.iterator.next();!n.done;n=this.iterator.next()){var s=t(n.value),i=e.get(s);i==null?e.set(s,[n.value]):i.push(n.value)}return e},r}();Nt.GroupBy=pi;var Rt={};Object.defineProperty(Rt,"__esModule",{value:!0});var gi=function(){function r(){}return r.prototype.indexOf=function(t){for(var e=0,n=this.iterator.next();!n.done;n=this.iterator.next()){if(t===n.value)return e;e++}return-1},r}();Rt.IndexOf=gi;var Ft={};Object.defineProperty(Ft,"__esModule",{value:!0});var mi=function(){function r(){}return r.prototype.indexOfFirst=function(t){for(var e=0,n=this.iterator.next();!n.done;n=this.iterator.next()){if(t(n.value))return e;e++}return-1},r}();Ft.IndexOfFirst=mi;var Lt={};Object.defineProperty(Lt,"__esModule",{value:!0});var vi=function(){function r(){}return r.prototype.indexOfLast=function(t){for(var e=0,n=-1,s=this.iterator.next();!s.done;s=this.iterator.next())t(s.value)&&(n=e),e++;return n},r}();Lt.IndexOfLast=vi;var Wt={};Object.defineProperty(Wt,"__esModule",{value:!0});var ke={value:"",separator:", ",prefix:"",postfix:"",limit:-1,truncated:"...",transform:void 0},yi=function(){function r(){}return r.prototype.joinToString=function(t){t===void 0&&(t=ke);for(var e=t.value,n=e===void 0?ke.value:e,s=t.separator,i=s===void 0?ke.separator:s,l=t.prefix,a=l===void 0?ke.prefix:l,d=t.postfix,v=d===void 0?ke.postfix:d,u=t.limit,x=u===void 0?ke.limit:u,w=t.truncated,h=w===void 0?ke.truncated:w,m=t.transform,b=m===void 0?ke.transform:m,f=""+n+a,p=0,y=this.iterator.next();!y.done&&(p++,p>1&&(f+=i),x<0||p<=x);y=this.iterator.next())f+=b!=null?b(y.value):String(y.value);return x>=0&&p>x&&(f+=h),f+=v,f},r.prototype.joinTo=function(t){return t===void 0&&(t=ke),this.joinToString(t)},r}();Wt.JoinToString=yi;var Ut={};Object.defineProperty(Ut,"__esModule",{value:!0});var _i=function(){function r(){}return r.prototype.last=function(t){if(t!=null)return this.filter(t).last();for(var e,n=!0,s=this.iterator.next();!s.done;s=this.iterator.next())e=s.value,n=!1;if(n)throw new Error("No such element");return e},r}();Ut.Last=_i;var Gt={};Object.defineProperty(Gt,"__esModule",{value:!0});var xi=function(){function r(){}return r.prototype.lastOrNull=function(t){if(t!=null)return this.filter(t).lastOrNull();for(var e=null,n=this.iterator.next();!n.done;n=this.iterator.next())e=n.value;return e},r.prototype.findLast=function(t){return this.lastOrNull(t)},r}();Gt.LastOrNull=xi;var qt={};Object.defineProperty(qt,"__esModule",{value:!0});var wi=se,bi=function(){function r(t,e){this.transform=t,this.iterator=e}return r.prototype.next=function(t){var e=this.iterator.next();return e.done?{done:!0,value:void 0}:{done:!1,value:this.transform(e.value)}},r}(),ki=function(){function r(){}return r.prototype.map=function(t){return wi.createSequence(new bi(t,this.iterator))},r}();qt.Map=ki;var Zt={};Object.defineProperty(Zt,"__esModule",{value:!0});var Si=function(){function r(){}return r.prototype.mapIndexed=function(t){return this.withIndex().map(function(e){return t(e.index,e.value)})},r}();Zt.MapIndexed=Si;var $t={};Object.defineProperty($t,"__esModule",{value:!0});var Ln=se,Ci=function(){function r(){}return r.prototype.mapNotNull=function(t){return this.flatMap(function(e){var n=t(e);return n!==null?Ln.sequenceOf(n):Ln.emptySequence()})},r}();$t.MapNotNull=Ci;var Ht={};Object.defineProperty(Ht,"__esModule",{value:!0});var Ei=function(){function r(){}return r.prototype.max=function(){for(var t=null,e=this.iterator.next();!e.done;e=this.iterator.next())(t==null||e.value>t)&&(t=e.value);return t},r}();Ht.Max=Ei;var Vt={};Object.defineProperty(Vt,"__esModule",{value:!0});var Oi=function(){function r(){}return r.prototype.maxBy=function(t){for(var e=null,n=null,s=this.iterator.next();!s.done;s=this.iterator.next()){var i=t(s.value);(n==null||i>n)&&(n=i,e=s.value)}return e},r}();Vt.MaxBy=Oi;var Yt={};Object.defineProperty(Yt,"__esModule",{value:!0});var Ii=function(){function r(){}return r.prototype.maxWith=function(t){for(var e=null,n=this.iterator.next();!n.done;n=this.iterator.next())(e==null||t(n.value,e)>0)&&(e=n.value);return e},r}();Yt.MaxWith=Ii;var Xt={};Object.defineProperty(Xt,"__esModule",{value:!0});var je=se,Ai=function(){function r(){}return r.prototype.merge=function(t,e,n){n===void 0&&(n=!1);var s=je.isSequence(t)?t.toArray():je.asSequence(t).toArray(),i=this.toArray(),l=i.map(function(a){var d=e(a),v=je.asSequence(s).find(function(u){return e(u)===d});return v!=null?(s=s.filter(function(u){return u!==v}),v):a});return n?je.asSequence(s.concat(l)):je.asSequence(l.concat(s))},r}();Xt.Merge=Ai;var Kt={};Object.defineProperty(Kt,"__esModule",{value:!0});var zi=function(){function r(){}return r.prototype.min=function(){for(var t=null,e=this.iterator.next();!e.done;e=this.iterator.next())(t==null||e.value<t)&&(t=e.value);return t},r}();Kt.Min=zi;var Jt={};Object.defineProperty(Jt,"__esModule",{value:!0});var Mi=function(){function r(){}return r.prototype.minBy=function(t){for(var e=null,n=null,s=this.iterator.next();!s.done;s=this.iterator.next()){var i=t(s.value);(n==null||i<n)&&(n=i,e=s.value)}return e},r}();Jt.MinBy=Mi;var Qt={};Object.defineProperty(Qt,"__esModule",{value:!0});var Pi=se,Ti=function(){function r(){}return r.prototype.minus=function(t){if(Pi.isSequence(t)){var e=t.toArray();return this.filter(function(n){return e.indexOf(n)<0})}else return t instanceof Array?this.filter(function(n){return t.indexOf(n)<0}):this.filter(function(n){return n!==t})},r}();Qt.Minus=Ti;var en={};Object.defineProperty(en,"__esModule",{value:!0});var Di=function(){function r(){}return r.prototype.minWith=function(t){for(var e=null,n=this.iterator.next();!n.done;n=this.iterator.next())(e==null||t(n.value,e)<0)&&(e=n.value);return e},r}();en.MinWith=Di;var tn={};Object.defineProperty(tn,"__esModule",{value:!0});var ji=function(){function r(){}return r.prototype.none=function(t){if(t==null)return this.iterator.next().done;for(var e=this.iterator.next();!e.done;e=this.iterator.next())if(t(e.value))return!1;return!0},r}();tn.None=ji;var nn={};Object.defineProperty(nn,"__esModule",{value:!0});var Bi=function(){function r(){}return r.prototype.onEach=function(t){return this.map(function(e){return t(e),e})},r}();nn.OnEach=Bi;var rn={};Object.defineProperty(rn,"__esModule",{value:!0});var Ni=function(){function r(){}return r.prototype.partition=function(t){for(var e=[],n=[],s=this.iterator.next();!s.done;s=this.iterator.next())t(s.value)?e.push(s.value):n.push(s.value);return{true:e,false:n}},r}();rn.Partition=Ni;var sn={};Object.defineProperty(sn,"__esModule",{value:!0});var Ze=se,nt=function(){function r(t,e){this.first=t,this.second=e}return r.prototype.next=function(t){var e=this.first.next();if(!e.done)return{done:!1,value:e.value};var n=this.second.next();return n.done?{done:!0,value:void 0}:{done:!1,value:n.value}},r}(),Ri=function(){function r(){}return r.prototype.plus=function(t){if(Ze.isSequence(t))return Ze.createSequence(new nt(this.iterator,t.iterator));if(t instanceof Array){var e=t[Symbol.iterator]();return Ze.createSequence(new nt(this.iterator,e))}else{var e=[t][Symbol.iterator]();return Ze.createSequence(new nt(this.iterator,e))}},r}();sn.Plus=Ri;var on={};Object.defineProperty(on,"__esModule",{value:!0});var Fi=function(){function r(){}return r.prototype.reduce=function(t){var e=this.iterator.next();if(e.done)throw new Error("Cannot reduce empty sequence");for(var n=e.value,s=this.iterator.next();!s.done;s=this.iterator.next())n=t(n,s.value);return n},r}();on.Reduce=Fi;var an={};Object.defineProperty(an,"__esModule",{value:!0});var Li=function(){function r(){}return r.prototype.reduceIndexed=function(t){var e=this.iterator.next();if(e.done)throw new Error("Cannot reduce empty sequence");for(var n=1,s=e.value,i=this.iterator.next();!i.done;i=this.iterator.next())s=t(n,s,i.value),n++;return s},r}();an.ReduceIndexed=Li;var ln={};Object.defineProperty(ln,"__esModule",{value:!0});var Wi=function(){function r(){}return r.prototype.reverse=function(){return this.withIndex().sortedByDescending(function(t){return t.index}).map(function(t){return t.value})},r}();ln.Reverse=Wi;var cn={};Object.defineProperty(cn,"__esModule",{value:!0});var Ui=function(){function r(){}return r.prototype.single=function(t){if(t!=null)return this.filter(t).single();var e=this.iterator.next();if(e.done)throw new Error("No such element");if(!this.iterator.next().done)throw new Error("Expect single element");return e.value},r}();cn.Single=Ui;var hn={};Object.defineProperty(hn,"__esModule",{value:!0});var Gi=function(){function r(){}return r.prototype.singleOrNull=function(t){if(t!=null)return this.filter(t).singleOrNull();var e=this.iterator.next();return e.done||!this.iterator.next().done?null:e.value},r}();hn.SingleOrNull=Gi;var un={},dn={};Object.defineProperty(dn,"__esModule",{value:!0});function _e(r){return Object.assign(r,{reversed:function(){return _e(function(t,e){return r(t,e)*-1})},then:function(t){return _e(function(e,n){var s=r(e,n);return s!==0?s:t(e,n)})},thenDescending:function(t){return this.then(_e(t).reversed())},thenBy:function(t){var e=He(t);return this.then(function(n,s){return Ae(e(n),e(s))})},thenByDescending:function(t){var e=He(t);return this.then(_e(function(n,s){return Ae(e(n),e(s))}).reversed())}})}function qi(r){var t=He(r);return _e(function(e,n){return Ae(t(e),t(n))})}function Zi(r){var t=He(r);return _e(function(e,n){return Ae(t(n),t(e))})}function He(r){return typeof r=="function"?r:function(t){return t[r]}}function Ae(r,t){return r<t?-1:r>t?1:0}function $i(){return _e(Ae)}function Hi(){return _e(Ae).reversed()}function Vi(){return _e(function(r,t){return r===null?1:t===null?-1:0})}function Yi(){return _e(function(r,t){return r===null?-1:t===null?1:0})}function Xi(){return{compare:_e,compareBy:qi,compareByDescending:Zi,naturalOrder:$i,reverseOrder:Hi,nullsFirst:Yi,nullsLast:Vi}}dn.default=Xi;Object.defineProperty(un,"__esModule",{value:!0});var Ki=se,Ji=dn,Qi=function(){function r(){}return r.prototype.sorted=function(t){for(var e=[],n=this.iterator.next();!n.done;n=this.iterator.next())e.push(n.value);if(t==null)e.sort();else{var s=Ji.default(),i=t(s);e.sort(i)}var l=e[Symbol.iterator]();return Ki.createSequence(l)},r}();un.Sorted=Qi;var fn={};Object.defineProperty(fn,"__esModule",{value:!0});var es=function(){function r(){}return r.prototype.sortedBy=function(t){return this.sorted(function(e){return e.compareBy(t)})},r}();fn.SortedBy=es;var pn={};Object.defineProperty(pn,"__esModule",{value:!0});var ts=function(){function r(){}return r.prototype.sortedByDescending=function(t){return this.sorted(function(e){return e.compareByDescending(t)})},r}();pn.SortedByDescending=ts;var gn={};Object.defineProperty(gn,"__esModule",{value:!0});var ns=function(){function r(){}return r.prototype.sortedDescending=function(){return this.sorted(function(t){return t.reverseOrder()})},r}();gn.SortedDescending=ns;var mn={};Object.defineProperty(mn,"__esModule",{value:!0});var rs=function(){function r(){}return r.prototype.sortedWith=function(t){return this.sorted(function(e){return e.compare(t)})},r}();mn.SortedWith=rs;var vn={};Object.defineProperty(vn,"__esModule",{value:!0});var is=function(){function r(){}return r.prototype.sum=function(){for(var t=0,e=this.iterator.next();!e.done;e=this.iterator.next())t+=e.value;return t},r}();vn.Sum=is;var yn={};Object.defineProperty(yn,"__esModule",{value:!0});var ss=function(){function r(){}return r.prototype.sumBy=function(t){for(var e=0,n=this.iterator.next();!n.done;n=this.iterator.next())e+=t(n.value);return e},r}();yn.SumBy=ss;var _n={};Object.defineProperty(_n,"__esModule",{value:!0});var os=function(){function r(){}return r.prototype.take=function(t){return this.withIndex().takeWhile(function(e){return e.index<t}).map(function(e){return e.value})},r}();_n.Take=os;var xn={};Object.defineProperty(xn,"__esModule",{value:!0});var as=se,ls=function(){function r(t,e){this.iterator=t,this.predicate=e}return r.prototype.next=function(t){var e=this.iterator.next();if(!e.done){var n=this.predicate(e.value);if(n)return{done:!1,value:e.value}}return{done:!0,value:void 0}},r}(),cs=function(){function r(){}return r.prototype.takeWhile=function(t){return as.createSequence(new ls(this.iterator,t))},r}();xn.TakeWhile=cs;var wn={};Object.defineProperty(wn,"__esModule",{value:!0});var hs=function(){function r(){}return r.prototype.toArray=function(t){for(var e=t||[],n=this.iterator.next();!n.done;n=this.iterator.next())e.push(n.value);return e},r.prototype.toList=function(t){return this.toArray(t)},r}();wn.ToArray=hs;var bn={};Object.defineProperty(bn,"__esModule",{value:!0});var us=function(){function r(){}return r.prototype.toMap=function(t){for(var e=t||new Map,n=this.iterator.next();!n.done;n=this.iterator.next()){var s=n.value,i=s[0],l=s[1];e.set(i,l)}return e},r}();bn.ToMap=us;var kn={};Object.defineProperty(kn,"__esModule",{value:!0});var ds=function(){function r(){}return r.prototype.toSet=function(t){for(var e=t||new Set,n=this.iterator.next();!n.done;n=this.iterator.next())e.add(n.value);return e},r}();kn.ToSet=ds;var Sn={};Object.defineProperty(Sn,"__esModule",{value:!0});var fs=function(){function r(){}return r.prototype.unzip=function(){for(var t=[],e=[],n=this.iterator.next();!n.done;n=this.iterator.next()){var s=n.value,i=s[0],l=s[1];t.push(i),e.push(l)}return[t,e]},r}();Sn.Unzip=fs;var Cn={};Object.defineProperty(Cn,"__esModule",{value:!0});var ps=se,gs=function(){function r(t){this.iterator=t,this.index=-1}return r.prototype.next=function(t){var e=this.iterator.next();return e.done?{done:!0,value:void 0}:(this.index++,{done:!1,value:{index:this.index,value:e.value}})},r}(),ms=function(){function r(){}return r.prototype.withIndex=function(){return ps.createSequence(new gs(this.iterator))},r}();Cn.WithIndex=ms;var En={};Object.defineProperty(En,"__esModule",{value:!0});var vs=se,ys=function(){function r(t,e){this.iterator1=t,this.iterator2=e}return r.prototype.next=function(t){var e=this.iterator1.next(),n=this.iterator2.next();return e.done||n.done?{done:!0,value:void 0}:{done:!1,value:[e.value,n.value]}},r}(),_s=function(){function r(){}return r.prototype.zip=function(t){return vs.createSequence(new ys(this.iterator,t.iterator))},r}();En.Zip=_s;var On={};Object.defineProperty(On,"__esModule",{value:!0});var xs=function(){function r(t){this.nextFunction=t}return r.prototype.next=function(t){var e=this.nextFunction();return{done:e==null,value:e}},r}();On.default=xs;var In={};Object.defineProperty(In,"__esModule",{value:!0});var ws=function(){function r(t,e){this.seed=t,this.nextFunction=e}return r.prototype.next=function(t){if(this.prevItem==null)return this.prevItem=this.seed,{done:!1,value:this.seed};var e=this.nextFunction(this.prevItem);return e==null?{done:!0,value:void 0}:(this.prevItem=e,{done:!1,value:e})},r}();In.default=ws;Object.defineProperty(se,"__esModule",{value:!0});var bs=ct,ks=ht,Ss=ut,Cs=dt,Es=ft,Os=pt,Is=gt,As=mt,zs=vt,Ms=yt,Ps=_t,Ts=xt,Ds=wt,js=bt,Bs=kt,Ns=St,Rs=Ct,Fs=Et,Ls=Ot,Ws=It,Us=At,Gs=zt,qs=Mt,Zs=Pt,$s=Tt,Hs=Dt,Vs=jt,Ys=Bt,Xs=Nt,Ks=Rt,Js=Ft,Qs=Lt,eo=Wt,to=Ut,no=Gt,ro=qt,io=Zt,so=$t,oo=Ht,ao=Vt,lo=Yt,co=Xt,ho=Kt,uo=Jt,fo=Qt,po=en,go=tn,mo=nn,vo=rn,yo=sn,_o=on,xo=an,wo=ln,bo=cn,ko=hn,So=un,Co=fn,Eo=pn,Oo=gn,Io=mn,Ao=vn,zo=yn,Mo=_n,Po=xn,To=wn,Do=bn,jo=kn,Bo=Sn,No=Cn,Ro=En,Fo=On,Lo=In,Qe=function(){function r(t){this.iterator=t}return r}();Kn(Qe,[bs.All,ks.Any,Ss.AsIterable,Cs.Associate,Es.AssociateBy,Os.Average,Is.Chunk,As.Contains,zs.Count,Ms.Distinct,Ps.DistinctBy,Ts.Drop,Ds.DropWhile,js.ElementAt,Bs.ElementAtOrElse,Ns.ElementAtOrNull,Rs.Filter,Fs.FilterIndexed,Ls.FilterNot,Ws.FilterNotNull,Us.First,Gs.FirstOrNull,qs.FlatMap,Zs.Flatten,$s.Fold,Hs.FoldIndexed,Vs.ForEach,Ys.ForEachIndexed,Xs.GroupBy,Ks.IndexOf,Js.IndexOfFirst,Qs.IndexOfLast,eo.JoinToString,to.Last,no.LastOrNull,ro.Map,io.MapIndexed,so.MapNotNull,oo.Max,ao.MaxBy,lo.MaxWith,co.Merge,ho.Min,uo.MinBy,fo.Minus,po.MinWith,go.None,mo.OnEach,vo.Partition,yo.Plus,_o.Reduce,xo.ReduceIndexed,wo.Reverse,bo.Single,ko.SingleOrNull,So.Sorted,Co.SortedBy,Eo.SortedByDescending,Oo.SortedDescending,Io.SortedWith,Ao.Sum,zo.SumBy,Mo.Take,Po.TakeWhile,To.ToArray,Do.ToMap,jo.ToSet,Bo.Unzip,No.WithIndex,Ro.Zip]);function Kn(r,t){t.forEach(function(e){Object.getOwnPropertyNames(e.prototype).forEach(function(n){r.prototype[n]=e.prototype[n]})})}function Wo(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];return zn(r)}se.sequenceOf=Wo;function An(){return zn([])}se.emptySequence=An;function zn(r){if(r===null)throw new Error("Cannot create sequence for input: null");if(r===void 0)throw new Error("Cannot create sequence for input: undefined");if(r[Symbol.iterator]==null)throw new Error("Cannot create sequence for non-iterable input: "+r);var t=r[Symbol.iterator]();return Ve(t)}var rt=se.asSequence=zn;function Ve(r){return new Qe(r)}se.createSequence=Ve;function Uo(r){return r instanceof Qe}se.isSequence=Uo;function Go(r){Kn(Qe,[r])}se.extendSequence=Go;function Jn(r,t){if(typeof r=="function"&&t==null)return Ve(new Fo.default(r));var e=typeof r=="function"?r():r;return e!=null?Ve(new Lo.default(e,t)):An()}se.generateSequence=Jn;function qo(r,t,e){if(e===void 0&&(e=1),r>t)throw new Error("start ["+r+"] must be lower then endInclusive ["+t+"]");if(r===t)return An();var n=r;return Jn(function(){try{return n<=t?n:void 0}finally{n+=e}})}se.range=qo;var Zo="assets/Archisurance.f50715de.archimate";class Re{static async GetDefaultProject(){const e=await(await fetch(Zo)).arrayBuffer();return Re.GetProjectFromArrayBuffer(e)}static async GetProjectFromArrayBuffer(t){const e=new Int8Array(t.slice(0,2));let n=t;new TextDecoder().decode(e)==="PK"&&(n=await(await Ar.loadAsync(t)).file("model.xml").async("arraybuffer"));const s=new TextDecoder().decode(n),l=new DOMParser().parseFromString(s,"application/xml");return Re.GetFromDocument(l)}static GetFromDocument(t){const e=t.evaluate("//element[@xsi:type]",t,this.resolver,XPathResult.ANY_TYPE,null);let n;const s=[];for(;n=e.iterateNext();)s.push(this.ToArchiObject(n));return new $o(s,t.firstElementChild)}static resolver(t){switch(t){case"archimate":return"http://www.archimatetool.com/archimate";case"xsi":return"http://www.w3.org/2001/XMLSchema-instance"}}static ToArchiObject(t){var s,i,l,a;let e=t.getAttribute("xsi:type");e.startsWith("archimate:")&&(e=e.substring(10)),e.startsWith("canvas:")&&(e=e.substring(7));let n;if(e.endsWith("Relationship")){const d=new st;d.source=(s=t.getAttribute("source"))!=null?s:Ye(t.getElementsByTagName("source")[0]),d.target=(i=t.getAttribute("target"))!=null?i:Ye(t.getElementsByTagName("target")[0]),n=d}else e==="ArchimateDiagramModel"?n=new ot:e==="CanvasModel"?n=new ot:n=new et;return n.entityType=e,n.Id=t.getAttribute("id"),n.name=t.getAttribute("name"),n.documentation=(a=t.getAttribute("documentation"))!=null?a:(l=t.getElementsByTagName("documentation")[0])==null?void 0:l.textContent,n.element=t,n}}class $o{constructor(t,e){this.getById=n=>this.entitiesById.get(n),this.getTargetRelationShips=(n,s)=>this.relationships.filter(i=>i.target===n&&(!s||s==i.entityType)),this.getSourceRelationShips=(n,s)=>this.relationships.filter(i=>i.source===n&&(!s||s==i.entityType)),this.getRelatedElementForTarget=(n,s,i)=>this.getTargetRelationShips(n,s).map(l=>this.getById(l.source)).filter(l=>!i||i==l.entityType),this.getRelatedElementForSource=(n,s,i)=>this.getSourceRelationShips(n,s).map(l=>this.getById(l.target)).filter(l=>!i||i==l.entityType),this.getDiagramsWithElementId=n=>this.diagrams.filter(s=>s.GetElementIds().some(i=>i===n)),this.element=e,this.name=e.getAttribute("name"),this.version=e.getAttribute("version"),this.id=e.getAttribute("id"),this.entitiesById=new Map,t.forEach(n=>this.entitiesById.set(n.Id,n)),this.relationshipsById=new Map,t.filter(n=>n instanceof st).forEach(n=>this.entitiesById.set(n.Id,n))}get diagrams(){return rt(this.entitiesById.values()).filter(t=>t instanceof ot).map(t=>t).toArray()}get relationships(){return rt(this.relationshipsById.values())}getUnused(){const t=this.diagrams.flatMap(s=>s.DescendantsWithSourceConnections).map(s=>{var i;return(i=s.ElementId)!=null?i:s.RelationShipId}).filter(s=>s).concat(this.diagrams.map(s=>s.Id)),e=new Set(t);return rt(this.entitiesById.values()).filter(s=>!e.has(s.Id)).toArray()}removeEntity(t){this.entitiesById.delete(t.Id),t instanceof st&&this.relationshipsById.delete(t.Id),t.element.remove()}}class et{}class st extends et{}class ot extends et{resetCache(){this.children=null,this.childById=null}GetElementIds(){return this.Descendants.map(t=>t.ElementId)}GetDiagramObjectById(t){return this.childById==null&&(this.childById=new Map(this.DescendantsWithSourceConnections.map(e=>[e.Id,e]))),this.childById.get(t)}get Children(){return this.children==null&&(this.children=Array.from(this.element.children).filter(t=>t.nodeName=="children"||t.nodeName=="child").map(t=>new Fe(t,this))),this.children}get Descendants(){return this.Flatten(this.Children)}get DescendantsWithSourceConnections(){return this.FlattenWithSourceConnections(this.Children)}Flatten(t){return t.concat(t.flatMap(e=>this.Flatten(e.Children)))}FlattenWithSourceConnections(t){return t.concat(t.flatMap(e=>{let n=this.FlattenWithSourceConnections(e.SourceConnections);return e instanceof Fe&&(n=n.concat(this.FlattenWithSourceConnections(e.Children))),n}))}}class Qn{get SourceConnections(){return this.sourceConnections==null&&(this.sourceConnections=this.sourceConnectionsFromElement()),this.sourceConnections}sourceConnectionsFromElement(){return Array.from(this.Element.children).filter(e=>e.nodeName.startsWith("sourceConnection")).map(e=>new er(e,this))}constructor(t){this.Element=t,this.Id=t.getAttribute("id")}}class Fe extends Qn{constructor(t,e,n=null){var i,l,a,d,v,u;super(t),this.diagram=e,this._parent=n,this.EntityType=t.getAttribute("xsi:type"),this.EntityType.startsWith("archimate:")&&(this.EntityType=this.EntityType.substring(10)),this.ElementId=(l=(i=t.getAttribute("archimateElement"))!=null?i:t.getAttribute("model"))!=null?l:Ye(t.getElementsByClassName("archimateElement")[0]);const s=t.getElementsByTagName("bounds")[0];this._bounds=new Mn(parseFloat((a=s.getAttribute("x"))!=null?a:"0"),parseFloat((d=s.getAttribute("y"))!=null?d:"0"),parseFloat((v=s.getAttribute("width"))!=null?v:"165"),parseFloat((u=s.getAttribute("height"))!=null?u:"58")),this.FillColor=t.getAttribute("fillColor")}get parent(){return this._parent}resetCache(){this.children=null}get AbsolutePosition(){var e,n;return((n=(e=this._parent)==null?void 0:e.AbsolutePosition)!=null?n:pe.Zero).add(new pe(this.bounds.x,this.bounds.y))}get Children(){return this.children==null&&(this.children=Array.from(this.Element.children).filter(t=>t.nodeName=="children"||t.nodeName=="child").map(t=>new Fe(t,this.diagram,this))),this.children}changeElementParent(t){this.parent?this.parent.resetCache():this.diagram.resetCache(),t?t.resetCache():this.diagram.resetCache(),this.Element.remove(),this._parent=t,t.Element.appendChild(this.Element)}changeElementParentDiagram(t){this.parent.resetCache(),this.Element.remove(),this._parent=null,t.resetCache(),t.element.appendChild(this.Element)}get bounds(){return this._bounds}set bounds(t){this._bounds=t;const e=this.Element.getElementsByTagName("bounds")[0];e.setAttribute("x",t.x.toFixed(2)),e.setAttribute("y",t.y.toFixed(2)),e.setAttribute("width",t.width.toFixed(2)),e.setAttribute("height",t.height.toFixed(2))}}class er extends Qn{constructor(t,e){var s;super(t),this.Source=e,this.TargetId=t.getAttribute("target"),this.RelationShipId=(s=t.getAttribute("archimateRelationship"))!=null?s:Ye(t.getElementsByTagName("archimateRelationship")[0]);const n=Array.from(t.children).filter(i=>i.nodeName==="bendpoints"||i.nodeName==="bendpoint");this.BendPoints=n.map(i=>{var l,a;return new pe(parseFloat((l=i.getAttribute("startX"))!=null?l:"0"),parseFloat((a=i.getAttribute("startY"))!=null?a:"0"))}),this.LineWidth=t.getAttribute("lineWidth"),this.LineColor=t.getAttribute("lineColor")}}function Ye(r){return r==null?null:r.getAttribute("href").split("#")[1]}const Oe=class{constructor(r,t){this.x=r,this.y=t,this.clone=()=>new Oe(this.x,this.y),this.add=e=>new Oe(this.x+e.x,this.y+e.y),this.subtract=e=>new Oe(this.x-e.x,this.y-e.y),this.multiply=e=>new Oe(this.x*e,this.y*e)}static IsInsideBounds(r,t,e={x:0,y:0},n=4){return r.x>=t.x-Math.max(e.x,n)&&r.x<=t.x+Math.max(e.x,n)&&r.y>=t.y-Math.max(e.y,n)&&r.y<=t.y+Math.max(e.y,n)}};let pe=Oe;pe.Zero=new Oe(0,0);const tr=class{constructor(r,t,e,n){this.x=r,this.y=t,this.width=e,this.height=n}};let Mn=tr;Mn.Zero=new tr(0,0,0,0);class Ho{constructor(t,e,n,s){this.svg=t,this.project=e,this.diagram=n,this.renderer=s,this.contentElement=t.querySelector("svg>g")}makeDraggable(){this.svg.addEventListener("pointerdown",t=>this.onPointerDown(t)),this.svg.addEventListener("pointermove",t=>this.onPointerMove(t)),this.svg.addEventListener("pointerup",()=>this.onPointerUp()),this.svg.addEventListener("focusout",t=>{this.getElementFromChild(t.target)&&this.selectedElement==null&&(this.lastElementClicked=null),window.getSelection().removeAllRanges()}),this.svg.ownerDocument.addEventListener("keydown",t=>this.onKeyDown(t))}onKeyDown(t){const n=t.target.closest(".element");if(t.key==="Enter"&&n.classList.contains("note")){t.preventDefault();const s=window.getSelection(),i=s.focusOffset==s.anchorNode.textContent.length,l=s.focusNode.parentNode.childNodes.length;if(document.execCommand("insertHTML",!1,`
`),l<s.focusNode.parentNode.childNodes.length){const a=document.createRange();a.setStart(window.getSelection().focusNode.nextSibling,0),a.collapse(!0),s.removeAllRanges(),s.addRange(a)}else i&&s.focusOffset!=s.anchorNode.textContent.length&&document.execCommand("insertHTML",!1,`
`);return!1}else if(t.key=="Enter"||t.key=="Escape")t.target.blur();else if(t.key=="F2"){const s=this.contentElement.querySelector(":scope g.lastSelection");this.editElementText(s)}}onPointerDown(t){var s,i,l,a,d,v;const e=t.target;this.selectedElement=e.closest(".element");const n=t.ctrlKey;if(this.activeDragging=!1,this.selectedElement!==null&&this.selectedElement===this.lastElementClicked&&!n&&!e.parentElement.classList.contains("selection")){this.editElementText(this.selectedElement);return}if(this.startDragMousePosition=this.getMousePosition(t),this.startDragMouseOffset={x:0,y:0},this.lastElementClicked=this.selectedElement,this.selectedElement!=null){const u=this.diagram.GetDiagramObjectById(this.selectedElement.id);e.tagName==="circle"&&e.parentElement.classList.contains("selection")?(this.activeChangeResizeCorner=e.classList.item(0),this.activeChangeAction=ve.Resize,this.activeChange={move:{elementId:this.selectedElement.id,positionNew:{x:u.bounds.x,y:u.bounds.y,width:u.bounds.width,height:u.bounds.height},positionOld:{x:u.bounds.x,y:u.bounds.y,width:u.bounds.width,height:u.bounds.height},parentIdNew:(i=(s=u.parent)==null?void 0:s.Id)!=null?i:this.diagram.Id,parentIdOld:(a=(l=u.parent)==null?void 0:l.Id)!=null?a:this.diagram.Id}}):(this.activeChangeAction=ve.Move,this.startDragMouseOffset={x:this.startDragMousePosition.x-u.AbsolutePosition.x,y:this.startDragMousePosition.y-u.AbsolutePosition.y},this.activeChange={move:{elementId:this.selectedElement.id,positionNew:{x:u.AbsolutePosition.x,y:u.AbsolutePosition.y,width:u.bounds.width,height:u.bounds.height},positionOld:{x:u.bounds.x,y:u.bounds.y,width:u.bounds.width,height:u.bounds.height},parentIdNew:this.diagram.Id,parentIdOld:(v=(d=u.parent)==null?void 0:d.Id)!=null?v:this.diagram.Id}},this.selectedDropTarget=this.selectedElement.parentElement)}else if(e.tagName==="circle"&&e.parentElement.classList.contains("con")&&!e.classList.contains("end")){this.activeChangeAction=ve.Connection;let u=0,x=e.previousElementSibling;for(;x.tagName=="circle";)u++,x=x.previousElementSibling;const w=this.diagram.GetDiagramObjectById(e.parentElement.id),h=w.BendPoints.map(m=>({x:m.x,y:m.y}));this.activeChange={connection:{index:u,sourceConnectionId:w.Id,bendPointsOld:h,bendPointsNew:h}}}this.doElementSelection(n),e.classList.contains("RelationshipDetect")&&this.doRelationShipSelection(e.parentElement)}doRelationShipSelection(t){this.selectedRelation&&this.selectedRelation.classList.remove("selected"),this.selectedRelation===t?this.selectedRelation=null:(this.selectedRelation=t,this.selectedRelation.classList.add("selected"),this.selectedRelation.ownerSVGElement.appendChild(this.selectedRelation))}doElementSelection(t){const e=this.selectedElement&&this.selectedElement.classList.contains("selected");if(this.contentElement.querySelectorAll("g.element>g.selection").forEach(n=>{n.parentElement.classList.remove("lastSelection"),(!t||this.selectedElement===n.parentElement)&&(n.parentElement.classList.remove("selected"),n.remove())}),this.contentElement.querySelectorAll("g.con.highlight").forEach(n=>{(!t||this.selectedElement===n.parentElement)&&n.classList.remove("highlight")}),this.selectedElement&&(!t||!e)){this.selectedElement.classList.add("lastSelection"),this.selectedElement.classList.add("selected");const n=this.diagram.GetDiagramObjectById(this.selectedElement.id),s=this.selectedElement.querySelector(":scope>foreignObject");s?this.selectedElement.insertBefore(this.renderer.template.getElementSelection(n.bounds.width,n.bounds.height),s):this.selectedElement.appendChild(this.renderer.template.getElementSelection(n.bounds.width,n.bounds.height))}}editElementText(t){const e=t.querySelector(":scope>foreignObject>div>div");this.getElementFromChild(document.activeElement)!==t&&setTimeout(function(){e.focus();const s=document.createRange();s.selectNodeContents(e);const i=window.getSelection();i.removeAllRanges(),i.addRange(s)},100),this.selectedElement=null}getElementFromChild(t){for(;t!=null&&!(t instanceof SVGGElement);)t=t.parentElement;return t}getOffsetFromContent(t){let e=0,n=0;for(;t!==this.contentElement;){const s=t.transform.baseVal.consolidate();e+=s.matrix.e,n+=s.matrix.f,t=t.parentElement}return{x:e,y:n}}onPointerMove(t){if(this.activeChangeAction==null)return;this.lastElementClicked=null,document.activeElement instanceof HTMLElement&&document.activeElement.blur();const e=this.getMousePosition(t),n={x:e.x-this.startDragMousePosition.x,y:e.y-this.startDragMousePosition.y},s=Math.sqrt(n.x**2+n.y**2);if(this.activeDragging||s>=5&&(this.activeDragging=!0),!!this.activeDragging){if(this.activeChangeAction==ve.Move){const i={x:Math.round((e.x-this.startDragMouseOffset.x)/12)*12,y:Math.round((e.y-this.startDragMouseOffset.y)/12)*12};this.activeChange.move.positionNew.x=i.x,this.activeChange.move.positionNew.y=i.y,this.doDiagramChange(this.activeChange),this.doSvgChange(this.activeChange),this.setDraggingAttributes(),this.setDropTargetAttributes()}else if(this.activeChangeAction==ve.Resize)this.activeChangeResizeCorner.indexOf("w")>=0&&(this.activeChange.move.positionNew.x=this.activeChange.move.positionOld.x+n.x,this.activeChange.move.positionNew.width=this.activeChange.move.positionOld.width-n.x),this.activeChangeResizeCorner.indexOf("e")>=0&&(this.activeChange.move.positionNew.width=this.activeChange.move.positionOld.width+n.x),this.activeChangeResizeCorner.indexOf("n")>=0&&(this.activeChange.move.positionNew.y=this.activeChange.move.positionOld.y+n.y,this.activeChange.move.positionNew.height=this.activeChange.move.positionOld.height-n.y),this.activeChangeResizeCorner.indexOf("s")>=0&&(this.activeChange.move.positionNew.height=this.activeChange.move.positionOld.height+n.y),this.doDiagramChange(this.activeChange),this.doSvgChange(this.activeChange),this.setDraggingAttributes();else if(this.activeChangeAction==ve.Connection){const i=this.activeChange.connection;i.bendPointsNew=i.bendPointsOld.map(h=>({x:h.x,y:h.y}));let l=-1;const a=this.diagram.GetDiagramObjectById(i.sourceConnectionId),[d,v]=this.renderer.getAbsolutePositionAndBounds(a.Source),[u,x]=this.renderer.getAbsolutePositionAndBounds(this.diagram.GetDiagramObjectById(a.TargetId)),w=ye.calculateConnectionCoords(d,v,u,x,a);if(i.index%2==1){const h={x:this.startDragMousePosition.x-d.x,y:this.startDragMousePosition.y-d.y};l=(i.index-1)/2,i.bendPointsNew=[...i.bendPointsNew.slice(0,l),{x:h.x,y:h.y},...i.bendPointsNew.slice(l)]}else i.index>0&&i.index/2-1<i.bendPointsNew.length&&(l=i.index/2-1);if(l>=0&&(i.bendPointsNew[l].x=i.bendPointsNew[l].x+n.x,i.bendPointsNew[l].y=i.bendPointsNew[l].y+n.y),pe.IsInsideBounds(e,d,v))i.bendPointsNew=i.bendPointsNew.slice(l+1);else if(pe.IsInsideBounds(e,u,x))i.bendPointsNew=i.bendPointsNew.slice(0,l);else for(let h=0;h<w.length-2;h++)if(h!=l&&pe.IsInsideBounds(e,w[h+1])){h<l?i.bendPointsNew=[...i.bendPointsNew.slice(0,h+1),...i.bendPointsNew.slice(l+1)]:i.bendPointsNew=[...i.bendPointsNew.slice(0,l),...i.bendPointsNew.slice(h)];break}this.doDiagramChange(this.activeChange),this.doSvgChange(this.activeChange),this.doRelationShipSelection(this.svg.getElementById(this.activeChange.connection.sourceConnectionId))}}}onPointerUp(){if(this.activeChangeAction!=null){if(this.activeChange.move&&this.selectedDropTarget){this.activeChange.move.parentIdNew=this.selectedDropTarget.id;const t=this.getOffsetFromContent(this.selectedDropTarget);this.activeChange.move.positionNew.x-=t.x,this.activeChange.move.positionNew.y-=t.y}this.doDiagramChange(this.activeChange),this.doSvgChange(this.activeChange),this.activeChangeAction==ve.Connection&&this.doRelationShipSelection(this.svg.getElementById(this.activeChange.connection.sourceConnectionId)),this.selectedElement&&this.selectedElement.classList.remove("dragging"),this.svg.classList.remove("dragging"),this.selectedDropTarget&&this.selectedDropTarget.classList.remove("drop"),this.selectedDropTarget=null,this.selectedElement=null,this.activeChange=null,this.activeChangeAction=null,this.activeDragging=!1}}setDraggingAttributes(){this.selectedElement.classList.contains("dragging")||(this.selectedElement.classList.add("dragging"),this.svg.classList.add("dragging"))}setDropTargetAttributes(){const t=this.svg.querySelectorAll("g.element:hover"),e=t?t[t.length-1]:null;e?this.selectedDropTarget!==e&&(this.selectedDropTarget&&this.selectedDropTarget.classList.remove("drop"),this.selectedDropTarget=e,this.selectedDropTarget.classList.add("drop")):this.selectedDropTarget&&(this.selectedDropTarget.classList.remove("drop"),this.selectedDropTarget=null)}doSvgChange(t){var e;if(this.activeChangeAction==ve.Move){const n=t.move,s=this.svg.getElementById(n.elementId);s.parentElement.id!=n.parentIdNew&&(s.remove(),this.svg.getElementById((e=n.parentIdNew)!=null?e:"Content").appendChild(s)),this.selectedElement.setAttributeNS(null,"transform",`translate(${n.positionNew.x}, ${n.positionNew.y})`),this.renderer.clearRelations(),this.renderer.addRelations();const i=this.diagram.GetDiagramObjectById(n.elementId);this.diagram.DescendantsWithSourceConnections.filter(a=>a instanceof er&&(a.Source.Id==i.Id||a.TargetId==i.Id)).forEach(a=>{const d=this.selectedElement.ownerDocument.getElementById(a.Id);d&&d.classList.add("highlight")})}else if(this.activeChangeAction==ve.Resize){const n=t.move,s=this.svg.getElementById(n.elementId),i=s.parentElement,l=this.diagram.GetDiagramObjectById(n.elementId);s.remove(),this.renderer.addElement(l,i),this.renderer.clearRelations(),this.renderer.addRelations()}else this.activeChangeAction==ve.Connection&&(this.renderer.clearRelations(),this.renderer.addRelations())}doDiagramChange(t){if(t.move){const e=t.move,n=this.diagram.GetDiagramObjectById(e.elementId),s=e.parentIdNew==this.diagram.Id?null:this.diagram.GetDiagramObjectById(e.parentIdNew);n.parent!=s&&(s!=null?n.changeElementParent(s):n.changeElementParentDiagram(this.diagram)),n.bounds=new Mn(e.positionNew.x,e.positionNew.y,e.positionNew.width,e.positionNew.height)}if(t.connection){const e=t.connection,n=this.diagram.GetDiagramObjectById(e.sourceConnectionId);n.BendPoints=e.bendPointsNew.map(s=>({x:s.x,y:s.y}))}}getMousePosition(t){const e=this.svg.getScreenCTM();return{x:(t.clientX-e.e)/e.a,y:(t.clientY-e.f)/e.d}}}var ve=(r=>(r[r.Move=0]="Move",r[r.Resize=1]="Resize",r[r.Connection=2]="Connection",r))(ve||{}),Vo=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="920"
  height="1200" class='hideElementType'>
  <script href="DiagramEditor.js" />
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

    g.technology {
      --mainColor: #C9E7B7;
    }

    g.strategy {
      --mainColor: #CCCCFF;
    }

    g.motivation {
      --mainColor: #d9cfff;
    }

    g.capability {
      --mainColor: #F5DEAA;
    }

    g.package {
      --mainColor: #FFE0E0;
    }

    g.gap {
      --mainColor: #E0FFE0;
    }

    g.location {
      --mainColor: #FBB875;
    }

    g.diagram {
      --mainColor: #DCEBEB;
    }

    g.undefined {
      --mainColor: #ccc;
    }

    g.element {
      fill: var(--mainColor);
      stroke: #000;
    }

    
    foreignObject {
      pointer-events: none;
      user-select: none;
      font-family: "Segoe UI", Verdana, Geneva, Tahoma, sans-serif;
      color: #000;
      font-size: 12px;
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

    g.element>foreignObject div {
      display: flex;
      align-items: center;
      text-align: center;

      width: 100%;
      flex-wrap: wrap;
      flex-direction: column;
      padding: 2px;
      box-sizing: border-box;
      /* background-color: #7779; */
      white-space: normal;
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-word;
      hyphens: auto;
      text-overflow: ellipse;
      overflow: hidden;
    }

    g.element.structure>foreignObject div {
      padding: 2px 2px 2px 2px;
    }

    g.element>foreignObject>div>div:first-child {
      margin-bottom: auto;
      /* Make it push flex items to the center */
      line-height: 1.2em;
    }

    g.element>foreignObject:last-child>div>div:first-child {
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
    }

    g.element.group>foreignObject div {
      align-items: flex-start;
      padding: 1px 2px 0px 2px;
      height: 18px !important;
    }

    g.element.note>foreignObject div {
      text-align: left;
      align-items: flex-start;
      margin: 0px;
      white-space: pre-wrap;
      height: 100%;
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

    g.element.behavior rect {
      rx: 10;
      ry: 10;
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
    g.element>g.selection {
      display: none;
      stroke: #000;
      fill: #fff;
    }

    g.element.selected>g.selection  {
      display: initial;
    }

    g.element.selected.lastSelection>g.selection circle {
      fill: #000;
      stroke: #fff;
    }

    g.element.selected>g.selection circle.re { cursor: e-resize; }
    g.element.selected>g.selection circle.rw { cursor: w-resize; }
    g.element.selected>g.selection circle.rs { cursor: s-resize; }
    g.element.selected>g.selection circle.rn { cursor: n-resize; }
    g.element.selected>g.selection circle.rne { cursor: ne-resize; }
    g.element.selected>g.selection circle.rnw { cursor: nw-resize; }
    g.element.selected>g.selection circle.rse { cursor: se-resize; }
    g.element.selected>g.selection circle.rsw { cursor: sw-resize; }
  </style>
  <defs>
    <!-- https://css-tricks.com/use-and-reuse-everything-in-svg-even-animations/ -->
    <g id="ActorIcon">
      <ellipse cx="-10" cy="6" rx="2.5" ry="2.5" fill="none" stroke="black" />
      <path d="M -10 8.25 l 0 7 m -4.5 -4.5 l 9 0 m -9 8.25 l 4.5 -3.75 l 4.5 3.75" fill="none" stroke="black" />
    </g>
    <g id="RoleIcon">
      <path d="m -8 14 a 1 1 0 0 1 0 -8 l -9 0 a 1 1 0 0 0 0 8 l 9 0 a 1 1 0 0 0 0 -8" stroke="black" fill="none" />
    </g>
    <g id="CollaborationIcon">
      <ellipse cx="-15" cy="9" rx="5" ry="5" stroke="black" fill="none" />
      <ellipse cx="-9" cy="9" rx="5" ry="5" stroke="black" fill="none" />
    </g>
    <g id="InterfaceIcon">
      <ellipse cx="-8" cy="9" rx="5" ry="5" stroke="black" fill="none" />
      <path d="M -13 9 h -5" fill="none" stroke="black" />
    </g>
    <g id="ProcessIcon">
      <path d="m -19, 7 l 9 0 l 0 -3 l 6 5 l -6 5 l 0 -3 l -9 0 z" stroke="black" fill="none" />
    </g>
    <g id="FunctionIcon">
      <path d="m -12 3 l 8 3 l 0 12 l -8 -3 l -8 3 l 0 -12 z" stroke="black" fill="none" />
    </g>
    <g id="InteractionIcon">
      <path d="m -10 3 a 1 1 0 0 1 0 14 z m -2 0 a 1 1 0 0 0 0 14 z" stroke="black" fill="none" />
    </g>
    <g id="ServiceIcon">
      <path d="M-10 5a1 1 0 010 10l-7 0a1 1 0 01-1-10z" stroke="black" fill="none" />
    </g>
    <g id="ArtifactIcon">
      <path d="M-7 4 h-7 v12 h11 v-8 h-3.6 v-3.6 l4 4" stroke="black" fill="none" />
    </g>
    <g id="EventIcon">
      <path d="m-10 5a1 1 0 010 10l-13 0 5-5-5-5z" stroke="black" />
    </g>
    <g id="SystemSoftwareIcon">
      <path d="m -6 14 a 1 1 0 0 0 -7 -7 a 1 1 0 0 0 7 7 c 9.14 -6.61 -1.76 -15.14 -6.46 -7.43" fill="none"
        stroke="black" />
    </g>
    <g id="CommunicationNetworkIcon">
      <ellipse cx="-4" cy="4" rx="1.2" ry="1.2" fill="black" stroke="black" />
      <ellipse cx="-10" cy="4" rx="1.2" ry="1.2" fill="black" stroke="black" />
      <ellipse cx="-6" cy="10" rx="1.2" ry="1.2" fill="black" stroke="black" />
      <ellipse cx="-12" cy="10" rx="1.2" ry="1.2" fill="black" stroke="black" />
      <path d="m-4 4 h-6 l-2 6 h6 z" fill="none" stroke="black" />
    </g>
    <g id="PathIcon">
      <path d="M -18 14 l-4 -4 l4 -4 M-8 14 l4 -4 l-4 -4" fill="none" stroke="black" />
      <path d="M -22 10 h18" stroke-dasharray="2 2" stroke="black" />
    </g>
    <g id="MaterialIcon">
      <path
        d="M -18 10 l 4 -6 l 6 0 l 4 6 l -4 6 l -6 0 l -4 -6 m 3 0 l 2.7 -4 m -1.245 6.993 l 5.183 0 m 1.327 -2.999 l -2.7 -4"
        fill="none" stroke="black" />
    </g>
    <g id="MaterialIcon">
      <path
        d="M -18 10 l 4 -6 l 6 0 l 4 6 l -4 6 l -6 0 l -4 -6 m 3 0 l 2.7 -4 m -1.245 6.993 l 5.183 0 m 1.327 -2.999 l -2.7 -4"
        fill="none" stroke="black" />
    </g>
    <g id="DistributionNetworkIcon">
      <path d="m -17 12 l -4 -4 l 4 -4 m 10 8 l 4 -4 l -4 -4 m -12.5 2.5 l 15 0 m 0 3 l -15 0" fill="none"
        stroke="black" />
    </g>
    <g id="DiagramIcon">
      <path
        d="m -17 6  h 3 v 3 h -3z m 0 8 h 3 v 3 h -3z m 5 -6 l 8 0 m -8 7 l 8 0 m -7 -3 a 0.5 0.5 0 0 0 0 -1 a 0.5 0.5 0 1 0 0 1 m 2 -0.5 l 5 0"
        fill="none" stroke="black" />
    </g>
    <g id="FacilityIcon">
      <path d="M -26 11 v12 h15 v-8 l-4 3 v-3 l-4 3 v-3 l-4 3 v-7z" fill="none" stroke="black" />
    </g>
    <g id="Component" transform="translate(-20, 0)">
      <rect x="6.4" y="3" width="9.8" height="15" fill="none" stroke="#000000" />
      <rect x="3.2" y="6.7" width="6.5" height="2.3" fill="none" stroke="#000000" />
      <rect x="3.2" y="12" width="6.5" height="2.3" fill="none" stroke="#000000" />
    </g>
    <g id="CapabilityIcon" transform="translate(-20, 4)">
      <rect x="8" y="0" fill="none" width="4" height="12" stroke="black" />
      <rect x="0" y="8" fill="none" width="12" height="4" stroke="black" />
      <rect x="4" y="4" fill="none" width="8" height="8" stroke="black" />
    </g>
    <g id="ValueStreamIcon">
      <path d="m -25 5 h16 l5 5 l-5 5 h-16 l5 -5z" stroke="black" />
    </g>
    <g id="ResourceIcon" transform="translate(-25, 4)">
      <path
        d="m 4 0 h 11 C 18 0 18 0 18 2 v 5 c 0 2 0 2 -2 2 h -11 c -2 0 -2 0 -2 -2 v -5 c 0 -2 0 -2 2 -2 m 1 2 v 5 m 3 0 v -5 m 3 0 v 5 m 6 -0.5 h 1.5 c 1.5 0 1.5 0 1.5 -1.5 v -1 c 0 -1.5 0 -1.5 -2 -1.5 h -1"
        stroke="black" />
    </g>
    <g id="EquipmentIcon">
      <path stroke="black" d="m-15 21
           l 0.85 0.49 c 0.1 0.06 0.14 0.17 0.11 0.28 c -0.22 0.71 -0.6 1.36 -1.09 1.89 a 0.24 0.24 90 0 1 -0.3 0.05 l -0.85 -0.49 a 3.83 3.83 90 0 1 -1.22 0.7 v 0.98 a 0.24 0.24 90 0 1 -0.19 0.23 c -0.7 0.16 -1.45 0.17 -2.18 0 c -0.11 -0.02 -0.19 -0.12 -0.19 -0.23 v -0.98 a 3.83 3.83 90 0 1 -1.22 -0.7 l -0.85 0.49 a 0.24 0.24 90 0 1 -0.3 -0.05 c -0.49 -0.53 -0.87 -1.18 -1.09 -1.89 c -0.03 -0.11 0.01 -0.22 0.11 -0.28 l 0.85 -0.49 a 3.87 3.87 90 0 1 0 -1.4 l -0.85 -0.49 c -0.1 -0.06 -0.14 -0.17 -0.11 -0.28 c 0.22 -0.71 0.6 -1.36 1.09 -1.89 a 0.24 0.24 90 0 1 0.3 -0.05 l 0.85 0.49 a 3.83 3.83 90 0 1 1.22 -0.7 v -0.98 a 0.24 0.24 90 0 1 0.19 -0.23 c 0.7 -0.16 1.45 -0.17 2.18 -0 c 0.11 0.02 0.19 0.12 0.19 0.23 v 0.98 a 3.83 3.83 90 0 1 1.22 0.7 l 0.85 -0.49 a 0.24 0.24 90 0 1 0.3 0.05 c 0.49 0.53 0.87 1.18 1.09 1.89 c 0.03 0.11 -0.01 0.22 -0.11 0.28 l -0.85 0.49 a 3.87 3.87 90 0 1 0 1.4 z m -2.18 -0.7 c 0 -0.88 -0.72 -1.6 -1.6 -1.6 s -1.6 0.72 -1.6 1.6 s 0.72 1.6 1.6 1.6 s 1.6 -0.72 1.6 -1.6 z
           m 6.23 -4.6 l 0.59 0.34 c 0.07 0.04 0.1 0.12 0.08 0.2 c -0.15 0.5 -0.42 0.95 -0.76 1.32 a 0.17 0.17 90 0 1 -0.21 0.03 l -0.59 -0.34 a 2.68 2.68 90 0 1 -0.85 0.49 v 0.69 a 0.17 0.17 90 0 1 -0.13 0.16 c -0.49 0.11 -1.01 0.12 -1.53 0 c -0.08 -0.01 -0.13 -0.08 -0.13 -0.16 v -0.69 a 2.68 2.68 90 0 1 -0.85 -0.49 l -0.59 0.34 a 0.17 0.17 90 0 1 -0.21 -0.03 c -0.34 -0.37 -0.61 -0.83 -0.76 -1.32 c -0.02 -0.08 0.01 -0.15 0.08 -0.2 l 0.59 -0.34 a 2.71 2.71 90 0 1 0 -0.98 l -0.59 -0.34 c -0.07 -0.04 -0.1 -0.12 -0.08 -0.2 c 0.15 -0.5 0.42 -0.95 0.76 -1.32 a 0.17 0.17 90 0 1 0.21 -0.03 l 0.59 0.34 a 2.68 2.68 90 0 1 0.85 -0.49 v -0.69 a 0.17 0.17 90 0 1 0.13 -0.16 c 0.49 -0.11 1.01 -0.12 1.53 0 c 0.08 0.01 0.13 0.08 0.13 0.16 v 0.69 a 2.68 2.68 90 0 1 0.85 0.49 l 0.59 -0.34 a 0.17 0.17 90 0 1 0.21 0.03 c 0.34 0.37 0.61 0.83 0.76 1.32 c 0.02 0.08 -0.01 0.15 -0.08 0.2 l -0.59 0.34 a 2.71 2.71 90 0 1 0 0.98 z m -1.53 -0.49 c 0 -0.62 -0.5 -1.12 -1.12 -1.12 s -1.12 0.5 -1.12 1.12 s 0.5 1.12 1.12 1.12 s 1.12 -0.5 1.12 -1.12 z
           "></path>
    </g>
    <g id="GoalIcon" transform="translate(-19 3)">
      <ellipse cx="5" cy="9" rx="1.5" ry="1.5" stroke="black" fill="black" />
      <ellipse cx="5" cy="9" rx="4.5" ry="4.5" stroke="black" fill="none" />
      <ellipse cx="5" cy="9" rx="7.5" ry="7.5" stroke="black" fill="none" />
    </g>
    <g id="CourseOfActionIcon">
      <ellipse cx="-10" cy="10" rx="1.5" ry="1.5" stroke="black" fill="black" />
      <ellipse cx="-10" cy="10" rx="4" ry="4" stroke="black" fill="none" />
      <ellipse cx="-10" cy="10" rx="6.5" ry="6.5" stroke="black" fill="none" />
      <path stroke="black"
        d="m -22 12 l 6 0 l -2 5 l -1.3 -1.8 c -1.136 0.01 -1.905 1.886 -1.851 2.993 l -1.458 -0.149 c -0.189 -1.862 0.54 -3.468 2.254 -4.17 l -1.645 -1.874z"
        fill="black"></path>
    </g>
    <g id="AssessmentIcon">
      <ellipse cx="-11" cy="9" rx="4.5" ry="4.5" stroke="black" fill="none" />
      <path stroke="black" d="M-14.2 12.2 l-4 4"></path>
    </g>
    <g id="DriverIcon">
      <ellipse cx="-12" cy="10" rx="6" ry="6" stroke="black" fill="none" stroke-width="1.5" />
      <ellipse cx="-12" cy="10" rx="1" ry="1" stroke="black" fill="black" />
      <path stroke="black" d="M-12 2 l0 16 M-20 10 l16 0 M-17.6 4.4 l11.2 11.2 M-6.4 4.4 l-11.2 11.2"
        stroke-width="0.7"></path>
    </g>
    <g id="ConstraintIcon">
      <path stroke="black" d="M-7 5 h-14 l-4 8 h14z M-17 5 l-4 8"></path>
    </g>
    <g id="RequirementIcon">
      <path stroke="black" d="M-7 5 h-14 l-4 8 h14z"></path>
    </g>
    <g id="OutcomeIcon" transform="translate(-19 3)">
      <ellipse cx="5" cy="9" rx="1.5" ry="1.5" stroke="black" fill="none" />
      <ellipse cx="5" cy="9" rx="4.5" ry="4.5" stroke="black" fill="none" />
      <ellipse cx="5" cy="9" rx="7.5" ry="7.5" stroke="black" fill="none" />
      <path stroke="black" fill="black" stroke-width="1.5" d="M 6 8 l 1.5 -4.5 l 3 3 Z"></path>
      <path stroke="black" fill="none" stroke-width="1" stroke-linecap="round" d="M 6 8 l 6 -6"></path>
      <path stroke="black" fill="none" stroke-width="0.5" stroke-linecap="round" d="M 11.5 0.5 l -1 3 l 3 -1">
      </path>
    </g>
    <g id="PrincipleIcon">
      <path stroke="black" fill="none"
        d="m -20 5 c 1 -1 12 -1 13 0 c 1 1 1 12 0 13 c -1 1 -12 1 -13 0 c -1 -1 -1 -12 0 -13 z"></path>
      <path stroke="black" fill="#000" d="m -14 7 v2 l0.3 4 h0.4 l0.3 -4 v-2z  "></path>
      <rect width="0.6" height="0.6" x="-13.8" y="15" stroke="#000" fill="#000" />
    </g>

    <g id="LocationIcon">
      <path stroke="black" fill="none" stroke-width="1" d="M -5 9  a 1 1 0 0 0 -10 0 l 5 10z"></path>
    </g>
    <g id="GapIcon">
      <ellipse cx="-12" cy="9" rx="6" ry="6" stroke="black" />
      <path d="M -22 8 h 20 M -22 11 h 20" fill="none" stroke="black" />
    </g>
    <g id="PlateauIcon">
      <path d="M -25 12 h 14 M -27 15 h 14 M -29 18 h 14" fill="none" stroke="black" />
    </g>
    <g id="TodoIcon" transform="translate(-13 18)">
      <text x="0" y="0" fill="#000000" font-family="Helvetica" font-size="16px" text-anchor="middle">&#x1F937;</text>
    </g>
    <g id="ExperimentIcon" transform="translate(-13 18)">
      <text x="0" y="0" fill="#000000" font-family="Helvetica" font-size="16px" text-anchor="middle">&#x1F9ea;</text>
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
    <marker id="arrowOpen" markerWidth="21" markerHeight="16" refX="20.5" refY="8" orient="auto"
      markerUnits="userSpaceOnUse">
      <path d="M 20 8 l -14 7 l0 -14z" fill="#fff" stroke="#000" />
    </marker>
    <marker id="arrowPointed" markerWidth="11" markerHeight="8" refX="10.5" refY="4" orient="auto"
      markerUnits="userSpaceOnUse">
      <path d="M 3 0.5 l 7 3.5 l -7 3.5" fill="none" stroke="#000" />
    </marker>
    <marker id="arrowPointedStart" markerWidth="11" markerHeight="8" refX="0.5" refY="4" orient="auto"
      markerUnits="userSpaceOnUse">
      <path d="M 10 0.5 l -7 3.5 l 7 3.5" fill="none" stroke="#000" />
    </marker>
    <marker id="arrowCircle" markerWidth="11" markerHeight="8" refX="2" refY="4" orient="auto"
      markerUnits="userSpaceOnUse">
      <ellipse cx="5" cy="4" rx="3" ry="3" fill="#000000" stroke="#000000" />
    </marker>
  </defs>

  <rect x="-12000" y="-12000" width="24000" height="24000" fill="url(#grid)" style="pointer-events: none" />
  <g id="Content">
    <g id="BusinessActor" transform="translate(12, 24)" class="business active element">
      <rect width="168" height="60" />
      <use xlink:href="#ActorIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Actor</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessRole" transform="translate(12, 96)" class="business active element">
      <rect width="168" height="60" />
      <use xlink:href="#RoleIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Role</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessCollaboration" transform="translate(12, 168)" class="business active element">
      <rect width="168" height="60" />
      <use xlink:href="#CollaborationIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Collaboration</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessInterface" transform="translate(12, 240)" class="business active element">
      <rect width="168" height="60" />
      <use xlink:href="#InterfaceIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Interface</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessProcess" transform="translate(192, 24)" class="business behavior element">
      <rect width="168" height="60" />
      <use xlink:href="#ProcessIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Process</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessFunction" transform="translate(192, 96)" class="business behavior element">
      <rect width="168" height="60" />
      <use xlink:href="#FunctionIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Function</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessInteraction" transform="translate(192, 168)" class="business behavior element">
      <rect width="168" height="60" />
      <use xlink:href="#InteractionIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Interaction</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessService" transform="translate(192, 240)" class="business behavior element">
      <rect width="168" height="60" />
      <use xlink:href="#ServiceIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Service</div>
        </div>
      </foreignObject>
    </g>

    <g id="BusinessEvent" transform="translate(192, 312)" class="business behavior element">
      <rect width="168" height="60" />
      <use xlink:href="#EventIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Business Event</div>
        </div>
      </foreignObject>
    </g>

    <g id="Capability" transform="translate(192, 456)" class="capability behavior element">
      <rect width="168" height="60" />
      <use xlink:href="#CapabilityIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Capability</div>
        </div>
      </foreignObject>
    </g>


    <g id="Capability" transform="translate(192, 456)" class="capability behavior element">
      <rect width="168" height="60" />
      <use xlink:href="#CapabilityIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Capability</div>
        </div>
      </foreignObject>
    </g>

    <g id="Resource" transform="translate(12, 456)" class="capability behavior element">
      <rect width="168" height="60" />
      <use xlink:href="#ResourceIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Resource</div>
        </div>
      </foreignObject>
    </g>
    <g id="ValueStream" transform="translate(372, 456)" class="capability behavior element">
      <rect width="168" height="60" />
      <use xlink:href="#ValueStreamIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Value Stream</div>
        </div>
      </foreignObject>
    </g>
    <g id="CourseOfAction" transform="translate(552, 456)" class="capability behavior element">
      <rect width="168" height="60" />
      <use xlink:href="#CourseOfActionIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Course of Action</div>
        </div>
      </foreignObject>
    </g>
    <g id="Artifact" transform="translate(12, 600)" class="technology static element">
      <rect width="168" height="60" />
      <use xlink:href="#ArtifactIcon" x="168" y="0" />
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
      <path d="M 0 0 l 168 0 l 0 60
            c -84 -16 -84 16 -168 0 Z" />
      <path d="M 0 8 l 168 0" fill="none" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Representation</div>
        </div>
      </foreignObject>
    </g>

    <g id="Grouping" transform="translate(12, 312)" class="group element">
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
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Note</div>
        </div>
      </foreignObject>
    </g>

    <g id="Group" transform="translate(12, 384)" class="group element">
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
      <use xlink:href="#SystemSoftwareIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>System Software</div>
        </div>
      </foreignObject>
    </g>

    <g id="Node" transform="translate(372, 670)" class="technology structure element">
      <path fill="rgb(180,207,164)" d="M 0 8 l 8 -8 l 160 0 l 0 52 l -8 8 l -160 0z" />
      <rect x="0" y="8" width="160" height="52" />
      <path fill="none" d="M168 0 l -8 8" fill-rule="evenodd" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Node</div>
        </div>
      </foreignObject>
    </g>
    <g id="Equipment" transform="translate(192, 670)" class="technology structure element">
      <path fill="rgb(180,207,164)" d="M 0 8 l 8 -8 l 160 0 l 0 52 l -8 8 l -160 0z" />
      <rect x="0" y="8" width="160" height="52" />
      <path fill="none" d="M168 0 l -8 8" fill-rule="evenodd" />
      <use xlink:href="#EquipmentIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Equipment</div>
        </div>
      </foreignObject>
    </g>
    <g id="Facility" transform="translate(12, 670)" class="technology structure element">
      <path fill="rgb(180,207,164)" d="M 0 8 l 8 -8 l 160 0 l 0 52 l -8 8 l -160 0z" />
      <rect x="0" y="8" width="160" height="52" />
      <path fill="none" d="M168 0 l -8 8" fill-rule="evenodd" />
      <use xlink:href="#FacilityIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Facility</div>
        </div>
      </foreignObject>
    </g>
    <g id="DistributionNetwork" transform="translate(12, 742)" class="technology active element">
      <rect width="168" height="60" />
      <use xlink:href="#DistributionNetworkIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>DistributionNetwork</div>
        </div>
      </foreignObject>
    </g>
    <g id="ArchimateDiagramModel" transform="translate(12, 808)" class="diagram element">
      <rect width="168" height="60" />
      <use xlink:href="#DiagramIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Diagram</div>
        </div>
      </foreignObject>
    </g>
    <g id="Material" transform="translate(192, 742)" class="technology active element">
      <rect width="168" height="60" />
      <use xlink:href="#MaterialIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Material</div>
        </div>
      </foreignObject>
    </g>

    <g id="Path" transform="translate(552, 670)" class="technology active element">
      <rect width="168" height="60" />
      <use xlink:href="#PathIcon" x="168" y="0" />
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
      <use xlink:href="#CommunicationNetworkIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Communication Network</div>
        </div>
      </foreignObject>
    </g>

    <g id="todo" transform="translate(192, 600)" class="undefined element">
      <rect width="168" height="60" />
      <use xlink:href="#TodoIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Work in progress</div>
        </div>
      </foreignObject>
    </g>

    <g id="Goal" transform="translate(192, 948)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use xlink:href="#GoalIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Goal</div>
        </div>
      </foreignObject>
    </g>

    <g id="Assessment" transform="translate(12, 948)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use xlink:href="#AssessmentIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Assessment</div>
        </div>
      </foreignObject>
    </g>

    <g id="Driver" transform="translate(12, 1018)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use xlink:href="#DriverIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Driver</div>
        </div>
      </foreignObject>
    </g>

    <g id="Requirement" transform="translate(192, 1018)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use xlink:href="#RequirementIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Requirement</div>
        </div>
      </foreignObject>
    </g>

    <g id="Constraint" transform="translate(372, 1018)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use xlink:href="#ConstraintIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Constraint</div>
        </div>
      </foreignObject>
    </g>

    <g id="Stakeholder" transform="translate(552, 1018)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use xlink:href="#RoleIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Stakeholder</div>
        </div>
      </foreignObject>
    </g>

    <g id="Meaning" transform="translate(732, 947)" class="motivation element">
      <path
        d="m 71 5 c 6 -14 90 -11 88 -1 C 179 2 178 19 166 25 c 12 -7 13 19 0 24 c 11 19 -55 26 -74 8 c -3 13 -96 16 -76 -2 c -21 -3 -23 -41 -9 -39 c -18 -11 5 -23 16 -16 c 4 -13 49 -1 48 5 " />
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
      <use xlink:href="#OutcomeIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Outcome</div>
        </div>
      </foreignObject>
    </g>

    <g id="Principle" transform="translate(552, 948)" class="motivation element">
      <path d="M8 0 h 152 l 8 8 v 44 l -8 8 h -152 l -8 -8 v -44 z" />
      <use xlink:href="#PrincipleIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Principle</div>
        </div>
      </foreignObject>
    </g>

    <g id="ApplicationComponent" transform="translate(372, 384)" class="application active element">
      <rect width="168" height="60" />
      <use xlink:href="#Component" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Application Component</div>
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
      <use xlink:href="#LocationIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Location</div>
        </div>
      </foreignObject>
    </g>

    <g id="Gap" transform="translate(372, 808)" class="gap element">
      <path d="M 0 0 l 168 0 l 0 60 c -84 -16 -84 16 -168 0 Z" />
      <use xlink:href="#GapIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Gap</div>
        </div>
      </foreignObject>
    </g>

    <g id="Plateau" transform="translate(552, 808)" class="gap structure element">
      <path d="M 0 8 l 8 -8 l 160 0 l 0 52 l -8 8 l -160 0z" />
      <rect x="0" y="8" width="160" height="52" />
      <path fill="none" d="M168 0 l -8 8" fill-rule="evenodd" />
      <use xlink:href="#PlateauIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Plateau</div>
        </div>
      </foreignObject>
    </g>

    <g id="ImplementationEvent" transform="translate(12, 878)" class="package behavior element">
      <rect width="168" height="60" />
      <use xlink:href="#EventIcon" x="168" y="0" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Implementation Event</div>
        </div>
      </foreignObject>
    </g>

    <g id="WorkPackage" transform="translate(192, 878)" class="behavior package element">
      <rect width="168" height="60" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Work Package</div>
        </div>
      </foreignObject>
    </g>

    <g id="Deliverable" transform="translate(372, 878)" class="package element">
      <path d="M 0 0 l 168 0 l 0 60 c -84 -16 -84 16 -168 0 Z" />
      <foreignObject width="168px" height="60px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 168px; height: 60px">
          <div>Deliverable</div>
        </div>
      </foreignObject>
    </g>

    <g id="ElementSelected" transform="translate(12, 528)" class="undefined element selected">
      <rect width="168" height="60" />
      <use xlink:href="#ExperimentIcon" x="168" y="0" />
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
          <div>Selected</div>
          <div class="elementType">type</div>
        </div>
      </foreignObject>
    </g>

    <g id="ElementWithChild" transform="translate(372, 528)" class="undefined element">
      <rect width="168" height="60" />
      <use xlink:href="#ExperimentIcon" x="168" y="0" />
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

    <g id="ElementLastSelected" transform="translate(192, 528)" class="undefined element selected lastSelection">
      <rect width="168" height="60" />
      <use xlink:href="#ExperimentIcon" x="168" y="0" />
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
          <div>Selected, LastSelection</div>
          <div class="elementType">type</div>
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
      <path d="M 70 10 h 150" class="Composition Relationship" />

      <text x="0" y="25" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="flow">Aggregation</text>
      <path d="M 70 25 h 150" class="Aggregation Relationship" />

      <text x="0" y="40" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="flow">Triggering</text>
      <path d="M 70 40 h 150" class="Triggering Relationship" />

      <text x="0" y="55" fill="#000000" font-family="Helvetica" font-size="11px"
        text-anchor="flow">Specialization</text>
      <path d="M 70 55 h 150" class="Specialization Relationship" />

      <text x="0" y="70" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="flow">Access</text>
      <path d="M 70 70 h 150" class="Access Relationship Read Write" />

      <text x="0" y="85" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="flow">Realization</text>
      <path d="M 70 85 h 150" class="Realization Relationship" />

      <text x="0" y="100" fill="#000000" font-family="Helvetica" font-size="11px"
        text-anchor="flow">Aggregation</text>
      <path d="M 70 100 h 150" class="Flow Relationship" />

      <text x="0" y="115" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="flow">Assignment</text>
      <path d="M 70 115 h 150" class="Assignment Relationship" />

      <text x="0" y="130" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="flow">Serving</text>
      <path d="M 70 130 h 150" class="Serving Relationship" />

      <text x="0" y="145" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="flow">Influence</text>
      <path d="M 70 145 h 150" class="Influence Relationship" />
      <text x="200" y="140" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="middle">+/-</text>

      <path fill="none" d="M20,160 v20 q0,10,10,10 h 40" stroke="black" />
      <path fill="none" d="M40,160 v25 a20,10,0,0,0,0,10 v 20" stroke="black" />

      <g class="con selected">
        <path d="M 0 240 L 200 240 " class="Assignment Relationship"></path>
        <path d="M 0 240 L 200 240 " class="RelationshipDetect"></path>
        <foreignObject x="20" y="220" width="160px" height="40px">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <div>Line Text</div>
          </div>
        </foreignObject>
        <circle cx="0" cy="240" r="3"></circle>
        <circle cx="200" cy="240" r="3"></circle>
        <circle cx="100" cy="240" r="2"></circle>
      </g>
      <g class="con highlight">
        <path d="M 0 255 L 200 255 " class="Assignment Relationship"></path>
        <path d="M 0 255 L 200 255 " class="RelationshipDetect"></path>
        <foreignObject x="20" y="235" width="160px" height="40px">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <div>Highlight</div>
          </div>
        </foreignObject>
      </g>
    </g>
  </g>
</svg>
`;class Pn{getEmptySvg(){return this.templateDoc.cloneNode(!0)}getElementSelection(t,e){const n=this.elementSelection.cloneNode(!0);return n.childNodes.forEach(s=>{s instanceof SVGCircleElement&&(s.cx.baseVal.value===168?s.cx.baseVal.value=t:s.cx.baseVal.value===168/2&&(s.cx.baseVal.value=t/2),s.cy.baseVal.value===60?s.cy.baseVal.value=e:s.cy.baseVal.value===60/2&&(s.cy.baseVal.value=e/2))}),n}getElementByType(t,e){const n=t.entityType;let s=this.createCloneOfType(n);const{width:i,height:l}=e;if(n=="Value"&&(s=s.replace('ellipse cx="84" cy="30" rx="84" ry="30"',`ellipse cx="${i/2}" cy="${l/2}" rx="${i/2}" ry="${l/2}"`)),s=s.replace(/(?<!\d)168(?!\d)/g,`${i}`),s=s.replace(/(?<!\d)152(?!\d)/g,`${i-16}`),s=s.replace(/(?<!\d)52(?!\d)/g,`${l-8}`),s=s.replace(/(?<!\d)44(?!\d)/g,`${l-16}`),s=s.replace(/(?<!\d)160(?!\d)/g,`${i-8}`),s=s.replace(/(?<!\d)60(?!\d)/g,`${l}`),s=s.replace(/(?<!\d)84(?!\d)/g,`${i/2}`),(n==="Grouping"||n==="Group")&&(s=s.replace(/(?<!\d)156(?!\d)/g,`${i-12}`)),n==="Junction"){t.element.getAttribute("type")==="or"&&(s=s.replace("class='","class='or "));const d=+(i/2).toFixed(2);s=s.replace('cx="5" cy="5" rx="5" ry="5"',`cx='${d}' cy='${d}' rx='${d}' ry='${d}'`)}return new DOMParser().parseFromString(s,"text/xml").firstChild}createCloneOfType(t){const e=this.elementByType;let n=s(t);if(n!=null)return n;if((t.startsWith("Technology")||t.startsWith("Application"))&&(n=s(t.replace(/Technology|Application/,"Business")),n!=null))return n.replace("business",t.startsWith("Technology")?"technology":"application");return s("todo");function s(i){var a;const l=(a=e.get(i))==null?void 0:a.cloneNode(!0);return l==null?void 0:l.outerHTML}}static getFromDrawing(){const t=new Pn,e=new DOMParser;t.templateDoc=e.parseFromString(Vo,"application/xml");const n=t.templateDoc.getElementById("Content");t.elementSelection=n.querySelector("g#ElementSelected>g.selection");const s=Array.from(n.querySelectorAll("g.element"));for(t.elementByType=new Map(s.map(i=>[i.id,i]));n.firstChild;)n.removeChild(n.firstChild);return t}}var it=function(r,t){return Number(r.slice(0,-1*t.length))},Yo=function(r){return r.endsWith("px")?{value:r,type:"px",numeric:it(r,"px")}:r.endsWith("fr")?{value:r,type:"fr",numeric:it(r,"fr")}:r.endsWith("%")?{value:r,type:"%",numeric:it(r,"%")}:r==="auto"?{value:r,type:"auto"}:null},nr=function(r){return r.split(" ").map(Yo)},Xo=function(r,t,e,n){e===void 0&&(e=0),n===void 0&&(n=!1);var s=n?r+1:r,i=t.slice(0,s).reduce(function(a,d){return a+d.numeric},0),l=e?r*e:0;return i+l},rr=function(r,t,e){return t.concat(e).map(function(n){return n.style[r]}).filter(function(n){return n!==void 0&&n!==""})},Ko=function(r,t){return t.endsWith(r)?Number(t.slice(0,-1*r.length)):null},Wn=function(r){for(var t=0;t<r.length;t++)if(r[t].numeric>0)return t;return null},Ce=function(){return!1},Jo=function(r,t,e){r.style[t]=e},ae=function(r,t,e){var n=r[t];return n!==void 0?n:e};function ir(r){var t;return(t=[]).concat.apply(t,Array.from(r.ownerDocument.styleSheets).map(function(e){var n=[];try{n=Array.from(e.cssRules||[])}catch{}return n})).filter(function(e){var n=!1;try{n=r.matches(e.selectorText)}catch{}return n})}var Qo="grid-template-columns",ea="grid-template-rows",de=function(t,e,n){this.direction=t,this.element=e.element,this.track=e.track,t==="column"?(this.gridTemplateProp=Qo,this.gridGapProp="grid-column-gap",this.cursor=ae(n,"columnCursor",ae(n,"cursor","col-resize")),this.snapOffset=ae(n,"columnSnapOffset",ae(n,"snapOffset",30)),this.dragInterval=ae(n,"columnDragInterval",ae(n,"dragInterval",1)),this.clientAxis="clientX",this.optionStyle=ae(n,"gridTemplateColumns")):t==="row"&&(this.gridTemplateProp=ea,this.gridGapProp="grid-row-gap",this.cursor=ae(n,"rowCursor",ae(n,"cursor","row-resize")),this.snapOffset=ae(n,"rowSnapOffset",ae(n,"snapOffset",30)),this.dragInterval=ae(n,"rowDragInterval",ae(n,"dragInterval",1)),this.clientAxis="clientY",this.optionStyle=ae(n,"gridTemplateRows")),this.onDragStart=ae(n,"onDragStart",Ce),this.onDragEnd=ae(n,"onDragEnd",Ce),this.onDrag=ae(n,"onDrag",Ce),this.writeStyle=ae(n,"writeStyle",Jo),this.startDragging=this.startDragging.bind(this),this.stopDragging=this.stopDragging.bind(this),this.drag=this.drag.bind(this),this.minSizeStart=e.minSizeStart,this.minSizeEnd=e.minSizeEnd,e.element&&(this.element.addEventListener("mousedown",this.startDragging),this.element.addEventListener("touchstart",this.startDragging))};de.prototype.getDimensions=function(){var t=this.grid.getBoundingClientRect(),e=t.width,n=t.height,s=t.top,i=t.bottom,l=t.left,a=t.right;this.direction==="column"?(this.start=s,this.end=i,this.size=n):this.direction==="row"&&(this.start=l,this.end=a,this.size=e)};de.prototype.getSizeAtTrack=function(t,e){return Xo(t,this.computedPixels,this.computedGapPixels,e)};de.prototype.getSizeOfTrack=function(t){return this.computedPixels[t].numeric};de.prototype.getRawTracks=function(){var t=rr(this.gridTemplateProp,[this.grid],ir(this.grid));if(!t.length){if(this.optionStyle)return this.optionStyle;throw Error("Unable to determine grid template tracks from styles.")}return t[0]};de.prototype.getGap=function(){var t=rr(this.gridGapProp,[this.grid],ir(this.grid));return t.length?t[0]:null};de.prototype.getRawComputedTracks=function(){return window.getComputedStyle(this.grid)[this.gridTemplateProp]};de.prototype.getRawComputedGap=function(){return window.getComputedStyle(this.grid)[this.gridGapProp]};de.prototype.setTracks=function(t){this.tracks=t.split(" "),this.trackValues=nr(t)};de.prototype.setComputedTracks=function(t){this.computedTracks=t.split(" "),this.computedPixels=nr(t)};de.prototype.setGap=function(t){this.gap=t};de.prototype.setComputedGap=function(t){this.computedGap=t,this.computedGapPixels=Ko("px",this.computedGap)||0};de.prototype.getMousePosition=function(t){return"touches"in t?t.touches[0][this.clientAxis]:t[this.clientAxis]};de.prototype.startDragging=function(t){if(!("button"in t&&t.button!==0)){t.preventDefault(),this.element?this.grid=this.element.parentNode:this.grid=t.target.parentNode,this.getDimensions(),this.setTracks(this.getRawTracks()),this.setComputedTracks(this.getRawComputedTracks()),this.setGap(this.getGap()),this.setComputedGap(this.getRawComputedGap());var e=this.trackValues.filter(function(a){return a.type==="%"}),n=this.trackValues.filter(function(a){return a.type==="fr"});if(this.totalFrs=n.length,this.totalFrs){var s=Wn(n);s!==null&&(this.frToPixels=this.computedPixels[s].numeric/n[s].numeric)}if(e.length){var i=Wn(e);i!==null&&(this.percentageToPixels=this.computedPixels[i].numeric/e[i].numeric)}var l=this.getSizeAtTrack(this.track,!1)+this.start;if(this.dragStartOffset=this.getMousePosition(t)-l,this.aTrack=this.track-1,this.track<this.tracks.length-1)this.bTrack=this.track+1;else throw Error("Invalid track index: "+this.track+". Track must be between two other tracks and only "+this.tracks.length+" tracks were found.");this.aTrackStart=this.getSizeAtTrack(this.aTrack,!1)+this.start,this.bTrackEnd=this.getSizeAtTrack(this.bTrack,!0)+this.start,this.dragging=!0,window.addEventListener("mouseup",this.stopDragging),window.addEventListener("touchend",this.stopDragging),window.addEventListener("touchcancel",this.stopDragging),window.addEventListener("mousemove",this.drag),window.addEventListener("touchmove",this.drag),this.grid.addEventListener("selectstart",Ce),this.grid.addEventListener("dragstart",Ce),this.grid.style.userSelect="none",this.grid.style.webkitUserSelect="none",this.grid.style.MozUserSelect="none",this.grid.style.pointerEvents="none",this.grid.style.cursor=this.cursor,window.document.body.style.cursor=this.cursor,this.onDragStart(this.direction,this.track)}};de.prototype.stopDragging=function(){this.dragging=!1,this.cleanup(),this.onDragEnd(this.direction,this.track),this.needsDestroy&&(this.element&&(this.element.removeEventListener("mousedown",this.startDragging),this.element.removeEventListener("touchstart",this.startDragging)),this.destroyCb(),this.needsDestroy=!1,this.destroyCb=null)};de.prototype.drag=function(t){var e=this.getMousePosition(t),n=this.getSizeOfTrack(this.track),s=this.aTrackStart+this.minSizeStart+this.dragStartOffset+this.computedGapPixels,i=this.bTrackEnd-this.minSizeEnd-this.computedGapPixels-(n-this.dragStartOffset),l=s+this.snapOffset,a=i-this.snapOffset;e<l&&(e=s),e>a&&(e=i),e<s?e=s:e>i&&(e=i);var d=e-this.aTrackStart-this.dragStartOffset-this.computedGapPixels,v=this.bTrackEnd-e+this.dragStartOffset-n-this.computedGapPixels;if(this.dragInterval>1){var u=Math.round(d/this.dragInterval)*this.dragInterval;v-=u-d,d=u}if(d<this.minSizeStart&&(d=this.minSizeStart),v<this.minSizeEnd&&(v=this.minSizeEnd),this.trackValues[this.aTrack].type==="px")this.tracks[this.aTrack]=d+"px";else if(this.trackValues[this.aTrack].type==="fr")if(this.totalFrs===1)this.tracks[this.aTrack]="1fr";else{var x=d/this.frToPixels;this.tracks[this.aTrack]=x+"fr"}else if(this.trackValues[this.aTrack].type==="%"){var w=d/this.percentageToPixels;this.tracks[this.aTrack]=w+"%"}if(this.trackValues[this.bTrack].type==="px")this.tracks[this.bTrack]=v+"px";else if(this.trackValues[this.bTrack].type==="fr")if(this.totalFrs===1)this.tracks[this.bTrack]="1fr";else{var h=v/this.frToPixels;this.tracks[this.bTrack]=h+"fr"}else if(this.trackValues[this.bTrack].type==="%"){var m=v/this.percentageToPixels;this.tracks[this.bTrack]=m+"%"}var b=this.tracks.join(" ");this.writeStyle(this.grid,this.gridTemplateProp,b),this.onDrag(this.direction,this.track,b)};de.prototype.cleanup=function(){window.removeEventListener("mouseup",this.stopDragging),window.removeEventListener("touchend",this.stopDragging),window.removeEventListener("touchcancel",this.stopDragging),window.removeEventListener("mousemove",this.drag),window.removeEventListener("touchmove",this.drag),this.grid&&(this.grid.removeEventListener("selectstart",Ce),this.grid.removeEventListener("dragstart",Ce),this.grid.style.userSelect="",this.grid.style.webkitUserSelect="",this.grid.style.MozUserSelect="",this.grid.style.pointerEvents="",this.grid.style.cursor=""),window.document.body.style.cursor=""};de.prototype.destroy=function(t,e){t===void 0&&(t=!0),t||this.dragging===!1?(this.cleanup(),this.element&&(this.element.removeEventListener("mousedown",this.startDragging),this.element.removeEventListener("touchstart",this.startDragging)),e&&e()):(this.needsDestroy=!0,e&&(this.destroyCb=e))};var Un=function(r,t,e){return t in r?r[t]:e},ze=function(r,t){return function(e){if(e.track<1)throw Error("Invalid track index: "+e.track+". Track must be between two other tracks.");var n=r==="column"?t.columnMinSizes||{}:t.rowMinSizes||{},s=r==="column"?"columnMinSize":"rowMinSize";return new de(r,Object.assign({},{minSizeStart:Un(n,e.track-1,ae(t,s,ae(t,"minSize",0))),minSizeEnd:Un(n,e.track+1,ae(t,s,ae(t,"minSize",0)))},e),t)}},Ee=function(t){var e=this;this.columnGutters={},this.rowGutters={},this.options=Object.assign({},{columnGutters:t.columnGutters||[],rowGutters:t.rowGutters||[],columnMinSizes:t.columnMinSizes||{},rowMinSizes:t.rowMinSizes||{}},t),this.options.columnGutters.forEach(function(n){e.columnGutters[n.track]=ze("column",e.options)(n)}),this.options.rowGutters.forEach(function(n){e.rowGutters[n.track]=ze("row",e.options)(n)})};Ee.prototype.addColumnGutter=function(t,e){this.columnGutters[e]&&this.columnGutters[e].destroy(),this.columnGutters[e]=ze("column",this.options)({element:t,track:e})};Ee.prototype.addRowGutter=function(t,e){this.rowGutters[e]&&this.rowGutters[e].destroy(),this.rowGutters[e]=ze("row",this.options)({element:t,track:e})};Ee.prototype.removeColumnGutter=function(t,e){var n=this;e===void 0&&(e=!0),this.columnGutters[t]&&this.columnGutters[t].destroy(e,function(){delete n.columnGutters[t]})};Ee.prototype.removeRowGutter=function(t,e){var n=this;e===void 0&&(e=!0),this.rowGutters[t]&&this.rowGutters[t].destroy(e,function(){delete n.rowGutters[t]})};Ee.prototype.handleDragStart=function(t,e,n){e==="column"?(this.columnGutters[n]&&this.columnGutters[n].destroy(),this.columnGutters[n]=ze("column",this.options)({track:n}),this.columnGutters[n].startDragging(t)):e==="row"&&(this.rowGutters[n]&&this.rowGutters[n].destroy(),this.rowGutters[n]=ze("row",this.options)({track:n}),this.rowGutters[n].startDragging(t))};Ee.prototype.destroy=function(t){var e=this;t===void 0&&(t=!0),Object.keys(this.columnGutters).forEach(function(n){return e.columnGutters[n].destroy(t,function(){delete e.columnGutters[n]})}),Object.keys(this.rowGutters).forEach(function(n){return e.rowGutters[n].destroy(t,function(){delete e.rowGutters[n]})})};function ta(r){return new Ee(r)}var Le,oe,sr,or,Be,ar,Gn,lr,Xe={},cr=[],na=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function Se(r,t){for(var e in t)r[e]=t[e];return r}function hr(r){var t=r.parentNode;t&&t.removeChild(r)}function at(r,t,e){var n,s,i,l={};for(i in t)i=="key"?n=t[i]:i=="ref"?s=t[i]:l[i]=t[i];if(arguments.length>2&&(l.children=arguments.length>3?Le.call(arguments,2):e),typeof r=="function"&&r.defaultProps!=null)for(i in r.defaultProps)l[i]===void 0&&(l[i]=r.defaultProps[i]);return Ne(r,l,n,s,null)}function Ne(r,t,e,n,s){var i={type:r,props:t,key:e,ref:n,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:s==null?++sr:s};return oe.vnode!=null&&oe.vnode(i),i}function ra(){return{current:null}}function We(r){return r.children}function Ie(r,t){this.props=r,this.context=t}function Me(r,t){if(t==null)return r.__?Me(r.__,r.__.__k.indexOf(r)+1):null;for(var e;t<r.__k.length;t++)if((e=r.__k[t])!=null&&e.__e!=null)return e.__e;return typeof r.type=="function"?Me(r):null}function ur(r){var t,e;if((r=r.__)!=null&&r.__c!=null){for(r.__e=r.__c.base=null,t=0;t<r.__k.length;t++)if((e=r.__k[t])!=null&&e.__e!=null){r.__e=r.__c.base=e.__e;break}return ur(r)}}function lt(r){(!r.__d&&(r.__d=!0)&&Be.push(r)&&!Ke.__r++||Gn!==oe.debounceRendering)&&((Gn=oe.debounceRendering)||ar)(Ke)}function Ke(){for(var r;Ke.__r=Be.length;)r=Be.sort(function(t,e){return t.__v.__b-e.__v.__b}),Be=[],r.some(function(t){var e,n,s,i,l,a;t.__d&&(l=(i=(e=t).__v).__e,(a=e.__P)&&(n=[],(s=Se({},i)).__v=i.__v+1,Tn(a,i,s,e.__n,a.ownerSVGElement!==void 0,i.__h!=null?[l]:null,n,l==null?Me(i):l,i.__h),mr(n,i),i.__e!=l&&ur(i)))})}function dr(r,t,e,n,s,i,l,a,d,v){var u,x,w,h,m,b,f,p=n&&n.__k||cr,y=p.length;for(e.__k=[],u=0;u<t.length;u++)if((h=e.__k[u]=(h=t[u])==null||typeof h=="boolean"?null:typeof h=="string"||typeof h=="number"||typeof h=="bigint"?Ne(null,h,null,null,h):Array.isArray(h)?Ne(We,{children:h},null,null,null):h.__b>0?Ne(h.type,h.props,h.key,null,h.__v):h)!=null){if(h.__=e,h.__b=e.__b+1,(w=p[u])===null||w&&h.key==w.key&&h.type===w.type)p[u]=void 0;else for(x=0;x<y;x++){if((w=p[x])&&h.key==w.key&&h.type===w.type){p[x]=void 0;break}w=null}Tn(r,h,w=w||Xe,s,i,l,a,d,v),m=h.__e,(x=h.ref)&&w.ref!=x&&(f||(f=[]),w.ref&&f.push(w.ref,null,h),f.push(x,h.__c||m,h)),m!=null?(b==null&&(b=m),typeof h.type=="function"&&h.__k!=null&&h.__k===w.__k?h.__d=d=fr(h,d,r):d=gr(r,h,w,p,m,d),v||e.type!=="option"?typeof e.type=="function"&&(e.__d=d):r.value=""):d&&w.__e==d&&d.parentNode!=r&&(d=Me(w))}for(e.__e=b,u=y;u--;)p[u]!=null&&(typeof e.type=="function"&&p[u].__e!=null&&p[u].__e==e.__d&&(e.__d=Me(n,u+1)),yr(p[u],p[u]));if(f)for(u=0;u<f.length;u++)vr(f[u],f[++u],f[++u])}function fr(r,t,e){var n,s;for(n=0;n<r.__k.length;n++)(s=r.__k[n])&&(s.__=r,t=typeof s.type=="function"?fr(s,t,e):gr(e,s,s,r.__k,s.__e,t));return t}function pr(r,t){return t=t||[],r==null||typeof r=="boolean"||(Array.isArray(r)?r.some(function(e){pr(e,t)}):t.push(r)),t}function gr(r,t,e,n,s,i){var l,a,d;if(t.__d!==void 0)l=t.__d,t.__d=void 0;else if(e==null||s!=i||s.parentNode==null)e:if(i==null||i.parentNode!==r)r.appendChild(s),l=null;else{for(a=i,d=0;(a=a.nextSibling)&&d<n.length;d+=2)if(a==s)break e;r.insertBefore(s,i),l=i}return l!==void 0?l:s.nextSibling}function ia(r,t,e,n,s){var i;for(i in e)i==="children"||i==="key"||i in t||Je(r,i,null,e[i],n);for(i in t)s&&typeof t[i]!="function"||i==="children"||i==="key"||i==="value"||i==="checked"||e[i]===t[i]||Je(r,i,t[i],e[i],n)}function qn(r,t,e){t[0]==="-"?r.setProperty(t,e):r[t]=e==null?"":typeof e!="number"||na.test(t)?e:e+"px"}function Je(r,t,e,n,s){var i;e:if(t==="style")if(typeof e=="string")r.style.cssText=e;else{if(typeof n=="string"&&(r.style.cssText=n=""),n)for(t in n)e&&t in e||qn(r.style,t,"");if(e)for(t in e)n&&e[t]===n[t]||qn(r.style,t,e[t])}else if(t[0]==="o"&&t[1]==="n")i=t!==(t=t.replace(/Capture$/,"")),t=t.toLowerCase()in r?t.toLowerCase().slice(2):t.slice(2),r.l||(r.l={}),r.l[t+i]=e,e?n||r.addEventListener(t,i?$n:Zn,i):r.removeEventListener(t,i?$n:Zn,i);else if(t!=="dangerouslySetInnerHTML"){if(s)t=t.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if(t!=="href"&&t!=="list"&&t!=="form"&&t!=="tabIndex"&&t!=="download"&&t in r)try{r[t]=e==null?"":e;break e}catch{}typeof e=="function"||(e!=null&&(e!==!1||t[0]==="a"&&t[1]==="r")?r.setAttribute(t,e):r.removeAttribute(t))}}function Zn(r){this.l[r.type+!1](oe.event?oe.event(r):r)}function $n(r){this.l[r.type+!0](oe.event?oe.event(r):r)}function Tn(r,t,e,n,s,i,l,a,d){var v,u,x,w,h,m,b,f,p,y,S,P=t.type;if(t.constructor!==void 0)return null;e.__h!=null&&(d=e.__h,a=t.__e=e.__e,t.__h=null,i=[a]),(v=oe.__b)&&v(t);try{e:if(typeof P=="function"){if(f=t.props,p=(v=P.contextType)&&n[v.__c],y=v?p?p.props.value:v.__:n,e.__c?b=(u=t.__c=e.__c).__=u.__E:("prototype"in P&&P.prototype.render?t.__c=u=new P(f,y):(t.__c=u=new Ie(f,y),u.constructor=P,u.render=oa),p&&p.sub(u),u.props=f,u.state||(u.state={}),u.context=y,u.__n=n,x=u.__d=!0,u.__h=[]),u.__s==null&&(u.__s=u.state),P.getDerivedStateFromProps!=null&&(u.__s==u.state&&(u.__s=Se({},u.__s)),Se(u.__s,P.getDerivedStateFromProps(f,u.__s))),w=u.props,h=u.state,x)P.getDerivedStateFromProps==null&&u.componentWillMount!=null&&u.componentWillMount(),u.componentDidMount!=null&&u.__h.push(u.componentDidMount);else{if(P.getDerivedStateFromProps==null&&f!==w&&u.componentWillReceiveProps!=null&&u.componentWillReceiveProps(f,y),!u.__e&&u.shouldComponentUpdate!=null&&u.shouldComponentUpdate(f,u.__s,y)===!1||t.__v===e.__v){u.props=f,u.state=u.__s,t.__v!==e.__v&&(u.__d=!1),u.__v=t,t.__e=e.__e,t.__k=e.__k,t.__k.forEach(function(E){E&&(E.__=t)}),u.__h.length&&l.push(u);break e}u.componentWillUpdate!=null&&u.componentWillUpdate(f,u.__s,y),u.componentDidUpdate!=null&&u.__h.push(function(){u.componentDidUpdate(w,h,m)})}u.context=y,u.props=f,u.state=u.__s,(v=oe.__r)&&v(t),u.__d=!1,u.__v=t,u.__P=r,v=u.render(u.props,u.state,u.context),u.state=u.__s,u.getChildContext!=null&&(n=Se(Se({},n),u.getChildContext())),x||u.getSnapshotBeforeUpdate==null||(m=u.getSnapshotBeforeUpdate(w,h)),S=v!=null&&v.type===We&&v.key==null?v.props.children:v,dr(r,Array.isArray(S)?S:[S],t,e,n,s,i,l,a,d),u.base=t.__e,t.__h=null,u.__h.length&&l.push(u),b&&(u.__E=u.__=null),u.__e=!1}else i==null&&t.__v===e.__v?(t.__k=e.__k,t.__e=e.__e):t.__e=sa(e.__e,t,e,n,s,i,l,d);(v=oe.diffed)&&v(t)}catch(E){t.__v=null,(d||i!=null)&&(t.__e=a,t.__h=!!d,i[i.indexOf(a)]=null),oe.__e(E,t,e)}}function mr(r,t){oe.__c&&oe.__c(t,r),r.some(function(e){try{r=e.__h,e.__h=[],r.some(function(n){n.call(e)})}catch(n){oe.__e(n,e.__v)}})}function sa(r,t,e,n,s,i,l,a){var d,v,u,x=e.props,w=t.props,h=t.type,m=0;if(h==="svg"&&(s=!0),i!=null){for(;m<i.length;m++)if((d=i[m])&&(d===r||(h?d.localName==h:d.nodeType==3))){r=d,i[m]=null;break}}if(r==null){if(h===null)return document.createTextNode(w);r=s?document.createElementNS("http://www.w3.org/2000/svg",h):document.createElement(h,w.is&&w),i=null,a=!1}if(h===null)x===w||a&&r.data===w||(r.data=w);else{if(i=i&&Le.call(r.childNodes),v=(x=e.props||Xe).dangerouslySetInnerHTML,u=w.dangerouslySetInnerHTML,!a){if(i!=null)for(x={},m=0;m<r.attributes.length;m++)x[r.attributes[m].name]=r.attributes[m].value;(u||v)&&(u&&(v&&u.__html==v.__html||u.__html===r.innerHTML)||(r.innerHTML=u&&u.__html||""))}if(ia(r,w,x,s,a),u)t.__k=[];else if(m=t.props.children,dr(r,Array.isArray(m)?m:[m],t,e,n,s&&h!=="foreignObject",i,l,i?i[0]:e.__k&&Me(e,0),a),i!=null)for(m=i.length;m--;)i[m]!=null&&hr(i[m]);a||("value"in w&&(m=w.value)!==void 0&&(m!==r.value||h==="progress"&&!m)&&Je(r,"value",m,x.value,!1),"checked"in w&&(m=w.checked)!==void 0&&m!==r.checked&&Je(r,"checked",m,x.checked,!1))}return r}function vr(r,t,e){try{typeof r=="function"?r(t):r.current=t}catch(n){oe.__e(n,e)}}function yr(r,t,e){var n,s;if(oe.unmount&&oe.unmount(r),(n=r.ref)&&(n.current&&n.current!==r.__e||vr(n,null,t)),(n=r.__c)!=null){if(n.componentWillUnmount)try{n.componentWillUnmount()}catch(i){oe.__e(i,t)}n.base=n.__P=null}if(n=r.__k)for(s=0;s<n.length;s++)n[s]&&yr(n[s],t,typeof r.type!="function");e||r.__e==null||hr(r.__e),r.__e=r.__d=void 0}function oa(r,t,e){return this.constructor(r,e)}function Dn(r,t,e){var n,s,i;oe.__&&oe.__(r,t),s=(n=typeof e=="function")?null:e&&e.__k||t.__k,i=[],Tn(t,r=(!n&&e||t).__k=at(We,null,[r]),s||Xe,Xe,t.ownerSVGElement!==void 0,!n&&e?[e]:s?null:t.firstChild?Le.call(t.childNodes):null,i,!n&&e?e:s?s.__e:t.firstChild,n),mr(i,r)}function _r(r,t){Dn(r,t,_r)}function aa(r,t,e){var n,s,i,l=Se({},r.props);for(i in t)i=="key"?n=t[i]:i=="ref"?s=t[i]:l[i]=t[i];return arguments.length>2&&(l.children=arguments.length>3?Le.call(arguments,2):e),Ne(r.type,l,n||r.key,s||r.ref,null)}function la(r,t){var e={__c:t="__cC"+lr++,__:r,Consumer:function(n,s){return n.children(s)},Provider:function(n){var s,i;return this.getChildContext||(s=[],(i={})[t]=this,this.getChildContext=function(){return i},this.shouldComponentUpdate=function(l){this.props.value!==l.value&&s.some(lt)},this.sub=function(l){s.push(l);var a=l.componentWillUnmount;l.componentWillUnmount=function(){s.splice(s.indexOf(l),1),a&&a.call(l)}}),n.children}};return e.Provider.__=e.Consumer.contextType=e}Le=cr.slice,oe={__e:function(r,t){for(var e,n,s;t=t.__;)if((e=t.__c)&&!e.__)try{if((n=e.constructor)&&n.getDerivedStateFromError!=null&&(e.setState(n.getDerivedStateFromError(r)),s=e.__d),e.componentDidCatch!=null&&(e.componentDidCatch(r),s=e.__d),s)return e.__E=e}catch(i){r=i}throw r}},sr=0,or=function(r){return r!=null&&r.constructor===void 0},Ie.prototype.setState=function(r,t){var e;e=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=Se({},this.state),typeof r=="function"&&(r=r(Se({},e),this.props)),r&&Se(e,r),r!=null&&this.__v&&(t&&this.__h.push(t),lt(this))},Ie.prototype.forceUpdate=function(r){this.__v&&(this.__e=!0,r&&this.__h.push(r),lt(this))},Ie.prototype.render=We,Be=[],ar=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,Ke.__r=0,lr=0;var ca=Object.freeze(Object.defineProperty({__proto__:null,render:Dn,hydrate:_r,createElement:at,h:at,Fragment:We,createRef:ra,get isValidElement(){return or},Component:Ie,cloneElement:aa,createContext:la,toChildArray:pr,get options(){return oe}},Symbol.toStringTag,{value:"Module"})),ha=Ir(ca),xr,wr,Hn=ha,ua=0;function Vn(r,t,e,n,s){var i,l,a={};for(l in t)l=="ref"?i=t[l]:a[l]=t[l];var d={type:r,props:a,key:e,ref:i,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:--ua,__source:n,__self:s};if(typeof r=="function"&&(i=r.defaultProps))for(l in i)a[l]===void 0&&(a[l]=i[l]);return Hn.options.vnode&&Hn.options.vnode(d),d}wr=Vn,xr=Vn;const $e=wr,da=xr;class fa extends Ie{constructor(t){super(t)}toggleFolder(t){const e=t.target;e.parentElement.querySelector(".nested").classList.toggle("active"),e.classList.toggle("caret-down")}render(){return this.renderChildren(Array.from(this.props.views.children))}renderChildren(t){return t.map(e=>e.nodeName=="folder"?this.renderFolder(e):this.renderDiagramElement(e))}renderFolder(t){return da("li",{children:[$e("span",{onClick:this.toggleFolder,class:"caret",children:t.getAttribute("name")}),$e("ul",{class:"nested",children:this.renderChildren(Array.from(t.children))})]})}renderDiagramElement(t){const e=t.getAttribute("id"),n=e==this.props.active?"active":"";return $e("li",{"data-id":e,class:n,onClick:s=>this.onDiagramClick(s),children:t.getAttribute("name")})}onDiagramClick(t){var s,i;const e=t.target,n=e.getAttribute("data-id");!n||((i=(s=this.base.parentElement.querySelector("li.active"))==null?void 0:s.classList)==null||i.remove("active"),e.classList.toggle("active"),this.props.active=n,this.props.onDiagramSelected(n))}}const jn=window.my={uploadFile:ya,save:va};ta({columnGutters:[{track:1,element:document.querySelector(".vertical-gutter")}]});const Yn=document.getElementById("svgTarget"),pa=Pn.getFromDrawing();async function ga(){var n;const r=await Re.GetDefaultProject(),t=window.location.hash.slice(1),e=parseInt(t)?r.diagrams[parseInt(t)]:(n=r.diagrams.filter(s=>s.name===t)[0])!=null?n:r.diagrams[0];br(r,e)}async function ma(r){var n;const t=jn.project,e=(n=t.diagrams.filter(s=>s.Id===r)[0])!=null?n:t.diagrams[0];kr(t,e)}function va(){const r=jn.project,t=new Blob([new XMLSerializer().serializeToString(r.element.ownerDocument)],{type:"text/xml;charset=utf-8"}),e=document.createElement("a"),n=URL.createObjectURL(t);e.href=n,e.download="test.xml",document.body.appendChild(e),e.click(),setTimeout(function(){document.body.removeChild(e),window.URL.revokeObjectURL(n)},0)}async function br(r,t){jn.project=r;const e=document.getElementById("diagramTree"),n=r.element.querySelector('folder[name="Views"]');Dn($e(fa,{views:n,active:t.Id,onDiagramSelected:ma}),e,e),kr(r,t)}async function kr(r,t){const e=new ye(r,t,pa),n=e.buildSvg();Yn.innerHTML="";const s=Yn.appendChild(n.firstChild);new Ho(s,r,t,e).makeDraggable()}async function ya(){const r=document.getElementById("fileUpload"),t=new FileReader;t.readAsArrayBuffer(r.files[0]),t.onload=async function(){const e=await Re.GetProjectFromArrayBuffer(t.result);br(e,e.diagrams[0])},t.onerror=function(){console.log(t.error)}}ga();
