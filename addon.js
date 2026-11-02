// ===== রাকিব হার্ডওয়্যার অ্যাড-অন: বিল, বাকির খাতা, মহাজন, খরচ, রসিদ =====
// index.html এর </body> এর আগে (মূল <script> এর পরে) যোগ করুন: <script src="addon.js"></script>
let xtab = "bill", xcart = [], xdues = [], xexps = [], xtxt = "";
const XT = [["bill", "🧾 বিল"], ["cust", "📒 বাকি"], ["sup", "🚚 মহাজন"], ["exp", "💸 খরচ"]];

document.querySelector("main").insertAdjacentHTML("beforeend", '<section id="p-more"><div class="bar" id="mt"></div><br><div id="mx"></div></section>');
document.querySelector("nav").insertAdjacentHTML("beforeend", '<button onclick="go(\'more\',this)"><i>➕</i>আরও</button>');
document.body.insertAdjacentHTML("beforeend", '<div class="modal" id="m-rc"><div class="sheet" id="rc"></div></div>');

function xTab(t) { xtab = t; xr(); }
function xr() {
  $("mt").innerHTML = XT.map(([k, l]) => `<button class="btn ${xtab === k ? "" : "g"} sm" onclick="xTab('${k}')">${l}</button>`).join("");
  ({bill: xBill, cust: () => xDue("cust"), sup: () => xDue("sup"), exp: xExp})[xtab]();
}

// ---- ডেটা লোড ----
if (typeof db !== "undefined" && db) {
  db.collection("dues").orderBy("ts", "desc").limit(2000).onSnapshot(s => { xdues = s.docs.map(d => ({id: d.id, ...d.data()})); if (xtab !== "bill") xr(); }, e => toast("বাকির তথ্য লোড হয়নি: " + e.message));
  db.collection("exps").orderBy("ts", "desc").limit(1000).onSnapshot(s => { xexps = s.docs.map(d => ({id: d.id, ...d.data()})); if (xtab === "exp") xr(); }, e => toast("খরচ লোড হয়নি: " + e.message));
}
const _ra = renderAll;
renderAll = function () { _ra(); xFill(); };

