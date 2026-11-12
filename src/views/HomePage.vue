<template>
  <ion-page>
    <ion-content :fullscreen="true" class="home-content">

      <!-- HEADER -->
      <div class="top-header">
        <div>
          <div class="brand">Wellora</div>
          <div class="greeting">
            Halo, semoga harimu sehat 🌷
          </div>
        </div>

        <button
          class="profile-button"
          @click="goProfile"
        >
          <span>👤</span>
        </button>
      </div>

      <!-- TARGET MINGGUAN -->
      <section class="target-card">
        <div class="target-top">
          <div>
            <div class="small-label">
              Target minggu ini
            </div>

            <div class="target-number">
              {{ weeklyMinutes }}
              <span>
                / {{ weeklyTarget }} menit
              </span>
            </div>
          </div>

          <div class="progress-circle">
            {{ weeklyProgress }}%
          </div>
        </div>

        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{
              width: `${weeklyProgress}%`
            }"
          ></div>
        </div>

        <div class="target-bottom">
          <span>
            {{ remainingMinutes }} menit lagi
          </span>

          <span>
            {{ activeDays }} hari aktif
          </span>
        </div>
      </section>

      <!-- CUACA -->
      <section
        class="weather-card"
        @click="goWeather"
      >
        <div class="weather-icon">
          🌤️
        </div>

        <div class="weather-info">
          <div class="weather-title">
            Cuaca hari ini
          </div>

          <div class="weather-text">
            Cek kondisi cuaca untuk olahraga
          </div>
        </div>

        <div class="arrow">
          ›
        </div>
      </section>

      <!-- REKOMENDASI -->
      <section class="recommendation-card">
        <div class="recommendation-icon">
          💡
        </div>

        <div>
          <div class="section-label">
            Rekomendasi
          </div>

          <div class="recommendation-text">
            {{ recommendation }}
          </div>
        </div>
      </section>

      <!-- KATEGORI -->
      <section class="section">
        <div class="section-title-row">
          <h2>
            Kategori olahraga
          </h2>

          <button
            class="see-all"
            @click="goExercise"
          >
            Lihat semua
          </button>
        </div>

        <div class="category-grid">

          <button
            class="category-card"
            @click="goExercise"
          >
            <div
              class="category-icon cardio"
            >
              🏃
            </div>

            <div class="category-name">
              Cardio
            </div>

            <div class="category-desc">
              Jalan, lari, sepeda
            </div>
          </button>

          <button
            class="category-card"
            @click="goExercise"
          >
            <div
              class="category-icon strength"
            >
              💪
            </div>

            <div class="category-name">
              Strength
            </div>

            <div class="category-desc">
              Latihan kekuatan
            </div>
          </button>

          <button
            class="category-card"
            @click="goExercise"
          >
            <div
              class="category-icon yoga"
            >
              🧘
            </div>

            <div class="category-name">
              Yoga
            </div>

            <div class="category-desc">
              Relaksasi & fleksibilitas
            </div>
          </button>

          <button
            class="category-card"
            @click="goExercise"
          >
            <div
              class="category-icon other"
            >
              ✨
            </div>

            <div class="category-name">
              Lainnya
            </div>

            <div class="category-desc">
              Aktivitas lainnya
            </div>
          </button>

        </div>
      </section>

      <!-- AKTIVITAS HARI INI -->
      <section class="section">

        <div class="section-title-row">
          <h2>
            Aktivitas hari ini
          </h2>

          <button
            v-if="todayActivities.length > 0"
            class="see-all"
            @click="goStatistics"
          >
            Statistik
          </button>
        </div>

        <!-- BELUM ADA -->
        <div
          v-if="todayActivities.length === 0"
          class="empty-card"
        >
          <div class="empty-icon">
            🏃
          </div>

          <div class="empty-title">
            Belum ada aktivitas
          </div>

          <div class="empty-text">
            Yuk mulai olahraga hari ini!
          </div>

          <button
            class="primary-button"
            @click="goExercise"
          >
            Mulai olahraga
          </button>
        </div>

        <!-- ADA AKTIVITAS -->
        <div
          v-else
          class="activity-list"
        >
          <div
            v-for="activity in todayActivities"
            :key="activity.id"
            class="activity-item"
          >

            <div class="activity-icon">
              {{
                getActivityIcon(
                  activity.type,
                  activity.name
                )
              }}
            </div>

            <div class="activity-info">
              <div class="activity-name">
                {{ activity.name }}
              </div>

              <div class="activity-meta">
                {{ activity.duration }} menit
              </div>
            </div>

            <div class="activity-check">
              ✓
            </div>

          </div>
        </div>

      </section>

      <!-- TIPS SEHAT -->
      <section
        class="tip-card"
        @click="openHealthTips"
      >

        <div class="tip-icon">
          🥗
        </div>

        <div class="tip-content">

          <div class="tip-title">
            Tips sehat hari ini
          </div>

          <div class="tip-text">
            Jangan lupa minum air yang cukup
            dan berikan tubuh waktu untuk
            beristirahat.
          </div>

          <div class="tip-click">
            Ketuk untuk melihat tips →
          </div>

        </div>

      </section>

      <!-- AI ASSISTANT -->
      <section class="ai-card">

        <div class="ai-left">

          <div class="ai-icon">
            🤖
          </div>

          <div>

            <div class="ai-title">
              Wellora AI Assistant
            </div>

            <div class="ai-text">
              Tanya seputar olahraga, target,
              dan kesehatan.
            </div>

          </div>

        </div>

        <button
          class="ai-button"
          @click="openAiAssistant"
        >
          Tanya AI
        </button>

      </section>

      <!-- QUICK MENU OVERLAY -->
      <div
        v-if="showQuickMenu"
        class="quick-overlay"
        @click="closeQuickMenu"
      ></div>

      <!-- QUICK MENU -->
      <div
        v-if="showQuickMenu"
        class="quick-menu"
      >

        <div class="quick-title">
          Menu cepat
        </div>

        <button
          class="quick-item"
          @click="goStatistics"
        >
          <span class="quick-item-icon">
            📊
          </span>

          <span>
            <strong>
              Statistik
            </strong>

            <small>
              Lihat perkembangan olahraga
            </small>
          </span>
        </button>

        <button
          class="quick-item"
          @click="goWeather"
        >
          <span class="quick-item-icon">
            🌤️
          </span>

          <span>
            <strong>
              Cuaca
            </strong>

            <small>
              Cek kondisi cuaca
            </small>
          </span>
        </button>

        <button
          class="quick-item"
          @click="openAiAssistant"
        >
          <span class="quick-item-icon">
            🤖
          </span>

          <span>
            <strong>
              AI Assistant
            </strong>

            <small>
              Tanya Wellora AI
            </small>
          </span>
        </button>

      </div>

      <!-- POPUP TIPS SEHAT -->
      <div
        v-if="showHealthTips"
        class="health-overlay"
        @click="closeHealthTips"
      ></div>

      <div
        v-if="showHealthTips"
        class="health-modal"
      >

        <div class="health-modal-header">

          <div>

            <div class="health-modal-title">
              🥗 Tips Sehat
            </div>

            <div class="health-modal-subtitle">
              Kebiasaan kecil untuk tubuh
              yang lebih sehat
            </div>

          </div>

          <button
            class="close-button"
            @click="closeHealthTips"
          >
            ×
          </button>

        </div>

        <div class="health-tip-list">

          <div class="health-tip-item">

            <div class="health-tip-icon">
              💧
            </div>

            <div>

              <strong>
                Minum air cukup
              </strong>

              <p>
                Pastikan tubuh tetap
                terhidrasi, terutama setelah
                berolahraga.
              </p>

            </div>

          </div>

          <div class="health-tip-item">

            <div class="health-tip-icon">
              🥗
            </div>

            <div>

              <strong>
                Pilih makanan bergizi
              </strong>

              <p>
                Usahakan makanan sehari-hari
                memiliki variasi nutrisi
                yang baik.
              </p>

            </div>

          </div>

          <div class="health-tip-item">

            <div class="health-tip-icon">
              😴
            </div>

            <div>

              <strong>
                Istirahat cukup
              </strong>

              <p>
                Berikan tubuh waktu untuk
                pulih setelah melakukan
                aktivitas.
              </p>

            </div>

          </div>

          <div class="health-tip-item">

            <div class="health-tip-icon">
              🏃
            </div>

            <div>

              <strong>
                Tetap aktif
              </strong>

              <p>
                Usahakan tetap bergerak dan
                kurangi terlalu lama duduk.
              </p>

            </div>

          </div>

          <div class="health-tip-item">

            <div class="health-tip-icon">
              🧘
            </div>

            <div>

              <strong>
                Lakukan stretching
              </strong>

              <p>
                Peregangan ringan dapat menjadi
                bagian dari rutinitas sebelum
                atau setelah aktivitas.
              </p>

            </div>

          </div>

        </div>

        <button
          class="health-close-button"
          @click="closeHealthTips"
        >
          Mengerti
        </button>

      </div>

      <!-- BOTTOM SPACE -->
      <div class="bottom-space"></div>

      <!-- BOTTOM NAV -->
      <nav class="bottom-nav">

        <button
          class="nav-item active"
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
          @click="toggleQuickMenu"
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
          class="nav-item"
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
  getWorkouts,
  getTargets,
  type Target as DatabaseTarget,
  type Workout
} from '../database/database'

