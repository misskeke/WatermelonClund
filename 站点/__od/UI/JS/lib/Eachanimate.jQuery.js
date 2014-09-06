/*! Eachanimate_jQueryPlugin
 Author: dorab_org->dorabar->Wangtingmao
 Needed: jQuery jQuery_UI jQuery_Transit(plugin)*/
!function(a){a.fn.eachanimate=function(b,c,d,e,f,g,h){var j,k,l,i=this.toArray();for(f&&i.sort(function(){return Math.random()>.75?-1:1}),j=0;j<i.length;j++)k=j==i.length-1,l=j,function(f,k){setTimeout(function(){var e=a(i[f]);c?e.transit(b,d,g,function(){k&&h.call(a(i))}):e.animate(b,d,g,function(){k&&h.call(a(i))})},j*(0==e?d:e))}(l,k)}}(jQuery);