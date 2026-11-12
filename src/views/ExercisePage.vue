<template>
  <ion-page>
    <ion-content :fullscreen="true" class="exercise-page">

      <!-- HEADER -->
      <div class="top-header">
        <button class="back-button" @click="goBack">
          <IonIcon :icon="arrowBackOutline" />
        </button>

        <div class="header-title">
          <h1>Aktivitas Olahraga</h1>
          <p>Catat aktivitas olahraga kamu</p>
        </div>

        <div class="header-icon">
          <IonIcon :icon="fitnessOutline" />
        </div>
      </div>

      <div class="content">

        <!-- RINGKASAN -->
        <div class="summary-card">
          <div class="summary-icon">
            <IonIcon :icon="flameOutline" />
          </div>

          <div class="summary-info">
            <span>Minggu ini</span>
            <strong>{{ totalMingguIni }} menit</strong>
            <small>{{ jumlahMingguIni }} aktivitas olahraga</small>
          </div>

          <div class="summary-badge">
            <IonIcon :icon="trendingUpOutline" />
          </div>
        </div>

        <!-- TOMBOL TAMBAH -->
        <button class="add-activity-button" @click="openModal">
          <span class="add-icon">
            <IonIcon :icon="addOutline" />
          </span>

          <span>
            <strong>Tambah Aktivitas</strong>
            <small>Catat olahraga yang baru kamu lakukan</small>
          </span>

          <IonIcon
            :icon="chevronForwardOutline"
            class="button-arrow"
          />
        </button>

        <!-- JUDUL -->
        <div class="section-header">
          <div>
            <h2>Aktivitas Terbaru</h2>
            <p>Riwayat olahraga kamu</p>
          </div>
        </div>

        <!-- KOSONG -->
        <div v-if="activities.length === 0" class="empty-state">
          <div class="empty-icon">
            <IonIcon :icon="fitnessOutline" />
          </div>

          <h3>Belum ada aktivitas</h3>

          <p>
            Yuk mulai catat aktivitas olahraga
            pertama kamu hari ini.
          </p>

          <button @click="openModal">
            <IonIcon :icon="addOutline" />
            Tambah Aktivitas
          </button>
        </div>

        <!-- LIST AKTIVITAS -->
        <div v-else class="activity-list">

          <div
            v-for="activity in sortedActivities"
            :key="activity.id"
            class="activity-card"
          >

            <div
              class="activity-icon"
              :class="getColorClass(activity.type)"
            >
              <IonIcon :icon="getIcon(activity.type)" />
            </div>

            <div class="activity-info">
              <h3>{{ activity.name }}</h3>

              <div class="activity-meta">
                <span>
                  <IonIcon :icon="timeOutline" />
                  {{ activity.duration }} menit
                </span>

                <span>
                  <IonIcon :icon="calendarOutline" />
                  {{ formatDate(activity.date) }}
                </span>
              </div>
            </div>

            <button
              class="delete-button"
              @click="deleteActivity(activity.id)"
            >
              <IonIcon :icon="trashOutline" />
            </button>

          </div>

        </div>

      </div>

      <!-- MODAL -->
      <div
        v-if="showModal"
        class="modal-overlay"
        @click.self="closeModal"
      >
        <div class="modal">

          <div class="modal-header">
            <div>
              <h2>Tambah Aktivitas</h2>
              <p>Catat olahraga yang kamu lakukan</p>
            </div>

            <button
              class="close-button"
              @click="closeModal"
            >
              <IonIcon :icon="closeOutline" />
            </button>
          </div>

          <!-- JENIS OLAHRAGA -->
          <div class="form-group">
            <label>Jenis Olahraga</label>

            <div class="sport-grid">

              <button
                v-for="sport in sports"
                :key="sport.type"
                class="sport-option"
                :class="{
                  selected: form.type === sport.type
                }"
                @click="selectSport(sport)"
              >
                <div class="sport-icon">
                  <IonIcon :icon="sport.icon" />
                </div>

                <span>{{ sport.name }}</span>
              </button>

            </div>
          </div>

          <!-- NAMA -->
          <div class="form-group">
            <label>Nama Aktivitas</label>

            <input
              v-model="form.name"
              type="text"
              placeholder="Contoh: Jalan Pagi"
            />
          </div>

          <!-- DURASI -->
          <div class="form-group">
            <label>Durasi</label>

            <div class="duration-input">
              <input
                v-model.number="form.duration"
                type="number"
                min="1"
                max="1440"
                placeholder="30"
              />

              <span>menit</span>
            </div>
          </div>

          <!-- TANGGAL -->
          <div class="form-group">
            <label>Tanggal</label>

            <input
              v-model="form.date"
              type="date"
            />
          </div>

          <!-- ERROR -->
          <div v-if="errorMessage" class="error-message">
            <IonIcon :icon="alertCircleOutline" />
            {{ errorMessage }}
          </div>

          <!-- SAVE -->
          <button
            class="save-button"
            @click="saveActivity"
          >
            <IonIcon :icon="checkmarkOutline" />
            Simpan Aktivitas
          </button>

        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonIcon
} from '@ionic/vue'

