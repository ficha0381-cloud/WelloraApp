<template>
  <ion-page>
    <ion-content class="page">

      <!-- HEADER -->
      <div class="top-header">
        <button @click="goBack">←</button>

        <h1>Detail Olahraga</h1>

        <div></div>
      </div>


      <!-- INFORMASI OLAHRAGA -->
      <div v-if="!workoutStarted" class="normal-content">

        <div class="hero">

          <div class="hero-icon">
            🏋️‍♀️
          </div>

          <h2>{{ translatedName }}</h2>

          <p>
            {{ translatedCategory }} •
            {{ translatedModality }}
          </p>

        </div>


        <!-- INFORMASI -->
        <div class="info-grid">

          <div class="info-card">
            <div class="info-icon">🔁</div>
            <strong>{{ reps }}</strong>
            <span>Repetisi</span>
          </div>

          <div class="info-card">
            <div class="info-icon">🏋️</div>
            <strong>{{ translatedEquipment }}</strong>
            <span>Peralatan</span>
          </div>

          <div class="info-card">
            <div class="info-icon">💪</div>
            <strong>{{ translatedDifficulty }}</strong>
            <span>Tingkat</span>
          </div>

        </div>


        <!-- OTOT -->
        <div class="card">

          <h2>Otot yang Dilatih</h2>

          <div class="muscle">

            <div class="muscle-icon">
              💪
            </div>

            <p>
              {{ translatedCategory }}
            </p>

          </div>

        </div>


        <!-- CARA MELAKUKAN -->
        <div class="card">

          <h2>Cara Melakukan</h2>

          <p class="description">
            {{ translatedInstruction }}
          </p>

        </div>


        <!-- MANFAAT -->
        <div class="card">

          <h2>Manfaat Olahraga</h2>

          <ul>

            <li>
              Membantu meningkatkan kebugaran tubuh
            </li>

            <li>
              Membantu memperkuat otot
            </li>

            <li>
              Membantu meningkatkan daya tahan tubuh
            </li>

          </ul>

        </div>


        <!-- TOMBOL MULAI -->
        <button
          class="start-button"
          @click="startWorkout"
        >
          ▶ Mulai Olahraga
        </button>

      </div>


      <!-- ========================= -->
      <!-- TIMER OLAHRAGA -->
      <!-- ========================= -->

      <div
        v-if="workoutStarted"
        class="workout-screen"
      >

        <div class="workout-icon">
          🏃‍♀️
        </div>

        <p class="now-text">
          Sedang melakukan
        </p>

        <h2>
          {{ translatedName }}
        </h2>


        <!-- TIMER -->
        <div class="timer-circle">

          <div class="timer-inner">

            <span>
              {{ formattedTime }}
            </span>

            <small>
              Waktu
            </small>

          </div>

        </div>


        <!-- STATUS -->
        <div class="status">

          <span
            v-if="isPaused"
            class="paused"
          >
            ⏸ Olahraga dijeda
          </span>

          <span
            v-else
            class="running"
          >
            ● Sedang berlangsung
          </span>

        </div>


        <!-- TOMBOL TIMER -->
        <div class="timer-buttons">

          <button
            v-if="!isPaused"
            class="pause-button"
            @click="pauseWorkout"
          >
            ⏸ Jeda
          </button>

          <button
            v-else
            class="continue-button"
            @click="continueWorkout"
          >
            ▶ Lanjut
          </button>


          <button
            class="finish-button"
            @click="finishWorkout"
          >
            ✓ Selesai
          </button>

        </div>


        <!-- INFO -->
        <div class="timer-info">

          <p>
            💡 Tetap lakukan gerakan dengan benar
            dan jangan memaksakan tubuh.
          </p>

        </div>

      </div>

    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import {
  IonPage,
  IonContent
} from '@ionic/vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import {
  computed,
  ref,
  onUnmounted
} from 'vue'


const route = useRoute()

const router = useRouter()


