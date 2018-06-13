<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-btn slot="activator" color="primary" dark class="mb-2">New Employee</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <v-text-field
                  label="First name"
                  v-model="editedItem.firstName"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  label="Last name"
                  v-model="editedItem.lastName"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="Email"
                  v-model="editedItem.email"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  mask="phone"
                  label="Mobile"
                  v-model="editedItem.mobile"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="Street"
                  v-model="editedItem.addressModel.street"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  label="Number"
                  v-model="editedItem.addressModel.number"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  label="Colony"
                  v-model="editedItem.addressModel.colony"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  label="State"
                  v-model="editedItem.addressModel.state"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  label="Zip"
                  v-model="editedItem.addressModel.zip"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout row justify-center>
      <v-dialog v-model="confirmDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Notice</v-card-title>
          <v-card-text>Are you sure you want to delete this employee?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="confirmDialog = false">Cancel</v-btn>
            <v-btn color="red darken-1" flat @click.native="deleteItem()">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-card class="elevation-12">
      <v-card-title>
        Employees
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="employees"
        :loading="fetching"
        :search="search"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td class="text-xs-justify">{{ props.item.firstName }}</td>
          <td class="text-xs-justify">{{ props.item.lastName }}</td>
          <td class="text-xs-justify">{{ props.item.email }}</td>
          <td class="text-xs-justify">{{ props.item.mobile }}</td>
          <td class="text-xs-justify">{{ props.item.addressModel.street }}</td>
          <td class="text-xs-justify">{{ props.item.addressModel.number }}</td>
          <td class="text-xs-justify">{{ props.item.addressModel.colony }}</td>
          <td class="text-xs-justify">{{ props.item.addressModel.state }}</td>
          <td class="text-xs-justify">{{ props.item.addressModel.zip }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editItem(props.item)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click="_deleteItem(props.item)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
          </td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{search}}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data: () => {
    return {
      search: '',
      dialog: false,
      confirmDialog: false,
      headers: [
        { text: 'ID', align: 'left', sortable: false, value: 'id' },
        { text: 'First Name', value: 'firstName', sortable: true, align: 'center' },
        { text: 'Last Name', value: 'lastName', sortable: false, align: 'center'  },
        { text: 'Email', value: 'email', sortable: false, align: 'center'  },
        { text: 'Mobile', value: 'mobile', sortable: false, align: 'center'  },
        { text: 'Street', value: 'street', sortable: false, align: 'center'  },
        { text: 'Number', value: 'number', sortable: false, align: 'center'  },
        { text: 'Colony', value: 'colony', sortable: false, align: 'center'  },
        { text: 'State', value: 'state', sortable: false, align: 'center'  },
        { text: 'Zip', value: 'zip', sortable: false, align: 'center'  },
        { text: 'Actions', sortable: false,  align: 'center' }
      ],
      editedIndex: -1,
      editedItem: {
        addressModel: {}
      },
      defaultItem: {
        addressModel: {}
      },
      deletedItem: {
        addressModel: {}
      },
    }
  },
  methods: {
    ...mapActions({
      fetchEmployees: 'employees/fetchEmployees',
      newEmployee: 'employees/newEmployee',
      updateEmployee: 'employees/updateEmployee',
      deleteEmployee: 'employees/deleteEmployee',
    }),
    editItem (item) {
      this.editedIndex = this.employees.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    _deleteItem (item) {
      this.deletedItem = item
      this.confirmDialog = true
    },

    deleteItem() {
      this.deleteEmployee(this.deletedItem)
      this.confirmDialog = false
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        this.updateEmployee(this.editedItem)
      } else {
        console.log(this.editedItem)
        this.newEmployee(this.editedItem)
      }
      this.close()
    }
  },
  computed: {
    ...mapGetters({
      employees: 'employees/employees',
      fetching: 'employees/fetching',
    }),
    formTitle () {
      return this.editedIndex === -1 ? 'New Employee' : 'Edit Employee'
    }
  },
  mounted() {
    this.fetchEmployees()
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
}
</script>
