import html2canvas from "html2canvas";
import JSZip from "jszip";

export var COMBINED_COLUMNS = 3;
export var COMBINED_FILENAME = "full-checklist.png";

export function sanitizeFilename(name) {
  var cleaned = String(name || "checklist")
    .replace(/[^\w\s-]+/g, "")
    .trim()
    .replace(/[\s_]+/g, "_");
  return cleaned || "checklist";
}

export function uniqueFilename(name, usedNames) {
  var base = sanitizeFilename(name);
  if (usedNames[base]) {
    usedNames[base] += 1;
    return base + "_" + usedNames[base];
  }
  usedNames[base] = 1;
  return base;
}

export function triggerBlobDownload(blob, filename) {
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(function() {
    URL.revokeObjectURL(link.href);
  }, 1000);
}

export function canvasToBlob(canvas) {
  return new Promise(function(resolve, reject) {
    canvas.toBlob(function(blob) {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Could not create PNG"));
      }
    }, "image/png");
  });
}

export function captureElementCanvas(element) {
  var backgroundColor = window.getComputedStyle(element).backgroundColor || "#ffffff";
  return html2canvas(element, {
    backgroundColor: backgroundColor,
    scale: 2,
    logging: false,
    useCORS: true
  });
}

export function stitchCanvases(canvases, columns, backgroundColor) {
  var colCount = Math.min(columns || COMBINED_COLUMNS, canvases.length);
  var rowCount = Math.ceil(canvases.length / colCount);
  var cellWidth = 0;
  var cellHeight = 0;
  canvases.forEach(function(canvas) {
    if (canvas.width > cellWidth) {
      cellWidth = canvas.width;
    }
    if (canvas.height > cellHeight) {
      cellHeight = canvas.height;
    }
  });

  var combined = document.createElement("canvas");
  combined.width = colCount * cellWidth;
  combined.height = rowCount * cellHeight;
  var ctx = combined.getContext("2d");
  ctx.fillStyle = backgroundColor || "#ffffff";
  ctx.fillRect(0, 0, combined.width, combined.height);
  canvases.forEach(function(canvas, index) {
    var x = (index % colCount) * cellWidth;
    var y = Math.floor(index / colCount) * cellHeight;
    ctx.drawImage(canvas, x, y);
  });
  return combined;
}

function pageBackgroundColor() {
  return window.getComputedStyle(document.documentElement).getPropertyValue("--page-bg").trim() || "#ffffff";
}

export function downloadChecklistPngs(cards, options) {
  if (!cards || cards.length === 0) {
    return Promise.resolve();
  }
  var columns = (options && options.columns) || COMBINED_COLUMNS;
  var includeCombined = !(options && options.includeCombined === false);

  var captured = [];
  var chain = Promise.resolve();

  cards.forEach(function(card) {
    chain = chain.then(function() {
      return captureElementCanvas(card.element).then(function(canvas) {
        captured.push({ title: card.title, canvas: canvas });
      });
    });
  });

  return chain.then(function() {
    if (captured.length === 1) {
      return canvasToBlob(captured[0].canvas).then(function(blob) {
        triggerBlobDownload(blob, sanitizeFilename(captured[0].title) + ".png");
      });
    }

    var zip = new JSZip();
    var usedNames = {};
    var blobChain = Promise.resolve();

    captured.forEach(function(item) {
      blobChain = blobChain.then(function() {
        return canvasToBlob(item.canvas).then(function(blob) {
          zip.file(uniqueFilename(item.title, usedNames) + ".png", blob);
        });
      });
    });

    return blobChain.then(function() {
      if (!includeCombined || columns < 2) {
        return;
      }
      var combined = stitchCanvases(
        captured.map(function(item) {
          return item.canvas;
        }),
        columns,
        pageBackgroundColor()
      );
      return canvasToBlob(combined).then(function(blob) {
        zip.file(COMBINED_FILENAME, blob);
      });
    }).then(function() {
      return zip.generateAsync({ type: "blob" });
    }).then(function(zipBlob) {
      triggerBlobDownload(zipBlob, "checklist-png.zip");
    });
  });
}
