/* ===== 1. MENU HAMBURGER (mobile) ===== */
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

menuToggle.addEventListener("click", function () {
  // toggle() menambah class "buka" kalau belum ada, menghapus kalau sudah ada
  const terbuka = mainNav.classList.toggle("buka");
  menuToggle.setAttribute("aria-expanded", terbuka);
});

// Tutup menu otomatis setelah salah satu link diklik
mainNav.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    mainNav.classList.remove("buka");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/* ===== 2. KERANJANG: tambah roti ===== */
const cartBtn = document.querySelector("#cartBtn");
const cartCount = document.querySelector("#cartCount");
const toast = document.querySelector("#toast");
let jumlahKeranjang = 0;
let timerToast;

document.querySelectorAll(".btn-tambah").forEach(function (tombol) {
  tombol.addEventListener("click", function () {
    jumlahKeranjang++;
    cartCount.textContent = jumlahKeranjang;
    tampilkanToast(tombol.dataset.nama + " ditambahkan ke keranjang");

    // efek membesar sebentar pada ikon keranjang
    cartBtn.classList.add("bump");
    setTimeout(function () {
      cartBtn.classList.remove("bump");
    }, 250);
  });
});

cartBtn.addEventListener("click", function () {
  if (jumlahKeranjang === 0) {
    tampilkanToast("Keranjang masih kosong");
  } else {
    tampilkanToast("Keranjang berisi " + jumlahKeranjang + " roti");
  }
});

function tampilkanToast(teks) {
  toast.textContent = teks;
  toast.classList.add("tampil");
  clearTimeout(timerToast); // reset timer kalau diklik cepat berkali-kali
  timerToast = setTimeout(function () {
    toast.classList.remove("tampil");
  }, 2200);
}

/* ===== 3. FILTER MENU: Semua / Gurih / Manis ===== */
const tombolFilter = document.querySelectorAll(".filter button");
const kartuMenu = document.querySelectorAll(".menu-card");

tombolFilter.forEach(function (tombol) {
  tombol.addEventListener("click", function () {
    const kategori = tombol.dataset.filter; // "semua", "gurih", atau "manis"

    // tandai tombol yang aktif
    tombolFilter.forEach(function (t) {
      t.classList.remove("aktif");
      t.setAttribute("aria-pressed", "false");
    });
    tombol.classList.add("aktif");
    tombol.setAttribute("aria-pressed", "true");

    // tampilkan atau sembunyikan kartu sesuai kategori
    kartuMenu.forEach(function (kartu) {
      const cocok = kategori === "semua" || kartu.dataset.kategori === kategori;
      kartu.classList.toggle("sembunyi", !cocok);
    });
  });
});

/* ===== 4. SLIDER TESTIMONI ===== */
const daftarTesti = document.querySelectorAll(".testi");
const testiNomor = document.querySelector("#testiNomor");
let indeksTesti = 0;

function tampilkanTesti(indeks) {
  // % agar kembali ke awal/akhir saat melewati batas
  indeksTesti = (indeks + daftarTesti.length) % daftarTesti.length;

  daftarTesti.forEach(function (testi, urutan) {
    testi.classList.toggle("aktif", urutan === indeksTesti);
  });
  testiNomor.textContent = indeksTesti + 1 + " / " + daftarTesti.length;
}

document.querySelector("#testiPrev").addEventListener("click", function () {
  tampilkanTesti(indeksTesti - 1);
});

document.querySelector("#testiNext").addEventListener("click", function () {
  tampilkanTesti(indeksTesti + 1);
});

/* ===== 5. FORM KONTAK (Bootstrap): nama, email, select, textarea ===== */
const formKontak = document.querySelector("#formKontak");
const kNama = document.querySelector("#kNama");
const kEmail = document.querySelector("#kEmail");
const kSubjek = document.querySelector("#kSubjek");
const kPesan = document.querySelector("#kPesan");
const hasilKontak = document.querySelector("#hasilKontak");

formKontak.addEventListener("submit", function (e) {
  e.preventDefault(); // cegah halaman reload

  const okNama = kNama.value.trim().length >= 3;
  setStatus(kNama, okNama);

  // pola sederhana: teks + @ + teks + titik + teks
  const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const okEmail = polaEmail.test(kEmail.value.trim());
  setStatus(kEmail, okEmail);

  const okSubjek = kSubjek.value !== "";
  setStatus(kSubjek, okSubjek);

  const okPesan = kPesan.value.trim().length >= 10;
  setStatus(kPesan, okPesan);

  if (!(okNama && okEmail && okSubjek && okPesan)) {
    hasilKontak.textContent = "";
    formKontak.querySelector(".is-invalid").focus(); // fokus ke kolom salah pertama
    return;
  }

  const alertSukses = document.createElement("div");
  alertSukses.className = "alert alert-success";
  alertSukses.textContent =
    "Terima kasih, " + kNama.value.trim() + "! Pesan tentang \"" +
    kSubjek.value + "\" sudah kami terima. Kami akan membalas ke " +
    kEmail.value.trim() + ".";
  hasilKontak.replaceChildren(alertSukses);

  formKontak.reset();
  formKontak.querySelectorAll(".is-valid, .is-invalid").forEach(function (el) {
    el.classList.remove("is-valid", "is-invalid");
  });
});

