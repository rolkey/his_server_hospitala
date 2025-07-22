// src/utils/SnowflakeIdGenerator.ts
import { DiscordSnowflake } from '@sapphire/snowflake';

export class SnowflakeIdGenerator {
  // 生成雪花ID
  static generate(): string {
    return DiscordSnowflake.generate().toString();
  }
}
