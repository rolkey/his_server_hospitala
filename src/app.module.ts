/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/07 20:30:08
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { Module, DynamicModule } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 自动加载 modules 目录下的所有模块
 */
async function loadModules(): Promise<any[]> {
  const modulesPath = path.join(__dirname, 'modules');
  const modules: any[] = [];

  try {
    // 读取 modules 目录下的所有文件夹
    const moduleDirectories = fs
      .readdirSync(modulesPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // 遍历每个模块目录
    for (const moduleDir of moduleDirectories) {
      const modulePath = path.join(modulesPath, moduleDir);
      const moduleFiles = fs.readdirSync(modulePath);

      // 查找 .module.ts 文件
      const moduleFile = moduleFiles.find(
        (file) => file.endsWith('.module.ts') || file.endsWith('.module.js'),
      );

      if (moduleFile) {
        try {
          // 动态导入模块
          const moduleFilePath = `./${path.join('modules', moduleDir, moduleFile).replace(/\\/g, '/')}`;
          const moduleExports = await import(moduleFilePath);

          // 查找导出的模块类
          const moduleClass = Object.values(moduleExports).find(
            (exportedItem: any) =>
              exportedItem &&
              typeof exportedItem === 'function' &&
              Reflect.getMetadata('__module__', exportedItem),
          );

          if (moduleClass) {
            modules.push(moduleClass);
            console.log(`✅ 已加载模块: ${moduleDir}`);
          }
        } catch (error) {
          console.warn(`⚠️  加载模块 ${moduleDir} 失败:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('❌ 读取 modules 目录失败:', error.message);
  }

  return modules;
}

/**
 * 动态创建 AppModule
 */
@Module({})
export class AppModule {
  static async forRoot(): Promise<DynamicModule> {
    // 自动加载所有模块
    const dynamicModules = await loadModules();

    return {
      module: AppModule,
      imports: [
        /* 配置文件模块 */
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.local', '.env'],
        }),
        SharedModule,
        ...dynamicModules, // 自动加载的模块
      ],
    };
  }
}
