// === 1️⃣ Playlist ===
const songs = [
  { title:"Sooiyan", artist:"Arijit Singh", src:"songs/Sooiyan.mp3", cover:"images/default-cover.jpg"},
  { title:"O Rangrez", artist:"Shankar-Ehsaan-Loy", src:"songs/O-Rangrez.mp3", cover:"images/default-cover.jpg"},
  { title:"Samjhawan", artist:"Sharib Toshi", src:"songs/Samjhawan.mp3", cover:"images/default-cover.jpg"},
  { title:"Once Upon A Time", artist:"Anirudh Ravichander", src:"songs/Number-1-x-Once-Upon-A-Time.mp3", cover:"images/default-cover.jpg"},
  { title:"Anirudh Mass", artist:"Anirudh Ravichander", src:"songs/Anirudh-Mass-Playlist.mp3", cover:"images/default-cover.jpg"},
  { title:"Chaleya x Khudaya Ishq", artist:"Anirudh Ravichander", src:"songs/chaleya-x-khudaya-ishq.mp3", cover:"images/default-cover.jpg"},
  { title:"Dahaa BGM", artist:"Anirudh Ravichander", src:"songs/coolie-dahaa-bgm.mp3", cover:"images/default-cover.jpg"}
];

// === 2️⃣ Grab HTML elements ===
const audio = document.getElementById("audio"),
      cover = document.getElementById("cover"),
      titleEl = document.getElementById("song-title"),
      playBtn = document.getElementById("play"),
      nextBtn = document.getElementById("next"),
      prevBtn = document.getElementById("prev"),
      themeToggle = document.getElementById("theme-toggle"),
      songList = document.getElementById("song-list"),
      progressContainer = document.querySelector(".progress-container"),
      progress = document.getElementById("progress"),
      currentTimeEl = document.getElementById("current-time"),
      durationEl = document.getElementById("duration");

// Optional: Create canvases dynamically if not in HTML
let particleCanvas = document.getElementById("particle-canvas");
if(!particleCanvas){
  particleCanvas = document.createElement("canvas");
  particleCanvas.id = "particle-canvas";
  document.body.appendChild(particleCanvas);
}

let spectrumCanvas = document.getElementById("spectrum-canvas");
if(!spectrumCanvas){
  spectrumCanvas = document.createElement("canvas");
  spectrumCanvas.id = "spectrum-canvas";
  document.body.appendChild(spectrumCanvas);
}

const pCtx = particleCanvas.getContext("2d");
const sCtx = spectrumCanvas.getContext("2d");
particleCanvas.width = spectrumCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;
spectrumCanvas.height = 120;

// === 3️⃣ Load song ===
let currentSong = 0, isPlaying = false, queue = [];

function loadSong(song){
  titleEl.textContent = song.title;
  cover.src = song.cover;
  audio.src = song.src;
  updateActivePlaylist();
}

// === 4️⃣ Play / Pause ===
function playSong(){ isPlaying = true; playBtn.textContent = "⏸"; audio.play(); cover.classList.add("playing"); }
function pauseSong(){ isPlaying = false; playBtn.textContent = "▶️"; audio.pause(); cover.classList.remove("playing"); }

// === 5️⃣ Next / Prev ===
function nextSong(){
  currentSong = (currentSong+1)%songs.length;
  loadSong(songs[currentSong]);
  playSong();
}
function prevSong(){
  currentSong = (currentSong-1+songs.length)%songs.length;
  loadSong(songs[currentSong]);
  if(isPlaying) audio.play();
}

// === 6️⃣ Playlist Highlight ===
function updateActivePlaylist(){
  document.querySelectorAll("#song-list li").forEach((li, idx) => {
    li.classList.toggle("active", idx===currentSong);
  });
}

// === 7️⃣ Generate Playlist HTML ===
songs.forEach((song,i)=>{
  const li = document.createElement("li");
  li.textContent = song.title;
  li.addEventListener("click", ()=>{
    currentSong=i;
    loadSong(songs[i]);
    playSong();
  });
  songList.appendChild(li);
});

// === 8️⃣ Progress bar ===
audio.addEventListener("timeupdate", ()=>{
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

progressContainer.addEventListener("click",(e)=>{
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
});

function formatTime(sec){
  const minutes = Math.floor(sec/60);
  const seconds = Math.floor(sec%60);
  return `${minutes}:${seconds<10?"0":""}${seconds}`;
}

// === 9️⃣ Controls ===
playBtn.addEventListener("click",()=>{ isPlaying ? pauseSong() : playSong(); });
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// === 1️⃣0️⃣ Theme toggle ===
themeToggle.addEventListener("click", ()=>{
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
});

// === 1️⃣1️⃣ Load first song ===
loadSong(songs[currentSong]);

// === 1️⃣2️⃣ 3D Parallax ===
document.addEventListener("mousemove", (e)=>{
  const x = (window.innerWidth/2 - e.clientX)/50;
  const y = (window.innerHeight/2 - e.clientY)/50;
  document.querySelector("header").style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  document.querySelector(".player").style.transform = `rotateY(${x/2}deg) rotateX(${y/2}deg)`;
  document.querySelector(".playlist").style.transform = `rotateY(${x/3}deg) rotateX(${y/3}deg)`;
});

// === 1️⃣3️⃣ Particles ===
let particles = [];
for(let i=0;i<120;i++){
  particles.push({x:Math.random()*particleCanvas.width, y:Math.random()*particleCanvas.height, r:Math.random()*2+1, dx:(Math.random()-0.5)/2, dy:(Math.random()-0.5)/2});
}

function drawParticles(){
  pCtx.clearRect(0,0,particleCanvas.width,particleCanvas.height);
  particles.forEach(p=>{
    p.x += p.dx; p.y += p.dy;
    if(p.x>particleCanvas.width)p.x=0; if(p.x<0)p.x=particleCanvas.width;
    if(p.y>particleCanvas.height)p.y=0; if(p.y<0)p.y=particleCanvas.height;
    pCtx.beginPath();
    pCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
    pCtx.fillStyle="rgba(94,184,255,0.4)";
    pCtx.fill();
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// === 1️⃣4️⃣ Audio Spectrum ===
const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawSpectrum(){
  requestAnimationFrame(drawSpectrum);
  sCtx.clearRect(0,0,spectrumCanvas.width,spectrumCanvas.height);
  analyser.getByteFrequencyData(dataArray);
  const barWidth = (spectrumCanvas.width / bufferLength) * 2.5;
  let x = 0;
  for(let i=0;i<bufferLength;i++){
    const barHeight = dataArray[i]/2;
    sCtx.fillStyle = "rgba(94,184,255,0.8)";
    sCtx.fillRect(x, spectrumCanvas.height-barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

audio.addEventListener("play", ()=>{
  audioCtx.resume();
  drawSpectrum();
});
