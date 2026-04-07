import {
  UseTimeAgoMessagesBuiltIn,
  UseTimeAgoUnitNamesDefault,
} from '@vueuse/core';

export type TimeUnits = keyof UseTimeAgoMessagesBuiltIn &
  UseTimeAgoUnitNamesDefault;
