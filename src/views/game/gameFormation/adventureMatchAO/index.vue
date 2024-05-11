<template>
  <div class="gameFormationAdventureMatchAO-container">
    <my-dialog @data-updated="handleDataUpdated" />
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4" class="mb10">
            <el-form-item label="轮次">
              <el-input v-model="queryParams.roundId" clearable="" placeholder="1,2,3...,14"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4" class="mb10">
            <el-form-item label="模式">
              <el-input v-model="queryParams.adventureMode" clearable="" placeholder="1,2"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4" class="mb10">
            <el-form-item label="闯关次数">
              <el-input v-model="queryParams.adventureTime" clearable="" placeholder="1,2,3,4"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4" class="mb10">
            <el-form-item>
              <el-button-group>
                <el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'gameFormationAdventureMatchAO:list'">
                  查询
                </el-button>
              </el-button-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4" class="mb10">
            <el-form-item>
              <el-button-group>
                <el-button type="primary" icon="ele-Plus" @click="addAdventureAO" v-auth="'gameFormationAdventureMatchAO:add'">
                  添加
                </el-button>
              </el-button-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table
          :data="tableData"
          style="width: 100%"
          v-loading="loading"
          tooltip-effect="light"
          row-key="s_Id">
        <el-table-column type="index" label="序号" width="55"/>
        <el-table-column prop="s_Id" label="Id" width="240" show-overflow-tooltip=""/>
        <el-table-column prop="roundId" label="轮次" width="80" show-overflow-tooltip=""/>
        <el-table-column prop="adventureMode" label="闯关模式" width="120" show-overflow-tooltip=""/>
        <el-table-column prop="adventureTime" label="闯关次数" width="100" show-overflow-tooltip=""/>
        <el-table-column prop="formationRemark" label="阵容备注" width="240" show-overflow-tooltip=""/>
        <el-table-column prop="s_UpdateTime" label="更新时间" width="160" show-overflow-tooltip=""/>
        <el-table-column prop="remark" label="备注" width="240" show-overflow-tooltip=""/>
        <el-table-column label="操作" width="200" align="center" fixed="right" show-overflow-tooltip=""
                         v-if="auth('gameFormationAdventureMatchAO:edit') || auth('gameFormationAdventureMatchAO:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditGameFormationAdventureMatchAO(scope.row)"
                       v-auth="'gameFormationAdventureMatchAO:edit'"> 编辑
            </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delGameFormationAdventureMatchAO(scope.row)"
                       v-auth="'gameFormationAdventureMatchAO:delete'"> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <editDialog
          ref="editDialogRef"
          :title="editClientChannelTitle"
          @reloadTable="handleQuery"
      />
    </el-card>  
  </div>
</template>

<script lang="ts" setup="" name="gameFormationAdventureMatchAO">
import {ref} from "vue";
import {ElMessageBox, ElMessage} from "element-plus";
import {auth} from '/@/utils/authFunction';
import {getDictDataItem as di, getDictDataList as dl} from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';

import editDialog from '/@/views/game/gameFormation/adventureMatchAO/component/editDialog.vue'
import {listGameFormationAdventureMatchAO, deleteGameFormationAdventureMatchAO} from '/@/api/game/gameFormation/adventureMatchAO';

// import { defineStore } from 'pinia';  
  
// export const useCounterStore = defineStore('counter', {  
//   state: () => ({  
//     count: 0,  
//   }),  
//   actions: {  
//     increment() {  
//       this.count++;  
//       console.log(this.count);
//     },  
//   },  
// });


const showAdvanceQueryUI = ref(false);
const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({roundId:"1", adventureMode:"0", adventureTime:"1"});
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const editClientChannelTitle = ref("");

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
  showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
}


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await listGameFormationAdventureMatchAO(Object.assign(queryParams.value, tableParams.value));
  console.log(res.data.result);
  tableData.value = res.data.result == null ? []: res.data.result;
  //tableParams.value.total = tableData.value.count;
  loading.value = false;
};

// 打开编辑页面
const openEditGameFormationAdventureMatchAO = (row: any) => {
  editClientChannelTitle.value = '编辑闯关匹配阵容';
  console.log(row)
  editDialogRef.value.isEditor= true;
  editDialogRef.value.openDialog(row);
};

// 打开添加页面
const openAddGameFormationAdventureMatchAO = (row: any) => {
  editClientChannelTitle.value = '添加闯关匹配阵容';
  console.log(row)
  editDialogRef.value.isEditor= false;
  editDialogRef.value.openDialog(row);
};

// 删除
const delGameFormationAdventureMatchAO = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(async () => {
        await deleteGameFormationAdventureMatchAO(row);
        ElMessage.success("删除成功");
        handleQuery();
      })
      .catch(() => {
      });
};

// 改变页面容量
const handleSizeChange = (val: number) => {
  tableParams.value.pageSize = val;
  handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
  tableParams.value.page = val;
  handleQuery();
};

handleQuery();

</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}
</style>

