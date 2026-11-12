<template>
  <ion-page>
    <ion-content class="page">

      <!-- HEADER -->
      <div class="header">
        <button @click="goBack">←</button>

        <div>
          <p>Wellora</p>
          <h1>Cuaca 🌤️</h1>
        </div>
      </div>


      <!-- CUACA UTAMA -->
      <div class="weather-card">

        <div class="weather-icon">
          {{ weatherIcon }}
        </div>

        <div class="weather-main">

          <p class="location">
            📍 Kendari
          </p>

          <h2 v-if="loading">
            Memuat...
          </h2>

          <h2 v-else-if="error">
            --°C
          </h2>

          <h2 v-else>
            {{ temperature }}°C
          </h2>

          <p>
            {{ weatherDescription }}
          </p>

        </div>

      </div>


      <!-- ERROR -->
      <div
        v-if="error"
        class="error-card"
      >

        <h3>
          ❌ Gagal mengambil data
        </h3>

        <p>
          Pastikan koneksi internet aktif lalu coba lagi.
        </p>

        <button @click="getWeather">
          Coba Lagi
        </button>

      </div>


      <!-- INFORMASI CUACA -->
      <h2 class="title">
        Informasi Cuaca
      </h2>


      <div class="info-grid">

        <!-- SUHU -->
        <div class="info-card">

          <div class="info-icon">
            🌡️
          </div>

          <h3>
            {{ loading || error ? '--' : `${temperature}°C` }}
          </h3>

          <p>
            Suhu
          </p>

        </div>


        <!-- KELEMBAPAN -->
        <div class="info-card">

          <div class="info-icon">
            💧
          </div>

          <h3>
            {{ loading || error ? '--' : `${humidity}%` }}
          </h3>

          <p>
            Kelembapan
          </p>

        </div>


        <!-- ANGIN -->
        <div class="info-card">

          <div class="info-icon">
            💨
          </div>

          <h3>
            {{ loading || error ? '--' : `${windSpeed} km/h` }}
          </h3>

          <p>
            Kecepatan Angin
          </p>

        </div>


        <!-- REKOMENDASI -->
        <div class="info-card">

          <div class="info-icon">
            🏃‍♀️
          </div>

          <h3>
            {{ loading || error ? '--' : exerciseRecommendation }}
          </h3>

          <p>
            Rekomendasi
          </p>

        </div>

      </div>


      <!-- REKOMENDASI WELLORA -->
      <div class="recommendation">

        <div class="recommend-icon">
          🤖
        </div>

        <div class="recommend-content">

          <h3>
            Rekomendasi Wellora
          </h3>

          <p>
            {{ recommendationText }}
          </p>

        </div>

      </div>


      <!-- STATUS -->
      <div
        v-if="lastUpdated"
        class="updated"
      >
        Terakhir diperbarui {{ lastUpdated }}
      </div>


      <!-- REFRESH -->
      <button
        class="refresh-button"
        @click="getWeather"
        :disabled="loading"
      >
        {{ loading ? '⏳ Memuat Cuaca...' : '🔄 Perbarui Cuaca' }}
      </button>


    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import {
  IonPage,
  IonContent
} from '@ionic/vue'

import {
  ref,
  onMounted
} from 'vue'

import {
  useRouter
} from 'vue-router'


const router = useRouter()


/* =========================
   DATA CUACA
========================= */

const temperature =
  ref(0)

const humidity =
  ref(0)

const windSpeed =
  ref(0)

const loading =
  ref(true)

const error =
  ref(false)

const weatherDescription =
  ref('Memuat data...')

const weatherIcon =
  ref('🌤️')

const exerciseRecommendation =
  ref('Menunggu')

const recommendationText =
  ref('Mengambil data cuaca...')

const lastUpdated =
  ref('')


/* =========================
   KEMBALI
========================= */

const goBack = () => {

  router.back()

}


/* =========================
   AMBIL DATA CUACA
========================= */

