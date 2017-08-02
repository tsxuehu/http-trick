<template>
    <div id="container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="运行参数" name="runtime">
                <el-table
                        :data="runtimeInfoList" stripe
                        style="width: 100%">
                    <el-table-column
                            type="index"
                            width="60">
                    </el-table-column>
                    <el-table-column
                            property="key"
                            label="key"
                            width="300">
                    </el-table-column>
                    <el-table-column
                            property="value"
                            label="value">
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="基本配置" name="conf">
                <el-table
                        :data="confList" stripe
                        style="width: 100%">
                    <el-table-column
                            type="index"
                            width="60">
                    </el-table-column>
                    <el-table-column
                            property="key"
                            label="key"
                            width="300">
                    </el-table-column>
                    <el-table-column
                            property="value"
                            label="value">
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="HOST" name="host">
                <el-table
                        :data="hostList" stripe
                        style="width: 100%">
                    <el-table-column
                            type="index"
                            width="60">
                    </el-table-column>
                    <el-table-column
                            property="host"
                            label="host"
                            width="300">
                    </el-table-column>
                    <el-table-column
                            property="ip"
                            label="ip">
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="启用的规则" name="rule">
                <el-table
                        row-key="key"
                        :data="$dc.rule" stripe
                        style="width: 100%">
                    <el-table-column
                            type="index"
                            width="60">
                    </el-table-column>
                    <el-table-column
                            property="rcName"
                            label="规则集"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            property="name"
                            label="名字"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            property="method"
                            label="匹配方法"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            property="match"
                            label="匹配串">
                    </el-table-column>
                    <el-table-column
                            type="expand" width="120"
                            label="动作">
                        <template scope="props">
                            {{JSON.stringify(props.row.actionList,null,2)}}
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: 'state',
        data(){
            return {
                activeName: 'runtime',

            }
        },

        computed: {
            hostList(){
                var hosts = [];
                _.forEach(this.$dc.host, (value, key) => {
                    hosts.push({
                        host: key,
                        ip: value
                    })
                });
                _.forEach(this.$dc.globhost, (value, key) => {
                    hosts.push({
                        host: '*' + key,
                        ip: value
                    })
                });
                return hosts;
            },
            runtimeInfoList(){
                var list = [];
                _.forEach(this.$dc.runtime, (value, key) => {
                    list.push({
                        key: key,
                        value: value
                    })
                });
                return list;
            },
            confList(){
                var list = [];
                list.push({
                    key: 'mockServer',
                    value: this.$dc.conf.mockServer
                });
                list.push({
                    key: 'proxyPort',
                    value: this.$dc.conf.proxyPort
                });
                _.forEach(this.$dc.conf.responderParams, (value, key) => {
                    list.push({
                        key: key,
                        value: value
                    })
                });
                return list;
            }
        }

    }
</script>