/* ===== 6. FORM PEMESANAN (Bootstrap): radio, select, textarea ===== */
const formPesan = document.querySelector("#formPesan");
const pNama = document.querySelector("#pNama");
const pHp = document.querySelector("#pHp");
const pRoti = document.querySelector("#pRoti");
const pJumlah = document.querySelector("#pJumlah");
const pAlamat = document.querySelector("#pAlamat");
const radioMetode = document.querySelectorAll('input[name="metode"]');
const feedbackMetode = document.querySelector("#feedbackMetode");
const hasilPesan = document.querySelector("#hasilPesan");

// Beri tanda hijau (is-valid) atau merah (is-invalid) bawaan Bootstrap
function setStatus(elemen, valid) {
  elemen.classList.toggle("is-valid", valid);
  elemen.classList.toggle("is-invalid", !valid);
}

// Ambil radio yang sedang dipilih (null kalau belum ada)
function ambilMetode() {
  return document.querySelector('input[name="metode"]:checked');
}

// Textarea alamat hanya aktif kalau memilih "Diantar ke rumah"
function aturAlamat() {
  const metode = ambilMetode();
  const diantar = metode !== null && metode.value === "diantar";

  pAlamat.disabled = !diantar;
  pAlamat.placeholder = diantar
    ? "Tulis alamat lengkap: jalan, nomor, RT/RW, patokan"
    : "Alamat hanya diisi jika memilih diantar";

  if (!diantar) {
    pAlamat.value = "";
    pAlamat.classList.remove("is-valid", "is-invalid");
  }
}

radioMetode.forEach(function (radio) {
  radio.addEventListener("change", function () {
    feedbackMetode.classList.add("d-none");
    aturAlamat();
  });
});

formPesan.addEventListener("submit", function (e) {
  e.preventDefault(); // cegah halaman reload
  let semuaValid = true;

  // 1. Nama: minimal 3 karakter
  const okNama = pNama.value.trim().length >= 3;
  setStatus(pNama, okNama);

  // 2. HP: diawali 08, +628, atau 628, total 10-13 digit
  const hp = pHp.value.trim().replace(/[\s-]/g, "");
  const okHp = /^(\+62|62|0)8\d{8,11}$/.test(hp);
  setStatus(pHp, okHp);

  // 3. Select: harus memilih salah satu roti
  const okRoti = pRoti.value !== "";
  setStatus(pRoti, okRoti);

  // 4. Jumlah: bilangan bulat 1-20
  const jumlah = Number(pJumlah.value);
  const okJumlah = Number.isInteger(jumlah) && jumlah >= 1 && jumlah <= 20;
  setStatus(pJumlah, okJumlah);

  // 5. Radio: salah satu harus dipilih
  const metode = ambilMetode();
  const okMetode = metode !== null;
  feedbackMetode.classList.toggle("d-none", okMetode);

  // 6. Textarea: wajib diisi (min. 10 karakter) hanya kalau diantar
  let okAlamat = true;
  if (okMetode && metode.value === "diantar") {
    okAlamat = pAlamat.value.trim().length >= 10;
    setStatus(pAlamat, okAlamat);
  }

  semuaValid = okNama && okHp && okRoti && okJumlah && okMetode && okAlamat;

  if (!semuaValid) {
    hasilPesan.textContent = "";
    const pertama = formPesan.querySelector(".is-invalid");
    if (pertama) {
      pertama.focus();
    }
    return;
  }

  // Berhasil: tampilkan ringkasan pesanan (alert Bootstrap)
  const lokasi =
    metode.value === "diantar"
      ? "diantar ke " + pAlamat.value.trim()
      : "diambil di toko";

  const alertSukses = document.createElement("div");
  alertSukses.className = "alert alert-success";
  alertSukses.textContent =
    "Terima kasih, " + pNama.value.trim() + "! Pesanan " + jumlah + " x " +
    pRoti.value + " (" + lokasi + ") sudah kami terima.";
  hasilPesan.replaceChildren(alertSukses);

  // Hubungkan dengan keranjang di header
  jumlahKeranjang += jumlah;
  cartCount.textContent = jumlahKeranjang;
  tampilkanToast("Pesanan terkirim");

  formPesan.reset();
  formPesan
    .querySelectorAll(".is-valid, .is-invalid")
    .forEach(function (el) {
      el.classList.remove("is-valid", "is-invalid");
    });
  aturAlamat();
});