let activePlayer = 0;
let players = [];
let hlsInstances = [];
let playerInfos = [];

// SİDEBAR AÇMA/KAPAMA
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.querySelector(".toggle-btn");
    sidebar.classList.toggle("collapsed");
    toggleBtn.innerText = sidebar.classList.contains("collapsed") ? "▶" : "◀";
}

// SİNEMA MODU
function toggleCinemaMode() {
    document.body.classList.toggle("cinema-mode");
    const btn = document.getElementById("cinema-btn");
    const isCinema = document.body.classList.contains("cinema-mode");
    btn.innerText = isCinema ? "Işıkları Aç" : "Sinema Modu";
    btn.style.background = isCinema ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 210, 255, 0.1)";
}

// RESİM İÇİNDE RESİM (PiP)
async function togglePiP(index) {
    const video = players[index];
    try {
        if (video !== document.pictureInPictureElement) await video.requestPictureInPicture();
        else await document.exitPictureInPicture();
    } catch (error) { console.error("PiP Hatası:", error); }
}

// PLAYER KUTULARINI OLUŞTURMA
function createPlayers(count) {
    const container = document.getElementById("players");
    container.innerHTML = ""; 
    players = [];
    hlsInstances = [];
    playerInfos = [];

    const isMobile = window.innerWidth <= 768;

    // Grid Düzeni Hesaplama
    if (isMobile) {
        container.style.gridTemplateColumns = (count === 4) ? "1fr 1fr" : "1fr";
        container.style.height = "auto"; 
    } else {
        const gridStyles = { 1: "1fr", 2: "1fr 1fr", 4: "1fr 1fr" };
        container.style.gridTemplateColumns = gridStyles[count] || "1fr";
        container.style.height = "100%";
    }

    for (let i = 0; i < count; i++) {
        const box = document.createElement("div");
        box.className = "player-box fade-in"; // Animasyon için class
        box.dataset.index = i;
        if (i === activePlayer) box.classList.add("active");
        
        const info = document.createElement("div");
        info.className = "player-info";
        info.innerHTML = `<span>Giriş ${i + 1}:</span> YAYIN BEKLENİYOR...`;
        box.appendChild(info);
        playerInfos.push(info);

        const pipBtn = document.createElement("button");
        pipBtn.className = "pip-btn";
        pipBtn.innerHTML = "⧉";
        pipBtn.title = "Resim İçinde Resim";
        pipBtn.onclick = (e) => { e.stopPropagation(); togglePiP(i); };
        box.appendChild(pipBtn);

        // Seçim Fonksiyonu
        const handleSelection = (e) => {
            if (!e.target.classList.contains('pip-btn')) {
                selectPlayer(i);
            }
        };
        box.onclick = handleSelection;
        
        const video = document.createElement("video");
        video.controls = true; 
        video.autoplay = true; 
        video.playsInline = true;
        video.muted = (i !== activePlayer);
        
        box.appendChild(video);
        container.appendChild(box);
        players.push(video);
        hlsInstances.push(null);
    }
}

// KUTU SEÇİMİ (GÖRSEL ODAKLI)
function selectPlayer(index) {
    activePlayer = index;
    document.querySelectorAll(".player-box").forEach((el, i) => {
        el.classList.toggle("active", i === index);
        if (players[i]) players[i].muted = (i !== index);
    });
    
    const activeName = playerInfos[index] ? playerInfos[index].innerText.replace("Giriş " + (index+1) + ":", "") : "Yayın Merkezi";
    document.getElementById("current-channel").innerText = activeName;
}

// YAYINI OYNATMA (HATA YÖNETİMLİ)
function playStream(url, name = "Bilinmeyen Kanal") {
    if (players.length === 0) createPlayers(1);

    const video = players[activePlayer];
    if (playerInfos[activePlayer]) {
        playerInfos[activePlayer].innerHTML = `<span>Giriş ${activePlayer + 1}:</span> ${name}`;
    }
    
    if (hlsInstances[activePlayer]) hlsInstances[activePlayer].destroy();
    
    if (Hls.isSupported()) {
        const hls = new Hls({
            manifestLoadingMaxRetry: 4,
            levelLoadingMaxRetry: 4
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
        
        // Hata Yönetimi
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                console.warn("Yayın hatası, tekrar deneniyor...");
                hls.recoverMediaError();
            }
        });
        
        hlsInstances[activePlayer] = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play();
    }
}

