<template>
  <div class="layout-container">
    <!-- Header -->
    <div class="nav-item">
      <span class="map-label">Ev </span>
      <img src="../assets/ev_icon.webp" alt="Map Icon" class="image-icon" />
      <span class="map-label"> Stations</span>
    </div>

    <div class="main-content">
      <!-- Map Section -->
      <div class="map-container">
        <div id="map"></div>
      </div>

      <!-- Toggle button only on mobile -->
      <div class="map-toggle-bar">
        <button class="show-station-btn" @click="toggleChargerList">
          {{ showChargerList ? 'Hide Stations' : 'Show Stations' }}
        </button>
      </div>

      <!-- Charger List Panel -->
      <div
        class="list-container"
        :class="{ 'show-list': showChargerList || isDesktop }"
      >
        <button class="close-list-btn" v-if="!isDesktop" @click="showChargerList = false">×</button>
        <ChargerList
          :chargers="chargers"
          @add-charger="handleAdd"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ChargerList from '@/components/ChargerList.vue'

export default {
  name: 'MapView',
  components: { ChargerList },
  data() {
    return {
      map: null,
      chargers: [],
      showChargerList: false,
      isDesktop: false
    }
  },
  methods: {
    handleAdd() {
      console.log('Add Charger')
    },
    handleEdit(charger) {
      console.log('Edit:', charger)
    },
    handleDelete(id) {
      console.log('Delete:', id)
    },
    toggleChargerList() {
      this.showChargerList = !this.showChargerList
    },
    checkScreenSize() {
      this.isDesktop = window.innerWidth >= 769
      if (this.isDesktop) {
        this.showChargerList = true
      }
    }
  },
  mounted() {
    this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)

    this.$nextTick(() => {
      this.map = L.map('map').setView([51.505, -0.09], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map)

      fetch('http://localhost:5000/api/station/list')
        .then(res => res.json())
        .then(res => {
          this.chargers = res.data
          this.chargers.forEach(charger => {
            const { latitude, longitude } = charger.location
            const marker = L.marker([latitude, longitude]).addTo(this.map)
            marker.bindPopup(`
              <strong>${charger.name}</strong><br/>
              Latitude: ${latitude.toFixed(6)}<br/>
              Longitude: ${longitude.toFixed(6)}<br/>
              Status: ${charger.status}<br/>
              Power Output: ${charger.powerOutput} kW<br/>
              Connector: ${charger.connectorType}
            `)
          })
        })
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenSize)
  }
}
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  
  overflow: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 20px;
  flex-wrap: wrap;
}

.image-icon {
  width: 40px;
  height: 40px;
}

.map-label {
  color: hsl(152, 53%, 36%);
  font-weight: 400;
  font-size: 2rem;
}

.main-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.map-container {
  flex: none;
  height: 600px;
  padding: 1rem;
  margin: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
}

#map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.map-toggle-bar {
  display: flex;
  justify-content: center;
  padding: 1rem;
  z-index: 2;
}

.show-station-btn {
  padding: 0.6rem 1.2rem;
  background-color: hsl(152, 53%, 36%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
}

.list-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 80%;
  background: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.25);
  transform: translateY(100%);
  transition: transform 0.3s ease-in-out;
  z-index: 10;
  overflow-y: auto;
  padding: 1rem;
}

.list-container.show-list {
  transform: translateY(0);
}

.close-list-btn {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #444;
}


@media (min-width: 769px) {
  .main-content {
   
    padding: 1rem;
  }

  .map-toggle-bar {
    display: none;
  }

  .map-container {
    flex: none;
    height: 300px;
    margin: 1rem;
    border-radius: 12px;
  }

  .list-container {
    position: relative;
    transform: none !important;
    max-height: none;
    overflow-y: auto;
    border-radius: 12px;
    box-shadow: none;
    padding: 1rem;
    margin: 1rem;
    background: #fff;
  }

  .close-list-btn {
    display: none;
  }
}

</style>
