import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app');


(function (doc, win) {
	var dpr = window.devicePixelRatio;
	var docEl = doc.documentElement;
	var metaEl = document.querySelector('meta[name="viewport"]');
	if(!metaEl){
		metaEl = document.createElement('meta');
		metaEl.name = "viewport";
		doc.documentElement.firstElementChild.appendChild(metaEl);
	}
	var scale = 1 / dpr;
	var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';  
	var recalc = function () {    
		var clientWidth = window.innerWidth * scale;
		docEl.style.fontSize = 100 * (clientWidth * dpr / 750) + 'px';
		// metaEl.setAttribute('content', 'width=' + clientWidth * dpr + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no'); 
	};    
	if (!doc.addEventListener) return;    
	win.addEventListener(resizeEvt, recalc, false);    
	doc.addEventListener('DOMContentLoaded', recalc, false);    
})(document, window);

