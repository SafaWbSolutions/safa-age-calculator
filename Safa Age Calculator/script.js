/* ===================================================
   SAFA AGE CALCULATOR — Complete JavaScript Engine
   Neo-Brutalist Version
   =================================================== */

(function () {
  'use strict';

  /* ══════════════════════════════════
     DOM REFERENCES
     ══════════════════════════════════ */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const els = {
    dobInput: $('#dob-input'),
    asOfInput: $('#as-of-input'),
    calcBtn: $('#calculate-btn'),
    resultsSection: $('#results-section'),
    errorMsg: $('#error-msg'),
    shareBtn: $('#share-btn'),
    downloadBtn: $('#download-btn'),
    toast: $('#toast'),
    // Age diff
    dob1Diff: $('#dob1-diff-input'),
    dob2Diff: $('#dob2-diff-input'),
    ageDiffBtn: $('#age-diff-btn'),
    ageDiffResult: $('#age-diff-result'),
  };

  /* ══════════════════════════════════
     UTILITY FUNCTIONS
     ══════════════════════════════════ */
  function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + ' T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' M';
    return num.toLocaleString('en-US');
  }

  function showError(msg) {
    els.errorMsg.textContent = msg;
    els.errorMsg.style.display = 'block';
    setTimeout(() => { els.errorMsg.style.display = 'none'; }, 4000);
  }

  function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    setTimeout(() => { els.toast.classList.remove('show'); }, 3000);
  }

  /* ══════════════════════════════════
     AGE CALCULATION ENGINE
     ══════════════════════════════════ */
  function calculateAge(dob, asOf) {
    const birthDate = new Date(dob);
    const targetDate = new Date(asOf);

    if (isNaN(birthDate.getTime()) || isNaN(targetDate.getTime())) return null;
    if (birthDate > targetDate) return null;

    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = targetDate.getTime() - birthDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalSeconds = Math.floor(diffMs / 1000);

    return {
      years, months, days,
      totalMonths, totalWeeks, totalDays,
      totalHours, totalMinutes, totalSeconds,
      birthDate, targetDate, diffMs
    };
  }

  /* ══════════════════════════════════
     ZODIAC SIGNS & INFO
     ══════════════════════════════════ */
  const ZODIAC_WESTERN = [
    { sign: 'Capricorn ♑', start: [12, 22], end: [1, 19] },
    { sign: 'Aquarius ♒', start: [1, 20], end: [2, 18] },
    { sign: 'Pisces ♓', start: [2, 19], end: [3, 20] },
    { sign: 'Aries ♈', start: [3, 21], end: [4, 19] },
    { sign: 'Taurus ♉', start: [4, 20], end: [5, 20] },
    { sign: 'Gemini ♊', start: [5, 21], end: [6, 20] },
    { sign: 'Cancer ♋', start: [6, 21], end: [7, 22] },
    { sign: 'Leo ♌', start: [7, 23], end: [8, 22] },
    { sign: 'Virgo ♍', start: [8, 23], end: [9, 22] },
    { sign: 'Libra ♎', start: [9, 23], end: [10, 22] },
    { sign: 'Scorpio ♏', start: [10, 23], end: [11, 21] },
    { sign: 'Sagittarius ♐', start: [11, 22], end: [12, 21] },
  ];

  function getWesternZodiac(month, day) {
    for (const z of ZODIAC_WESTERN) {
      const [sm, sd] = z.start;
      const [em, ed] = z.end;
      if (sm > em) {
        if ((month === sm && day >= sd) || (month === em && day <= ed)) return z.sign;
      } else {
        if ((month === sm && day >= sd) || (month === em && day <= ed) ||
            (month > sm && month < em)) return z.sign;
      }
    }
    return 'Capricorn ♑';
  }

  const BIRTHSTONES = ['Garnet', 'Amethyst', 'Aquamarine', 'Diamond', 'Emerald', 'Alexandrite', 'Ruby', 'Peridot', 'Sapphire', 'Opal', 'Topaz', 'Tanzanite'];

  function getGeneration(year) {
    if (year >= 2013) return 'Gen Alpha';
    if (year >= 1997) return 'Gen Z';
    if (year >= 1981) return 'Millennial';
    if (year >= 1965) return 'Gen X';
    if (year >= 1946) return 'Baby Boomer';
    return 'Silent Gen';
  }

  /* ══════════════════════════════════
     LIFE STATISTICS
     ══════════════════════════════════ */
  function getLifeStats(totalDays) {
    const totalMinutes = totalDays * 24 * 60;
    return {
      heartbeats: Math.floor(totalMinutes * 72),
      breaths: Math.floor(totalMinutes * 16),
    };
  }

  function getNextBirthday(birthDate) {
    const now = new Date();
    let nextBday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBday <= now) {
      nextBday = new Date(now.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
    }
    return nextBday;
  }

  /* ══════════════════════════════════
     MAIN CALCULATE FUNCTION
     ══════════════════════════════════ */
  let liveInterval = null;
  let countdownInterval = null;
  let currentDob = null;

  function doCalculate() {
    const dobVal = els.dobInput.value;
    const asOfVal = els.asOfInput.value || new Date().toISOString().split('T')[0];

    if (!dobVal) {
      showError('Please enter your date of birth.');
      return;
    }

    const result = calculateAge(dobVal, asOfVal);
    if (!result) {
      showError('Invalid dates. Birth date must be before the "as of" date.');
      return;
    }

    els.errorMsg.style.display = 'none';
    els.resultsSection.classList.add('active');
    document.getElementById('stats-section').classList.add('active');

    $('#age-years').textContent = result.years;
    $('#age-months').textContent = result.months;
    $('#age-days').textContent = result.days;

    $('#total-months').textContent = formatNumber(result.totalMonths);
    $('#total-weeks').textContent = formatNumber(result.totalWeeks);
    $('#total-days').textContent = formatNumber(result.totalDays);
    $('#total-hours').textContent = formatNumber(result.totalHours);

    const birthMonth = result.birthDate.getMonth();
    const birthDay = result.birthDate.getDate();
    const birthYear = result.birthDate.getFullYear();

    $('#zodiac-western').textContent = getWesternZodiac(birthMonth + 1, birthDay);
    $('#birthstone').textContent = BIRTHSTONES[birthMonth];
    $('#generation').textContent = getGeneration(birthYear);

    const stats = getLifeStats(result.totalDays);
    $('#heartbeats').textContent = formatNumber(stats.heartbeats);
    $('#breaths').textContent = formatNumber(stats.breaths);

    currentDob = result.birthDate;
    if (liveInterval) clearInterval(liveInterval);
    updateLiveCounter();
    liveInterval = setInterval(updateLiveCounter, 1000);

    if (countdownInterval) clearInterval(countdownInterval);
    updateBirthdayCountdown();
    countdownInterval = setInterval(updateBirthdayCountdown, 1000);

    // Smooth scroll
    els.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateLiveCounter() {
    if (!currentDob) return;
    const now = new Date();
    const diff = now.getTime() - currentDob.getTime();
    const totalSec = Math.floor(diff / 1000);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const days = Math.floor(hrs / 24);
    const remHrs = hrs % 24;
    $('#live-seconds').textContent = `${formatNumber(days)} days, ${remHrs}h ${mins}m ${secs}s`;
  }

  function updateBirthdayCountdown() {
    if (!currentDob) return;
    const now = new Date();
    const nextBday = getNextBirthday(currentDob);
    const diff = nextBday.getTime() - now.getTime();
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    $('#countdown-days').textContent = d;
  }

  /* ══════════════════════════════════
     AGE DIFFERENCE
     ══════════════════════════════════ */
  function doAgeDiff() {
    const dob1 = els.dob1Diff.value;
    const dob2 = els.dob2Diff.value;
    if (!dob1 || !dob2) { showToast('Please enter both dates'); return; }

    const d1 = new Date(dob1);
    const d2 = new Date(dob2);
    const totalDiff = Math.floor(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    
    els.ageDiffResult.innerHTML = `DIFFERENCE: ${formatNumber(totalDiff)} DAYS`;
  }

  /* ══════════════════════════════════
     SHARE & DOWNLOAD
     ══════════════════════════════════ */
  function doShare() {
    const years = $('#age-years').textContent;
    const text = `[SAFA] AGE CALC\nMy age is ${years} years!\nCalculate yours at:`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: 'My Age', text: text, url: url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text + '\n' + url)
        .then(() => showToast('COPIED TO CLIPBOARD'))
        .catch(() => showToast('FAILED TO COPY'));
    }
  }

  function doDownload() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 500);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 790, 490);

    ctx.fillStyle = '#ff3e00';
    ctx.fillRect(10, 10, 780, 80);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('[SAFA] AGE CALC', 400, 62);

    const years = $('#age-years').textContent;
    const monthsVal = $('#age-months').textContent;
    const daysVal = $('#age-days').textContent;

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 72px "Space Grotesk", sans-serif';
    ctx.fillText(`${years} YRS`, 400, 200);
    ctx.font = 'bold 40px "Space Grotesk", sans-serif';
    ctx.fillText(`${monthsVal} MOS, ${daysVal} DAYS`, 400, 270);

    ctx.fillRect(200, 320, 400, 4);

    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#555555';
    const totalDays = $('#total-days').textContent;
    ctx.fillText(`TOTAL DAYS: ${totalDays}`, 400, 370);

    const link = document.createElement('a');
    link.download = 'safa-age.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('IMAGE DOWNLOADED');
  }

  /* ══════════════════════════════════
     FAQ ACCORDION
     ══════════════════════════════════ */
  function initFaq() {
    $$('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('open');
        $$('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  function setDefaults() {
    // Automatically select today's date for "Age As Of"
    const today = new Date().toISOString().split('T')[0];
    els.asOfInput.value = today;
    els.dobInput.max = today;
  }

  function bindEvents() {
    els.calcBtn.addEventListener('click', doCalculate);
    els.shareBtn.addEventListener('click', doShare);
    els.downloadBtn.addEventListener('click', doDownload);
    els.ageDiffBtn.addEventListener('click', doAgeDiff);

    els.dobInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doCalculate(); });
    els.asOfInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doCalculate(); });
  }

  function init() {
    setDefaults();
    initFaq();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