// ---- বিল (একাধিক পণ্য) ----
function xBill() {
  $("mx").innerHTML = `<div class="card"><b>নতুন বিল</b><br><br><label>পণ্য</label><select id="xb-p" onchange="xbPick()"></select>
  <div class="bar"><input id="xb-q" type="number" step="any" inputmode="decimal" placeholder="পরিমাণ"><select id="xb-u" onchange="xbUnit()"></select></div>
  <label>দাম (প্রতি ইউনিট)</label><input id="xb-pr" type="number" step="any" inputmode="decimal">
  <button class="btn g" onclick="xbAdd()">＋ বিলে যোগ করুন</button></div>
  <div id="xb-l"></div>
  <div class="card"><label>কাস্টমারের নাম (বাকি রাখলে আবশ্যক)</label><input id="xb-c">
  <label>নগদ পেলাম</label><input id="xb-paid" type="number" step="any" inputmode="decimal">
  <button class="btn" onclick="xbDone()">বিল নিশ্চিত করুন</button></div>`;
  xFill(); xCartR();
}
function xFill() {
  if (xtab === "exp") return xr();
  if (xtab !== "bill" || !$("xb-p")) return;
  const c = $("xb-p").value;
  $("xb-p").innerHTML = products.slice().sort((a, b) => a.name.localeCompare(b.name, "bn")).map(p => `<option value="${p.id}">${esc(p.name)} (${stockTxt(p)})</option>`).join("");
  if (c && products.some(p => p.id === c)) $("xb-p").value = c;
  if (!$("xb-u").options.length) xbPick();
}
const xp = () => products.find(p => p.id === $("xb-p").value);
function xbPick() { const p = xp(); if (!p) return; $("xb-u").innerHTML = unitOpts(p); $("xb-u").value = BL[p.type]; xbUnit(); }
function xbUnit() { const p = xp(); if (!p) return; $("xb-pr").value = +unitInfo(p, $("xb-u").value).price.toFixed(2); }
function xbAdd() {
  const p = xp(), q = +$("xb-q").value, pr = +$("xb-pr").value;
  if (!p) return toast("পণ্য বাছাই করুন");
  if (!(q > 0)) return toast("পরিমাণ লিখুন");
  const i = unitInfo(p, $("xb-u").value), base = q * i.f;
  const used = xcart.filter(c => c.pid === p.id).reduce((a, c) => a + c.base, 0);
  if (used + base > p.stock + 1e-9) return toast("স্টকে এত নেই। আছে: " + stockTxt(p));
  if (i.min > 0 && pr < i.min - 1e-9) return toast("সর্বনিম্ন মূল্য " + sym + N(i.min) + " এর কম দিলে বিক্রি হবে না");
  xcart.push({pid: p.id, name: p.name, qty: q, unit: i.label, base, price: pr, cost: p.cost});
  $("xb-q").value = ""; xCartR();
}
function xbDel(n) { xcart.splice(n, 1); xCartR(); }
function xCartR() {
  const tot = xcart.reduce((a, c) => a + c.qty * c.price, 0);
  $("xb-l").innerHTML = xcart.length ? xcart.map((c, n) => `<div class="card row"><div><b>${esc(c.name)}</b><div class="mu">${N(c.qty)} ${esc(c.unit)} × ${sym}${N(c.price)}</div></div>
  <div style="text-align:right"><b>${sym}${N(c.qty * c.price)}</b><br><button class="btn r sm" onclick="xbDel(${n})">✕</button></div></div>`).join("") + `<div class="card row"><b>মোট</b><b>${sym}${N(tot)}</b></div>` : '<div class="mu">বিলে এখনো কোনো পণ্য নেই</div>';
  $("xb-paid").value = tot || "";
}
async function xbDone() {
  if (!xcart.length) return toast("বিলে কোনো পণ্য নেই");
  const tot = xcart.reduce((a, c) => a + c.qty * c.price, 0), paid = +$("xb-paid").value || 0, cust = $("xb-c").value.trim(), due = tot - paid;
  if (due > 0.009 && !cust) return toast("বাকি রাখলে কাস্টমারের নাম লিখুন");
  const ts = Date.now(), bill = "B" + ts, b = db.batch(), use = {};
  xcart.forEach(c => {
    const total = c.qty * c.price;
    b.set(db.collection("txns").doc(), {type: "sale", pid: c.pid, name: c.name, qty: c.qty, unit: c.unit, base: c.base, total, profit: total - c.base * c.cost, returnedQty: 0, ts, bill, cust});
    use[c.pid] = (use[c.pid] || 0) + c.base;
  });
  Object.entries(use).forEach(([id, v]) => b.update(db.collection("products").doc(id), {stock: firebase.firestore.FieldValue.increment(-v)}));
  if (due > 0.009) b.set(db.collection("dues").doc(), {kind: "cust", name: cust, amt: due, type: "due", note: "বিল", ts});
  try {
    await b.commit();
    xReceipt(xcart, tot, paid, cust, ts);
    xcart = []; $("xb-c").value = ""; xCartR(); toast("বিল হয়েছে ✔");
  } catch (e) { toast("বিল হয়নি: " + e.message); }
}

// ---- রসিদ ----
function xReceipt(items, tot, paid, cust, ts) {
  const lines = items.map(c => `${c.name} — ${N(c.qty)} ${c.unit} × ${N(c.price)} = ${N(c.qty * c.price)}`);
  xtxt = ["রাকিব হার্ডওয়্যার অ্যান্ড স্যানিটারি", new Date(ts).toLocaleString("bn-BD"), cust ? "কাস্টমার: " + cust : "", "", ...lines, "", "মোট: ৳" + N(tot), "নগদ: ৳" + N(paid), ...(tot - paid > 0.009 ? ["বাকি: ৳" + N(tot - paid)] : []), "", "ধন্যবাদ"].join("\n");
  $("rc").innerHTML = `<b>রসিদ</b><br><br><pre style="white-space:pre-wrap;font:inherit;margin:0">${esc(xtxt)}</pre><br>
  <div class="bar"><button class="btn" onclick="xPrint()">🖨️ প্রিন্ট</button><button class="btn g" onclick="xShare()">📤 শেয়ার</button></div><br>
  <button class="btn g" onclick="closeM('m-rc')">বন্ধ করুন</button>`;
  $("m-rc").classList.add("on");
}
function xPrint() { const w = window.open("", "_blank"); if (!w) return toast("প্রিন্ট উইন্ডো খোলেনি"); w.document.write("<pre style='font:16px sans-serif;white-space:pre-wrap'>" + esc(xtxt) + "</pre>"); w.document.close(); w.print(); }
function xShare() { if (navigator.share) navigator.share({text: xtxt}).catch(() => {}); else window.open("https://wa.me/?text=" + encodeURIComponent(xtxt)); }

