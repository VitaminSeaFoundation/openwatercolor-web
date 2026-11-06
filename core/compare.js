/*
 * The shareable before/after image, drawn onto any CanvasRenderingContext2D-like context:
 * an HTML canvas in the browser, a canvas type="2d" node in a WeChat mini program.
 * Exposes window.UnderwaterCompare in a browser, module.exports in CommonJS.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.UnderwaterCompare = api;
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var MAX_EDGE = 1800;
  var LABEL_FONT = '"Hiragino Sans GB", "PingFang SC", "Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif';

  /*
   * One vertical page: a portrait photo keeps its shape, split exactly down the middle into before and after;
   * anything else stacks the two photos. Returns the canvas size and where each part goes.
   */
  function layout(width, height) {
    var split = height > width;
    var scale = Math.min(1, MAX_EDGE / (split ? height : Math.max(width, height * 2)));
    var panelWidth = Math.max(1, Math.round(width * scale));
    var panelHeight = Math.max(1, Math.round(height * scale));
    var shortEdge = Math.min(panelWidth, panelHeight);
    var gap = Math.max(2, Math.round(shortEdge * 0.012));
    var afterY = split ? 0 : panelHeight + gap;
    var fontSize = Math.max(12, Math.round(shortEdge * 0.05));
    return {
      split: split,
      width: panelWidth,
      height: afterY + panelHeight,
      panelWidth: panelWidth,
      panelHeight: panelHeight,
      gap: gap,
      afterY: afterY,
      fontSize: fontSize,
      inset: Math.round(fontSize * 0.8)
    };
  }

  function drawLabel(context, text, x, y, fontSize) {
    var paddingX = Math.round(fontSize * 0.75);
    var pillHeight = Math.round(fontSize * 1.9);
    var radius = pillHeight / 2;
    context.font = "700 " + fontSize + "px " + LABEL_FONT;
    var pillWidth = context.measureText(text).width + paddingX * 2;
    context.fillStyle = "rgba(3, 32, 58, 0.72)";
    context.beginPath();
    context.arc(x + radius, y + radius, radius, Math.PI / 2, Math.PI * 1.5);
    context.arc(x + pillWidth - radius, y + radius, radius, -Math.PI / 2, Math.PI / 2);
    context.closePath();
    context.fill();
    context.fillStyle = "#fff";
    context.textBaseline = "middle";
    context.fillText(text, x + paddingX, y + radius);
  }

  /*
   * context must already be sized to plan.width x plan.height.
   * before / after are anything drawImage accepts on that platform; labels = { before, after }.
   */
  function draw(context, plan, before, after, labels) {
    var middle = plan.panelWidth / 2;
    context.imageSmoothingQuality = "high";
    context.fillStyle = "#fff";
    context.fillRect(0, 0, plan.width, plan.height);
    context.drawImage(before, 0, 0, plan.panelWidth, plan.panelHeight);
    if (plan.split) {
      context.save();
      context.beginPath();
      context.rect(middle, 0, middle, plan.panelHeight);
      context.clip();
    }
    context.drawImage(after, 0, plan.afterY, plan.panelWidth, plan.panelHeight);
    if (plan.split) {
      context.restore();
      context.fillStyle = "#fff";
      context.fillRect(middle - plan.gap / 2, 0, plan.gap, plan.panelHeight);
    }
    drawLabel(context, labels.before, plan.inset, plan.inset, plan.fontSize);
    drawLabel(context, labels.after, (plan.split ? middle : 0) + plan.inset, plan.afterY + plan.inset, plan.fontSize);
  }

  return { layout: layout, draw: draw };
}));
