import request from '/@/utils/request';

enum Api {
    AddGameFormationAdventureMatchAO = '/api/gameFormationAdventureMatchAO/add',
    DeleteGameFormationAdventureMatchAO = '/api/gameFormationAdventureMatchAO/delete',
    UpdateGameFormationAdventureMatchAO = '/api/gameFormationAdventureMatchAO/update',
    PageGameFormationAdventureMatchAO = '/api/gameFormationAdventureMatchAO/page',
    ListGameFormationAdventureMatchAO = '/api/gameFormationAdventureMatchAO/list',
}

/**
 * 
 * @param params
 */
export const addGameFormationAdventureMatchAO = (params?: any) =>
    request({
        url: Api.AddGameFormationAdventureMatchAO,
        method: 'post',
        data: params,
    });


// 删除游戏区服
export const deleteGameFormationAdventureMatchAO = (params?: any) =>
    request({
        url: Api.DeleteGameFormationAdventureMatchAO,
        method: 'post',
        data: params,
    });

// 编辑游戏区服
export const updateGameFormationAdventureMatchAO = (params?: any) =>
    request({
        url: Api.UpdateGameFormationAdventureMatchAO,
        method: 'post',
        data: params,
    });

// 分页查询游戏区服
export const pageGameFormationAdventureMatchAO = (params?: any) =>
    request({
        url: Api.PageGameFormationAdventureMatchAO,
        method: 'post',
        data: params,
    });
    
//查询所有
export const listGameFormationAdventureMatchAO = (params?: any) =>
    request({
        url: Api.ListGameFormationAdventureMatchAO,
        method: 'post',
        data: params,
    });



