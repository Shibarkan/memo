const gallery = document.getElementById("gallery");
const addButton = document.getElementById("addButton");
const uploadModal = document.getElementById("uploadModal");
const closeModal = document.getElementById("closeModal");
const uploadForm = document.getElementById("uploadForm");
const photoInput = document.getElementById("photoInput");
const captionInput = document.getElementById("captionInput");

// Ambil data dari localStorage
function getData() {
  return JSON.parse(localStorage.getItem("photos") || "[]");
}

// Simpan data ke localStorage
function saveData(data) {
  localStorage.setItem("photos", JSON.stringify(data));
}

// Buat transformasi acak
function randomTransform() {
  const rotations = [-8, -4, 0, 4, 8];
  const yOffset = [-1, 0, 1];
  return `rotate(${
    rotations[Math.floor(Math.random() * rotations.length)]
  }deg) translateY(${yOffset[Math.floor(Math.random() * yOffset.length)]}rem)`;
}

// Render galeri dengan animasi delay
function renderGallery() {
  gallery.innerHTML = "";
  const data = getData();

  data.forEach((item, index) => {
    setTimeout(() => {
      const div = document.createElement("div");
      div.className =
        "relative bg-white rounded shadow-md p-2 transition duration-700 transform opacity-0 translate-y-10";
      div.style.transform += " " + randomTransform();

      const img = document.createElement("img");
      img.src = item.url;
      img.alt = "kenangan";
      img.className = "w-full h-60 object-cover rounded";

      const caption = document.createElement("p");
      caption.className = "text-sm mt-2 text-gray-600";
      caption.textContent = item.caption;

      const time = document.createElement("p");
      time.className = "text-xs text-right text-gray-400";
      time.textContent = new Date(item.date).toLocaleString();

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Hapus";
      deleteBtn.className =
        "absolute top-1 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600";
      deleteBtn.onclick = () => {
        const newData = getData().filter((_, i) => i !== index);
        saveData(newData);
        renderGallery();
      };

      div.appendChild(img);
      div.appendChild(caption);
      div.appendChild(time);
      div.appendChild(deleteBtn);
      gallery.appendChild(div);

      // Trigger animasi satu per satu
      setTimeout(() => {
        div.classList.remove("opacity-0", "translate-y-10");
        div.classList.add("opacity-100", "translate-y-0");
      }, 50);
    }, index * 200); // Delay tiap item
  });
}

// Buka modal upload
addButton.onclick = () => {
  uploadModal.classList.remove("hidden");
};

// Tutup modal
closeModal.onclick = () => {
  uploadModal.classList.add("hidden");
};

// Submit upload
uploadForm.onsubmit = (e) => {
  e.preventDefault();
  const file = photoInput.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    const fakePath = `pretties/${file.name}`; // Simulasi folder pretties
    const newItem = {
      url: reader.result,
      caption: captionInput.value,
      date: new Date().toISOString(),
      path: fakePath,
    };
    const current = getData();
    current.push(newItem);
    saveData(current);
    renderGallery();
    uploadModal.classList.add("hidden");
    uploadForm.reset();
  };
  if (file) {
    reader.readAsDataURL(file);
  }
};
//music

// Emot love terbang
function createLove() {
  const img = document.createElement("img");
  img.src = "images/love.png"; // love
  img.className = "love";
  img.style.left = Math.random() * window.innerWidth + "px";
  img.style.animationDuration = 2 + Math.random() * 3 + "s";
  img.style.transform = `rotate(${Math.random() * 360}deg) scale(${
    0.6 + Math.random() * 0.8
  })`;
  document.body.appendChild(img);
  setTimeout(() => img.remove(), 5000);
}

// Loop terus-menerus
setInterval(createLove, 400);
const previewImage = document.getElementById("previewImage");

// Preview saat pilih gambar
photoInput.onchange = () => {
  const file = photoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      previewImage.src = reader.result;
      previewImage.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  } else {
    previewImage.classList.add("hidden");
    previewImage.src = "";
  }
};

// Render awal
renderGallery();

//music
const musicBtn = document.getElementById("musicBtn");
const musicPopup = document.getElementById("musicPopup");
const overlay = document.getElementById("overlay");
const closePopup = document.getElementById("closePopup");
const audio = document.getElementById("audio");
const songList = document.getElementById("songList");
const currentSong = document.getElementById("currentSong");
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");
const progressBar = document.getElementById("progressBar");

const songTitles = [
  "bad",
  "sunny_days",
  "peach_eyes",
  "evening_glow",
  "pink",
  "calla",
  "love",
  "homesick",
  "dried_flower",
  "sunburn",
  "akira",
  "nouvelle_vague",
  "so_real",
  "season",
];

const songs = songTitles.map((title) => ({
  title: title.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
  file: `music/${title}.mp3`,
}));

let currentSongIndex = 0;

// Load semua lagu ke daftar
function loadSongs() {
  songList.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title;
    li.className = "cursor-pointer hover:text-pink-600 transition";
    li.onclick = () => {
      loadSong(index);
      audio.play();
      updatePlayPauseIcon();
    };
    songList.appendChild(li);
  });
}

function loadSong(index) {
  currentSongIndex = index;
  audio.src = songs[index].file;
  currentSong.textContent = songs[index].title;
}

function updatePlayPauseIcon() {
  playIcon.src = audio.paused ? "images/pause.png" : "images/play.png";
}

// Play/pause toggle
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
  updatePlayPauseIcon();
});

// Update progress bar
audio.addEventListener("timeupdate", () => {
  progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
});

progressBar.addEventListener("input", () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});
//otomatis play
audio.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  updatePlayPauseIcon();
});

// Buka/tutup popup
function togglePopup() {
  musicPopup.classList.toggle("opacity-0");
  musicPopup.classList.toggle("translate-y-5");
  musicPopup.classList.toggle("pointer-events-none");
  overlay.classList.toggle("hidden");
}

musicBtn.addEventListener("click", togglePopup);
closePopup.addEventListener("click", togglePopup);
overlay.addEventListener("click", togglePopup);

// Load awal
loadSongs();