const router = useRouter()

/* =====================================================
   TYPE UNTUK HOME
===================================================== */

interface Activity {
  id: number
  name: string
  type: string
  duration: number
  date: string
}

interface HomeTargets {
  weeklyMinutes: number
  targetDays: number
  cardio: number
  strength: number
  yoga: number
}

/*
 * PENTING:
 *
 * Database Target sebenarnya:
 *
 * id
 * name
 * minutes
 * progress
 * icon
 *
 * Jadi JANGAN pakai:
 *
 * value
 *
 * seperti kode sebelumnya.
 */

/* =====================================================
   DATA
===================================================== */

const activities =
  ref<Activity[]>([])

const targets =
  ref<HomeTargets>({
    weeklyMinutes: 150,
    targetDays: 5,
    cardio: 60,
    strength: 40,
    yoga: 30
  })

const showQuickMenu =
  ref(false)

const showHealthTips =
  ref(false)

/* =====================================================
   LOAD DATA
===================================================== */

const loadData = async () => {

  /* ===================================================
     LOAD WORKOUT
  =================================================== */

  try {

    const savedActivities =
      await getWorkouts()

    if (
      Array.isArray(savedActivities)
    ) {

      activities.value =
        savedActivities.map(
          (
            activity: Workout
          ): Activity => ({
            id: Number(
              activity.id ?? 0
            ),

            name: String(
              activity.name ?? ''
            ),

            type: String(
              activity.type ?? ''
            ),

            duration: Number(
              activity.duration ?? 0
            ),

            date: String(
              activity.date ?? ''
            )
          })
        )

    } else {

      activities.value = []

    }

  } catch (error) {

    console.error(
      'Gagal membaca aktivitas dari IndexedDB:',
      error
    )

    activities.value = []

  }

  /* ===================================================
     LOAD TARGET
  =================================================== */

  try {

    const savedTargets =
      await getTargets()

    if (
      Array.isArray(savedTargets)
    ) {

      /*
       * savedTargets SUDAH bertipe Target[]
       * dari database.ts.
       *
       * Target:
       * id
       * name
       * minutes
       * progress
       * icon
       */

      const databaseTargets:
        DatabaseTarget[] =
        savedTargets

      databaseTargets.forEach(
        (target) => {

          const minutes =
            Number(
              target.minutes ?? 0
            )

          switch (
            target.name
          ) {

            case 'weeklyMinutes':

              targets.value.weeklyMinutes =
                minutes

              break

            case 'targetDays':

              targets.value.targetDays =
                minutes

              break

            case 'cardio':

              targets.value.cardio =
                minutes

              break

            case 'strength':

              targets.value.strength =
                minutes

              break

            case 'yoga':

              targets.value.yoga =
                minutes

              break
          }

        }
      )

    }

  } catch (error) {

    console.error(
      'Gagal membaca target dari IndexedDB:',
      error
    )

  }

}

