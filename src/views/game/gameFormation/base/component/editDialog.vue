<template>
	<div class="gameFormationBase-container">
		<el-dialog v-model="isShowDialog" draggable="" 
					v-loading="loading" width="90%">
			<template #header>
				<div style="color: #fff">
					<span>{{ props.title }}</span>
				</div>
			</template>
			<el-row>
				<el-col :span="14">
					<!--itemlayer-->
					<el-card title="装备" class="full-table" shadow="hover" style="margin-top: 8px">
						<el-table
							:data="itemLayerTableData"
							style="width: 100%"
							tooltip-effect="light"
							row-key="id" @cell-click="handleCellClick">
							<el-table-column type="index" label="序号" width="60"/>
							<el-table-column prop="id" label="Id" width="220" show-overflow-tooltip=""/>
							<el-table-column prop="configName" label="道具名称" width="140" show-overflow-tooltip=""/>
							<el-table-column prop="centrePosX" label="X坐标" width="120" show-overflow-tooltip="" >
							
								<template #default="scope">
									<el-select
										v-model="scope.row.centrePosX"
										filterable
										show-word-limit clearable
										remote
										reserve-keyword
										placeholder="请选择X"
									>
										<el-option
											v-for="centerPos in centrePosXArray"
											:key="centerPos"
											:label="centerPos"
											:value="centerPos"
										/>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="centrePosY" label="Y坐标" width="120" show-overflow-tooltip="">
								<template #default="scope">
									<el-select
										v-model="scope.row.centrePosY"
										filterable
										show-word-limit clearable
										remote
										reserve-keyword
										placeholder="请选择Y"
									>
										<el-option
											v-for="centerPos in centrePosYArray"
											:key="centerPos"
											:label="centerPos"
											:value="centerPos"
										/>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column label="颜色" width="120">  
								<template v-slot:default="scope">  
									<div :style="{ 'width': '65px',backgroundColor: colors[scope.$index % colors.length] }">  
									<!-- 这里可以显示颜色值或其他内容，但通常不需要显示颜色值，因为背景已经显示了 -->  
									<!-- 除非你需要让用户知道背后的颜色值 -->  
									{{ colors[scope.$index % colors.length] }}  
									<!-- {{scope.row.configName}} -->
									</div>  
								</template>  
							</el-table-column>
							<el-table-column label="操作" width="100" align="center" fixed="right" show-overflow-tooltip=""
											v-if="auth('gameFormationBase:edit')">
								<template #default="scope">
									<el-button icon="ele-Delete" size="small" text="" type="primary" @click="delItem(scope.row)"
											v-auth="'gameFormationBase:edit'"> 删除
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-card>
					<!--capacityLayer-->
					<el-card title="背包" class="full-table" shadow="hover" style="margin-top: 8px">
						<el-table
							:data="capacityLayerTableData"
							style="width: 100%"
							tooltip-effect="light"
							row-key="id" @cell-click="handleCellClick">
							<el-table-column type="index" label="序号" width="60"/>
							<el-table-column prop="id" label="Id" width="220" show-overflow-tooltip=""/>
							<el-table-column prop="configName" label="道具名称" width="140" show-overflow-tooltip=""/>
							<el-table-column prop="centrePosX" label="X坐标" width="120" show-overflow-tooltip="" >
								<template #default="scope">
									<el-select
										v-model="scope.row.centrePosX"
										filterable
										show-word-limit clearable
										remote
										reserve-keyword
										placeholder="请选择X"
									>
										<el-option
											v-for="centerPos in centrePosXArray"
											:key="centerPos"
											:label="centerPos"
											:value="centerPos"
										/>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="centrePosY" label="Y坐标" width="120" show-overflow-tooltip="">
								<template #default="scope">
									<el-select
										v-model="scope.row.centrePosY"
										filterable
										show-word-limit clearable
										remote
										reserve-keyword
										placeholder="请选择Y"
									>
										<el-option
											v-for="centerPos in centrePosYArray"
											:key="centerPos"
											:label="centerPos"
											:value="centerPos"
										/>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column label="颜色" width="140">  
								<template v-slot:default="scope">  
									<div :style="{ 'width': '65px',backgroundColor: '#BBBBBB'}">  
										{{scope.row.configName}}
									</div>  
								</template>  
							</el-table-column>
							<el-table-column label="操作" width="100" align="center" fixed="right" show-overflow-tooltip=""
											v-if="auth('gameFormationBase:edit')">
								<template #default="scope">
									<el-button icon="ele-Delete" size="small" text="" type="primary" @click="delCapacity(scope.row)"
											v-auth="'gameFormationBase:edit'"> 删除
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-card>
				</el-col>
				<el-col :span="10">
					<el-card>
						<el-row>
							<el-col :span="18">
								<el-table :data="mockData" :show-header="false" border >  
									<el-table-column  
									v-for="(column, indexY) in 7"  
									:key="indexY"  
									:label="`列${indexY + 1}`"  
									:width="`64px`"  
									>  
									<template #default="scope">  
										<div :height="`64px`" :style="{ align:'center', backgroundColor: isHighlighted(scope.$index, indexY) }">
											{{ scope.$index * 7 + indexY }}
										</div>  
									</template>  
									</el-table-column>  
								</el-table>
							</el-col>
							<el-col :span="6">
								<el-form :model="ruleForm" ref="ruleFormRef" label-width="auto"  label-position="top" :rules="rules">
									<el-row>
										<el-col :span="24" class="mb20">
											<el-form-item label="备注" prop="remark">
												<el-input v-model="ruleForm.remark" placeholder="请输入备注" type="textarea" maxlength="20" show-word-limit clearable />
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="24" align="center" class="mb20">
											<el-button @click="cancel">取 消</el-button>
											<el-button type="primary" @click="submit">确 定</el-button>
										</el-col>
									</el-row>
								</el-form>
							</el-col>
						</el-row>
					</el-card>
				</el-col>
			</el-row>
			
		</el-dialog>
	</div>
