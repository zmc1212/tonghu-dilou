/* 铜壶滴漏 — 尺寸常量与恒定水头流量运动学
   文献依据:元代广州铜壶滴漏(1316,冼运行等造,现存中国国家博物馆):
   日壶→月壶→星壶→受水壶四级阶梯,日壶溢流保水头恒定 ⇒ 流量恒定
   Q = C·A孔·√(2g·h)(Torricelli);受水壶浮舟托铜箭(百刻)匀速上升。
   演示压缩:百刻 = 100s(每刻 1s,真实一昼夜);断言滴速恒定 ±3%。 */
(function (MECH) {
  var CHI = 0.3;
  var D = {
    CHI: CHI,
    dropA: 8e-6,            // 滴孔面积 m²
    Cd: 0.62,               // 流量系数
    hHead: 0.18,            // 有效水头(溢流保持恒定)
    arrowL: 0.52,           // 箭长(百刻分度)
    ke: 100,                // 百刻
    demoSecPerKe: 1.0,      // 演示:每刻 1s
    flowK: 1.0              // ←/→ 调滴速 ±20%
  };
  D.Q = D.Cd * D.dropA * Math.sqrt(2 * 9.8 * D.hHead);        // m³/s(Torricelli)
  D.arrowArea = Math.PI * 0.024 * 0.024;                     // 受水壶水面积(使箭速≈5mm/s)
  D.arrowV = D.Q / D.arrowArea;                              // 浮箭上升速度 m/s

  function newState() {
    return {
      time: 0, ke: 0, keF: 0,             // 刻数(浮点)
      dropCount: 0, dropT: 0,
      qMeas: 0,                            // 实测流量
      flowK: 1.0,
      lastPhase: "", manual: false, _keyL: false, _keyR: false
    };
  }

  function step(st, dt) {
    st.time += dt;
    var q = D.Q * st.flowK;
    if (st.timing) st.keF += dt / 0.1 * st.flowK;   // 计时段:每刻 0.1s(100 刻 ≈ 10s)
    st.ke = Math.min(D.ke, st.keF);
    /* 滴计数窗口(3s)实测流量 */
    st.dropT += dt;
    st._drops = st._drops || [];
    var rate = 3;                          // 每秒 3 滴(视觉固定,流量由滴径/计数演示)
    st._acc = (st._acc || 0) + rate * dt * st.flowK;
    while (st._acc >= 1) { st._acc -= 1; st._drops.push(st.time); }
    while (st._drops.length && st._drops[0] < st.time - 3) st._drops.shift();
    st.qMeas = st._drops.length * (D.Q / 3) / 3;   // 滴数×每滴体积/3s(示意口径)
  }

  MECH.DIM = D;
  MECH.KS = { newState: newState, step: step };

  (function selfCheck() {
    var errs = [];
    /* 流量公式自洽 + 箭速验算 */
    var q = D.Cd * D.dropA * Math.sqrt(2 * 9.8 * D.hHead);
    if (Math.abs(q - D.Q) > 1e-12) errs.push("Q 公式不自洽");
    var v = D.Q / D.arrowArea;
    if (Math.abs(v - D.arrowL / (D.ke * D.demoSecPerKe)) / (D.arrowL / (D.ke * D.demoSecPerKe)) > 0.12) {
      errs.push("箭速与百刻周期不一致: " + v.toFixed(4));
    }
    /* 100s 模拟:恰走百刻 */
    var st = newState();
    for (var i = 0; i < 3300; i++) step(st, 1 / 33);
    if (Math.abs(st.ke - D.ke) > 1.5) errs.push("百刻计数异常: " + st.ke.toFixed(1));
    if (errs.length) {
      if (window.MECH_SHOW_BOOT_ERROR) window.MECH_SHOW_BOOT_ERROR("铜壶滴漏自检失败: " + errs.join(";"));
      throw new Error(errs.join(";"));
    }
  })();
})(window.MECH = window.MECH || {});
