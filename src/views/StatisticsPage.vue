<template>
  <ion-page>
    <ion-content class="page">

      <!-- HEADER -->
      <div class="header">
        <button @click="goBack">←</button>

        <div>
          <p>Wellora</p>
          <h1>Statistik 📊</h1>
        </div>
      </div>

      <!-- SUMMARY -->
      <div class="summary">
        <p>Total Olahraga Minggu Ini</p>
        <h2>{{ weeklyMinutes }} Menit</h2>

        <span>
          {{ weeklyActivities.length }} sesi minggu ini
          {{ weeklyActivities.length > 0 ? '🎉' : '' }}
        </span>
      </div>

      <!-- PROGRESS MINGGUAN -->
      <h2 class="title">Progress Mingguan</h2>

      <div class="card">

        <div class="chart">

          <div
            v-for="day in weekDays"
            :key="day.date"
            class="bar-wrapper"
          >
            <div class="bar-area">
              <div
                class="bar"
                :class="{ today: day.isToday }"
                :style="{ height: `${day.barHeight}%` }"
              ></div>
            </div>
          </div>

        </div>

        <div class="days">
          <span
            v-for="day in weekDays"
            :key="day.date"
          >
            {{ day.label }}
          </span>
        </div>

        <p class="minutes">
          {{ weeklyMinutes }} / {{ weeklyTarget }} menit olahraga
        </p>

        <div class="progress-bg">
          <div
            class="progress-fill"
            :style="{ width: `${weeklyProgress}%` }"
          ></div>
        </div>

        <p class="progress-text">
          {{ weeklyProgress }}% dari target mingguan
        </p>

      </div>

      <!-- RINGKASAN -->
      <h2 class="title">Ringkasan</h2>

      <div class="grid">

        <div class="stat">
          <h2>{{ weeklyMinutes }}</h2>
          <p>Total Menit</p>
        </div>

        <div class="stat">
          <h2>{{ weeklyActivities.length }}</h2>
          <p>Sesi</p>
        </div>

        <div class="stat">
          <h2>{{ activeDays }}</h2>
          <p>Hari Aktif</p>
        </div>

        <div class="stat">
          <h2>{{ totalAllActivities }}</h2>
          <p>Total Semua Sesi</p>
        </div>

      </div>

      <!-- JENIS OLAHRAGA -->
      <h2 class="title">Jenis Olahraga</h2>

      <div class="type-list">

        <div class="type-card">
          <div class="type-icon">🏃</div>

          <div class="type-info">
            <h3>Cardio</h3>
            <p>{{ categoryMinutes.cardio }} menit</p>

            <div class="small-progress-bg">
              <div
                class="small-progress"
                :style="{ width: `${categoryProgress.cardio}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div class="type-card">
          <div class="type-icon">🏋️</div>

          <div class="type-info">
            <h3>Strength</h3>
            <p>{{ categoryMinutes.strength }} menit</p>

            <div class="small-progress-bg">
              <div
                class="small-progress"
                :style="{ width: `${categoryProgress.strength}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div class="type-card">
          <div class="type-icon">🧘</div>

          <div class="type-info">
            <h3>Yoga</h3>
            <p>{{ categoryMinutes.yoga }} menit</p>

            <div class="small-progress-bg">
              <div
                class="small-progress"
                :style="{ width: `${categoryProgress.yoga}%` }"
              ></div>
            </div>
          </div>
        </div>

      </div>

      <!-- OLAHRAGA FAVORIT -->
      <div
        v-if="favoriteActivity"
        class="favorite"
      >
        <div class="favorite-icon">
          🏃‍♀️
        </div>

        <div>
          <h3>Olahraga Favorit</h3>

          <p>
            {{ favoriteActivity.name }}
            • {{ favoriteActivity.count }} sesi
          </p>
        </div>
      </div>

      <!-- RIWAYAT -->
      <h2 class="title">Aktivitas Minggu Ini</h2>

      <div
        v-if="weeklyActivities.length > 0"
        class="history"
      >

        <div
          v-for="activity in weeklyActivities"
          :key="activity.id"
          class="history-item"
        >

          <div class="history-icon">
            {{ getActivityIcon(activity.type, activity.name) }}
          </div>

          <div class="history-info">
            <h3>{{ activity.name }}</h3>

            <p>
              {{ formatType(activity.type) }}
              • {{ formatDate(activity.date) }}
            </p>
          </div>

          <strong>
            {{ activity.duration }} mnt
          </strong>

        </div>

      </div>

      <div
        v-else
        class="empty"
      >
        <div>📊</div>

        <h3>Belum ada aktivitas</h3>

        <p>
          Mulai olahraga dari halaman Exercise
          untuk melihat statistik kamu.
        </p>
      </div>

      <!-- MOTIVATION -->
      <div class="motivation">

        <div class="motivation-icon">
          🌟
        </div>

        <div>
          <h3>{{ motivationTitle }}</h3>

          <p>
            {{ motivationText }}
          </p>
        </div>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import {
  IonPage,
  IonContent,
  onIonViewWillEnter
} from '@ionic/vue'

