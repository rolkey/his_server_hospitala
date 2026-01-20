/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/07 20:24:36
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

type ValueOf<T> = T[keyof T];

export const ERR = {
  // 登录相关
  ERR_10000: { code: 10000, message: '参数校验异常' },
  ERR_10001: { code: 10001, message: '用户已存在' },
  ERR_10002: { code: 10002, message: '用户名或密码错误' },
  ERR_10003: { code: 10003, message: '验证码错误' },
  ERR_10004: { code: 10004, message: '密码验证失败' },
  // token相关
  ERR_11001: { code: 11001, message: '登录无效或无权限访问' },
  ERR_11002: { code: 11002, message: '登录已过期' },
  ERR_11003: { code: 11003, message: '请联系管理员申请权限' },
  ERR_11004: { code: 11004, message: '越权操作' },
  ERR_11005: { code: 11005, message: '当前用户无此角色' },
  ERR_11006: { code: 11006, message: '非法操作' },
  ERR_11007: { code: 11007, message: '用户已禁用' },
  ERR_11008: { code: 11008, message: '角色已禁用' },
  // OSS相关
  ERR_20001: { code: 20001, message: '当前创建的文件或目录已存在' },
  ERR_20002: { code: 20002, message: '无需操作' },
  ERR_20003: { code: 20003, message: '已超出支持的最大处理数量' },
  // 环境相关
  ERR_30001: { code: 30001, message: '预览环境不支持此操作' },
  // 缺药提醒
  ERR_40001: { code: 40001, message: '有药品缺药，不能执行，请退回医生或提醒医生停嘱重开' },
  ERR_40002: { code: 40002, message: '执行医嘱失败' },
  // 分配床位错误
  ERR_40101: { code: 40101, message: '床位已有患者' },
  ERR_40102: { code: 40102, message: '未找到有效住院信息' },
  ERR_40103: { code: 40102, message: '分配床位失败' },
  // 停嘱相关
  ERR_40201: { code: 40201, message: '复核退回失败！！' },
  ERR_40202: { code: 40202, message: '停嘱退回失败！！' },
  // 退回医嘱相关
  ERR_40203: { code: 40203, message: '仍有未退费医嘱！！' },

  // 医嘱退费与退药发药限制
  ERR_40801: { code: 40801, message: '正在执行生成发药，请稍等！!' },
  ERR_40802: { code: 40802, message: '已发药，请走退费流程!' },
  ERR_40803: { code: 40803, message: '已生成领药单!' },
  ERR_40804: { code: 40804, message: '退药单未执行发药！' },
  ERR_40805: { code: 40805, message: '单号未退完全部执行次数！！' },
  ERR_40806: { code: 40806, message: '已执行，不能删除！！' },
  ERR_40807: { code: 40807, message: '删除费用参数不全！！' },
  ERR_40808: { code: 40808, message: '删除费用参数缺少maxid！！' },
  ERR_40810: { code: 40810, message: '费用删除失败！！' },
} as const;

export type ErrInfo = ValueOf<typeof ERR>;