/* =========================
   DATA OLAHRAGA
========================= */

const originalName = String(
  route.query.originalName ||
  route.query.name ||
  'Olahraga'
)

const category = String(
  route.query.category ||
  'Umum'
)

const equipment = String(
  route.query.equipment ||
  'Tanpa alat'
)

const modality = String(
  route.query.modality ||
  'Latihan'
)

const difficulty = String(
  route.query.difficulty ||
  'moderate'
)

const reps = String(
  route.query.reps ||
  '8 - 15'
)

const instruction = String(
  route.query.instruction ||
  ''
)


/* =========================
   TERJEMAHAN NAMA
========================= */

const translateName = (
  name: string
) => {

  const names: Record<string, string> = {

    '45-Degree Back Extension':
      'Peregangan Punggung 45 Derajat',

    'Ab Wheel Rollout':
      'Gulung Roda Perut',

    'Advanced Tuck Front Lever Hold':
      'Tahan Front Lever Tuck Lanjutan',

    'Advanced Tuck Planche':
      'Planche Tuck Lanjutan',

    'Tuck Planche':
      'Planche Tuck',

    'Archer Pull-up':
      'Pull-up Archer',

    'Assisted (Pole/Door) Squat':
      'Squat dengan Bantuan',

    'Cable Triceps Pushdown':
      'Dorong Trisep dengan Kabel',

    "Captain's Chair Leg Raise":
      'Angkat Kaki dengan Kursi Kapten',

    'Push-up':
      'Push-up',

    'Push Up':
      'Push-up',

    'Pull-up':
      'Pull-up',

    'Squat':
      'Squat',

    'Lunge':
      'Lunge',

    'Plank':
      'Plank',

    'Dumbbell Row':
      'Tarik Dumbbell',

    'Dumbbell Curl':
      'Curl Dumbbell',

    'Bicep Curl':
      'Curl Bisep',

    'Tricep Extension':
      'Peregangan Trisep',

    'Bench Press':
      'Press Bangku',

    'Dumbbell Bench Press':
      'Press Bangku Dumbbell',

    'Shoulder Press':
      'Press Bahu',

    'Lateral Raise':
      'Angkat Bahu Samping',

    'Front Raise':
      'Angkat Bahu Depan',

    'Calf Raise':
      'Angkat Betis',

    'Leg Press':
      'Press Kaki',

    'Leg Curl':
      'Curl Kaki',

    'Leg Extension':
      'Peregangan Kaki',

    'Hip Thrust':
      'Dorongan Pinggul',

    'Glute Bridge':
      'Jembatan Bokong',

    'Mountain Climbers':
      'Pendaki Gunung',

    'Jumping Jack':
      'Lompat Buka Tutup',

    'Burpee':
      'Burpee',

    'Russian Twist':
      'Putaran Rusia',

    'Bicycle Crunch':
      'Crunch Sepeda',

    'Sit-up':
      'Sit-up',

    'Crunch':
      'Crunch',

    'Deadlift':
      'Deadlift',

    'Romanian Deadlift':
      'Deadlift Rumania'

  }

  return names[name] || name

}


/* =========================
   TERJEMAH OTOT
========================= */

const translateCategory = (
  value: string
) => {

  const categories: Record<string, string> = {

    chest: 'Dada',
    biceps: 'Bisep',
    triceps: 'Trisep',
    forearms: 'Lengan Bawah',
    abs: 'Perut',
    quads: 'Paha Depan',
    hamstrings: 'Paha Belakang',
    glutes: 'Bokong',
    calves: 'Betis',
    lats: 'Punggung',
    upper_back: 'Punggung Atas',
    lower_back: 'Punggung Bawah',
    front_delts: 'Bahu Depan',
    rear_delts: 'Bahu Belakang',
    side_delts: 'Bahu Samping',
    traps: 'Trapezius'

  }

  return categories[value] || value

}


/* =========================
   TERJEMAH PERALATAN
========================= */

