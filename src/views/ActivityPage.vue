<template>
  <ion-page>
    <ion-content :fullscreen="true" class="activity-page">

      <!-- HEADER -->
      <div class="header">
        <button class="back-button" @click="goBack">
          ←
        </button>

        <div>
          <p>Wellora</p>
          <h1>Aktivitas 🏃‍♀️</h1>
        </div>
      </div>

      <!-- FORM -->
      <div class="form-card">

        <h2>Tambah Aktivitas</h2>
        <p class="description">
          Catat aktivitas olahraga kamu hari ini.
        </p>

        <!-- NAMA -->
        <label>Nama Olahraga</label>

        <input
          v-model="activity.name"
          type="text"
          placeholder="Contoh: Jalan Kaki"
        />

        <!-- KATEGORI -->
        <label>Kategori</label>

        <select v-model="activity.category">
          <option value="">Pilih kategori</option>
          <option value="Cardio">Cardio</option>
          <option value="Strength">Strength</option>
          <option value="Flexibility">Flexibility</option>
          <option value="Full Body">Full Body</option>
        </select>

        <!-- DURASI -->
        <label>Durasi (menit)</label>

        <input
          v-model="activity.duration"
          type="number"
          placeholder="Contoh: 30"
        />

        <!-- KALORI -->
        <label>Kalori</label>

        <input
          v-model="activity.calories"
          type="number"
          placeholder="Contoh: 120"
        />

        <!-- TANGGAL -->
        <label>Tanggal</label>

        <input
          v-model="activity.date"
          type="date"
        />

        <!-- BUTTON -->
        <button class="save-button" @click="saveActivity">
          💾 Simpan Aktivitas
        </button>

      </div>

      <!-- AKTIVITAS -->
      <div class="section-title">
        <h2>Aktivitas Tersimpan</h2>
      </div>

      <div
        v-if="activities.length === 0"
        class="empty-card"
      >
        <div>🏃‍♀️</div>
        <h3>Belum ada aktivitas</h3>
        <p>Tambahkan aktivitas olahraga kamu.</p>
      </div>

      <div
        v-for="(item, index) in activities"
        :key="index"
        class="activity-card"
      >

        <div class="activity-icon">
          🏃‍♀️
        </div>

        <div class="activity-info">
          <h3>{{ item.name }}</h3>

          <p>
            {{ item.category }} •
            {{ item.duration }} menit
          </p>

          <small>
            🔥 {{ item.calories }} kcal
            • {{ item.date }}
          </small>
        </div>

        <button
          class="delete-button"
          @click="deleteActivity(index)"
        >
          🗑️
        </button>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import {
  IonPage,
  IonContent
} from '@ionic/vue'

import { reactive, ref } from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const activity = reactive({
  name: '',
  category: '',
  duration: '',
  calories: '',
  date: ''
})

const activities = ref<any[]>([])

const goBack = () => {
  router.back()
}

const saveActivity = () => {

  if (
    !activity.name ||
    !activity.category ||
    !activity.duration ||
    !activity.calories ||
    !activity.date
  ) {
    alert('Lengkapi semua data terlebih dahulu!')
    return
  }

  activities.value.push({
    name: activity.name,
    category: activity.category,
    duration: activity.duration,
    calories: activity.calories,
    date: activity.date
  })

  alert('Aktivitas berhasil disimpan! 🎉')

  activity.name = ''
  activity.category = ''
  activity.duration = ''
  activity.calories = ''
  activity.date = ''
}

const deleteActivity = (index: number) => {

  const confirmDelete = confirm(
    'Hapus aktivitas ini?'
  )

  if (confirmDelete) {
    activities.value.splice(index, 1)
  }

}

</script>

<style scoped>

.activity-page {
  --background: #fffafc;
  --padding-bottom: 30px;
}

/* HEADER */

.header {
  padding: 25px 20px 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.back-button {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 15px;
  background: white;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,.05);
}

.header p {
  margin: 0;
  color: #ff5c9a;
  font-size: 13px;
  font-weight: 700;
}

.header h1 {
  margin: 4px 0 0;
  font-size: 24px;
  font-weight: 800;
}

/* FORM */

.form-card {
  margin: 10px 20px;
  padding: 20px;
  background: white;
  border-radius: 23px;
  box-shadow: 0 5px 18px rgba(0,0,0,.05);
}

.form-card h2 {
  margin: 0;
  font-size: 20px;
}

.description {
  margin: 5px 0 20px;
  color: #888;
  font-size: 12px;
}

label {
  display: block;
  margin: 14px 0 6px;
  font-size: 12px;
  font-weight: 700;
}

input,
select {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 13px;
  background: #fffafc;
  outline: none;
  font-size: 13px;
}

input:focus,
select:focus {
  border-color: #ff5c9a;
}

.save-button {
  width: 100%;
  margin-top: 22px;
  padding: 14px;
  border: none;
  border-radius: 15px;
  background: #ff5c9a;
  color: white;
  font-size: 14px;
  font-weight: 700;
}

/* TITLE */

.section-title {
  margin: 22px 20px 10px;
}

.section-title h2 {
  margin: 0;
  font-size: 18px;
}

/* EMPTY */

.empty-card {
  margin: 0 20px;
  padding: 30px 20px;
  background: white;
  border-radius: 20px;
  text-align: center;
}

.empty-card div {
  font-size: 40px;
}

.empty-card h3 {
  margin: 8px 0 5px;
  font-size: 15px;
}

.empty-card p {
  margin: 0;
  color: #999;
  font-size: 11px;
}

/* ACTIVITY */

.activity-card {
  margin: 10px 20px;
  padding: 15px;
  background: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,.04);
}

.activity-icon {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  background: #fff0a8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.activity-info {
  flex: 1;
}

.activity-info h3 {
  margin: 0;
  font-size: 14px;
}

.activity-info p {
  margin: 4px 0;
  color: #ff5c9a;
  font-size: 11px;
}

.activity-info small {
  color: #888;
  font-size: 10px;
}

.delete-button {
  border: none;
  background: #ffe0eb;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  font-size: 17px;
}

</style>