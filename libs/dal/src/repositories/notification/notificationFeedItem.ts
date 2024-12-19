import {
  ExecutionDetailsSourceEnum,
  ExecutionDetailsStatusEnum,
  ProvidersIdEnum,
  StepTypeEnum,
  TriggerTypeEnum,
} from '@novu/shared';
import { StepFilter } from '../notification-template';
import { MessageTemplateEntity } from '../message-template';

export class NotificationFeedItem {
  _id: string;
  _templateId: string;
  _environmentId: string;
  _organizationId: string;
  _subscriberId: string;
  transactionId: string;
  channels: StepTypeEnum[];
  to: {
    subscriberId: string;
  };
  payload: {
    firstName: string;
  };
  tags: string[];
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  __v: number;
  template: TemplateFeedItem;
  subscriber: SubscriberFeedItem;
  jobs: JobFeedItem[];
  id: string;
}

export class TemplateFeedItem {
  _id: string;
  name: string;
  triggers: TriggerFeedItem[];
  id: string;
}

export class TriggerFeedItem {
  type: TriggerTypeEnum;
  identifier: string;
  variables: VariableFeedItem[];
  _id: string;
  reservedVariables: any[]; // Assuming this can be any type
  subscriberVariables: any[]; // Assuming this can be any type
  id: string;
}

export class VariableFeedItem {
  name: string;
  _id: string;
  id: string;
}

export class SubscriberFeedItem {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  subscriberId: string;
  phone?: string;
}

export class JobFeedItem {
  digest: DigestFeedItem;
  _id: string;
  status: string;
  payload: {
    firstName: string;
  };
  step: StepFeedItem;
  _notificationId: string;
  type: string;
  providerId: ProvidersIdEnum;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  executionDetails: ExecutionDetailFeedItem[];
  id: string;
}

export class DigestFeedItem {
  timed: {
    weekDays: string[];
    monthDays: string[];
  };
  events: any[]; // Assuming this can be any type
}

export class StepFeedItem {
  metadata: {
    timed: {
      weekDays: string[];
      monthDays: string[];
    };
  };
  active: boolean;
  shouldStopOnFail: boolean;
  uuid: string;
  type: string;
  filters: StepFilter[]; // Assuming this can be any type
  _templateId: string;
  variants: any[]; // Assuming this can be any type
  _id: string;
  id: string;
  template: MessageTemplateEntity;
}

export class VariableDetailFeedItem {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string;
  _id: string;
  id: string;
}

export class ExecutionDetailFeedItem {
  _id: string;
  _jobId: string;
  providerId: ProvidersIdEnum;
  detail: string;
  source: ExecutionDetailsSourceEnum;
  status: ExecutionDetailsStatusEnum;
  isTest: boolean;
  isRetry: boolean;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  id: string;
}
