<template>
  <ion-page>
    <ion-content :fullscreen="true" class="profile-content">

      <!-- HEADER -->
      <div class="top-header">
        <button
          class="back-button"
          @click="goHome"
        >
          ‹
        </button>

        <div class="header-title">
          Profil
        </div>

        <div class="header-spacer"></div>
      </div>

      <!-- PROFILE HEADER -->
      <section class="profile-header-card">

        <div class="avatar">
          👤
        </div>

        <div class="profile-header-info">
          <div class="profile-name">
            {{ profile.name || 'Pengguna Wellora' }}
          </div>

          <div class="profile-subtitle">
            Profil kesehatan dan olahraga
          </div>
        </div>

      </section>

      <!-- DATA DIRI -->
      <section class="section">

        <div class="section-title">
          Data diri
        </div>

        <div class="form-card">

          <!-- NAMA -->
          <div class="form-group">

            <label>
              Nama
            </label>

            <div class="input-wrapper">
              <span class="input-icon">
                👤
              </span>

              <input
                v-model="profile.name"
                type="text"
                placeholder="Masukkan nama"
              />
            </div>

          </div>

          <!-- USIA -->
          <div class="form-group">

            <label>
              Usia
            </label>

            <div class="input-wrapper">
              <span class="input-icon">
                🎂
              </span>

              <input
                v-model.number="profile.age"
                type="number"
                min="0"
                max="120"
                placeholder="Masukkan usia"
              />

              <span class="input-unit">
                tahun
              </span>
            </div>

          </div>

          <!-- BERAT -->
          <div class="form-group">

            <label>
              Berat badan
            </label>

            <div class="input-wrapper">
              <span class="input-icon">
                ⚖️
              </span>

              <input
                v-model.number="profile.weight"
                type="number"
                min="0"
                step="0.1"
                placeholder="Masukkan berat"
              />

              <span class="input-unit">
                kg
              </span>
            </div>

          </div>

          <!-- TINGGI -->
          <div class="form-group">

            <label>
              Tinggi badan
            </label>

            <div class="input-wrapper">
              <span class="input-icon">
                📏
              </span>

              <input
                v-model.number="profile.height"
                type="number"
                min="0"
                step="0.1"
                placeholder="Masukkan tinggi"
              />

              <span class="input-unit">
                cm
              </span>
            </div>

          </div>

        </div>

      </section>

      <!-- TUJUAN -->
      <section class="section">

        <div class="section-title">
          Tujuan olahraga
        </div>

        <div class="goal-card">

          <button
            class="goal-option"
            :class="{
              selected:
                profile.goal === 'Menurunkan berat badan'
            }"
            @click="
              profile.goal =
                'Menurunkan berat badan'
            "
          >

            <div class="goal-icon pink">
              🔥
            </div>

            <div class="goal-info">
              <div class="goal-title">
                Menurunkan berat badan
              </div>

              <div class="goal-description">
                Membantu menjaga berat badan
              </div>
            </div>

            <div
              v-if="
                profile.goal ===
                'Menurunkan berat badan'
              "
              class="goal-check"
            >
              ✓
            </div>

          </button>

          <button
            class="goal-option"
            :class="{
              selected:
                profile.goal === 'Meningkatkan kebugaran'
            }"
            @click="
              profile.goal =
                'Meningkatkan kebugaran'
            "
          >

            <div class="goal-icon orange">
              💪
            </div>

            <div class="goal-info">
              <div class="goal-title">
                Meningkatkan kebugaran
              </div>

              <div class="goal-description">
                Meningkatkan stamina dan kekuatan
              </div>
            </div>

            <div
              v-if="
                profile.goal ===
                'Meningkatkan kebugaran'
              "
              class="goal-check"
            >
              ✓
            </div>

          </button>

          <button
            class="goal-option"
            :class="{
              selected:
                profile.goal === 'Menjaga kesehatan'
            }"
            @click="
              profile.goal =
                'Menjaga kesehatan'
            "
          >

            <div class="goal-icon green">
              ❤️
            </div>

            <div class="goal-info">
              <div class="goal-title">
                Menjaga kesehatan
              </div>

              <div class="goal-description">
                Menjaga tubuh tetap aktif dan sehat
              </div>
            </div>

            <div
              v-if="
                profile.goal ===
                'Menjaga kesehatan'
              "
              class="goal-check"
            >
              ✓
            </div>

          </button>

          <button
            class="goal-option"
            :class="{
              selected:
                profile.goal === 'Membangun otot'
            }"
            @click="
              profile.goal =
                'Membangun otot'
            "
          >

            <div class="goal-icon purple">
              🏋️
            </div>

            <div class="goal-info">
              <div class="goal-title">
                Membangun otot
              </div>

              <div class="goal-description">
                Fokus pada latihan kekuatan
              </div>
            </div>

            <div
              v-if="
                profile.goal ===
                'Membangun otot'
              "
              class="goal-check"
            >
              ✓
            </div>

          </button>

        </div>

      </section>

      <!-- BMI -->
      <section
        v-if="bmi > 0"
        class="section"
      >

        <div class="section-title">
          Informasi tubuh
        </div>

        <div class="bmi-card">

          <div class="bmi-icon">
            📊
          </div>

          <div class="bmi-info">

            <div class="bmi-label">
              BMI
            </div>

            <div class="bmi-value">
              {{ bmi.toFixed(1) }}
            </div>

            <div
              class="bmi-status"
              :class="bmiStatusClass"
            >
              {{ bmiStatus }}
            </div>

          </div>

        </div>

      </section>

      <!-- TOMBOL SIMPAN -->
      <section class="save-section">

        <button
          class="save-button"
          :disabled="saving"
          @click="save"
        >

          <span v-if="!saving">
            💾
          </span>

          <span v-else>
            ⏳
          </span>

          {{
            saving
              ? 'Menyimpan...'
              : 'Simpan Profil'
          }}

        </button>

        <div
          v-if="message"
          class="message"
          :class="messageType"
        >
          {{ message }}
        </div>

      </section>

      <!-- BOTTOM SPACE -->
      <div class="bottom-space"></div>

      <!-- BOTTOM NAV -->
      <nav class="bottom-nav">

        <button
          class="nav-item"
          @click="goHome"
        >
          <span class="nav-icon">
            ⌂
          </span>

          <span>
            Home
          </span>
        </button>

        <button
          class="nav-item"
          @click="goExercise"
        >
          <span class="nav-icon">
            🏃
          </span>

          <span>
            Olahraga
          </span>
        </button>

        <button
          class="nav-add"
          @click="goExercise"
        >
          +
        </button>

        <button
          class="nav-item"
          @click="goTarget"
        >
          <span class="nav-icon">
            🎯
          </span>

          <span>
            Target
          </span>
        </button>

        <button
          class="nav-item active"
          @click="goProfile"
        >
          <span class="nav-icon">
            👤
          </span>

          <span>
            Profil
          </span>
        </button>

      </nav>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import {
  IonPage,
  IonContent
} from '@ionic/vue'

