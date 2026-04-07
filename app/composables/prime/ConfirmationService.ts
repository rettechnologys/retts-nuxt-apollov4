import { ConfirmationOptions } from 'primevue/confirmationoptions';
import ConfirmationEventBus from 'primevue/confirmationeventbus';

export const useConfirmationService = () => {
  const { $i18n } = useNuxtApp();
  // const { t } = $i18n;
  // const { t } = useI18n();
  const require = (options: ConfirmationOptions) =>
    ConfirmationEventBus.emit('confirm', options);

  const close = () => {
    ConfirmationEventBus.emit('close');
  };

  const saveProceed = (options?: ConfirmationOptions) =>
    ConfirmationEventBus.emit('confirm', {
      ...options,
      header: $i18n.t('action.confirm'),
      message: $i18n.t('confirm.proceed'),
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: $i18n.t('confirm.no'),
      acceptLabel: $i18n.t('confirm.yes'),
      rejectClass: 'p-button-secondary p-button-outlined',
      acceptClass: 'p-button-success',
    });

  const deleteSelected = (options?: ConfirmationOptions) =>
    ConfirmationEventBus.emit('confirm', {
      ...options,
      header: $i18n.t('action.confirm'),
      message: $i18n.t('confirm.delete_selected'),
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: $i18n.t('action.cancel'),
      acceptLabel: $i18n.t('action.delete'),
      rejectClass: 'p-button-secondary p-button-outlined',
      acceptClass: 'p-button-danger',
    });

  return { require, close, saveProceed, deleteSelected };
};
