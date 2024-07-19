export { MonitorClient } from './api';
export { ExternalCreateMonitorRequest as CreateMonitorRequest } from './models/monitor';
export { CreateMonitorResponse, DeletedMonitorResponse } from './models/response';
export {
  NotificationType,
  SaveNotificationRequest as NotificationRequest,
  NotificationSummary as NotificationResponse,
} from './models/notification';

export { BlockWatcher } from './models/blockwatcher';

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const VERSION = require('../package.json').version;
