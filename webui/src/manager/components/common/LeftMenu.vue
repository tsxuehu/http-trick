<template>
    <div class="left-menu">
        <h2>Http Trick</h2>
        <el-menu
                class="el-menu-vertical-demo"
                :default-active="defaultActive"
                @select="handleSelect"
        >
            <template v-for="(item,index) in menuList">
                <div :key="index">
                    <el-submenu :index="index + ''" v-if="item.children">
                        <!-- 菜单标题 -->
                        <template slot="title">
                            <i class="iconfont" :class="item.icon"/>
                            <span class='menu-name'>{{item.name}}</span>
                        </template>
                        <!-- 子菜单 -->
                        <el-menu-item
                                v-for='(child,cindex) in item.children'
                                :style="{'padding-left':'40px'}"
                                :index='index+"-"+cindex'
                                :key="cindex"
                        >
                            <i class="iconfont" :class="child.icon"/>
                            <span class='menu-name'>
                {{ child.name }}
              </span>
                        </el-menu-item>
                    </el-submenu>
                    <!-- 子菜单 -->
                    <el-menu-item :index="index + ''" v-else>
                        <i class="iconfont" :class="item.icon"/>
                        <span class='menu-name'>
              {{ item.name }}
            </span>
                    </el-menu-item>
                </div>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import './left-menu.pcss';
    const menuList = [
        /*{
         name: '请求监控',
         icon: 'icon-bargraph',
         link: '/monitor.html',
         targetBlank: true
         },
         {
         name: '帮助中心',
         icon: 'icon-security',
         link: '/help/index.html',
         targetBlank: true
         }*/
        /* {
         name: '断点',
         icon: 'icon-remind',
         link: '/breakpoint.html',
         targetBlank: true
         },
         {
         name: 'WebSocket Mock',
         icon: 'icon-hot',
         link: '/wsmock.html',
         targetBlank: true
         },*/
    ];

    export default {
        name: 'left-menu',

        data() {
            return {
            };
        },
        computed: {
            menuList() {
                let menu = [{
                    name: '使用说明',
                    icon: 'icon-search',
                    link: 'helpinstall'
                }];
                if (this.$dc.userId == 'root') {
                    menu = menu.concat([
                        {
                            name: '基础配置',
                            icon: 'icon-set',
                            link: 'configure'
                        },
                        {
                            name: '工程路径配置',
                            icon: 'icon-layers',
                            link: 'projectpath'
                        }
                    ]);
                }
                menu = menu.concat([
                    {
                        name: 'Host 管理',
                        icon: 'icon-box',
                        link: 'hostfilelist'
                    },
                    {
                        name: 'Http 过滤器',
                        icon: 'icon-beaker',
                        link: 'filter'
                    },
                    {
                        name: 'Http 转发',
                        icon: 'icon-skip',
                        link: 'rulefilelist'
                    },
                    {
                        name: '自定义 mock 数据',
                        icon: 'icon-suoding',
                        link: 'datalist'
                    },
                    {
                        name: '设备管理',
                        icon: 'icon-bargraph',
                        link: 'device'
                    },
                    {
                        name: 'Socks5配置',
                        icon: 'icon-set',
                        link: 'socks5'
                    },
                ]);

                return menu;
            },

            defaultActive() {
                const { hash } = location;
                let defaultActive = '0';
                this.menuList.forEach((item, index1) => {
                    if (Array.isArray(item)) {

                    } else if (hash.indexOf(item.link) !== -1) {
                        defaultActive = index1 + '';
                    }
                });

                return defaultActive;
            }
        },

        methods: {
            handleSelect(key, keyPath) {
                let item = {};
                if (keyPath.length == 2) {
                    var indexarray = keyPath[1].split('-');
                    item = this.menuList[indexarray[0]]['children'][indexarray[1]];
                } else {
                    item = this.menuList[parseInt(key)];
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
