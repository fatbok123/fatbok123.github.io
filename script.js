let activePlayer = 0;
let players = [];
let hlsInstances = [];

const channels = [
    { name: "Bein Sports 1", logo: "https://trgooltv61.top/img/beinsports1.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/bein-sports-1.m3u8" },
    { name: "Bein Sports 2", logo: "https://trgooltv61.top/img/beinsports2.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/bein-sports-2.m3u8" },
    { name: "Bein Sports 3", logo: "https://trgooltv61.top/img/beinsports3.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/bein-sports-3.m3u8" },
    { name: "S Sport", logo: "https://www.trgoals125.top/lib/img/channels/s-sport.png", url: "https://noisy-cake-8ebc.travestigamzes.workers.dev/https://corestream.ronaldovurdu.help//hls/s-sport.m3u8" },
    { name: "TRT Spor", logo: "https://www.trgoals124.top/lib/img/channels/trt-spor.png", url: "https://tv-trtspor1.medya.trt.com.tr/master.m3u8" },
    { name: "A Spor", logo: "https://www.trgoals124.top/lib/img/channels/a-spor.png", url: "https://trkvz.daioncdn.net/aspor/aspor_1080p.m3u8?e=1773898701&st=2harnufab2X8Q0Bpk2-FZA&sid=8981uwudoocp&app=45f847c4-04e8-419a-a561-2ebf87084765&ce=3" }
];

window.onload = () => {
    setLayout(1);
    renderChannels();
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }, 1000);
};

function setLayout(count) {
    const container = document.getElementById("players");
    container.innerHTML = "";
    players = [];
    hlsInstances = [];
    activePlayer = 0;

    const gridMap = { 1: "1fr", 2: "1fr 1fr", 4: "1fr 1fr" };
    container.style.gridTemplateColumns = gridMap[count];

    for (let i = 0; i < count; i++) {
        const box = document.createElement("div");
        box.className = "modern-player fade-in";
        if (i === 0) box.classList.add("active");
        
        box.onclick = () => selectPlayer(i);
        
        const video = document.createElement("video");
        video.autoplay = true; video.playsInline = true;
        video.muted = (i !== 0);

        box.appendChild(video);
        container.appendChild(box);
        players.push(video);
        hlsInstances.push(null);
    }
}

function selectPlayer(index) {
    activePlayer = index;
    document.querySelectorAll(".modern-player").forEach((el, i) => {
        el.classList.toggle("active", i === index);
        if (players[i]) {
            players[i].muted = (i !== index);
            players[i].style.filter = (i === index) ? "none" : "brightness(0.4) blur(2px)";
        }
    });
}

function playStream(url, name) {
    const video = players[activePlayer];
    if (hlsInstances[activePlayer]) hlsInstances[activePlayer].destroy();

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
        hlsInstances[activePlayer] = hls;
    } else {
        video.src = url; video.play();
    }
}

function renderChannels(filter = "") {
    const track = document.getElementById("channels");
    track.innerHTML = "";
    channels.filter(c => c.name.toLowerCase().includes(filter.toLowerCase())).forEach(c => {
        const item = document.createElement("div");
        item.className = "chan-item";
        item.innerHTML = c.logo ? `<img src="${c.logo}">` : `<span>${c.name[0]}</span>`;
        item.onclick = () => playStream(c.url, c.name);
        track.appendChild(item);
    });
}

document.getElementById("search").addEventListener("input", e => renderChannels(e.target.value));