import {
  arrowBackOutline,
  fitnessOutline,
  flameOutline,
  trendingUpOutline,
  addOutline,
  chevronForwardOutline,
  timeOutline,
  calendarOutline,
  trashOutline,
  closeOutline,
  checkmarkOutline,
  alertCircleOutline,
  walkOutline,
  barbellOutline,
  bodyOutline,
  bicycleOutline,
  heartOutline
} from 'ionicons/icons'

import {
  computed,
  reactive,
  ref,
  onMounted
} from 'vue'

import { useRouter } from 'vue-router'

import {
  addWorkout,
  getWorkouts,
  deleteWorkout
} from '../database/database'

const router = useRouter()

/* =========================================================
   TYPE
========================================================= */

interface Activity {
  id: number
  name: string
  type: string
  duration: number
  date: string
}

/* =========================================================
   OLAHRAGA
========================================================= */

const sports = [
  {
    type: 'jalan',
    name: 'Jalan',
    icon: walkOutline
  },
  {
    type: 'lari',
    name: 'Lari',
    icon: walkOutline
  },
  {
    type: 'beban',
    name: 'Beban',
    icon: barbellOutline
  },
  {
    type: 'yoga',
    name: 'Yoga',
    icon: bodyOutline
  },
  {
    type: 'sepeda',
    name: 'Sepeda',
    icon: bicycleOutline
  },
  {
    type: 'cardio',
    name: 'Cardio',
    icon: heartOutline
  }
]

/* =========================================================
   DATABASE
========================================================= */

const activities = ref<Activity[]>([])

const databaseError = ref(false)

/* =========================================================
   LOAD ACTIVITIES
========================================================= */

async function loadActivities() {
  try {
    const data = await getWorkouts()

    activities.value = data
      .map(activity => ({
        id: Number(activity.id),
        name: activity.name,
        type: activity.type,
        duration: Number(activity.duration),
        date: activity.date
      }))
      .filter(activity => {
        return (
          activity.id !== undefined &&
          activity.name
        )
      })

    databaseError.value = false

  } catch (error) {
    console.error(
      'Gagal membaca aktivitas dari database:',
      error
    )

    databaseError.value = true
    activities.value = []
  }
}

/* =========================================================
   MODAL
========================================================= */

const showModal = ref(false)

const errorMessage = ref('')

/* =========================================================
   FORM
========================================================= */

const today =
  new Date()
    .toISOString()
    .split('T')[0]

const form = reactive({
  name: '',
  type: 'jalan',
  duration: 30,
  date: today
})

/* =========================================================
   SORT
========================================================= */

const sortedActivities =
  computed(() => {
    return [...activities.value].sort(
      (a, b) => {
        return (
          new Date(
            b.date
          ).getTime() -
          new Date(
            a.date
          ).getTime()
        )
      }
    )
  })

/* =========================================================
   MINGGU INI
========================================================= */

function getStartOfWeek() {
  const date = new Date()

  const day = date.getDay()

  const diff =
    day === 0
      ? -6
      : 1 - day

  date.setDate(
    date.getDate() + diff
  )

  date.setHours(
    0,
    0,
    0,
    0
  )

  return date
}

const activitiesThisWeek =
  computed(() => {
    const start =
      getStartOfWeek()

    const now = new Date()

    now.setHours(
      23,
      59,
      59,
      999
    )

    return activities.value.filter(
      activity => {
        const date =
          new Date(
            activity.date +
            'T00:00:00'
          )

        return (
          date >= start &&
          date <= now
        )
      }
    )
  })

const totalMingguIni =
  computed(() => {
    return activitiesThisWeek.value.reduce(
      (total, activity) =>
        total +
        Number(
          activity.duration
        ),
      0
    )
  })

const jumlahMingguIni =
  computed(() => {
    return activitiesThisWeek.value.length
  })

/* =========================================================
   MODAL
========================================================= */

function openModal() {
  errorMessage.value = ''

  form.name = ''
  form.type = 'jalan'
  form.duration = 30
  form.date = today

  showModal.value = true
}

function closeModal() {
  showModal.value = false
  errorMessage.value = ''
}

/* =========================================================
   PILIH OLAHRAGA
========================================================= */

function selectSport(
  sport: {
    type: string
    name: string
  }
) {
  form.type = sport.type

  if (!form.name) {
    form.name = sport.name
  }
}

/* =========================================================
   SIMPAN AKTIVITAS
========================================================= */

