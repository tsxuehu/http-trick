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
                    <el-menu-item :index="index + ''">
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

  export default {
    name: 'left-menu',

    data() {
      return {};
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
              name: '转发路径变量',
              icon: 'icon-layers',
              link: 'redirect-path-variable'
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
            name: '代理设置',
            icon: 'icon-set',
            link: 'proxyconfig'
          },
        ]);

        return menu;
      },

      defaultActive() {
        const {hash} = location;
        let defaultActive = '0';
        this.menuList.forEach((item, index1) => {
          if (hash.indexOf(item.link) !== -1) {
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
