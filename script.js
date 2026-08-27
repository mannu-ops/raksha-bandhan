// Dynamic Canvas Background Engine
const canvas = document.getElementById('festiveCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 1.5 + 0.8;
        this.speedX = Math.random() * 1 - 0.5;
        this.rotation = Math.random() * 360;
        this.rotSpeed = Math.random() * 2 - 1;
        this.type = Math.random() > 0.4 ? 'petal' : 'sparkle';
        this.color = this.type === 'petal' ? (Math.random() > 0.5 ? '#FF8C00' : '#E91E63') : '#FFD700';
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotSpeed;
        if (this.y > canvas.height + 20) {
            this.reset();
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        if (this.type === 'petal') {
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#FFD700';
            ctx.fill();
        }
        ctx.restore();
    }
}

for (let i = 0; i < 30; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Web Audio API Festive Sound Synthesizer (No external MP3 required)
let audioCtx = null;
let isAudioPlaying = false;
let bgMusicInterval = null;

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

const musicToggleBtn = document.getElementById('musicToggle');
const musicStatusText = document.getElementById('musicStatusText');

musicToggleBtn.addEventListener('click', () => {
    initAudioContext();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (isAudioPlaying) {
        stopBgMusic();
    } else {
        startBgMusic();
    }
});

function playNote(freq, type = 'sine', duration = 0.5, timeOffset = 0) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + timeOffset);

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + timeOffset + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + timeOffset);
        osc.stop(audioCtx.currentTime + timeOffset + duration);
    } catch (e) {
        console.log("Audio play error", e);
    }
}

function startBgMusic() {
    isAudioPlaying = true;
    musicStatusText.innerText = "Mute Music";
    musicToggleBtn.classList.add('active');

    // Sweet Indian Sitar / Flute Pentatonic Melody Loop
    const melody = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 880.00, 783.99]; // C5, D5, E5, G5, A5, C6
    let step = 0;

    bgMusicInterval = setInterval(() => {
        if (!isAudioPlaying) return;
        playNote(melody[step % melody.length], 'sine', 0.6);
        if (step % 2 === 0) {
            playNote(melody[(step + 2) % melody.length] / 2, 'triangle', 0.8);
        }
        step++;
    }, 450);
}

function stopBgMusic() {
    isAudioPlaying = false;
    musicStatusText.innerText = "Play Music";
    musicToggleBtn.classList.remove('active');
    if (bgMusicInterval) clearInterval(bgMusicInterval);
}

// Sound FX for Actions
function playSFX(type) {
    initAudioContext();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (type === 'pop') {
        playNote(600, 'sine', 0.1);
        playNote(900, 'sine', 0.15, 0.05);
    } else if (type === 'rakhi') {
        playNote(523.25, 'sine', 0.2);
        playNote(659.25, 'sine', 0.2, 0.1);
        playNote(783.99, 'sine', 0.3, 0.2);
    } else if (type === 'confetti') {
        for (let i = 0; i < 5; i++) {
            playNote(400 + i * 150, 'triangle', 0.1, i * 0.05);
        }
    }
}

// URL Base64 Encoding / Decoding Helpers
function encodeData(obj) {
    try {
        const jsonStr = JSON.stringify(obj);
        return btoa(encodeURIComponent(jsonStr));
    } catch (e) {
        return "";
    }
}

function decodeData(str) {
    try {
        const jsonStr = decodeURIComponent(atob(str));
        return JSON.parse(jsonStr);
    } catch (e) {
        return null;
    }
}

// Global Preset Messages & Dynamic Message Functions
const presetMessages = {
    msg1: `Bound by love, may our bond shine brighter every day! Happy Rakhi!`,
    msg2: `From fighting over chocolates to protecting each other, you are the best!`,
    msg3: `Wishing the cutest sibling a very Happy Raksha Bandhan! Stay blessed!`,
    msg4: `On this Rakhi, I promise to always be by your side. Sending virtual sweets!`
};

function applyPresetMessage() {
    const select = document.getElementById('presetMessages');
    const textarea = document.getElementById('customMessage');
    const selectedVal = select.value;

    if (selectedVal !== 'custom' && presetMessages[selectedVal]) {
        textarea.value = presetMessages[selectedVal];
    }
}

