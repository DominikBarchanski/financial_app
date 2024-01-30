<template>
  <div class="dashboard-container bg-dark text-white vh-100" :key="refreshKey">
    <NavBar :title="navBarTitle"/>
    <select class="form-select mt-3" aria-label="Select group" @change="fetchExpensesForSelectedGroup">
      <option value="" disabled selected>Select a group</option>
      <option v-for="(group, index) in groups"
              :key="index"
              :value="group.group_id"
      >
        {{ group.name }}
      </option>
    </select>
    <div id="expensesAccordion" >
      <div v-for="(expenses, date) in expenses" :key="date" class="list-group">
        <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center collapsed"
           data-bs-toggle="collapse"
           :data-bs-target="'#collapse' + date" aria-expanded="false" :aria-controls="'collapse' + date">
          {{ date }}
        </a>
        <div :id="'collapse' + date" class="accordion-collapse collapse" :aria-labelledby="'heading' + date"
             data-bs-parent="#expensesAccordion">
          <div class="accordion-body">
            <div class="list-group">
              <a href="#" v-for="(expense, index) in expenses" :key="index"
                 class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                {{ expense.name }}
                <span class="badge bg-primary rounded-pill">{{ expense.price }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
<!--    add new button -->

    <!-- Here you can display the expenses for the selected group -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 5;">
      <button @click="openAddExpanseModal" class="btn btn-primary btn-circle">
        <i class="bi bi-plus"></i>
      </button>
    </div>
    <div class="modal fade" id="addExpanseModal" tabindex="-1" aria-labelledby="createGroupModalLabel"
         aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addNewExpanse">Add New Expanse</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <input type="text" class="form-control" placeholder="Name" v-model="newExpanseName">
            <input type="number" class="form-control" placeholder="Price" v-model="newExpanseValue">
            <input type="number" class="form-control" placeholder="Amount" v-model="newExpanseAmount">
            <input type="date" class="form-control" placeholder="Date" v-model="newExpanseDate">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="createExpanse">Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import NavBar from "../components/NavBar.vue";
import axios from "axios";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
  components: {
    NavBar
  },
  data() {
    const token = Cookies.get('token');
    let username = '';
    let email = '';
    let userId = '';

    if (token) {
      const decodedToken = jwtDecode(token);
      username = decodedToken.username;
      email = decodedToken.email;
      userId = decodedToken.id;
    }

    return {
      userData: {
        username,
        email,
        userId
      },
      selectedGroupId: null,
      showAddExpanseModal: null,
      navBarTitle: 'Expanse',
      newExpanseValue: null,
      newExpanseDate: null,
      newExpanseName: null,
      newExpanseAmount: null,
      groups: [],
      refreshKey: 0,
      expenses: [] // Here you can store the fetched expenses
    }
  },
  methods: {
    async fetchExpensesForSelectedGroup(event) {
      this.selectedGroupId = event.target.value;
      try {
        console.log(this.selectedGroupId)
        const response = await axios.get(`http://localhost:80/api/v1/balance/expense/get_expenses/${this.selectedGroupId}`);
        if (response.statusText === 'OK') {
          this.expenses = response.data.reduce((acc, expanse) => {
            if (!acc[expanse.date]) {
              acc[expanse.date] = [];
            }
            acc[expanse.date].push(expanse);
            return acc;
          }, {}) // Store the fetched expenses

          console.log(this.expenses)
        } else {
          this.errorMessage = response.data.message;
        }
      } catch (error) {
        this.errorMessage = error.response ? error.response.data.message : "Failed to fetch expenses";
      }
    },
    openAddExpanseModal() {
      if (!this.selectedGroupId) {
        alert('Please select a group first')
        return;
      }
      this.showAddExpanseModal = new bootstrap.Modal(document.getElementById('addExpanseModal'), {});
      this.showAddExpanseModal.show();
    },
    async createExpanse() {
      try {
        console.log(this.newExpanseValue, this.newExpanseDate, this.selectedGroupId, this.userData.userId, this.newExpanseAmount, this.newExpanseName)
        const response = await axios.post('http://localhost:80/api/v1/balance/expense/add_expense', {
          group_id: this.selectedGroupId,
          user_id: this.userData.userId,
          price: this.newExpanseValue,
          datetime: this.newExpanseDate,
          amount: this.newExpanseAmount,
          name: this.newExpanseName
        });

        if (response.statusText === 'Created') {
          // Refresh the list of expenses
          this.fetchExpensesForSelectedGroup({ target: { value: this.selectedGroupId } });
        } else {
          this.errorMessage = response.data.message;
        }
      } catch (error) {
        this.errorMessage = error.response ? error.response.data.message : "Failed to fetch expenses";
      }
      this.showAddExpanseModal.hide();
    }
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:80/api/v1/accounts/userGroup/get_groups/' + this.userData.userId);
      if (response.statusText === 'OK') {
        this.groups = response.data;
      } else {
        this.errorMessage = response.data.message;
      }
    } catch (error) {
      this.errorMessage = error.response ? error.response.data.message : "Failed to fetch groups";
    }
  }
}
</script>
<style>
.btn-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