/* =====================================================
   DATE
===================================================== */

const getDateKey = (
  date: Date
): string => {

  const year =
    date.getFullYear()

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, '0')

  const day =
    String(
      date.getDate()
    ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/* =====================================================
   AWAL MINGGU
===================================================== */

const getStartOfWeek = (): Date => {

  const date =
    new Date()

  const day =
    date.getDay()

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

/* =====================================================
   AKTIVITAS MINGGU INI
===================================================== */

const weeklyActivities =
  computed(() => {

    const start =
      getStartOfWeek()

    return activities.value.filter(
      (activity) => {

        const activityDate =
          new Date(
            activity.date
          )

        if (
          isNaN(
            activityDate.getTime()
          )
        ) {

          return false

        }

        return (
          activityDate >= start
        )

      }
    )

  })

/* =====================================================
   MENIT MINGGU INI
===================================================== */

const weeklyMinutes =
  computed(() => {

    return weeklyActivities.value.reduce(
      (
        total,
        activity
      ) => {

        return (
          total +
          Number(
            activity.duration || 0
          )
        )

      },
      0
    )

  })

/* =====================================================
   TARGET MINGGUAN
===================================================== */

const weeklyTarget =
  computed(() => {

    const value =
      Number(
        targets.value.weeklyMinutes
      )

    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {

      return 150

    }

    return value

  })

/* =====================================================
   PROGRESS
===================================================== */

const weeklyProgress =
  computed(() => {

    if (
      weeklyTarget.value <= 0
    ) {

      return 0

    }

    return Math.min(
      100,
      Math.round(
        (
          weeklyMinutes.value /
          weeklyTarget.value
        ) * 100
      )
    )

  })

/* =====================================================
   SISA MENIT
===================================================== */

const remainingMinutes =
  computed(() => {

    return Math.max(
      0,
      weeklyTarget.value -
      weeklyMinutes.value
    )

  })

/* =====================================================
   HARI AKTIF
===================================================== */

const activeDays =
  computed(() => {

    const days =
      new Set<string>()

    weeklyActivities.value.forEach(
      (activity) => {

        const date =
          new Date(
            activity.date
          )

        if (
          !isNaN(
            date.getTime()
          )
        ) {

          days.add(
            getDateKey(date)
          )

        }

      }
    )

    return days.size

  })

/* =====================================================
   AKTIVITAS HARI INI
===================================================== */

const todayActivities =
  computed(() => {

    const today =
      getDateKey(
        new Date()
      )

    return activities.value
      .filter(
        (activity) => {

          const date =
            new Date(
              activity.date
            )

          if (
            isNaN(
              date.getTime()
            )
          ) {

            return false

          }

          return (
            getDateKey(date) ===
            today
          )

        }
      )
      .sort(
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

/* =====================================================
   REKOMENDASI
===================================================== */

const recommendation =
  computed(() => {

    if (
      weeklyMinutes.value === 0
    ) {

      return (
        'Yuk mulai dengan olahraga ringan selama 20–30 menit hari ini.'
      )

    }

    if (
      weeklyProgress.value >= 100
    ) {

      return (
        'Target mingguanmu sudah tercapai. Pertahankan kebiasaan sehatmu!'
      )

    }

    if (
      remainingMinutes.value <= 30
    ) {

      return (
        `Sedikit lagi! Tinggal ${remainingMinutes.value} menit untuk mencapai target mingguan.`
      )

    }

    if (
      todayActivities.value.length > 0
    ) {

      return (
        'Bagus! Kamu sudah aktif hari ini. Jangan lupa cukup minum dan istirahat.'
      )

    }

    return (
      'Kamu sudah mulai minggu ini. Yuk lanjutkan dengan olahraga ringan hari ini.'
    )

  })

/* =====================================================
   ICON AKTIVITAS
===================================================== */

const getActivityIcon = (
  type: string,
  name: string
): string => {

  const text =
    `${type} ${name}`.toLowerCase()

  if (
    text.includes('lari') ||
    text.includes('jalan') ||
    text.includes('run') ||
    text.includes('walk')
  ) {

    return '🏃'

  }

  if (
    text.includes('sepeda') ||
    text.includes('cycling') ||
    text.includes('bike')
  ) {

    return '🚴'

  }

  if (
    text.includes('yoga') ||
    text.includes('stretch')
  ) {

    return '🧘'

  }

  if (
    text.includes('strength') ||
    text.includes('angkat') ||
    text.includes('gym') ||
    text.includes('weight')
  ) {

    return '💪'

  }

  if (
    text.includes('renang') ||
    text.includes('swim')
  ) {

    return '🏊'

  }

  return '🏋️'
}

/* =====================================================
   NAVIGATION
===================================================== */

const goHome = () => {

  closeQuickMenu()

  router.push('/home')

}

const goExercise = () => {

  closeQuickMenu()

  router.push('/exercise')

}

const goTarget = () => {

  closeQuickMenu()

  router.push('/target')

}

const goStatistics = () => {

  closeQuickMenu()

  router.push('/statistics')

}

const goWeather = () => {

  closeQuickMenu()

  router.push('/weather')

}

const goProfile = () => {

  closeQuickMenu()

  router.push('/profile')

}

/* =====================================================
   AI ASSISTANT
===================================================== */

const openAiAssistant = () => {

  closeQuickMenu()

  router.push(
    '/ai-assistant'
  )

}

/* =====================================================
   QUICK MENU
===================================================== */

const toggleQuickMenu = () => {

  showQuickMenu.value =
    !showQuickMenu.value

}

const closeQuickMenu = () => {

  showQuickMenu.value =
    false

}

/* =====================================================
   HEALTH TIPS
===================================================== */

const openHealthTips = () => {

  showHealthTips.value =
    true

}

const closeHealthTips = () => {

  showHealthTips.value =
    false

}

/* =====================================================
   START
===================================================== */

onMounted(async () => {

  await loadData()

})

</script>

<style scoped>

.home-content {
  --background: #fff8fb;
}

/* HEADER */

.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 20px 18px;
}

.brand {
  font-size: 28px;
  font-weight: 800;
  color: #e85d91;
}

.greeting {
  margin-top: 4px;
  font-size: 13px;
  color: #777;
}

.profile-button {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: #ffe4ef;
  font-size: 20px;
}

/* TARGET */

.target-card {
  margin: 0 16px 14px;
  padding: 20px;
  border-radius: 22px;
  background: linear-gradient(
    135deg,
    #ff8fb5,
    #f26f9c
  );
  color: white;
  box-shadow:
    0 8px 24px
    rgba(242, 111, 156, 0.18);
}

.target-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.small-label {
  font-size: 13px;
  opacity: 0.9;
}

.target-number {
  margin-top: 6px;
  font-size: 28px;
  font-weight: 800;
}

.target-number span {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
}

.progress-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border: 3px solid
    rgba(255,255,255,0.7);
  border-radius: 50%;
  font-size: 14px;
  font-weight: 800;
}

.progress-track {
  height: 9px;
  margin-top: 18px;
  overflow: hidden;
  border-radius: 10px;
  background:
    rgba(255,255,255,0.3);
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  background: white;
  transition:
    width 0.3s ease;
}

.target-bottom {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  opacity: 0.9;
}

/* WEATHER */

.weather-card {
  display: flex;
  align-items: center;
  margin: 0 16px 14px;
  padding: 16px;
  border-radius: 18px;
  background: #fff;
  box-shadow:
    0 4px 18px
    rgba(0,0,0,0.05);
}

.weather-icon {
  font-size: 32px;
}

.weather-info {
  flex: 1;
  margin-left: 12px;
}

.weather-title {
  font-size: 15px;
  font-weight: 700;
  color: #333;
}

.weather-text {
  margin-top: 3px;
  font-size: 12px;
  color: #888;
}

.arrow {
  font-size: 28px;
  color: #aaa;
}

/* RECOMMENDATION */

.recommendation-card {
  display: flex;
  gap: 12px;
  margin: 0 16px 20px;
  padding: 16px;
  border-radius: 18px;
  background: #fff7d6;
}

.recommendation-icon {
  font-size: 25px;
}

.section-label {
  font-size: 12px;
  font-weight: 700;
  color: #9a7a00;
}

.recommendation-text {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.45;
  color: #665500;
}

/* SECTION */

.section {
  margin: 0 16px 22px;
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title-row h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.see-all {
  border: none;
  background: transparent;
  color: #e85d91;
  font-size: 12px;
  font-weight: 700;
}

/* CATEGORY */

.category-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
}

.category-card {
  border: none;
  text-align: left;
  padding: 15px;
  border-radius: 18px;
  background: white;
  box-shadow:
    0 4px 16px
    rgba(0,0,0,0.04);
}

.category-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  margin-bottom: 10px;
  border-radius: 14px;
  font-size: 22px;
}

.category-icon.cardio {
  background: #ffe1ea;
}

.category-icon.strength {
  background: #fff0c9;
}

.category-icon.yoga {
  background: #e8e0ff;
}

.category-icon.other {
  background: #dff7ed;
}

.category-name {
  font-size: 14px;
  font-weight: 800;
  color: #333;
}

.category-desc {
  margin-top: 3px;
  font-size: 11px;
  color: #888;
}

/* ACTIVITY */

.empty-card {
  margin-top: 12px;
  padding: 25px 18px;
  text-align: center;
  border-radius: 18px;
  background: white;
  box-shadow:
    0 4px 16px
    rgba(0,0,0,0.04);
}

.empty-icon {
  font-size: 40px;
}

.empty-title {
  margin-top: 8px;
  font-weight: 800;
  color: #333;
}

.empty-text {
  margin-top: 4px;
  font-size: 12px;
  color: #888;
}

.primary-button {
  margin-top: 15px;
  padding: 11px 18px;
  border: none;
  border-radius: 14px;
  background: #e85d91;
  color: white;
  font-weight: 700;
}

.activity-list {
  margin-top: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  padding: 13px;
  border-radius: 16px;
  background: white;
  box-shadow:
    0 4px 14px
    rgba(0,0,0,0.04);
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 13px;
  background: #ffe5ef;
  font-size: 21px;
}

.activity-info {
  flex: 1;
}

.activity-name {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}

.activity-meta {
  margin-top: 3px;
  font-size: 12px;
  color: #888;
}

.activity-check {
  color: #e85d91;
  font-weight: 800;
}

/* TIPS SEHAT */

.tip-card {
  display: flex;
  gap: 12px;
  margin: 0 16px 16px;
  padding: 16px;
  border-radius: 18px;
  background: #eaf8ef;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.tip-card:active {
  transform: scale(0.98);
  box-shadow:
    0 5px 15px
    rgba(0,0,0,0.08);
}

.tip-icon {
  font-size: 26px;
}

.tip-content {
  flex: 1;
}

.tip-title {
  font-size: 14px;
  font-weight: 800;
  color: #34553d;
}

.tip-text {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.45;
  color: #55715c;
}

.tip-click {
  margin-top: 7px;
  font-size: 10px;
  font-weight: 700;
  color: #e85d91;
}

/* AI */

.ai-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0 16px 20px;
  padding: 16px;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    #f4e9ff,
    #fff0f6
  );
  box-shadow:
    0 5px 18px
    rgba(0,0,0,0.04);
}