const translateEquipment = (
  value: string
) => {

  const names: Record<string, string> = {

    Dumbbell: 'Dumbbell',

    Barbell: 'Barbell',

    Bangku: 'Bangku',

    Kabel: 'Kabel',

    Parallette:
      'Pegangan Parallette',

    Parallelle:
      'Pegangan Parallette',

    'Tanpa alat':
      'Tanpa Alat',

    'Roda perut':
      'Roda Perut'

  }

  return names[value] || value

}


/* =========================
   TERJEMAH JENIS
========================= */

const translateModality = (
  value: string
) => {

  const names: Record<string, string> = {

    hypertrophy:
      'Pembentukan Otot',

    calisthenics:
      'Latihan Beban Tubuh',

    strength:
      'Latihan Kekuatan',

    power:
      'Latihan Daya Ledak',

    endurance:
      'Latihan Daya Tahan',

    mobility:
      'Latihan Kelenturan',

    cardio:
      'Latihan Kardio'

  }

  return names[value] || value

}


/* =========================
   TERJEMAH TINGKAT
========================= */

const translateDifficulty = (
  value: string
) => {

  const names: Record<string, string> = {

    low: 'Mudah',

    easy: 'Mudah',

    moderate: 'Sedang',

    medium: 'Sedang',

    high: 'Sulit',

    hard: 'Sulit'

  }

  return names[value.toLowerCase()] || 'Sedang'

}


/* =========================
   TERJEMAH INSTRUKSI
========================= */

const translateInstruction = (
  text: string
) => {

  if (!text) {

    return 'Lakukan gerakan secara perlahan dan terkontrol. Pastikan posisi tubuh tetap benar selama latihan.'

  }

  const translations: Record<string, string> = {

    'Knees tucked to chest, lean shoulders forward past hands, protract hard, hold (seconds).':
      'Tekuk lutut mendekati dada, condongkan bahu ke depan melewati tangan, dorong bahu dengan kuat, lalu tahan beberapa detik.',

    'Open the hips so the back is flat and horizontal, knees bent, depress scapulae, hold (seconds).':
      'Buka posisi pinggul hingga punggung rata dan sejajar, tekuk lutut, tarik bahu ke bawah, lalu tahan beberapa detik.',

    'Open the hips so the back is flat and parallel to floor, knees still bent, hold (seconds).':
      'Buka posisi pinggul hingga punggung rata dan sejajar dengan lantai, lutut tetap ditekuk, lalu tahan beberapa detik.',

    'Hinge down with control, extend to neutral spine, squeeze glutes, don\'t hyperextend.':
      'Turunkan tubuh secara perlahan, kembali ke posisi punggung netral, kencangkan otot bokong, dan jangan melengkungkan punggung secara berlebihan.',

    'Brace hard, roll out as far as you can hold a flat spine, pull back with abs.':
      'Kencangkan otot perut, dorong roda sejauh yang mampu dilakukan sambil menjaga punggung tetap lurus, lalu tarik kembali menggunakan otot perut.',

    'Pull to one hand while the other arm stays nearly straight along the bar; alternate sides.':
      'Tarik tubuh ke salah satu tangan sementara tangan lainnya tetap hampir lurus pada palang. Lakukan secara bergantian.'

  }

  return translations[text] || text

}


/* =========================
   HASIL TERJEMAHAN
========================= */

const translatedName = computed(() =>
  translateName(originalName)
)

const translatedCategory = computed(() =>
  translateCategory(category)
)

const translatedEquipment = computed(() =>
  translateEquipment(equipment)
)

const translatedModality = computed(() =>
  translateModality(modality)
)

const translatedDifficulty = computed(() =>
  translateDifficulty(difficulty)
)

const translatedInstruction = computed(() =>
  translateInstruction(instruction)
)


/* =========================
   TIMER
========================= */

const workoutStarted = ref(false)

const isPaused = ref(false)

const elapsedSeconds = ref(0)

