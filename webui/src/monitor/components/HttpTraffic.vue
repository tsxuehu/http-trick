<template>
    <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition"
         style="width: 100%; height: 250px;" :style="{'width': '100%','height':height +'px'}">
        <div class="el-table__header-wrapper">
            <table class="el-table__header" cellspacing="0" cellpadding="0" border="0" style="width: 100%">
                <colgroup>
                    <col :name="'head_col_'+index" :width="item.width" v-for="item, index in columns">
                </colgroup>
                <thead>
                <tr>
                    <th v-for="item, index in columns" :id="'column_'+index" style="height: 22px"
                        @mousemove="handleMouseMove($event, item, index)"
                        @mousedown="handleMouseDown($event, item, index)"
                        @mouseout="handleMouseOut($event, item, index)">
                        <div class="cell">{{item.name}}</div>
                    </th>
                </tr>
                </thead>
            </table>
        </div>
        <div class="el-table__body-wrapper">
            <list :total="$dc.total" :height="height - 22" :rowHeight="23">
                <template scope="props">
                    <table class="el-table__body" cellspacing="0" cellpadding="0" border="0">
                        <colgroup>
                            <col :name="'body_col_'+index" :width="item.width" v-for="item, index in columns">
                        </colgroup>
                        <tr v-for="id in props.ids" @click="clickRow(id + $dc.smallId)"
                            :class="{'user-selected': $dc.selectId == (id + $dc.smallId)}"
                            @contextmenu.prevent="$refs.ctx.open($event, id + $dc.smallId)">
                            <td v-for="item in columns">
                                <div class="cell" :style="{'width': item.width+'px'}">
                                    {{$dc.rows[id + $dc.smallId][item.id]}}
                                </div>
                            </td>
                        </tr>
                    </table>
                </template>
            </list>
        </div>
        <div class="el-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div>
        <context-menu id="testingctx" ref="ctx"
                      :ctxOpen="onCtxOpen"
                      :ctxCancel="resetCtxLocals"
                      :ctxClose="onCtxClose">
            <li class="ctx-item" @click="saveData">保存为mock数据</li>
            <li class="ctx-item" @click="copyUrl">复制url</li>
        </context-menu>
    </div>
