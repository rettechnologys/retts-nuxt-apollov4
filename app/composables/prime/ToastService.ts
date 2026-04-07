import { ToastMessageOptions } from 'primevue/toast';
import ToastEventBus from 'primevue/toasteventbus';
import { PRIME } from '~/utils/config';

export const useToastService = () => {
  // const toast2 = {
  //   add: (message: ToastMessageOptions) => ToastEventBus.emit('add', message),
  //   removeGroup: (group: any) => ToastEventBus.emit('remove-group', group),
  //   removeAllGroups: () => ToastEventBus.emit('remove-all-groups'),
  // };

  const { t } = useI18n();

  const add = (options: ToastMessageOptions) =>
    ToastEventBus.emit('add', options);

  const removeGroup = (group: any) => {
    ToastEventBus.emit('remove-group', group);
  };

  const removeAllGroups = () => {
    ToastEventBus.emit('remove-all-groups');
  };

  const successSaved = (options?: ToastMessageOptions) =>
    ToastEventBus.emit('add', {
      ...options,
      severity: 'success',
      summary: t('notif.success'),
      detail: t('notif.successfully_saved'),
      life: PRIME.TOAST_LIFE,
    });

  const errorSaving = (options?: ToastMessageOptions) =>
    ToastEventBus.emit('add', {
      ...options,
      severity: 'error',
      summary: t('notif.error'),
      detail: t('notif.error_occurred_saving'),
      life: PRIME.TOAST_LIFE,
    });

  const successDeleted = (options?: ToastMessageOptions) =>
    ToastEventBus.emit('add', {
      ...options,
      severity: 'success',
      summary: t('notif.success'),
      detail: t('notif.successfully_deleted'),
      life: PRIME.TOAST_LIFE,
    });

  const errorDeleting = (options?: ToastMessageOptions) =>
    ToastEventBus.emit('add', {
      ...options,
      severity: 'error',
      summary: t('notif.error'),
      detail: t('notif.error_occurred_deleting'),
      life: PRIME.TOAST_LIFE,
    });

  return {
    add,
    removeGroup,
    removeAllGroups,
    successSaved,
    errorSaving,
    successDeleted,
    errorDeleting,
  };
};
