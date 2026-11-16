/* রাকিব হার্ডওয়্যার অ্যান্ড স্যানিটারি — অ্যাডঅন
   অফলাইন লগইন, গ্রিড থিম, দাম-বাকি, ভয়েসে পণ্য, পুরনো বাকি + কাগজ, কেনার আন্দাজ */
(function(){
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(function(){});
window.PF=0;
var W=0,pend=function(p){return window.OWN?!(p.buy>0&&p.sell>0):!(p.sell>0)};

// ===== অফলাইন লগইন + অনলাইনে ফিরলে অফলাইনের কাজ মেলানো =====
var H=async function(s){return[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('rhs|'+s)))].map(function(b){return b.toString(16).padStart(2,'0')}).join('')};
var CR=function(){try{return JSON.parse(localStorage.rk_cr)||{}}catch(e){return{}}};
function offIn(em){localStorage.rk_off=1;window.OWN=em=='teammrhlive@gmail.com';window.OFFS=1;$('#lo').style.display='none';
 var b=document.querySelector('nav button[data-v=buy]');if(b)b.style.display=window.OWN?'':'none';go(cur);toast('📴 অফলাইন মোডে চলছে')}
var si=Storage.prototype.setItem;
Storage.prototype.setItem=function(k,v){si.call(this,k,v);if(W&&k==K){W=0;setTimeout(rp,50)}};
function rp(){var S;try{S=JSON.parse(localStorage.rk_stash)}catch(e){}if(!S||!S.p)return;
 var has=function(k,id){return D[k].some(function(x){return x.id==id})},np=new Set(),nc=new Set(),n=0,sk=0;
 var cu=function(id){return D.cu.concat(D.su).find(function(c){return c.id==id})};
 S.p.forEach(function(p){if(!has('p',p.id)){D.p.push(p);np.add(p.id)}});
 ['cu','su'].forEach(function(k){S[k].forEach(function(c){if(!has(k,c.id)){D[k].push(c);nc.add(c.id)}})});
 S.bl.forEach(function(b){var o=D.bl.find(function(x){return x.id==b.id});
  if(!o){D.bl.push(b);n++;var c=D.cu.find(function(x){return x.id==b.cid});if(c&&!nc.has(c.id))c.bal+=b.due}
  else if((b.rv||0)>(o.rv||0)){var c2=D.cu.find(function(x){return x.id==o.cid});if(c2&&!nc.has(c2.id))c2.bal-=o.due-b.due;o.rv=b.rv;o.due=b.due;o.items.forEach(function(i,k){i.rq=b.items[k].rq})}});
 S.ex.forEach(function(x){if(!has('ex',x.id))D.ex.push(x)});
 S.tx.forEach(function(x){if(has('tx',x.id))return;D.tx.push(x);
  var p=np.has(x.pid)?0:D.p.find(function(y){return y.id==x.pid}),c=x.cid&&!nc.has(x.cid)?cu(x.cid):0;
  if(p){if(x.k=='s')p.stock-=x.m;if(x.k=='r')p.stock+=x.m}
  if(c){if(x.k=='bk')c.bal+=x.amt;if(x.k=='rc'||x.k=='pd')c.bal-=x.amt}
  if(x.k=='b')sk++});
 save();localStorage.removeItem('rk_stash');localStorage.removeItem('rk_off');go(cur);
 toast('অফলাইনের '+n+'টা বিল মেলানো হয়েছে');
 if(sk)alert('অফলাইনে '+sk+'টা মাল কেনা ছিল, ওগুলো যোগ হয়নি। মাল কেনা ট্যাবে আবার দিন।')}
document.addEventListener('DOMContentLoaded',function(){
 var o=window.login,lg=window.logout;
 window.login=async function(e){e.preventDefault();
  var em=$('#le').value.trim().toLowerCase(),pw=$('#lp').value,m=$('#lm'),ok=async function(){var h=CR()[em];return h&&h==await H(em+'|'+pw)};
  m.textContent='';
  if(!navigator.onLine||!o){if(await ok())offIn(em);else m.textContent=!navigator.onLine?'অফলাইনে লগইন হয়নি: এই ফোনে আগে একবার নেটে লগইন করতে হবে, অথবা পাসওয়ার্ড ভুল':'পেজ রিফ্রেশ করে আবার চেষ্টা করুন';return false}
  if(localStorage.rk_off){if(!localStorage.rk_stash)localStorage.rk_stash=localStorage.getItem(K);W=1}
  await o(e);
  if(m.textContent){W=0;if(await ok()){m.textContent='';offIn(em)}}
  else{var c=CR();c[em]=await H(em+'|'+pw);localStorage.rk_cr=JSON.stringify(c)}
  return false};
 window.logout=function(){if(window.OFFS)location.reload();else if(lg)lg()};
});
window.addEventListener('online',function(){if(window.OFFS)toast('নেট এসেছে — সিঙ্ক করতে লগআউট করে আবার লগইন করুন')});

