import * as migration_20261114_110438_initial from './20261114_110438_initial';
import * as migration_20261115_074120_notifications from './20261115_074120_notifications';
import * as migration_20261119_120000_recovery from './20261119_120000_recovery';

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
  {
    up: migration_20261119_120000_recovery.up,
    down: migration_20261119_120000_recovery.down,
    name: '20261119_120000_recovery'
  },
];
