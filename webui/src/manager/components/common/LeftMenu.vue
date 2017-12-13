<template>
    <div id='left-menu'>

        <el-menu class="el-menu-vertical-demo" theme="dark" @select="handleSelect">
            <template v-for="(item,index) in menu_list">
                <div :key="index">
                    <template v-if="item.children">
                        <el-submenu :index="index + ''">
                            <!-- 菜单标题 -->
                            <template slot="title">
                                <i class="iconfont" :class="item.icon"></i>
                                <span class='menu-name'>{{item.name}}</span>
                            </template>
                            <!-- 子菜单 -->
                            <el-menu-item v-for='(child,cindex) in item.children' :style="{'padding-left':'40px'}"
                                          :index='index+"-"+cindex' :key="cindex">
                                <i class="iconfont" :class="child.icon"></i>
                                <span class='menu-name'>
                                  {{child.name}}
                                </span>
                            </el-menu-item>
                        </el-submenu>
                    </template>
                    <template v-else>
                        <!-- 子菜单 -->
                        <el-menu-item :index="index + ''">
                            <i class="iconfont" :class="item.icon"></i>
                            <span class='menu-name'>
                              {{item.name}}
                            </span>
                        </el-menu-item>
                    </template>
                </div>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: 'left-menu',
        data() {
            return {
                menu_list: [
                    {
                        name: '基础配置',
                        icon: 'icon-peizhi',
                        link: 'configure'
                    },
                    {
                        name: 'Host管理',
                        icon: 'icon-ip',
                        link: 'hostfilelist'
                    },
                    {
                        name: 'Http转发',
                        icon: 'icon-zhuanfa',
                        link: 'rulefilelist'
                    },
                    {
                        name: '工程路径配置',
                        icon: 'icon-xiangmu',
                        link: 'projectpath'
                    },
                    {
                        name: 'Http过滤器',
                        icon: 'icon-zhuangtai',
                        link: 'filter'
                    },
                    {
                        name: '自定义mock数据',
                        icon: 'icon-iconmockup01',
                        link: 'datalist'
                    },
                    {
                        name: '请求监控',
                        icon: 'icon-networkmonitor',
                        link: '/monitor.html',
                        targetBlank: true
                    },
                    {
                        name: '断点',
                        icon: 'icon-socketio',
                        link: '/breakpoint.html',
                        targetBlank: true
                    },
                    {
                        name: 'WebSocket Mock',
                        icon: 'icon-socketio',
                        link: '/wsmock.html',
                        targetBlank: true
                    },
                    {
                        name: '帮助中心',
                        icon: 'icon-bangzhu',
                        children: [
                            {
                                name: '使用说明',
                                icon: 'icon-neirong',
                                link: 'helpinstall'
                            },
                            {
                                name: '更多帮助',
                                icon: 'icon-more',
                                link: '/help/index.html',
                                targetBlank: true
                            }
                        ]
                    }
                ]
            };
        },
        methods: {
            handleSelect(key, keyPath) {
                let item = {};
                if (keyPath.length == 2) {
                    var indexarray = keyPath[1].split('-');
                    item = this.menu_list[indexarray[0]]['children'][indexarray[1]];
                } else {
                    item = this.menu_list[parseInt(key)];

                }

                if (item.targetBlank) {
                    window.open(item['link']);
                } else {
                    this.$router.push(item['link']);

                }
            }
        }
    };

</script>

<style>
    .fa {
        margin-right: 8px;
    }

    #left-menu {
        height: 100%;
        background: #324057;
        position: relative;
        overflow-x: hidden;
    }

    a {
        color: inherit;
        text-decoration: none;
    }
</style>
