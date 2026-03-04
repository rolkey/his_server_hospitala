// src/dto/gs_cxsz_ss.dto.ts
export class Gs_cxsz_ssDto {
  // 手术相关配置
  ssvb: string; // 手术模板版本(0旧版,1新版)
  ssksid: string; // 手术科室
  ssclksid: string; // 手术材料

  // 医嘱相关配置
  yzlsfybz: string; // 启用临时医嘱发药包括出院带药(1是，0否)
  yxbzauto: string; // 启用手工控制库存有效标志(1是，0否)

  // 库存相关配置
  kcpdhb: string; // 库存盘点是否合并数量(1合并，0分批次)

  // 处方相关配置
  cfyymc: string; // 处方显示医院名称
  zycfgs: string; // 门诊中药处方格式(0默认,1四行,其他格式数字)

  // 药品相关配置
  yppfjgbz: string; // 启用进货价格显示(1是，0否)
  ypzsmbz: string; // 启用药品追溯码数量自动计算(1是，0否)
  zsmscpcbz: string; // 启用追溯码关联批次(1是，0否)
  zsmysxsbz: string; // 启用追溯码只扫最小包装(1是，0否)
  ykzsmyf: string; // 启用追溯码领用免扫码(1是，0否)
}
