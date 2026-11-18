/* 图纸面板(B 键):铜壶滴漏侧视阶梯总图 + 流量公式 + 尺寸表 */
(function (MECH) {
  var red = "#8C2F1E";

  function arrow(ctx, x1, y1, x2, y2, text, below) {
    ctx.strokeStyle = "rgba(42,38,32,0.4)";
    ctx.fillStyle = "rgba(42,38,32,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    var s = 4, dir = x2 >= x1 ? 1 : -1;
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - s * dir, y2 - 3); ctx.lineTo(x2 - s * dir, y2 + 3); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + s * dir, y1 - 3); ctx.lineTo(x1 + s * dir, y1 + 3); ctx.closePath(); ctx.fill();
    ctx.font = "600 10px Menlo, monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, (x1 + x2) / 2, below ? (y1 + 13) : (y1 - 5));
  }

  MECH.BP = {
    no: "Fig. 17 · 复原阶梯总图",
    title: "铜壶滴漏 · 四级壶 · 恒定水头 · 百刻浮箭",
    src: "元代广州铜壶滴漏(1316,冼运行等造)· 现存中国国家博物馆",
    draw: function (ctx, w, h) {
      var D = MECH.DIM;
      ctx.clearRect(0, 0, w, h);
      var chainH = 44, chainY = h - chainH - 12, topY = 34;
      var ink = "#2A2620";
      ctx.fillStyle = red;
      ctx.font = "700 11px Menlo, monospace";
      ctx.textAlign = "left";
      ctx.fillText("Q = C·A孔·√(2g·h头) 恒定(C=0.62, A=8mm², h=0.18m)⇒ 浮箭匀升 v = Q/A受水壶", w * 0.045, topY - 10);

      /* ============ 左:阶梯侧视图 ============ */
      var S = Math.min(w * 0.46 / 3.6, (chainY - topY - 26) / 2.0);
      var ox = w * 0.05, oy = chainY - 16;
      var X = function (m) { return ox + (m + 1.8) * S; }, Y = function (m) { return oy - m * S; };
      ctx.strokeStyle = ink;
      ctx.fillStyle = ink;
      ctx.lineWidth = 1.4;
      ctx.font = "700 11px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("侧视 SIDE(日壶高 → 受水壶低)", ox, Y(1.95));
      /* 四壶(圆+水位线) */
      var pots = [
        [-1.15, 1.35, 0.30, "日壶"],
        [-0.37, 1.05, 0.28, "月壶"],
        [0.41, 0.75, 0.26, "星壶"],
        [1.19, 0.45, 0.26, "受水壶"]
      ];
      pots.forEach(function (p, k) {
        ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1] + 0.20), p[2] * S, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1] + 0.20), p[2] * S * 0.55, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
        ctx.font = "600 9px sans-serif";
        ctx.fillText(p[3], X(p[0]) - 14, Y(p[1] + 0.20) - p[2] * S - 5);
        /* 台阶 */
        ctx.strokeRect(X(p[0] - 0.34), Y(0), 0.68 * S, p[1] * S);
        /* 滴管(斜线) */
        if (k < 3) {
          ctx.beginPath();
          ctx.moveTo(X(p[0] + 0.12), Y(p[1] + 0.16));
          ctx.lineTo(X(p[0] + 0.75), Y(p[1] - 0.28));
          ctx.stroke();
        }
      });
      /* 浮箭(受水壶中) */
      ctx.beginPath();
      ctx.moveTo(X(1.19), Y(0.55));
      ctx.lineTo(X(1.19), Y(0.55 + D.arrowL * 0.7));
      ctx.stroke();
      ctx.fillStyle = "rgba(42,38,32,0.55)";
      ctx.font = "600 8px sans-serif";
      ctx.fillText("浮舟+铜箭(百刻)", X(1.19) - 0.28 * S, Y(0.55 + D.arrowL * 0.7) - 4);
      /* 水头标注 */
      arrow(ctx, X(-1.15) + 0.3 * S, Y(1.35 + 0.02), X(-1.15) + 0.3 * S, Y(1.35 + 0.20), "h=0.18 恒定", false);

      /* ============ 右:流量公式详图 ============ */
      var ox2 = w * 0.54;
      ctx.font = "700 11px sans-serif";
      ctx.fillStyle = ink;
      ctx.fillText("恒定水头原理", ox2, topY + 18);
      var gx = ox2, gy = topY + 32, gw = w - ox2 - 24, gh = chainY - gy - 44;
      ctx.strokeStyle = "rgba(42,38,32,0.5)";
      ctx.strokeRect(gx, gy, gw, gh);
      /* 壶 + 溢流口 + 滴孔 */
      ctx.beginPath(); ctx.arc(gx + gw * 0.3, gy + gh * 0.42, gh * 0.32, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(gx + gw * 0.3, gy + gh * 0.30, gh * 0.22, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      ctx.fillStyle = "rgba(79,163,199,0.6)";
      ctx.fillRect(gx + gw * 0.3 - gh * 0.30, gy + gh * 0.42, gh * 0.60, gh * 0.22);
      ctx.fillStyle = ink;
      ctx.font = "600 8.5px sans-serif";
      ctx.fillText("溢流口(恒头)", gx + gw * 0.3 - 22, gy + gh * 0.30 - 6);
      ctx.fillText("滴孔 A=8mm²", gx + gw * 0.3 + gh * 0.26, gy + gh * 0.42 + 14);
      ctx.fillStyle = red;
      ctx.font = "700 10px Menlo, monospace";
      ctx.fillText("h 恒 → Q 恒 → v 箭恒", gx + gw * 0.52, gy + gh * 0.34);
      ctx.fillStyle = "rgba(42,38,32,0.6)";
      ctx.font = "600 8.5px sans-serif";
      ctx.fillText("百刻 = 一昼夜(演示 100s,压缩 864:1)", gx + 10, gy + gh - 10);

      /* ============ 底部:参数链 ============ */
      var boxes = [
        ["日壶注水", "溢流保头"], ["三级递减", "月→星→受水"], ["滴孔恒流", "Q=C·A·√(2gh)"],
        ["受水壶", "水位渐升"], ["浮舟托箭", "百刻分度"], ["读数报时", "箭面即时刻"]
      ];
      var bwid = (w * 0.91) / boxes.length;
      for (var b = 0; b < boxes.length; b++) {
        var bx2 = w * 0.045 + b * bwid;
        ctx.strokeStyle = ink;
        ctx.fillStyle = ink;
        ctx.strokeRect(bx2, chainY, bwid - 10, chainH);
        ctx.font = "700 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(boxes[b][0], bx2 + (bwid - 10) / 2, chainY + 17);
        ctx.font = "600 8.5px Menlo, monospace";
        ctx.fillStyle = "rgba(42,38,32,0.55)";
        ctx.fillText(boxes[b][1], bx2 + (bwid - 10) / 2, chainY + 32);
        if (b < boxes.length - 1) {
          ctx.beginPath();
          ctx.moveTo(bx2 + bwid - 10, chainY + 20);
          ctx.lineTo(bx2 + bwid - 2, chainY + 20);
          ctx.stroke();
        }
      }
    },
    table:
      '<h4>四级铜壶</h4><table>' +
      '<tr><th>日壶(最高)</th><td>Ø 0.60 · 溢流保水头</td><td>h = 0.18 m 恒定</td></tr>' +
      '<tr><th>月壶 / 星壶</th><td>二级 / 三级递减</td><td>缓冲稳压</td></tr>' +
      '<tr><th>受水壶</th><td>Ø 0.52 · 浮舟铜箭</td><td>水面积 1.81e-3 m²</td></tr>' +
      '<tr><th>铜箭</th><td>百刻分度 · 长 0.52</td><td>匀速上升</td></tr>' +
      '</table><h4>流量验算</h4><table>' +
      '<tr><th>Torricelli</th><td>Q = 0.62 × 8e-6 × √(2×9.8×0.18)</td><td>9.3 ml/s</td></tr>' +
      '<tr><th>箭速</th><td>Q / A受水壶</td><td>≈ 5.1 mm/s</td></tr>' +
      '<tr><th>百刻</th><td>一昼夜 100 刻(演示 100s,压缩 864:1)</td><td>—</td></tr>' +
      '</table><h4>运行期自检</h4>' +
      '<p>载入模拟 100s:恰走百刻(±1.5 刻)且流量公式自洽,否则拒绝启动。</p>' +
      '<h4>文献</h4>' +
      '<p>元代广州铜壶滴漏,延祐三年(1316)冼运行等造,日壶/月壶/星壶/受水壶四级,铜箭随浮舟上升读时刻——中国现存最完整的古代计时器。</p>'
  };
})(window.MECH = window.MECH || {});
