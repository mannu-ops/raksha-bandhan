/* ==========================================
   RAKSHA BANDHAN INTERACTIVE JAVASCRIPT LOGIC
   ========================================== */

// Global State
let currentWishData = {
    role: 'brother',
    to: 'Chhotu',
    from: 'Your Loving Sister',
    msg: '',
    gift: 'kaju_katli'
};

let isAudioPlaying = false;
let audioCtx = null;
let bgMusicInterval = null;

// Preset Messages Database (Formatted Multi-line Simple English)
const PRESETS = {
    msg1: '🌸 "Bound by love, may our bond\nshine brighter every day!\nHappy Rakhi!"',
    msg2: '🍫 "From fighting over chocolates to\nalways protecting each other,\nyou are the best sibling ever!"',
    msg3: '🎁 "Wishing the cutest sibling\na very Happy Raksha Bandhan!\nStay blessed always!"',
    msg4: '✨ "On this Rakhi, I promise to always\nbe by your side. Sending virtual sweets!"'
};

// Gift Details Database
const GIFT_DATA = {
    kaju_katli: { emoji: '🍬', name: 'Kaju Katli Box', desc: 'Sweet treats for Raksha Bandhan!' },
    chocolates: { emoji: '🍫', name: 'Cadbury Silk Box', desc: 'A box of delicious chocolates just for you!' },
    shagun: { emoji: '🧧', name: 'Virtual Cash Shagun', desc: 'Dher saari blessings & happiness!' },
    teddy: { emoji: '🧸', name: 'Cute Soft Teddy', desc: 'A cute cuddly teddy bear sending infinite hugs!' }
};

// INITIALIZATION ON DOM READY
document.addEventListener('DOMContentLoaded', () => {
    initCanvasParticles();
    checkUrlParamsAndRender();
    
    // Pre-fill default selected preset message into textarea on first load
    applyPresetMessage();

    // Event listener for audio toggle button
    document.getElementById('musicToggle').addEventListener('click', toggleFestiveMusic);
});

/* ==========================================
   1. CANVAS FLOATING MARIGOLD & SPARKLE ENGINE
   ========================================== */
let canvas, ctx, particles = [];

function initCanvasParticles() {
    canvas = document.getElementById('festiveCanvas');
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate initial floating marigold petals & sparkles
    for (let i = 0; i < 28; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 5 + 2.5,
            color: Math.random() > 0.5 ? '#FFD700' : (Math.random() > 0.5 ? '#FF6F00' : '#FF4081'),
            speedY: Math.random() * 0.7 + 0.3,
            speedX: Math.sin(Math.random() * Math.PI) * 0.4,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 2,
            type: Math.random() > 0.3 ? 'petal' : 'sparkle'
        });
    }

    animateParticles();
}

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height + 10) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.type === 'petal') {
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.ellipse(0, 0, p.radius, p.radius * 1.6, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.fillStyle = '#FFF';
            ctx.arc(0, 0, p.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    });

    requestAnimationFrame(animateParticles);
}

// Confetti Burst Trigger
function triggerConfettiBurst() {
    playSFX('confetti');
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 160,
            y: canvas.height / 2 + (Math.random() - 0.5) * 160,
            radius: Math.random() * 6 + 3,
            color: ['#FFD700', '#FF4081', '#00E676', '#00E5FF', '#FF6D00'][Math.floor(Math.random() * 5)],
            speedY: (Math.random() - 0.7) * 7,
            speedX: (Math.random() - 0.5) * 7,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 8,
            type: 'petal'
        });
    }
}


/* ==========================================
   2. WEB AUDIO API SYNTHESIZER
   ========================================== */
function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playNote(freq, duration, type = 'sine', gainVal = 0.1) {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(gainVal, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {}
}

function playSFX(name) {
    const ctx = getAudioContext();
    if (name === 'open') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            setTimeout(() => playNote(freq, 0.4, 'triangle', 0.15), idx * 80);
        });
    } else if (name === 'tap') {
        playNote(880, 0.15, 'sine', 0.1);
    } else if (name === 'rakhi') {
        [659.25, 783.99, 987.77].forEach((freq, idx) => {
            setTimeout(() => playNote(freq, 0.3, 'sine', 0.15), idx * 100);
        });
    } else if (name === 'munch') {
        playNote(300, 0.08, 'square', 0.08);
        setTimeout(() => playNote(400, 0.08, 'square', 0.08), 80);
    } else if (name === 'confetti') {
        [440, 554.37, 659.25, 880, 1108.73].forEach((freq, idx) => {
            setTimeout(() => playNote(freq, 0.3, 'sine', 0.15), idx * 60);
        });
    }
}

