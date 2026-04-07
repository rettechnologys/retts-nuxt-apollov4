import userNoPhoto from '@/assets/images/user-nophoto.png';
// import { AuthEntity } from '~/core/modules/domain/internal/auth/AuthEntity';
// import { useAppADStore } from '@/stores/AppADStore';
import { UNKNOWN } from '@/utils/types/Constan';
import { EGender, EGenderID, ESalutation, ESalutationID } from '@/utils/types/Enum';
import { getInitialName } from './String';

export function getAvatar() {
  //TODO: Fix composable 
  // const appADStore = useAppADStore();
  // const adState = appADStore.getState as AuthEntity;
  // const avatarUrl = adState?.sysUser?.profile?.avatarUrl;
  // const userInitial = getInitialName(adState?.sysUser?.name);
  const userInitial = getInitialName('John Doe'); // Placeholder for user name, replace with actual user name logic

  // return avatarUrl ? avatarUrl + '?t=' + new Date().getTime() : userInitial;
  return userInitial
}

export const addTimeStamp = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }
  return value + '?t=' + new Date().getTime();
};

export function getUserFullName(fullName: any, userName: string) {
  let firstName = '';
  if ('firstName' in fullName) {
    firstName = fullName?.firstName.trim();
  }

  let lastName = '';
  if ('lastName' in fullName) {
    lastName = fullName?.lastName.trim();
  }

  const name = `${firstName} ${lastName}`;

  if (name.trim() != '') {
    return name.trim();
  }

  return userName.trim();
}

export function getSalutation(locale = 'id') {
  let salutation = UNKNOWN;
  // const appADStore = useAppADStore();
  // const adState = appADStore.getState as AuthEntity;
  // const gender = adState?.sysUser?.profile?.gender;
  const gender = EGender.Male;

  if (gender === EGender.Male || gender === EGenderID.Pria) {
    salutation = locale === 'id' ? ESalutationID.Bapak : ESalutation.Mr;
  } else if (gender === EGender.Female || gender === EGenderID.Wanita) {
    salutation = locale === 'id' ? ESalutationID.Ibu : ESalutation.Mrs;
  }

  return salutation;
}
