import request from '/@/utils/request';

enum Api {
    MergeOnlineGameFormationBase = '/api/gameFormationBase/mergeOnline',
    DeleteGameFormationBase = '/api/gameFormationBase/delete',
    UpdateGameFormationBase = '/api/gameFormationBase/update',
    PageGameFormationBase = '/api/gameFormationBase/page',
    ListGameFormationBase = '/api/gameFormationBase/list',
}

/**
 * 
 * @param params
 */
export const mergeOnlineGameFormationBase = (params?: any) =>
    request({
        url: Api.MergeOnlineGameFormationBase,
        method: 'post',
        data: params,
    });


// 删除游戏区服
export const deleteGameFormationBase = (params?: any) =>
    request({
        url: Api.DeleteGameFormationBase,
        method: 'post',
        data: params,
    });

// 编辑游戏区服
export const updateGameFormationBase = (params?: any) =>
    request({
        url: Api.UpdateGameFormationBase,
        method: 'post',
        data: params,
    });

// 分页查询游戏区服
export const pageGameFormationBase = (params?: any) =>
    request({
        url: Api.PageGameFormationBase,
        method: 'post',
        data: params,
    });
    
//查询所有
export const listGameFormationBase = (params?: any) =>
    request({
        url: Api.ListGameFormationBase,
        method: 'post',
        data: params,
    });