let timer: ReturnType<typeof setInterval> | null = null


/* FORMAT TIMER */

const formattedTime = computed(() => {

  const minutes =
    Math.floor(
      elapsedSeconds.value / 60
    )
      .toString()
      .padStart(2, '0')

  const seconds =
    (
      elapsedSeconds.value % 60
    )
      .toString()
      .padStart(2, '0')

  return `${minutes}:${seconds}`

})


/* =========================
   MULAI OLAHRAGA
========================= */

const startWorkout = () => {

  workoutStarted.value = true

  isPaused.value = false

  elapsedSeconds.value = 0

  startTimer()

}


/* =========================
   TIMER BERJALAN
========================= */

const startTimer = () => {

  if (timer) {
    clearInterval(timer)
  }

  timer = setInterval(() => {

    if (!isPaused.value) {

      elapsedSeconds.value++

    }

  }, 1000)

}


/* =========================
   JEDA
========================= */

const pauseWorkout = () => {

  isPaused.value = true

}


/* =========================
   LANJUT
========================= */

const continueWorkout = () => {

  isPaused.value = false

}


/* =========================
   SELESAI
========================= */

const finishWorkout = () => {

  if (timer) {

    clearInterval(timer)

    timer = null

  }

  const waktu =
    formattedTime.value

  alert(
    `Olahraga selesai! 🎉\n\n` +
    `${translatedName.value}\n` +
    `Durasi: ${waktu}`
  )

  workoutStarted.value = false

  isPaused.value = false

  elapsedSeconds.value = 0

}


/* =========================
   KEMBALI
========================= */

const goBack = () => {

  if (timer) {

    clearInterval(timer)

    timer = null

  }

  router.back()

}


/* =========================
   BERSIHKAN TIMER
========================= */

onUnmounted(() => {

  if (timer) {

    clearInterval(timer)

  }

})

</script>


<style scoped>

.page {
  --background: #fffafd;
  padding-bottom: 40px;
}


/* HEADER */

.top-header {

  padding: 22px 30px;

  display: grid;

  grid-template-columns: 50px 1fr 50px;

  align-items: center;

  text-align: center;

}

.top-header button {

  width: 50px;
  height: 50px;

  border: none;

  border-radius: 17px;

  background: white;

  font-size: 28px;

  box-shadow:
    0 4px 15px rgba(0,0,0,0.05);

}

.top-header h1 {

  margin: 0;

  font-size: 22px;

  font-weight: 800;

}


/* HERO */

.hero {

  margin: 10px 30px 25px;

  padding: 32px 20px;

  background:
    linear-gradient(
      135deg,
      #775cff,
      #727bff
    );

  border-radius: 30px;

  text-align: center;

  color: white;

}

.hero-icon {

  width: 115px;
  height: 115px;

  margin: 0 auto 18px;

  border-radius: 30px;

  background: #fff0a8;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 55px;

}

.hero h2 {

  margin: 0;

  font-size: 25px;

  font-weight: 800;

}

.hero p {

  margin: 8px 0 0;

  font-size: 14px;

}


/* INFO */

.info-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 12px;

  margin: 0 30px 20px;

}

.info-card {

  background: white;

  border-radius: 22px;

  padding: 18px 8px;

  text-align: center;

  min-height: 115px;

  display: flex;

  flex-direction: column;

  justify-content: center;

  box-shadow:
    0 4px 15px rgba(0,0,0,0.04);

}

.info-icon {

  font-size: 25px;

  margin-bottom: 8px;

}

.info-card strong {

  font-size: 13px;

  color: #222;

  display: block;

}

.info-card span {

  margin-top: 5px;

  font-size: 10px;

  color: #999;

}


/* CARD */

.card {

  margin: 15px 30px;

  padding: 22px;

  background: white;

  border-radius: 22px;

  box-shadow:
    0 4px 15px rgba(0,0,0,0.04);

}

.card h2 {

  margin: 0 0 15px;

  font-size: 18px;

}


