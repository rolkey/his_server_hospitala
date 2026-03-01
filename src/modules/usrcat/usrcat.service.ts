import { Injectable } from '@nestjs/common';
import { CreateUserDto, GetUserDto, UpdateProfileDto, UpdateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { usrcat } from './usrcat.entity';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';
import { Role } from '../role/role.entity';
import { Ksry } from '../ksry/ksry.entity';
import { ksmc } from '../ksmc/ksmc.entity';

@Injectable()
export class UsrcatService {
  constructor(
    @InjectRepository(usrcat)
    private UsrcatRepo: Repository<usrcat>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  async create(user: CreateUserDto) {
    const { usid } = user;
    const existUser = await this.findByUsid(usid);

    if (existUser) {
      throw new CustomException(ErrorCode.ERR_10001);
    }

    const newUser = this.UsrcatRepo.create(user);
    if (user.roleIds !== undefined) {
      newUser.roles = await this.roleRepo.find({
        where: { id: In(user.roleIds) },
      });
    }
    newUser.pwrd = newUser.pwrd;
    newUser.ksid = '';
    newUser.zcid = '';
    newUser.xgmm = true;
    newUser.bgmm = true;
    newUser.mmyx = true;
    newUser.zwid = '';
    await this.UsrcatRepo.save(newUser);
    return true;
  }

  async findAll(query: GetUserDto) {
    const where: any = {};
    if (query.unam) {
      where.unam = Like(`%${query.unam}%`);
    }

    if (query.zhjy) {
      where.zhjy = Number(query.zhjy);
    }
    const pageSize = query.pageSize || 10;
    const pageNo = query.pageNo || 1;
    const [users, total] = await this.UsrcatRepo.findAndCount({
      select: {
        unam: true,
        usid: true,
        jsrq: true,
        zhjy: true,
        ksid: true,
        zcid: true,
        ybry: true,
        roles: true,
      },
      where,
      relations: {
        roles: true,
      },
      order: {
        jsrq: 'ASC',
      },
      take: pageSize,
      skip: (pageNo - 1) * pageSize,
    });
    return { pageData: users, total };
  }

  async remove(id: string) {
    // 不能删除根用户
    if (id === '1') throw new CustomException(ErrorCode.ERR_11006, '不能删除根用户');
    const user = await this.UsrcatRepo.findOne({
      where: { usid: id },
      relations: { roles: true },
    });
    user.roles = [];
    await this.UsrcatRepo.save(user);
    // 删除用户
    await this.UsrcatRepo.remove(user);
    return true;
  }

  async update(id: string, user: UpdateUserDto) {
    const findUser = await this.findUserProfile(id);
    if (user.roleIds !== undefined) {
      findUser.roles = await this.roleRepo.find({
        where: { id: In(user.roleIds) },
      });
    }
    const newUser = this.UsrcatRepo.merge(findUser, user);
    await this.UsrcatRepo.save(newUser);
    return true;
  }

  async resetPassword(usid: string, password: string) {
    const user = await this.UsrcatRepo.findOne({ where: { usid } });
    user.pwrd = password;
    await this.UsrcatRepo.save(user);
    return true;
  }

  async checkPassword(usid: string, password: string) {
    const user = await this.UsrcatRepo.findOne({ where: { usid } });
    return user.pwrd === password;
  }

  async updateProfile(id: string, profile: UpdateProfileDto) {
    const user = await this.findUserProfile(id);
    await this.UsrcatRepo.save(user);
    return true;
  }

  async findByUsid(usid: string) {
    const user = await this.UsrcatRepo.findOne({
      where: { usid },
      select: ['usid', 'unam', 'ybry', 'pwrd'],
      relations: {
        roles: true,
      },
    });
    return user;
  }

  async findUserProfile(usid: string) {
    const profile = await this.UsrcatRepo.findOne({
      where: { usid },
    });
    return profile;
  }

  async findUserDetail(usid: string, roleCode: string) {
    const user = await this.UsrcatRepo.findOne({
      select: ['usid', 'unam', 'ybry'],
      where: { usid },
      relations: {
        roles: true,
      },
    });
    const currentRole = user.roles?.find((item) => item.code === roleCode);
    if (!currentRole) {
      throw new CustomException(ErrorCode.ERR_11005, '您目前暂无此角色或已被禁用，请联系管理员');
    }
    return { ...user, currentRole };
  }

  async addRoles(userId: string, roleIds: string[]) {
    const user = await this.UsrcatRepo.findOne({
      where: { usid: userId },
      relations: { roles: true },
    });
    const roles = await this.roleRepo.find({
      where: roleIds.map((item) => ({ id: item })),
    });
    user.roles = user.roles.filter((item) => !roleIds.includes(item.id)).concat(roles);
    await this.UsrcatRepo.save(user);
    return true;
  }

  async findById(usid: string) {
    const user = await this.UsrcatRepo.findOne({
      where: { usid },
    });
    return user;
  }

  async findOutpatientDoctor() {
    return await this.UsrcatRepo.createQueryBuilder('usrcat')
      .where("isnull(usrcat.zhjy,0)=0 and ((usrcat.zcid like '01%' ) OR (usrcat.zcid like '03%'))")
      .andWhere("usrcat.usid in (select usid from __ksry where syid='23' or syid='12')")
      .orderBy('usrcat.usid')
      .getMany();
  }

  async findResidentDoctor() {
    return await this.UsrcatRepo.createQueryBuilder('usrcat')
      .where("isnull(usrcat.zhjy,0)=0 and ((usrcat.zcid like '01%' ) OR (usrcat.zcid like '03%'))")
      .andWhere("usrcat.usid in (select usid from __ksry where syid='12')")
      .orderBy('usrcat.usid')
      .getMany();
  }

  async findTollCollector() {
    return await this.UsrcatRepo.createQueryBuilder('usrcat')
      .where('isnull(usrcat.zhjy,0)=0')
      .andWhere("usrcat.usid in (select usid from __ksry where syid='12')")
      .orderBy('usrcat.usid')
      .getMany();
  }

  async findTollCollectorMZZY() {
    return await this.UsrcatRepo.createQueryBuilder('usrcat')
      .innerJoin(Ksry, 'ksry', 'usrcat.usid = ksry.usid')
      .where('usrcat.zhjy <> 1')
      .andWhere('ksry.syid IN (:...syids) OR usrcat.usid = :sa', { syids: ['11', '22'], sa: 'sa' })
      .distinct(true)
      .select([
        'usrcat.usid',
        'usrcat.unam',
        'usrcat.pybm',
        'usrcat.wbbm',
        'usrcat.qtbm',
        'usrcat.zcid',
        'usrcat.zwid',
        'usrcat.szbm',
      ])
      .orderBy('usrcat.usid', 'ASC')
      .getMany();
  }

  async getSysDepts(data: { userId: string; sysId: string }) {
    return await this.UsrcatRepo.createQueryBuilder('usrcat')
      .innerJoin(Ksry, 'ksry', 'usrcat.usid = ksry.usid')
      .innerJoin(ksmc, 'ksmc', 'ksmc.ksid = ksry.ksid')
      .where('usrcat.zhjy <> 1')
      .andWhere('ksry.syid = :syid', { syid: data.sysId })
      .andWhere('usrcat.usid = :usid', { usid: data.userId })
      .select(['ksmc.ksmc AS ksmc', 'ksry.ksid AS ksid', '0 AS szbz'])
      .orderBy('ksry.ksid', 'ASC')
      .distinct(true)
      .getRawMany();
  }
}
