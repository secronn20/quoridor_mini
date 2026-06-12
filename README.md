# Quoridor Mini AI (Glassmorphic Cyberpunk Edition)

Sebuah implementasi game papan strategis **Quoridor Mini** (skala grid 5x5) yang mempertemukan Player manusia melawan Agen AI cerdas. Proyek ini mendemonstrasikan perbandingan performa antara algoritma pencarian keputusan **Minimax** dan optimalisasinya, **Alpha-Beta Pruning**, lengkap dengan dasbor telemetri real-time yang futuristik.

---

## 📖 Deskripsi Proyek

**Quoridor Mini AI** adalah versi minimalis dari game papan populer Quoridor. Dimainkan pada area grid 5x5, game ini menuntut pemikiran strategis yang matang di mana setiap langkah atau pemasangan dinding pembatas sangat krusial.

Tujuan utama dari proyek ini adalah menyediakan media pembelajaran interaktif untuk mata kuliah **Kecerdasan Buatan (Artificial Intelligence)**. Proyek ini memvisualisasikan bagaimana AI mencari langkah terbaik melalui pohon keputusan (*Game Tree*), seberapa banyak alternatif yang dievaluasi (*Nodes Evaluated*), seberapa banyak cabang yang berhasil dilewati (*Pruned Nodes*), serta waktu komputasi yang dihabiskan dalam satuan milidetik (ms).

---

## ⚡ Fitur Utama

1. **Dashboard UI Premium (Glassmorphism & Cyberpunk)**:
   Antarmuka pengguna bertema gelap modern dengan efek kaca buram (*glassmorphic card*), berpendar neon HSL, tipografi elegan dari Google Fonts (Space Grotesk & Fira Code), serta latar belakang berbintang yang dinamis.
   
2. **AI Telemetry Panel**:
   Menampilkan metrik performa komputasi AI secara instan pada setiap langkah:
   - **Node Dievaluasi**: Jumlah kondisi papan yang dianalisis oleh AI.
   - **Node Dipangkas**: Jumlah langkah tak berguna yang berhasil dieliminasi (pada mode Alpha-Beta).
   - **Waktu Komputasi**: Durasi pencarian dalam milidetik (ms) menggunakan presisi tinggi `performance.now()`.

3. **Visualisasi Game Tree Interaktif**:
   Menampilkan potongan pohon pencarian keputusan AI di panel kanan dengan pewarnaan neon (*syntax-highlighted*). Node AI diwarnai merah, langkah Player diwarnai sian, dan cabang yang terpotong ditandai merah tegas dengan ikon gunting (`PRUNED ✂`).

4. **Konfigurasi AI Dinamis**:
   - **Depth Selector**: Mengubah kedalaman pencarian AI (Depth 1 sampai 4) secara real-time untuk mengatur tingkat kesulitan.
   - **Alpha-Beta Toggle**: Tombol switch untuk mengaktifkan/menonaktifkan pemangkasan Alpha-Beta guna membandingkan efisiensi jumlah evaluasi node.

5. **Inventaris Dinding Visual (Wall Inventory)**:
   Menampilkan indikator baris berpendar sian (untuk Player) dan merah (untuk AI) yang melacak sisa dinding (maksimal 5 dinding) secara visual.

6. **Desain Grid Papan Presisi**:
   Papan grid 5x5 responsif dengan animasi transisi yang mulus. Pion dirender menggunakan elemen HTML kustom berpendar (bukan emoji teks), dilengkapi dengan sorotan langkah legal (*valid moves highlight*) dan penunjuk zona gol.

---

## 🎮 Aturan Bermain & Cara Main

### Aturan Dasar
- **Pion Player (Sian)** dimulai di koordinat baris terbawah tengah `(4, 2)`.
- **Pion AI (Merah)** dimulai di koordinat baris teratas tengah `(0, 2)`.
- **Tujuan Player** adalah mencapai baris paling atas (Baris 0 / Gawang AI).
- **Tujuan AI** adalah mencapai baris paling bawah (Baris 4 / Gawang Player).

### Giliran Bermain (Turns)
Setiap pemain pada gilirannya dapat memilih **satu** dari dua aksi berikut:
1. **Melangkah (Move)**:
   Menggeser pion sebanyak 1 kotak ke sel tetangga yang bersebelahan (atas, bawah, kiri, kanan). Langkah tidak boleh melewati dinding pembatas atau menempati sel yang sama dengan pion lawan. Langkah legal akan disorot dengan garis sian putus-putus berpendar.
2. **Pasang Dinding (Place Wall)**:
   Membatasi pergerakan lawan dengan memblokir satu sel penuh secara permanen. Klik tombol **"Pasang Wall"** (tombol akan menyala jingga), lalu klik sel yang ingin diubah menjadi dinding. Setiap dinding yang dipasang akan memakan 1 kuota dinding di inventaris.

---

## 🔬 Detail Algoritma AI

AI dalam game ini diprogram menggunakan pendekatan Teori Permainan (*Game Theory*):

### 1. Minimax
Algoritma rekursif untuk mencari langkah optimal dengan memaksimalkan keuntungan AI (*maximizing player*) sambil mengasumsikan Player manusia akan selalu memilih langkah yang meminimalkan keuntungan AI tersebut (*minimizing player*).

### 2. Alpha-Beta Pruning
Optimalisasi algoritma Minimax untuk memangkas cabang-cabang pohon keputusan yang tidak perlu dievaluasi lebih lanjut. Cabang dipangkas ketika nilai pencarian saat ini sudah dipastikan lebih buruk daripada alternatif yang telah ditemukan sebelumnya. Ini sangat memangkas jumlah node yang perlu dihitung secara eksponensial (membuktikan hukum efisiensi komputasi AI).

### 3. Fungsi Evaluasi Heuristik
Heuristik yang digunakan sangat sederhana namun efektif untuk papan mini:
$$\text{Skor Evaluasi} = \text{Jarak Vertikal Player ke Gawang} - \text{Jarak Vertikal AI ke Gawang}$$
- Skor **positif** menandakan kondisi papan menguntungkan bagi AI (AI lebih dekat ke gawang daripada Player).
- Skor **negatif** menandakan kondisi papan menguntungkan bagi Player.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun murni menggunakan teknologi web standar tanpa library eksternal (Vanilla Web Tech Stack):
- **HTML5**: Struktur semantik elemen dasbor dan papan game.
- **CSS3**: Sistem grid responsif, Glassmorphism, kustom variabel CSS, animasi mikro, dan skema warna neon HSL.
- **Javascript (ES6+)**: Logika game, implementasi pencarian pohon Minimax & Alpha-Beta Pruning, deteksi kemenangan, serta rendering DOM dinamis.

---

## 🚀 Cara Menjalankan

Karena proyek ini tidak memiliki dependensi eksternal, Anda tidak memerlukan server khusus atau proses build.
1. Download atau klon direktori proyek ini.
2. Klik ganda file [index.html](file:///d:/data%20dan%20tugas/kecerdasan_buatan/quoridor-mini/index.html) untuk membukanya secara langsung di peramban web (Google Chrome, Firefox, MS Edge, Safari, dll.).
3. Nikmati permainan!
# quoridor_mini