// ---- বাকির খাতা (কাস্টমার) ও মহাজন ----
function xDue(k) {
  const m = {};
  xdues.filter(d => d.kind === k).forEach(d => m[d.name] = (m[d.name] || 0) + (d.type === "due" ? d.amt : -d.amt));
  const l = Object.entries(m).filter(e => Math.abs(e[1]) > 0.009).sort((a, b) => b[1] - a[1]);
  const tot = l.reduce((a, e) => a + e[1], 0);
  const w = k === "cust" ? ["বাকি দিলাম", "টাকা পেলাম", "মোট পাব"] : ["মাল বাকিতে নিলাম", "টাকা দিলাম", "মোট দিতে হবে"];
  $("mx").innerHTML = `<div class="stat"><span>${w[2]}</span><b>${sym}${N(tot)}</b></div><br>
  <div class="card"><label>নাম</label><input id="xd-n"><label>টাকা</label><input id="xd-a" type="number" step="any" inputmode="decimal">
  <div class="bar"><button class="btn" onclick="xdAdd('${k}','due')">${w[0]}</button><button class="btn g" onclick="xdAdd('${k}','pay')">${w[1]}</button></div></div>
  <h3>তালিকা (নামে চাপলে উপরে বসবে)</h3>` + (l.map(([n, v]) => `<div class="card row" onclick="$('xd-n').value=this.dataset.n;window.scrollTo(0,0)" data-n="${esc(n)}"><b>${esc(n)}</b><b class="${v > 0 ? "low" : "ok"}">${sym}${N(v)}</b></div>`).join("") || '<div class="mu">কিছু নেই</div>');
}
async function xdAdd(k, t) {
  const n = $("xd-n").value.trim(), a = +$("xd-a").value;
  if (!n) return toast("নাম লিখুন");
  if (!(a > 0)) return toast("টাকার পরিমাণ লিখুন");
  try { await db.collection("dues").add({kind: k, name: n, amt: a, type: t, note: "", ts: Date.now()}); toast("লেখা হয়েছে ✔"); }
  catch (e) { toast("সেভ হয়নি: " + e.message); }
}

// ---- দোকানের খরচ ----
function xExp() {
  const d = new Date(), t0 = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  const me = xexps.filter(e => e.ts >= t0), et = me.reduce((a, e) => a + e.amt, 0);
  const pr = txns.filter(t => t.ts >= t0 && t.type !== "buy").reduce((a, t) => a + (t.profit || 0), 0);
  $("mx").innerHTML = `<div class="grid"><div class="stat"><span>এই মাসের লাভ</span><b>${sym}${N(pr)}</b></div><div class="stat"><span>এই মাসের খরচ</span><b>${sym}${N(et)}</b></div></div>
  <div class="stat"><span>নিট লাভ (লাভ − খরচ)</span><b class="${pr - et < 0 ? "low" : "ok"}">${sym}${N(pr - et)}</b></div><br>
  <div class="card"><label>খরচের বিষয় (ভাড়া, বেতন, বিদ্যুৎ...)</label><input id="xe-t"><label>টাকা</label><input id="xe-a" type="number" step="any" inputmode="decimal">
  <button class="btn" onclick="xeAdd()">খরচ লিখুন</button></div><h3>সাম্প্রতিক খরচ</h3>` +
    (xexps.slice(0, 30).map(e => `<div class="card row"><div><b>${esc(e.title)}</b><div class="mu">${new Date(e.ts).toLocaleString("bn-BD", {day: "numeric", month: "short"})}</div></div>
    <div style="text-align:right"><b>${sym}${N(e.amt)}</b><br><button class="btn r sm" onclick="xeDel('${e.id}')">✕</button></div></div>`).join("") || '<div class="mu">এখনো কোনো খরচ নেই</div>');
}
async function xeAdd() {
  const t = $("xe-t").value.trim(), a = +$("xe-a").value;
  if (!t) return toast("খরচের বিষয় লিখুন");
  if (!(a > 0)) return toast("টাকার পরিমাণ লিখুন");
  try { await db.collection("exps").add({title: t, amt: a, ts: Date.now()}); toast("খরচ লেখা হয়েছে ✔"); }
  catch (e) { toast("সেভ হয়নি: " + e.message); }
}
async function xeDel(id) { if (confirm("এই খরচ মুছবেন?")) try { await db.collection("exps").doc(id).delete(); } catch (e) { toast("মোছা যায়নি: " + e.message); } }

xr();