async function saveActivity() {
  errorMessage.value = ''

  if (!form.name.trim()) {
    errorMessage.value =
      'Nama aktivitas belum diisi.'

    return
  }

  if (
    !form.duration ||
    form.duration <= 0
  ) {
    errorMessage.value =
      'Durasi harus lebih dari 0 menit.'

    return
  }

  if (!form.date) {
    errorMessage.value =
      'Tanggal aktivitas belum dipilih.'

    return
  }

  try {
    /*
     * DATA MASUK KE DATABASE
     */
    await addWorkout({
      name: form.name.trim(),
      type: form.type,
      duration: Number(
        form.duration
      ),
      date: form.date
    })

    /*
     * BACA ULANG DATA
     */
    await loadActivities()

    /*
     * TUTUP MODAL
     */
    closeModal()

    console.log(
      'Aktivitas berhasil disimpan ke WelloraDB'
    )

  } catch (error) {
    console.error(
      'Gagal menyimpan aktivitas:',
      error
    )

    errorMessage.value =
      'Aktivitas gagal disimpan ke database. Coba lagi.'
  }
}

/* =========================================================
   HAPUS
========================================================= */

async function deleteActivity(
  id: number
) {
  const confirmed =
    window.confirm(
      'Hapus aktivitas ini?'
    )

  if (!confirmed) {
    return
  }

  try {
    await deleteWorkout(id)

    await loadActivities()

    console.log(
      'Aktivitas berhasil dihapus dari WelloraDB'
    )

  } catch (error) {
    console.error(
      'Gagal menghapus aktivitas:',
      error
    )

    alert(
      'Aktivitas gagal dihapus.'
    )
  }
}

/* =========================================================
   ICON
========================================================= */

function getIcon(
  type: string
) {
  switch (type) {
    case 'jalan':
      return walkOutline

    case 'lari':
      return walkOutline

    case 'beban':
      return barbellOutline

    case 'yoga':
      return bodyOutline

    case 'sepeda':
      return bicycleOutline

    case 'cardio':
      return heartOutline

    default:
      return fitnessOutline
  }
}

/* =========================================================
   WARNA ICON
========================================================= */

function getColorClass(
  type: string
) {
  switch (type) {
    case 'jalan':
      return 'yellow'

    case 'lari':
      return 'pink'

    case 'beban':
      return 'purple'

    case 'yoga':
      return 'blue'

    case 'sepeda':
      return 'green'

    case 'cardio':
      return 'red'

    default:
      return 'yellow'
  }
}

/* =========================================================
   FORMAT TANGGAL
========================================================= */

function formatDate(
  date: string
) {
  const parsed =
    new Date(
      date + 'T00:00:00'
    )

  return parsed.toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  )
}

/* =========================================================
   BACK
========================================================= */

function goBack() {
  router.back()
}

/* =========================================================
   START
========================================================= */

onMounted(async () => {
  await loadActivities()
})
</script>

<style scoped>
/* =========================================================
   PAGE
========================================================= */

.exercise-page {
  --background: #fff8fb;
  background: #fff8fb;
  color: #252525;
}

/* =========================================================
   HEADER
========================================================= */

.top-header {
  display: flex;
  align-items: center;
  padding: 22px 20px 16px;
  gap: 14px;
  background: #ffffff;
}

.back-button {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 14px;
  background: #fff0f6;
  color: #ec4f91;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.header-title {
  flex: 1;
}

.header-title h1 {
  margin: 0;
  font-size: 21px;
  font-weight: 800;
  color: #252525;
}

.header-title p {
  margin: 4px 0 0;
  color: #888;
  font-size: 12px;
}

.header-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #fff1c7;
  color: #d99b00;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23px;
}

/* =========================================================
   CONTENT
========================================================= */

.content {
  padding: 18px 20px 40px;
}

/* =========================================================
   SUMMARY
========================================================= */

.summary-card {
  display: flex;
  align-items: center;
  padding: 18px;
  border-radius: 22px;
  background: linear-gradient(
    135deg,
    #ffdaea,
    #fff0a8
  );
  margin-bottom: 16px;
  box-shadow:
    0 8px 24px rgba(232, 83, 142, 0.12);
}

.summary-icon {
  width: 52px;
  height: 52px;
  border-radius: 17px;
  background: #ffffff;
  color: #ed5796;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 27px;
  margin-right: 14px;
}

.summary-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.summary-info span {
  color: #777;
  font-size: 12px;
}

.summary-info strong {
  margin-top: 2px;
  font-size: 24px;
  font-weight: 800;
  color: #252525;
}

.summary-info small {
  margin-top: 2px;
  color: #777;
  font-size: 11px;
}