function toggleFestiveMusic() {
    const btnText = document.getElementById('musicStatusText');
    const ctx = getAudioContext();

    if (isAudioPlaying) {
        clearInterval(bgMusicInterval);
        isAudioPlaying = false;
        btnText.innerText = 'Play Music';
    } else {
        isAudioPlaying = true;
        btnText.innerText = 'Pause Music';
        
        const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
        let step = 0;

        bgMusicInterval = setInterval(() => {
            if (!isAudioPlaying) return;
            const freq = notes[step % notes.length];
            playNote(freq, 0.6, 'sine', 0.05);
            if (step % 4 === 0) {
                playNote(freq / 2, 0.8, 'triangle', 0.04);
            }
            step++;
        }, 320);
    }
}


/* ==========================================
   3. SENDER FLOW: FORM & LINK GENERATION
   ========================================== */

function updateRoleTheme() {
    const isBrother = document.getElementById('roleBrother').checked;
    document.querySelector('label[for="roleBrother"]').classList.toggle('selected', isBrother);
    document.querySelector('label[for="roleSister"]').classList.toggle('selected', !isBrother);
    playSFX('tap');
}

function updateGiftTheme() {
    document.querySelectorAll('.gift-card').forEach(card => {
        const radio = card.querySelector('input[type="radio"]');
        if (radio && radio.checked) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    playSFX('tap');
}

// FIX: Automatically clears text when "Custom Message" option is selected from dropdown
function applyPresetMessage() {
    const select = document.getElementById('presetMessages');
    const textarea = document.getElementById('customMessage');
    if (!select || !textarea) return;
    
    if (select.value === 'custom') {
        textarea.value = ''; // Clears text so it becomes blank for user to type
        textarea.placeholder = "Type your sweet custom note here...";
        textarea.focus();
    } else if (PRESETS[select.value]) {
        textarea.value = PRESETS[select.value];
    }
}

// FIX: Automatically clears text when user clicks/taps into textarea if preset is currently active
function clearIfPreset() {
    const select = document.getElementById('presetMessages');
    const textarea = document.getElementById('customMessage');
    if (!select || !textarea) return;

    const isCurrentPreset = Object.values(PRESETS).some(p => p.trim() === textarea.value.trim());

    if (isCurrentPreset || select.value !== 'custom') {
        select.value = 'custom';
        textarea.value = '';
    }
}

function generateWishLink() {
    playSFX('open');

    const role = document.querySelector('input[name="recipientRole"]:checked').value;
    const recipientName = document.getElementById('recipientName').value.trim();
    const senderName = document.getElementById('senderName').value.trim();
    let message = document.getElementById('customMessage').value.trim();
    
    if (!message) {
        message = PRESETS.msg1;
    }

    const gift = document.querySelector('input[name="virtualGift"]:checked').value;

    currentWishData = { role, to: recipientName, from: senderName, msg: message, gift };

    // Encode parameters in URL query
    const params = new URLSearchParams({
        r: role,
        to: recipientName,
        fr: senderName,
        m: btoa(unescape(encodeURIComponent(message))),
        g: gift
    });

    const shareUrl = window.location.origin + window.location.pathname + '?' + params.toString();

    // Render Result Box
    document.getElementById('generatedLinkInput').value = shareUrl;
    document.getElementById('linkResultCard').classList.remove('hidden');

    // Setup WhatsApp Share Link
    const waText = `✨ *Happy Raksha Bandhan!* 🌸\n\nHey ${recipientName}! I created a cute animated Raksha Bandhan envelope for you. Tap the link to open it: \n\n👉 ${shareUrl}`;
    
    document.getElementById('whatsappShareBtn').href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
}

function copyGeneratedLink() {
    const input = document.getElementById('generatedLinkInput');
    input.select();
    input.setSelectionRange(0, 99999);
    
    navigator.clipboard.writeText(input.value).then(() => {
        playSFX('tap');
        const copyBtnText = document.getElementById('copyBtnText');
        copyBtnText.innerText = 'Copied! ✅';
        setTimeout(() => copyBtnText.innerText = 'Copy', 2000);
    });
}

function previewCurrentWish() {
    renderWishView(currentWishData);
}


/* ==========================================
   4. RECIPIENT FLOW: ENVELOPE & WISH RENDERING
   ========================================== */

function checkUrlParamsAndRender() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('to') && urlParams.has('fr')) {
        let msg = '';
        try {
            msg = decodeURIComponent(escape(atob(urlParams.get('m'))));
        } catch (e) {
            msg = PRESETS.msg1;
        }

        currentWishData = {
            role: urlParams.get('r') || 'brother',
            to: urlParams.get('to') || 'Sibling',
            from: urlParams.get('fr') || 'Your Sibling',
            msg: msg,
            gift: urlParams.get('g') || 'kaju_katli'
        };

        renderWishView(currentWishData);
    }
}