const getWeather = async () => {

  loading.value = true
  error.value = false

  weatherDescription.value =
    'Memuat data...'

  recommendationText.value =
    'Mengambil data cuaca...'

  try {

    const url =
      'https://api.open-meteo.com/v1/forecast' +
      '?latitude=-3.9985' +
      '&longitude=122.5120' +
      '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m' +
      '&timezone=Asia%2FJakarta'


    const response =
      await fetch(url)


    if (!response.ok) {

      throw new Error(
        'API tidak dapat diakses'
      )

    }


    const data =
      await response.json()


    console.log(
      'Data Open-Meteo:',
      data
    )


    if (
      !data.current
    ) {

      throw new Error(
        'Data cuaca tidak tersedia'
      )

    }


    temperature.value =
      Math.round(
        Number(
          data.current.temperature_2m
        )
      )


    humidity.value =
      Math.round(
        Number(
          data.current.relative_humidity_2m
        )
      )


    windSpeed.value =
      Math.round(
        Number(
          data.current.wind_speed_10m
        )
      )


    const code =
      Number(
        data.current.weather_code
      )


    setWeather(code)


    const now =
      new Date()


    lastUpdated.value =
      now.toLocaleTimeString(
        'id-ID',
        {
          hour: '2-digit',
          minute: '2-digit'
        }
      )


    loading.value = false

  } catch (err) {

    console.error(
      'Error API:',
      err
    )

    error.value = true
    loading.value = false

    weatherIcon.value =
      '🌤️'

    weatherDescription.value =
      'Data tidak tersedia'

    exerciseRecommendation.value =
      'Tidak diketahui'

    recommendationText.value =
      'Data cuaca belum berhasil diambil. Coba perbarui kembali saat koneksi internet tersedia.'

  }

}


/* =========================
   TENTUKAN KONDISI CUACA
========================= */

const setWeather = (
  code: number
) => {

  /*
   * WEATHER CODE OPEN-METEO
   *
   * 0       = Cerah
   * 1 - 3   = Berawan
   * 45 - 48 = Kabut
   * 51 - 57 = Gerimis
   * 61 - 67 = Hujan
   * 71 - 77 = Salju
   * 80 - 82 = Hujan
   * 85 - 86 = Hujan salju
   * 95 - 99 = Badai petir
   */


  /* CERAH */

  if (code === 0) {

    weatherIcon.value =
      '☀️'

    weatherDescription.value =
      'Cerah'

    exerciseRecommendation.value =
      'Outdoor'

    recommendationText.value =
      'Cuaca cerah cocok untuk jogging, jalan kaki, atau bersepeda di luar ruangan.'

    return

  }


  /* BERAWAN */

  if (
    code >= 1 &&
    code <= 3
  ) {

    weatherIcon.value =
      '⛅'

    weatherDescription.value =
      'Berawan'

    exerciseRecommendation.value =
      'Outdoor'

    recommendationText.value =
      'Cuaca cukup nyaman untuk jogging, jalan kaki, atau olahraga outdoor ringan.'

    return

  }


  /* KABUT */

  if (
    code >= 45 &&
    code <= 48
  ) {

    weatherIcon.value =
      '🌫️'

    weatherDescription.value =
      'Berkabut'

    exerciseRecommendation.value =
      'Ringan'

    recommendationText.value =
      'Pilih olahraga ringan dan hindari aktivitas outdoor terlalu lama saat jarak pandang berkurang.'

    return

  }


  /* GERIMIS */

  if (
    code >= 51 &&
    code <= 57
  ) {

    weatherIcon.value =
      '🌦️'

    weatherDescription.value =
      'Gerimis'

    exerciseRecommendation.value =
      'Indoor'

    recommendationText.value =
      'Cuaca sedang gerimis. Yoga, stretching, atau workout indoor lebih cocok.'

    return

  }


  /* HUJAN */

  if (
    code >= 61 &&
    code <= 67
  ) {

    weatherIcon.value =
      '🌧️'

    weatherDescription.value =
      'Hujan'

    exerciseRecommendation.value =
      'Indoor'

    recommendationText.value =
      'Sedang hujan. Sebaiknya lakukan olahraga indoor seperti yoga, stretching, atau home workout.'

    return

  }


  /* SALJU */

  if (
    code >= 71 &&
    code <= 77
  ) {

    weatherIcon.value =
      '🌨️'

    weatherDescription.value =
      'Salju'

    exerciseRecommendation.value =
      'Indoor'

    recommendationText.value =
      'Kondisi kurang cocok untuk olahraga outdoor. Pilih aktivitas indoor yang ringan.'

    return

  }


  /* HUJAN LEBAT */

  if (
    code >= 80 &&
    code <= 82
  ) {

    weatherIcon.value =
      '🌧️'

    weatherDescription.value =
      'Hujan Lebat'

    exerciseRecommendation.value =
      'Indoor'

    recommendationText.value =
      'Hujan cukup deras. Sebaiknya pilih workout indoor dan hindari aktivitas outdoor.'

    return

  }


  /* HUJAN SALJU */

  if (
    code >= 85 &&
    code <= 86
  ) {

    weatherIcon.value =
      '🌨️'

    weatherDescription.value =
      'Hujan Salju'

    exerciseRecommendation.value =
      'Indoor'

    recommendationText.value =
      'Pilih aktivitas indoor dan hindari olahraga di luar ruangan.'

    return

  }


  /* BADAI PETIR */

  if (
    code >= 95 &&
    code <= 99
  ) {

    weatherIcon.value =
      '⛈️'

    weatherDescription.value =
      'Badai Petir'

    exerciseRecommendation.value =
      'Indoor'

    recommendationText.value =
      'Cuaca dengan petir tidak cocok untuk olahraga outdoor. Pilih workout indoor.'

    return

  }


  /* KONDISI LAIN */

  weatherIcon.value =
    '🌤️'

  weatherDescription.value =
    'Kondisi Berubah'

  exerciseRecommendation.value =
    'Ringan'

  recommendationText.value =
    'Pilih olahraga ringan dan perhatikan kondisi cuaca sebelum beraktivitas.'


}


