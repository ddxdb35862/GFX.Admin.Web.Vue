<template>
  <div class="gameFormationBase-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4" class="mb10">
            <el-form-item label="轮次">
              <el-select clearable="" v-model="queryParams.roundId" placeholder="请选择轮次">
                <el-option v-for="(item,index) in getEnumGameRoundData" :key="index" :value="item.value" :label="`${item.describe}`" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4" class="mb10">
            <el-form-item label="玩家等级">
              <el-select clearable="" v-model="queryParams.rank" placeholder="请选择模式">
                <el-option v-for="(item,index) in getEnumGameRankData" :key="index" :value="item.value" :label="`${item.describe}`" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4" class="mb10">
            <el-form-item label="职业Id">
              <el-input v-model="queryParams.careerConfigId" clearable="" placeholder="1,2,3,4"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4" class="mb10">
            <el-form-item label="皮肤Id">
              <el-input v-model="queryParams.careerSkinConfigId" clearable="" placeholder="101,102..."/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4" class="mb10">
            <el-form-item>
              <el-button-group>
                <el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'gameFormationBase:list'">
                  查询
                </el-button>
              </el-button-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="同步玩家Id">
              <el-input v-model="queryParams.toMergePlayerUnitIds" clearable="" placeholder="合并的玩家Id,如果没有输入,则默认合并所有玩家"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4" class="mb10">
            <el-form-item>
              <el-button-group>
                <el-button type="primary" icon="ele-Plus" @click="mergeOnline" v-auth="'gameFormationBase:mergeOnline'">
                  同步线上
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
        <el-table-column prop="roundId" label="轮次" width="100" show-overflow-tooltip="">
          <template #default="scope">
            <el-tag>{{ getEnumDesc(scope.row.roundId, getEnumGameRoundData)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="playerRank" label="玩家等级" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <el-tag>{{ getEnumDesc(scope.row.playerRank, getEnumGameRankData)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="playerCareerConfigId" label="职业Id" width="100" show-overflow-tooltip=""/>
        <el-table-column prop="playerCareerSkinConfigId" label="皮肤Id" width="100" show-overflow-tooltip=""/>
        <el-table-column prop="s_UpdateTime" label="更新时间" width="160" show-overflow-tooltip=""/>
        <el-table-column prop="remark" label="备注" width="240" show-overflow-tooltip=""/>
        <el-table-column label="操作" width="200" align="center" fixed="right" show-overflow-tooltip=""
                         v-if="auth('gameFormationBase:edit') || auth('gameFormationBase:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditGameFormation(scope.row)"
                       v-auth="'gameFormationBase:edit'"> 编辑
            </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delGameFormation(scope.row)"
                       v-auth="'gameFormationBase:delete'"> 删除
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

<script lang="ts" setup="" name="gameFormationBase">
import {ref,onMounted} from "vue";
import {ElMessageBox, ElMessage} from "element-plus";
import {auth} from '/@/utils/authFunction';
import {getDictDataItem as di, getDictDataList as dl} from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';

import editDialog from '/@/views/game/gameFormation/base/component/editDialog.vue'
import {listGameFormationBase, deleteGameFormationBase, mergeOnlineGameFormationBase} from '/@/api/game/gameFormation/base';
import { getAPI } from '/@/utils/axios-utils';
import { SysEnumApi } from '/@/api-services/api';
import commonFunction from '/@/utils/commonFunction';

const { getEnumDesc } = commonFunction();

const showAdvanceQueryUI = ref(false);
const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const getEnumGameRankData = ref<any>([]);
const getEnumGameRoundData = ref<any>([]);
var queryParams = ref<any>({toMergePlayerUnitIds: '2276326310345244672', roundId:1, rank:0, careerConfigId:1, careerSkinConfigId:0});
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
  var res = await listGameFormationBase(Object.assign(queryParams.value, tableParams.value));
  console.log(res.data.result);
  tableData.value = res.data.result == null ? []: res.data.result;
  //tableParams.value.total = tableData.value.count;
  loading.value = false;
};

// 同步
const mergeOnline = async () => {
  console.log("Merge3");
  loading.value = true;
  var res = await mergeOnlineGameFormationBase(Object.assign(queryParams.value, tableParams.value));
  console.log("Merge01");
  var result = res.data.result;
  console.log(queryParams.value,"queryParams");
  console.log(tableParams.value,"tableParams");
  loading.value = false;
  if(result)
  {
    console.log("Merge02");
    await handleQuery();
  }
};

// 打开编辑页面
const openEditGameFormation = (row: any) => {
  editClientChannelTitle.value = '编辑阵容';
  console.log(row)
  editDialogRef.value.isEditor= true;
  editDialogRef.value.openDialog(row);
};

// 删除
const delGameFormation = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(async () => {
        await deleteGameFormationBase(row);
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


onMounted(async () => {
      // 这里放置组件挂载后需要执行的代码
      getEnumGameRankData.value = (await getAPI(SysEnumApi).apiSysEnumEnumDataListGet('GameRank')).data.result ?? [];
      getEnumGameRoundData.value = (await getAPI(SysEnumApi).apiSysEnumEnumDataListGet('GameRound')).data.result ?? [];
      queryParams.value.rank = getEnumGameRankData.value[0].value;
      queryParams.value.roundId = getEnumGameRoundData.value[1].value;
      handleQuery();
      // 可以在这里访问DOM元素、初始化外部库、发送网络请求等
    });
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}
</style>

