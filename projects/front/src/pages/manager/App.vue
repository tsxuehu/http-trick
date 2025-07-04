<template>
    <div class="main-wrapper">
        <el-container>
            <el-aside width="200px">
                <left-menu/>
            </el-aside>
            <el-container>
                <el-header height="72px">
                    <manager-header></manager-header>
                </el-header>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>

        <rule-edit-form
                :data-list="dataList"
                :user-id="userId"
                ref="ruleEditForm"></rule-edit-form>

        <rule-test-form ref="ruleTestForm"></rule-test-form>

        <data-create-form ref="dataCreateForm"></data-create-form>
        <data-edit-form ref="dataEitForm"></data-edit-form>
    </div>
</template>

<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'

  import LeftMenu from './components/LeftMenu';
  import Header from './components/Header.vue';

  import RuleEditForm from './form-widget/rule-edit-form/Index.vue'
  import * as RuleEditFormApi from './form-widget/rule-edit-form/index.js'

  import RuleTestForm from './form-widget/rule-test-form/Index.vue'
  import * as RuleTestFormApi from './form-widget/rule-test-form/index.js'

  import DataCreateForm from './form-widget/data-create-form/Index.vue'
  import * as DataCreateFormApi from './form-widget/data-create-form/index.js'

  import DataEitForm from './form-widget/data-edit-form/Index.vue'
  import * as DataEitFormApi from './form-widget/data-edit-form/index.js'

  export default {
    name: 'app',
    components: {
      [LeftMenu.name]: LeftMenu,
      [Header.name]: Header,
      [RuleEditForm.name]: RuleEditForm,
      [RuleTestForm.name]: RuleTestForm,
      [DataCreateForm.name]: DataCreateForm,
      [DataEitForm.name]: DataEitForm,
    },
    data() {
      return {};
    },
    computed: {
      ...mapState([
        'dataList', 'userId'
      ])
    },
    methods: {
      ...mapActions([
        'initStore',
      ]),
    },

    async created() {
      this.initStore();
    },

    mounted() {
      let {ruleEditForm, ruleTestForm, dataCreateForm, dataEitForm} = this.$refs;
      RuleEditFormApi.setInstance(ruleEditForm);
      RuleTestFormApi.setInstance(ruleTestForm);
      DataCreateFormApi.setInstance(dataCreateForm);
      DataEitFormApi.setInstance(dataEitForm);
    }
  };
</script>