import {
  computed,
  onMounted,
  ref
} from 'vue'

import { useRouter } from 'vue-router'

import {
  getProfile,
  saveProfile
} from '../database/database'

const router = useRouter()

/* =========================
   TYPE PROFILE
========================= */

interface Profile {
  id: number
  name: string
  age: number
  weight: number
  height: number
  goal: string
}

/* =========================
   DATA PROFILE
========================= */

const profile =
  ref<Profile>({
    id: 1,
    name: '',
    age: 0,
    weight: 0,
    height: 0,
    goal: ''
  })

/* =========================
   STATE
========================= */

const saving =
  ref(false)

const message =
  ref('')

const messageType =
  ref<'success' | 'error'>(
    'success'
  )

/* =========================
   BMI
========================= */

const bmi =
  computed(() => {

    const weight =
      Number(
        profile.value.weight
      )

    const height =
      Number(
        profile.value.height
      )

    if (
      weight <= 0 ||
      height <= 0
    ) {
      return 0
    }

    const heightMeter =
      height / 100

    return (
      weight /
      (heightMeter *
        heightMeter)
    )
  })

/* =========================
   BMI STATUS
========================= */

const bmiStatus =
  computed(() => {

    if (bmi.value <= 0) {
      return ''
    }

    if (bmi.value < 18.5) {
      return 'Berat badan kurang'
    }

    if (bmi.value < 25) {
      return 'Berat badan normal'
    }

    if (bmi.value < 30) {
      return 'Berat badan berlebih'
    }

    return 'Obesitas'
  })

const bmiStatusClass =
  computed(() => {

    if (bmi.value <= 0) {
      return ''
    }

    if (bmi.value < 18.5) {
      return 'underweight'
    }

    if (bmi.value < 25) {
      return 'normal'
    }

    if (bmi.value < 30) {
      return 'overweight'
    }

    return 'obese'
  })

/* =========================
   LOAD PROFILE
========================= */

