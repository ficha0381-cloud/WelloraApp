let databaseReady = false

const DB_NAME = 'WelloraDB'
const DB_VERSION = 1

const TARGETS_STORE = 'targets'
const WORKOUTS_STORE = 'workouts'
const PROFILES_STORE = 'profiles'

const STORAGE_KEY = 'wellora_targets'

/* =========================
   TYPE
========================= */

export interface Target {
  id: number
  name: string
  minutes: number
  progress: number
  icon: string
}

export interface Workout {
  id?: number
  name: string
  type: string
  duration: number
  date: string
}

export interface Profile {
  id: number
  name: string
  age: number
  weight: number
  height: number
  goal: string
}

let db: IDBDatabase | null = null

/* =========================
   BUKA DATABASE
========================= */

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      DB_NAME,
      DB_VERSION
    )

    request.onupgradeneeded = () => {
      const database = request.result

      /* TARGETS */
      if (!database.objectStoreNames.contains(TARGETS_STORE)) {
        const targetsStore = database.createObjectStore(
          TARGETS_STORE,
          {
            keyPath: 'id',
            autoIncrement: true
          }
        )

        targetsStore.createIndex(
          'name',
          'name',
          {
            unique: false
          }
        )
      }

      /* WORKOUTS */
      if (!database.objectStoreNames.contains(WORKOUTS_STORE)) {
        const workoutsStore = database.createObjectStore(
          WORKOUTS_STORE,
          {
            keyPath: 'id',
            autoIncrement: true
          }
        )

        workoutsStore.createIndex(
          'date',
          'date',
          {
            unique: false
          }
        )
      }

      /* PROFILES */
      if (!database.objectStoreNames.contains(PROFILES_STORE)) {
        database.createObjectStore(
          PROFILES_STORE,
          {
            keyPath: 'id'
          }
        )
      }
    }

    request.onsuccess = () => {
      const database = request.result

      database.onclose = () => {
        db = null
        databaseReady = false
      }

      resolve(database)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

/* =========================
   PASTIKAN DATABASE SIAP
========================= */

const ensureDatabase = async (): Promise<IDBDatabase> => {
  if (db && databaseReady) {
    return db
  }

  const database = await openDatabase()

  db = database
  databaseReady = true

  return database
}

/* =========================
   BACA TARGET DARI LOCALSTORAGE
   UNTUK MIGRASI DATA LAMA
========================= */

const getOldTargets = (): Target[] => {
  try {
    const data = localStorage.getItem(
      STORAGE_KEY
    )

    if (!data) {
      return []
    }

    const parsed = JSON.parse(data)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
  } catch (error) {
    console.error(
      'Gagal membaca target lama:',
      error
    )

    return []
  }
}

/* =========================
   SIMPAN TARGET KE DATABASE
========================= */

const addTargetToDatabase = (
  target: Target
): Promise<void> => {
  return new Promise(
    (resolve, reject) => {
      if (!db) {
        reject(
          new Error(
            'Database belum siap'
          )
        )

        return
      }

      const transaction = db.transaction(
        TARGETS_STORE,
        'readwrite'
      )

      const store =
        transaction.objectStore(
          TARGETS_STORE
        )

      store.put(target)

      transaction.oncomplete = () => {
        resolve()
      }

      transaction.onerror = () => {
        reject(transaction.error)
      }
    }
  )
}

/* =========================
   MIGRASI TARGET LAMA
========================= */

const migrateOldTargets = async () => {
  const oldTargets = getOldTargets()

  if (oldTargets.length === 0) {
    return
  }

  try {
    for (const target of oldTargets) {
      await addTargetToDatabase(target)
    }

    console.log(
      'Target lama berhasil dipindahkan ke database Wellora'
    )
  } catch (error) {
    console.error(
      'Gagal memindahkan target lama:',
      error
    )
  }
}

/* =========================
   INIT DATABASE
========================= */

export const initDatabase = async () => {
  try {
    db = await openDatabase()

    databaseReady = true

    await migrateOldTargets()

    console.log(
      'Database Wellora siap digunakan di browser'
    )

    console.log(
      'Database:',
      DB_NAME
    )

    return db
  } catch (error) {
    databaseReady = false

    console.error(
      'Gagal membuka database Wellora:',
      error
    )

    return null
  }
}

/* =========================================================
   WORKOUT
========================================================= */

/* =========================
   TAMBAH WORKOUT
========================= */

export const addWorkout = async (
  workout: Workout
): Promise<number> => {
  const database = await ensureDatabase()

  return new Promise(
    (resolve, reject) => {
      const transaction = database.transaction(
        WORKOUTS_STORE,
        'readwrite'
      )

      const store =
        transaction.objectStore(
          WORKOUTS_STORE
        )

      const data = {
        name: workout.name,
        type: workout.type,
        duration: Number(workout.duration) || 0,
        date: workout.date || new Date().toISOString()
      }

      const request = store.add(data)

      request.onsuccess = () => {
        resolve(
          Number(request.result)
        )
      }

      request.onerror = () => {
        reject(request.error)
      }
    }
  )
}

/* =========================
   AMBIL SEMUA WORKOUT
========================= */

export const getWorkouts = async (): Promise<Workout[]> => {
  const database = await ensureDatabase()

  return new Promise(
    (resolve, reject) => {
      const transaction = database.transaction(
        WORKOUTS_STORE,
        'readonly'
      )

      const store =
        transaction.objectStore(
          WORKOUTS_STORE
        )

      const request = store.getAll()

      request.onsuccess = () => {
        const workouts = request.result as Workout[]

        workouts.sort(
          (a, b) => {
            return (
              new Date(b.date).getTime() -
              new Date(a.date).getTime()
            )
          }
        )

        resolve(workouts)
      }

      request.onerror = () => {
        reject(request.error)
      }
    }
  )
}

/* =========================
   HAPUS WORKOUT
========================= */

export const deleteWorkout = async (
  id: number
): Promise<void> => {
  const database = await ensureDatabase()

  return new Promise(
    (resolve, reject) => {
      const transaction = database.transaction(
        WORKOUTS_STORE,
        'readwrite'
      )

      const store =
        transaction.objectStore(
          WORKOUTS_STORE
        )

      const request = store.delete(
        Number(id)
      )

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    }
  )
}

/* =========================================================
   TARGET
========================================================= */

/* =========================
   AMBIL TARGET
========================= */

export const getTargets = async (): Promise<Target[]> => {
  const database = await ensureDatabase()

  return new Promise(
    (resolve, reject) => {
      const transaction = database.transaction(
        TARGETS_STORE,
        'readonly'
      )

      const store =
        transaction.objectStore(
          TARGETS_STORE
        )

      const request = store.getAll()

      request.onsuccess = () => {
        resolve(
          request.result as Target[]
        )
      }

      request.onerror = () => {
        reject(request.error)
      }
    }
  )
}

/* =========================
   TAMBAH TARGET
========================= */

export const addTarget = async (
  target: Omit<Target, 'id'>
): Promise<number> => {
  const database = await ensureDatabase()

  return new Promise(
    (resolve, reject) => {
      const transaction = database.transaction(
        TARGETS_STORE,
        'readwrite'
      )

      const store =
        transaction.objectStore(
          TARGETS_STORE
        )

      const request = store.add(target)

      request.onsuccess = () => {
        resolve(
          Number(request.result)
        )
      }

      request.onerror = () => {
        reject(request.error)
      }
    }
  )
}

/* =========================
   UPDATE TARGET
========================= */

export const updateTarget = async (
  target: Target
): Promise<void> => {
  const database = await ensureDatabase()

  return new Promise(
    (resolve, reject) => {
      const transaction = database.transaction(
        TARGETS_STORE,
        'readwrite'
      )

      const store =
        transaction.objectStore(
          TARGETS_STORE
        )

      const request = store.put(target)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    }
  )
}

/* =========================
   HAPUS TARGET
========================= */

export const deleteTarget = async (
  id: number
): Promise<void> => {
  const database = await ensureDatabase()

  return new Promise(
    (resolve, reject) => {
      const transaction = database.transaction(
        TARGETS_STORE,
        'readwrite'
      )

      const store =
        transaction.objectStore(
          TARGETS_STORE
        )

      const request = store.delete(
        Number(id)
      )

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    }
  )
}

/* =========================================================
   PROFILE
========================================================= */

/* =========================
   SIMPAN PROFILE
========================= */

export const saveProfile = async (
  profile: Omit<Profile, 'id'> | Profile
): Promise<void> => {
  const database = await ensureDatabase()

  return new Promise(
    (resolve, reject) => {
      const transaction = database.transaction(
        PROFILES_STORE,
        'readwrite'
      )

      const store =
        transaction.objectStore(
          PROFILES_STORE
        )

      const data: Profile = {
        id: 1,
        name: profile.name || '',
        age: Number(profile.age) || 0,
        weight: Number(profile.weight) || 0,
        height: Number(profile.height) || 0,
        goal: profile.goal || ''
      }

      const request = store.put(data)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    }
  )
}

/* =========================
   AMBIL PROFILE
========================= */

export const getProfile = async (): Promise<Profile | null> => {
  const database = await ensureDatabase()

  return new Promise(
    (resolve, reject) => {
      const transaction = database.transaction(
        PROFILES_STORE,
        'readonly'
      )

      const store =
        transaction.objectStore(
          PROFILES_STORE
        )

      const request = store.get(1)

      request.onsuccess = () => {
        resolve(
          request.result
            ? request.result as Profile
            : null
        )
      }

      request.onerror = () => {
        reject(request.error)
      }
    }
  )
}

/* =========================================================
   DATABASE API LAMA
   QUERY / RUN
========================================================= */

export const getDatabase = () => {
  if (!databaseReady || !db) {
    return null
  }

  return {
    /* =====================
       QUERY
    ===================== */

    async query(sql: string) {
      const lowerSql =
        sql.toLowerCase()

      /* SELECT TARGETS */
      if (
        lowerSql.includes(
          'select * from targets'
        )
      ) {
        return new Promise(
          (
            resolve,
            reject
          ) => {
            if (!db) {
              reject(
                new Error(
                  'Database belum siap'
                )
              )

              return
            }

            const transaction = db.transaction(
              TARGETS_STORE,
              'readonly'
            )

            const store =
              transaction.objectStore(
                TARGETS_STORE
              )

            const request =
              store.getAll()

            request.onsuccess = () => {
              resolve({
                values:
                  request.result
              })
            }

            request.onerror = () => {
              reject(request.error)
            }
          }
        )
      }

      /* SELECT WORKOUTS */
      if (
        lowerSql.includes(
          'select * from workouts'
        )
      ) {
        return new Promise(
          (
            resolve,
            reject
          ) => {
            if (!db) {
              reject(
                new Error(
                  'Database belum siap'
                )
              )

              return
            }

            const transaction = db.transaction(
              WORKOUTS_STORE,
              'readonly'
            )

            const store =
              transaction.objectStore(
                WORKOUTS_STORE
              )

            const request =
              store.getAll()

            request.onsuccess = () => {
              resolve({
                values:
                  request.result
              })
            }

            request.onerror = () => {
              reject(request.error)
            }
          }
        )
      }

      /* SELECT PROFILE */
      if (
        lowerSql.includes(
          'select * from profiles'
        )
      ) {
        return new Promise(
          (
            resolve,
            reject
          ) => {
            if (!db) {
              reject(
                new Error(
                  'Database belum siap'
                )
              )

              return
            }

            const transaction = db.transaction(
              PROFILES_STORE,
              'readonly'
            )

            const store =
              transaction.objectStore(
                PROFILES_STORE
              )

            const request =
              store.get(1)

            request.onsuccess = () => {
              resolve({
                values:
                  request.result
                    ? [request.result]
                    : []
              })
            }

            request.onerror = () => {
              reject(request.error)
            }
          }
        )
      }

      return {
        values: []
      }
    },

    /* =====================
       RUN
    ===================== */

    async run(
      sql: string,
      values: any[] = []
    ) {
      const lowerSql =
        sql.toLowerCase()

      /* INSERT TARGET */
      if (
        lowerSql.includes(
          'insert into targets'
        )
      ) {
        const id = await addTarget({
          name:
            values[0] || 'Target',
          minutes:
            Number(values[1]) || 0,
          progress:
            Number(values[2]) || 0,
          icon:
            values[3] || '🎯'
        })

        return {
          changes: {
            changes: 1
          },
          lastInsertId: id
        }
      }

      /* DELETE TARGET */
      if (
        lowerSql.includes(
          'delete from targets'
        )
      ) {
        await deleteTarget(
          Number(values[0])
        )

        return {
          changes: {
            changes: 1
          }
        }
      }

      /* INSERT WORKOUT */
      if (
        lowerSql.includes(
          'insert into workouts'
        )
      ) {
        const id = await addWorkout({
          name:
            values[0] ||
            'Aktivitas',
          type:
            values[1] ||
            'Lainnya',
          duration:
            Number(values[2]) || 0,
          date:
            values[3] ||
            new Date().toISOString()
        })

        return {
          changes: {
            changes: 1
          },
          lastInsertId: id
        }
      }

      /* DELETE WORKOUT */
      if (
        lowerSql.includes(
          'delete from workouts'
        )
      ) {
        await deleteWorkout(
          Number(values[0])
        )

        return {
          changes: {
            changes: 1
          }
        }
      }

      /* SAVE PROFILE */
      if (
        lowerSql.includes(
          'insert into profiles'
        ) ||
        lowerSql.includes(
          'update profiles'
        )
      ) {
        await saveProfile({
          id: 1,
          name:
            values[0] || '',
          age:
            Number(values[1]) || 0,
          weight:
            Number(values[2]) || 0,
          height:
            Number(values[3]) || 0,
          goal:
            values[4] || ''
        })

        return {
          changes: {
            changes: 1
          }
        }
      }

      return {
        changes: {
          changes: 0
        }
      }
    }
  }
}

/* =========================================================
   CLEAR DATABASE
========================================================= */

export const clearWelloraDatabase = async (): Promise<void> => {
  const database = await ensureDatabase()

  return new Promise(
    (resolve, reject) => {
      const transaction = database.transaction(
        [
          TARGETS_STORE,
          WORKOUTS_STORE,
          PROFILES_STORE
        ],
        'readwrite'
      )

      transaction.objectStore(
        TARGETS_STORE
      ).clear()

      transaction.objectStore(
        WORKOUTS_STORE
      ).clear()

      transaction.objectStore(
        PROFILES_STORE
      ).clear()

      transaction.oncomplete = () => {
        resolve()
      }

      transaction.onerror = () => {
        reject(transaction.error)
      }
    }
  )
}