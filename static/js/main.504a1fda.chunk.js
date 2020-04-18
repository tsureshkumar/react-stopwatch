(this["webpackJsonpsk-stopwatch"]=this["webpackJsonpsk-stopwatch"]||[]).push([[0],{50:function(e,t,n){e.exports=n(64)},55:function(e,t,n){},58:function(e,t,n){},64:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(17),s=n.n(c),i=(n(55),n(47)),l=n(36),u=n(82),o=n(86),m=n(88),E=n(89),p=n(31),d=n(83),f=n(37),v=(n(58),n(84)),N=n(87),b=n(44),h=n.n(b),U=n(46),O=n.n(U),g=n(45),k=n.n(g),T=n(43),y=n.n(T),j=u.a(document,"keydown"),C=u.a(document,"keyup");o.a(j,C).pipe(Object(p.a)((function(e){return e})),Object(d.a)());C.pipe(Object(p.a)((function(e){return e}))).subscribe((function(e){console.log(e.type,e.key)}));m.a(300),new E.a;var S,w=function(e){var t=e.timer,n=(e.style,new Date(0));n.setUTCMilliseconds(t);var r=[":",":"];return a.createElement("div",{className:"timer"},a.createElement("div",{className:"hours"},"".concat(("00"+n.getUTCHours()).slice(-2))),a.createElement("div",{className:"sep"},r[0]),a.createElement("div",{className:"minutes"},"".concat(("00"+n.getUTCMinutes()).slice(-2))," "),a.createElement("div",{className:"sep"},r[1]),a.createElement("div",{className:"seconds"},"".concat(("00"+n.getUTCSeconds()).slice(-2))),a.createElement("div",{className:"millis"},"".concat(("0000"+n.getUTCMilliseconds()).slice(-3))))},P=function(e){var t=e.timer,n=(e.style,new Date(0));n.setUTCMilliseconds(t);var r="";return n.getUTCHours()>0&&(r+="".concat(n.getUTCHours()," hours ")),n.getUTCMinutes()>0&&(r+="".concat(n.getUTCMinutes()," mins ")),r+="".concat(n.getUTCSeconds()," secs"),a.createElement("div",{className:"verboseTimer"},r)},D=function(e){var t=e.timer;return"verbose"===e.style?a.createElement(P,{timer:t}):a.createElement(w,{timer:t})},I=function(e){var t=e.lap;return a.createElement("div",null,a.createElement(D,{timer:t.end-t.start}))},R=function(e){var t=e.lap,n=e.idx;return a.createElement("div",{className:"panel"},a.createElement("div",{className:"number"},n+1),a.createElement("div",{className:"time"},a.createElement(D,{timer:t.end-t.start,style:"verbose"})))};function G(){Object(v.a)();var e=Object(a.useState)(0),t=Object(l.a)(e,2),n=t[0],r=t[1],c=Object(a.useState)([]),s=Object(l.a)(c,2),u=s[0],o=s[1],m=function(e,t){var n=Object(a.useState)(S.PAUSED),r=Object(l.a)(n,2),c=r[0],s=r[1],i=Object(a.useRef)((function(e){})),u=Object(a.useRef)(0);return Object(a.useEffect)((function(){i.current=e}),[e]),Object(a.useEffect)((function(){if(t&&i.current&&c==S.RUNNING){var e=setInterval((function(){u.current+=t,i.current(u.current)}),t);return function(){return clearInterval(e)}}}),[t,c]),{status:function(){return c},pause:function(){c===S.PAUSED?s(S.RUNNING):s(S.PAUSED)},stop:function(){return s(S.STOPPED)},start:function(){return s(S.RUNNING)},reset:function(){this.pause(),u.current=0,this.stop(),this.pause()}}}((function(e){r(e)}),300);Object(a.useEffect)((function(){var e=C.pipe(Object(p.a)((function(e){return e}))).subscribe((function(e){switch(e.key){case"n":if(m.status()!==S.RUNNING)break;var t=Object(i.a)(u),a=f.last(t)||{start:-1,end:-1};t.push({start:a.end+1,end:n}),o(t);break;case" ":case"p":m.pause();break;case"s":m.stop();break;case"r":m.reset()}}));return function(){return e.unsubscribe()}}),[n,u,m]);var E=u.map((function(e,t){return a.createElement(a.Fragment,{key:t},a.createElement(R,{lap:e,idx:t}))})),d=a.createElement("div",null);if(0!=u.length){var b=f.last(u)||{start:-1,end:-1};d=a.createElement("div",null,a.createElement(I,{lap:{start:b.end+1,end:n}}))}var U=[];return m.status()!==S.RUNNING&&(m.status()===S.STOPPED?U.push(a.createElement(N.a,{"aria-label":"play/reset"},a.createElement(y.a,{className:"button",onClick:function(){return m.reset()}}))):U.push(a.createElement(N.a,{"aria-label":"play/play"},a.createElement(h.a,{className:"button",onClick:function(){return m.start()}})))),m.status()===S.RUNNING&&U.push(a.createElement(N.a,{"aria-label":"play/pause"},a.createElement(k.a,{className:"button",onClick:function(){return m.pause()}}))),m.status()!==S.STOPPED&&U.push(a.createElement(N.a,{"aria-label":"play/stop"},a.createElement(O.a,{className:"button",onClick:function(){return m.stop()}}))),a.createElement("div",{className:"timerContainer"},a.createElement("div",{className:"controls"},U.map((function(e,t){return a.createElement(a.Fragment,{key:t},e)}))),a.createElement("div",{className:"timerWithLaps"},a.createElement("div",{className:"mainTimer"},a.createElement(D,{timer:n})),0!=u.length&&a.createElement("div",{id:"lapTimer",className:"lapTimer"},a.createElement("div",{className:"title"},"Lap ",u.length," "),a.createElement("div",{className:"content"},d)),a.createElement("div",{className:"lapsContainer"},E)))}!function(e){e[e.RUNNING=1]="RUNNING",e[e.STOPPED=2]="STOPPED",e[e.PAUSED=3]="PAUSED"}(S||(S={}));var M=function(){return a.createElement("div",{className:"App"},a.createElement(G,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(M,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[50,1,2]]]);
//# sourceMappingURL=main.504a1fda.chunk.js.map