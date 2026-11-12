<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" />
        </ion-buttons>

        <ion-title>Wellora AI 🤖</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ai-content">
      <!-- HEADER AI -->
      <div class="ai-header">
        <div class="robot-icon">🤖</div>

        <div>
          <h2>Wellora Assistant</h2>
          <p>
            Asisten pribadi untuk olahraga dan target sehatmu.
          </p>
        </div>
      </div>

      <!-- RINGKASAN DATA -->
      <div class="summary-card">
        <div class="summary-title">
          📊 Data Wellora kamu
        </div>

        <div class="summary-grid">
          <div class="summary-item">
            <strong>{{ weeklyMinutes }}</strong>
            <span>menit minggu ini</span>
          </div>

          <div class="summary-item">
            <strong>{{ weeklyProgress }}%</strong>
            <span>target tercapai</span>
          </div>

          <div class="summary-item">
            <strong>{{ activeDays }}</strong>
            <span>hari aktif</span>
          </div>

          <div class="summary-item">
            <strong>{{ totalActivities }}</strong>
            <span>total aktivitas</span>
          </div>
        </div>
      </div>

      <!-- CHAT -->
      <div class="chat-area">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-row"
          :class="message.sender"
        >
          <div class="message-avatar">
            {{ message.sender === 'ai' ? '🤖' : '👤' }}
          </div>

          <div class="message-bubble">
            {{ message.text }}
          </div>
        </div>

        <div
          v-if="isTyping"
          class="message-row ai"
        >
          <div class="message-avatar">
            🤖
          </div>

          <div class="message-bubble typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- PERTANYAAN CEPAT -->
      <div class="quick-section">
        <div class="quick-title">
          Pertanyaan cepat
        </div>

        <div class="quick-buttons">
          <button
            @click="askQuickQuestion('Olahraga apa yang cocok untuk saya hari ini?')"
          >
            🏃 Olahraga hari ini
          </button>

          <button
            @click="askQuickQuestion('Bagaimana progress target saya?')"
          >
            🎯 Progress target
          </button>

          <button
            @click="askQuickQuestion('Berikan motivasi untuk saya')"
          >
            💪 Motivasi
          </button>

          <button
            @click="askQuickQuestion('Kapan saya sebaiknya istirahat?')"
          >
            😴 Waktu istirahat
          </button>

          <button
            @click="askQuickQuestion('Tampilkan data olahraga saya')"
          >
            📊 Data saya
          </button>
        </div>
      </div>

      <!-- INPUT -->
      <div class="input-area">
        <input
          v-model="inputText"
          type="text"
          placeholder="Tanya Wellora..."
          @keyup.enter="sendMessage"
        />

        <button
          class="send-button"
          :disabled="!inputText.trim() || isTyping"
          @click="sendMessage"
        >
          ➤
        </button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton
} from '@ionic/vue'

import {
  computed,
  onMounted,
  ref
} from 'vue'

interface Activity {
  id: number
  name: string
  type: string
  duration: number
  date: string
}

interface Target {
  weeklyMinutes: number
  targetDays: number
  cardio: number
  strength: number
  yoga: number
}

interface Profile {
  name?: string
  age?: number
  weight?: number
  height?: number
  goal?: string
}

interface Message {
  id: number
  sender: 'ai' | 'user'
  text: string
}

const activities = ref<Activity[]>([])

const targets = ref<Target>({
  weeklyMinutes: 150,
  targetDays: 5,
  cardio: 60,
  strength: 40,
  yoga: 30
})

const profile = ref<Profile>({})

const messages = ref<Message[]>([
  {
    id: 1,
    sender: 'ai',
    text:
      'Halo! 👋 Saya Wellora AI. Saya bisa membantu membaca progress olahraga, target mingguan, dan memberi saran olahraga berdasarkan data Wellora kamu.'
  }
])

const inputText = ref('')
const isTyping = ref(false)

/* =========================
   DATA
========================= */

