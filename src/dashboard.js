/* 仪表盘:①箭面时刻 ②滴速+流量 ③水位柱 ④百刻进度 */
(function (MECH) {
  var el = {}, D = MECH.DIM;
  var soft = "rgba(233,238,242,0.5)";

  MECH.DASH = { panels: [
    { title: "TIME · 箭面时刻", meta: "百刻制", dot: "teal",
      html: '<div class="big" id="d-ke">0</div><div class="k">刻 / 100</div>' +
            '<div class="bar"><i id="d-bar"></i></div>' +
            '<div class="rowline"><span>滴速</span><b id="d-rate">×1.0</b></div>' +
            '<div class="chip" id="d-chip">—</div>',
      init: initTime, draw: drawTime },
    { title: "FLOW · 流量", meta: "Q=C·A·√(2gh)", dot: "blue",
      html: '<div class="big" id="d-q">—</div><div class="k">ml/s</div>' +
            '<div class="rowline"><span>恒定性</span><b id="d-steady">—</b></div>',
      init: initFlow, draw: drawFlow },
    { title: "HEAD · 水位柱", meta: "日壶溢流恒头", dot: "yellow", canvasH: 96, draw: drawHead },
    { title: "PROGRESS · 百刻进度", meta: "一昼夜演示", dot: "green", canvasH: 96, draw: drawProg }
  ] };

  function initTime(sec) {
    el.ke = sec.querySelector("#d-ke");
    el.bar = sec.querySelector("#d-bar");
    el.rate = sec.querySelector("#d-rate");
    el.chip = sec.querySelector("#d-chip");
  }
  function initFlow(sec) {
    el.q = sec.querySelector("#d-q");
    el.steady = sec.querySelector("#d-steady");
  }

  function drawTime(st, ph, pt, ctx, w, h) {
    if (el.ke) el.ke.textContent = String(Math.floor(st.ke));
    if (el.bar) el.bar.style.width = (st.ke / D.ke * 100) + "%";
    if (el.rate) el.rate.textContent = "×" + st.flowK.toFixed(1);
    if (el.chip) {
      el.chip.textContent = st.ke > 2 ? "计时中 · 箭匀升" : "待滴";
      el.chip.className = "chip" + (st.ke > 2 ? " on" : "");
    }
  }

  function drawFlow(st, ph, pt, ctx, w, h) {
    if (el.q) el.q.textContent = (D.Q * 1e6 * st.flowK).toFixed(1);
    if (el.steady) el.steady.textContent = st.ke > 2 ? "恒定 ✓(溢流保头)" : "—";
  }

  /* ③ 水位柱:四级壶水位(日壶恒定,受水壶渐升) */
  function drawHead(st, ph, pt, ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    var names = ["日", "月", "星", "受水"];
    var levels = [0.72, 0.72, 0.72, Math.min(0.8, 0.18 + st.ke / D.ke * 0.6)];
    for (var k = 0; k < 4; k++) {
      var x = 12 + k * (w - 24) / 4;
      var bw = (w - 24) / 4 - 10;
      ctx.strokeStyle = "rgba(233,238,242,0.4)";
      ctx.strokeRect(x, 12, bw, h - 30);
      var lvl = levels[k];
      ctx.fillStyle = "rgba(79,163,199,0.7)";
      ctx.fillRect(x + 1, 12 + (h - 30) * (1 - lvl), bw - 2, (h - 30) * lvl);
      ctx.fillStyle = soft;
      ctx.font = "700 9px serif";
      ctx.textAlign = "center";
      ctx.fillText(names[k], x + bw / 2, h - 8);
    }
    ctx.fillStyle = soft;
    ctx.font = "600 7.5px Menlo, monospace";
    ctx.textAlign = "left";
    ctx.fillText("日壶溢流 → 水头恒 0.18m", 4, 10);
  }

  /* ④ 百刻进度圆盘 */
  function drawProg(st, ph, pt, ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    var cx = w / 2, cy = h / 2, R = Math.min(cx, cy) - 8;
    ctx.strokeStyle = "rgba(233,238,242,0.28)";
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    var f = st.ke / D.ke;
    ctx.strokeStyle = "#7FD8D8";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy, R - 4, -Math.PI / 2, -Math.PI / 2 + f * Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.fillStyle = "#E9EEF2";
    ctx.font = "800 13px Menlo, monospace";
    ctx.textAlign = "center";
    ctx.fillText(Math.floor(st.ke), cx, cy + 2);
    ctx.fillStyle = soft;
    ctx.font = "600 7.5px Menlo, monospace";
    ctx.fillText("/ 100 刻", cx, cy + 14);
    for (var k = 0; k < 12; k++) {
      var a = k / 12 * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (R - 2), cy + Math.sin(a) * (R - 2));
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.stroke();
    }
  }
})(window.MECH = window.MECH || {});
