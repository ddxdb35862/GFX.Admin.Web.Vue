<template>
	<div class="gameFormationAdventureMatchAO-container">
		<el-dialog v-model="isShowDialog" draggable="" >
			<template #header>
				<div style="color: #fff">
					<span>{{ props.title }}</span>
				</div>
			</template>
			<el-form :model="ruleForm" ref="ruleFormRef" label-width="auto"  label-position="top" :rules="rules">
				<el-row  align="center">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.s_Id" />
					</el-form-item>
					<el-col :span="5" class="mb20">
						<el-form-item label="模式" prop="adventureMode">
							<el-select clearable v-model="ruleForm.adventureMode" placeholder="请选择模式">
								<el-option v-for="(item,index) in  getEnumGameAdventureModeData" :key="index" :value="item.value" :label="`[${item.value}] ${item.describe}`"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="5" class="mb20">
						<el-form-item label="回合" prop="roundId">
							<el-select clearable v-model="ruleForm.roundId" placeholder="请选择模式">
								<el-option v-for="(item,index) in  getEnumGameRoundData" :key="index" :value="item.value" :label="`[${item.value}] ${item.describe}`"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="5" class="mb20">
						<el-form-item label="闯关次数" prop="adventureTime">
							<el-input v-model="ruleForm.adventureTime" placeholder="1,2,..." type="input" maxlength="4" show-word-limit clearable />
						</el-form-item>
					</el-col>
					<el-col :span="5" class="mb20">
						<el-form-item label="阵容Id" prop="s_FormationId">
							<el-input v-model="ruleForm.s_FormationId" placeholder="请输入阵容Id" type="input" maxlength="20" show-word-limit clearable />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="16" class="mb20">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="ruleForm.remark" placeholder="请输入备注" type="textarea" maxlength="20" show-word-limit clearable />
						</el-form-item>
					</el-col>
					<el-col :span="6" align="center" class="center-box">
						<el-button @click="cancel">取 消</el-button>
						<el-button type="primary" @click="submit">确 定</el-button>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
	</div>
</template>
<script lang="ts" setup>
	import { ref,onMounted,computed  } from "vue";
	import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
	import { ElMessage } from "element-plus";
	import type { FormRules } from "element-plus";
	import { addGameFormationAdventureMatchAO,updateGameFormationAdventureMatchAO } from "/@/api/game/gameFormation/adventureMatchAO";
	import {auth} from '/@/utils/authFunction';
	import { getAPI } from '/@/utils/axios-utils';
	import { SysEnumApi } from '/@/api-services/api';

	//自行添加其他规则
	const rules = ref<FormRules>({
		remark: [{required: true, message: '请输入备注！', trigger: 'blur',},],
		s_FormationId: [{required: true, message: '请输入关联的阵容id！', trigger: 'blur',},],
		adventureTime: [{required: true, message: '请输入关联的闯关次数！', trigger: 'blur',},],
		adventureMode: [{required: true, message: '请选择闯关模式！', trigger: 'blur',},],
		roundId: [{required: true, message: '请选择回合！', trigger: 'blur',},],
	});

	//父级传递来的参数
	var props = defineProps({
		title: {
		type: String,
		default: "",
	},
	});
	//父级传递来的函数，用于回调
	const emit = defineEmits(["reloadTable"]);
	const ruleFormRef = ref();
	const isShowDialog = ref(false);
	const ruleForm = ref<any>({});
	const getEnumGameAdventureModeData = ref<any>([]);
	const getEnumGameRoundData = ref<any>([]);
	// 标记是否是编辑模式
	const isEditor = ref(false);

	// 打开弹窗
	const openDialog = (row: any) => {
		ruleForm.value = JSON.parse(JSON.stringify(row));
		isShowDialog.value = true;
	};
	
	// 关闭弹窗
	const closeDialog = () => {
		emit("reloadTable");
		isShowDialog.value = false;
	};

	// 取消
	const cancel = () => {
		isShowDialog.value = false;
	};

	// 提交
	const submit = async () => {
		ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
			if (isValid) {			
				let values = ruleForm.value;

				if(ruleForm.value.adventureMode == -1)
				{
					ElMessage({
						message: `请选择闯关模式`,
						type: "error",
					});
					return;
				}

				if(ruleForm.value.roundId == 0)
				{
					ElMessage({
						message: `请选择轮次`,
						type: "error",
					});
					return;
				}

				if (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) {
					await addGameFormationAdventureMatchAO(values);
				} else {
					await updateGameFormationAdventureMatchAO(values);
				}
				//TODO 	
				closeDialog();
			} else {
				ElMessage({
					message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
					type: "error",
				});
			}
		});
	};

	// 页面加载时
	onMounted(async () => {
		getEnumGameAdventureModeData.value = (await getAPI(SysEnumApi).apiSysEnumEnumDataListGet('GameAdventureMode')).data.result ?? [];
		getEnumGameRoundData.value = (await getAPI(SysEnumApi).apiSysEnumEnumDataListGet('GameRound')).data.result ?? [];
	});

	//将属性或者函数暴露给父组件
	defineExpose({ openDialog , isEditor});
</script>


<style scoped>
:deep(.el-select),
:deep(.el-input-number) {
	width: 100%;
}
:deep(.center-box) {  
  display: flex;  
  justify-content: center; /* 水平居中 */  
  align-items: center; /* 垂直居中，如果你也需要的话 */  
  /*height: 100px;  或者其他你需要的高度 */  
}  
</style>