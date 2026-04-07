import { meContainer } from '~/modules//domain/internal/me/MeContainer';
import { MePloc } from './MePloc';

function instanceMePloc(): MePloc {
  return meContainer.resolve(MePloc);
}

export const mePlocResolver = {
  instanceMePloc,
};
