<template>
    <div>
      <b-nav-item-dropdown right no-caret>
        <template slot="button-content">
          <i class="icon-settings header-setting-icon"></i>
        </template>
        <b-dropdown-header tag="div" class="text-center"><strong>Member</strong></b-dropdown-header>
        <b-dropdown-item @click="showModal('invite')"><i class="fa fa-user"></i> メンバー招待</b-dropdown-item>
        <b-dropdown-header tag="div" class="text-center"><strong>Settings</strong></b-dropdown-header>
        <b-dropdown-item @click="showModal('personal')"><i class="fa fa-cog"></i> 個人設定</b-dropdown-item>
        <b-dropdown-item @click="showModal('company')"><i class="fa fa-cogs"></i> 会社設定</b-dropdown-item>
        <b-dropdown-item @click="logout"><i class="fa fa-lock"></i> Logout</b-dropdown-item>
      </b-nav-item-dropdown>
      <PersonalSettingModal v-if="showModalPersonal" @close="closeModal('personal')" />
      <CompanySettingModal v-if="showModalCompany" @close="closeModal('company')" />
      <InviteModal v-if="showModalInvite" @close="closeModal('invite')" />
    </div>
</template>

<script>
  import PersonalSettingModal from '../Modal/PersonalSettingModal'
  import CompanySettingModal from '../Modal/CompanySettingModal'
  import InviteModal from '../Modal/InviteModal'

  export default {
    name: 'header-dropdown',
    components: {
      PersonalSettingModal,
      CompanySettingModal,
      InviteModal,
    },
    data: () => {
      return {
        showModalInvite: false,
        showModalPersonal: false,
        showModalCompany: false,
      }
    },
    methods: {
      async logout() {
        const response = await this.$store.dispatch('auth/logout');
        if (response.status) {
          this.$router.go({path: this.$router.currentRoute.path, force: true});
        }
      },
      showModal(type) {
        switch (type) {
          case 'invite':
            this.showModalInvite = true;
            break;
          case 'personal':
            this.showModalPersonal = true;
            break;
          case 'company':
            this.showModalCompany = true;
            break;
          default:
            break;
        }
      },
      closeModal(type) {
        switch (type) {
          case 'invite':
            this.showModalInvite = false;
            break;
          case 'personal':
            this.showModalPersonal = false;
            break;
          case 'company':
            this.showModalCompany = false;
            break;
          default:
            break;
        }
      }
    }
  }
</script>

