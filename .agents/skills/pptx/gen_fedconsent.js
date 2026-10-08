// FedConsent Health — 12-Slide Presentation Generator
// Google 4-colour brand palette, light mode, minimal & elegant
'use strict';
const pptxgen = require('pptxgenjs');

// ─── PALETTE ───────────────────────────────────────────────────────────────
const G = {
  blue:    '4285F4',
  green:   '34A853',
  yellow:  'FBBC04',
  red:     'EA4335',
  white:   'FFFFFF',
  offWhite:'F8F9FA',
  dark:    '1A1A2E',
  ink:     '202124',
  muted:   '5F6368',
  rule:    'E8EAED',
};

// ─── LAYOUT CONSTANTS ───────────────────────────────────────────────────────
const W = 10;     // slide width  (inches, LAYOUT_16x9)
const H = 5.625;  // slide height

// ─── HELPERS ────────────────────────────────────────────────────────────────
function accent(slide, color, x, y, w, h) {
  x = x !== undefined ? x : 0.5;
  y = y !== undefined ? y : 0.52;
  w = w !== undefined ? w : 0.35;
  h = h !== undefined ? h : 0.04;
  slide.addShape('RECTANGLE', { x, y, w, h, fill: { color }, line: { type: 'none' } });
}

function slideTitle(slide, text, opts) {
  opts = opts || {};
  var x = opts.x !== undefined ? opts.x : 0.5;
  var y = opts.y !== undefined ? opts.y : 0.6;
  var w = opts.w !== undefined ? opts.w : 9;
  var color = opts.color || G.ink;
  var size = opts.size || 36;
  slide.addText(text, { x, y, w, h: 0.9, fontSize: size, bold: true, color, fontFace: 'Calibri', margin: 0 });
}

function eyebrow(slide, text, color, opts) {
  color = color || G.blue;
  opts = opts || {};
  var x = opts.x !== undefined ? opts.x : 0.5;
  var y = opts.y !== undefined ? opts.y : 0.36;
  slide.addText(text, { x, y, w: 9, h: 0.28, fontSize: 11, color, fontFace: 'Calibri', margin: 0 });
}

function hRule(slide, opts) {
  opts = opts || {};
  var x = opts.x !== undefined ? opts.x : 0.5;
  var y = opts.y !== undefined ? opts.y : 1.42;
  var w = opts.w !== undefined ? opts.w : 9;
  var color = opts.color || G.rule;
  slide.addShape('RECTANGLE', { x, y, w, h: 0.015, fill: { color }, line: { type: 'none' } });
}

function footerBar(slide, label) {
  label = label || 'FedConsent Health  ·  HackQbit 2.0  ·  Team 44 — Umbrella Corporation';
  slide.addShape('RECTANGLE', { x: 0, y: H - 0.32, w: W, h: 0.32, fill: { color: G.offWhite }, line: { type: 'none' } });
  slide.addText(label, { x: 0.5, y: H - 0.3, w: W - 1, h: 0.28, fontSize: 9, color: G.muted, fontFace: 'Calibri', margin: 0 });
}

