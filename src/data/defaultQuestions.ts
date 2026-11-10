import { Question } from '../types/game';

export const INITIAL_QUESTIONS: Question[] = [
  // ==========================================
  // WORLD 1: THE FOREST OF DATA (HUTAN DATA)
  // Tema: Pengenalan data, himpunan data kecil, dekomposisi data, pengenalan pola
  // ==========================================
  {
    id: 'w1-q1',
    worldId: 1,
    difficulty: 'easy',
    type: 'multiple_choice',
    competency: 'Pengolahan Data Sederhana',
    question: 'Dalam sebuah kelas terdapat 5 siswa dengan perolehan nilai Informatika: 70, 80, 90, 80, 100. Berapakah nilai tertinggi dalam kumpulan data tersebut?',
    options: ['70', '80', '90', '100'],
    correctAnswer: '100',
    explanation: 'Dalam himpunan data {70, 80, 90, 80, 100}, nilai maksimum (tertinggi) adalah 100.'
  },
  {
    id: 'w1-q2',
    worldId: 1,
    difficulty: 'easy',
    type: 'true_false',
    competency: 'Pengolahan Data Sederhana',
    question: 'Pernyataan: "Kumpulan data suhu harian: [28, 29, 31, 30, 27] memiliki jumlah data (volume data) sebanyak 5 elemen."',
    options: ['BENAR', 'SALAH'],
    correctAnswer: 'BENAR',
    explanation: 'Benar, ada 5 data suhu harian yang tercatat dalam himpunan tersebut.'
  },
  {
    id: 'w1-q3',
    worldId: 1,
    difficulty: 'easy',
    type: 'multiple_choice',
    competency: 'Pengenalan Pola',
    question: 'Perhatikan deret bilangan data berikut: 3, 6, 12, 24, ... Berapakah angka berikutnya berdasarkan pola yang terbentuk?',
    options: ['36', '48', '30', '52'],
    correctAnswer: '48',
    explanation: 'Pola yang terbentuk adalah setiap bilangan dikalikan dengan 2 (3*2=6, 6*2=12, 12*2=24, 24*2=48).'
  },
  {
    id: 'w1-q4',
    worldId: 1,
    difficulty: 'medium',
    type: 'drag_drop',
    competency: 'Pengolahan Data Sederhana',
    question: 'Pasangkan istilah operasi pengolahan data sederhana berikut dengan fungsi yang paling tepat!',
    matchingPairs: [
      { id: 'p1', left: 'Maksimum (MAX)', right: 'Menemukan nilai terbesar dalam kumpulan data' },
      { id: 'p2', left: 'Minimum (MIN)', right: 'Menemukan nilai terkecil dalam kumpulan data' },
      { id: 'p3', left: 'Rata-rata (AVERAGE)', right: 'Jumlah total data dibagi dengan banyaknya data' },
      { id: 'p4', left: 'Pengurutan (SORT)', right: 'Menyusun data dari terkecil ke terbesar atau sebaliknya' }
    ],
    correctAnswer: 'MATCHED_ALL',
    explanation: 'Operasi dasar data meliputi pencarian nilai ekstrem (MIN/MAX), pemusatan nilai (AVERAGE), dan penataan urutan (SORTING).'
  },
  {
    id: 'w1-q5',
    worldId: 1,
    difficulty: 'medium',
    type: 'problem_solving',
    competency: 'Dekomposisi Masalah',
    question: 'Toko Koperasi Sekolah mencatat penjualan buku tulis selama 4 hari: Senin: 15, Selasa: 20, Rabu: 10, Kamis: 25. Berapakah rata-rata penjualan buku tulis per hari?',
    options: ['15 buku', '17.5 buku', '20 buku', '22.5 buku'],
    correctAnswer: '17.5 buku',
    explanation: 'Rata-rata = (15 + 20 + 10 + 25) / 4 = 70 / 4 = 17,5 buku per hari.'
  },

  // ==========================================
  // WORLD 2: THE LOGIC MOUNTAIN (PEGUNUNGAN LOGIKA)
  // Tema: 4 Pilar Berpikir Komputasional, Abstraksi, Kondisi Logika
  // ==========================================
  {
    id: 'w2-q1',
    worldId: 2,
    difficulty: 'easy',
    type: 'multiple_choice',
    competency: 'Dekomposisi Masalah',
    question: 'Apa yang dimaksud dengan konsep Dekomposisi dalam berpikir komputasional?',
    options: [
      'Menggabungkan seluruh persoalan menjadi satu instruksi panjang',
      'Memecah masalah yang kompleks menjadi bagian-bagian yang lebih kecil dan mudah dikelola',
      'Menghilangkan seluruh informasi yang ada tanpa analisa',
      'Menulis kode komputer tanpa rencana dan diagram'
    ],
    correctAnswer: 'Memecah masalah yang kompleks menjadi bagian-bagian yang lebih kecil dan mudah dikelola',
    explanation: 'Dekomposisi adalah teknik memecah masalah besar/rumit menjadi sub-masalah kecil agar lebih mudah diselesaikan secara sistematis.'
  },
  {
    id: 'w2-q2',
    worldId: 2,
    difficulty: 'easy',
    type: 'multiple_choice',
    competency: 'Abstraksi',
    question: 'Saat membuat aplikasi denah rute bus sekolah, informasi nomor plat mobil tetangga diabaikan karena tidak penting. Tindakan menyaring informasi ini disebut...',
    options: ['Abstraksi', 'Dekomposisi', 'Pengenalan Pola', 'Pseudocode'],
    correctAnswer: 'Abstraksi',
    explanation: 'Abstraksi adalah proses menyaring dan memfokuskan perhatian pada hal-hal penting serta mengabaikan detail yang tidak relevan dengan masalah.'
  },
  {
    id: 'w2-q3',
    worldId: 2,
    difficulty: 'medium',
    type: 'drag_drop',
    competency: 'Dekomposisi Masalah',
    question: 'Pasangkan 4 Pilar Berpikir Komputasional dengan contoh penerapannya dalam kehidupan sehari-hari!',
    matchingPairs: [
      { id: 'c1', left: 'Dekomposisi', right: 'Membagi tugas membuat mading kelas menjadi menulis artikel, menggambar, dan layout' },
      { id: 'c2', left: 'Pengenalan Pola', right: 'Melihat bahwa lampu lalu lintas selalu berganti Merah-Kuning-Hijau secara teratur' },
      { id: 'c3', left: 'Abstraksi', right: 'Membaca peta jalur MRT yang hanya menampilkan stasiun tanpa bangunan jalan raya' },
      { id: 'c4', left: 'Algoritma', right: 'Menuliskan resep urutan langkah memasak mie instan dari merebus air hingga disajikan' }
    ],
    correctAnswer: 'MATCHED_ALL',
    explanation: '4 Pilar Berpikir Komputasional adalah Dekomposisi, Pengenalan Pola, Abstraksi, dan Perancangan Algoritma.'
  },
  {
    id: 'w2-q4',
    worldId: 2,
    difficulty: 'medium',
    type: 'multiple_choice',
    competency: 'Algoritma & Runtutan',
    question: 'Perhatikan kondisi logika berikut: IF (umur >= 12 AND tinggi >= 140) THEN Boleh_Naik_Rollercoaster. Siswa A berumur 13 tahun dengan tinggi 135 cm. Apakah Siswa A boleh naik wahana?',
    options: [
      'Boleh, karena usianya sudah lebih dari 12 tahun',
      'Tidak boleh, karena operator logika AND mensyaratkan kedua kondisi terpenuhi',
      'Boleh bersyarat dengan membeli tiket khusus',
      'Tidak dapat ditentukan'
    ],
    correctAnswer: 'Tidak boleh, karena operator logika AND mensyaratkan kedua kondisi terpenuhi',
    explanation: 'Operator AND bernilai TRUE hanya jika SEMUA syarat bernilai benar. Walau usia memenuhi (13 >= 12), tingginya kurang (135 < 140), sehingga hasilnya FALSE.'
  },
  {
    id: 'w2-q5',
    worldId: 2,
    difficulty: 'hard',
    type: 'true_false',
    competency: 'Pengenalan Pola',
    question: 'Pernyataan: "Mengenali pola kesalahan dalam penulisan rumus perhitungan nilai rapor memudahkan kita untuk memperbaikinya secara otomatis pada seluruh baris data siswa."',
    options: ['BENAR', 'SALAH'],
    correctAnswer: 'BENAR',
    explanation: 'Benar, dengan mengenali pola error, kita bisa menerapkan solusi umum ke seluruh dataset tanpa harus memperbaikinya satu per satu secara manual.'
  },

  // ==========================================
  // WORLD 3: THE ALGORITHM BRIDGE (JEMBATAN ALGORITMA)
  // Tema: Urutan instruksi (sequence), flowchart, logika tahapan, branching
  // ==========================================
  {
    id: 'w3-q1',
    worldId: 3,
    difficulty: 'easy',
    type: 'sequence_ordering',
    competency: 'Algoritma & Runtutan',
    question: 'Susunlah langkah-langkah algoritma sederhana untuk "Menghitung Luas Persegi Panjang" dalam urutan yang tepat!',
    sequenceItems: [
      { id: 's1', text: 'MULAI' },
      { id: 's2', text: 'INPUT panjang dan lebar' },
      { id: 's3', text: 'HITUNG luas = panjang * lebar' },
      { id: 's4', text: 'OUTPUT luas' },
      { id: 's5', text: 'SELESAI' }
    ],
    correctAnswer: ['s1', 's2', 's3', 's4', 's5'],
    explanation: 'Algoritma runtut selalu dimulai dengan inisialisasi (MULAI), masukan data (INPUT), pemrosesan rumus (HITUNG), penyajian hasil (OUTPUT), lalu diakhiri (SELESAI).'
  },
  {
    id: 'w3-q2',
    worldId: 3,
    difficulty: 'medium',
    type: 'multiple_choice',
    competency: 'Algoritma & Runtutan',
    question: 'Manakah di bawah ini yang merupakan ciri utama dari sebuah algoritma yang baik?',
    options: [
      'Memiliki langkah tak berhingga dan tidak pernah berhenti',
      'Setiap instruksi jelas, tidak ambigu, dan memiliki titik henti yang pasti (finite)',
      'Hanya boleh ditulis dalam bahasa mesin biner',
      'Harus sangat panjang dan sulit dimengerti'
    ],
    correctAnswer: 'Setiap instruksi jelas, tidak ambigu, dan memiliki titik henti yang pasti (finite)',
    explanation: 'Syarat algoritma yang baik: memiliki kejelasan langkah (definiteness), batas penyelesaian (finiteness), masukan/keluaran yang terdefinisi, dan efektivitas.'
  },
  {
    id: 'w3-q3',
    worldId: 3,
    difficulty: 'medium',
    type: 'sequence_ordering',
    competency: 'Algoritma & Runtutan',
    question: 'Susun urutan instruksi pengecekan kelulusan siswa berdasarkan nilai KKM 75!',
    sequenceItems: [
      { id: 'k1', text: 'MULAI' },
      { id: 'k2', text: 'INPUT nilai_ujian' },
      { id: 'k3', text: 'IF nilai_ujian >= 75 THEN OUTPUT "LULUS"' },
      { id: 'k4', text: 'ELSE OUTPUT "REMIDIAL"' },
      { id: 'k5', text: 'ENDIF dan SELESAI' }
    ],
    correctAnswer: ['k1', 'k2', 'k3', 'k4', 'k5'],
    explanation: 'Urutan instruksi percabangan: Start -> Terima Input -> Uji Kondisi -> Alternatif Else -> Selesai.'
  },
  {
    id: 'w3-q4',
    worldId: 3,
    difficulty: 'hard',
    type: 'problem_solving',
    competency: 'Algoritma & Runtutan',
    question: 'Diberikan algoritma perulangan: Nilai x = 1. WHILE x <= 4 DO: CETAK x; x = x + 1; ENDWHILE. Berapakah urutan angka yang dicetak?',
    options: ['1, 2, 3', '1, 2, 3, 4', '2, 3, 4, 5', '1, 2, 3, 4, 5'],
    correctAnswer: '1, 2, 3, 4',
    explanation: 'Loop berjalan saat x=1, x=2, x=3, x=4 (semua <= 4 dicetak). Ketika x=5, kondisi false dan loop berhenti.'
  },

  // ==========================================
  // WORLD 4: THE PSEUDOCODE CASTLE (KASTIL PSEUDOCODE)
  // Tema: Membaca, melengkapi, dan memperbaiki pseudocode dengan kosakata terbatas
  // ==========================================
  {
    id: 'w4-q1',
    worldId: 4,
    difficulty: 'easy',
    type: 'multiple_choice',
    competency: 'Membaca Pseudocode',
    codeSnippet: `MULAI
INPUT nilai
IF nilai >= 75 THEN
   OUTPUT "LULUS"
ELSE
   OUTPUT "TIDAK LULUS"
ENDIF
SELESAI`,
    question: 'Perhatikan pseudocode di atas! Apa yang akan ditampilkan jika pengguna memasukkan nilai = 80?',
    options: ['TIDAK LULUS', 'LULUS', 'ERROR', 'NILAI KOSONG'],
    correctAnswer: 'LULUS',
    explanation: 'Karena 80 >= 75 bernilai Benar (True), maka blok THEN dieksekusi dan program menampilkan "LULUS".'
  },
  {
    id: 'w4-q2',
    worldId: 4,
    difficulty: 'medium',
    type: 'fill_pseudocode',
    competency: 'Membaca Pseudocode',
    question: 'Lengkapi kata kunci yang hilang pada pseudocode penentuan bilangan genap / ganjil berikut!',
    fillBlanks: {
      template: `MULAI
INPUT bilangan
{b1} (bilangan MOD 2 == 0) {b2}
   OUTPUT "Bilangan Genap"
{b3}
   OUTPUT "Bilangan Ganjil"
ENDIF
SELESAI`,
      blanks: [
        { id: 'b1', correct: 'IF', options: ['IF', 'FOR', 'WHILE'] },
        { id: 'b2', correct: 'THEN', options: ['THEN', 'DO', 'ELSE'] },
        { id: 'b3', correct: 'ELSE', options: ['ELSE', 'LOOP', 'UNTIL'] }
      ]
    },
    correctAnswer: 'COMPLETED',
    explanation: 'Struktur baku percabangan pada pseudocode adalah IF (kondisi) THEN ... ELSE ... ENDIF.'
  },
  {
    id: 'w4-q3',
    worldId: 4,
    difficulty: 'medium',
    type: 'find_bug',
    competency: 'Menemukan & Memperbaiki Bug',
    codeSnippet: `1: MULAI
2: INPUT total_belanja
3: IF total_belanja >= 100000 THEN
4:    diskon = total_belanja * 0.1
5: // Bug ada di baris 6!
6: ELSE IF total_belanja < 0 THEN diskon = "GRATIS"
7: total_bayar = total_belanja - diskon
8: OUTPUT total_bayar
9: SELESAI`,
    question: 'Perhatikan pseudocode penghitung diskon di atas! Mengapa baris ke-6 bermasalah dan menyebabkan bug?',
    options: [
      'Karena nilai diskon tidak boleh diisi tipe teks "GRATIS" saat akan dikurangkan pada operasi matematika di baris 7',
      'Karena kata kunci MULAI tidak boleh diletakkan di baris 1',
      'Karena total_belanja tidak boleh di-input oleh user',
      'Karena angka 0.1 harus diubah menjadi 100'
    ],
    correctAnswer: 'Karena nilai diskon tidak boleh diisi tipe teks "GRATIS" saat akan dikurangkan pada operasi matematika di baris 7',
    explanation: 'Tipe data teks "GRATIS" tidak bisa dikurangkan secara aritmatika (baris 7: total_belanja - diskon). Ini adalah Type Error dalam instruksi komputasi.'
  },
  {
    id: 'w4-q4',
    worldId: 4,
    difficulty: 'hard',
    type: 'multiple_choice',
    competency: 'Membaca Pseudocode',
    codeSnippet: `MULAI
total = 0
FOR i = 1 TO 3 DO
   total = total + i
ENDFOR
OUTPUT total
SELESAI`,
    question: 'Berapakah nilai total akhir yang dicetak pada pseudocode perulangan di atas?',
    options: ['3', '5', '6', '10'],
    correctAnswer: '6',
    explanation: 'Pada loop: i=1 -> total=0+1=1; i=2 -> total=1+2=3; i=3 -> total=3+3=6. Output akhir = 6.'
  },

  // ==========================================
  // WORLD 5: THE FINAL BOSS CHALLENGE (ISTANA RAJA BUG)
  // Tema: Analisis menyeluruh, perbaikan bug kritis, dekomposisi logika tingkat lanjut
  // ==========================================
  {
    id: 'w5-q1',
    worldId: 5,
    difficulty: 'hard',
    type: 'find_bug',
    competency: 'Menemukan & Memperbaiki Bug',
    codeSnippet: `1: MULAI
2: counter = 1
3: WHILE counter <= 5 DO
4:    OUTPUT "Halo Siswa Informatika"
5:    // Perhatikan baris ini!
6: ENDWHILE
7: SELESAI`,
    question: 'Boss Bug telah mengacaukan program! Perulangan di atas mengalami Infinite Loop (tidak pernah berhenti). Baris apakah yang hilang di dalam blok WHILE?',
    options: [
      'Instruksi penambahan: counter = counter + 1',
      'Instruksi INPUT counter dari keyboard',
      'Instruksi SELESAI di baris 5',
      'Instruksi perkalian counter = counter * 0'
    ],
    correctAnswer: 'Instruksi penambahan: counter = counter + 1',
    explanation: 'Tanpa instruksi penambahan nilai peubah (counter = counter + 1), nilai counter akan selamanya bernilai 1 (selalu <= 5), menyebabkan Infinite Loop.'
  },
  {
    id: 'w5-q2',
    worldId: 5,
    difficulty: 'hard',
    type: 'multiple_choice',
    competency: 'Algoritma & Runtutan',
    question: 'Dua buah ember A dan B berisi cairan warna Merah (A) dan Biru (B). Bagaimana algoritma pertukaran isi kedua ember tanpa mencampurkannya?',
    options: [
      'Gunakan ember bantuan C: Tuang isi A ke C -> Tuang B ke A -> Tuang C ke B',
      'Tuang langsung isi ember A ke ember B, lalu tuang kembali',
      'Biarkan kedua ember menguap',
      'Balikkan kedua ember secara bersamaan ke udara'
    ],
    correctAnswer: 'Gunakan ember bantuan C: Tuang isi A ke C -> Tuang B ke A -> Tuang C ke B',
    explanation: 'Ini adalah analogi variabel penampung sementara (swap algorithm using temp variable: temp = A; A = B; B = temp).'
  },
  {
    id: 'w5-q3',
    worldId: 5,
    difficulty: 'hard',
    type: 'problem_solving',
    competency: 'Pengolahan Data Sederhana',
    question: 'Diberikan daftar nilai: [65, 85, 75, 90, 60]. Jika kriteria kelulusan (KKM) adalah 75, berapakah persentase ketuntasan siswa yang lulus?',
    options: ['40%', '60%', '80%', '100%'],
    correctAnswer: '60%',
    explanation: 'Siswa yang nilainya >= 75 adalah [85, 75, 90] (sebanyak 3 siswa dari total 5). Persentase = (3 / 5) * 100% = 60%.'
  },
  {
    id: 'w5-q4',
    worldId: 5,
    difficulty: 'hard',
    type: 'multiple_choice',
    competency: 'Menemukan & Memperbaiki Bug',
    codeSnippet: `MULAI
INPUT a, b
IF b == 0 THEN
   OUTPUT "Pembagian dengan nol tidak diperbolehkan"
ELSE
   hasil = a / b
   OUTPUT hasil
ENDIF
SELESAI`,
    question: 'Pengecekan kondisi "IF b == 0" pada pseudocode di atas merupakan tindakan pencegahan bug jenis apa?',
    options: [
      'Division by Zero (Runtime Crash Error)',
      'Syntax Error karena tanda petik ganda',
      'Hardware Failure komputer',
      'Typo nama variabel'
    ],
    correctAnswer: 'Division by Zero (Runtime Crash Error)',
    explanation: 'Dalam matematika dan komputasi, pembagian dengan angka nol tidak terdefinisi dan menyebabkan program berhenti mendadak (Runtime Error/Crash).'
  }
];