/* =========================
   JALANKAN SAAT HALAMAN DIBUKA
========================= */

onMounted(() => {

  getWeather()

})

</script>


<style scoped>

.page {
  --background: #fffafc;
  padding-bottom: 30px;
}


/* =========================
   HEADER
========================= */

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


/* =========================
   WEATHER CARD
========================= */

.weather-card {
  margin: 10px 20px;
  padding: 25px;
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

.weather-icon {
  font-size: 60px;
}

.weather-main {
  flex: 1;
}

.location {
  margin: 0;
  font-size: 13px;
}

.weather-card h2 {
  margin: 5px 0;
  font-size: 32px;
}

.weather-card p:last-child {
  margin: 0;
  font-size: 13px;
}


/* =========================
   ERROR
========================= */

.error-card {
  margin: 15px 20px;
  padding: 18px;
  background: #ffe0eb;
  border-radius: 20px;
}

.error-card h3 {
  margin: 0;
  font-size: 14px;
}

.error-card p {
  margin: 5px 0 12px;
  font-size: 12px;
  line-height: 1.5;
}

.error-card button {
  border: none;
  background: #ff5c9a;
  color: white;
  padding: 9px 15px;
  border-radius: 12px;
}


/* =========================
   TITLE
========================= */

.title {
  margin: 22px 20px 10px;
  font-size: 18px;
}


/* =========================
   INFO
========================= */

.info-grid {
  padding: 0 20px;

  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 10px;
}

.info-card {
  background: white;
  padding: 18px;
  border-radius: 20px;
}

.info-icon {
  font-size: 25px;
}

.info-card h3 {
  margin: 8px 0 3px;
  color: #ff5c9a;
  font-size: 16px;
}

.info-card p {
  margin: 0;
  color: #888;
  font-size: 11px;
}


/* =========================
   RECOMMENDATION
========================= */

.recommendation {
  margin: 18px 20px;
  padding: 18px;
  border-radius: 20px;
  background: #fff0a8;

  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.recommend-icon {
  width: 45px;
  height: 45px;
  border-radius: 15px;
  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 23px;
  flex-shrink: 0;
}

.recommend-content {
  flex: 1;
}

.recommendation h3 {
  margin: 0;
  font-size: 14px;
}

.recommendation p {
  margin: 5px 0 0;
  font-size: 11px;
  line-height: 1.5;
}


/* =========================
   LAST UPDATED
========================= */

.updated {
  text-align: center;
  color: #999;
  font-size: 10px;
  margin: 8px 20px;
}


/* =========================
   REFRESH
========================= */

.refresh-button {
  display: block;

  margin: 15px 20px;

  width: calc(100% - 40px);

  padding: 14px;

  border: none;
  border-radius: 15px;

  background: #ff5c9a;
  color: white;

  font-size: 13px;
}

.refresh-button:disabled {
  opacity: 0.6;
}

</style>