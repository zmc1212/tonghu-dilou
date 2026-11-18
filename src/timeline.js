/* 时间线(44s):四级壶架 → 滴管 → 浮舟箭 → 注水齐平溢流 → 计时百刻快进 →
   滴孔特写 → 箭面读数 → 总结 */
(function (MECH) {
  var KS = MECH.KS, D = MECH.DIM;

  MECH.PHASES = [
    { id: "stand", name: "STAND · 四级壶架", dur: 4, dot: "yellow", mode: "ASSEMBLING",
      cam: { theta: 0.55, phi: 1.20, r: 7.0, target: [0, 1.1, 0] }, drift: 0.03 },
    { id: "pots", name: "POTS · 四铜壶落位", dur: 5, dot: "teal", mode: "ASSEMBLING",
      cam: { theta: 0.35, phi: 1.22, r: 6.0, target: [-0.1, 1.2, 0] }, drift: 0.012 },
    { id: "pipes", name: "PIPES · 滴管三级", dur: 4, dot: "blue", mode: "ASSEMBLING",
      cam: { theta: 0.10, phi: 1.26, r: 5.2, target: [-0.1, 1.0, 0.3] }, drift: 0.008 },
    { id: "float", name: "FLOAT · 浮舟铜箭", dur: 4, dot: "orange", mode: "ASSEMBLING",
      cam: { theta: -0.30, phi: 1.24, r: 3.6, target: [1.19, 0.75, 0] }, drift: 0.01 },
    { id: "run", name: "RUN · 计时百刻(演示 100s)", dur: 9, dot: "green", mode: "TIMING",
      cam: { theta: 0.75, phi: 1.20, r: 6.4, target: [0, 1.0, 0] }, drift: 0.01 },
    { id: "closeup", name: "CLOSE · 滴孔特写", dur: 6, dot: "yellow", mode: "CLOSE-UP",
      cam: { theta: 0.20, phi: 1.28, r: 3.2, target: [-0.5, 1.0, 0.3] }, drift: 0.006 },
    { id: "read", name: "READ · 箭面读数", dur: 5, dot: "pink", mode: "READING",
      cam: { theta: -0.2, phi: 1.24, r: 2.6, target: [1.19, 0.75, 0] }, drift: 0.006 },
    { id: "summary", name: "SUMMARY · 恒定水头", dur: 5, dot: "green", mode: "REVIEW",
      cam: { theta: 0.0, phi: 1.14, r: 7.0, target: [0, 1.0, 0] }, drift: 0.05 }
  ];
  MECH.PHASE_IDS = ["stand", "pots", "pipes", "float", "run", "closeup", "read", "summary"];

  MECH.newState = KS.newState;

  MECH.tick = function (st, ph, pt, dt) {
    if (ph.id !== st.lastPhase) {
      st.lastPhase = ph.id;
      st.timing = ph.id === "run" || ph.id === "closeup" || ph.id === "read";
      if (!st.timing) st.keF = 0;            // 非计时段箭回落复位
    }
    var ke0 = st.ke;
    KS.step(st, dt);
    /* 过刻 → 铜壶滴声粒子 */
    if (Math.floor(st.keF) > Math.floor(ke0)) {
      MECH.Scene3D.spawnPuff(1.19, 0.58, 0, {
        max: 0.4, base: 0.06, vx: 0, vy: 0.15, vz: 0, opacity: 0.4, tint: 0x7FC4E0, grow: 1.2
      });
    }
  };

  MECH.status = function (st, ph, pt) {
    var ke = Math.floor(st.ke);
    var shi = Math.floor(st.ke / 100 * 12), kere = Math.floor((st.ke / 100 * 12 - shi) * 100);
    var pill = ph.name;
    if (ph.id === "run" || ph.id === "read") pill = ph.name + " · 第 " + ke + " 刻";
    return {
      mode: ph.mode,
      hot: ph.id === "run",
      pill: pill,
      a: ke + " 刻 / 100",
      b: "滴速 ×" + st.flowK.toFixed(1),
      c: "时辰 " + shi + " 又 " + kere + " 分"
    };
  };

  MECH.pinnedFor = function (ph) {
    function E(id) { var e = MECH.Parts.entry(id); return e ? (e.anchor || e.group) : null; }
    if (ph.id === "pots") return [{ id: "p-sun", obj: E("potSun"), text: "日壶 · 溢流保水头恒定" }];
    if (ph.id === "pipes") return [{ id: "p-pi", obj: E("droppers"), text: "Q = C·A·√(2gh) 恒定" }];
    if (ph.id === "float") return [{ id: "p-fl", obj: E("float"), text: "浮舟托铜箭 · 百刻分度" }];
    if (ph.id === "run" || ph.id === "read" || ph.id === "summary") return [
      { id: "p-fl", obj: E("float"), text: "箭匀速上升 = Q/A受水壶", tone: "white" },
      { id: "p-su", obj: E("potSun"), text: "水头 h 0.18m 恒定" }
    ];
    return [];
  };
})(window.MECH = window.MECH || {});