import {
  computed,
  ref
} from 'vue'

import {
  useRouter
} from 'vue-router'


const router = useRouter()


/* =========================
   TYPE DATA
========================= */

interface WorkoutActivity {
  id: number
  name: string
  type: string
  duration: number
  date: string
}

interface Targets {
  weeklyMinutes: number
  targetDays: number
  cardio: number
  strength: number
  yoga: number
}


/* =========================
   DATA
========================= */

const activities = ref<WorkoutActivity[]>([])

const targets = ref<Targets>({
  weeklyMinutes: 150,
  targetDays: 5,
  cardio: 60,
  strength: 40,
  yoga: 30
})


/* =========================
   LOAD DATA
========================= */

const loadData = () => {

  try {

    const savedActivities =
      localStorage.getItem(
        'wellora_workout_history'
      )

    if (savedActivities) {

      activities.value =
        JSON.parse(savedActivities)

    } else {

      activities.value = []

    }

  } catch (error) {

    console.error(
      'Gagal membaca riwayat olahraga:',
      error
    )

    activities.value = []

  }


  try {

    const savedTargets =
      localStorage.getItem(
        'wellora_targets'
      )

    if (savedTargets) {

      targets.value = {
        ...targets.value,
        ...JSON.parse(savedTargets)
      }

    }

  } catch (error) {

    console.error(
      'Gagal membaca target:',
      error
    )

  }

}


onIonViewWillEnter(() => {
  loadData()
})


/* =========================
   DATE HELPER
========================= */

const getDateOnly = (
  dateString: string
) => {

  return new Date(
    `${dateString}T00:00:00`
  )

}


/* =========================
   CURRENT WEEK
========================= */

const getMonday = (
  date = new Date()
) => {

  const result = new Date(date)

  result.setHours(
    0,
    0,
    0,
    0
  )

  const day = result.getDay()

  const difference =
    day === 0
      ? -6
      : 1 - day

  result.setDate(
    result.getDate() + difference
  )

  return result

}