// Automatically switch dropdown to 'Custom' ONLY when user actually types inside textarea
function onCustomMessageInput() {
    const select = document.getElementById('presetMessages');
    if (select.value !== 'custom') {
        select.value = 'custom';
    }
}

function updateRoleTheme() {
    const role = document.querySelector('input[name="recipientRole"]:checked').value;
    document.querySelectorAll('.role-card').forEach(card => card.classList.remove('selected'));
    document.querySelector(`input[name="recipientRole"][value="${role}"]`).closest('.role-card').classList.add('selected');
}

function updateGiftTheme() {
    const giftRadio = document.querySelector('input[name="virtualGift"]:checked');
    if (giftRadio) {
        const gift = giftRadio.value;
        document.querySelectorAll('.gift-card').forEach(card => card.classList.remove('selected'));
        giftRadio.closest('.gift-card').classList.add('selected');
        window.currentGiftType = gift; // Live update active gift selection!
    }
}

// Helper to determine exact chosen gift key regardless of view mode
function getSelectedGiftKey() {
    const recipientView = document.getElementById('recipientView');
    const isRecipientActive = recipientView && !recipientView.classList.contains('hidden');

    // If recipient view (wish card) is active, payload window.currentGiftType HAS TOP PRIORITY!
    if (isRecipientActive && window.currentGiftType) {
        return window.currentGiftType;
    }

    // Inspect currently selected radio in form
    const giftRadio = document.querySelector('input[name="virtualGift"]:checked');
    if (giftRadio && giftRadio.value) {
        window.currentGiftType = giftRadio.value;
        return giftRadio.value;
    }

    return window.currentGiftType || 'iphone';
}

// Wish Link Generator
function generateWishLink() {
    playSFX('pop');
    const role = document.querySelector('input[name="recipientRole"]:checked').value;
    const toName = document.getElementById('recipientName').value.trim();
    const fromName = document.getElementById('senderName').value.trim();
    const message = document.getElementById('customMessage').value.trim();
    const giftRadio = document.querySelector('input[name="virtualGift"]:checked');
    const gift = giftRadio ? giftRadio.value : 'kaju_katli';

    if (!toName || !fromName) {
        alert("Please enter both recipient and sender names!");
        return;
    }

    window.currentGiftType = gift;

    const payload = {
        r: role,
        to: toName,
        fr: fromName,
        m: (message || presetMessages.msg1).trim(),
        g: gift
    };

    const encoded = encodeData(payload);
    const fullUrl = `${window.location.origin}${window.location.pathname}?w=${encoded}`;

    document.getElementById('generatedLinkInput').value = fullUrl;
    
    // Setup WhatsApp Share Link
    const waText = encodeURIComponent(`🌸 Hey ${toName}! I sent you a special interactive Raksha Bandhan greeting envelope! 💌✨ Tap link to open:\n${fullUrl}`);
    document.getElementById('whatsappShareBtn').href = `https://api.whatsapp.com/send?text=${waText}`;

    document.getElementById('linkResultCard').classList.remove('hidden');
    triggerConfettiBurst();
}

function copyGeneratedLink() {
    const input = document.getElementById('generatedLinkInput');
    input.select();
    input.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(input.value).then(() => {
        const copyBtnText = document.getElementById('copyBtnText');
        copyBtnText.innerText = "Copied! ✓";
        playSFX('pop');
        setTimeout(() => copyBtnText.innerText = "Copy", 2000);
    });
}

function previewCurrentWish() {
    const giftRadio = document.querySelector('input[name="virtualGift"]:checked');
    if (giftRadio) {
        window.currentGiftType = giftRadio.value;
    }
    const link = document.getElementById('generatedLinkInput').value;
    if (link) {
        window.location.href = link;
    }
}

// Recipient Mode View Controller
function checkUrlParametersAndRender() {
    const urlParams = new URLSearchParams(window.location.search);
    const wishDataEncoded = urlParams.get('w');

    if (wishDataEncoded) {
        const data = decodeData(wishDataEncoded);
        if (data) {
            renderRecipientView(data);
            return;
        }
    }

    // Default: Show Creator View
    openCreatorMode();
}

function openCreatorMode() {
    document.getElementById('creatorView').classList.remove('hidden');
    document.getElementById('recipientView').classList.add('hidden');
    document.getElementById('homeBtn').classList.add('hidden');
}