.ai-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: white;
  font-size: 23px;
}

.ai-title {
  font-size: 14px;
  font-weight: 800;
  color: #453653;
}

.ai-text {
  max-width: 190px;
  margin-top: 4px;
  font-size: 11px;
  line-height: 1.4;
  color: #76657f;
}

.ai-button {
  flex-shrink: 0;
  padding: 10px 13px;
  border: none;
  border-radius: 13px;
  background: #e85d91;
  color: white;
  font-size: 11px;
  font-weight: 700;
}

/* QUICK MENU */

.quick-overlay {
  position: fixed;
  inset: 0;
  z-index: 30;
  background:
    rgba(0,0,0,0.3);
}

.quick-menu {
  position: fixed;
  right: 16px;
  bottom: 84px;
  left: 16px;
  z-index: 31;
  padding: 16px;
  border-radius: 22px;
  background: white;
  box-shadow:
    0 12px 40px
    rgba(0,0,0,0.18);
}

.quick-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 800;
  color: #333;
}

.quick-item {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
  padding: 13px 4px;
  border: none;
  border-bottom: 1px solid #f1f1f1;
  background: transparent;
  text-align: left;
}

.quick-item:last-child {
  border-bottom: none;
}

.quick-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 13px;
  background: #fff0f5;
  font-size: 21px;
}

