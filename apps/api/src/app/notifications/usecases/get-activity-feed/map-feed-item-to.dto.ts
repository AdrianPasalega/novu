import { NotificationFeedItem } from '@novu/dal';
import { ActivityNotificationResponseDto } from '../../dtos/activities-response.dto';

export function mapFeedItemToDto(notificationEntity: NotificationFeedItem): ActivityNotificationResponseDto {
  const activityNotificationResponseDto: ActivityNotificationResponseDto = {
    _id: notificationEntity._id,
    _environmentId: notificationEntity._environmentId.toString(),
    _organizationId: notificationEntity._organizationId.toString(),
    transactionId: notificationEntity.transactionId,
    createdAt: notificationEntity.createdAt,
    channels: notificationEntity.channels,
  };

  if (notificationEntity.template) {
    activityNotificationResponseDto.template = {
      _id: notificationEntity.template._id,
      name: notificationEntity.template.name,
      triggers: notificationEntity.template.triggers,
    };
  }
  activityNotificationResponseDto.subscriber = {
    _id: notificationEntity.subscriber._id,
    email: notificationEntity.subscriber.email,
    firstName: notificationEntity.subscriber.firstName,
    lastName: notificationEntity.subscriber.lastName,
    phone: notificationEntity.subscriber.phone,
  };
  activityNotificationResponseDto.jobs = notificationEntity.jobs.map((job) => {
    return {
      _id: job._id,
      type: job.type,
      executionDetails: job.executionDetails,
      step: job.step,
      providerId: job.providerId,
      status: job.status,
    };
  });

  return activityNotificationResponseDto;
}