// ===== স্টক: গ্রিড থিম + দাম-বাকি ফিল্টার + ভয়েস বোতাম =====
var _pf=pf;window.pf=function(id){_pf(id);['pb','ps'].forEach(function(i){var e=$('#'+i);if(e)e.required=false})};
var _sp=sp;window.sp=function(e,id){var p=id&&D.p.find(function(x){return x.id==id}),c=window.confirm;
 if(p&&!(p.buy>0))window.confirm=function(){return true};
 try{return _sp(e,id)}finally{window.confirm=c}};
var _al=addLine;window.addLine=function(){var p=D.p.find(function(x){return x.id==$('#sp').value});
 if(p&&window.OWN&&!(p.buy>0)&&!confirm('এই পণ্যের ক্রয়মূল্য বসানো নেই, লাভ ঠিক আসবে না। তবুও বিলে যোগ করবেন?'))return;_al()};
var ctl=function(){var n=D.shop.lay==null?3:D.shop.lay;
 return'<div class="row" style="gap:6px"><select onchange="D.shop.lay=+this.value;save();drawStock()">'+[[0,'☰ লম্বা তালিকা'],[2,'▦ ২ কলাম'],[3,'▦ ৩ কলাম'],[4,'▦ ৪ কলাম']].map(function(o){return'<option value="'+o[0]+'"'+(n==o[0]?' selected':'')+'>'+o[1]}).join('')+'</select><select onchange="window.PF=+this.value;drawStock()"><option value="0">সব পণ্য<option value="1"'+(window.PF?' selected':'')+'>⚠ দাম বাকি ('+D.p.filter(pend).length+')</select></div>'};
var _vs=V.stock;V.stock=function(){return _vs().replace('<div id="sl">',ctl()+'<div id="sl">').replace('<button class="s" onclick="pf()">＋ নতুন পণ্য</button>','<span style="display:flex;gap:6px"><button class="s" onclick="vo()">🎤 বলে যোগ</button><button class="s" onclick="pf()">＋ নতুন পণ্য</button></span>')};
var bd2=function(p){return p.sell>0?tk(p.sell*df(p))+'/'+dn(p):'দাম বাকি'};
var gc=function(p){return'<div class="card" onclick="pf(\''+p.id+'\')" style="margin:0;padding:8px;text-align:center">'+(p.img?'<img src="'+p.img+'" alt="" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px">':'<div class="th" style="width:100%;height:auto;aspect-ratio:1;font-size:28px">📦</div>')+'<b style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:13px;line-height:1.25;margin-top:4px">'+esc(p.name)+'</b><small class="m" style="display:block;font-size:11px">'+bd2(p)+'</small><b class="'+(p.stock<=p.low?'neg':'')+'" style="font-size:12px">'+fqh(p,p.stock)+'</b>'+(pend(p)?'<small class="neg" style="display:block;font-size:10px">⚠ দাম বাকি</small>':'')+'</div>'};
var lc=function(p){return'<div class="card row" onclick="pf(\''+p.id+'\')">'+(p.img?'<img class="th" src="'+p.img+'" alt="">':'<div class="th">📦</div>')+'<div style="flex:1"><b>'+esc(p.name)+'</b><small class="m" style="display:block">বিক্রয় '+bd2(p)+(window.OWN?' • ক্রয় '+tk(p.buy*df(p)):'')+'</small>'+(pend(p)?'<small class="neg" style="display:block">⚠ দাম বাকি</small>':'')+'</div><b class="'+(p.stock<=p.low?'neg':'')+'">'+fqh(p,p.stock)+'</b></div>'};
window.drawStock=function(){var n=D.shop.lay==null?3:D.shop.lay,
 f={n:function(a,b){return a.name.localeCompare(b.name)},low:function(a,b){return a.stock-b.stock},sh:function(a,b){return b.stock-a.stock},pl:function(a,b){return a.sell-b.sell},ph:function(a,b){return b.sell-a.sell}}[so],
 L=D.p.filter(function(p){return p.name.toLowerCase().includes(q.toLowerCase())&&(!window.PF||pend(p))}).sort(f);
 $('#sl').innerHTML=!L.length?'<p class="m">কোনো পণ্য নেই।</p>':n?'<div style="display:grid;grid-template-columns:repeat('+n+',1fr);gap:8px;margin-top:8px">'+L.map(gc).join('')+'</div>':L.map(lc).join('')};