.quick-item span:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.quick-item strong {
  font-size: 14px;
  color: #333;
}

.quick-item small {
  font-size: 11px;
  color: #888;
}

/* HEALTH MODAL */

.health-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background:
    rgba(0,0,0,0.4);
}

.health-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 41;
  width: calc(100% - 32px);
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  transform: translate(
    -50%,
    -50%
  );
  padding: 20px;
  border-radius: 24px;
  background: white;
  box-shadow:
    0 18px 50px
    rgba(0,0,0,0.2);
}

.health-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 16px;
}

.health-modal-title {
  font-size: 20px;
  font-weight: 800;
  color: #333;
}

.health-modal-subtitle {
  margin-top: 4px;
  font-size: 11px;
  line-height: 1.4;
  color: #888;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border: none;
  border-radius: 50%;
  background: #f7f1f4;
  color: #666;
  font-size: 24px;
  line-height: 1;
}

.health-tip-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.health-tip-item {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 12px;
  border-radius: 16px;
  background: #f8fcf9;
}

.health-tip-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #eaf8ef;
  font-size: 20px;
}

.health-tip-item strong {
  display: block;
  font-size: 13px;
  color: #34553d;
}

.health-tip-item p {
  margin: 4px 0 0;
  font-size: 11px;
  line-height: 1.45;
  color: #66756b;
}

.health-close-button {
  width: 100%;
  margin-top: 16px;
  padding: 13px;
  border: none;
  border-radius: 15px;
  background: #e85d91;
  color: white;
  font-size: 13px;
  font-weight: 700;
}

/* BOTTOM NAV */

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
      env(safe-area-inset-bottom)
    );
  background:
    rgba(255,255,255,0.97);
  border-top: 1px solid #eee;
  box-shadow:
    0 -5px 20px
    rgba(0,0,0,0.06);
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
  border: 4px solid #fff8fb;
  border-radius: 50%;
  background: #e85d91;
  color: white;
  font-size: 28px;
  box-shadow:
    0 5px 15px
    rgba(232,93,145,0.35);
}

</style>