const loadData = () => {
  // RIWAYAT OLAHRAGA
  try {
    const savedActivities =
      localStorage.getItem(
        'wellora_workout_history'
      )

    if (savedActivities) {
      const parsed =
        JSON.parse(savedActivities)

      if (Array.isArray(parsed)) {
        activities.value = parsed
      }
    }
  } catch (error) {
    console.error(
      'Gagal membaca riwayat olahraga:',
      error
    )

    activities.value = []
  }

  // TARGET
  try {
    const savedTargets =
      localStorage.getItem(
        'wellora_targets'
      )

    if (savedTargets) {
      const parsed =
        JSON.parse(savedTargets)

      targets.value = {
        ...targets.value,
        ...parsed
      }
    }
  } catch (error) {
    console.error(
      'Gagal membaca target:',
      error
    )
  }

  // PROFIL
  try {
    const savedProfile =
      localStorage.getItem(
        'wellora_profile'
      )

    if (savedProfile) {
      const parsed =
        JSON.parse(savedProfile)

      if (parsed) {
        profile.value = parsed
      }
    }
  } catch (error) {
    console.error(
      'Gagal membaca profil:',
      error
    )
  }
}

/* =========================
   TANGGAL
========================= */

const getDateKey = (date: Date) => {
  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    date.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getStartOfWeek = () => {
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

/* =========================
   STATISTIK
========================= */

const weeklyActivities = computed(() => {
  const start =
    getStartOfWeek()

  return activities.value.filter(
    (activity) => {
      const date =
        new Date(activity.date)

      if (isNaN(date.getTime())) {
        return false
      }

      return date >= start
    }
  )
})

const weeklyMinutes = computed(() => {
  return weeklyActivities.value.reduce(
    (total, activity) =>
      total +
      Number(
        activity.duration || 0
      ),
    0
  )
})

const weeklyTarget = computed(() => {
  return Number(
    targets.value.weeklyMinutes ||
      150
  )
})

const weeklyProgress = computed(() => {
  if (weeklyTarget.value <= 0) {
    return 0
  }

  return Math.min(
    100,
    Math.round(
      (weeklyMinutes.value /
        weeklyTarget.value) *
        100
    )
  )
})

const activeDays = computed(() => {
  const days =
    new Set<string>()

  weeklyActivities.value.forEach(
    (activity) => {
      const date =
        new Date(activity.date)

      if (!isNaN(date.getTime())) {
        days.add(
          getDateKey(date)
        )
      }
    }
  )

  return days.size
})

const totalActivities = computed(() => {
  return activities.value.length
})

const remainingMinutes = computed(() => {
  return Math.max(
    0,
    weeklyTarget.value -
      weeklyMinutes.value
  )
})

/* =========================
   KATEGORI
========================= */

const getCategoryMinutes = (
  category: string
) => {
  return weeklyActivities.value
    .filter((activity) => {
      const text =
        `${activity.type} ${activity.name}`
          .toLowerCase()

      if (category === 'cardio') {
        return (
          text.includes('cardio') ||
          text.includes('lari') ||
          text.includes('jalan') ||
          text.includes('run') ||
          text.includes('walk') ||
          text.includes('sepeda') ||
          text.includes('cycling') ||
          text.includes('bike') ||
          text.includes('renang') ||
          text.includes('swim')
        )
      }

      if (category === 'strength') {
        return (
          text.includes('strength') ||
          text.includes('gym') ||
          text.includes('angkat') ||
          text.includes('weight') ||
          text.includes('push up') ||
          text.includes('pushup') ||
          text.includes('squat')
        )
      }

      if (category === 'yoga') {
        return (
          text.includes('yoga') ||
          text.includes('stretch') ||
          text.includes('pilates')
        )
      }

      return false
    })
    .reduce(
      (total, activity) =>
        total +
        Number(
          activity.duration || 0
        ),
      0
    )
}

const cardioMinutes = computed(() =>
  getCategoryMinutes('cardio')
)

const strengthMinutes = computed(() =>
  getCategoryMinutes('strength')
)

const yogaMinutes = computed(() =>
  getCategoryMinutes('yoga')
)

/* =========================
   AKTIVITAS TERAKHIR
========================= */

const latestActivity = computed(() => {
  if (
    activities.value.length === 0
  ) {
    return null
  }

  const sorted = [
    ...activities.value
  ].sort((a, b) => {
    return (
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
    )
  })

  return sorted[0]
})

/* =========================
   PROFIL
========================= */

const profileName = computed(() => {
  return (
    profile.value.name ||
    'kamu'
  )
})

const bmi = computed(() => {
  const weight =
    Number(profile.value.weight)

  const height =
    Number(profile.value.height)

  if (
    !weight ||
    !height ||
    height <= 0
  ) {
    return null
  }

  const heightMeter =
    height / 100

  return (
    weight /
    (heightMeter *
      heightMeter)
  ).toFixed(1)
})

/* =========================
   RESPONSE AI
========================= */

const generateResponse = (
  question: string
) => {
  const text =
    question
      .toLowerCase()
      .trim()

  /*
   * OLAHRAGA
   */
  if (
    text.includes('olahraga') ||
    text.includes('latihan') ||
    text.includes('exercise') ||
    text.includes('hari ini')
  ) {
    if (
      todayActivitiesExist()
    ) {
      return (
        `Hari ini kamu sudah melakukan ` +
        `${getTodayActivitySummary()}. ` +
        `Kalau masih ingin bergerak, pilih aktivitas ringan sesuai kondisi tubuhmu dan jangan lupa hidrasi.`
      )
    }

    if (
      weeklyProgress.value >= 100
    ) {
      return (
        `Target mingguanmu sudah mencapai ` +
        `${weeklyProgress.value}%. ` +
        `Kalau tubuh terasa baik, kamu bisa melakukan aktivitas ringan seperti jalan santai, stretching, atau yoga.`
      )
    }

    if (
      weeklyMinutes.value === 0
    ) {
      return (
        `Belum ada aktivitas olahraga minggu ini. ` +
        `Kamu bisa mulai dengan jalan santai sekitar 20–30 menit, lalu sesuaikan dengan kondisi tubuhmu.`
      )
    }

    return (
      `Minggu ini kamu sudah olahraga ` +
      `${weeklyMinutes.value} menit. ` +
      `Kamu masih membutuhkan sekitar ` +
      `${remainingMinutes.value} menit untuk mencapai target. ` +
      `Coba aktivitas yang nyaman seperti jalan, cardio ringan, strength, atau yoga.`
    )
  }

  /*
   * TARGET / PROGRESS
   */
  if (
    text.includes('target') ||
    text.includes('progress') ||
    text.includes('progres') ||
    text.includes('pencapaian')
  ) {
    if (
      weeklyProgress.value >= 100
    ) {
      return (
        `Progress target minggu ini sudah ` +
        `${weeklyProgress.value}%. ` +
        `Kamu telah mencapai target ${weeklyTarget.value} menit. Pertahankan kebiasaan baik dan tetap beri waktu tubuh untuk pulih.`
      )
    }

    return (
      `Progress kamu minggu ini ` +
      `adalah ${weeklyProgress.value}%. ` +
      `Total olahraga ${weeklyMinutes.value} dari ` +
      `${weeklyTarget.value} menit. ` +
      `Masih tersisa ${remainingMinutes.value} menit. ` +
      `Kamu sudah aktif selama ${activeDays.value} hari.`
    )
  }

  /*
   * MOTIVASI
   */
  if (
    text.includes('motivasi') ||
    text.includes('semangat') ||
    text.includes('malas') ||
    text.includes('capek')
  ) {
    if (
      weeklyMinutes.value === 0
    ) {
      return (
        `Tidak perlu langsung berat, ${profileName.value}. 🌷 ` +
        `Mulai saja dari 10–20 menit aktivitas ringan. Konsistensi kecil tetap merupakan langkah untuk membangun kebiasaan.`
      )
    }

    if (
      weeklyProgress.value >= 100
    ) {
      return (
        `Keren, ${profileName.value}! 💪 ` +
        `Target mingguanmu sudah tercapai. Sekarang fokus menjaga kebiasaan dan memberi tubuh waktu istirahat yang cukup.`
      )
    }

    return (
      `Tetap semangat, ${profileName.value}! 💪 ` +
      `Kamu sudah mencapai ${weeklyProgress.value}% target minggu ini. ` +
      `Tidak harus sempurna—yang penting tetap bergerak secara bertahap dan konsisten.`
    )
  }

  /*
   * ISTIRAHAT / RECOVERY
   */
  if (
    text.includes('istirahat') ||
    text.includes('recovery') ||
    text.includes('rest') ||
    text.includes('tidur')
  ) {
    return (
      `Istirahat penting untuk pemulihan tubuh. 😴 ` +
      `Jika tubuh terasa sangat lelah, nyeri, atau tidak nyaman, kurangi intensitas dan beri waktu untuk pulih. ` +
      `Untuk aktivitas berikutnya, pilih intensitas sesuai kondisi tubuhmu.`
    )
  }

  /*
   * DATA
   */
  if (
    text.includes('data saya') ||
    text.includes('data ku') ||
    text.includes('statistik') ||
    text.includes('riwayat')
  ) {
    let response =
      `Berikut ringkasan data Wellora kamu:\n\n` +
      `🏃 ${weeklyMinutes.value} menit olahraga minggu ini\n` +
      `🎯 ${weeklyProgress.value}% target tercapai\n` +
      `📅 ${activeDays.value} hari aktif\n` +
      `📝 ${totalActivities.value} total aktivitas`

    if (
      latestActivity.value
    ) {
      response +=
        `\n\nAktivitas terakhir: ` +
        `${latestActivity.value.name} ` +
        `(${latestActivity.value.duration} menit).`
    }

    return response
  }

  /*
   * PROFIL
   */
  if (
    text.includes('profil') ||
    text.includes('tentang saya') ||
    text.includes('data pribadi') ||
    text.includes('berat badan') ||
    text.includes('tinggi badan') ||
    text.includes('bmi')
  ) {
    let response =
      `Data profil yang tersedia:\n\n`

    if (profile.value.name) {
      response +=
        `👤 Nama: ${profile.value.name}\n`
    }

    if (profile.value.age) {
      response +=
        `🎂 Usia: ${profile.value.age} tahun\n`
    }

    if (profile.value.weight) {
      response +=
        `⚖️ Berat: ${profile.value.weight} kg\n`
    }

    if (profile.value.height) {
      response +=
        `📏 Tinggi: ${profile.value.height} cm\n`
    }

    if (profile.value.goal) {
      response +=
        `🎯 Tujuan: ${profile.value.goal}\n`
    }

    if (bmi.value) {
      response +=
        `📊 BMI: ${bmi.value}`
    }

    if (
      response ===
      `Data profil yang tersedia:\n\n`
    ) {
      return (
        'Belum ada data profil yang tersimpan di Wellora. Kamu bisa mengisinya melalui halaman Profil.'
      )
    }

    return response
  }

  /*
   * CARDIO
   */
  if (
    text.includes('cardio') ||
    text.includes('lari') ||
    text.includes('jalan')
  ) {
    return (
      `Catatan cardio minggu ini sekitar ` +
      `${cardioMinutes.value} menit. 🏃 ` +
      `Aktivitas cardio bisa berupa jalan, lari, sepeda, atau aktivitas lain yang meningkatkan denyut jantung. Sesuaikan intensitas dengan kemampuanmu.`
    )
  }

  /*
   * STRENGTH
   */
  if (
    text.includes('strength') ||
    text.includes('angkat beban') ||
    text.includes('gym') ||
    text.includes('kekuatan')
  ) {
    return (
      `Catatan strength minggu ini sekitar ` +
      `${strengthMinutes.value} menit. 💪 ` +
      `Fokus pada teknik gerakan yang benar dan pilih beban atau intensitas yang sesuai kemampuanmu.`
    )
  }

  /*
   * YOGA
   */
  if (
    text.includes('yoga') ||
    text.includes('stretching') ||
    text.includes('peregangan')
  ) {
    return (
      `Catatan yoga atau stretching minggu ini sekitar ` +
      `${yogaMinutes.value} menit. 🧘 ` +
      `Aktivitas seperti ini dapat digunakan sebagai bagian dari rutinitas fleksibilitas dan relaksasi.`
    )
  }

  /*
   * SAPAAN
   */
  if (
    text.includes('halo') ||
    text.includes('hai') ||
    text.includes('hello') ||
    text === 'hi'
  ) {
    return (
      `Halo, ${profileName.value}! 👋 ` +
      `Ada yang ingin kamu tanyakan tentang olahraga, target, atau progress Wellora?`
    )
  }

  /*
   * DEFAULT
   */
  return (
    `Saya bisa membantu kamu dengan data Wellora. 🤖\n\n` +
    `Coba tanyakan misalnya:\n` +
    `• Olahraga apa hari ini?\n` +
    `• Bagaimana progress target saya?\n` +
    `• Berikan motivasi\n` +
    `• Kapan saya sebaiknya istirahat?\n` +
    `• Tampilkan data olahraga saya`
  )
}

/* =========================
   HELPER
========================= */

const todayActivitiesExist = () => {
  const today =
    getDateKey(new Date())

  return activities.value.some(
    (activity) => {
      const date =
        new Date(activity.date)

      if (isNaN(date.getTime())) {
        return false
      }

      return (
        getDateKey(date) === today
      )
    }
  )
}

const getTodayActivitySummary = () => {
  const today =
    getDateKey(new Date())

  const todayActivities =
    activities.value.filter(
      (activity) => {
        const date =
          new Date(activity.date)

        if (
          isNaN(date.getTime())
        ) {
          return false
        }

        return (
          getDateKey(date) === today
        )
      }
    )

  if (
    todayActivities.length === 0
  ) {
    return 'belum ada aktivitas'
  }

  return todayActivities
    .map(
      (activity) =>
        `${activity.name} ${activity.duration} menit`
    )
    .join(', ')
}

/* =========================
   KIRIM PESAN
========================= */

const addMessage = (
  sender: 'ai' | 'user',
  text: string
) => {
  messages.value.push({
    id:
      Date.now() +
      Math.random(),
    sender,
    text
  })
}

const sendMessage = () => {
  const question =
    inputText.value.trim()

  if (
    !question ||
    isTyping.value
  ) {
    return
  }

  addMessage(
    'user',
    question
  )

  inputText.value = ''

  isTyping.value = true

  setTimeout(() => {
    const response =
      generateResponse(question)

    addMessage(
      'ai',
      response
    )

    isTyping.value = false
  }, 500)
}

const askQuickQuestion = (
  question: string
) => {
  if (isTyping.value) {
    return
  }

  addMessage(
    'user',
    question
  )

  isTyping.value = true

  setTimeout(() => {
    const response =
      generateResponse(question)

    addMessage(
      'ai',
      response
    )

    isTyping.value = false
  }, 500)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.ai-content {
  --background: #fff8fb;
  padding-bottom: 90px;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 18px 16px;
  padding: 18px;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    #ffe5ef,
    #f3e8ff
  );
}

.robot-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  border-radius: 17px;
  background: white;
  font-size: 29px;
}

.ai-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #3d3041;
}

