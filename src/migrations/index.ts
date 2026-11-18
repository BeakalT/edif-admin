import * as migration_20261114_110438_initial from './20261114_110438_initial';
import * as migration_20261115_074120_notifications from './20261115_074120_notifications';

export const migrations = [
  {
    up: migration_20261114_110438_initial.up,
    down: migration_20261114_110438_initial.down,
    name: '20261114_110438_initial',
  },
  {
    up: migration_20261115_074120_notifications.up,
    down: migration_20261115_074120_notifications.down,
    name: '20261115_074120_notifications'
  },
];
