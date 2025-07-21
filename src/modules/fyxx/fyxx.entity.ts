import { Column, Entity, OneToMany } from 'typeorm';
import { ksmc } from '../ksmc/ksmc.entity';

@Entity('__fyxx', { schema: 'dbo' })
export class fyxx {
  @Column('varchar', { primary: true, name: 'fyid', length: 10 })
  fyid: string;

  @Column('varchar', { name: 'fymc', nullable: true, length: 60 })
  fymc: string | null;

  @Column('varchar', { name: 'fy1', nullable: true, length: 10 })
  fy1: string | null;

  @Column('varchar', { name: 'fy2', nullable: true, length: 10 })
  fy2: string | null;

  @Column('varchar', { name: 'fy3', nullable: true, length: 10 })
  fy3: string | null;

  @Column('varchar', { name: 'fy4', nullable: true, length: 10 })
  fy4: string | null;

  @Column('varchar', { name: 'fy5', nullable: true, length: 10 })
  fy5: string | null;

  @Column('varchar', { name: 'fy6', nullable: true, length: 20 })
  fy6: string | null;

  @Column('varchar', { name: 'fy7', nullable: true, length: 20 })
  fy7: string | null;

  @Column('varchar', { name: 'fy8', nullable: true, length: 20 })
  fy8: string | null;

  @Column('varchar', { name: 'fy9', nullable: true, length: 20 })
  fy9: string | null;

  @Column('varchar', { name: 'fy10', nullable: true, length: 20 })
  fy10: string | null;

  @OneToMany(() => ksmc, (ksmc) => ksmc.fyxxEntity)
  ksmcs: ksmc[];
}
