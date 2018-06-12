<template>
  <v-layout align-center justify-center>
    <v-flex md10>
      <v-card class="elevation-12">
        <v-card-title>
          Empleados
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Busqueda"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="employees"
          :loading="fetching"
          :search="search"
          rows-per-page-text="Empleados por pagina"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-justify">{{ props.item.price }}</td>
            <td class="text-xs-justify">{{ props.item.description }}</td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="editItem(props.item)">
                <v-icon color="teal">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="_deleteItem(props.item)">
                <v-icon color="pink">delete</v-icon>
              </v-btn>
            </td>
          </template>
          <v-info slot="no-results" :value="true" color="error" icon="warning">
            Tu busqueda para "{{ search }}" no encontró resultados.
          </v-info>
          <template slot="pageText" slot-scope="props">
            Empleados {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
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
        { text: 'Acciones', sortable: false,  align: 'center' }
      ],
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      deletedItem: {},
    }
  },
  methods: {
    ...mapActions({
      fetchEmployees: 'employees/fetchEmployees'
    })
  },
  computed: {
    ...mapGetters({
      employees: 'employees/employees',
      fetching: 'employees/fetching',
    })
  },
  mounted() {
    // this.fetchEmployees()
  }
}
</script>
