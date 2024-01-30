<template>
  <div class="dashboard-container bg-dark text-white vh-100">
    <NavBar :title="navBarTitle"/>
    <div class="container mt-5">


      <div class="list-group mt-4">
        <div
            v-for="(group, index) in groups"
            :key="index"
            class="list-group-item"
        >
          <div class="d-flex justify-content-between align-items-center">
            <button @click="getUserGroups(group,index)" class="btn btn-link text-start text-decoration-none">
              {{ group.name }}
            </button>
            <div>
              <button @click="openAddUserToGroup(group.group_id,index)" class="btn btn-outline-primary btn-sm me-2">
                Add User
              </button>
              <button @click="deleteGroup(group.id)" class="btn btn-outline-danger btn-sm">
                Delete
              </button>
            </div>
          </div>
          <ul v-if="selectedGroup === index" class="list-group mt-2">
            <li v-for="(user, userIndex) in user_in_group.user" :key="userIndex" class="list-group-item">
              {{ user.name }}
            </li>
          </ul>
        </div>
      </div>

      <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 5;">
        <button @click="openCreateGroup" class="btn btn-primary btn-circle">
          <i class="bi bi-plus"></i>
        </button>
      </div>
      <!-- Modal do tworzenia grupy -->
      <div class="modal fade" id="createGroupModal" tabindex="-1" aria-labelledby="createGroupModalLabel"
           aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="createGroupModalLabel">Create New Group</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <input type="text" class="form-control" placeholder="Group Name" v-model="newGroupName">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="createGroup">Create</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal do dodawania użytkownika do grupy -->
      <div class="modal fade" id="addUserToGroupModal" tabindex="-1" aria-labelledby="addUserToGroupModalLabel"
           aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addUserToGroupModalLabel">Add User to Group</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <input type="text" class="form-control" placeholder="User Email" v-model="userEmailToAdd">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="addUserToGroup">Add</button>
            </div>
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
      navBarTitle: 'Groups',
      groups: [],
      user_in_group: [],
      selectedGroup: null,
      showSettingsView: false,
      alreadyOpenGroup: null,
      newGroupName: '',
      userEmailToAdd: '',
      currentGroupId: null,
      currentGroupListIndex: null,
      errorMessage: '',
      createGroupModalInstance: null,
      addUserToGroupModalInstance: null
    };
  },
  methods: {
    async getUserGroups(index, groupIndexOnList) {
      if (this.alreadyOpenGroup !== groupIndexOnList) {
        this.alreadyOpenGroup = groupIndexOnList
      } else {
        return
      }
      this.user_in_group = []
      try {
        const response = await axios.get('http://localhost:80/api/v1/accounts/userGroup/get_user_group/' + index.group_id, {});
        if (response.statusText === "OK") {
          this.user_in_group = response.data
          console.log(this.user_in_group)
          this.selectedGroup = groupIndexOnList
        }
      } catch (error) {
        this.errorMessage = "Wrong username or password";
      }
    },
    openCreateGroup() {
      this.createGroupModalInstance = new bootstrap.Modal(document.getElementById('createGroupModal'));
      this.createGroupModalInstance.show();
    },
    async createGroup() {
      try {
        const response = await axios.post('http://localhost:80/api/v1/accounts/userGroup/create_group/', {
          name: this.newGroupName,
          owner_id: this.userData.userId
        });

        if (response.status === 201) {
          await this.groupRefresh();
        } else {
          this.errorMessage = response.data.message;
        }
      } catch (error) {
        this.errorMessage = error.response ? error.response.data.message : "Group creation failed";
      }

      // Close the modal after the group is created
      this.createGroupModalInstance.hide();

    },
    openAddUserToGroup(groupId, index) {
      this.currentGroupListIndex = index;
      this.currentGroupId = groupId;
      this.addUserToGroupModalInstance = new bootstrap.Modal(document.getElementById('addUserToGroupModal'));
      this.addUserToGroupModalInstance.show();
    },


    async addUserToGroup() {
      console.log(this.userEmailToAdd)
      console.log(this.currentGroupId)
      try {
        const response = await axios.post('http://localhost:80/api/v1/accounts/userGroup/add_user_to_group', {
          email: this.userEmailToAdd,
          group_id: this.currentGroupId
        });
        console.log(response)
        if (response.status === 201) {

          await this.getUserGroups(this.currentGroupId, this.currentGroupListIndex)
        } else {
          this.errorMessage = response.data.message;
        }

      } catch (error) {
        console.log(error)
        this.errorMessage = error.response ? error.response.data.message : "Failed to add user to group";

      }
      this.addUserToGroupModalInstance.hide();
    },
    deleteGroup(groupId) {
      // Logic to delete the group
    },
    async groupRefresh() {
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
  },

  async mounted() {
    await this.groupRefresh();
  }

};
</script>

<style scoped>
.add-group-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.btn-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