function colorDot(slide, color, x, y, r) {
  r = r !== undefined ? r : 0.22;
  slide.addShape('ELLIPSE', { x: x - r, y: y - r, w: r * 2, h: r * 2, fill: { color }, line: { type: 'none' } });
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD PRESENTATION
// ═══════════════════════════════════════════════════════════════════════════
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';

// ───────────────────────────────────────────────────────────────────────────
// SLIDE 01 — COVER
// ───────────────────────────────────────────────────────────────────────────
var s1 = pres.addSlide();
s1.addShape('RECTANGLE', { x: 0, y: 0, w: W, h: H, fill: { color: G.white }, line: { type: 'none' } });
[G.blue, G.green, G.yellow, G.red].forEach(function(c, i) {
  s1.addShape('RECTANGLE', { x: 0, y: i * (H / 4), w: 0.22, h: H / 4, fill: { color: c }, line: { type: 'none' } });
});
s1.addText('HackQbit 2.0  ·  Problem Statement 03  ·  Team 44 — Umbrella Corporation', {
  x: 0.45, y: 0.28, w: 9, h: 0.3, fontSize: 10, color: G.muted, fontFace: 'Calibri', margin: 0,
});
s1.addText('FedConsent Health', {
  x: 0.45, y: 0.68, w: 9, h: 1.0, fontSize: 50, bold: true, color: G.ink, fontFace: 'Calibri', margin: 0,
});
s1.addText('Privacy-Preserving AI Collaboration Across Hospitals', {
  x: 0.45, y: 1.66, w: 9, h: 0.5, fontSize: 18, color: G.blue, fontFace: 'Calibri', margin: 0,
});
s1.addShape('RECTANGLE', { x: 0.45, y: 2.3, w: 6, h: 0.03, fill: { color: G.rule }, line: { type: 'none' } });
s1.addText('Building collaborative healthcare AI without compromising patient privacy.', {
  x: 0.45, y: 2.46, w: 8, h: 0.5, fontSize: 14, color: G.ink, fontFace: 'Calibri', margin: 0,
});
s1.addShape('RECTANGLE', { x: 0.45, y: 3.12, w: 3.1, h: 0.34, fill: { color: G.offWhite }, line: { color: G.rule, pt: 1 } });
s1.addText('Healthcare & Artificial Intelligence', {
  x: 0.52, y: 3.14, w: 3, h: 0.3, fontSize: 11, color: G.muted, fontFace: 'Calibri', margin: 0,
});
s1.addText('Arkaprava Bhattacharya · Core Developer   |   Aritra Roy · UI Designer', {
  x: 0.45, y: 3.62, w: 9, h: 0.28, fontSize: 11, color: G.muted, fontFace: 'Calibri', margin: 0,
});
s1.addText('Jit Maji · Business Strategist   |   Vishal Raj · Developer', {
  x: 0.45, y: 3.92, w: 9, h: 0.28, fontSize: 11, color: G.muted, fontFace: 'Calibri', margin: 0,
});
footerBar(s1);

// ───────────────────────────────────────────────────────────────────────────
// SLIDE 02 — PROBLEM STATEMENT
// ───────────────────────────────────────────────────────────────────────────
var s2 = pres.addSlide();
s2.addShape('RECTANGLE', { x: 0, y: 0, w: W, h: H, fill: { color: G.white }, line: { type: 'none' } });
accent(s2, G.red);
eyebrow(s2, 'THE PROBLEM');
slideTitle(s2, 'Healthcare Data Isolated. AI Potential Limited.', { size: 30 });
hRule(s2, { y: 1.52 });
var problems = [
  { label: 'Data Silos', desc: 'Hospitals cannot share sensitive patient records freely.', c: G.blue },
  { label: 'Reduced Diversity', desc: 'Isolated datasets limit model generalizability.', c: G.green },
  { label: 'Privacy Risks', desc: 'Centralised collection raises privacy, security and trust concerns.', c: G.yellow },
  { label: 'No Patient Visibility', desc: 'Patients lack insight into how their data trains AI models.', c: G.red },
];
problems.forEach(function(p, i) {
  var col = i % 2;
  var row = Math.floor(i / 2);
  var x = 0.5 + col * 4.8;
  var y = 1.66 + row * 1.5;
  s2.addShape('RECTANGLE', { x, y, w: 4.4, h: 1.32, fill: { color: G.offWhite }, line: { color: G.rule, pt: 1 } });
  s2.addShape('RECTANGLE', { x, y, w: 0.18, h: 1.32, fill: { color: p.c }, line: { type: 'none' } });
  s2.addText(p.label, { x: x + 0.28, y: y + 0.1, w: 4, h: 0.3, fontSize: 14, bold: true, color: G.ink, fontFace: 'Calibri', margin: 0 });
  s2.addText(p.desc, { x: x + 0.28, y: y + 0.46, w: 3.9, h: 0.72, fontSize: 12, color: G.muted, fontFace: 'Calibri', margin: 0, wrap: true });
});
s2.addText('Healthcare AI needs collaboration without unrestricted patient data sharing.', {
  x: 0.5, y: H - 0.6, w: 9, h: 0.28, fontSize: 11, italic: true, color: G.blue, fontFace: 'Calibri', margin: 0,
});
footerBar(s2);

// ───────────────────────────────────────────────────────────────────────────
// SLIDE 03 — COMPETITORS
// ───────────────────────────────────────────────────────────────────────────
var s3 = pres.addSlide();
s3.addShape('RECTANGLE', { x: 0, y: 0, w: W, h: H, fill: { color: G.white }, line: { type: 'none' } });
accent(s3, G.yellow);
eyebrow(s3, 'LANDSCAPE');
slideTitle(s3, 'Existing Platforms & the Missing Link', { size: 28 });
hRule(s3);
var rows3 = [
  ['NVIDIA FLARE', 'Enterprise federated learning framework'],
  ['Flower',       'Flexible FL orchestration'],
  ['Rhino Health', 'Privacy-focused healthcare AI collaboration'],
  ['Owkin',        'Federated AI for biomedical research'],
  ['BeeKeeperAI',  'Confidential healthcare AI workflows'],
  ['Aridhia',      'Governed health data research environments'],
];
rows3.forEach(function(row, i) {
  var y = 1.55 + i * 0.46;
  s3.addText(row[0], { x: 0.5, y, w: 2.2, h: 0.38, fontSize: 12, bold: true, color: G.ink, fontFace: 'Calibri', margin: 0 });
  s3.addText(row[1], { x: 2.8, y, w: 3.5, h: 0.38, fontSize: 12, color: G.muted, fontFace: 'Calibri', margin: 0 });
  if (i < rows3.length - 1) s3.addShape('RECTANGLE', { x: 0.5, y: y + 0.4, w: 5.9, h: 0.01, fill: { color: G.rule }, line: { type: 'none' } });
});
s3.addShape('RECTANGLE', { x: 6.8, y: 1.45, w: 2.7, h: 3.72, fill: { color: G.offWhite }, line: { color: G.rule, pt: 1 } });
s3.addText('Our Differentiation', { x: 6.9, y: 1.54, w: 2.5, h: 0.3, fontSize: 13, bold: true, color: G.blue, fontFace: 'Calibri', margin: 0 });
var diffs3 = ['Patient consent linked to training', 'Patient-facing privacy receipts', 'Differential privacy accounting', 'Membership inference evaluation', 'Unified dashboard: metrics + audit'];
diffs3.forEach(function(d, i) {
  var dy = 1.92 + i * 0.5;
  colorDot(s3, G.green, 7.06, dy + 0.13, 0.1);
  s3.addText(d, { x: 7.22, y: dy, w: 2.18, h: 0.42, fontSize: 11, color: G.ink, fontFace: 'Calibri', margin: 0, wrap: true });
});
footerBar(s3);

// ───────────────────────────────────────────────────────────────────────────
// SLIDE 04 — OUR SOLUTION
// ───────────────────────────────────────────────────────────────────────────
var s4 = pres.addSlide();
s4.addShape('RECTANGLE', { x: 0, y: 0, w: W, h: H, fill: { color: G.white }, line: { type: 'none' } });
accent(s4, G.green);
eyebrow(s4, 'OUR SOLUTION');
slideTitle(s4, 'Introducing FedConsent Health', { size: 33 });
hRule(s4);
var pillars = [
  { label: 'Federated Learning',    desc: '3 hospitals train together via Flower; raw images stay local.', c: G.blue },
  { label: 'Patient Consent',       desc: 'Patients opt in or out; eligibility computed before each round.', c: G.green },
  { label: 'Differential Privacy',  desc: 'Opacus DP-SGD clips gradients and adds calibrated noise.', c: G.yellow },
  { label: 'Research Dashboard',    desc: 'Diagnostics, privacy parameters, and audit events in one view.', c: G.red },
];
pillars.forEach(function(p, i) {
  var x = 0.5 + i * 2.28;
  s4.addShape('RECTANGLE', { x, y: 1.62, w: 2.08, h: 2.8, fill: { color: G.offWhite }, line: { color: G.rule, pt: 1 } });
  s4.addShape('RECTANGLE', { x, y: 1.62, w: 2.08, h: 0.22, fill: { color: p.c }, line: { type: 'none' } });
  s4.addText(p.label, { x: x + 0.1, y: 1.9, w: 1.88, h: 0.48, fontSize: 13, bold: true, color: G.ink, fontFace: 'Calibri', margin: 0, wrap: true });
  s4.addText(p.desc, { x: x + 0.1, y: 2.44, w: 1.88, h: 1.8, fontSize: 12, color: G.muted, fontFace: 'Calibri', margin: 0, wrap: true });
});
s4.addText('Target users: Hospitals  ·  Medical researchers  ·  AI developers  ·  Patients', {
  x: 0.5, y: H - 0.6, w: 9, h: 0.26, fontSize: 11, italic: true, color: G.blue, fontFace: 'Calibri', margin: 0,
});
footerBar(s4);

// ───────────────────────────────────────────────────────────────────────────
// SLIDE 05 — HOW IT WORKS  (KEY SLIDE)
// ───────────────────────────────────────────────────────────────────────────
var s5 = pres.addSlide();
s5.addShape('RECTANGLE', { x: 0, y: 0, w: W, h: H, fill: { color: G.white }, line: { type: 'none' } });
accent(s5, G.blue);
eyebrow(s5, 'HOW IT WORKS');
slideTitle(s5, 'From Patient Consent to Collaborative Intelligence', { size: 26 });
hRule(s5);
var stepData = [
  { n: '1', label: 'Hospital Onboarding', desc: '3 hospitals initialise local datasets and Flower clients', c: G.blue },
  { n: '2', label: 'Patient Consent',     desc: 'Patients opt in or out via the consent portal', c: G.green },
  { n: '3', label: 'Consent Filtering',   desc: 'Only eligible records enter each new training round', c: G.yellow },
  { n: '4', label: 'Local Training',      desc: 'PyTorch + Opacus DP-SGD trains each local model', c: G.red },
  { n: '5', label: 'Model Aggregation',   desc: 'Flower combines updates into a shared global model', c: G.blue },
  { n: '6', label: 'Evaluation',          desc: 'Performance and privacy metrics rendered on dashboard', c: G.green },
];
stepData.forEach(function(st, i) {
  var col = i % 3;
  var row = Math.floor(i / 3);
  var x = 0.5 + col * 3.12;
  var y = 1.58 + row * 1.62;
  s5.addShape('RECTANGLE', { x, y, w: 2.9, h: 1.48, fill: { color: G.offWhite }, line: { color: G.rule, pt: 1 } });
  s5.addShape('ELLIPSE', { x: x + 0.12, y: y + 0.12, w: 0.42, h: 0.42, fill: { color: st.c }, line: { type: 'none' } });
  s5.addText(st.n, { x: x + 0.12, y: y + 0.13, w: 0.42, h: 0.38, fontSize: 14, bold: true, color: G.white, fontFace: 'Calibri', align: 'center', margin: 0 });
  s5.addText(st.label, { x: x + 0.62, y: y + 0.1, w: 2.2, h: 0.38, fontSize: 12, bold: true, color: G.ink, fontFace: 'Calibri', margin: 0, wrap: true });
  s5.addText(st.desc, { x: x + 0.12, y: y + 0.62, w: 2.66, h: 0.78, fontSize: 11, color: G.muted, fontFace: 'Calibri', margin: 0, wrap: true });
});
s5.addText('Data stays local  ·  Consent controls participation  ·  Federation improves the shared model where evidence supports it', {
  x: 0.5, y: H - 0.6, w: 9, h: 0.26, fontSize: 10, italic: true, color: G.blue, fontFace: 'Calibri', margin: 0,
});
footerBar(s5);

// ───────────────────────────────────────────────────────────────────────────
// SLIDE 06 — ARCHITECTURE  (KEY SLIDE)
// ───────────────────────────────────────────────────────────────────────────
var s6 = pres.addSlide();
s6.addShape('RECTANGLE', { x: 0, y: 0, w: W, h: H, fill: { color: G.white }, line: { type: 'none' } });
accent(s6, G.green);
eyebrow(s6, 'SYSTEM ARCHITECTURE');
slideTitle(s6, 'Privacy-Aware Federated Learning Architecture', { size: 26 });
hRule(s6, { y: 1.38 });
// Patient Portal
s6.addShape('RECTANGLE', { x: 0.5, y: 1.5, w: 2.1, h: 0.72, fill: { color: 'EAF3FE' }, line: { color: G.blue, pt: 1 } });
s6.addText('Patient Portal', { x: 0.55, y: 1.55, w: 2, h: 0.28, fontSize: 12, bold: true, color: G.blue, fontFace: 'Calibri', margin: 0 });
s6.addText('Consent API & Audit DB', { x: 0.55, y: 1.82, w: 2, h: 0.26, fontSize: 10, color: G.muted, fontFace: 'Calibri', margin: 0 });
// arrow
s6.addShape('RECTANGLE', { x: 1.52, y: 2.24, w: 0.06, h: 0.28, fill: { color: G.muted }, line: { type: 'none' } });
// Hospitals
var hospitals6 = [{ id: 'A', c: G.blue }, { id: 'B', c: G.green }, { id: 'C', c: G.yellow }];
hospitals6.forEach(function(h, i) {
  var x = 0.5 + i * 2.22;
  s6.addShape('RECTANGLE', { x, y: 2.56, w: 2.0, h: 1.44, fill: { color: G.offWhite }, line: { color: h.c, pt: 2 } });
  s6.addText('Hospital ' + h.id, { x: x + 0.1, y: 2.64, w: 1.8, h: 0.28, fontSize: 13, bold: true, color: G.ink, fontFace: 'Calibri', margin: 0 });
  ['Local Data', 'Consent Filter', 'PyTorch + Opacus'].forEach(function(l, li) {
    colorDot(s6, h.c, x + 0.22, 2.56 + 0.56 + li * 0.34, 0.08);
    s6.addText(l, { x: x + 0.36, y: 2.56 + 0.44 + li * 0.34, w: 1.52, h: 0.28, fontSize: 10, color: G.muted, fontFace: 'Calibri', margin: 0 });
  });
  s6.addShape('RECTANGLE', { x: x + 0.97, y: 4.02, w: 0.06, h: 0.24, fill: { color: G.muted }, line: { type: 'none' } });
});
// Flower
s6.addShape('RECTANGLE', { x: 0.5, y: 4.26, w: 6.42, h: 0.56, fill: { color: 'E6F4EA' }, line: { color: G.green, pt: 2 } });
s6.addText('Flower Federation Server — model aggregation and redistribution', {
  x: 0.6, y: 4.3, w: 6.2, h: 0.44, fontSize: 12, bold: true, color: G.green, fontFace: 'Calibri', margin: 0,
});
// Global model
s6.addShape('RECTANGLE', { x: 7.1, y: 1.5, w: 2.4, h: 3.32, fill: { color: 'FFF8E1' }, line: { color: G.yellow, pt: 1 } });
s6.addText('Research Dashboard', { x: 7.18, y: 1.58, w: 2.2, h: 0.3, fontSize: 13, bold: true, color: G.ink, fontFace: 'Calibri', margin: 0 });
['Accuracy · AUROC · F1', 'Epsilon (ε) tracking', 'Attack AUC test', 'Audit logs'].forEach(function(l, li) {
  colorDot(s6, G.yellow, 7.26, 2.06 + li * 0.5, 0.09);
  s6.addText(l, { x: 7.4, y: 1.94 + li * 0.5, w: 2.0, h: 0.36, fontSize: 11, color: G.muted, fontFace: 'Calibri', margin: 0 });
});
footerBar(s6);

// ───────────────────────────────────────────────────────────────────────────
// SLIDE 07 — TECH STACK
// ───────────────────────────────────────────────────────────────────────────
var s7 = pres.addSlide();
s7.addShape('RECTANGLE', { x: 0, y: 0, w: W, h: H, fill: { color: G.white }, line: { type: 'none' } });
accent(s7, G.blue);
eyebrow(s7, 'TECHNOLOGY');
slideTitle(s7, 'Technology Behind FedConsent Health', { size: 30 });
hRule(s7);
var layers = [
  { layer: 'Frontend',             tech: 'React · TypeScript · Vite · Tailwind CSS', c: G.blue },
  { layer: 'Backend',              tech: 'Python · FastAPI · Pydantic', c: G.green },
  { layer: 'Database',             tech: 'SQLite · SQLAlchemy', c: G.yellow },
  { layer: 'Machine Learning',     tech: 'PyTorch · scikit-learn', c: G.red },
  { layer: 'Federation',           tech: 'Flower (FedAvg)', c: G.blue },
  { layer: 'Differential Privacy', tech: 'Opacus (DP-SGD)', c: G.green },
  { layer: 'Dataset',              tech: 'MedMNIST / PneumoniaMNIST', c: G.yellow },
  { layer: 'Privacy Testing',      tech: 'Adversarial Robustness Toolbox (ART)', c: G.red },
];
layers.forEach(function(row, i) {
  var col = i % 2;
  var r = Math.floor(i / 2);
  var x = 0.5 + col * 4.8;
  var y = 1.55 + r * 0.84;
  s7.addShape('RECTANGLE', { x, y, w: 4.5, h: 0.72, fill: { color: G.offWhite }, line: { color: G.rule, pt: 1 } });
  s7.addShape('RECTANGLE', { x, y, w: 0.16, h: 0.72, fill: { color: row.c }, line: { type: 'none' } });
  s7.addText(row.layer, { x: x + 0.26, y: y + 0.06, w: 2.0, h: 0.3, fontSize: 12, bold: true, color: G.ink, fontFace: 'Calibri', margin: 0 });
  s7.addText(row.tech, { x: x + 0.26, y: y + 0.38, w: 4.1, h: 0.28, fontSize: 11, color: G.muted, fontFace: 'Calibri', margin: 0 });
});
s7.addText('Open-source stack designed for a reproducible hackathon prototype.', {
  x: 0.5, y: H - 0.6, w: 9, h: 0.26, fontSize: 10, italic: true, color: G.blue, fontFace: 'Calibri', margin: 0,
});
footerBar(s7);

// ───────────────────────────────────────────────────────────────────────────
// SLIDE 08 — PRIVACY, SECURITY & CONSENT
// ───────────────────────────────────────────────────────────────────────────
var s8 = pres.addSlide();
s8.addShape('RECTANGLE', { x: 0, y: 0, w: W, h: H, fill: { color: G.white }, line: { type: 'none' } });
accent(s8, G.red);
eyebrow(s8, 'PRIVACY & SECURITY');
slideTitle(s8, 'Privacy by Design. Consent by Default.', { size: 30 });
hRule(s8);
var items8 = [
  { label: 'Data Isolation',       desc: 'Raw medical images never leave the hospital environment.', c: G.blue },
  { label: 'Differential Privacy', desc: 'DP-SGD clips gradients and adds calibrated noise. Epsilon and delta are tracked per round.', c: G.green },
  { label: 'Consent Lifecycle',    desc: 'Patients grant or withdraw consent. Eligibility is recomputed before each training round.', c: G.yellow },
  { label: 'Access Control',       desc: 'Separate roles for patients, hospital staff, and researchers.', c: G.red },
  { label: 'Auditability',         desc: 'Consent changes and training events recorded and reviewable.', c: G.blue },
];
items8.forEach(function(it, i) {
  var y = 1.6 + i * 0.64;
  s8.addShape('ELLIPSE', { x: 0.5, y: y + 0.06, w: 0.3, h: 0.3, fill: { color: it.c }, line: { type: 'none' } });
  s8.addText(it.label, { x: 0.92, y: y + 0.02, w: 2.4, h: 0.3, fontSize: 13, bold: true, color: G.ink, fontFace: 'Calibri', margin: 0 });
  s8.addText(it.desc, { x: 0.92, y: y + 0.34, w: 8.6, h: 0.26, fontSize: 12, color: G.muted, fontFace: 'Calibri', margin: 0, wrap: true });
});
s8.addShape('RECTANGLE', { x: 0.5, y: H - 0.88, w: 9, h: 0.34, fill: { color: 'FFF8E1' }, line: { color: G.yellow, pt: 1 } });
s8.addText('Important: Consent withdrawal removes future eligibility but does not erase influence from already-trained model weights.', {
  x: 0.6, y: H - 0.87, w: 8.8, h: 0.3, fontSize: 10, color: G.ink, fontFace: 'Calibri', margin: 0,
});
footerBar(s8);

// ───────────────────────────────────────────────────────────────────────────
// SLIDE 09 — LIVE DEMO  (KEY SLIDE)
// ───────────────────────────────────────────────────────────────────────────
var s9 = pres.addSlide();
s9.addShape('RECTANGLE', { x: 0, y: 0, w: W, h: H, fill: { color: G.white }, line: { type: 'none' } });
accent(s9, G.green);
eyebrow(s9, 'LIVE DEMO');
slideTitle(s9, 'From Architecture to Working Prototype', { size: 30 });
hRule(s9);
var demoSteps = [
  { n: '1', title: 'Hospital Dashboard',  desc: '3 simulated hospitals participate in the federation', c: G.blue },
  { n: '2', title: 'Patient Portal',      desc: 'Consent status · opt-in and opt-out action', c: G.green },
  { n: '3', title: 'Consent Withdrawal',  desc: 'Withdrawn consent changes future training eligibility', c: G.yellow },
  { n: '4', title: 'Federated Training',  desc: 'Flower rounds · global model update displayed', c: G.red },
  { n: '5', title: 'Research Dashboard',  desc: 'Model comparisons · privacy params · audit logs', c: G.blue },
];
demoSteps.forEach(function(st, i) {
  var y = 1.6 + i * 0.67;
  s9.addShape('ELLIPSE', { x: 0.5, y: y + 0.04, w: 0.36, h: 0.36, fill: { color: st.c }, line: { type: 'none' } });
  s9.addText(st.n, { x: 0.5, y: y + 0.05, w: 0.36, h: 0.32, fontSize: 14, bold: true, color: G.white, fontFace: 'Calibri', align: 'center', margin: 0 });
  s9.addText(st.title, { x: 1.0, y: y + 0.04, w: 3.6, h: 0.3, fontSize: 13, bold: true, color: G.ink, fontFace: 'Calibri', margin: 0 });
  s9.addText(st.desc, { x: 1.0, y: y + 0.36, w: 5, h: 0.26, fontSize: 12, color: G.muted, fontFace: 'Calibri', margin: 0 });
  if (i < demoSteps.length - 1) s9.addShape('RECTANGLE', { x: 0.5, y: y + 0.62, w: 6, h: 0.01, fill: { color: G.rule }, line: { type: 'none' } });
});
// screenshot placeholder
s9.addShape('RECTANGLE', { x: 6.2, y: 1.55, w: 3.3, h: 3.52, fill: { color: G.offWhite }, line: { color: G.rule, pt: 1 } });
s9.addText('[Screenshot Placeholder]\n\nHospital overview\nConsent portal\nTraining logs\nMetrics dashboard', {
  x: 6.3, y: 2.4, w: 3.1, h: 2, fontSize: 11, color: G.muted, fontFace: 'Calibri', align: 'center', margin: 0, wrap: true,
});
footerBar(s9);

// ───────────────────────────────────────────────────────────────────────────
// SLIDE 10 — RESULTS  (KEY SLIDE)
// ───────────────────────────────────────────────────────────────────────────
var s10 = pres.addSlide();
s10.addShape('RECTANGLE', { x: 0, y: 0, w: W, h: H, fill: { color: G.white }, line: { type: 'none' } });
accent(s10, G.blue);
eyebrow(s10, 'RESULTS');
slideTitle(s10, 'Measuring Accuracy, Collaboration & Privacy', { size: 26 });
hRule(s10);
var metrics = [
  { m: 'Accuracy',    desc: 'Correct predictions overall', c: G.blue },
  { m: 'AUROC',       desc: 'Discrimination across thresholds', c: G.green },
  { m: 'F1 Score',    desc: 'Precision-recall balance', c: G.yellow },
  { m: 'Sensitivity', desc: 'Pneumonia-positive recall', c: G.red },
  { m: 'Specificity', desc: 'Pneumonia-negative specificity', c: G.blue },
  { m: 'Epsilon (e)', desc: 'DP privacy loss parameter', c: G.green },
  { m: 'Attack AUC',  desc: 'Membership inference strength', c: G.red },
];
metrics.forEach(function(mt, i) {
  var y = 1.56 + i * 0.48;
  colorDot(s10, mt.c, 0.66, y + 0.12, 0.1);
  s10.addText(mt.m, { x: 0.84, y, w: 1.8, h: 0.3, fontSize: 12, bold: true, color: G.ink, fontFace: 'Calibri', margin: 0 });
  s10.addText(mt.desc, { x: 2.7, y, w: 2.9, h: 0.3, fontSize: 12, color: G.muted, fontFace: 'Calibri', margin: 0 });
  if (i < metrics.length - 1) s10.addShape('RECTANGLE', { x: 0.5, y: y + 0.42, w: 5.8, h: 0.01, fill: { color: G.rule }, line: { type: 'none' } });
});
s10.addShape('RECTANGLE', { x: 6.6, y: 1.45, w: 2.9, h: 3.5, fill: { color: G.offWhite }, line: { color: G.rule, pt: 1 } });
s10.addText('Compare', { x: 6.7, y: 1.55, w: 2.7, h: 0.3, fontSize: 13, bold: true, color: G.ink, fontFace: 'Calibri', margin: 0 });
var compares = [
  { label: 'Hospital A Local', c: G.blue },
  { label: 'Hospital B Local', c: G.green },
  { label: 'Hospital C Local', c: G.yellow },
  { label: 'Federated (no DP)', c: G.ink },
  { label: 'Federated + DP', c: G.red },
];
compares.forEach(function(cp, i) {
  var cy = 2.0 + i * 0.56;
  s10.addShape('RECTANGLE', { x: 6.72, y: cy, w: 2.66, h: 0.42, fill: { color: G.white }, line: { color: cp.c, pt: 1 } });
  s10.addText(cp.label, { x: 6.82, y: cy + 0.06, w: 2.46, h: 0.3, fontSize: 12, color: G.ink, fontFace: 'Calibri', margin: 0 });
});
s10.addText('Report measured values only. Do not claim federation improved accuracy until experiments confirm it.', {
  x: 0.5, y: H - 0.6, w: 9, h: 0.26, fontSize: 10, italic: true, color: G.red, fontFace: 'Calibri', margin: 0,
});
footerBar(s10);

// ───────────────────────────────────────────────────────────────────────────
// SLIDE 11 — BUSINESS MODEL & ROADMAP
// ───────────────────────────────────────────────────────────────────────────
var s11 = pres.addSlide();
s11.addShape('RECTANGLE', { x: 0, y: 0, w: W, h: H, fill: { color: G.white }, line: { type: 'none' } });
accent(s11, G.yellow);
eyebrow(s11, 'BUSINESS MODEL & FUTURE SCOPE');
slideTitle(s11, 'From Hackathon Prototype to Healthcare Infrastructure', { size: 23 });
hRule(s11);
s11.addText('Target Customers', { x: 0.5, y: 1.55, w: 4.2, h: 0.3, fontSize: 13, bold: true, color: G.ink, fontFace: 'Calibri', margin: 0 });
['Hospital networks', 'Medical research institutions', 'Pharmaceutical companies', 'Diagnostic AI developers'].forEach(function(t, i) {
  var y = 1.9 + i * 0.36;
  colorDot(s11, G.green, 0.66, y + 0.1, 0.09);
  s11.addText(t, { x: 0.85, y, w: 3.7, h: 0.3, fontSize: 12, color: G.muted, fontFace: 'Calibri', margin: 0 });
});
s11.addText('Revenue: Enterprise licensing  ·  managed deployments  ·  technical support', {
  x: 0.5, y: 3.44, w: 4.5, h: 0.3, fontSize: 11, italic: true, color: G.blue, fontFace: 'Calibri', margin: 0,
});
var phases = [
  { phase: 'Phase 1\nHackathon', detail: '3-hospital simulation and dashboard', c: G.blue },
  { phase: 'Phase 2\nPilot',     detail: 'Security, interoperability and validation', c: G.green },
  { phase: 'Phase 3\nEnterprise', detail: 'Multi-hospital deployment and governance', c: G.yellow },
];
phases.forEach(function(ph, i) {
  var x = 5.3 + i * 1.58;
  s11.addShape('RECTANGLE', { x, y: 1.58, w: 1.38, h: 2.8, fill: { color: G.offWhite }, line: { color: ph.c, pt: 2 } });
  s11.addShape('RECTANGLE', { x, y: 1.58, w: 1.38, h: 0.2, fill: { color: ph.c }, line: { type: 'none' } });
  s11.addText(ph.phase, { x: x + 0.06, y: 1.82, w: 1.26, h: 0.56, fontSize: 11, bold: true, color: G.ink, fontFace: 'Calibri', margin: 0, align: 'center', wrap: true });
  s11.addText(ph.detail, { x: x + 0.06, y: 2.44, w: 1.26, h: 1.8, fontSize: 10, color: G.muted, fontFace: 'Calibri', margin: 0, align: 'center', wrap: true });
});
footerBar(s11);

// ───────────────────────────────────────────────────────────────────────────
// SLIDE 12 — IMPACT & CLOSING
// ───────────────────────────────────────────────────────────────────────────
var s12 = pres.addSlide();
s12.addShape('RECTANGLE', { x: 0, y: 0, w: W, h: H, fill: { color: G.white }, line: { type: 'none' } });
[G.blue, G.green, G.yellow, G.red].forEach(function(c, i) {
  s12.addShape('RECTANGLE', { x: i * (W / 4), y: 0, w: W / 4, h: 0.18, fill: { color: c }, line: { type: 'none' } });
});
eyebrow(s12, 'IMPACT & CLOSING', G.ink, { y: 0.28 });
slideTitle(s12, 'Collaborative Healthcare AI Without Compromising Patient Control', { size: 24, y: 0.52 });
hRule(s12, { y: 1.38 });
var impacts = [
  { label: 'Collaboration',        desc: 'Multi-hospital training without transferring raw records.', c: G.blue },
  { label: 'Patient Empowerment',  desc: 'Consent decisions linked to future training eligibility.', c: G.green },
  { label: 'Privacy Transparency', desc: 'DP parameters and attack evaluation reported openly.', c: G.yellow },
  { label: 'Accountability',       desc: 'Training and consent activity fully auditable.', c: G.red },
];
impacts.forEach(function(im, i) {
  var x = 0.5 + i * 2.38;
  s12.addShape('RECTANGLE', { x, y: 1.52, w: 2.16, h: 1.32, fill: { color: G.offWhite }, line: { color: im.c, pt: 1 } });
  s12.addShape('RECTANGLE', { x, y: 1.52, w: 2.16, h: 0.2, fill: { color: im.c }, line: { type: 'none' } });
  s12.addText(im.label, { x: x + 0.1, y: 1.76, w: 1.96, h: 0.36, fontSize: 12, bold: true, color: G.ink, fontFace: 'Calibri', margin: 0, wrap: true });
  s12.addText(im.desc, { x: x + 0.1, y: 2.14, w: 1.96, h: 0.62, fontSize: 10, color: G.muted, fontFace: 'Calibri', margin: 0, wrap: true });
});
// quote
s12.addShape('RECTANGLE', { x: 0.5, y: 3.04, w: 9, h: 1.08, fill: { color: 'EAF3FE' }, line: { color: G.blue, pt: 1 } });
s12.addText(
  '"We do not just keep hospital data local. We make AI collaboration consent-aware, privacy-measurable, and auditable."',
  { x: 0.65, y: 3.08, w: 8.7, h: 0.98, fontSize: 13, italic: true, color: G.blue, fontFace: 'Cambria', align: 'center', valign: 'middle', margin: 0, wrap: true }
);
// footer with QR placeholder
s12.addShape('RECTANGLE', { x: 0, y: H - 0.72, w: W, h: 0.72, fill: { color: G.offWhite }, line: { type: 'none' } });
s12.addShape('RECTANGLE', { x: 0.5, y: H - 0.66, w: 0.56, h: 0.56, fill: { color: G.white }, line: { color: G.rule, pt: 1 } });
s12.addText('[QR]', { x: 0.5, y: H - 0.66, w: 0.56, h: 0.56, fontSize: 9, color: G.muted, fontFace: 'Calibri', align: 'center', valign: 'middle', margin: 0 });
s12.addText('FedConsent Health  ·  Team 44  ·  Umbrella Corporation  ·  HackQbit 2.0', {
  x: 1.18, y: H - 0.52, w: 8.3, h: 0.3, fontSize: 11, color: G.muted, fontFace: 'Calibri', margin: 0,
});

// ─── WRITE ─────────────────────────────────────────────────────────────────
pres.writeFile({ fileName: 'FedConsent_Health_HackQbit2.pptx' })
  .then(function() { console.log('OK FedConsent_Health_HackQbit2.pptx written'); })
  .catch(function(e) { console.error(e); process.exit(1); });