</template>
<script>
    import _ from 'lodash';
    import List from './List.vue';
    import copyToClipboard from 'copy-to-clipboard';
    import ContextMenu from '../../context-menu';
    import dataApi from '../../api/data';
    export default {
        props: ['height', 'width'],
        components: { List, ContextMenu },
        data(){
            return {
                resizeProxyVisible: false,
                dragging: false,// 是否拖动调整列
                draggingColumn: null,
                dragState: {},
                cols: [
                    { id: 'result', name: 'state', width: 60 },
                    { id: 'protocol', name: 'protocol', width: 70 },
                    { id: 'method', name: 'method', width: 70 },
                    { id: 'host', name: 'host', width: 250 },
                    { id: 'contentType', name: 'content-type', width: 200 },
                    { id: 'body', name: 'body', width: 100 },
                    { id: 'path', name: 'path', width: 0 }
                ]
            };
        },
        computed: {
            columns(){
                var cols = this.cols;
                var sum = 0;
                for (var i = 0; i < cols.length - 1; i++) {
                    sum += cols[i].width;
                }
                cols[cols.length - 1].width = this.width - sum;
                return cols;
            }
        },
        methods: {
            // -------------------------------菜单操作
            saveData(){
                if (!this.$dc.rightClickRow.resTime) {
                    this.$message({
                        message: '服务器还没有响应',
                        type: 'warning'
                    });
                    return;
                }
                this.$prompt('请输入数据文件名', '保存为数据文件', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {
                    dataApi.saveDataEntryFromTraffic(this.$dc.rightClickRow.idx, value
                        , this.$dc.rightClickRow.contentType.split(';')[0]).then((res) => {
                        var serverData = res.data;
                        if (serverData.code == 0) {
                            this.$message({
                                type: 'success',
                                message: '保存成功!'
                            });
                        } else {
                            this.$message.error(`出错了，${serverData.msg}`);
                        }
                    });
                });
            },
            // 复制url
            copyUrl(){
                copyToClipboard(`${this.$dc.rightClickRow.protocol}://${this.$dc.rightClickRow.host}${this.$dc.rightClickRow.path}`);
                this.$message('已将url复制到剪切板');
            },
            // 点击行
            clickRow(id){
                this.$dc.setCurrentRowIndex(id);
            },
            // -------------------------------右击菜单显示
            // 打开菜单
            onCtxOpen(id) {
                this.$dc.rightClickRow = this.$dc.rows[id];
            },
            // 点击菜单选项
            onCtxClose(locals) {
            },
            // 点击空白地方
            resetCtxLocals() {
                this.$dc.rightClickRow = {};
            },
            // -------------------------------拖动调整单元格大小
            handleMouseMove(event, column){
                let target = event.target;
                while (target && target.tagName !== 'TH') {
                    target = target.parentNode;
                }
                if (!this.dragging) {
                    let rect = target.getBoundingClientRect();
                    const bodyStyle = document.body.style;
                    if (rect.width > 12 && rect.right - event.pageX < 8) {
                        bodyStyle.cursor = 'col-resize';
                        this.draggingColumn = column;// 即将要拖拽的列
                    } else {
                        bodyStyle.cursor = '';
                        this.draggingColumn = null;
                    }
                }

            },
            handleMouseDown(event, column, index){
                if (!this.draggingColumn) return;
                this.dragging = true;

                this.resizeProxyVisible = true;

                const tableEl = this.$el;
                const tableLeft = tableEl.getBoundingClientRect().left;
                const columnEl = this.$el.querySelector(`	#column_${index}`);
                const columnRect = columnEl.getBoundingClientRect();
                const minLeft = columnRect.left - tableLeft + 30; // 向左最多只能拖拽到这

                this.dragState = {
                    startMouseLeft: event.clientX,
                    startLeft: columnRect.right - tableLeft,
                    startColumnLeft: columnRect.left - tableLeft,
                    tableLeft
                };

                const resizeProxy = this.$refs.resizeProxy;
                resizeProxy.style.left = this.dragState.startLeft + 'px';

                document.onselectstart = function () {
                    return false;
                };
                document.ondragstart = function () {
                    return false;
                };

                const handleMouseMove = (event) => {
                    const deltaLeft = event.clientX - this.dragState.startMouseLeft;
                    const proxyLeft = this.dragState.startLeft + deltaLeft;

                    resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px';
                };

                const handleMouseUp = () => {
                    if (this.dragging) {
                        const finalLeft = parseInt(resizeProxy.style.left, 10);
                        const columnWidth = finalLeft - this.dragState.startColumnLeft;
                        column.width = columnWidth;
                        // 重新计算最后一列的大小

                        document.body.style.cursor = '';
                        this.dragging = false;
                        this.draggingColumn = null;
                        this.dragState = {};

                        this.resizeProxyVisible = false;
                    }

                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    document.onselectstart = null;
                    document.ondragstart = null;
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);

            },
            handleMouseOut(event, column){
                document.body.style.cursor = '';
            }
        }

    };
</script>


<style lang="postcss">
    .el-table {

    .el-table__header-wrapper {

    .el-table__header {

    .cell {
        padding: 0;
        text-align: center;
        white-space: nowrap;
        font-size: 12px;
        line-height: 22px;
    }

    }
    }
    .el-table__body-wrapper {

    .el-table__body {

    td {
        height: 22px;
    }

    .cell {
        padding: 0;
        white-space: nowrap;
        font-size: 12px;
        line-height: 22px;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    }
    }
    }

    .el-table--enable-row-hover {

    tr:hover > td {
        background-color: #eef1f6
    }

    .user-selected > td {
        background-color: #eef1f6
    }

    }

</style>
