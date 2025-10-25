// 1️⃣ Define your playlist
const songs = [
  { title: "Sooiyan(from 'Guddu Rangeela')", artist: "Arijit Singh(Remastered by ASMZIC)", src: "songs/Sooiyan-(Reverbed-and-Amplified).mp3", cover: "images/default-cover.jpg" },
  { title: "O Rangrez(Lofi-Slowed-Reverb)", artist: "Shankar-Ehsaan-Loy,Javed Bashir,Shreya Ghoshal", src: "songs/O-Rangrez-(Lofi-Slowed-Reverb).mp3", cover: "images/default-cover.jpg" },
  { title: "Samjhawan", artist: "Sharib Toshi & Jawad Ahmed,Arijit Singh, Shreya Ghoshal", src: "songs/Samjhawan-[Slowed-Reverb].mp3", cover: "images/default-cover.jpg" },
  { title: "Once Upon A Time x Number 1", artist: "Anirudh Ravichander, Ujwal Gupta, Vishal Dadlani", src: "songs/Number-1-x-Once-Upon-A-Time.mp3", cover: "images/default-cover.jpg" },
  { title: "Anirudh Mass Playlist", artist: "Anirudh Ravichander & Various Artists", src: "songs/Anirudh-Mass-Playlist.mp3", cover: "images/default-cover.jpg" },
  { title: "Chaleya x Khudaya Ishq", artist: "Anirudh Ravichander, Amit Trivedi & Various Artists", src: "songs/chaleya-x-khudaya-ishq.mp3", cover: "images/default-cover.jpg" },
  { title: "Dahaa Extended BGM", artist: "Anirudh Ravichander, ASMZIC", src: "songs/coolie-dahaa-bgm.mp3", cover: "images/default-cover.jpg" }
];

// 2️⃣ Grab all HTML elements
const audio = document.getElementById("audio");
const title = document.getElementById("song-title");
const cover = document.getElementById("cover");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const themeToggle = document.getElementById("theme-toggle");
const songList = document.getElementById("song-list");
const progressContainer = document.querySelector(".progress-container");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

// 🎨 3D Parallax effect
document.addEventListener("mousemove", (e) => {
  const x = (window.innerWidth / 2 - e.clientX) / 50;
  const y = (window.innerHeight / 2 - e.clientY) / 50;

  document.querySelector("header").style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  document.querySelector(".player").style.transform = `rotateY(${x/2}deg) rotateX(${y/2}deg)`;
  document.querySelector(".playlist").style.transform = `rotateY(${x/3}deg) rotateX(${y/3}deg)`;
});

// 3️⃣ Audio Spectrum Visualization + Particles
const canvas = document.createElement("canvas");
canvas.id = "audio-visualizer";
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "0";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Particles
const particleCount = 80;
const particles = [];
for(let i=0; i<particleCount; i++){
  particles.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: Math.random()*2+1, dx: (Math.random()-0.5)*0.5, dy: (Math.random()-0.5)*0.5 });
}

// 🎵 Draw visualizer + particles
function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);
  analyser.getByteFrequencyData(dataArray);
  
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Draw spectrum bars
  const barWidth = (canvas.width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;
  for(let i=0; i<bufferLength; i++){
    barHeight = dataArray[i]/2;
    const gradient = ctx.createLinearGradient(0,0,0,barHeight);
    gradient.addColorStop(0, "#5eb8ff");
    gradient.addColorStop(1, "#0d1b2a");
    ctx.fillStyle = gradient;
    ctx.fillRect(x, canvas.height-barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }

  // Draw particles
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if(p.x<0 || p.x>canvas.width) p.dx*=-1;
    if(p.y<0 || p.y>canvas.height) p.dy*=-1;
  });
}
drawVisualizer();

// 4️⃣ Music player logic
let currentSong = 0;
let isPlaying = false;
let queue = [];
let queueStartedFrom = null;

function formatTime(sec){
  const hours = Math.floor(sec/3600);
  const minutes = Math.floor((sec%3600)/60);
  const seconds = Math.floor(sec%60);
  return hours>0 ? `${hours}:${minutes<10?"0":""}${minutes}:${seconds<10?"0":""}${seconds}` : `${minutes}:${seconds<10?"0":""}${seconds}`;
}

function loadSong(song){
  title.textContent = song.title;
  cover.src = song.cover;
  audio.src = song.src;
  updateActivePlaylist();
}

function playSong(){ isPlaying=true; playBtn.textContent="⏸"; audio.play(); cover.classList.add("playing","pulse"); }
function pauseSong(){ isPlaying=false; playBtn.textContent="▶️"; audio.pause(); cover.classList.remove("playing","pulse"); }

function nextSong(){
  if(queue.length>0){ currentSong=queue.shift(); if(queueStartedFrom===null) queueStartedFrom=currentSong; }
  else { if(queueStartedFrom!==null && currentSong===queueStartedFrom-1){ currentSong=(currentSong+1)%songs.length; queueStartedFrom=null; } else { currentSong=(currentSong+1)%songs.length; } }
  loadSong(songs[currentSong]); playSong(); updateQueueDisplay();
}
function prevSong(){ currentSong=(currentSong-1+songs.length)%songs.length; loadSong(songs[currentSong]); if(isPlaying) audio.play(); }

// Progress bar
audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime/audio.duration)*100;
  progress.style.width = percent+"%";
  currentTimeEl.textContent=formatTime(audio.currentTime);
  durationEl.textContent=formatTime(audio.duration);
});
progressContainer.addEventListener("click", (e) => { audio.currentTime=(e.offsetX/progressContainer.clientWidth)*audio.duration; });
audio.addEventListener("ended", nextSong);
playBtn.addEventListener("click", ()=>{ isPlaying?pauseSong():playSong(); });
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// Playlist
songs.forEach((song,index)=>{
  const li=document.createElement("li");
  li.textContent=song.title;
  li.addEventListener("click",()=>{
    if(isPlaying){ queue.push(index); } else { currentSong=index; loadSong(songs[currentSong]); playSong(); }
    updateQueueDisplay();
  });
  songList.appendChild(li);
});

function updateQueueDisplay(){
  const queueList=document.getElementById("queue-list");
  if(!queueList) return;
  queueList.innerHTML="";
  queue.forEach((idx,i)=>{
    const li=document.createElement("li");
    li.textContent=songs[idx].title;
    li.addEventListener("click",()=>{ queue.splice(i,1); updateQueueDisplay(); });
    queueList.appendChild(li);
  });
}

function updateActivePlaylist(){
  document.querySelectorAll("#song-list li").forEach((li,idx)=>{ li.classList.toggle("active",idx===currentSong); });
}

// Theme toggle
themeToggle.addEventListener("click",()=>{
  document.body.classList.toggle("light");
  themeToggle.textContent=document.body.classList.contains("light")?"☀️":"🌙";
});

// Load first song
loadSong(songs[currentSong]);
updateQueueDisplay();