function renderRecipientView(data) {
    document.getElementById('creatorView').classList.add('hidden');
    document.getElementById('recipientView').classList.remove('hidden');
    document.getElementById('homeBtn').classList.remove('hidden');

    // Populate Names & Message (Trim leading/trailing quote characters or whitespace)
    let cleanMessage = (data.m || '').trim();
    if (cleanMessage.startsWith('"') && cleanMessage.endsWith('"')) {
        cleanMessage = cleanMessage.substring(1, cleanMessage.length - 1).trim();
    }

    document.getElementById('envelopeGreetingText').innerText = `Special Raksha Bandhan Wish for ${data.to}!`;
    document.getElementById('displayRecipientName').innerText = data.to;
    document.getElementById('displaySenderName').innerText = `~ ${data.fr}`;
    document.getElementById('displayMessageText').innerText = cleanMessage;

    if (data.r === 'sister') {
        document.getElementById('displaySubtitleGreeting').innerText = "Happy Raksha Bandhan to my Sweetest Sister! 💖";
        document.getElementById('brotherRitualView').classList.add('hidden');
        document.getElementById('sisterRitualView').classList.remove('hidden');
    } else {
        document.getElementById('displaySubtitleGreeting').innerText = "Happy Raksha Bandhan to my Dearest Brother! 👦💖";
        document.getElementById('brotherRitualView').classList.remove('hidden');
        document.getElementById('sisterRitualView').classList.add('hidden');
    }

    // Store Unboxed Gift Data strictly from URL payload
    window.currentGiftType = data.g || 'kaju_katli';
}

// Envelope 3D Unfolding Interaction
function openEnvelope() {
    playSFX('pop');
    const wrapper = document.getElementById('envelopeWrapper');
    const envelopeStage = document.getElementById('envelopeStage');
    const letterHub = document.getElementById('letterHub');

    wrapper.classList.add('open');

    setTimeout(() => {
        envelopeStage.classList.add('hidden');
        letterHub.classList.remove('hidden');
        triggerConfettiBurst();
    }, 1100);
}

// Dynamic Active Button Toggle Helper for Ritual Actions
function setActiveRitualBtn(btnElement) {
    if (!btnElement) return;
    document.querySelectorAll('.ritual-actions .btn-ritual').forEach(btn => {
        btn.classList.remove('active', 'primary');
    });
    btnElement.classList.add('active', 'primary');
}

// Brother Ritual Functions - ANIMATED CUTE CHARACTER
function performTilak(evt) {
    if (evt && evt.currentTarget) setActiveRitualBtn(evt.currentTarget);
    playSFX('rakhi');
    const tilak = document.getElementById('svgTilakGroup');
    const speech = document.getElementById('characterSpeechBubble');
    const happyEyes = document.getElementById('characterEyesHappy');
    const openEyes = document.getElementById('characterEyesOpen');

    if (tilak) tilak.classList.remove('hidden');
    if (happyEyes && openEyes) {
        openEyes.classList.add('hidden');
        happyEyes.classList.remove('hidden');
    }
    if (speech) {
        speech.innerText = `"Yay! Lovely Tilak!" ✨🔴`;
        speech.classList.remove('hidden');
    }
    triggerConfettiBurst();
}

function performTieRakhi(evt) {
    if (evt && evt.currentTarget) setActiveRitualBtn(evt.currentTarget);
    playSFX('rakhi');
    const rakhi = document.getElementById('svgRakhiGroup');
    const speech = document.getElementById('characterSpeechBubble');
    const happyEyes = document.getElementById('characterEyesHappy');
    const openEyes = document.getElementById('characterEyesOpen');

    if (rakhi) rakhi.classList.remove('hidden');
    if (happyEyes && openEyes) {
        openEyes.classList.add('hidden');
        happyEyes.classList.remove('hidden');
    }
    if (speech) {
        speech.innerText = `"Yay! Beautiful Rakhi!" 🌸💖`;
        speech.classList.remove('hidden');
    }
    triggerConfettiBurst();
}

