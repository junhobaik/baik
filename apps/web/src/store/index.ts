import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const sidebarCollapsed = atomWithStorage('sidebarCollapsed', true);

export const enEnabled = atom(true);
