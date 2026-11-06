/*
 * Underwater colour restoration: the platform-neutral colour model.
 * Runs unchanged in a browser (classic script, exposes window.UnderwaterCore)
 * and in a WeChat mini program (CommonJS). No DOM, no canvas: it works on RGBA pixel arrays.
 * The algorithm is described under "Image processing" in README.md.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.UnderwaterCore = api;
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var MAX_EDGE = 1800;
  var MAX_PIXELS = 1400000;
  var MAX_FILE_BYTES = 25 * 1024 * 1024;
  var CHUNK_PIXELS = 100000;

  function clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
  }

  /* Long loops hand the thread back between chunks, so animations and input keep running. */
  function yieldToUI() {
    return new Promise(function (resolve) {
      setTimeout(resolve, 0);
    });
  }

  /* Colour model constants: see "Image processing" in README.md. */
  var CAST_NONE = 0.08;           // (G - R) / G below this: not an underwater cast, photo is left alone
  var CAST_FULL = 0.42;           // above this: full correction
  var RED_TARGET = 0.95;           // R : G that non-water areas are solved towards
  var BLUE_TARGET = 0.8;          // B : G that non-water areas are solved towards
  var MAX_RED_BOOST = 1.2;
  var WATER_PROTECT = 0.85;       // how much open water is shielded from the correction
  var LOCAL_SOLVE = 0.5;          // 0 = one correction for the photo, 1 = fully per tile
  var FIELD_COLUMNS = 8;
  var WATER_MASK_CELL = 12;       // pixels per cell of the blurred water mask
  var WHITE_POINT_SPREAD = 0.8;    // no channel's white point may sit below this share of the brightest
  var MIN_LEVEL_RANGE = 0.45;     // limits the level stretch to about 2x
  var BLACK_POINT = 0.6;          // share of the darkest level removed as veil
  var CLARITY = 0.2;
  var DARK_AREA_LIFT = 0.3;
  var SATURATION = 1.1;
  var SHOULDER_KNEE = 0.74;

  /* -50 to +50 onto a range around the default, so that 0 is exactly the default. */
  function centered(value, low, middle, high) {
    return value < 0 ? middle + (low - middle) * (-value / 50) : middle + (high - middle) * (value / 50);
  }

  function tuningFor(warmth, water, clarity) {
    var redTarget = centered(warmth, 0.7, RED_TARGET, 1.2);
    return {
      redTarget: redTarget,
      maxRedBoost: MAX_RED_BOOST * (redTarget / RED_TARGET),
      blueTarget: centered(warmth, 0.9, BLUE_TARGET, 0.7),
      waterProtect: centered(water, 0.4, WATER_PROTECT, 1),
      clarity: centered(clarity, 0, CLARITY, 0.6),
      blackPoint: centered(clarity, 0.2, BLACK_POINT, 0.95)
    };
  }

  function smoothstep(low, high, value) {
    var t = clamp((value - low) / (high - low), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function softShoulder(value) {
    if (value <= SHOULDER_KNEE) return Math.max(0, value);
    return SHOULDER_KNEE + (1 - SHOULDER_KNEE) * (1 - Math.exp(-(value - SHOULDER_KNEE) / (1 - SHOULDER_KNEE)));
  }

  function waterAmount(green, blue) {
    return smoothstep(-0.18, 0.25, (blue - green) / Math.max(0.02, blue));
  }

  /* The red channel is too sparse to scale, so red is rebuilt from green: half of it above the veil level. */
  function redSource(green, veil) {
    return (green + Math.max(0, green - veil) / (1 - veil)) / 2;
  }

  function luminanceOf(red, green, blue) {
    return red * 0.299 + green * 0.587 + blue * 0.114;
  }

  function percentile(histogram, count, fraction) {
    var target = Math.max(1, Math.floor(count * fraction));
    var total = 0;
    var value;
    for (value = 0; value < histogram.length; value += 1) {
      total += histogram[value];
      if (total >= target) return value;
    }
    return histogram.length - 1;
  }

  function createField(columns, rows) {
    return { columns: columns, rows: rows, values: new Float32Array(columns * rows) };
  }

  function tileOf(pixel, width, height, columns, rows) {
    var tileX = Math.min(columns - 1, Math.floor((pixel % width) / width * columns));
    var tileY = Math.min(rows - 1, Math.floor(Math.floor(pixel / width) / height * rows));
    return tileY * columns + tileX;
  }

  function blurField(field) {
    var result = createField(field.columns, field.rows);
    var row;
    var column;
    for (row = 0; row < field.rows; row += 1) {
      for (column = 0; column < field.columns; column += 1) {
        var sum = 0;
        var dy;
        var dx;
        for (dy = -1; dy <= 1; dy += 1) {
          for (dx = -1; dx <= 1; dx += 1) {
            var nearRow = clamp(row + dy, 0, field.rows - 1);
            var nearColumn = clamp(column + dx, 0, field.columns - 1);
            sum += field.values[nearRow * field.columns + nearColumn] * (dx ? 1 : 2) * (dy ? 1 : 2);
          }
        }
        result.values[row * field.columns + column] = sum / 16;
      }
    }
    return result;
  }

  function sampleField(field, x, y, width, height) {
    var gridX = clamp((x + 0.5) / width * field.columns - 0.5, 0, field.columns - 1);
    var gridY = clamp((y + 0.5) / height * field.rows - 0.5, 0, field.rows - 1);
    var x0 = Math.floor(gridX);
    var y0 = Math.floor(gridY);
    var x1 = Math.min(field.columns - 1, x0 + 1);
    var y1 = Math.min(field.rows - 1, y0 + 1);
    var fx = gridX - x0;
    var fy = gridY - y0;
    var top = field.values[y0 * field.columns + x0] * (1 - fx) + field.values[y0 * field.columns + x1] * fx;
    var bottom = field.values[y1 * field.columns + x0] * (1 - fx) + field.values[y1 * field.columns + x1] * fx;
    return top * (1 - fy) + bottom * fy;
  }

  async function measureCast(pixels, pixelCount) {
    var greenHistogram = new Uint32Array(256);
    var redSum = 0;
    var greenSum = 0;
    var samples = 0;
    var step = Math.max(1, Math.floor(pixelCount / 180000));
    var start;

    for (start = 0; start < pixelCount; start += CHUNK_PIXELS * step) {
      var end = Math.min(pixelCount, start + CHUNK_PIXELS * step);
      var pixel;
      for (pixel = start; pixel < end; pixel += step) {
        redSum += pixels[pixel * 4];
        greenSum += pixels[pixel * 4 + 1];
        greenHistogram[pixels[pixel * 4 + 1]] += 1;
        samples += 1;
      }
      await yieldToUI();
    }

    return {
      strength: smoothstep(CAST_NONE, CAST_FULL, (greenSum - redSum) / Math.max(1, greenSum)),
      veil: Math.min(0.9, percentile(greenHistogram, samples, 0.005) / 255)
    };
  }

  /* Solve per tile how much red to add and how to scale blue so non-water areas reach the target ratios. */
  async function solveCorrection(pixels, width, height, veil, tuning) {
    var pixelCount = width * height;
    var columns = FIELD_COLUMNS;
    var rows = Math.max(2, Math.round(columns * height / width));
    var tileCount = columns * rows;
    var greenSums = new Float64Array(tileCount);
    var redSums = new Float64Array(tileCount);
    var sourceSums = new Float64Array(tileCount);
    var blueSums = new Float64Array(tileCount);
    var totals = [0, 0, 0, 0];
    var step = Math.max(1, Math.floor(pixelCount / 240000));
    var start;

    for (start = 0; start < pixelCount; start += CHUNK_PIXELS * step) {
      var end = Math.min(pixelCount, start + CHUNK_PIXELS * step);
      var pixel;
      for (pixel = start; pixel < end; pixel += step) {
        var red = pixels[pixel * 4] / 255;
        var green = pixels[pixel * 4 + 1] / 255;
        var blue = pixels[pixel * 4 + 2] / 255;
        var weight = 1 - tuning.waterProtect * waterAmount(green, blue);
        var tile = tileOf(pixel, width, height, columns, rows);
        greenSums[tile] += weight * green;
        redSums[tile] += weight * red;
        sourceSums[tile] += weight * (1 - red) * redSource(green, veil) * weight;
        blueSums[tile] += weight * blue;
      }
      await yieldToUI();
    }

    var index;
    for (index = 0; index < tileCount; index += 1) {
      totals[0] += greenSums[index];
      totals[1] += redSums[index];
      totals[2] += sourceSums[index];
      totals[3] += blueSums[index];
    }

    function solveRed(green, red, source) {
      return clamp((tuning.redTarget * green - red) / Math.max(0.000001, source), 0, tuning.maxRedBoost);
    }
    function solveBlue(green, blue) {
      return clamp(tuning.blueTarget * green / Math.max(0.000001, blue), 0.72, 1.35);
    }

    var globalRed = solveRed(totals[0], totals[1], totals[2]);
    var globalBlue = solveBlue(totals[0], totals[3]);
    var redField = createField(columns, rows);
    var blueField = createField(columns, rows);
    for (index = 0; index < tileCount; index += 1) {
      var hasPixels = greenSums[index] + blueSums[index] > 0;
      var localRed = hasPixels ? solveRed(greenSums[index], redSums[index], sourceSums[index]) : globalRed;
      var localBlue = hasPixels ? solveBlue(greenSums[index], blueSums[index]) : globalBlue;
      redField.values[index] = globalRed + (localRed - globalRed) * LOCAL_SOLVE;
      blueField.values[index] = globalBlue + (localBlue - globalBlue) * LOCAL_SOLVE;
    }
    return { red: blurField(redField), blue: blurField(blueField) };
  }

  /* Decided on a blurred mask: per pixel, the water test flickers on surface ripples and JPEG blocks and leaves flecks of red. */
  async function buildExposureField(pixels, width, height, tuning) {
    var field = createField(Math.max(2, Math.round(width / WATER_MASK_CELL)), Math.max(2, Math.round(height / WATER_MASK_CELL)));
    var counts = new Uint32Array(field.values.length);
    var pixelCount = width * height;
    var start;
    for (start = 0; start < pixelCount; start += CHUNK_PIXELS) {
      var end = Math.min(pixelCount, start + CHUNK_PIXELS);
      var pixel;
      for (pixel = start; pixel < end; pixel += 1) {
        var tile = tileOf(pixel, width, height, field.columns, field.rows);
        field.values[tile] += 1 - tuning.waterProtect * waterAmount(pixels[pixel * 4 + 1] / 255, pixels[pixel * 4 + 2] / 255);
        counts[tile] += 1;
      }
      await yieldToUI();
    }
    var index;
    for (index = 0; index < field.values.length; index += 1) field.values[index] /= Math.max(1, counts[index]);
    return blurField(blurField(field));
  }

  async function correctColor(pixels, width, height, veil, correction, working, tuning) {
    var exposure = await buildExposureField(pixels, width, height, tuning);
    var pixelCount = width * height;
    var start;
    for (start = 0; start < pixelCount; start += CHUNK_PIXELS) {
      var end = Math.min(pixelCount, start + CHUNK_PIXELS);
      var pixel;
      for (pixel = start; pixel < end; pixel += 1) {
        var x = pixel % width;
        var y = Math.floor(pixel / width);
        var red = pixels[pixel * 4] / 255;
        var green = pixels[pixel * 4 + 1] / 255;
        var blue = pixels[pixel * 4 + 2] / 255;
        var exposed = sampleField(exposure, x, y, width, height);
        /* (1 - red) makes the added red fade out as red rises, so whites stay neutral instead of turning pink. */
        working[pixel * 3] = red + sampleField(correction.red, x, y, width, height) * (1 - red) * redSource(green, veil) * exposed;
        working[pixel * 3 + 1] = green;
        working[pixel * 3 + 2] = blue * (1 + (sampleField(correction.blue, x, y, width, height) - 1) * exposed);
      }
      await yieldToUI();
    }
  }

  /*
   * Remove most of the veil and set the white point. White points are kept close together and the stretch is
   * limited: a photo of open water has no bright object, and stretching its narrow red range would undo the blue.
   */
  async function stretchLevels(working, pixelCount, tuning) {
    var lows = [];
    var highs = [];
    var channel;
    var pixel;
    for (channel = 0; channel < 3; channel += 1) {
      var histogram = new Uint32Array(1024);
      for (pixel = 0; pixel < pixelCount; pixel += 1) {
        histogram[clamp(Math.floor(working[pixel * 3 + channel] * 1023), 0, 1023)] += 1;
      }
      lows[channel] = percentile(histogram, pixelCount, 0.002) / 1023 * tuning.blackPoint;
      highs[channel] = percentile(histogram, pixelCount, 0.997) / 1023;
      await yieldToUI();
    }
    var brightest = Math.max(highs[0], highs[1], highs[2]);
    for (channel = 0; channel < 3; channel += 1) {
      var high = Math.max(highs[channel], brightest * WHITE_POINT_SPREAD);
      var range = Math.max(high - lows[channel], MIN_LEVEL_RANGE);
      for (pixel = 0; pixel < pixelCount; pixel += 1) {
        working[pixel * 3 + channel] = (working[pixel * 3 + channel] - lows[channel]) / range * 0.96;
      }
      await yieldToUI();
    }
  }

  async function buildLuminanceField(working, width, height, columns, rows) {
    var field = createField(columns, rows);
    var counts = new Uint32Array(columns * rows);
    var pixelCount = width * height;
    var step = Math.max(1, Math.floor(pixelCount / 240000));
    var pixel;
    for (pixel = 0; pixel < pixelCount; pixel += step) {
      var tile = tileOf(pixel, width, height, columns, rows);
      field.values[tile] += luminanceOf(working[pixel * 3], working[pixel * 3 + 1], working[pixel * 3 + 2]);
      counts[tile] += 1;
    }
    var mean = 0;
    var filled = 0;
    var index;
    for (index = 0; index < field.values.length; index += 1) {
      if (!counts[index]) continue;
      field.values[index] /= counts[index];
      mean += field.values[index];
      filled += 1;
    }
    mean = filled ? mean / filled : 0.5;
    for (index = 0; index < field.values.length; index += 1) {
      if (!counts[index]) field.values[index] = mean;
    }
    await yieldToUI();
    return { field: blurField(field), mean: mean };
  }

  async function finishTone(pixels, width, height, strength, working, tuning) {
    var pixelCount = width * height;
    var columns = FIELD_COLUMNS;
    var rows = Math.max(2, Math.round(columns * height / width));
    var broad = await buildLuminanceField(working, width, height, columns, rows);
    var detail = await buildLuminanceField(working, width, height, Math.max(8, Math.round(width / 24)), Math.max(8, Math.round(height / 24)));
    var detailField = blurField(detail.field);
    var start;

    for (start = 0; start < pixelCount; start += CHUNK_PIXELS) {
      var end = Math.min(pixelCount, start + CHUNK_PIXELS);
      var pixel;
      for (pixel = start; pixel < end; pixel += 1) {
        var x = pixel % width;
        var y = Math.floor(pixel / width);
        var red = working[pixel * 3];
        var green = working[pixel * 3 + 1];
        var blue = working[pixel * 3 + 2];
        var luminance = luminanceOf(red, green, blue);
        var clarity = (luminance - sampleField(detailField, x, y, width, height)) * tuning.clarity * (1 - smoothstep(0.75, 1, luminance));
        var lift = clamp(Math.pow(broad.mean / Math.max(0.02, sampleField(broad.field, x, y, width, height)), DARK_AREA_LIFT), 0.92, 1.45);
        red = (red + clarity) * lift;
        green = (green + clarity) * lift;
        blue = (blue + clarity) * lift;
        luminance = luminanceOf(red, green, blue);
        var offset = pixel * 4;
        pixels[offset] += (softShoulder(luminance + (red - luminance) * SATURATION) * 255 - pixels[offset]) * strength;
        pixels[offset + 1] += (softShoulder(luminance + (green - luminance) * SATURATION) * 255 - pixels[offset + 1]) * strength;
        pixels[offset + 2] += (softShoulder(luminance + (blue - luminance) * SATURATION) * 255 - pixels[offset + 2]) * strength;
      }
      await yieldToUI();
    }
  }

  /* Returns false when the photo has no underwater cast and was left unchanged. */
  async function restoreColors(pixels, width, height, tuning) {
    var cast = await measureCast(pixels, width * height);
    if (cast.strength <= 0) return false;
    var correction = await solveCorrection(pixels, width, height, cast.veil, tuning);
    var working = new Float32Array(width * height * 3);
    await correctColor(pixels, width, height, cast.veil, correction, working, tuning);
    await stretchLevels(working, width * height, tuning);
    await finishTone(pixels, width, height, cast.strength, working, tuning);
    return true;
  }

  /* Working size for a photo: longest edge at most MAX_EDGE and at most MAX_PIXELS in total. */
  function fitSize(naturalWidth, naturalHeight) {
    var scale = Math.min(1, MAX_EDGE / Math.max(naturalWidth, naturalHeight));
    scale = Math.min(scale, Math.sqrt(MAX_PIXELS / (naturalWidth * naturalHeight)));
    return {
      width: Math.max(1, Math.round(naturalWidth * scale)),
      height: Math.max(1, Math.round(naturalHeight * scale))
    };
  }

  return {
    MAX_EDGE: MAX_EDGE,
    MAX_PIXELS: MAX_PIXELS,
    MAX_FILE_BYTES: MAX_FILE_BYTES,
    clamp: clamp,
    fitSize: fitSize,
    tuningFor: tuningFor,
    restoreColors: restoreColors
  };
}));