/* OTOT */

.muscle {

  display: flex;

  align-items: center;

  gap: 12px;

}

.muscle-icon {

  width: 50px;
  height: 50px;

  border-radius: 15px;

  background: #fff0a8;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 25px;

}

.muscle p {

  margin: 0;

  font-size: 14px;

  color: #555;

}


/* DESKRIPSI */

.description {

  margin: 0;

  color: #777;

  font-size: 13px;

  line-height: 1.8;

}


/* MANFAAT */

.card ul {

  margin: 0;

  padding-left: 20px;

}

.card li {

  margin-bottom: 10px;

  color: #777;

  font-size: 13px;

  line-height: 1.5;

}


/* TOMBOL */

.start-button {

  display: block;

  width: calc(100% - 60px);

  margin: 25px 30px;

  padding: 17px;

  border: none;

  border-radius: 18px;

  background: #925cff;

  color: white;

  font-size: 15px;

  font-weight: bold;

  box-shadow:
    0 6px 18px rgba(255,92,154,0.25);

}


/* =========================
   LAYAR TIMER
========================= */

.workout-screen {

  margin: 20px 30px;

  padding: 30px 20px;

  background: white;

  border-radius: 30px;

  text-align: center;

  box-shadow:
    0 8px 25px rgba(0,0,0,.06);

}


.workout-icon {

  width: 80px;
  height: 80px;

  margin: 0 auto 15px;

  border-radius: 25px;

  background: #fff0a8;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 42px;

}


.now-text {

  margin: 0;

  color: #999;

  font-size: 12px;

}


.workout-screen h2 {

  margin: 7px 0 25px;

  color: #222;

  font-size: 22px;

}


/* TIMER */

.timer-circle {

  width: 220px;
  height: 220px;

  margin: 0 auto 20px;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #ff5c9a,
      #ff8cba
    );

  display: flex;

  align-items: center;

  justify-content: center;

  box-shadow:
    0 10px 30px rgba(255,92,154,.25);

}


.timer-inner {

  width: 180px;
  height: 180px;

  border-radius: 50%;

  background: white;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

}


.timer-inner span {

  font-size: 42px;

  font-weight: 800;

  color: #ff5c9a;

}


.timer-inner small {

  color: #999;

  font-size: 12px;

}


/* STATUS */

.status {

  margin-bottom: 25px;

  font-size: 12px;

}


.running {

  color: #31b57b;

}


.paused {

  color: #f0a500;

}


/* TOMBOL TIMER */

.timer-buttons {

  display: flex;

  gap: 10px;

}


.timer-buttons button {

  flex: 1;

  padding: 15px;

  border: none;

  border-radius: 17px;

  font-size: 13px;

  font-weight: bold;

}


.pause-button {

  background: #fff0a8;

  color: #765f00;

}


.continue-button {

  background: #dff8ec;

  color: #16835b;

}


.finish-button {

  background: #ff5c9a;

  color: white;

}


/* INFO TIMER */

.timer-info {

  margin-top: 20px;

  padding: 14px;

  background: #fffafd;

  border-radius: 15px;

}


.timer-info p {

  margin: 0;

  color: #999;

  font-size: 11px;

  line-height: 1.5;

}


/* HP */

@media (max-width: 500px) {

  .top-header {

    padding-left: 18px;
    padding-right: 18px;

  }

  .hero {

    margin-left: 18px;
    margin-right: 18px;

  }

  .info-grid {

    margin-left: 18px;
    margin-right: 18px;

  }

  .card {

    margin-left: 18px;
    margin-right: 18px;

  }

  .start-button {

    width: calc(100% - 36px);

    margin-left: 18px;
    margin-right: 18px;

  }

  .workout-screen {

    margin-left: 18px;
    margin-right: 18px;

  }

  .timer-circle {

    width: 200px;
    height: 200px;

  }

  .timer-inner {

    width: 165px;
    height: 165px;

  }

}

</style>