// EKRAN DÜZENİ DEĞİŞTİRME
function setLayout(count) { 
    activePlayer = 0; 
    createPlayers(count); 
}

// KANAL LİSTESİ (VERİ YAPISI AYNI)
const channels = [
    { name: "Bein Sports 1", logo: "https://trgooltv61.top/img/beinsports1.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/bein-sports-1.m3u8" },
    { name: "Bein Sports 2", logo: "https://trgooltv61.top/img/beinsports2.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/bein-sports-2.m3u8" },
    { name: "Bein Sports 3", logo: "https://trgooltv61.top/img/beinsports3.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/bein-sports-3.m3u8" },
    { name: "Bein Sports 4", logo: "https://trgooltv61.top/img/beinsports4.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/bein-sports-4.m3u8" },
    { name: "Bein Sports 5", logo: "https://trgooltv61.top/img/beinsports5.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/bein-sports-5.m3u8" },
    { name: "Bein Sports Max 1", logo: "https://trgooltv61.top/img/beinsportsmax1.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/bein-sports-max-1.m3u8" },
    { name: "S Sport", logo: "https://www.trgoals125.top/lib/img/channels/s-sport.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/s-sport.m3u8" },
    { name: "S Sport 2", logo: "https://www.trgoals125.top/lib/img/channels/s-sport-2.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/s-sport-2.m3u8" },
    { name: "Tabii Spor (1080p)", logo: "", url: "https://kl9mr2vxw7nq5py1sh4tj3gb6.medya.trt.com.tr/master_1080p.m3u8" },
    { name: "TRT Spor (1080p)", logo: "https://www.trgoals124.top/lib/img/channels/trt-spor.png", url: "https://tv-trtspor1.medya.trt.com.tr/master.m3u8" },
    { name: "A Spor (1080p)", logo: "https://www.trgoals124.top/lib/img/channels/a-spor.png", url: "https://trkvz.daioncdn.net/aspor/aspor_1080p.m3u8?e=1773898701&st=2harnufab2X8Q0Bpk2-FZA&sid=8981uwudoocp&app=45f847c4-04e8-419a-a561-2ebf87084765&ce=3" }
];

function renderChannels(filter = "") {
    const list = document.getElementById("channels"); 
    list.innerHTML = "";
    
    const filteredChannels = channels.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
    
    filteredChannels.forEach(c => {
        const div = document.createElement("div"); 
        div.className = "channel"; 
        
        // Logo yoksa şık bir ikon göster
        const logoHtml = c.logo ? `<img src="${c.logo}" alt="${c.name}">` : `<div class="no-logo">${c.name.charAt(0)}</div>`;
        
        div.innerHTML = `
            <div class="channel-logo">${logoHtml}</div>
            <div class="channel-name">${c.name}</div>
        `;
        
        div.onclick = () => {
            playStream(c.url, c.name);
            document.querySelectorAll(".channel").forEach(el => el.classList.remove("selected-chan"));
            div.classList.add("selected-chan");
            if(window.innerWidth <= 768) toggleSidebar();
        };
        list.appendChild(div);
    });
}

// Pencere boyutu değiştiğinde grid'i güncelle
window.addEventListener('resize', () => {
    if(players.length > 0) {
        const container = document.getElementById("players");
        if(window.innerWidth <= 768) {
            container.style.gridTemplateColumns = (players.length === 4) ? "1fr 1fr" : "1fr";
        } else {
            container.style.gridTemplateColumns = (players.length === 4 || players.length === 2) ? "1fr 1fr" : "1fr";
        }
    }
});

document.getElementById("search").addEventListener("input", e => renderChannels(e.target.value));

renderChannels();
