import { WorldConfig } from '../types/game';

export const WORLDS_DATA: WorldConfig[] = [
  {
    id: 1,
    title: 'WORLD 1 – THE FOREST OF DATA',
    themeName: 'Hutan Data',
    description: 'Jelajahi hutan pepohonan biner, kumpulkan kristal bit, dan pelajari pengelompokan himpunan data sederhana serta pengenalan pola.',
    bannerImage: '/src/assets/images/world_forest_data_1794321814082.jpg',
    competencies: ['Pengolahan Data Sederhana', 'Pengenalan Pola', 'Dekomposisi Data'],
    levels: [
      {
        id: '1-1',
        worldId: 1,
        levelNumber: 1,
        title: 'Level 1-1: Himpunan Data Pertama',
        subtitle: 'Mengenal elemen dan volume data',
        objective: 'Kumpulkan minimal 5 koin dan masuki Portal Soal untuk menguji pemahaman kumpulan data.',
        theme: 'forest',
        length: 2200,
        questionIds: ['w1-q1', 'w1-q2']
      },
      {
        id: '1-2',
        worldId: 1,
        levelNumber: 2,
        title: 'Level 1-2: Lembah Pola Bilangan',
        subtitle: 'Mengidentifikasi keteraturan pola',
        objective: 'Lompati rintangan floating platform dan pecahkan teka-teki pola data.',
        theme: 'forest',
        length: 2600,
        questionIds: ['w1-q3', 'w1-q4']
      },
      {
        id: '1-3',
        worldId: 1,
        levelNumber: 3,
        title: 'Level 1-3: Penjaga Pohon Biner',
        subtitle: 'Analisis kumpulan data sederhana',
        objective: 'Capai menara pohon biner tertinggi dan selesaikan tantangan dunia pertama!',
        theme: 'forest',
        length: 3000,
        questionIds: ['w1-q5', 'w1-q1']
      }
    ]
  },
  {
    id: 2,
    title: 'WORLD 2 – THE LOGIC MOUNTAIN',
    themeName: 'Pegunungan Logika',
    description: 'Mendaki lereng tebing computational thinking, memilah informasi penting lewat abstraksi, dan menguji logika percabangan IF-ELSE.',
    bannerImage: '/src/assets/images/world_forest_data_1794321814082.jpg',
    competencies: ['Dekomposisi Masalah', 'Abstraksi', 'Logika Kondisional'],
    levels: [
      {
        id: '2-1',
        worldId: 2,
        levelNumber: 1,
        title: 'Level 2-1: Tebing Dekomposisi',
        subtitle: 'Memecah masalah menjadi bagian kecil',
        objective: 'Pilah rintangan satu per satu dan temukan portal pertanyaan dekomposisi.',
        theme: 'mountain',
        length: 2500,
        questionIds: ['w2-q1', 'w2-q2']
      },
      {
        id: '2-2',
        worldId: 2,
        levelNumber: 2,
        title: 'Level 2-2: Jurang Abstraksi',
        subtitle: 'Menyaring informasi esensial',
        objective: 'Abaikan detail pengecoh, fokus pada lintasan utama dan selesaikan tantangan logika.',
        theme: 'mountain',
        length: 2800,
        questionIds: ['w2-q3', 'w2-q4']
      },
      {
        id: '2-3',
        worldId: 2,
        levelNumber: 3,
        title: 'Level 2-3: Puncak Kondisional',
        subtitle: 'Mengevaluasi kondisi TRUE & FALSE',
        objective: 'Taklukkan platform angin gunung dan buktikan ketajaman logika kondisimu!',
        theme: 'mountain',
        length: 3200,
        questionIds: ['w2-q4', 'w2-q5']
      }
    ]
  },
  {
    id: 3,
    title: 'WORLD 3 – THE ALGORITHM BRIDGE',
    themeName: 'Jembatan Algoritma',
    description: 'Melintasi jembatan instruksi terstruktur, menyusun urutan langkah penyelesaian masalah (sequence) dan memahami perulangan.',
    bannerImage: '/src/assets/images/super_edu_cover_1794321813886.jpg',
    competencies: ['Algoritma & Runtutan', 'Urutan Instruksi', 'Perancangan Solusi'],
    levels: [
      {
        id: '3-1',
        worldId: 3,
        levelNumber: 1,
        title: 'Level 3-1: Jembatan Runtunan (Sequence)',
        subtitle: 'Instruksi langkah demi langkah',
        objective: 'Susun instruksi algoritma dalam urutan logis dari awal hingga selesai.',
        theme: 'bridge',
        length: 2600,
        questionIds: ['w3-q1', 'w3-q2']
      },
      {
        id: '3-2',
        worldId: 3,
        levelNumber: 2,
        title: 'Level 3-2: Lintasan Percabangan',
        subtitle: 'Memilih rute algoritma yang benar',
        objective: 'Pilih jalur platform yang tepat dan jawab pertanyaan algoritma percabangan.',
        theme: 'bridge',
        length: 2900,
        questionIds: ['w3-q3', 'w3-q2']
      },
      {
        id: '3-3',
        worldId: 3,
        levelNumber: 3,
        title: 'Level 3-3: Menara Perulangan (Loop)',
        subtitle: 'Efisiensi langkah berulang',
        objective: 'Hindari jebakan berulang dan selesaikan tantangan algoritma loop!',
        theme: 'bridge',
        length: 3300,
        questionIds: ['w3-q4', 'w3-q1']
      }
    ]
  },
  {
    id: 4,
    title: 'WORLD 4 – THE PSEUDOCODE CASTLE',
    themeName: 'Kastil Pseudocode',
    description: 'Masuki benteng instruksi formal, pelajari membaca notasi pseudocode dengan kosakata terbatas, lengkapi sintaks, dan deteksi error.',
    bannerImage: '/src/assets/images/world_castle_boss_1794321814086.jpg',
    competencies: ['Membaca Pseudocode', 'Melengkapi Instruksi', 'Deteksi Kesalahan Logika'],
    levels: [
      {
        id: '4-1',
        worldId: 4,
        levelNumber: 1,
        title: 'Level 4-1: Gerbang Kosakata Terbatas',
        subtitle: 'Struktur MULAI, INPUT, IF, OUTPUT, SELESAI',
        objective: 'Jawab pertanyaan interpretasi pseudocode dengan benar untuk membuka gerbang dalam kastil.',
        theme: 'castle',
        length: 2700,
        questionIds: ['w4-q1', 'w4-q2']
      },
      {
        id: '4-2',
        worldId: 4,
        levelNumber: 2,
        title: 'Level 4-2: Lorong Melengkapi Pseudocode',
        subtitle: 'Mengisi instruksi yang hilang',
        objective: 'Lengkapi pseudocode yang belum selesai dengan kata kunci yang tepat.',
        theme: 'castle',
        length: 3000,
        questionIds: ['w4-q2', 'w4-q3']
      },
      {
        id: '4-3',
        worldId: 4,
        levelNumber: 3,
        title: 'Level 4-3: Labirin Debugging Kastil',
        subtitle: 'Menemukan baris instruksi penyebab bug',
        objective: 'Telusuri jejak variabel dan temukan sumber bug sebelum mencapai ruang tahta!',
        theme: 'castle',
        length: 3400,
        questionIds: ['w4-q3', 'w4-q4']
      }
    ]
  },
  {
    id: 5,
    title: 'WORLD 5 – THE FINAL BOSS CHALLENGE',
    themeName: 'Istana Raja Bug',
    description: 'Pertarungan pamungkas di jantung Istana Raja Bug! Hadapi tantangan gabungan seluruh kompetensi Informatika Fase D dan jadilah Juara!',
    bannerImage: '/src/assets/images/world_castle_boss_1794321814086.jpg',
    competencies: ['Evaluasi Menyeluruh', 'Debugging Tingkat Lanjut', 'Solusi Komprehensif'],
    levels: [
      {
        id: '5-1',
        worldId: 5,
        levelNumber: 1,
        title: 'Level 5-1: Pasukan Glitch Syntax',
        subtitle: 'Menyapu bersih bug komputasi',
        objective: 'Lompati perangkap glitch laser dan jawab soal analisis bug kritis.',
        theme: 'boss',
        length: 2900,
        questionIds: ['w5-q1', 'w5-q2']
      },
      {
        id: '5-2',
        worldId: 5,
        levelNumber: 2,
        title: 'Level 5-2: Ruang Ujian Algoritma Akbar',
        subtitle: 'Penyelesaian masalah komprehensif',
        objective: 'Uji kemampuan analisa himpunan data dan algoritma sebelum pintu Raja Bug terbuka.',
        theme: 'boss',
        length: 3200,
        questionIds: ['w5-q3', 'w5-q4']
      },
      {
        id: '5-3',
        worldId: 5,
        levelNumber: 3,
        title: 'Level 5-3: Pertarungan Akbar Melawan Raja Bug!',
        subtitle: 'Boss Battle Terakhir',
        objective: 'Kalahkan Raja Bug dengan menjawab pertanyaan pamungkas atau melompatinya untuk meraih gelar SUPER INFORMATIKA CHAMPION!',
        theme: 'boss',
        isBossLevel: true,
        length: 3800,
        questionIds: ['w5-q1', 'w5-q2', 'w5-q3', 'w5-q4']
      }
    ]
  }
];
