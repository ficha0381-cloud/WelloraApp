<template>
  <ion-page>
    <ion-content :fullscreen="true" class="target-page">

      <!-- HEADER -->
      <div class="header">
        <button class="back-button" @click="goBack">
          <ion-icon :icon="arrowBackOutline" />
        </button>

        <div class="header-text">
          <p>Wellora</p>
          <h1>Target Saya</h1>
        </div>

        <div class="header-icon">
          <ion-icon :icon="trophyOutline" />
        </div>
      </div>

      <!-- TARGET UTAMA -->
      <div class="main-target">
        <div class="target-circle">
          <strong>{{ overallProgress }}%</strong>
          <span>Tercapai</span>
        </div>

        <div class="target-info">
          <p>Target Mingguan</p>
          <h2>{{ weeklyMinutes }} / {{ weeklyTarget }} menit</h2>

          <span v-if="remainingMinutes > 0">
            {{ remainingMinutes }} menit lagi untuk mencapai target
          </span>

          <span v-else>
            Target mingguan tercapai! 🎉
          </span>
        </div>
      </div>

      <!-- PROGRESS MINGGUAN -->
      <div class="card">
        <div class="card-title">
          <h2>Progress Minggu Ini</h2>
          <span>{{ overallProgress }}%</span>
        </div>

        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${overallProgress}%` }"
          ></div>
        </div>

        <div class="progress-text">
          <span>{{ weeklyMinutes }} menit</span>
          <span>{{ weeklyTarget }} menit</span>
        </div>
      </div>

      <!-- TARGET HARIAN -->
      <div class="card">
        <div class="card-title">
          <h2>Target Harian</h2>
          <span>{{ activeDays }} / {{ targetDays }} hari</span>
        </div>

        <div class="days">
          <div
            v-for="day in weekDays"
            :key="day.key"
            class="day"
            :class="{ done: day.done }"
          >
            <span>{{ day.label }}</span>

            <strong>
              <ion-icon
                v-if="day.done"
                :icon="checkmarkOutline"
              />
              <span v-else>•</span>
            </strong>
          </div>
        </div>
      </div>

      <!-- TARGET OLAHRAGA -->
      <div class="section-title">
        <h2>Target Olahraga</h2>
      </div>

      <div class="goal-list">

        <!-- CARDIO -->
        <div class="goal-card">
          <div class="goal-icon pink">
            <ion-icon :icon="heartOutline" />
          </div>

          <div class="goal-info">
            <h3>Cardio</h3>
            <p>{{ cardioMinutes }} / {{ cardioTarget }} menit</p>

            <div class="mini-progress">
              <div
                class="mini-fill"
                :style="{ width: `${cardioProgress}%` }"
              ></div>
            </div>
          </div>

          <span>{{ cardioProgress }}%</span>
        </div>

        <!-- STRENGTH -->
        <div class="goal-card">
          <div class="goal-icon yellow">
            <ion-icon :icon="barbellOutline" />
          </div>

          <div class="goal-info">
            <h3>Strength</h3>
            <p>{{ strengthMinutes }} / {{ strengthTarget }} menit</p>

            <div class="mini-progress">
              <div
                class="mini-fill yellow-fill"
                :style="{ width: `${strengthProgress}%` }"
              ></div>
            </div>
          </div>

          <span>{{ strengthProgress }}%</span>
        </div>

        <!-- YOGA -->
        <div class="goal-card">
          <div class="goal-icon pink">
            <ion-icon :icon="bodyOutline" />
          </div>

          <div class="goal-info">
            <h3>Yoga</h3>
            <p>{{ yogaMinutes }} / {{ yogaTarget }} menit</p>

            <div class="mini-progress">
              <div
                class="mini-fill"
                :style="{ width: `${yogaProgress}%` }"
              ></div>
            </div>
          </div>

          <span>{{ yogaProgress }}%</span>
        </div>

      </div>

      <!-- MOTIVASI -->
      <div class="motivation">
        <div class="motivation-icon">
          <ion-icon :icon="sparklesOutline" />
        </div>

        <div>
          <h3>{{ motivationTitle }}</h3>
          <p>{{ motivationText }}</p>
        </div>
      </div>

      <!-- BUTTON TAMBAH TARGET -->
      <button
        class="add-target"
        @click="openTargetModal"
      >
        <ion-icon :icon="addOutline" />
        <span>Tambah Target</span>
      </button>

      <!-- MODAL -->
      <div
        v-if="showModal"
        class="modal-overlay"
        @click.self="closeTargetModal"
      >
        <div class="target-modal">

          <!-- MODAL HEADER -->
          <div class="modal-header">
            <div>
              <p>Wellora</p>
              <h2>Atur Target</h2>
            </div>

            <button
              class="close-button"
              @click="closeTargetModal"
            >
              <ion-icon :icon="closeOutline" />
            </button>
          </div>

          <!-- WEEKLY -->
          <div class="input-group">
            <label>Target olahraga mingguan</label>

            <div class="input-wrapper">
              <input
                v-model.number="editWeeklyTarget"
                type="number"
                min="1"
              />
              <span>menit</span>
            </div>
          </div>

          <!-- DAYS -->
          <div class="input-group">
            <label>Target hari olahraga</label>

            <div class="input-wrapper">
              <input
                v-model.number="editTargetDays"
                type="number"
                min="1"
                max="7"
              />
              <span>hari</span>
            </div>
          </div>

          <!-- CARDIO -->
          <div class="input-group">
            <label>Target Cardio</label>

            <div class="input-wrapper">
              <input
                v-model.number="editCardioTarget"
                type="number"
                min="0"
              />
              <span>menit</span>
            </div>
          </div>

          <!-- STRENGTH -->
          <div class="input-group">
            <label>Target Strength</label>

            <div class="input-wrapper">
              <input
                v-model.number="editStrengthTarget"
                type="number"
                min="0"
              />
              <span>menit</span>
            </div>
          </div>

          <!-- YOGA -->
          <div class="input-group">
            <label>Target Yoga</label>

            <div class="input-wrapper">
              <input
                v-model.number="editYogaTarget"
                type="number"
                min="0"
              />
              <span>menit</span>
            </div>
          </div>

          <!-- ERROR -->
          <div v-if="databaseError" class="database-error">
            Gagal mengakses database. Silakan coba lagi.
          </div>

          <!-- SAVE -->
          <button
            class="save-button"
            @click="saveTargets"
          >
            Simpan Target
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
  trophyOutline,
  checkmarkOutline,
  heartOutline,
  barbellOutline,
  bodyOutline,
  sparklesOutline,
  addOutline,
  closeOutline
} from 'ionicons/icons'

import {
  computed,
  onMounted,
  ref
} from 'vue'

import {
  onIonViewWillEnter,
  useIonRouter
} from '@ionic/vue'

import {
  getTargets,
  addTarget,
  updateTarget,
  getWorkouts
} from '../database/database'


/* =========================
   ROUTER
========================= */

const router = useIonRouter()


/* =========================
   INTERFACE
========================= */

interface WorkoutActivity {
  id?: number
  name: string
  type: string
  duration: number
  date: string
}

interface DatabaseTarget {
  id: number
  name: string
  minutes: number
  progress: number
  icon: string
}

interface TargetSettings {
  weeklyMinutes: number
  targetDays: number
  cardio: number
  strength: number
  yoga: number
}


/* =========================
   DEFAULT TARGET
========================= */

const defaultTargets: TargetSettings = {
  weeklyMinutes: 150,
  targetDays: 5,
  cardio: 60,
  strength: 40,
  yoga: 30
}


/* =========================
   STATE
========================= */

const activities =
  ref<WorkoutActivity[]>([])

const weeklyTarget =
  ref(defaultTargets.weeklyMinutes)

const targetDays =
  ref(defaultTargets.targetDays)

const cardioTarget =
  ref(defaultTargets.cardio)

const strengthTarget =
  ref(defaultTargets.strength)

const yogaTarget =
  ref(defaultTargets.yoga)

const showModal =
  ref(false)

const databaseError =
  ref(false)


/* =========================
   EDIT TARGET
========================= */

const editWeeklyTarget =
  ref(defaultTargets.weeklyMinutes)

const editTargetDays =
  ref(defaultTargets.targetDays)

const editCardioTarget =
  ref(defaultTargets.cardio)

const editStrengthTarget =
  ref(defaultTargets.strength)

const editYogaTarget =
  ref(defaultTargets.yoga)


/* =========================
   TARGET DATABASE KEY
========================= */

const TARGET_KEYS = {
  weekly: 'weeklyMinutes',
  days: 'targetDays',
  cardio: 'cardio',
  strength: 'strength',
  yoga: 'yoga'
}


/* =========================
   LOAD TARGET
========================= */

const loadTargets = async () => {

  try {

    databaseError.value = false

    const targets =
      await getTargets()

    const weekly =
      targets.find(
        target =>
          target.name ===
          TARGET_KEYS.weekly
      )

    const days =
      targets.find(
        target =>
          target.name ===
          TARGET_KEYS.days
      )

    const cardio =
      targets.find(
        target =>
          target.name ===
          TARGET_KEYS.cardio
      )

    const strength =
      targets.find(
        target =>
          target.name ===
          TARGET_KEYS.strength
      )

    const yoga =
      targets.find(
        target =>
          target.name ===
          TARGET_KEYS.yoga
      )


    weeklyTarget.value =
      weekly
        ? Number(weekly.minutes)
        : defaultTargets.weeklyMinutes

    targetDays.value =
      days
        ? Number(days.minutes)
        : defaultTargets.targetDays

    cardioTarget.value =
      cardio
        ? Number(cardio.minutes)
        : defaultTargets.cardio

    strengthTarget.value =
      strength
        ? Number(strength.minutes)
        : defaultTargets.strength

    yogaTarget.value =
      yoga
        ? Number(yoga.minutes)
        : defaultTargets.yoga


  } catch (error) {

    console.error(
      'Gagal membaca target dari IndexedDB:',
      error
    )

    databaseError.value = true

    weeklyTarget.value =
      defaultTargets.weeklyMinutes

    targetDays.value =
      defaultTargets.targetDays

    cardioTarget.value =
      defaultTargets.cardio

    strengthTarget.value =
      defaultTargets.strength

    yogaTarget.value =
      defaultTargets.yoga

  }

}


/* =========================
   LOAD WORKOUT
========================= */

const loadActivities = async () => {

  try {

    const data =
      await getWorkouts()

    activities.value =
      data.map(
        activity => ({
          id:
            activity.id,
          name:
            activity.name,
          type:
            activity.type,
          duration:
            Number(
              activity.duration
            ),
          date:
            activity.date
        })
      )

  } catch (error) {

    console.error(
      'Gagal membaca aktivitas dari IndexedDB:',
      error
    )

    activities.value = []

    databaseError.value = true

  }

}


/* =========================
   DATE
========================= */

const getDateKey = (
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
   GET MONDAY
========================= */

const getMonday = (
  date: Date
) => {

  const result =
    new Date(date)

  const day =
    result.getDay()

  const difference =
    day === 0
      ? -6
      : 1 - day

  result.setDate(
    result.getDate() + difference
  )

  result.setHours(
    0,
    0,
    0,
    0
  )

  return result

}


/* =========================
   CURRENT WEEK
========================= */

const getCurrentWeekActivities =
  () => {

    const today =
      new Date()

    const monday =
      getMonday(today)

    const sunday =
      new Date(monday)

    sunday.setDate(
      monday.getDate() + 6
    )

    sunday.setHours(
      23,
      59,
      59,
      999
    )

    return activities.value.filter(
      activity => {

        if (!activity.date) {
          return false
        }

        const activityDate =
          new Date(
            `${activity.date}T00:00:00`
          )

        return (
          activityDate >= monday &&
          activityDate <= sunday
        )

      }
    )

  }


/* =========================
   WEEKLY ACTIVITIES
========================= */

const weeklyActivities =
  computed(() => {

    return getCurrentWeekActivities()

  })


/* =========================
   WEEKLY MINUTES
========================= */

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


/* =========================
   OVERALL PROGRESS
========================= */

const overallProgress =
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
   REMAINING
========================= */

const remainingMinutes =
  computed(() => {

    return Math.max(
      0,
      weeklyTarget.value -
      weeklyMinutes.value
    )

  })


/* =========================
   NORMALIZE TYPE
========================= */

const normalizeType = (
  activity: WorkoutActivity
) => {

  const value =
    `${activity.type} ${activity.name}`
      .toLowerCase()

  if (
    value.includes('yoga')
  ) {

    return 'yoga'

  }

  if (
    value.includes('strength') ||
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


/* =========================
   CARDIO
========================= */

const cardioMinutes =
  computed(() => {

    return weeklyActivities.value
      .filter(
        activity =>
          normalizeType(activity) ===
          'cardio'
      )
      .reduce(
        (
          total,
          activity
        ) =>
          total +
          Number(
            activity.duration || 0
          ),
        0
      )

  })


const cardioProgress =
  computed(() => {

    if (
      cardioTarget.value <= 0
    ) {
      return 0
    }

    return Math.min(
      100,
      Math.round(
        (
          cardioMinutes.value /
          cardioTarget.value
        ) * 100
      )
    )

  })


/* =========================
   STRENGTH
========================= */

const strengthMinutes =
  computed(() => {

    return weeklyActivities.value
      .filter(
        activity =>
          normalizeType(activity) ===
          'strength'
      )
      .reduce(
        (
          total,
          activity
        ) =>
          total +
          Number(
            activity.duration || 0
          ),
        0
      )

  })


const strengthProgress =
  computed(() => {

    if (
      strengthTarget.value <= 0
    ) {
      return 0
    }

    return Math.min(
      100,
      Math.round(
        (
          strengthMinutes.value /
          strengthTarget.value
        ) * 100
      )
    )

  })


/* =========================
   YOGA
========================= */

const yogaMinutes =
  computed(() => {

    return weeklyActivities.value
      .filter(
        activity =>
          normalizeType(activity) ===
          'yoga'
      )
      .reduce(
        (
          total,
          activity
        ) =>
          total +
          Number(
            activity.duration || 0
          ),
        0
      )

  })


const yogaProgress =
  computed(() => {

    if (
      yogaTarget.value <= 0
    ) {
      return 0
    }

    return Math.min(
      100,
      Math.round(
        (
          yogaMinutes.value /
          yogaTarget.value
        ) * 100
      )
    )

  })


/* =========================
   ACTIVE DATES
========================= */

const activeDates =
  computed(() => {

    const dates =
      new Set<string>()

    weeklyActivities.value.forEach(
      activity => {

        if (
          Number(
            activity.duration
          ) > 0 &&
          activity.date
        ) {

          dates.add(
            activity.date
          )

        }

      }
    )

    return dates

  })


/* =========================
   ACTIVE DAYS
========================= */

const activeDays =
  computed(() => {

    return activeDates.value.size

  })


/* =========================
   WEEK DAYS
========================= */

const weekDays =
  computed(() => {

    const monday =
      getMonday(
        new Date()
      )

    const labels = [
      'Sen',
      'Sel',
      'Rab',
      'Kam',
      'Jum',
      'Sab',
      'Min'
    ]

    return labels.map(
      (
        label,
        index
      ) => {

        const date =
          new Date(monday)

        date.setDate(
          monday.getDate() +
          index
        )

        const key =
          getDateKey(date)

        return {
          key,
          label,
          done:
            activeDates.value.has(
              key
            )
        }

      }
    )

  })


/* =========================
   MOTIVATION TITLE
========================= */

const motivationTitle =
  computed(() => {

    if (
      overallProgress.value >= 100
    ) {

      return 'Target Tercapai!'

    }

    if (
      overallProgress.value >= 70
    ) {

      return 'Sedikit Lagi!'

    }

    if (
      overallProgress.value > 0
    ) {

      return 'Tetap Semangat!'

    }

    return 'Yuk Mulai Bergerak!'

  })


/* =========================
   MOTIVATION TEXT
========================= */

const motivationText =
  computed(() => {

    if (
      overallProgress.value >= 100
    ) {

      return 'Kamu sudah mencapai target olahraga minggu ini. Pertahankan kebiasaan baikmu!'

    }

    if (
      overallProgress.value >= 70
    ) {

      return 'Progress kamu sudah bagus. Sedikit lagi target mingguan tercapai!'

    }

    if (
      overallProgress.value > 0
    ) {

      return 'Terus lakukan olahraga secara rutin untuk mencapai target mingguanmu.'

    }

    return 'Mulai dengan olahraga ringan hari ini dan bangun kebiasaan sehat secara perlahan.'

  })


/* =========================
   OPEN MODAL
========================= */

const openTargetModal = () => {

  editWeeklyTarget.value =
    weeklyTarget.value

  editTargetDays.value =
    targetDays.value

  editCardioTarget.value =
    cardioTarget.value

  editStrengthTarget.value =
    strengthTarget.value

  editYogaTarget.value =
    yogaTarget.value

  showModal.value = true

}


/* =========================
   CLOSE MODAL
========================= */

const closeTargetModal = () => {

  showModal.value = false

}


/* =========================
   SAVE ONE TARGET
========================= */

const saveOneTarget = async (
  name: string,
  minutes: number,
  icon: string
) => {

  const targets =
    await getTargets()

  const existing =
    targets.find(
      target =>
        target.name === name
    )

  const targetData = {
    name,
    minutes:
      Number(minutes) || 0,
    progress: 0,
    icon
  }

  if (existing) {

    await updateTarget({
      id: Number(existing.id),
      name: existing.name,
      minutes:
        Number(minutes) || 0,
      progress:
        Number(existing.progress) || 0,
      icon:
        existing.icon || icon
    })

  } else {

    await addTarget(
      targetData
    )

  }

}


/* =========================
   SAVE TARGET
========================= */

const saveTargets = async () => {

  try {

    databaseError.value = false

    const data: TargetSettings = {

      weeklyMinutes: Math.max(
        1,
        Number(
          editWeeklyTarget.value
        ) ||
        defaultTargets.weeklyMinutes
      ),

      targetDays: Math.min(
        7,
        Math.max(
          1,
          Number(
            editTargetDays.value
          ) ||
          defaultTargets.targetDays
        )
      ),

      cardio: Math.max(
        0,
        Number(
          editCardioTarget.value
        ) || 0
      ),

      strength: Math.max(
        0,
        Number(
          editStrengthTarget.value
        ) || 0
      ),

      yoga: Math.max(
        0,
        Number(
          editYogaTarget.value
        ) || 0
      )

    }


    /* =====================
       SIMPAN KE INDEXEDDB
    ===================== */

    await saveOneTarget(
      TARGET_KEYS.weekly,
      data.weeklyMinutes,
      '⏱️'
    )

    await saveOneTarget(
      TARGET_KEYS.days,
      data.targetDays,
      '📅'
    )

    await saveOneTarget(
      TARGET_KEYS.cardio,
      data.cardio,
      '❤️'
    )

    await saveOneTarget(
      TARGET_KEYS.strength,
      data.strength,
      '🏋️'
    )

    await saveOneTarget(
      TARGET_KEYS.yoga,
      data.yoga,
      '🧘'
    )


    /* =====================
       UPDATE TAMPILAN
    ===================== */

    weeklyTarget.value =
      data.weeklyMinutes

    targetDays.value =
      data.targetDays

    cardioTarget.value =
      data.cardio

    strengthTarget.value =
      data.strength

    yogaTarget.value =
      data.yoga


    showModal.value =
      false


    console.log(
      'Target berhasil disimpan ke WelloraDB'
    )

  } catch (error) {

    console.error(
      'Gagal menyimpan target ke IndexedDB:',
      error
    )

    databaseError.value = true

    alert(
      'Target gagal disimpan ke database.'
    )

  }

}


/* =========================
   BACK
========================= */

const goBack = () => {

  router.back()

}


/* =========================
   REFRESH
========================= */

const refreshPage =
  async () => {

    await loadTargets()

    await loadActivities()

  }


/* =========================
   LIFECYCLE
========================= */

onMounted(
  async () => {

    await refreshPage()

  }
)


onIonViewWillEnter(
  async () => {

    await refreshPage()

  }
)

</script>

<style scoped>

.target-page {
  --background: #fffafc;
  --padding-bottom: 30px;
}


/* HEADER */

.header {
  padding: 25px 20px 15px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-text {
  flex: 1;
}

.header-text p {
  margin: 0;
  color: #ff5c9a;
  font-size: 13px;
  font-weight: 700;
}

.header-text h1 {
  margin: 4px 0 0;
  font-size: 24px;
  font-weight: 800;
  color: #292929;
}

.back-button {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 15px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #292929;
  font-size: 21px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, .05);
}

.header-icon {
  width: 45px;
  height: 45px;
  border-radius: 15px;
  background: #fff0a8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffb800;
  font-size: 24px;
}


/* MAIN TARGET */

.main-target {
  margin: 10px 20px 18px;
  padding: 22px;
  border-radius: 25px;
  background: linear-gradient(
    135deg,
    #ff5c9a,
    #ff83b1
  );
  color: white;
  display: flex;
  align-items: center;
  gap: 20px;
}

.target-circle {
  width: 105px;
  height: 105px;
  min-width: 105px;
  border-radius: 50%;
  background: #fff0a8;
  color: #ff5c9a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.target-circle strong {
  font-size: 25px;
}

.target-circle span {
  font-size: 11px;
}

.target-info {
  flex: 1;
}

.target-info p {
  margin: 0;
  font-size: 13px;
}

.target-info h2 {
  margin: 5px 0;
  font-size: 21px;
}

.target-info span {
  font-size: 11px;
}


/* CARD */

.card {
  margin: 0 20px 15px;
  padding: 18px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, .04);
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title h2 {
  margin: 0;
  font-size: 16px;
}

.card-title span {
  color: #ff5c9a;
  font-size: 12px;
  font-weight: 700;
}

.progress-bar {
  margin-top: 15px;
  height: 10px;
  background: #ffe0eb;
  border-radius: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #ff5c9a;
  border-radius: 20px;
  transition: width .3s ease;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  margin-top: 7px;
  font-size: 10px;
  color: #999;
}


/* DAYS */

.days {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
}

.day span {
  font-size: 10px;
  color: #888;
}

.day strong {
  width: 29px;
  height: 29px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-size: 16px;
}

.day.done strong {
  background: #ff5c9a;
  color: white;
}


/* SECTION */

.section-title {
  padding: 0 20px;
}

.section-title h2 {
  font-size: 18px;
  margin: 18px 0 10px;
}


/* GOAL */

.goal-list {
  padding: 0 20px;
}

.goal-card {
  background: white;
  border-radius: 20px;
  padding: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, .04);
}

.goal-icon {
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
}

.pink {
  background: #ffe0eb;
  color: #ff5c9a;
}

.yellow {
  background: #fff0a8;
  color: #e5a900;
}

.goal-info {
  flex: 1;
}

.goal-info h3 {
  margin: 0;
  font-size: 14px;
}

.goal-info p {
  margin: 3px 0 7px;
  font-size: 10px;
  color: #999;
}

.goal-card > span {
  font-size: 11px;
  color: #ff5c9a;
  font-weight: 700;
}

.mini-progress {
  height: 6px;
  background: #f1f1f1;
  border-radius: 10px;
  overflow: hidden;
}

.mini-fill {
  height: 100%;
  border-radius: 10px;
  background: #ff5c9a;
  transition: width .3s ease;
}

.yellow-fill {
  background: #f5c400;
}


/* MOTIVATION */

.motivation {
  margin: 18px 20px;
  padding: 15px;
  border-radius: 20px;
  background: #fff0a8;
  display: flex;
  gap: 12px;
  align-items: center;
}

.motivation-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 13px;
  background: white;
  color: #ffb800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23px;
}

.motivation h3 {
  margin: 0;
  font-size: 14px;
}

.motivation p {
  margin: 4px 0 0;
  font-size: 11px;
  color: #666;
  line-height: 1.5;
}


/* BUTTON */

.add-target {
  width: calc(100% - 40px);
  margin: 0 20px 30px;
  padding: 15px;
  border: none;
  border-radius: 17px;
  background: #ff5c9a;
  color: white;
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}


/* MODAL */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, .35);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.target-modal {
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  background: #fffafc;
  border-radius: 28px 28px 0 0;
  padding: 22px 20px 30px;
  box-sizing: border-box;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.modal-header p {
  margin: 0;
  color: #ff5c9a;
  font-size: 12px;
  font-weight: 700;
}

.modal-header h2 {
  margin: 4px 0 0;
  font-size: 22px;
  color: #292929;
}

.close-button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 13px;
  background: white;
  color: #555;
  font-size: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
}


/* INPUT */

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 7px;
  font-size: 12px;
  font-weight: 700;
  color: #555;
}

.input-wrapper {
  height: 48px;
  background: white;
  border-radius: 14px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, .04);
}

.input-wrapper input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: #292929;
}

.input-wrapper span {
  font-size: 11px;
  color: #999;
}


/* ERROR */

.database-error {
  margin-top: 5px;
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #ffe9e9;
  color: #d95353;
  font-size: 11px;
}


/* SAVE */

.save-button {
  width: 100%;
  margin-top: 8px;
  padding: 15px;
  border: none;
  border-radius: 16px;
  background: #ff5c9a;
  color: white;
  font-size: 14px;
  font-weight: 800;
}

</style>