.ai-header p {
  margin: 5px 0 0;
  font-size: 12px;
  line-height: 1.45;
  color: #76657f;
}

.summary-card {
  margin: 0 16px 18px;
  padding: 16px;
  border-radius: 18px;
  background: white;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
}

.summary-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 800;
  color: #333;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.summary-item {
  padding: 11px;
  border-radius: 13px;
  background: #fff5f8;
}

.summary-item strong {
  display: block;
  font-size: 17px;
  color: #e85d91;
}

.summary-item span {
  display: block;
  margin-top: 2px;
  font-size: 10px;
  color: #888;
}

.chat-area {
  padding: 0 16px;
}

.message-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 13px;
}

.message-row.user {
  flex-direction: row-reverse;
}

.message-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #ffe5ef;
  font-size: 17px;
}

.message-row.user .message-avatar {
  background: #f5eaff;
}

.message-bubble {
  max-width: 78%;
  padding: 11px 13px;
  border-radius: 15px;
  background: white;
  color: #444;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-line;
  box-shadow: 0 3px 12px rgba(0,0,0,0.04);
}

.message-row.user .message-bubble {
  border-top-right-radius: 5px;
  background: #e85d91;
  color: white;
}

.message-row.ai .message-bubble {
  border-top-left-radius: 5px;
}

.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px;
}

.typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e85d91;
  animation: typing 1s infinite;
}

.typing span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    opacity: 0.3;
    transform: translateY(0);
  }

  30% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

.quick-section {
  margin: 20px 16px 12px;
}

.quick-title {
  margin-bottom: 9px;
  font-size: 13px;
  font-weight: 800;
  color: #555;
}

.quick-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.quick-buttons button {
  padding: 9px 11px;
  border: 1px solid #f2d8e2;
  border-radius: 14px;
  background: white;
  color: #555;
  font-size: 11px;
}

.input-area {
  position: sticky;
  bottom: 0;
  z-index: 10;
  display: flex;
  gap: 8px;
  padding: 10px 16px calc(
    10px + env(safe-area-inset-bottom)
  );
  background: rgba(255,248,251,0.97);
  border-top: 1px solid #f0e6ea;
}

.input-area input {
  flex: 1;
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid #eadde2;
  border-radius: 18px;
  outline: none;
  background: white;
  color: #333;
  font-size: 13px;
}

.input-area input:focus {
  border-color: #e85d91;
}

.send-button {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: #e85d91;
  color: white;
  font-size: 18px;
}

.send-button:disabled {
  opacity: 0.4;
}
</style>