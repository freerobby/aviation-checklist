import html2canvas from "html2canvas";
import JSZip from "jszip";

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

export function captureElementPng(element) {
  var backgroundColor = window.getComputedStyle(element).backgroundColor || "#ffffff";
  return html2canvas(element, {
    backgroundColor: backgroundColor,
    scale: 2,
    logging: false,
    useCORS: true
  }).then(canvasToBlob);
}

export function downloadChecklistPngs(cards) {
  if (!cards || cards.length === 0) {
    return Promise.resolve();
  }

  if (cards.length === 1) {
    return captureElementPng(cards[0].element).then(function(blob) {
      triggerBlobDownload(blob, sanitizeFilename(cards[0].title) + ".png");
    });
  }

  var zip = new JSZip();
  var usedNames = {};
  var chain = Promise.resolve();

  cards.forEach(function(card) {
    chain = chain.then(function() {
      return captureElementPng(card.element).then(function(blob) {
        zip.file(uniqueFilename(card.title, usedNames) + ".png", blob);
      });
    });
  });

  return chain.then(function() {
    return zip.generateAsync({ type: "blob" });
  }).then(function(zipBlob) {
    triggerBlobDownload(zipBlob, "checklist-png.zip");
  });
}