// ===== ভয়েসে পণ্য তোলা =====
var bd=function(s){return s.replace(/[০-৯]/g,function(c){return'০১২৩৪৫৬৭৮৯'.indexOf(c)})};
window.vo=function(){dlg('<h3>🎤 বলে পণ্য তুলুন</h3><p class="m" style="margin:0 0 6px">যেমন: "ইন্সপায়ার ২০ ওয়াট ৪১ পিস"। শেষের সংখ্যাটা পরিমাণ। দাম পরে বসাবেন।</p><button class="b" onclick="vs()">🎤 বলুন</button><p id="vt" class="m"></p><input id="vn" placeholder="পণ্যের নাম"><div class="row"><input id="vq" type="number" step="any" placeholder="পরিমাণ"><select id="vu"><option>পিস<option>কেজি<option>গ্রাম<option>লিটার</select></div><button class="b" onclick="va()">যোগ করুন</button><button class="s" onclick="cl()">বন্ধ</button>')};
window.vs=function(){var R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R)return alert('এই ব্রাউজারে ভয়েস চলে না, নিজে লিখে দিন');
 var r=new R();r.lang='bn-BD';
 r.onresult=function(e){var t=bd(e.results[0][0].transcript).trim();$('#vt').textContent='শুনেছি: '+t;
  var m=/^(.*?)(\d+(?:\.\d+)?)\s*(পিস|পিচ|pcs|piece|কেজি|কিলো|kg|গ্রাম|gm|লিটার|ltr|litre)?\s*$/i.exec(t);
  if(m){$('#vn').value=m[1].trim();$('#vq').value=m[2];var u=m[3]||'';$('#vu').value=/কেজি|কিলো|kg/i.test(u)?'কেজি':/গ্রাম|gm/i.test(u)?'গ্রাম':/লিটার|ltr|litre/i.test(u)?'লিটার':'পিস'}else $('#vn').value=t};
 r.onerror=function(){$('#vt').textContent='শোনা যায়নি, আবার চাপুন'};r.start()};
window.va=function(){var n=$('#vn').value.trim(),q0=+$('#vq').value,u=$('#vu').value;if(!n||!(q0>=0))return alert('নাম আর পরিমাণ দিন');
 var ty=u=='লিটার'?'liquid':u=='কেজি'||u=='গ্রাম'?'weight':'piece',m=q0*U[ty].u[u],o=D.p.find(function(p){return p.name.toLowerCase()==n.toLowerCase()});
 if(o){if(!confirm(n+' আগে থেকেই আছে (স্টক '+fq(o,o.stock)+')। স্টক '+q0+' '+u+' করে দেবেন?'))return;o.stock=m}
 else D.p.push({id:uid(),img:'',name:n,type:ty,du:U[ty].main,buy:0,sell:0,min:0,pack:0,packPrice:0,packMin:0,low:ty=='piece'?5:1,stock:m});
 save();toast(n+' তোলা হয়েছে');$('#vn').value='';$('#vq').value='';$('#vt').textContent='পরের পণ্য বলুন';if(cur=='stock')drawStock()};

// ===== পুরনো বাকির তালিকা + বাকির কাগজ =====
function age(c){var Q=[];cEnt(c).slice().sort(function(a,b){return a.t-b.t}).forEach(function(x){
  if(x.k=='rc'){var a=x.amt;while(a>1e-9&&Q.length){var m=Math.min(a,Q[0].a);Q[0].a-=m;a-=m;if(Q[0].a<1e-9)Q.shift()}}else Q.push({t:x.t,a:x.amt})});
 var s=Q.reduce(function(z,y){return z+y.a},0);return{t:c.bal-s>1?0:(Q[0]?Q[0].t:0)}}
