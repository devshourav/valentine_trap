// Configuration
const CONFIG = {
    yesButtonGrowthRate: 1.08,
    minDistanceFromYes: 200,
    maxYesButtonScale: 2,
};

// DOM Elements
const elements = {
    noBtn: document.getElementById('noBtn'),
    yesBtn: document.getElementById('yesBtn'),
    mainCard: document.getElementById('mainCard'),
    actionGroup: document.getElementById('actionGroup'),
    body: document.body
};

// State
let yesBtnScale = 1;
let attempts = 0;

// Distance helper
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
}

// Yes button center
function getYesButtonCenter() {
    const yesRect = elements.yesBtn.getBoundingClientRect();
    const containerRect = elements.actionGroup.getBoundingClientRect();
    return {
        x: yesRect.left - containerRect.left + yesRect.width / 2,
        y: yesRect.top - containerRect.top + yesRect.height / 2
    };
}

// Random position for No button
function getRandomPosition() {
    const containerRect = elements.actionGroup.getBoundingClientRect();
    const btnRect = elements.noBtn.getBoundingClientRect();
    const yesCenter = getYesButtonCenter();
    
    const maxX = containerRect.width - btnRect.width;
    const maxY = containerRect.height - btnRect.height;
    
    let x, y, distance;
    let tries = 0;
    
    do {
        x = Math.random() * maxX;
        y = Math.random() * maxY;
        const noCenterX = x + btnRect.width/2;
        const noCenterY = y + btnRect.height/2;
        distance = getDistance(yesCenter.x, yesCenter.y, noCenterX, noCenterY);
        tries++;
    } while(distance < CONFIG.minDistanceFromYes && tries < 50);
    
    return {x, y};
}

// Move No button
function moveNoButton(e) {
    attempts++;
    const pos = getRandomPosition();
    elements.noBtn.style.left = `${pos.x}px`;
    elements.noBtn.style.top = `${pos.y}px`;
    elements.noBtn.style.transform = 'translate(0,0)';

    if(yesBtnScale < CONFIG.maxYesButtonScale) {
        yesBtnScale *= CONFIG.yesButtonGrowthRate;
        const currentTransform = elements.yesBtn.style.transform || '';
        const scaleTransform = `scale(${yesBtnScale})`;
        if(currentTransform.includes('translateY')) {
            elements.yesBtn.style.transform = currentTransform.replace(/scale\([^)]*\)/, scaleTransform);
        } else {
            elements.yesBtn.style.transform = scaleTransform;
        }
    }

    if('vibrate' in navigator) navigator.vibrate(10);
    updateNoButtonText();
}

// Update No button text
function updateNoButtonText() {
    const messages = ['No','Are you sure?','Really? 🥺','Think again!','Please? 🙏','Pretty please? ✨','Don\'t be shy! 💕','You know you want to! 😊','Come on! 🎀','Just say yes! 💖'];
    const index = Math.min(attempts-1, messages.length-1);
    if(index>=0) elements.noBtn.textContent = messages[index];
}

// Success state
function showSuccessState() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity:30, spread:360, ticks:60, zIndex:1000, colors:['#FF4D6D','#FF758C','#FFB3C1','#FFF5F7','#FFE5EC'] };

    function randomInRange(min,max){ return Math.random()*(max-min)+min; }

    const interval = setInterval(()=>{
        const timeLeft = animationEnd - Date.now();
        if(timeLeft<=0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft/duration);
        confetti({...defaults, particleCount, origin:{x:randomInRange(0.1,0.3), y:Math.random()-0.2}});
        confetti({...defaults, particleCount, origin:{x:randomInRange(0.7,0.9), y:Math.random()-0.2}});
    },250);

    elements.mainCard.innerHTML = `
        <div class="success-state">
            <img src="https://media.giphy.com/media/G96zgIcQn1L2xpmdxi/giphy.gif" alt="Celebration" class="success-image">
            <h1 class="success-title">Yay! I knew you'd say yes! 💕</h1>
            <p class="success-message">This is going to be amazing! ✨</p>
            <div class="success-details">
                <p><span class="emoji">📅</span><strong>When:</strong> Valentine's Day, 7 PM</p>
                <p><span class="emoji">📍</span><strong>Where:</strong> I'll pick you up!</p>
                <p><span class="emoji">💝</span><strong>Dress code:</strong> Your prettiest smile</p>
            </div>
            <a href="https://ig.me/m/_b.o.h.e.m.i.a.n" class="instagram-btn" target="_blank" rel="noopener noreferrer">
                Text Me Now
            </a>
        </div>
    `;
    elements.body.style.background = 'linear-gradient(135deg, #FFB3C1 0%, #FF758C 50%, #FF4D6D 100%)';
}

// Event listeners
elements.noBtn.addEventListener('mouseenter', moveNoButton);
elements.noBtn.addEventListener('touchstart', e=>{ e.preventDefault(); moveNoButton(e); });
elements.noBtn.addEventListener('click', e=>{ e.preventDefault(); moveNoButton(e); });
elements.yesBtn.addEventListener('click', showSuccessState);

// Initial No button position
window.addEventListener('load', ()=>{
    setTimeout(()=>{
        const containerRect = elements.actionGroup.getBoundingClientRect();
        const yesBtnRect = elements.yesBtn.getBoundingClientRect();
        const noBtnRect = elements.noBtn.getBoundingClientRect();
        const centerY = containerRect.height/2;
        const gap = 40;
        const noLeft = yesBtnRect.left - containerRect.left + yesBtnRect.width + gap;
        const noTop = centerY - (noBtnRect.height/2);
        elements.noBtn.style.left = `${noLeft}px`;
        elements.noBtn.style.top = `${noTop}px`;
        elements.noBtn.style.transform = 'translate(0,0)';
    },100);
});
