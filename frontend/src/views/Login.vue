<template>
  <div class="container">
    <div class="form-box">
      <h2 class="form-title">{{ isRegister ? 'Create Account' : 'Login to Your Account' }}</h2>
      <p class="form-subtitle">
        {{ isRegister ? 'Fill your information below' : "Welcome back, you’ve been missed" }}
      </p>

      <form @submit.prevent="handleSubmit" novalidate>
        <div v-if="isRegister" class="form-group">
          <label for="name">Name</label>
          <input
            v-model.trim="form.name"
            type="text"
            id="name"
            placeholder="Your Name"
            :class="{ 'input-error': errors.name }"
            required
          />
          <p v-if="errors.name" class="error-msg">{{ errors.name }}</p>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model.trim="form.email"
            type="email"
            id="email"
            placeholder="Enter your email"
            :class="{ 'input-error': errors.email }"
            required
          />
          <p v-if="errors.email" class="error-msg">{{ errors.email }}</p>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            placeholder="Enter your password"
            :class="{ 'input-error': errors.password }"
            required
          />
          <p v-if="errors.password" class="error-msg">{{ errors.password }}</p>
        </div>

        <div v-if="isRegister" class="form-group terms">
          <input type="checkbox" id="agree" v-model="form.agree" />
          <label for="agree" class="terms-label">
            I agree to the <a href="#" class="terms-link">Terms and Conditions</a>
          </label>
          <p v-if="errors.agree" class="error-msg">{{ errors.agree }}</p>
        </div>

        <button
          type="submit"
          class="submit-btn"
          :disabled="isRegister && !form.agree"
        >
          {{ isRegister ? 'Register' : 'Login' }}
        </button>
      </form>

      <p class="toggle-text">
        {{ isRegister ? 'Already have an account?' : "Don't have an account?" }}
        <button @click="toggleForm" class="toggle-btn">
          {{ isRegister ? 'Login here' : 'Create Account' }}
        </button>
      </p>

      <p v-if="serverError" class="server-error">{{ serverError }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "LoginRegisterForm",
  data() {
    return {
      isRegister: false,
      form: {
        name: "",
        email: "",
        password: "",
        agree: false,
      },
      errors: {},
      serverError: null,
    };
  },
  methods: {
    toggleForm() {
      this.isRegister = !this.isRegister;
      this.clearForm();
    },
    clearForm() {
      this.form = { name: "", email: "", password: "", agree: false };
      this.errors = {};
      this.serverError = null;
    },
    validate() {
      this.errors = {};
      let valid = true;

      if (this.isRegister && !this.form.name.trim()) {
        this.errors.name = "Name is required.";
        valid = false;
      }
      if (!this.form.email.trim()) {
        this.errors.email = "Email is required.";
        valid = false;
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email.trim())
      ) {
        this.errors.email = "Invalid email format.";
        valid = false;
      }
      if (!this.form.password) {
        this.errors.password = "Password is required.";
        valid = false;
      } else if (this.form.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters.";
        valid = false;
      }
      if (this.isRegister && !this.form.agree) {
        this.errors.agree = "You must agree to the terms.";
        valid = false;
      }
      return valid;
    },
    async handleSubmit() {
      this.serverError = null;

      if (!this.validate()) return;

      try {
        if (this.isRegister) {
          const response = await axios.post('http://localhost:5000/api/user/register', {
            name: this.form.name.trim(),
            email: this.form.email.trim(),
            password: this.form.password,
          });
          console.log('Registration successful:', response.data);
          alert("Registration successful! Please login.");
          this.toggleForm();
        } else {
          const response = await axios.post('http://localhost:5000/api/user/login', {
            email: this.form.email.trim(),
            password: this.form.password,
          });
           const { success, token, user } = response.data;

    if (success && token) {
      // Store token in localStorage (for non-sensitive data only!)
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Emit login success or navigate
      this.$emit('login-success', user);
      alert("Login successful!");

      
    } else {
      this.serverError = "Invalid credentials. Please try again.";
    }


       
        }
      } catch (error) {
        console.error('API error:', error.response?.data || error.message);
        this.serverError =
          error.response?.data?.message || 'Something went wrong, please try again.';
      }
    },
  },
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Arial', sans-serif;
}

.form-box {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
  color: #0d1013;
}

.form-subtitle {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin-top: -16px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #374151;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"] {
  width: 100%;
  padding: 10px 14px;
  font-size: 15px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-sizing: border-box;
}

.form-group.terms {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.terms-label {
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.terms-link {
  color: #10b981;
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: hsl(138, 67%, 59%);
  color: #ffffff;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover:enabled {
  background-color: hsl(138, 52%, 54%);
}

.submit-btn:disabled {
  background-color: #a7f3d0;
  cursor: not-allowed;
}

.toggle-text {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #6b7280;
}

.toggle-btn {
  background: none;
  border: none;
  color: #25eb5d;
  font-weight: bold;
  cursor: pointer;
  margin-left: 4px;
  padding: 0;
}

.toggle-btn:hover {
  text-decoration: underline;
}
</style>
