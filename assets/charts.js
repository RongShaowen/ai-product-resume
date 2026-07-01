(function () {
  var root = document.documentElement;
  var style = getComputedStyle(root);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var accent3 = style.getPropertyValue('--accent3').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  function revealOnScroll() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
  }

  function countUp() {
    var counters = document.querySelectorAll('[data-count]');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = Number(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1100;
        var start = performance.now();
        function tick(now) {
          var progress = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { observer.observe(el); });
  }

  function initNavigation() {
    var links = document.querySelectorAll('.nav-link');
    var sections = Array.prototype.map.call(links, function (link) {
      return document.querySelector(link.getAttribute('href'));
    }).filter(Boolean);
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(function (section) { observer.observe(section); });
  }

  function initFilters() {
    var buttons = document.querySelectorAll('[data-filter]');
    var cards = document.querySelectorAll('[data-tags]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        cards.forEach(function (card) {
          var tags = card.getAttribute('data-tags');
          var visible = filter === '全部' || tags.indexOf(filter) !== -1;
          card.classList.toggle('hidden', !visible);
        });
      });
    });
  }

  function initProjectDetails() {
    var buttons = document.querySelectorAll('[data-toggle-project]');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var target = document.getElementById(button.getAttribute('data-toggle-project'));
        if (!target) return;
        var isOpen = target.classList.toggle('open');
        button.textContent = isOpen ? '收起项目详情' : '展开项目详情';
      });
    });
  }

  function initCapabilityHover() {
    var chips = document.querySelectorAll('[data-capability]');
    var projects = document.querySelectorAll('[data-tags]');
    chips.forEach(function (chip) {
      chip.addEventListener('mouseenter', function () {
        var cap = chip.getAttribute('data-capability');
        projects.forEach(function (project) {
          project.classList.toggle('linked', project.getAttribute('data-tags').indexOf(cap) !== -1);
        });
      });
      chip.addEventListener('mouseleave', function () {
        projects.forEach(function (project) { project.classList.remove('linked'); });
      });
      chip.addEventListener('click', function () {
        var cap = chip.getAttribute('data-capability');
        var filterButton = document.querySelector('[data-filter="' + cap + '"]');
        if (filterButton) filterButton.click();
        document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function radarChart() {
    var el = document.getElementById('chart-capabilities');
    if (!el || !window.echarts) return;
    var chart = echarts.init(el, null, { renderer: 'svg' });
    chart.setOption({
      animation: false,
      color: [accent],
      tooltip: { appendToBody: true },
      radar: {
        radius: '66%',
        splitNumber: 4,
        axisName: { color: muted, fontSize: 12 },
        splitLine: { lineStyle: { color: rule } },
        axisLine: { lineStyle: { color: rule } },
        splitArea: { areaStyle: { color: [bg2, 'transparent'] } },
        indicator: [
          { name: '产品规划', max: 100 },
          { name: 'PRD 输出', max: 100 },
          { name: 'AI 工具落地', max: 100 },
          { name: '数据建模', max: 100 },
          { name: '政策研究', max: 100 },
          { name: '跨部门协作', max: 100 },
          { name: '科研分析', max: 100 },
          { name: '客户理解', max: 100 }
        ]
      },
      series: [{
        type: 'radar',
        data: [{
          value: [86, 82, 88, 84, 90, 78, 88, 72],
          name: '能力画像',
          areaStyle: { color: accent + '33' },
          lineStyle: { color: accent, width: 3 },
          itemStyle: { color: accent }
        }]
      }]
    });
    window.addEventListener('resize', function () { chart.resize(); });
  }

  function impactChart() {
    var el = document.getElementById('chart-impact');
    if (!el || !window.echarts) return;
    var chart = echarts.init(el, null, { renderer: 'svg' });
    chart.setOption({
      animation: false,
      color: [accent, accent2, accent3],
      tooltip: { appendToBody: true, trigger: 'axis' },
      grid: { left: 42, right: 20, top: 28, bottom: 56 },
      xAxis: {
        type: 'category',
        axisLabel: { color: muted, rotate: 20 },
        axisLine: { lineStyle: { color: rule } },
        data: ['政策 Agent', '能耗模型', '总计']
      },
      yAxis: {
        type: 'value',
        name: '人日/年',
        nameTextStyle: { color: muted },
        axisLabel: { color: muted },
        splitLine: { lineStyle: { color: rule } }
      },
      series: [{
        type: 'bar',
        barWidth: 36,
        data: [
          { value: 87, itemStyle: { color: accent } },
          { value: 15, itemStyle: { color: accent2 } },
          { value: 102, itemStyle: { color: accent3 } }
        ],
        label: { show: true, position: 'top', color: ink, formatter: '{c}' }
      }]
    });
    window.addEventListener('resize', function () { chart.resize(); });
  }

  function matrixChart() {
    var el = document.getElementById('chart-matrix');
    if (!el || !window.echarts) return;
    var chart = echarts.init(el, null, { renderer: 'svg' });
    chart.setOption({
      animation: false,
      color: [accent, accent2, accent3],
      tooltip: {
        appendToBody: true,
        formatter: function (p) {
          return p.data[2] + '<br>业务影响力：' + p.data[0] + '<br>方法复杂度：' + p.data[1];
        }
      },
      grid: { left: 46, right: 22, top: 22, bottom: 48 },
      xAxis: {
        min: 0,
        max: 100,
        name: '业务影响力',
        nameTextStyle: { color: muted },
        axisLabel: { color: muted },
        splitLine: { lineStyle: { color: rule } }
      },
      yAxis: {
        min: 0,
        max: 100,
        name: '方法复杂度',
        nameTextStyle: { color: muted },
        axisLabel: { color: muted },
        splitLine: { lineStyle: { color: rule } }
      },
      series: [{
        type: 'scatter',
        symbolSize: function (data) { return data[3]; },
        data: [
          [92, 86, '政策分析 Agent', 44],
          [78, 82, '行业能耗预测模型', 36],
          [82, 70, '风电需求转化', 34],
          [62, 74, '竹基炭中试生产', 28],
          [58, 78, '炭基光催化研究', 26]
        ],
        label: {
          show: true,
          formatter: function (p) { return p.data[2]; },
          position: 'top',
          color: ink,
          fontSize: 11
        },
        itemStyle: { color: accent + 'bb', borderColor: accent2, borderWidth: 2 }
      }]
    });
    window.addEventListener('resize', function () { chart.resize(); });
  }

  function initialize() {
    revealOnScroll();
    countUp();
    initNavigation();
    initFilters();
    initProjectDetails();
    initCapabilityHover();
    radarChart();
    impactChart();
    matrixChart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
