import { RGlobalConfigDto } from '@/modules/data/internal/data-source/data-contracts';
import { SysLangEntity } from '../sys/sys-lang/SysLangEntity';
import { SysConfigEntity } from '../sys/sys-config/SysConfigEntity';
import { SysGroupParentEntity } from '../sys/sys-group/SysGroupParentEntity';

export class GlobalConfigEntity implements RGlobalConfigDto {
  //sysConfigs: SysConfigEntity[];
  sysConfigs: string;
  sysGroupParents: SysGroupParentEntity[];
  sysLangs: SysLangEntity[];
}
