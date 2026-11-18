/* 铜壶滴漏部件建模与注册(11 件)。
   四级铜壶阶梯(日壶最高左 → 受水壶最低右),浮舟托铜箭在受水壶中
   随滴匀升;水滴粒子沿滴管下落;箭面百刻分度。 */
(function (MECH) {
  var P = MECH.P, M3 = null, D = MECH.DIM;

  function group() { return new THREE.Group(); }

  function buildStand() {   // 阶梯架(四级台阶)+ 底座
    var g = group();
    g.add(P.box(3.4, 0.10, 1.1, M3.woodD, 0, 0.05, 0));
    /* 四级台阶高度:日壶 1.35 → 月 1.05 → 星 0.75 → 受水 0.45 */
    [1.35, 1.05, 0.75].forEach(function (y, k) {
      g.add(P.box(0.78, y, 0.9, M3.wood, -1.15 + k * 0.78, y / 2, 0));
    });
    g.add(P.box(0.78, 0.45, 0.9, M3.wood, 1.19, 0.225, 0));
    return g;
  }

  function buildPot(name, y, r, h) {   // 铜壶(开口圆柱 + 底锥)
    var g = group();
    g.add(P.cyl(r, r * 0.82, h, M3.bronze, 0, h / 2, 0, 26));
    g.add(P.torus(r, 0.02, M3.gold, 0, h, 0, 26));
    g.children[1].rotation.x = P.ROTX;
    var water = P.cyl(r * 0.92, r * 0.92, h * 0.72, new THREE.MeshStandardMaterial({ color: 0x2E6E8E, transparent: true, opacity: 0.6, roughness: 0.3 }), 0, h * 0.34, 0, 22);
    g.add(water);
    g.userData.water = water;
    return { group: g };
  }

  function buildFloatArrow() {  // 浮舟 + 铜箭(百刻分度)
    var g = group();
    var boat = P.cyl(0.10, 0.115, 0.06, M3.woodD, 0, 0.03, 0, 18);
    g.add(boat);
    var arrow = group();
    arrow.add(P.box(0.022, D.arrowL, 0.006, M3.bronze, 0, D.arrowL / 2, 0));
    for (var k = 1; k <= 10; k++) {
      arrow.add(P.box(0.03, 0.004, 0.008, M3.gold, 0, k / 10 * D.arrowL, 0));
    }
    var crown = P.mesh(new THREE.ConeGeometry(0.02, 0.05, 8), M3.gold, 0, D.arrowL + 0.03, 0);
    arrow.add(crown);
    arrow.position.y = 0.06;
    g.add(arrow);
    g.userData.arrow = arrow;
    return { group: g };
  }

  function buildDroppers() {  // 三段滴管(日→月→星→受水)
    var g = group();
    var pipes = [];
    [[-1.15, 1.20, -0.37], [-0.37, 0.90, -0.07], [0.41, 0.60, 0.23]].forEach(function (c) {
      var pipe = P.cyl(0.016, 0.016, 0.42, M3.bronze, c[0] + 0.42, c[1] - 0.16, 0.34, 8);
      pipe.rotation.z = -0.35;
      g.add(pipe);
      pipes.push(pipe);
    });
    g.userData.pipes = pipes;
    return { group: g };
  }

  /* —— 注册 —— */
  MECH.PART_DEFS = function () {
    M3 = MECH.Scene3D.M;
    function def(o) { return MECH._def(o); }

    def({ id: "stand", name: "STAND · 四级阶梯架", sub: "仿广州铜壶滴漏(1316)", phase: 0, at: 0.15, dur: 1.4,
      build: buildStand, target: [0, 0, 0], start: [0, 4.4, 2.6], mid: [0, 2.6, 1.2], anchor: [0, 0.6, 0.7] });
    def({ id: "potSun", name: "POT · 日壶(最高)", sub: "溢流保水头恒定", phase: 0, at: 1.5, dur: 1.1, kind: "kine",
      build: function () { return buildPot("日", 1.35, 0.30, 0.42); }, target: [-1.15, 1.35, 0], off: [0, 1.6, 2.6] });
    def({ id: "potMoon", name: "POT · 月壶", sub: "二级", phase: 0, at: 2.2, dur: 1.1, kind: "kine",
      build: function () { return buildPot("月", 1.05, 0.28, 0.40); }, target: [-0.37, 1.05, 0], off: [0, 1.6, 2.6] });
    def({ id: "potStar", name: "POT · 星壶", sub: "三级", phase: 0, at: 2.9, dur: 1.1, kind: "kine",
      build: function () { return buildPot("星", 0.75, 0.26, 0.38); }, target: [0.41, 0.75, 0], off: [0, 1.6, 2.6] });
    def({ id: "potRec", name: "POT · 受水壶", sub: "浮箭所在", phase: 0, at: 3.6, dur: 1.1, kind: "kine",
      build: function () { return buildPot("受水", 0.45, 0.26, 0.36); }, target: [1.19, 0.45, 0], off: [0, 1.6, 2.6] });
    def({ id: "droppers", name: "PIPES · 滴管 ×3", sub: "Torricelli Q = C·A·√(2gh)", phase: 1, at: 5.4, dur: 1.2, kind: "kine",
      build: buildDroppers, target: [0, 0, 0], off: [0, 1.2, 2.0] });
    def({ id: "float", name: "FLOAT · 浮舟铜箭", sub: "百刻分度 · 匀速上升", phase: 2, at: 7.6, dur: 1.3, kind: "kine",
      build: buildFloatArrow, target: [1.19, 0.45, 0], off: [0, 1.4, 2.2] });
  };

  /* —— 运动学分发 —— */
  MECH.KINE = function (st) {
    var e = MECH.Parts.entry("float");
    if (e && e.shown) {
      var y0 = 0.10 + st.ke / D.ke * D.arrowL;     // 箭随刻上升
      e.group.position.y = 0.45 + y0;
    }
    /* 水滴粒子:沿滴管下落 */
    if (st._drops) {
      var n = st._drops.length;
      if (n > 0 && st._lastD !== n) {
        st._lastD = n;
        var dropFrom = [[-0.73, 1.28, 0.34], [0.05, 0.98, 0.34], [0.83, 0.68, 0.34]][st._drops.length % 3];
        MECH.Scene3D.spawnPuff(dropFrom[0], dropFrom[1], dropFrom[2], {
          max: 0.5, base: 0.035, vx: 0, vy: -0.9, vz: 0,
          opacity: 0.8, tint: 0x7FC4E0, grow: 0.6
        });
      }
    }
  };
})(window.MECH = window.MECH || {});
