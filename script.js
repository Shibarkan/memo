const gallery = document.getElementById("gallery");
const addButton = document.getElementById("addButton");
const uploadModal = document.getElementById("uploadModal");
const closeModal = document.getElementById("closeModal");
const uploadForm = document.getElementById("uploadForm");
const photoInput = document.getElementById("photoInput");
const captionInput = document.getElementById("captionInput");
const previewImage = document.getElementById("previewImage");

// Ambil dan simpan data lokal
function getData() {
  return JSON.parse(localStorage.getItem("photos") || "[]");
}
function saveData(data) {
  localStorage.setItem("photos", JSON.stringify(data));
}

// Acak gaya
function randomTransform() {
  const rotations = [-8, -4, 0, 4, 8];
  const yOffset = [-1, 0, 1];
  return `rotate(${
    rotations[Math.floor(Math.random() * rotations.length)]
  }deg) translateY(${yOffset[Math.floor(Math.random() * yOffset.length)]}rem)`;
}

// Tampilkan galeri
function renderGallery() {
  gallery.innerHTML = "";
  const data = getData();

  data.forEach((item, index) => {
    setTimeout(() => {
      const div = document.createElement("div");
      div.className =
        "photo-item relative bg-white rounded shadow-md p-2 transform opacity-0 translate-y-10";
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

      div.appendChild(img);
      div.appendChild(caption);
      div.appendChild(time);
      gallery.appendChild(div);

      setTimeout(() => {
        div.classList.remove("opacity-0", "translate-y-10");
        div.classList.add("opacity-100", "translate-y-0");
      }, 50);
    }, index * 200);
  });
}

// Modal Upload
addButton.onclick = () => {
  if (isSelectMode) return; // Jangan buka modal jika sedang pilih
  uploadModal.classList.remove("hidden");
};

closeModal.onclick = () => uploadModal.classList.add("hidden");

uploadForm.onsubmit = (e) => {
  e.preventDefault();
  const file = photoInput.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    const newItem = {
      url: reader.result,
      caption: captionInput.value,
      date: new Date().toISOString(),
    };
    const current = getData();
    current.push(newItem);
    saveData(current);
    renderGallery();
    uploadModal.classList.add("hidden");
    uploadForm.reset();
    previewImage.classList.add("hidden");
    previewImage.src = "";
  };
  if (file) {
    reader.readAsDataURL(file);
  }
};

// Preview Gambar
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

// Inisialisasi galeri awal
renderGallery();

// edit hapus
const selectModeBtn = document.getElementById("selectModeBtn");
const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
const selectionInfo = document.getElementById("selectionInfo");
const confirmDeleteModal = document.getElementById("confirmDeleteModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

let isSelectMode = false;
let selectedIndexes = new Set();

// Toggle Mode Pilih
selectModeBtn.addEventListener("click", () => {
  isSelectMode = !isSelectMode;
  selectedIndexes.clear();
  // disable
  addButton.disabled = isSelectMode;
  if (isSelectMode) {
    addButton.classList.add(
      "opacity-50",
      "cursor-not-allowed",
      "pointer-events-none"
    );
  } else {
    addButton.classList.remove(
      "opacity-50",
      "cursor-not-allowed",
      "pointer-events-none"
    );
  }

  document.querySelectorAll(".photo-item").forEach((div, index) => {
    div.classList.remove(
      "ring",
      "ring-pink-500",
      "scale-95",
      "brightness-75",
      "wiggle"
    );

    if (isSelectMode) {
      div.classList.add("wiggle"); // tambahkan goyang
      div.addEventListener(
        "click",
        (div._selectHandler = () => toggleSelect(div, index))
      );
    } else {
      div.removeEventListener("click", div._selectHandler);
    }
  });

  deleteSelectedBtn.classList.toggle("hidden", !isSelectMode);
  if (isSelectMode) {
    selectionInfo.classList.remove("hidden");
    selectionInfo.classList.remove("slide-in-boing"); // reset animasi
    void selectionInfo.offsetWidth; // trigger reflow agar animasi bisa diulang
    selectionInfo.classList.add("slide-in-boing");
  } else {
    selectionInfo.classList.add("hidden");
  }

  const icon = selectModeBtn.querySelector("img");
  icon.src = isSelectMode ? "images/close.png" : "images/select.png";
});

// Fungsi Pilih
function toggleSelect(div, index) {
  if (selectedIndexes.has(index)) {
    selectedIndexes.delete(index);
    div.classList.remove("ring", "ring-pink-500", "scale-95", "brightness-75");
  } else {
    selectedIndexes.add(index);
    div.classList.add("ring", "ring-pink-500", "scale-95", "brightness-75");

    if (!selectionInfo.classList.contains("hidden")) {
      selectionInfo.classList.add("hidden");
    }
  }

  if (selectedIndexes.size === 0 && isSelectMode) {
    selectionInfo.classList.remove("hidden");
  }
}

// Tampilkan Modal Konfirmasi saat Klik Hapus
deleteSelectedBtn.addEventListener("click", () => {
  if (selectedIndexes.size > 0) {
    confirmDeleteModal.classList.remove("hidden");
  }
});

// Konfirmasi Hapus
confirmDeleteBtn.addEventListener("click", () => {
  const data = getData().filter((_, i) => !selectedIndexes.has(i));
  saveData(data);
  isSelectMode = false;
  selectedIndexes.clear();
  renderGallery();
  confirmDeleteModal.classList.add("hidden");
  deleteSelectedBtn.classList.add("hidden");
  selectionInfo.classList.add("hidden");

  const icon = selectModeBtn.querySelector("img");
  icon.src = "images/select.png";
});

// Batal Hapus
cancelDeleteBtn.addEventListener("click", () => {
  confirmDeleteModal.classList.add("hidden");
});

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
  "wildflowers",
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