const loadProfile =
  async () => {

    try {

      const savedProfile =
        await getProfile()

      if (savedProfile) {

        profile.value = {
          id:
            Number(
              savedProfile.id
            ) || 1,

          name:
            String(
              savedProfile.name || ''
            ),

          age:
            Number(
              savedProfile.age
            ) || 0,

          weight:
            Number(
              savedProfile.weight
            ) || 0,

          height:
            Number(
              savedProfile.height
            ) || 0,

          goal:
            String(
              savedProfile.goal || ''
            )
        }
      }

    } catch (error) {

      console.error(
        'Gagal membaca profil:',
        error
      )

      showMessage(
        'Gagal membaca data profil.',
        'error'
      )
    }
  }

/* =========================
   SAVE PROFILE
========================= */

const save =
  async () => {

    message.value = ''

    const name =
      profile.value.name.trim()

    const age =
      Number(
        profile.value.age
      )

    const weight =
      Number(
        profile.value.weight
      )

    const height =
      Number(
        profile.value.height
      )

    if (!name) {

      showMessage(
        'Nama belum diisi.',
        'error'
      )

      return
    }

    if (
      age <= 0 ||
      age > 120
    ) {

      showMessage(
        'Usia harus diisi dengan benar.',
        'error'
      )

      return
    }

    if (
      weight <= 0
    ) {

      showMessage(
        'Berat badan harus diisi.',
        'error'
      )

      return
    }

    if (
      height <= 0
    ) {

      showMessage(
        'Tinggi badan harus diisi.',
        'error'
      )

      return
    }

    saving.value =
      true

    try {

      await saveProfile({
        id: 1,

        name,

        age,

        weight,

        height,

        goal:
          profile.value.goal || ''
      })

      profile.value = {
        id: 1,
        name,
        age,
        weight,
        height,
        goal:
          profile.value.goal || ''
      }

      showMessage(
        'Profil berhasil disimpan ✓',
        'success'
      )

    } catch (error) {

      console.error(
        'Gagal menyimpan profil:',
        error
      )

      showMessage(
        'Gagal menyimpan profil.',
        'error'
      )

    } finally {

      saving.value =
        false
    }
  }

/* =========================
   MESSAGE
========================= */

const showMessage =
  (
    text: string,
    type:
      'success' |
      'error'
  ) => {

    message.value =
      text

    messageType.value =
      type

    window.setTimeout(() => {

      message.value = ''

    }, 3000)
  }

/* =========================
   NAVIGATION
========================= */

const goHome =
  () => {

    router.push(
      '/home'
    )
  }

const goExercise =
  () => {

    router.push(
      '/exercise'
    )
  }

const goTarget =
  () => {

    router.push(
      '/target'
    )
  }

const goProfile =
  () => {

    router.push(
      '/profile'
    )
  }

/* =========================
   START
========================= */

onMounted(() => {

  loadProfile()

})

</script>

<style scoped>

.profile-content {
  --background: #fff8fb;
}

/* =========================
   HEADER
========================= */

.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:
    24px 18px 16px;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  border: none;
  border-radius: 50%;

  background: #ffe4ef;

  color: #e85d91;

  font-size: 30px;
  line-height: 1;
}

.header-title {
  font-size: 20px;
  font-weight: 800;
  color: #333;
}

.header-spacer {
  width: 42px;
}

/* =========================
   PROFILE HEADER
========================= */

.profile-header-card {
  display: flex;
  align-items: center;

  margin:
    0 16px 20px;

  padding: 20px;

  border-radius: 22px;

  background:
    linear-gradient(
      135deg,
      #ff8fb5,
      #f26f9c
    );

  color: white;

  box-shadow:
    0 8px 24px
    rgba(
      242,
      111,
      156,
      0.18
    );
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 68px;
  height: 68px;

  flex-shrink: 0;

  border-radius: 50%;

  background:
    rgba(
      255,
      255,
      255,
      0.95
    );

  font-size: 32px;
}

.profile-header-info {
  margin-left: 15px;
}

.profile-name {
  font-size: 19px;
  font-weight: 800;
}

.profile-subtitle {
  margin-top: 5px;

  font-size: 12px;

  opacity: 0.9;
}

/* =========================
   SECTION
========================= */

.section {
  margin:
    0 16px 20px;
}

.section-title {
  margin-bottom: 10px;

  font-size: 17px;
  font-weight: 800;

  color: #333;
}

/* =========================
   FORM
========================= */

.form-card {
  padding: 16px;

  border-radius: 20px;

  background: white;

  box-shadow:
    0 4px 16px
    rgba(
      0,
      0,
      0,
      0.04
    );
}

.form-group {
  margin-bottom: 15px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;

  margin-bottom: 7px;

  font-size: 12px;
  font-weight: 700;

  color: #555;
}

.input-wrapper {
  display: flex;
  align-items: center;

  min-height: 48px;

  padding:
    0 12px;

  border:
    1px solid #eee;

  border-radius: 14px;

  background: #fffafb;
}

