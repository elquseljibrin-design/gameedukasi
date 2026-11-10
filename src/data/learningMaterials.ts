export interface LearningTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  keyPoints: { label: string; desc: string; example?: string }[];
  pseudocodeExample?: string;
  tips: string;
}

export const LEARNING_MATERIALS: LearningTopic[] = [
  {
    id: 'ct-pillars',
    title: '4 Pilar Berpikir Komputasional (Computational Thinking)',
    category: 'Berpikir Komputasional',
    summary: 'Berpikir Komputasional adalah metode pemecahan masalah dengan menerapkan teknik yang digunakan oleh ilmuwan komputer dalam merancang program.',
    keyPoints: [
      {
        label: '1. Dekomposisi (Decomposition)',
        desc: 'Memecah masalah yang besar, kompleks, atau rumit menjadi bagian-bagian yang lebih kecil dan terpisah sehingga lebih mudah dipahami dan dikelola.',
        example: 'Membuat game: membagi menjadi tim grafik, tim fisika gravitasi, tim audio, dan tim penulisan soal.'
      },
      {
        label: '2. Pengenalan Pola (Pattern Recognition)',
        desc: 'Mencari kesamaan, keteraturan, atau tren dari masalah-masalah yang pernah diselesaikan sebelumnya untuk menemukan solusi efisien.',
        example: 'Melihat bahwa semua musuh bergerak bolak-balik dalam interval waktu yang sama.'
      },
      {
        label: '3. Abstraksi (Abstraction)',
        desc: 'Menyaring informasi dengan memusatkan perhatian pada hal-hal penting dan mengabaikan detail-detail yang tidak relevan dengan pemecahan masalah.',
        example: 'Peta rute kereta api hanya menampilkan urutan stasiun, tidak menggambar pohon atau gedung di tepi rel.'
      },
      {
        label: '4. Perancangan Algoritma (Algorithm Design)',
        desc: 'Menyusun sekumpulan langkah atau instruksi logis dan terurut untuk menyelesaikan persoalan secara berurutan dan dapat diulang.',
        example: 'Resep memasak, urutan menyikat gigi, atau langkah login akun dengan email dan password.'
      }
    ],
    tips: 'Ingat akronim D-P-A-A: Dekomposisi, Pola, Abstraksi, Algoritma!'
  },
  {
    id: 'data-processing',
    title: 'Pengolahan Data Sederhana Volume Kecil',
    category: 'Pengolahan Data',
    summary: 'Menerapkan komputasi dasar untuk mengolah kumpulan data (array/list) berupa angka atau teks berukuran kecil.',
    keyPoints: [
      {
        label: 'Maksimum (MAX) & Minimum (MIN)',
        desc: 'Mencari nilai tertinggi atau terendah dalam himpunan data dengan membandingkan elemen satu per satu.',
        example: 'Data nilai: [70, 85, 90, 60] -> Nilai Maksimum = 90, Nilai Minimum = 60.'
      },
      {
        label: 'Rata-rata (AVERAGE)',
        desc: 'Menghitung nilai rata-rata dengan menjumlahkan semua data kemudian membaginya dengan jumlah total elemen.',
        example: 'Rata-rata = (70 + 85 + 90 + 60) / 4 = 305 / 4 = 76.25.'
      },
      {
        label: 'Pengurutan (SORTING)',
        desc: 'Menyusun urutan elemen data dari terkecil ke terbesar (Ascending) atau dari terbesar ke terkecil (Descending).',
        example: 'Data [15, 3, 9] jika diurutkan Ascending menjadi [3, 9, 15].'
      },
      {
        label: 'Penyaringan (FILTERING)',
        desc: 'Memilih data tertentu yang memenuhi kriteria kondisi khusus.',
        example: 'Data nilai yang lulus KKM (>= 75).'
      }
    ],
    tips: 'Selalu pastikan memeriksa seluruh elemen sebelum menyimpulkan nilai maksimum atau minimum.'
  },
  {
    id: 'pseudocode-rules',
    title: 'Penulisan Instruksi dalam Format Pseudocode',
    category: 'Pseudocode & Pemrograman',
    summary: 'Pseudocode adalah cara penulisan algoritma yang menyerupai bahasa pemrograman formal namun menggunakan kosakata bahasa manusia sederhana agar mudah dipahami sebelum diketik ke kode komputer.',
    keyPoints: [
      {
        label: 'Kosakata Terbatas Baku',
        desc: 'Pseudocode menggunakan kata-kata kunci standar seperti: MULAI / SELESAI (START/END), INPUT / BACA, OUTPUT / TULIS / CETAK, IF ... THEN ... ELSE ... ENDIF, dan WHILE / FOR.',
        example: 'MULAI -> INPUT nama -> OUTPUT "Halo " + nama -> SELESAI'
      },
      {
        label: 'Struktur Percabangan (Kondisional)',
        desc: 'Digunakan untuk memilih tindakan berdasarkan apakah suatu kondisi bernilai BENAR (TRUE) atau SALAH (FALSE).',
        example: 'IF nilai >= 75 THEN OUTPUT "LULUS" ELSE OUTPUT "REMIDIAL" ENDIF'
      },
      {
        label: 'Struktur Perulangan (Looping)',
        desc: 'Menjalankan serangkaian instruksi yang sama berulang kali selama kondisi tertentu masih terpenuhi.',
        example: 'WHILE koin > 0 DO: koin = koin - 1; ENDWHILE'
      }
    ],
    pseudocodeExample: `// Contoh Algoritma Penentuan Nilai Rapor
MULAI
   INPUT nilai_tugas
   INPUT nilai_ujian
   nilai_akhir = (nilai_tugas * 0.4) + (nilai_ujian * 0.6)
   
   IF nilai_akhir >= 75 THEN
      keterangan = "LULUS"
   ELSE
      keterangan = "BELUM TUNTAS"
   ENDIF
   
   OUTPUT "Nilai Akhir: " + nilai_akhir
   OUTPUT "Status: " + keterangan
SELESAI`,
    tips: 'Gunakan indentasi (spasi ke dalam) pada blok di dalam IF atau WHILE agar alur logika terlihat rapi dan jelas!'
  },
  {
    id: 'debugging-guide',
    title: 'Menemukan dan Memperbaiki Kesalahan (Debugging)',
    category: 'Debugging & Perbaikan Bug',
    summary: 'Debugging adalah proses mendeteksi, mengisolasi, dan memperbaiki galat (bug) dalam instruksi algoritma agar program berjalan sesuai harapan.',
    keyPoints: [
      {
        label: 'Kesalahan Sintaks (Syntax Error)',
        desc: 'Kesalahan penulisan aturan kosakata (misalnya lupa menutup tanda kurung, lupa kata THEN setelah IF, atau salah ketik kata kunci).',
        example: 'IF nilai > 70 (lupa kata THEN)'
      },
      {
        label: 'Kesalahan Logika (Logical Bug)',
        desc: 'Instruksi dapat berjalan lancar namun menghasilkan output yang salah karena urutan langkah atau rumus yang keliru.',
        example: 'Menghitung keliling persegi panjang dengan rumus (panjang * lebar) padahal seharusnya 2 * (panjang + lebar).'
      },
      {
        label: 'Perulangan Tak Hingga (Infinite Loop)',
        desc: 'Kondisi perulangan yang tidak pernah bernilai salah karena variabel penghitung (counter) tidak pernah diubah nilainya di dalam loop.',
        example: 'WHILE i <= 5 (tanpa instruksi i = i + 1 di dalam blok)'
      }
    ],
    tips: 'Gunakan teknik Tracing (menelusuri nilai variabel baris demi baris menggunakan tabel) saat mencari letak bug logika!'
  }
];
