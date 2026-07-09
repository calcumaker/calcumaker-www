// Hero 7-segment strip.
//
// The glyph table and bit layout are the ones the firmware actually uses
// (calcumaker-core `seg7.rs`: bit0=a … bit6=g, bit7=dp), so the marketing page
// lights the same segments the hardware would. 16 digit cells, right-aligned,
// exactly like one row of the real display.

const SVGNS = "http://www.w3.org/2000/svg";
const CELLS = 16;
const PITCH = 112;
const DIGIT_W = 100;
const DP = 0x80;

// bits: 0b dp g f e d c b a
const GLYPHS = {
  "0": 0x3f, "1": 0x06, "2": 0x5b, "3": 0x4f, "4": 0x66,
  "5": 0x6d, "6": 0x7d, "7": 0x07, "8": 0x7f, "9": 0x6f,
  A: 0x77, b: 0x7c, B: 0x7c, C: 0x39, c: 0x58, d: 0x5e, D: 0x5e,
  E: 0x79, F: 0x71, G: 0x3d, H: 0x76, h: 0x74, I: 0x06, i: 0x04,
  L: 0x38, n: 0x54, N: 0x54, o: 0x5c, O: 0x5c, P: 0x73, r: 0x50, R: 0x50,
  S: 0x6d, s: 0x6d, t: 0x78, T: 0x78, U: 0x3e, u: 0x1c, y: 0x6e, Y: 0x6e,
  "-": 0x40, _: 0x08, " ": 0x00,
};

/** Encode text to segment bytes; `.` folds into the previous cell's dp bit. */
function encode(text) {
  const cells = [];
  for (const ch of text) {
    if (ch === ".") {
      const last = cells.length - 1;
      if (last >= 0 && (cells[last] & DP) === 0) cells[last] |= DP;
      else cells.push(DP);
    } else {
      cells.push(GLYPHS[ch] ?? 0x00);
    }
  }
  return cells;
}

/** Right-align into CELLS cells, like the device's display window. */
function row(text) {
  const cells = encode(text).slice(-CELLS);
  return Array(CELLS - cells.length).fill(0).concat(cells);
}

// --- geometry: beveled bars, matching the emulator's renderer ---------------
const TH = 13;
const xL = 18, xR = 82, yT = 20, yM = 90, yB = 160;

const hbar = (cx, cy, len) => {
  const hl = len / 2, ht = TH / 2;
  return `${cx - hl},${cy} ${cx - hl + ht},${cy - ht} ${cx + hl - ht},${cy - ht} ` +
         `${cx + hl},${cy} ${cx + hl - ht},${cy + ht} ${cx - hl + ht},${cy + ht}`;
};
const vbar = (cx, cy, len) => {
  const hl = len / 2, ht = TH / 2;
  return `${cx},${cy - hl} ${cx + ht},${cy - hl + ht} ${cx + ht},${cy + hl - ht} ` +
         `${cx},${cy + hl} ${cx - ht},${cy + hl - ht} ${cx - ht},${cy - hl + ht}`;
};

// a, b, c, d, e, f, g — index-aligned with the bit order.
const SEG_POINTS = [
  hbar(50, yT, 64), vbar(xR, 55, 70), vbar(xR, 125, 70), hbar(50, yB, 64),
  vbar(xL, 125, 70), vbar(xL, 55, 70), hbar(50, yM, 64),
];
const BITS = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40];

function build(svg) {
  const digits = [];
  for (let d = 0; d < CELLS; d++) {
    const g = document.createElementNS(SVGNS, "g");
    g.setAttribute("transform", `translate(${d * PITCH + (PITCH - DIGIT_W) / 2},0)`);
    const segs = SEG_POINTS.map((pts) => {
      const p = document.createElementNS(SVGNS, "polygon");
      p.setAttribute("points", pts);
      p.setAttribute("class", "seg");
      g.appendChild(p);
      return p;
    });
    const dp = document.createElementNS(SVGNS, "circle");
    dp.setAttribute("cx", "93");
    dp.setAttribute("cy", String(yB));
    dp.setAttribute("r", "6.5");
    dp.setAttribute("class", "seg");
    g.appendChild(dp);
    svg.appendChild(g);
    digits.push({ segs, dp });
  }
  return digits;
}

function paint(digits, cells) {
  cells.forEach((byte, i) => {
    const { segs, dp } = digits[i];
    BITS.forEach((bit, s) => segs[s].classList.toggle("on", (byte & bit) !== 0));
    dp.classList.toggle("on", (byte & DP) !== 0);
  });
}

// Only characters the 7-segment can actually form.
const MESSAGES = [
  "dEAdbEEF",
  "3.14159265",
  "FFFF AnD 0F0F",
  "1.41421356",
  "16C 15C SCI FIn",
];

const svg = document.getElementById("segdisplay");
if (svg) {
  const digits = build(svg);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    paint(digits, row(MESSAGES[0]));
  } else {
    let i = 0;
    paint(digits, row(MESSAGES[0]));
    setInterval(() => {
      i = (i + 1) % MESSAGES.length;
      paint(digits, row("")); // brief blank, like a display refresh
      setTimeout(() => paint(digits, row(MESSAGES[i])), 90);
    }, 2800);
  }
}
