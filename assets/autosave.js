/* Ace Lessons autosave: saves every input/select/textarea to localStorage and
   restores on load. Include just before </body>, AFTER the page's own scripts:
   <script src="../../assets/autosave.js"></script> */
(function(){
  var PREFIX="ace-autosave:"+location.pathname+"|";
  var ls; try{ls=window.localStorage;ls.setItem("__t","1");ls.removeItem("__t");}catch(e){return;}
  var SEL="input,select,textarea";
  function skip(el){var t=(el.type||"").toLowerCase();
    return ["button","submit","reset","file","hidden","image","password"].indexOf(t)>=0||el.hasAttribute("data-no-autosave");}
  function all(){return Array.prototype.filter.call(document.querySelectorAll(SEL),function(e){return !skip(e);});}
  function ident(el){
    var t=(el.type||"").toLowerCase();
    if(t==="radio"&&el.name) return "radio:"+el.name;
    if(el.id) return "id:"+el.id;
    if(el.name&&document.getElementsByName(el.name).length===1) return "name:"+el.name;
    return "idx:"+all().indexOf(el);
  }
  function radioVal(el){var g=document.getElementsByName(el.name);for(var i=0;i<g.length;i++)if(g[i]===el)return el.value+"#"+i;return el.value;}
  function save(el){
    var t=(el.type||"").toLowerCase(),k=PREFIX+ident(el);
    try{
      if(t==="radio"){ if(el.name){ if(el.checked) ls.setItem(k,radioVal(el)); } else ls.setItem(k,el.checked?"1":"0"); }
      else if(t==="checkbox") ls.setItem(k,el.checked?"1":"0");
      else if(el.multiple&&el.tagName==="SELECT") ls.setItem(k,JSON.stringify(Array.prototype.map.call(el.selectedOptions,function(o){return o.value;})));
      else ls.setItem(k,el.value);
    }catch(e){}
  }
  function fire(el,type){try{el.dispatchEvent(new Event(type,{bubbles:true}));}catch(e){}}
  var restored={};
  function restore(el){
    if(restored[ident(el)+"@"+all().indexOf(el)])return;
    var t=(el.type||"").toLowerCase(),id=ident(el),v=ls.getItem(PREFIX+id);
    restored[id+"@"+all().indexOf(el)]=1;
    if(v===null)return;
    if(t==="radio"&&el.name){ if(v===radioVal(el)&&!el.checked){el.checked=true;fire(el,"change");} return; }
    if(t==="checkbox"||t==="radio"){var c=v==="1";if(el.checked!==c){el.checked=c;fire(el,"change");}return;}
    if(el.multiple&&el.tagName==="SELECT"){try{var a=JSON.parse(v);Array.prototype.forEach.call(el.options,function(o){o.selected=a.indexOf(o.value)>=0;});fire(el,"change");}catch(e){}return;}
    if(el.value!==v){el.value=v;fire(el,"input");fire(el,"change");}
  }
  // indicator
  var ind=document.createElement("div");
  ind.setAttribute("aria-live","polite");ind.id="aceSavedIndicator";
  ind.style.cssText="position:fixed;right:10px;bottom:10px;padding:3px 10px;border-radius:12px;background:rgba(46,125,50,.85);color:#fff;font:12px/1.6 sans-serif;opacity:0;transition:opacity .4s;pointer-events:none;z-index:9999";
  ind.textContent="✓ Saved";
  var timer;
  function flash(txt){ind.textContent=txt||"✓ Saved";ind.style.opacity="1";clearTimeout(timer);timer=setTimeout(function(){ind.style.opacity="0";},1200);}
  var restoring=false;
  function onEv(e){var el=e.target;if(restoring||!el.matches||!el.matches(SEL)||skip(el))return;save(el);flash();}
  document.addEventListener("input",onEv,true);
  document.addEventListener("change",onEv,true);
  function restoreAll(){restoring=true;all().forEach(restore);restoring=false;}
  // Reset/clear buttons: ask before wiping (unless the page already asks), then clear saved values.
  function isReset(b){
    if(!b||b.hasAttribute("data-no-autosave"))return false;
    var s=((b.id||"")+" "+(b.className||"")+" "+(b.textContent||"")).toLowerCase();
    return (b.type||"").toLowerCase()==="reset"||/\b(reset|clear|start over|startover|clearbtn|resetbtn)\b/.test(s)||/clearbtn|resetbtn/.test(s);
  }
  var nativeConfirm=window.confirm,pageAsked=null;
  window.confirm=function(m){var r=nativeConfirm.call(window,m);pageAsked=r;return r;};
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("button,input[type=button],input[type=reset]");
    if(!isReset(b))return;
    pageAsked=null;
    // wait for the page's own handler (bubble phase) to run
    setTimeout(function(){
      if(pageAsked===false)return;
      if(pageAsked===null && b.getAttribute("data-autosave-confirmed")!=="1")return;
      clearSaved();
    },0);
  },true);
  // If a reset button's page handler does NOT confirm, intercept and ask first.
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("button,input[type=button],input[type=reset]");
    if(!isReset(b)||b.hasAttribute("data-page-confirms"))return;
    if(b._aceAsked){return;}
    // probe: does any inline/attached handler call confirm? we can't know, so check source text heuristically
    var src=(b.getAttribute("onclick")||"")+(window.__aceResetSrc||"");
    if(/confirm\(/.test(src)||PAGE_CONFIRMS)return;
    if(!nativeConfirm.call(window,"Erase your answers and start over?")){e.stopImmediatePropagation();e.preventDefault();return;}
    b.setAttribute("data-autosave-confirmed","1");
  },true);
  var PAGE_CONFIRMS=Array.prototype.some.call(document.scripts,function(s){return /confirm\(/.test(s.textContent);});
  function clearSaved(){
    for(var i=ls.length-1;i>=0;i--){var k=ls.key(i);if(k&&k.indexOf(PREFIX)===0)ls.removeItem(k);}
    flash("Cleared");
  }
  window.AceAutosave={clear:clearSaved,restore:restoreAll};
  function init(){document.body.appendChild(ind);restoreAll();
    // fields added later by scripts get restored too
    new MutationObserver(function(){restoring=true;all().forEach(restore);restoring=false;}).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
