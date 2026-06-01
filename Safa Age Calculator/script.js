/* ===================================================
   SAFA AGE CALCULATOR — Complete JavaScript Engine
   All features: age calc, zodiac, planets, life stats,
   countdown, milestones, share, download, particles
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
    resultsContent: $('#results-content'),
    noResults: $('#no-results'),
    errorMsg: $('#error-msg'),
    themeToggle: $('#theme-toggle'),
    shareBtn: $('#share-btn'),
    downloadBtn: $('#download-btn'),
    toast: $('#toast'),
    canvas: $('#particles-canvas'),
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

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
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

    // Total calculations
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
     ZODIAC SIGNS
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
    // month is 1-12
    for (const z of ZODIAC_WESTERN) {
      const [sm, sd] = z.start;
      const [em, ed] = z.end;
      if (sm > em) {
        // Wraps around year (Capricorn)
        if ((month === sm && day >= sd) || (month === em && day <= ed)) return z.sign;
      } else {
        if ((month === sm && day >= sd) || (month === em && day <= ed) ||
            (month > sm && month < em)) return z.sign;
      }
    }
    return 'Capricorn ♑';
  }

  const CHINESE_ZODIAC = [
    'Rat 🐀', 'Ox 🐂', 'Tiger 🐅', 'Rabbit 🐇', 'Dragon 🐲', 'Snake 🐍',
    'Horse 🐴', 'Goat 🐐', 'Monkey 🐵', 'Rooster 🐓', 'Dog 🐕', 'Pig 🐖'
  ];

  function getChineseZodiac(year) {
    return CHINESE_ZODIAC[(year - 4) % 12];
  }

  /* ══════════════════════════════════
     BIRTHSTONE & BIRTH FLOWER
     ══════════════════════════════════ */
  const BIRTHSTONES = [
    'Garnet', 'Amethyst', 'Aquamarine', 'Diamond',
    'Emerald', 'Alexandrite', 'Ruby', 'Peridot',
    'Sapphire', 'Opal', 'Topaz', 'Tanzanite'
  ];

  const BIRTH_FLOWERS = [
    'Carnation', 'Violet', 'Daffodil', 'Daisy',
    'Lily of the Valley', 'Rose', 'Larkspur', 'Gladiolus',
    'Aster', 'Marigold', 'Chrysanthemum', 'Poinsettia'
  ];

  /* ══════════════════════════════════
     GENERATION
     ══════════════════════════════════ */
  function getGeneration(year) {
    if (year >= 2013) return 'Gen Alpha';
    if (year >= 1997) return 'Gen Z';
    if (year >= 1981) return 'Millennial';
    if (year >= 1965) return 'Gen X';
    if (year >= 1946) return 'Baby Boomer';
    if (year >= 1928) return 'Silent Gen';
    return 'Greatest Gen';
  }

  /* ══════════════════════════════════
     LIFE PATH NUMBER (Numerology)
     ══════════════════════════════════ */
  function getLifePathNumber(dateStr) {
    const digits = dateStr.replace(/\D/g, '');
    let sum = 0;
    for (const d of digits) sum += parseInt(d);
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      let newSum = 0;
      for (const d of String(sum)) newSum += parseInt(d);
      sum = newSum;
    }
    return sum;
  }

  /* ══════════════════════════════════
     PLANET AGES
     ══════════════════════════════════ */
  const PLANET_ORBITAL_DAYS = {
    mercury: 87.97,
    venus: 224.7,
    mars: 687.0,
    jupiter: 4332.59,
    saturn: 10759.22,
  };

  function getPlanetAges(totalDays) {
    const result = {};
    for (const [planet, days] of Object.entries(PLANET_ORBITAL_DAYS)) {
      result[planet] = (totalDays / days).toFixed(2);
    }
    return result;
  }

  /* ══════════════════════════════════
     LIFE STATISTICS
     ══════════════════════════════════ */
  function getLifeStats(totalDays) {
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    return {
      heartbeats: Math.floor(totalMinutes * 72),       // avg 72 bpm
      breaths: Math.floor(totalMinutes * 16),           // avg 16 per min
      sleepHours: Math.floor(totalDays * 8),            // avg 8 hrs/day
      meals: Math.floor(totalDays * 3),                 // 3 meals/day
      fullMoons: Math.floor(totalDays / 29.53),         // lunar cycle
      sunDistance: Math.floor(totalDays * 2573600),      // km/day around sun (940M km / 365.25)
    };
  }

  /* ══════════════════════════════════
     MILESTONES
     ══════════════════════════════════ */
  function getMilestones(birthDate, totalDays, totalSeconds) {
    const milestones = [
      { label: '1,000 Days', days: 1000 },
      { label: '5,000 Days', days: 5000 },
      { label: '10,000 Days', days: 10000 },
      { label: '15,000 Days', days: 15000 },
      { label: '20,000 Days', days: 20000 },
      { label: '25,000 Days', days: 25000 },
      { label: '30,000 Days', days: 30000 },
      { label: '1 Billion Sec', days: Math.floor(1e9 / 86400) },
      { label: '2 Billion Sec', days: Math.floor(2e9 / 86400) },
    ];

    return milestones.map(m => {
      const achieved = totalDays >= m.days;
      const milestoneDate = new Date(birthDate.getTime() + m.days * 86400000);
      return {
        label: m.label,
        achieved,
        date: milestoneDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      };
    });
  }

  /* ══════════════════════════════════
     DAY OF WEEK
     ══════════════════════════════════ */
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /* ══════════════════════════════════
     BIRTHDAY COUNTDOWN
     ══════════════════════════════════ */
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

    // Hide error, show results
    els.errorMsg.style.display = 'none';
    els.resultsSection.classList.add('active');
    els.noResults.style.display = 'none';
    els.resultsContent.style.display = 'block';

    // ── Main Age ──
    $('#age-years').textContent = result.years;
    $('#age-months').textContent = result.months;
    $('#age-days').textContent = result.days;

    // ── Total Units ──
    $('#total-months').textContent = formatNumber(result.totalMonths);
    $('#total-weeks').textContent = formatNumber(result.totalWeeks);
    $('#total-days').textContent = formatNumber(result.totalDays);
    $('#total-hours').textContent = formatNumber(result.totalHours);
    $('#total-minutes').textContent = formatNumber(result.totalMinutes);
    $('#total-seconds').textContent = formatNumber(result.totalSeconds);

    // ── Info Cards ──
    const birthMonth = result.birthDate.getMonth(); // 0-indexed
    const birthDay = result.birthDate.getDate();
    const birthYear = result.birthDate.getFullYear();

    $('#day-of-birth').textContent = DAYS[result.birthDate.getDay()];
    $('#zodiac-western').textContent = getWesternZodiac(birthMonth + 1, birthDay);
    $('#zodiac-chinese').textContent = getChineseZodiac(birthYear);
    $('#birthstone').textContent = BIRTHSTONES[birthMonth];
    $('#birth-flower').textContent = BIRTH_FLOWERS[birthMonth];
    $('#generation').textContent = getGeneration(birthYear);
    $('#life-path-number').textContent = getLifePathNumber(dobVal);

    // ── Life Stats ──
    const stats = getLifeStats(result.totalDays);
    $('#heartbeats').textContent = formatNumber(stats.heartbeats);
    $('#breaths').textContent = formatNumber(stats.breaths);
    $('#sleep-hours').textContent = formatNumber(stats.sleepHours);
    $('#meals').textContent = formatNumber(stats.meals);
    $('#full-moons').textContent = formatNumber(stats.fullMoons);
    $('#sun-distance').textContent = formatNumber(stats.sunDistance);

    // ── Planet Ages ──
    const planets = getPlanetAges(result.totalDays);
    $('#planet-mercury').textContent = planets.mercury;
    $('#planet-venus').textContent = planets.venus;
    $('#planet-mars').textContent = planets.mars;
    $('#planet-jupiter').textContent = planets.jupiter;
    $('#planet-saturn').textContent = planets.saturn;

    // ── Milestones ──
    const milestones = getMilestones(result.birthDate, result.totalDays, result.totalSeconds);
    const milestonesHtml = milestones.map(m => {
      const cls = m.achieved ? 'achieved' : 'upcoming';
      const icon = m.achieved ? '✅' : '⏳';
      return `<div class="milestone-badge ${cls}" title="${m.date}">${icon} ${m.label}</div>`;
    }).join('');
    $('#milestones-container').innerHTML = milestonesHtml;

    // ── Life Progress ──
    const avgLifeDays = 80 * 365.25;
    const progressPercent = Math.min((result.totalDays / avgLifeDays) * 100, 100).toFixed(1);
    $('#life-progress-bar').style.width = progressPercent + '%';
    $('#life-progress-text').innerHTML = `You have lived <span>${progressPercent}%</span> of an average 80-year lifespan`;

    // ── Live Counter ──
    currentDob = result.birthDate;
    if (liveInterval) clearInterval(liveInterval);
    updateLiveCounter();
    liveInterval = setInterval(updateLiveCounter, 1000);

    // ── Birthday Countdown ──
    if (countdownInterval) clearInterval(countdownInterval);
    updateBirthdayCountdown();
    countdownInterval = setInterval(updateBirthdayCountdown, 1000);

    // Scroll to results on mobile
    if (window.innerWidth <= 1024) {
      els.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

    $('#live-seconds').textContent =
      `${formatNumber(days)} days, ${remHrs}h ${mins}m ${secs}s`;
  }

  function updateBirthdayCountdown() {
    if (!currentDob) return;
    const now = new Date();
    const nextBday = getNextBirthday(currentDob);
    const diff = nextBday.getTime() - now.getTime();

    if (diff <= 0) {
      $('#countdown-days').textContent = '🎉';
      $('#countdown-hours').textContent = '🎂';
      $('#countdown-minutes').textContent = '🥳';
      $('#countdown-seconds').textContent = '🎈';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    $('#countdown-days').textContent = d;
    $('#countdown-hours').textContent = h;
    $('#countdown-minutes').textContent = m;
    $('#countdown-seconds').textContent = s;
  }

  /* ══════════════════════════════════
     AGE DIFFERENCE CALCULATOR
     ══════════════════════════════════ */
  function doAgeDiff() {
    const dob1 = els.dob1Diff.value;
    const dob2 = els.dob2Diff.value;

    if (!dob1 || !dob2) {
      showToast('Please enter both dates of birth');
      return;
    }

    const d1 = new Date(dob1);
    const d2 = new Date(dob2);
    const older = d1 < d2 ? d1 : d2;
    const younger = d1 < d2 ? d2 : d1;

    let years = younger.getFullYear() - older.getFullYear();
    let months = younger.getMonth() - older.getMonth();
    let days = younger.getDate() - older.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(younger.getFullYear(), younger.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDiff = Math.floor(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));

    els.ageDiffResult.classList.add('active');
    els.ageDiffResult.innerHTML = `
      <div style="text-align: center;">
        <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          ${years} Years, ${months} Months, ${days} Days
        </div>
        <div style="color: var(--text-secondary); font-size: 0.9rem;">
          Total difference: <strong style="color: var(--neon-cyan);">${formatNumber(totalDiff)} days</strong>
        </div>
      </div>
    `;
  }

  /* ══════════════════════════════════
     SHARE FUNCTIONALITY
     ══════════════════════════════════ */
  function doShare() {
    const years = $('#age-years').textContent;
    const months = $('#age-months').textContent;
    const days = $('#age-days').textContent;
    const zodiac = $('#zodiac-western').textContent;

    const text = `🧮 My age is ${years} years, ${months} months, and ${days} days!\n♈ My zodiac sign: ${zodiac}\n\nCalculate your age at:`;
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: 'My Age — Safa Age Calculator',
        text: text,
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text + '\n' + url)
        .then(() => showToast('Results copied to clipboard! 📋'))
        .catch(() => showToast('Could not copy results'));
    }
  }

  /* ══════════════════════════════════
     DOWNLOAD AS IMAGE
     ══════════════════════════════════ */
  function doDownload() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    // Background
    const grad = ctx.createLinearGradient(0, 0, 800, 500);
    grad.addColorStop(0, '#06060f');
    grad.addColorStop(1, '#12122a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 500);

    // Accent line
    const lineGrad = ctx.createLinearGradient(0, 0, 800, 0);
    lineGrad.addColorStop(0, '#00f0ff');
    lineGrad.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = lineGrad;
    ctx.fillRect(0, 0, 800, 4);

    // Title
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SAFA AGE CALCULATOR', 400, 50);

    // Age
    const years = $('#age-years').textContent;
    const monthsVal = $('#age-months').textContent;
    const daysVal = $('#age-days').textContent;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px Inter, sans-serif';
    ctx.fillText(`${years} Years`, 400, 140);

    ctx.font = 'bold 32px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText(`${monthsVal} Months, ${daysVal} Days`, 400, 190);

    // Zodiac & Day
    const zodiac = $('#zodiac-western').textContent;
    const dayBorn = $('#day-of-birth').textContent;

    ctx.font = '20px Inter, sans-serif';
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText(`${zodiac}  •  Born on ${dayBorn}`, 400, 250);

    // Stats
    ctx.font = '16px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    const totalDays = $('#total-days').textContent;
    const totalHours = $('#total-hours').textContent;
    ctx.fillText(`${totalDays} total days  •  ${totalHours} total hours`, 400, 300);

    // Generation & Birthstone
    const gen = $('#generation').textContent;
    const stone = $('#birthstone').textContent;
    ctx.fillText(`${gen}  •  Birthstone: ${stone}`, 400, 340);

    // Footer
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('safa-age-calculator.pages.dev', 400, 470);

    // Download
    const link = document.createElement('a');
    link.download = 'my-age-safa-calculator.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    showToast('Age card downloaded! 📥');
  }

  /* ══════════════════════════════════
     THEME TOGGLE
     ══════════════════════════════════ */
  function initTheme() {
    const saved = localStorage.getItem('safa-theme');
    if (saved === 'light') {
      document.body.classList.replace('dark-theme', 'light-theme');
      els.themeToggle.textContent = '☀️';
    }
  }

  function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    if (isLight) {
      document.body.classList.replace('light-theme', 'dark-theme');
      els.themeToggle.textContent = '🌙';
      localStorage.setItem('safa-theme', 'dark');
    } else {
      document.body.classList.replace('dark-theme', 'light-theme');
      els.themeToggle.textContent = '☀️';
      localStorage.setItem('safa-theme', 'light');
    }
  }

  /* ══════════════════════════════════
     FAQ ACCORDION
     ══════════════════════════════════ */
  function initFaq() {
    $$('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('open');

        // Close all
        $$('.faq-item').forEach(i => i.classList.remove('open'));
        $$('.faq-question').forEach(q => q.setAttribute('aria-expanded', 'false'));

        // Toggle current
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ══════════════════════════════════
     SCROLL REVEAL ANIMATION
     ══════════════════════════════════ */
  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    $$('.reveal').forEach(el => observer.observe(el));
  }

  /* ══════════════════════════════════
     PARTICLE ANIMATION SYSTEM
     ══════════════════════════════════ */
  function initParticles() {
    const canvas = els.canvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      };
    }

    function initParticleArray() {
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
      particles = Array.from({ length: count }, createParticle);
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.02;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${currentOpacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(drawParticles);
    }

    resize();
    initParticleArray();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      initParticleArray();
    });

    // Reduce animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        drawParticles();
      }
    });
  }

  /* ══════════════════════════════════
     SET DEFAULT DATE
     ══════════════════════════════════ */
  function setDefaults() {
    const today = new Date().toISOString().split('T')[0];
    els.asOfInput.value = today;
    els.dobInput.max = today;
    els.asOfInput.max = '2100-12-31';
  }

  /* ══════════════════════════════════
     EVENT LISTENERS
     ══════════════════════════════════ */
  function bindEvents() {
    els.calcBtn.addEventListener('click', doCalculate);
    els.themeToggle.addEventListener('click', toggleTheme);
    els.shareBtn.addEventListener('click', doShare);
    els.downloadBtn.addEventListener('click', doDownload);
    els.ageDiffBtn.addEventListener('click', doAgeDiff);

    // Enter key to calculate
    els.dobInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doCalculate();
    });
    els.asOfInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doCalculate();
    });
  }

  /* ══════════════════════════════════
     INITIALIZATION
     ══════════════════════════════════ */
  function init() {
    setDefaults();
    initTheme();
    initFaq();
    initReveal();
    initParticles();
    bindEvents();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
