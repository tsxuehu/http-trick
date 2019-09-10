<template>
    <div class="head-nav">
        <!-- host -->
        <div class="menu-slot">
            <el-dropdown :hide-on-click="false" placement="bottom-start" @command="selectHostFile">
                <el-button type="primary" size="small" :disabled="!enableHost">
                    Host 切换<i class="el-icon-caret-bottom el-icon--right"/>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <!-- host文件 -->
                    <el-dropdown-item
                            v-for="hostfile in hostFileList"
                            :key="hostfile.name"
                            :command="hostfile.name"
                    >
                        {{ hostfile.name }}
                        <i class="el-icon-check" v-if="hostfile.checked"/>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <!-- host开关 -->
            <span>
                <el-switch
                        :value="enableHost"
                        @input="switchHost"
                        active-text=""
                        inactive-text="">
                </el-switch>
            </span>
        </div>
        <!-- 规则 -->
        <div class="menu-slot">
            <el-dropdown :hide-on-click="false" @command="selectRuleFile">
                <el-button type="primary" size="small" :disabled="!enableRule">
                    Rule 设置<i class="el-icon-caret-bottom el-icon--right"/>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <!-- rule文件 -->
                    <el-dropdown-item
                            v-for="rulefile in ruleFileList"
                            :key="rulefile.name"
                            :command="rulefile.name + '-%-' + rulefile.checked"
                    >
                        {{ rulefile.name }}
                        <i class="el-icon-check" v-if="rulefile.checked"/>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <!-- 规则开关 -->
            <span>
                <el-switch
                        :value="enableRule"
                        @input="switchRule"
                        active-text=""
                        inactive-text="">
                </el-switch>
            </span>
        </div>

        <!-- 过滤器 -->
        <div class="menu-slot">
            过滤器开关
            <el-switch
                    :value="enableFilter"
                    @input="switchFilter"
                    active-text=""
                    inactive-text="">
            </el-switch>
        </div>

        <!-- 跳转 -->
        <div class="menu-slot link-blank">
            <a href="/monitor.html" target="_blank">
                <el-button type="text">监控窗</el-button>
            </a>
            <a href="/help/index.html" target="_blank">
                <el-button type="text">帮助中心</el-button>
            </a>
            <a href="javascript:void(0)" v-if="!appInfo.single" @click="changeUser">
                <el-tooltip class="item" effect="dark" content="点击切换用户" placement="top">
                    <el-button type="text">{{userId}}</el-button>
                </el-tooltip>
            </a>
        </div>
    </div>
</template>

<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex';
  import './header.pcss'
  import profileApi from 'src/api/profile';

  export default {
    name: 'ManagerHeader',
    computed: {
      ...mapState([
        'hostFileList',
        'ruleFileList',
        'appInfo', 'userId'
      ]),
      ...mapGetters([
        'enableRule', 'enableHost', 'enableFilter'
      ])
    },
    methods: {
      ...mapActions([
        'selectHostFile',
        'switchHost',
        'switchRule',
        'switchFilter',
        'setFileCheckStatus'
      ]),
      selectRuleFile(command) {
        let kv = command.split('-%-');
        this.setFileCheckStatus({
          ruleFileName: kv[0],
          check: kv[1] == 'false'
        });
      },
      changeUser() {
        this.$prompt('请输入用户名(不输入内容将会使用本机ip作为用户名)', '切换用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async ({value}) => {
          await profileApi.setUserId(value || '');
          // 刷新
          location.reload();
        }).catch(() => {
        });
      }
    }
  };
</script>
