<template>
  <div class="form-container">
    <h2 class="form-title">{{ isEdit ? "Edit Charger" : "Create New Charger" }}</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <input v-model="form.name" placeholder="Charger Name" required />
      <input v-model.number="form.latitude" placeholder="Latitude" required />
      <input v-model.number="form.longitude" placeholder="Longitude" required />

      <select v-model="form.status" required>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <input v-model.number="form.powerOutput" placeholder="Power Output (kW)" required />

      <select v-model="form.connectorType" required>
        <option value="Type1">Type1</option>
        <option value="Type2">Type2</option>
        <option value="CCS">CCS</option>
      </select>

      <div class="form-actions">
        <button type="submit" class="btn-submit">
          {{ isEdit ? "Update" : "Submit" }}
        </button>
        <button type="button" @click="$emit('close')" class="btn-cancel">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "AddChargerForm",
  props: {
    editData: Object,
  },
  data() {
    return {
      form: {
        name: "",
        latitude: "",
        longitude: "",
        status: "Active",
        powerOutput: 75,
        connectorType: "Type2",
      },
    };
  },
  computed: {
    isEdit() {
      return !!this.editData;
    },
  },
  mounted() {
    if (this.isEdit) {
      this.form = { ...this.editData };
    }
  },
  methods: {
    async handleSubmit() {
      const url = this.isEdit
        ? `http://localhost:5000/api/station/update/${this.form._id}`
        : "http://localhost:5000/api/station/add";

      const method = this.isEdit ? "PUT" : "POST";

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.form),
        });

        const result = await response.json();
        if (response.ok) {
          alert(this.isEdit ? "Charger updated!" : "Charger created!");
          this.$emit("chargerCreated");
          this.resetForm();
        } else {
          alert("Failed: " + result.message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Submission failed.");
      }
    },
    resetForm() {
      this.form = {
        name: "",
        latitude: "",
        longitude: "",
        status: "Active",
        powerOutput: 75,
        connectorType: "Type2",
      };
    },
  },
};
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 3rem auto;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

input,
select {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

input:focus,
select:focus {
  border-color: #10b981;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-submit {
  flex: 1;
  background-color: #10b981;
  color: white;
  font-size: 1rem;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: #059669;
}

.btn-cancel {
  flex: 1;
  background-color: #f3f4f6;
  color: #374151;
  font-size: 1rem;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel:hover {
  background-color: #e5e7eb;
}
</style>