var _vk=V.khata;V.khata=function(){var h=_vk();return kt=='cu'?h.replace('<button class="b" onclick="addParty()">','<button class="b" onclick="ag()">📋 পুরনো বাকির তালিকা</button><button class="b" onclick="addParty()">'):h};
var hd2=function(t){return(D.shop.logo?'<img class="lg" src="'+D.shop.logo+'" alt="">':'')+'<h3 style="margin:4px">'+esc(D.shop.name)+'</h3><small>'+t+' • '+dt(Date.now())+'</small>'};
window.ag=function(){var R=D.cu.filter(function(c){return c.bal>0}).map(function(c){return{c:c,t:age(c).t}}).sort(function(a,b){return a.t-b.t});
 dlg('<div class="rc"><div style="text-align:center">'+hd2('পুরনো বাকির তালিকা')+'</div><table>'+(R.map(function(r){return'<tr><td>'+esc(r.c.name)+' <small>'+esc(r.c.phone||'')+'</small><br><small>'+(r.t?Math.floor((Date.now()-r.t)/864e5)+' দিন ধরে':'আগের বাকি')+'</small><td align="right">'+tk(r.c.bal)}).join('')||'<tr><td>কারও বাকি নেই')+'<tr class="tt"><td>মোট<td align="right">'+tk(sum(R.map(function(r){return r.c}),'bal'))+'</table></div><div class="row nop"><button class="b" onclick="print()">প্রিন্ট</button><button class="s" onclick="cl()">বন্ধ</button></div>')};
window.stmt=function(id){var c=D.cu.find(function(x){return x.id==id}),E=cEnt(c).sort(function(a,b){return a.t-b.t});
 dlg('<div class="rc"><div style="text-align:center">'+hd2('বাকির হিসাব')+'<br><small>ক্রেতা: '+esc(c.name)+' '+esc(c.phone||'')+'</small></div><table>'+E.map(function(e){return'<tr><td>'+dt(e.t)+'<br><small>'+(e.k=='rc'?'টাকা জমা':esc(e.items||'বাকি'))+'</small><td align="right">'+(e.k=='rc'?'-':'')+tk(e.amt)}).join('')+'<tr class="tt"><td>মোট বাকি<td align="right">'+tk(c.bal)+'</table><p style="text-align:center">ধন্যবাদ</p></div><div class="row nop"><button class="b" onclick="print()">প্রিন্ট</button><button class="s" onclick="cdet(\''+id+'\')">ফিরুন</button></div>')};
var _cd=cdet;window.cdet=function(id){_cd(id);var b=document.createElement('button');b.className='s';b.textContent='🖨 বাকির কাগজ';b.onclick=function(){stmt(id)};$('#dlg').appendChild(b)};

// ===== হোম: কেনার আন্দাজ =====
function reo(){var n=Date.now(),f=n-30*864e5,S={},m0=n;
 D.tx.forEach(function(x){if(x.pid&&x.t>=f&&(x.k=='s'||x.k=='r')){S[x.pid]=(S[x.pid]||0)+(x.k=='s'?x.m:-x.m);m0=Math.min(m0,x.t)}});
 var sp=Math.max(7,(n-m0)/864e5);
 return D.p.map(function(p){return{p:p,d:S[p.id]>0?p.stock/(S[p.id]/sp):1e9}}).filter(function(r){return r.d<=14}).sort(function(a,b){return a.d-b.d}).slice(0,15)}
var _vh=V.home;V.home=function(){var x=D.p.filter(pend).length,r=reo();
 return _vh()+(x?'<div class="card" onclick="window.PF=1;go(\'stock\')"><b>⚠ '+x+' টা পণ্যের দাম বাকি</b><small class="m" style="display:block">চাপ দিয়ে তালিকা দেখুন</small></div>':'')+'<h3>🛒 শিগগির কিনতে হবে (আন্দাজ)</h3>'+(r.map(function(z){return'<div class="tr"><b>'+esc(z.p.name)+'</b><span class="neg">'+(z.p.stock>0?fqh(z.p,z.p.stock)+' • ~'+Math.ceil(z.d)+' দিন':'স্টক শেষ')+'</span></div>'}).join('')||'<p class="m">এখন জরুরি কিছু নেই (গত ৩০ দিনের বিক্রি দেখে)</p>')};
})();
