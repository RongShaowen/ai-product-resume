(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var accent3 = style.getPropertyValue('--accent3').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  function init(id, option) {
    var el = document.getElementById(id);
    if (!el || !window.echarts) return;
    var chart = echarts.init(el, null, { renderer: 'svg' });
    chart.setOption(option);
    window.addEventListener('resize', function () { chart.resize(); });
  }

  var months = ['25.08', '25.09', '25.10', '25.11', '25.12', '26.01', '26.02', '26.03'];
  var lines = ['制造认知', '市场测算', '数据建模', '政策SOP', 'AI工作流', '周报专题'];
  var raw = [
    [0, 0, 3], [1, 0, 3],
    [1, 1, 2], [2, 1, 4],
    [2, 2, 3], [3, 2, 5],
    [3, 3, 4], [4, 3, 5], [5, 3, 4], [7, 3, 5],
    [3, 4, 4], [4, 4, 5],
    [4, 5, 4], [5, 5, 5], [6, 5, 3], [7, 5, 4]
  ];
  var heatmap = [];
  lines.forEach(function (_, y) {
    months.forEach(function (_, x) {
      var found = raw.find(function (d) { return d[0] === x && d[1] === y; });
      heatmap.push(found || [x, y, '-']);
    });
  });

  init('chart-parallel-summary', {
    animation: false,
    tooltip: {
      appendToBody: true,
      formatter: function (p) {
        var v = p.value[2] === '-' ? '未作为主线展开' : '活跃度 ' + p.value[2] + '/5';
        return '<strong>' + months[p.value[0]] + '</strong><br>' + lines[p.value[1]] + '<br>' + v;
      }
    },
    grid: { top: 28, left: 76, right: 24, bottom: 48 },
    xAxis: {
      type: 'category',
      data: months,
      axisLabel: { color: muted },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false },
      splitArea: { show: false }
    },
    yAxis: {
      type: 'category',
      data: lines,
      axisLabel: { color: ink },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false },
      splitArea: { show: false }
    },
    visualMap: {
      min: 0,
      max: 5,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      textStyle: { color: muted },
      inRange: { color: [bg2, accent2, accent] },
      outOfRange: { color: 'transparent' }
    },
    series: [{
      type: 'heatmap',
      data: heatmap,
      label: {
        show: true,
        formatter: function (p) { return p.value[2] === '-' ? '' : p.value[2]; },
        color: ink,
        fontWeight: 700
      }
    }]
  });

  init('chart-ai-flow', {
    animation: false,
    tooltip: { appendToBody: true, trigger: 'axis' },
    grid: { left: 36, right: 18, top: 24, bottom: 62 },
    xAxis: {
      type: 'category',
      data: ['准入', '清洗', '抽取', '研判', '证据', '推演', '建议', '校验'],
      axisLabel: { color: muted, rotate: 20 },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      max: 5,
      axisLabel: { color: muted },
      splitLine: { lineStyle: { color: rule } }
    },
    series: [{
      type: 'bar',
      barWidth: 24,
      data: [3, 4, 4, 5, 4, 5, 4, 5],
      itemStyle: {
        color: function (p) {
          return [accent2, accent2, accent, accent, accent3, accent, accent3, accent2][p.dataIndex];
        }
      },
      label: { show: true, position: 'top', color: ink }
    }]
  });

  init('chart-proof-matrix', {
    animation: false,
    tooltip: {
      appendToBody: true,
      formatter: function (p) {
        return '<strong>' + p.data[3] + '</strong><br>业务证据强度：' + p.data[0] + '<br>产品化程度：' + p.data[1];
      }
    },
    grid: { left: 48, right: 22, top: 22, bottom: 48 },
    xAxis: {
      name: '业务证据强度',
      min: 0,
      max: 100,
      nameTextStyle: { color: muted },
      axisLabel: { color: muted },
      splitLine: { lineStyle: { color: rule } }
    },
    yAxis: {
      name: '产品化程度',
      min: 0,
      max: 100,
      nameTextStyle: { color: muted },
      axisLabel: { color: muted },
      splitLine: { lineStyle: { color: rule } }
    },
    series: [{
      type: 'scatter',
      symbolSize: function (d) { return d[2]; },
      data: [
        [92, 88, 38, '政策分析工作流'],
        [86, 82, 34, '能源预测工具'],
        [78, 72, 28, '海外政策需求转化'],
        [68, 58, 23, '制造现场认知'],
        [74, 64, 25, '周报/月报专题输出']
      ],
      label: {
        show: true,
        formatter: function (p) { return p.data[3]; },
        position: 'top',
        color: ink,
        fontSize: 11
      },
      itemStyle: {
        color: function (p) {
          return [accent, accent2, accent3, accent2 + 'cc', muted][p.dataIndex];
        },
        opacity: 0.86
      }
    }]
  });

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });
})();
