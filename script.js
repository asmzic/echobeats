// 1️⃣ Define your playlist
const songs = [
  {
    title: "Sooiyan(from 'Guddu Rangeela')",
    artist: "Arijit Singh(Remastered by ASMZIC)",
    src: "songs/Sooiyan-(Reverbed-and-Amplified).mp3",
    cover: "images/default-cover.jpg",
  },
  {
    title: "O Rangrez(Lofi-Slowed-Reverb)",
    artist: "Shankar-Ehsaan-Loy,Javed Bashir,Shreya Ghoshal",
    src: "songs/O-Rangrez-(Lofi-Slowed-Reverb).mp3",
    cover: "images/default-cover.jpg",
  },
  {
    title: "Samjhawan",
    artist: "Sharib Toshi & Jawad Ahmed,Arijit Singh, Shreya Ghoshal",
    src: "songs/Samjhawan-[Slowed-Reverb].mp3",
    cover: "images/default-cover.jpg",
  },
  {
    title: "Once Upon A Time x Number 1",
    artist: "Anirudh Ravichander, Ujwal Gupta, Vishal Dadlani",
    src: "songs/Number-1-x-Once-Upon-A-Time.mp3",
    cover: "images/default-cover.jpg",
  },
  {
    title: "Anirudh Mass Playlist",
    artist: "Anirudh Ravichander & Various Artists",
    src: "songs/Anirudh-Mass-Playlist.mp3",
    cover: "images/default-cover.jpg",
  },
  {
    title: "Chaleya x Khudaya Ishq",
    artist: "Anirudh Ravichander, Amit Trivedi & Various Artists",
    src: "songs/chaleya-x-khudaya-ishq.mp3",
    cover: "images/default-cover.jpg",
  },
  {
    title: "Dahaa Extended BGM",
    artist: "Anirudh Ravichander, ASMZIC",
    src: "songs/coolie-dahaa-bgm.mp3",
    cover: "images/default-cover.jpg",
  }
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

// Format seconds to hh:mm:ss or mm:ss
function formatTime(sec) {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = Math.floor(sec % 60);

  if (hours > 0) {
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  } else {
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
}

// Update progress bar and times
audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

// Click on progress bar to seek
progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
});

let currentSong = 0;
let isPlaying = false;

// 3️⃣ Load a song into the player
function loadSong(song) {
  title.textContent = song.title;
  cover.src = song.cover;
  audio.src = song.src;
}

// 4️⃣ Play and pause functions
function playSong() {
  isPlaying = true;
  playBtn.textContent = "⏸"; 
  audio.play();
  cover.classList.add("playing", "pulse"); // Start animations
}

function pauseSong() {
  isPlaying = false;
  playBtn.textContent = "▶️"; 
  audio.pause();
  cover.classList.remove("playing", "pulse"); // Stop animations
}

//Auto-Stop when song ends
audio.addEventListener("ended", () => {
  pauseSong();
});


// Toggle play/pause
playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

// 5️⃣ Next and previous song
function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(songs[currentSong]);
  if (isPlaying) audio.play();
}

function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(songs[currentSong]);
  if (isPlaying) audio.play();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// 6️⃣ Auto-generate playlist in HTML
songs.forEach((song, index) => {
  const li = document.createElement("li");
  li.textContent = song.title;
  li.addEventListener("click", () => {
    currentSong = index;
    loadSong(song);
    playSong();
    
     // Animate active playlist item
    document.querySelectorAll("#song-list li").forEach(li => li.classList.remove("active"));
    li.classList.add("active");
  });
  songList.appendChild(li);
});

// 7️⃣ Theme toggle (dark/light)
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
});

// 8️⃣ Load the first song on page load
loadSong(songs[currentSong]);