</template>
<script lang="ts" setup>
	import { ref,onMounted,computed  } from "vue";
	import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
	import { ElMessage } from "element-plus";
	import type { FormRules } from "element-plus";
	import { updateGameFormationBase } from "/@/api/game/gameFormation/base";
	import {auth} from '/@/utils/authFunction';

	//自行添加其他规则
	const rules = ref<FormRules>({
		remark: [{required: true, message: '请输入内容！', trigger: 'blur',},],
	});

    // 模拟数据，7列9行  
    const mockData = ref(Array.from({ length: 9 }, (_, rowIndex) => ({  
      // 使用一个数组来代表每行的9列数据  
      columns: Array.from({ length: 7 }, (_, colIndex) => `行${rowIndex + 1}列${colIndex + 1}的值`),  
    })));  

	const colors = ['#0F9D58','#4CAF50','#343a40','#FF5733','#DEE2E6','#E9ECEF','#008000','#800000','#00FFFF','#FF00FF','#FFFF00','#0000FF','#00FF00','#5499C7','#784212','#7DCEA0','#AF7AC5','#2980B9','#58D68D','#DC7633','#A3E4D7','#AF7AC5','#7D3C98','#943126','#A9DFBF','#BB8FCE'];
	const centrePosXArray = [500,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500,6000,6500];
	const centrePosYArray = [500,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500,6000,6500,7000,7500,8000,8500];
  
	const loading = ref(false);
	const itemLayerTableData = ref<any>([]);
	const capacityLayerTableData = ref<any>([]);

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

	// 打开弹窗
	const openDialog = (row: any) => {
		ruleForm.value = JSON.parse(JSON.stringify(row));
		console.log("openDialog");
		console.log("openDialog");
		console.log(ruleForm.value);
		console.log(ruleForm.value.itemLayerItems);
		console.log(ruleForm.value.capacityLayerItems);
		itemLayerTableData.value = ruleForm.value.itemLayerItems;
		capacityLayerTableData.value = ruleForm.value.capacityLayerItems;
		// itemLayerTableData.value.findIndex((item) => {  
		// 	item["theColor"] = '#FFFFFF'
		// }); 
		//colors[foundIndex]
		isShowDialog.value = true;
	};

	// 检查函数  
	function checkIfIndexExists(gridIndexes, index) {  
	// 使用some方法来检查是否存在  
	return gridIndexes.some((gi) => gi === index);  
	}  
    // 判断是否需要高亮单元格  
    const isHighlighted = computed(() => (rowIndex, columnIndex) => {
		var result =  false;
		var index = rowIndex * 7 + columnIndex;
		//TODO 遍历itemLayerTableData.value数组里的json数据,检查是否存在gridIndexes里包含index，如果有，则立刻返回true，无，不处理
		
		// 假设item对象中有gridIndexes数组  
		const foundIndex = itemLayerTableData.value.findIndex((item) => {  
			return item.gridIndexes && checkIfIndexExists(item.gridIndexes, index);  
		}); 
		if(foundIndex == -1){
			// 假设item对象中有gridIndexes数组  
			const foundIndex2 = capacityLayerTableData.value.findIndex((item) => {  
				return item.gridIndexes && checkIfIndexExists(item.gridIndexes, index);  
			}); 
			if(foundIndex2 == -1){
				return '#FDFEFE';
			}else {
				return '#BBBBBB';
			}
		}
		console.log("foundIndex:"+foundIndex+",color:"+colors[foundIndex]);
		return colors[foundIndex];
		//return false;//rowIndex === highlightedX.value && columnIndex === highlightedY.value;  
    });


    // 定义一个方法来删除指定ID的item
    const removeItemById = (id) => {
		itemLayerTableData.value = itemLayerTableData.value.filter(item => item.id !== id);
    };

	// 删除
	const delItem = (row: any) => {
		console.log("deleteItem."+JSON.stringify(row));
		removeItemById(row.id)
	};

	// 定义一个方法来删除指定ID的item
	const removeCapacityById = (id) => {
		capacityLayerTableData.value = capacityLayerTableData.value.filter(item => item.id !== id);
	};

	// 删除
	const delCapacity = (row: any) => {
		console.log("delCapacity."+JSON.stringify(row));
		removeCapacityById(row.id)
	};
	
	function handleCellClick(row) {
		row.editing = true;
		//row.editing = !row.editing;
	}

	function handleEditBlur(row) {
		console.log("handleEditBlur."+row);
		row.editing = false;
		//ElMessage.success('编辑完成');
	}
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
				let itemLayerTableValues = itemLayerTableData.value;
				let capacityLayerTableValues = capacityLayerTableData.value;
				if (itemLayerTableValues.length == 0) {
					ElMessage({
						message: `阵容没有装备，无法保存，请修改后再提交`,
						type: "error",
					});
					return;
				} 
				if (capacityLayerTableValues.length == 0) {
					ElMessage({
						message: `阵容没有背包，无法保存，请修改后再提交`,
						type: "error",
					});
					return;
				} 

				loading.value = true;
				let values = ruleForm.value;
				values.itemLayerItems = itemLayerTableValues;
				values.capacityLayerItems = capacityLayerTableValues;
				var updateResult = await updateGameFormationBase(values);
				if(updateResult)
				{
					ElMessage({
						message: `更新成功`,
						type: "info",
					});
				}else {
					ElMessage({
						message: `更新失败`,
						type: "error",
					});
				}
				
				closeDialog();
				loading.value = false;
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
	});

	//将属性或者函数暴露给父组件
	defineExpose({ openDialog });
</script>





<style scoped>
:deep(.el-select),
:deep(.el-input-number) {
	width: 100%;
}
:deep(.item1000002) {
	img {
		content: url('/@/assets/items/1000002.png');
	}
}

:deep(.image-container) {
  position: relative;
  width: 100%; /* 或具体宽度，确保与外部容器协调 */
  height: 0;
  padding-top: 12.5%; /* 保持宽高比，假设原图宽高比为1:2 */
  overflow: hidden;
}

:deep(.image-container .img) {
  width: 100%; /* 保证图片填满容器宽度 */
  height: auto; /* 保持图片宽高比 */
  display: block; /* 移除图片下方可能的空白间隙 */
  transform-origin: left top; /* 缩放以左上角为基准 */
  transform: scale(0.125); /* 等比缩小，0.125大约等于1/8 */
}
:deep(.custom-header) {  
  position: relative;  
  height: 100px; /* 根据需要调整 */  
  display: flex;  
  flex-direction: column;  
  justify-content: space-between;  
}  
  
:deep(.scale-label) {  
  position: absolute;  
  left: 0;  
  width: 100%;  
  text-align: center;  
  /* 其他你需要的样式 */  
}  
</style>