
<template>
  <div>
    <div v-if="this.userCourant.id_role===1"><dashboard-utilisateur></dashboard-utilisateur></div>
    <div v-if="this.userCourant.id_role===2"><dashboard-admin></dashboard-admin></div>
  </div>
</template>

<script>

import {mapState} from "vuex";
import DashboardUtilisateur from "@/components/Profil/ProfilUtilisateur.vue";
import DashboardAdmin from "@/components/Profil/ProfilAdmin.vue";
export default {
  name: 'ProfilView',
  components: {
    DashboardUtilisateur,
    DashboardAdmin
  },

  data() {
    return {}
  },

  computed: {
    ...mapState('user',['userCourant'])
  },

  methods: {
    test() {
      console.log('info user: ',this.userCourant)
    },
  },


  mounted() {

  }
}


</script>

<style scoped>

</style>