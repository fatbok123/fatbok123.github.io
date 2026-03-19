let activePlayer = 0;
let players = [];
let hlsInstances = [];
let playerInfos = [];

// KANAL LİSTESİ (TÜM KANALLAR GÜNCEL)
const channels = [
    { name: "Bein Sports 1", logo: "https://trgooltv61.top/img/beinsports1.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/bein-sports-1.m3u8" },
    { name: "Bein Sports 2", logo: "https://trgooltv61.top/img/beinsports2.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/bein-sports-2.m3u8" },
    { name: "Bein Sports 3", logo: "https://trgooltv61.top/img/beinsports3.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/bein-sports-3.m3u8" },
    { name: "Bein Sports 4", logo: "https://trgooltv61.top/img/beinsports4.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/bein-sports-4.m3u8" },
    { name: "Bein Sports 5", logo: "https://trgooltv61.top/img/beinsports5.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/bein-sports-5.m3u8" },
    { name: "Bein Sports Max 1", logo: "https://trgooltv61.top/img/beinsportsmax1.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/bein-sports-max-1.m3u8" },
    { name: "S Sport", logo: "https://www.trgoals125.top/lib/img/channels/s-sport.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/s-sport.m3u8" },
    { name: "S Sport 2", logo: "https://www.trgoals125.top/lib/img/channels/s-sport-2.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/s-sport-2.m3u8" },
    { name: "Tabii Spor 1", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/TRT_Spor_logo.svg/2560px-TRT_Spor_logo.svg.png", url: "https://kl9mr2vxw7nq5py1sh4tj3gb6.medya.trt.com.tr/master_1080p.m3u8" },
    { name: "Tabii Spor 2", logo: "", url: "https://mr8bv4kl1nq7sh9tw2xp5zj6g.medya.trt.com.tr/master_1440p.m3u8" },
    { name: "Tabii Spor 3", logo: "", url: "https://mR4vL7nQ2sH9tW5xP1zK3gJ8b.medya.trt.com.tr/master.m3u8" },
    { name: "TRT Spor", logo: "https://www.trgoals124.top/lib/img/channels/trt-spor.png", url: "https://tv-trtspor1.medya.trt.com.tr/master.m3u8" },
    { name: "A Spor", logo: "https://www.trgoals124.top/lib/img/channels/a-spor.png", url: "https://trkvz.daioncdn.net/aspor/aspor_1080p.m3u8?e=1773898701&st=2harnufab2X8Q0Bpk2-FZA&sid=8981uwudoocp&app=45f847c4-04e8-419a-a561-2ebf87084765&ce=3" }
];

// BAŞLATMA FONKSİYONLARI
window.onload = () => {
    setLayout(1);
    renderChannels();
    setupHorizontalScroll();
};

function setupHorizontalScroll() {
    const el = document.getElementById("channels");
    if (el) {
        el.addEventListener("wheel", (evt) => {
            evt.preventDefault();
            el.scrollLeft += evt.deltaY;
        });
    }
}

// PLAYER OLUŞTURMA
function createPlayers(count) {
    const container = document.getElementById("players");
    container.innerHTML = ""; 
    players = [];
    hlsInstances = [];
    playerInfos = [];

    container.className = `player-layout-${count}`;

    for (let i = 0; i < count; i++) {
        const box = document.createElement("div");
        box.className = "modern-player-card fade-in";
        if (i === activePlayer) box.classList.add("active");
        
        const overlay = document.createElement("div");
        overlay.className = "player-overlay";
        overlay.innerHTML = `
            <div class="stream-badge">LIVE</div>
            <div class="stream-name">SİNYAL BEKLENİYOR...</div>
            <div class="player-actions"><button onclick="togglePiP(${i})">⧉</button></div>
        `;
        box.appendChild(overlay);
        playerInfos.push(overlay.querySelector(".stream-name"));

        box.onclick = () => selectPlayer(i);
        
        const video = document.createElement("video");
        video.autoplay = true; video.playsInline = true;
        video.muted = (i !== activePlayer);
        
        box.appendChild(video);
        container.appendChild(box);
        players.push(video);
        hlsInstances.push(null);
    }
}

// YAYIN OYNATMA (HLS CORE)
function playStream(url, name) {
    if (players.length === 0) setLayout(1);
    const video = players[activePlayer];
    if (playerInfos[activePlayer]) playerInfos[activePlayer].innerText = name;
    
    if (hlsInstances[activePlayer]) hlsInstances[activePlayer].destroy();
    
    if (Hls.isSupported()) {
        const hls = new Hls({ manifestLoadingMaxRetry: 5 });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(e => console.log("Auto-play blocked")));
        hlsInstances[activePlayer] = hls;
    } else {
        video.src = url;
        video.play();
    }
}

// SEÇİM VE DÜZEN
function selectPlayer(index) {
    activePlayer = index;
    document.querySelectorAll(".modern-player-card").forEach((el, i) => {
        const isActive = (i === index);
        el.classList.toggle("active", isActive);
        if (players[i]) {
            players[i].muted = !isActive;
            players[i].style.filter = isActive ? "brightness(1)" : "brightness(0.3)";
        }
    });
    document.getElementById("current-channel-title").innerText = playerInfos[index]?.innerText || "Ana Ekran";
}

function setLayout(count) { 
    activePlayer = 0; 
    const container = document.getElementById("players");
    container.style.opacity = "0";
    setTimeout(() => {
        createPlayers(count);
        container.style.opacity = "1";
    }, 200);
}

// KANAL LİSTESİNİ BASMA
function renderChannels(filter = "") {
    const list = document.getElementById("channels"); 
    if (!list) return;
    list.innerHTML = "";
    
    channels.filter(c => c.name.toLowerCase().includes(filter.toLowerCase())).forEach(c => {
        const card = document.createElement("div"); 
        card.className = "channel-card"; 
        const logoHtml = c.logo ? `<img src="${c.logo}" alt="">` : `<div class="no-logo">${c.name[0]}</div>`;
        
        card.innerHTML = `
            <div class="card-glow"></div>
            <div class="chan-logo">${logoHtml}</div>
            <div class="chan-info">
                <span class="chan-title">${c.name}</span>
            </div>
        `;
        card.onclick = () => playStream(c.url, c.name);
        list.appendChild(card);
    });
}

async function togglePiP(index) {
    try {
        if (players[index] !== document.pictureInPictureElement) await players[index].requestPictureInPicture();
        else await document.exitPictureInPicture();
    } catch (e) { console.warn("PiP Hatası"); }
}

function toggleCinemaMode() {
    document.body.classList.toggle("cinema-mode");
}

document.getElementById("search")?.addEventListener("input", e => renderChannels(e.target.value));
