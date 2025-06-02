<template>
  <div class="container">
    <h2 class="page-title">All Stations</h2>
    <p class="page-subtitle">Browse and manage all available charging stations below.</p>

    <!-- Search and Mobile Filter/Add Buttons -->
    <div class="search-header">
      <input v-model="search" placeholder="Search by name" class="input" />

      <!-- Shown only in mobile view -->
      <div class="mobile-header-actions">
        <button class="mobile-filter-btn" @click="showFilters = !showFilters">Filters</button>
        <button class="add-btn mobile-only" @click="openAddForm">+</button>
      </div>
    </div>

    <!-- Filters Panel -->
    <div class="filters" :class="{ 'show-panel': showFilters }">
      <button class="close-filter-btn" @click="showFilters = false">&times;</button>

      <select v-model="filters.status" class="select">
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <select v-model="filters.connectorType" class="select">
        <option value="">All Connector</option>
        <option value="Type1">Type1</option>
        <option value="Type2">Type2</option>
        <option value="CCS">CCS</option>
      </select>

      <select v-model.number="filters.powerOutput" class="select">
        <option value="">All Power</option>
        <option :value="50">50 kW</option>
        <option :value="75">75 kW</option>
        <option :value="100">100 kW</option>
      </select>

      <!-- Only visible on desktop -->
      <button class="add-btn desktop-only" @click="openAddForm">+</button>
    </div>

    <!-- Modal -->
    <div v-if="showForm" class="modal-overlay">
      <div class="modal-content">
        <AddChargerForm
          :edit-data="editData"
          @chargerCreated="onChargerSaved"
          @close="closeForm"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-spinner">Loading chargers...</div>

    <!-- Charger List -->
    <div v-else class="charger-bar">
      <div v-for="charger in filteredChargers" :key="charger._id" class="charger-card">
        <h3 class="card-name">{{ charger.name }}</h3>
        <p>Status: {{ charger.status }}</p>
        <p>Power: {{ charger.powerOutput }} kW</p>
        <p>Connector: {{ charger.connectorType }}</p>
        <div class="actions">
          <Edit2 class="icon edit-icon" @click="editCharger(charger)" />
          <Trash2 class="icon delete-icon" @click="deleteCharger(charger._id)" />
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { Edit2, Trash2 } from 'lucide-vue-next';
import AddChargerForm from '@/components/AddChargerForm.vue';

const chargers = ref([]);
const search = ref('');
const showFilters = ref(false);
const showForm = ref(false);
const editData = ref(null);
const loading = ref(true);

const filters = ref({
  status: '',
  powerOutput: '',
  connectorType: '',
});

const fetchChargers = () => {
  loading.value = true;
  fetch('https://ev-charge-project.onrender.com')
    .then(res => res.json())
    .then(res => {
      chargers.value = res.data;
    })
    .catch(err => console.error('Failed to fetch chargers:', err))
    .finally(() => {
      loading.value = false;
    });
};

const deleteCharger = (id) => {
  if (confirm('Are you sure you want to delete this charger?')) {
    fetch(`https://ev-charge-project.onrender.com/api/station/remove/${id}`, { method: 'DELETE' })
      .then(() => fetchChargers())
      .catch(err => console.error('Delete failed:', err));
  }
};

const openAddForm = () => {
  editData.value = null;
  showForm.value = true;
};

const editCharger = (charger) => {
  editData.value = { ...charger };
  showForm.value = true;
};

const onChargerSaved = () => {
  fetchChargers();
  closeForm();
};

const closeForm = () => {
  showForm.value = false;
  editData.value = null;
};

const filteredChargers = computed(() => {
  return chargers.value.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.value.toLowerCase());
    const matchesStatus = !filters.value.status || c.status === filters.value.status;
    const matchesConnector = !filters.value.connectorType || c.connectorType === filters.value.connectorType;
    const matchesPower = !filters.value.powerOutput || c.powerOutput === filters.value.powerOutput;
    return matchesSearch && matchesStatus && matchesConnector && matchesPower;
  });
});

onMounted(fetchChargers);
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  justify-content: center;
}

.page-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #1e40af;
  margin: 1.5rem 0 0.5rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
}

.page-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background-color: #1e40af;
  margin: 0.5rem auto 0;
  border-radius: 2px;
}

.page-subtitle {
  text-align: center;
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
}

.search-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  gap: 1rem;
  flex-wrap: wrap;
  background: white;
  position: sticky;
  top: 0;
  z-index: 20;
}

.input {
  flex: 1;
  min-width: 180px;
  max-width: 300px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 10px;
  border: 2px solid #ccc;
}

.select {
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border-radius: 10px;
  border: 2px solid #ccc;
  width: 100%;
  max-width: 300px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem 2rem;
  background: white;
  position: relative;
}

.add-btn {
  background-color: #22c55e;
  color: white;
  font-size: 2rem;
  padding: 0.5rem 1rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  height: 48px;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-header-actions {
  display: none;
}

.mobile-filter-btn {
  background-color: hsl(152, 53%, 36%);
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

/* Scrollable charger list */
.charger-bar {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 2rem;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.charger-card {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.charger-card:hover {
  background-color: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.card-name {
  font-size: x-large;
  margin-bottom: 0.5rem;
}

.actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.icon {
  cursor: pointer;
  width: 24px;
  height: 24px;
  stroke-width: 2;
}

.edit-icon {
  color: #4caf50;
}

.delete-icon {
  color: #f44336;
}

.loading-spinner {
  text-align: center;
  padding: 2rem;
  font-size: 1.25rem;
  color: #666;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Responsive Mobile Styles */
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  .mobile-header-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .filters {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 80%;
    max-width: 320px;
    background: white;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    z-index: 99;
    overflow-y: auto;
  }

  .filters.show-panel {
    transform: translateX(0);
  }

  .close-filter-btn {
    display: block;
    background: #f44336;
    color: white;
    font-size: 1.5rem;
    border: none;
    align-self: flex-end;
    border-radius: 8px;
    padding: 0.5rem;
    cursor: pointer;
  }

  .select {
    font-size: 0.9rem;
    padding: 0.4rem 0.6rem;
    max-height: 36px;
  }

  .input {
    font-size: 0.95rem;
    padding: 0.6rem 1rem;
  }
}
</style>