// PERFORM AARTI FUNCTION (REVEALS AARTI THALI & WAVES IN CIRCULAR LOOP)
function performAarti(evt) {
    if (evt && evt.currentTarget) setActiveRitualBtn(evt.currentTarget);
    playSFX('rakhi');
    const thali = document.getElementById('svgAartiThaliGroup');
    const speech = document.getElementById('characterSpeechBubble');
    const happyEyes = document.getElementById('characterEyesHappy');
    const openEyes = document.getElementById('characterEyesOpen');

    if (thali) {
        thali.classList.remove('hidden'); // Reveal Aarti Thali ONLY on Aarti button tap!
        thali.classList.add('waving-aarti');
        setTimeout(() => thali.classList.remove('waving-aarti'), 3600);
    }

    if (happyEyes && openEyes) {
        openEyes.classList.add('hidden');
        happyEyes.classList.remove('hidden');
    }
    if (speech) {
        speech.innerText = `"Yay! Aarti Blessings!" 🪔✨`;
        speech.classList.remove('hidden');
    }
    triggerConfettiBurst();
}

// PERFORM UNBOX GIFT FUNCTION
function performUnboxGift(evt) {
    if (evt && evt.currentTarget && evt.currentTarget.classList.contains('btn-ritual')) {
        setActiveRitualBtn(evt.currentTarget);
    }

    const giftGroup = document.getElementById('svgGiftBoxGroup');
    const giftLid = document.getElementById('svgGiftLid');
    const unboxedItem = document.getElementById('svgUnboxedItem');
    const speech = document.getElementById('characterSpeechBubble');
    const happyEyes = document.getElementById('characterEyesHappy');
    const openEyes = document.getElementById('characterEyesOpen');

    // Show Gift Box on the side
    if (giftGroup) giftGroup.classList.remove('hidden');

    playSFX('confetti');
    triggerConfettiBurst();

    // Determine exact selected gift key
    const giftKey = getSelectedGiftKey();

    const giftsMap = {
        kaju_katli: { name: 'Kaju Katli', graphicId: 'itemKaju', emoji: '🍬' },
        chocolates: { name: 'Silk Chocolate', graphicId: 'itemChoco', emoji: '🍫' },
        iphone: { name: 'iPhone 16 Pro', graphicId: 'itemIphone', emoji: '📱' },
        shagun: { name: 'Shagun Lifafa', graphicId: 'itemShagun', emoji: '🧧' },
        teddy: { name: 'Teddy Bear', graphicId: 'itemTeddy', emoji: '🧸' }
    };
    const chosen = giftsMap[giftKey] || giftsMap.kaju_katli;

    // 2. Hide all gift vector graphics first, then show target graphic
    document.querySelectorAll('.gift-graphic').forEach(el => el.classList.add('hidden'));
    const targetGraphic = document.getElementById(chosen.graphicId);
    if (targetGraphic) targetGraphic.classList.remove('hidden');

    // 3. Animate Lid opening
    if (giftLid) {
        giftLid.style.transform = 'translateY(-20px) rotate(-22deg)';
    }

    if (unboxedItem) unboxedItem.classList.remove('hidden');

    if (happyEyes && openEyes) {
        openEyes.classList.add('hidden');
        happyEyes.classList.remove('hidden');
    }

    if (speech) {
        speech.innerText = `"Yay! Here is your ${chosen.name}!" ${chosen.emoji}✨`;
        speech.classList.remove('hidden');
    }
}

function showerLoveFlowers() {
    playSFX('confetti');
    triggerConfettiBurst();
}

// Sweet Feeding Speech React
function feedSweet(sweetName) {
    playSFX('pop');
    const speech = document.getElementById('characterSpeechBubble');
    if (speech) {
        speech.innerText = `"Yummy ${sweetName}!" 😋🍬`;
        speech.classList.remove('hidden');
    }
    triggerConfettiBurst();
}

// Confetti Particle Explosion
function triggerConfettiBurst() {
    for (let i = 0; i < 25; i++) {
        const p = new Particle();
        p.x = canvas.width / 2 + (Math.random() * 100 - 50);
        p.y = canvas.height / 2 + (Math.random() * 100 - 50);
        p.speedY = (Math.random() - 0.5) * 6;
        p.speedX = (Math.random() - 0.5) * 6;
        particles.push(p);
    }
    setTimeout(() => {
        particles.splice(30);
    }, 2000);
}

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Sync default checked gift option on load
    updateGiftTheme();
    
    // Auto-fill preset message on initial load so text area is populated
    applyPresetMessage();
    
    // Check URL query string for recipient wish payload
    checkUrlParametersAndRender();
});