const formatStorageDate = (
  date: Date
) => {

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


/* =========================
   WEEK ACTIVITIES
========================= */

const weekStart = computed(() => {
  return getMonday()
})


const weekEnd = computed(() => {

  const date =
    new Date(
      weekStart.value
    )

  date.setDate(
    date.getDate() + 6
  )

  return date

})


const weeklyActivities =
  computed(() => {

    return activities.value
      .filter(activity => {

        const date =
          getDateOnly(
            activity.date
          )

        return (
          date >= weekStart.value &&
          date <= weekEnd.value
        )

      })
      .sort(
        (a, b) =>
          getDateOnly(b.date).getTime() -
          getDateOnly(a.date).getTime()
      )

  })


/* =========================
   WEEKLY MINUTES
========================= */

const weeklyMinutes =
  computed(() => {

    return weeklyActivities.value
      .reduce(
        (
          total,
          activity
        ) =>
          total +
          Number(
            activity.duration
          ),
        0
      )

  })


/* =========================
   WEEKLY TARGET
========================= */

const weeklyTarget =
  computed(() => {

    return Number(
      targets.value.weeklyMinutes
    ) || 150

  })


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


/* =========================
   ACTIVE DAYS
========================= */

const activeDays =
  computed(() => {

    const days =
      new Set(
        weeklyActivities.value.map(
          activity =>
            activity.date
        )
      )

    return days.size

  })


/* =========================
   TOTAL ACTIVITIES
========================= */

const totalAllActivities =
  computed(() => {

    return activities.value.length

  })


/* =========================
   WEEK CHART
========================= */

const dayNames = [
  'Sen',
  'Sel',
  'Rab',
  'Kam',
  'Jum',
  'Sab',
  'Min'
]


const weekDays =
  computed(() => {

    const maxMinutes =
      Math.max(
        ...Array.from(
          { length: 7 },
          (_, index) => {

            const date =
              new Date(
                weekStart.value
              )

            date.setDate(
              date.getDate() + index
            )

            const dateString =
              formatStorageDate(date)

            return weeklyActivities.value
              .filter(
                activity =>
                  activity.date ===
                  dateString
              )
              .reduce(
                (
                  total,
                  activity
                ) =>
                  total +
                  Number(
                    activity.duration
                  ),
                0
              )

          }
        ),
        1
      )


    const today =
      formatStorageDate(
        new Date()
      )


    return Array.from(
      { length: 7 },
      (_, index) => {

        const date =
          new Date(
            weekStart.value
          )

        date.setDate(
          date.getDate() + index
        )

        const dateString =
          formatStorageDate(date)


        const minutes =
          weeklyActivities.value
            .filter(
              activity =>
                activity.date ===
                dateString
            )
            .reduce(
              (
                total,
                activity
              ) =>
                total +
                Number(
                  activity.duration
                ),
              0
            )


        let barHeight = 4

        if (minutes > 0) {

          barHeight =
            Math.max(
              10,
              Math.round(
                (
                  minutes /
                  maxMinutes
                ) * 100
              )
            )

        }


        return {
          date: dateString,
          label: dayNames[index],
          minutes,
          barHeight,
          isToday:
            dateString === today
        }

      }
    )

  })


/* =========================
   CATEGORY
========================= */

const getCategory =
  (
    type: string,
    name: string
  ) => {

    const value =
      `${type} ${name}`
        .toLowerCase()


    if (
      value.includes('yoga')
    ) {
      return 'yoga'
    }


    if (
      value.includes('strength') ||
      value.includes('strength training') ||
      value.includes('beban') ||
      value.includes('weight') ||
      value.includes('barbell') ||
      value.includes('dumbbell') ||
      value.includes('squat') ||
      value.includes('push up') ||
      value.includes('pushup')
    ) {
      return 'strength'
    }


    if (
      value.includes('cardio') ||
      value.includes('lari') ||
      value.includes('running') ||
      value.includes('run') ||
      value.includes('jog') ||
      value.includes('jalan') ||
      value.includes('walking') ||
      value.includes('walk') ||
      value.includes('sepeda') ||
      value.includes('cycling') ||
      value.includes('bike')
    ) {
      return 'cardio'
    }


    return 'other'

  }


const categoryMinutes =
  computed(() => {

    const result = {
      cardio: 0,
      strength: 0,
      yoga: 0
    }


    weeklyActivities.value
      .forEach(activity => {

        const category =
          getCategory(
            activity.type,
            activity.name
          )

        if (
          category === 'cardio'
        ) {

          result.cardio +=
            Number(
              activity.duration
            )

        }

        if (
          category === 'strength'
        ) {

          result.strength +=
            Number(
              activity.duration
            )

        }

        if (
          category === 'yoga'
        ) {

          result.yoga +=
            Number(
              activity.duration
            )

        }

      })


    return result

  })


/* =========================
   CATEGORY PROGRESS
========================= */

const categoryProgress =
  computed(() => {

    const cardioTarget =
      Number(
        targets.value.cardio
      ) || 60

    const strengthTarget =
      Number(
        targets.value.strength
      ) || 40

    const yogaTarget =
      Number(
        targets.value.yoga
      ) || 30


    return {

      cardio:
        Math.min(
          100,
          Math.round(
            (
              categoryMinutes.value.cardio /
              cardioTarget
            ) * 100
          )
        ),

      strength:
        Math.min(
          100,
          Math.round(
            (
              categoryMinutes.value.strength /
              strengthTarget
            ) * 100
          )
        ),

      yoga:
        Math.min(
          100,
          Math.round(
            (
              categoryMinutes.value.yoga /
              yogaTarget
            ) * 100
          )
        )

    }

  })


/* =========================
   FAVORITE ACTIVITY
========================= */

const favoriteActivity =
  computed(() => {

    if (
      weeklyActivities.value.length === 0
    ) {
      return null
    }


    const counts:
      Record<
        string,
        number
      > = {}


    weeklyActivities.value
      .forEach(activity => {

        const name =
          activity.name ||
          'Olahraga'

        counts[name] =
          (counts[name] || 0) + 1

      })


    let favoriteName = ''
    let favoriteCount = 0


    Object.entries(
      counts
    ).forEach(
      ([name, count]) => {

        if (
          count >
          favoriteCount
        ) {

          favoriteName =
            name

          favoriteCount =
            count

        }

      }
    )


    return {
      name: favoriteName,
      count: favoriteCount
    }

  })


/* =========================
   ACTIVITY ICON
========================= */

const getActivityIcon =
  (
    type: string,
    name: string
  ) => {

    const category =
      getCategory(
        type,
        name
      )


    if (
      category === 'yoga'
    ) {
      return '🧘'
    }


    if (
      category === 'strength'
    ) {
      return '🏋️'
    }


    if (
      category === 'cardio'
    ) {
      return '🏃'
    }


    return '🏃‍♀️'

  }


/* =========================
   FORMAT TYPE
========================= */

const formatType =
  (type: string) => {

    if (!type) {
      return 'Olahraga'
    }


    const value =
      type.toLowerCase()


    if (
      value.includes('cardio')
    ) {
      return 'Cardio'
    }


    if (
      value.includes('strength')
    ) {
      return 'Strength'
    }


    if (
      value.includes('yoga')
    ) {
      return 'Yoga'
    }


    return type

  }


/* =========================
   FORMAT DATE
========================= */

const formatDate =
  (date: string) => {

    const value =
      getDateOnly(date)


    return value.toLocaleDateString(
      'id-ID',
      {
        day: 'numeric',
        month: 'short'
      }
    )

  }


/* =========================
   MOTIVATION
========================= */

const motivationTitle =
  computed(() => {

    if (
      weeklyMinutes.value === 0
    ) {
      return 'Ayo Mulai Bergerak!'
    }


    if (
      weeklyProgress.value >= 100
    ) {
      return 'Target Tercapai! 🎉'
    }


    if (
      weeklyProgress.value >= 70
    ) {
      return 'Sedikit Lagi! 💪'
    }


    return 'Tetap Semangat! 🌟'

  })


const motivationText =
  computed(() => {

    if (
      weeklyMinutes.value === 0
    ) {
      return 'Mulai dengan olahraga ringan hari ini.'
    }


    if (
      weeklyProgress.value >= 100
    ) {
      return 'Kamu sudah mencapai target olahraga minggu ini.'
    }


    const remaining =
      Math.max(
        0,
        weeklyTarget.value -
        weeklyMinutes.value
      )


    return `Tinggal ${remaining} menit lagi untuk mencapai target mingguan.`

  })


/* =========================
   NAVIGATION
========================= */

const goBack = () => {

  router.back()

}

</script>


<style scoped>

.page {
  --background: #fffafc;
  padding-bottom: 30px;
}


/* HEADER */

.header {
  padding: 25px 20px 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.header button {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 15px;
  background: white;
  font-size: 24px;
  cursor: pointer;
}

.header p {
  margin: 0;
  color: #ff5c9a;
  font-size: 13px;
  font-weight: bold;
}

.header h1 {
  margin: 4px 0 0;
  font-size: 24px;
}


/* SUMMARY */

.summary {
  margin: 10px 20px;
  padding: 20px;
  border-radius: 25px;
  background: #ff5c9a;
  color: white;
}

.summary p {
  margin: 0;
}

.summary h2 {
  margin: 5px 0;
  font-size: 27px;
}

.summary span {
  font-size: 12px;
}


/* TITLE */

.title {
  margin: 22px 20px 10px;
  font-size: 18px;
}


/* CARD */

.card {
  margin: 0 20px;
  padding: 20px;
  background: white;
  border-radius: 20px;
}


/* CHART */

.chart {
  height: 160px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 8px;
}

.bar-wrapper {
  width: 30px;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar-area {
  width: 22px;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.bar {
  width: 22px;
  background: #ff5c9a;
  border-radius: 10px 10px 0 0;
  min-height: 4px;
  transition: height 0.3s ease;
}

.bar.today {
  background: #ffcf33;
}


/* DAYS */

.days {
  display: flex;
  justify-content: space-around;
  margin-top: 8px;
  color: #888;
  font-size: 10px;
}

.minutes {
  text-align: center;
  color: #ff5c9a;
  font-weight: bold;
  font-size: 12px;
  margin: 14px 0 8px;
}


/* PROGRESS */

.progress-bg {
  width: 100%;
  height: 8px;
  background: #f1e8ed;
  border-radius: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #ff5c9a;
  border-radius: 20px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  margin: 7px 0 0;
  color: #888;
  font-size: 10px;
}


/* GRID */

.grid {
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stat {
  background: white;
  padding: 18px;
  border-radius: 18px;
}

.stat h2 {
  margin: 0;
  color: #ff5c9a;
  font-size: 23px;
}

.stat p {
  margin: 5px 0 0;
  color: #888;
  font-size: 11px;
}


/* TYPE */

.type-list {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.type-card {
  background: white;
  padding: 15px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.type-icon {
  width: 45px;
  height: 45px;
  border-radius: 14px;
  background: #fff0f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.type-info {
  flex: 1;
}

.type-info h3 {
  margin: 0;
  font-size: 14px;
}

.type-info p {
  margin: 4px 0 7px;
  color: #888;
  font-size: 11px;
}

.small-progress-bg {
  width: 100%;
  height: 6px;
  background: #f1e8ed;
  border-radius: 20px;
  overflow: hidden;
}

.small-progress {
  height: 100%;
  background: #ff5c9a;
  border-radius: 20px;
}


/* FAVORITE */

.favorite {
  margin: 15px 20px;
  padding: 18px;
  background: white;
  border-radius: 20px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.favorite-icon {
  font-size: 30px;
}

.favorite h3 {
  margin: 0;
  font-size: 14px;
}

.favorite p {
  margin: 5px 0 0;
  color: #888;
  font-size: 11px;
}


/* HISTORY */

.history {
  margin: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  background: white;
  border-radius: 18px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.history-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #fff0f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.history-info {
  flex: 1;
}

.history-info h3 {
  margin: 0;
  font-size: 14px;
}

.history-info p {
  margin: 4px 0 0;
  color: #888;
  font-size: 10px;
}

.history-item strong {
  color: #ff5c9a;
  font-size: 12px;
}


/* EMPTY */

.empty {
  margin: 0 20px;
  padding: 30px 20px;
  background: white;
  border-radius: 20px;
  text-align: center;
}

.empty div {
  font-size: 35px;
}

.empty h3 {
  margin: 10px 0 5px;
  font-size: 15px;
}

.empty p {
  margin: 0;
  color: #888;
  font-size: 11px;
  line-height: 1.5;
}


/* MOTIVATION */

.motivation {
  margin: 15px 20px;
  padding: 18px;
  background: #fff0a8;
  border-radius: 20px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.motivation-icon {
  font-size: 28px;
}

.motivation h3 {
  margin: 0;
  font-size: 14px;
}

.motivation p {
  margin: 5px 0 0;
  font-size: 11px;
  line-height: 1.4;
}

</style>