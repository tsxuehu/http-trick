<template>
    <div class="head-nav">
        <!-- host -->
        <el-dropdown menu-align="start" :hide-on-click="false" @command="$dc.selectHostFile">
            <el-button type="primary" size="small">
                Host 切换<i class="el-icon-caret-bottom el-icon--right"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <!-- host文件 -->
                <el-dropdown-item
                        v-for="hostfile in $dc.hostFileList"
                        :command="hostfile.name"
                        :disabled="!$dc.profile.enableHost"
                >
                    {{ hostfile.name }}
                    <i class="el-icon-check" v-if="$dc.hostfile.checked"/>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <!-- host开关 -->
        <span>
            <el-switch
                    :value="$dc.profile.enableHost"
                    @input="$dc.switchHost"
                    active-text="关闭host"
                    inactive-text="启用host">
            </el-switch>
        </span>

        <!-- 规则 -->
        <el-dropdown :hide-on-click="false" menu-align="start" @command="$dc.selectRuleFile">
            <el-button type="primary" size="small">
                Rule 设置<i class="el-icon-caret-bottom el-icon--right"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <!-- rule文件 -->
                <el-dropdown-item
                        v-for="rulefile in $dc.ruleFileList"
                        :command="rulefile.name + '-%-' + rulefile.checked"
                        :disabled="!$dc.profile.enableRule"
                >
                    {{ rulefile.name }}
                    <i class="el-icon-check" v-if="rulefile.checked"/>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <!-- 规则开关 -->
        <span>
                <el-switch
                        :value="$dc.profile.enableRule"
                        @input="$dc.switchRule"
                        active-text="关闭rule"
                        inactive-text="启用rule">
                </el-switch>
            </span>
        <!-- 过滤器 -->
        <span>
            过滤器开关
            <el-switch
                    :value="$dc.profile.enableFilter"
                    @input="$dc.switchFilter"
                    active-text="关闭filter"
                    inactive-text="启用filter">
            </el-switch>
        </span>
        <!-- 跳转 -->
        <a href="/monitor.html" target="_blank">
            监控窗
        </a>
        <a href="/help/index.html" target="_blank">
            帮助中心
        </a>
    </div>
</template>

<script>
    import './header.pcss'
    export default {
        name: 'ManagerHeader'
    };
</script>