function renderWishView(data) {
    // Hide Creator, Show Recipient View
    document.getElementById('creatorView').classList.add('hidden');
    document.getElementById('recipientView').classList.remove('hidden');
    document.getElementById('homeBtn').classList.remove('hidden');

    // Populate Letter Data
    document.getElementById('displayRecipientName').innerText = data.to;
    document.getElementById('displaySenderName').innerText = `~ ${data.from}`;
    document.getElementById('displayMessageText').innerText = data.msg;
    document.getElementById('certRecipientName').innerText = data.to;
    document.getElementById('certSenderSig').innerText = data.from;

    // Greeting Customization based on Brother / Sister
    if (data.role === 'brother') {
        document.getElementById('envelopeGreetingText').innerText = `Special Raksha Bandhan Envelope for You, ${data.to}! 👦`;
        document.getElementById('brotherRitualView').classList.remove('hidden');
        document.getElementById('sisterRitualView').classList.add('hidden');
        document.getElementById('ritualTab1Label').innerText = '🌸 Virtual Rakhi';
    } else {
        document.getElementById('envelopeGreetingText').innerText = `Special Raksha Bandhan Wish for You, ${data.to}! 👧`;
        document.getElementById('brotherRitualView').classList.add('hidden');
        document.getElementById('sisterRitualView').classList.remove('hidden');
        document.getElementById('ritualTab1Label').innerText = '🌸 Sister Love';
    }

    // Gift Unbox Setup
    const gift = GIFT_DATA[data.gift] || GIFT_DATA.kaju_katli;
    document.getElementById('unboxedGiftEmoji').innerText = gift.emoji;
    document.getElementById('unboxedGiftTitle').innerText = gift.name;
    document.getElementById('unboxedGiftDesc').innerText = `"${gift.desc}"`;
}

function openEnvelope() {
    const wrapper = document.getElementById('envelopeWrapper');
    if (wrapper.classList.contains('open')) return;

    wrapper.classList.add('open');
    playSFX('open');
    triggerConfettiBurst();

    // Transition to full letter hub
    setTimeout(() => {
        document.getElementById('envelopeStage').classList.add('hidden');
        document.getElementById('letterHub').classList.remove('hidden');
    }, 1400);
}

function openCreatorMode() {
    window.history.pushState({}, document.title, window.location.pathname);
    document.getElementById('recipientView').classList.add('hidden');
    document.getElementById('envelopeStage').classList.remove('hidden');
    document.getElementById('letterHub').classList.add('hidden');
    document.getElementById('envelopeWrapper').classList.remove('open');
    document.getElementById('creatorView').classList.remove('hidden');
    document.getElementById('homeBtn').classList.add('hidden');
    
    // Ensure default message is pre-filled when opening creator mode
    applyPresetMessage();
}


/* ==========================================
   5. INTERACTIVE RITUALS & MINI GAMES
   ========================================== */

function switchRitualTab(tabId) {
    playSFX('tap');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active-tab'));

    event.currentTarget.classList.add('active');
    document.getElementById(tabId).classList.add('active-tab');
}

// Brother Ritual Functions
function performTilak() {
    playSFX('rakhi');
    const tilak = document.getElementById('wristTilak');
    tilak.classList.remove('hidden');
    triggerConfettiBurst();
}

function performTieRakhi() {
    playSFX('rakhi');
    const rakhi = document.getElementById('wristRakhi');
    rakhi.classList.remove('hidden');
    triggerConfettiBurst();
}

function showerLoveFlowers() {
    playSFX('confetti');
    triggerConfettiBurst();
}

// Aarti Thali Functions
function rotateThali() {
    playSFX('tap');
    const thali = document.getElementById('thaliPlate');
    thali.style.transform = 'rotate(360deg)';
    setTimeout(() => thali.style.transform = 'rotate(0deg)', 600);
}

function feedSweet(sweetName) {
    event.stopPropagation();
    playSFX('munch');
    const feedback = document.getElementById('sweetsFeedFeedback');
    feedback.innerText = `Yummy! Fed ${sweetName} to ${currentWishData.to}! 😋✨`;
    feedback.style.color = '#D81B60';
    triggerConfettiBurst();
}

// Gift Unboxing Function
function unboxVirtualGift() {
    playSFX('open');
    document.getElementById('giftBoxElement').classList.add('hidden');
    document.getElementById('unboxedGiftResult').classList.remove('hidden');
    triggerConfettiBurst();
}