.summary-badge {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  color: #e9a600;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

/* =========================================================
   ADD BUTTON
========================================================= */

.add-activity-button {
  width: 100%;
  border: none;
  border-radius: 20px;
  background: #ffffff;
  padding: 16px;
  display: flex;
  align-items: center;
  text-align: left;
  gap: 13px;
  box-shadow:
    0 5px 18px rgba(0, 0, 0, 0.06);
  margin-bottom: 28px;
}

.add-icon {
  width: 48px;
  height: 48px;
  border-radius: 15px;
  background: #ffdfeb;
  color: #ed4e91;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.add-activity-button > span:nth-child(2) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.add-activity-button strong {
  font-size: 14px;
  color: #292929;
}

.add-activity-button small {
  color: #999;
  font-size: 11px;
  margin-top: 3px;
}

.button-arrow {
  color: #bbb;
  font-size: 19px;
}

/* =========================================================
   SECTION
========================================================= */

.section-header {
  margin-bottom: 14px;
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
}

.section-header p {
  margin: 4px 0 0;
  color: #999;
  font-size: 12px;
}

/* =========================================================
   ACTIVITY
========================================================= */

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-card {
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 14px;
  border-radius: 19px;
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.05);
}

.activity-icon {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  margin-right: 13px;
}

.activity-icon.yellow {
  background: #fff1bd;
  color: #d99b00;
}

.activity-icon.pink {
  background: #ffddea;
  color: #e84f91;
}

.activity-icon.purple {
  background: #e8ddff;
  color: #7952d8;
}

.activity-icon.blue {
  background: #dcecff;
  color: #4783d1;
}

.activity-icon.green {
  background: #dff5e7;
  color: #42a866;
}

.activity-icon.red {
  background: #ffe0df;
  color: #dc5752;
}

.activity-info {
  flex: 1;
  min-width: 0;
}

.activity-info h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 750;
  color: #282828;
}

.activity-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 6px;
}

.activity-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #999;
  font-size: 10px;
}

.activity-meta ion-icon {
  font-size: 13px;
}

.delete-button {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 11px;
  background: #fff1f1;
  color: #e56b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

/* =========================================================
   EMPTY
========================================================= */

.empty-state {
  text-align: center;
  background: #ffffff;
  padding: 32px 20px;
  border-radius: 22px;
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.04);
}

.empty-icon {
  width: 70px;
  height: 70px;
  border-radius: 22px;
  background: #fff0f6;
  color: #ed5796;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  font-size: 34px;
}

.empty-state h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
}

.empty-state p {
  margin: 8px auto 18px;
  max-width: 260px;
  color: #999;
  font-size: 12px;
  line-height: 1.6;
}

.empty-state button {
  border: none;
  border-radius: 13px;
  background: #ed5796;
  color: #ffffff;
  padding: 11px 17px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-weight: 700;
}

/* =========================================================
   MODAL
========================================================= */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(30, 20, 25, 0.48);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal {
  width: 100%;
  max-width: 520px;
  max-height: 92vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 28px 28px 0 0;
  padding: 22px 20px 30px;
  box-shadow:
    0 -10px 35px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 22px;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.modal-header p {
  margin: 4px 0 0;
  color: #999;
  font-size: 12px;
}

.close-button {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 12px;
  background: #f5f5f5;
  color: #777;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

/* =========================================================
   FORM
========================================================= */

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 9px;
  font-size: 13px;
  font-weight: 750;
  color: #333;
}

.form-group input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 13px 14px;
  font-size: 14px;
  outline: none;
  background: #fafafa;
}

.form-group input:focus {
  border-color: #ed5796;
  background: #ffffff;
}

/* =========================================================
   SPORT GRID
========================================================= */

.sport-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
}

.sport-option {
  border: 1px solid #eeeeee;
  border-radius: 15px;
  background: #fafafa;
  padding: 11px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #777;
}

.sport-option.selected {
  border-color: #ed5796;
  background: #fff0f6;
  color: #ed5796;
}

.sport-icon {
  font-size: 23px;
}

.sport-option span {
  font-size: 10px;
  font-weight: 700;
}

/* =========================================================
   DURATION
========================================================= */

.duration-input {
  position: relative;
}

.duration-input input {
  padding-right: 70px;
}

.duration-input span {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 12px;
}

/* =========================================================
   ERROR
========================================================= */

.error-message {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 13px;
  border-radius: 12px;
  background: #fff0f0;
  color: #d65c5c;
  font-size: 12px;
  margin-bottom: 14px;
}

/* =========================================================
   SAVE
========================================================= */

.save-button {
  width: 100%;
  border: none;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    #ed5796,
    #e94387
  );
  color: #ffffff;
  padding: 15px;
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow:
    0 7px 18px rgba(237, 87, 150, 0.25);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 360px) {

  .content {
    padding-left: 15px;
    padding-right: 15px;
  }

  .sport-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .header-title h1 {
    font-size: 18px;
  }
}
</style>