.input-icon {
  width: 28px;

  font-size: 18px;
}

.input-wrapper input {
  flex: 1;

  width: 100%;

  border: none;
  outline: none;

  background: transparent;

  color: #333;

  font-size: 14px;
}

.input-wrapper input::placeholder {
  color: #aaa;
}

.input-unit {
  margin-left: 8px;

  font-size: 11px;

  color: #999;
}

/* =========================
   GOAL
========================= */

.goal-card {
  display: flex;
  flex-direction: column;

  gap: 10px;
}

.goal-option {
  display: flex;
  align-items: center;

  width: 100%;

  padding: 13px;

  border:
    1px solid #eee;

  border-radius: 17px;

  background: white;

  text-align: left;

  box-shadow:
    0 3px 12px
    rgba(
      0,
      0,
      0,
      0.03
    );
}

.goal-option.selected {
  border-color: #f5a2be;

  background: #fff5f8;
}

.goal-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 44px;
  height: 44px;

  flex-shrink: 0;

  border-radius: 13px;

  font-size: 21px;
}

.goal-icon.pink {
  background: #ffe1ea;
}

.goal-icon.orange {
  background: #fff0c9;
}

.goal-icon.green {
  background: #e3f7eb;
}

.goal-icon.purple {
  background: #e9e1ff;
}

.goal-info {
  flex: 1;

  margin-left: 11px;
}

.goal-title {
  font-size: 13px;
  font-weight: 800;

  color: #333;
}

.goal-description {
  margin-top: 3px;

  font-size: 10px;

  color: #888;
}

.goal-check {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 25px;
  height: 25px;

  border-radius: 50%;

  background: #e85d91;

  color: white;

  font-size: 13px;
  font-weight: 800;
}

/* =========================
   BMI
========================= */

.bmi-card {
  display: flex;
  align-items: center;

  padding: 16px;

  border-radius: 19px;

  background: white;

  box-shadow:
    0 4px 16px
    rgba(
      0,
      0,
      0,
      0.04
    );
}

.bmi-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;

  border-radius: 14px;

  background: #ffe7f0;

  font-size: 23px;
}

.bmi-info {
  margin-left: 12px;
}

.bmi-label {
  font-size: 11px;

  color: #888;
}

.bmi-value {
  margin-top: 2px;

  font-size: 23px;
  font-weight: 800;

  color: #333;
}

.bmi-status {
  margin-top: 2px;

  font-size: 11px;
  font-weight: 700;
}

.bmi-status.underweight {
  color: #d99000;
}

.bmi-status.normal {
  color: #35a866;
}

.bmi-status.overweight {
  color: #df8c27;
}

.bmi-status.obese {
  color: #d65a6b;
}

/* =========================
   SAVE
========================= */

.save-section {
  margin:
    4px 16px 20px;

  text-align: center;
}

.save-button {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;

  gap: 8px;

  padding: 14px;

  border: none;

  border-radius: 16px;

  background: #e85d91;

  color: white;

  font-size: 14px;
  font-weight: 800;

  box-shadow:
    0 6px 18px
    rgba(
      232,
      93,
      145,
      0.25
    );
}

.save-button:disabled {
  opacity: 0.65;
}

.message {
  margin-top: 10px;

  padding: 10px;

  border-radius: 12px;

  font-size: 11px;
  font-weight: 700;
}

.message.success {
  background: #eaf8ef;
  color: #39734b;
}

.message.error {
  background: #fff0f2;
  color: #b64c61;
}

/* =========================
   BOTTOM NAV
========================= */

.bottom-space {
  height: 92px;
}

.bottom-nav {
  position: fixed;

  right: 0;
  bottom: 0;
  left: 0;

  z-index: 20;

  display: flex;
  align-items: center;
  justify-content: space-around;

  padding:
    10px 10px
    calc(
      10px +
      env(
        safe-area-inset-bottom
      )
    );

  background:
    rgba(
      255,
      255,
      255,
      0.97
    );

  border-top:
    1px solid #eee;

  box-shadow:
    0 -5px 20px
    rgba(
      0,
      0,
      0,
      0.06
    );
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 4px;

  min-width: 58px;

  border: none;

  background: transparent;

  color: #999;

  font-size: 10px;
}

.nav-item.active {
  color: #e85d91;

  font-weight: 700;
}

.nav-icon {
  font-size: 20px;
}

.nav-add {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;

  margin-top: -25px;

  border:
    4px solid #fff8fb;

  border-radius: 50%;

  background: #e85d91;

  color: white;

  font-size: 28px;

  box-shadow:
    0 5px 15px
    rgba(
      232,
      93,
      145,
      0.35
    );
}

</style>