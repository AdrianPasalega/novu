import { useState } from 'react';
import { Tabs } from '@radix-ui/react-tabs';
import { RiCalendarScheduleFill } from 'react-icons/ri';
import { useFormContext } from 'react-hook-form';
import { TimeUnitEnum } from '@novu/shared';

import { FormField, FormLabel, FormMessagePure } from '@/components/primitives/form/form';
import { Separator } from '@/components/primitives/separator';
import { TabsContent, TabsList, TabsTrigger } from '@/components/primitives/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/primitives/tooltip';
import { RegularDigest } from '@/components/workflow-editor/steps/digest/regular-digest';
import { ScheduledDigest } from '@/components/workflow-editor/steps/digest/scheduled-digest';
import { AMOUNT_KEY, CRON_KEY, UNIT_KEY } from '@/components/workflow-editor/steps/digest/keys';
import { useSaveForm } from '@/components/workflow-editor/steps/save-form-context';
import { EVERY_MINUTE_CRON } from '@/components/workflow-editor/steps/digest/utils';

const REGULAR_DIGEST_TYPE = 'regular';
const SCHEDULED_DIGEST_TYPE = 'scheduled';
const TWO_SECONDS = 2000;

export const DigestWindow = () => {
  const { control, getFieldState, setValue, setError, getValues, trigger } = useFormContext();
  const formValues = getValues();
  const { amount } = formValues.controlValues;
  const { saveForm } = useSaveForm();
  const [digestType, setDigestType] = useState(
    typeof amount !== 'undefined' ? REGULAR_DIGEST_TYPE : SCHEDULED_DIGEST_TYPE
  );
  const amountField = getFieldState(`${AMOUNT_KEY}`);
  const unitField = getFieldState(`${UNIT_KEY}`);
  const cronField = getFieldState(`${CRON_KEY}`);
  const regularDigestError = amountField.error || unitField.error;
  const scheduledDigestError = cronField.error;

  return (
    <div className="flex flex-col gap-2">
      <FormLabel>
        <span className="flex items-center gap-1">
          <RiCalendarScheduleFill className="size-4" />
          <span>Digest window</span>
        </span>
      </FormLabel>
      <Tabs
        value={digestType}
        className="flex h-full flex-1 flex-col"
        onBlur={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onValueChange={async (value) => {
          setDigestType(value);
          if (value === SCHEDULED_DIGEST_TYPE) {
            setValue(AMOUNT_KEY, undefined, { shouldDirty: true });
            setValue(UNIT_KEY, undefined, { shouldDirty: true });
            setValue(CRON_KEY, EVERY_MINUTE_CRON, { shouldDirty: true });
          } else {
            setValue(AMOUNT_KEY, '', { shouldDirty: true });
            setValue(UNIT_KEY, TimeUnitEnum.SECONDS, { shouldDirty: true });
            setValue(CRON_KEY, undefined, { shouldDirty: true });
          }
          await trigger();
          saveForm();
        }}
      >
        <div className="bg-neutral-alpha-50 flex flex-col rounded-lg border border-solid border-neutral-100">
          <div className="rounded-t-lg p-2">
            <TabsList className="w-full">
              <Tooltip delayDuration={TWO_SECONDS}>
                <TooltipTrigger className="ml-1" asChild>
                  <span className="flex-1">
                    <TabsTrigger value={REGULAR_DIGEST_TYPE} className="w-full text-xs">
                      Regular
                    </TabsTrigger>
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-56" side="top" sideOffset={10}>
                  <span>
                    Set the amount of time to digest events for. Once the defined time has elapsed, the digested events
                    are sent, and another digest begins immediately.
                  </span>
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={TWO_SECONDS}>
                <TooltipTrigger className="ml-1" asChild>
                  <span className="flex-1">
                    <TabsTrigger value={SCHEDULED_DIGEST_TYPE} className="w-full text-xs">
                      Scheduled
                    </TabsTrigger>
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-56" side="top" sideOffset={10}>
                  <span>
                    Schedule the digest on a repeating basis (every 3 hours, every Friday at 6 p.m., etc.) to get full
                    control over when your digested events are processed and sent.
                  </span>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </div>
          <Separator className="bg-neutral-100" />
          <div className="bg-background rounded-b-lg p-2">
            <TabsContent value={REGULAR_DIGEST_TYPE}>
              <RegularDigest />
            </TabsContent>
            <TabsContent value={SCHEDULED_DIGEST_TYPE}>
              <FormField
                control={control}
                name={CRON_KEY}
                render={({ field }) => (
                  <ScheduledDigest
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      saveForm();
                    }}
                    onError={() => {
                      setError(CRON_KEY, { message: 'Failed to parse cron' });
                    }}
                  />
                )}
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
      <FormMessagePure
        error={digestType === REGULAR_DIGEST_TYPE ? regularDigestError?.message : scheduledDigestError?.message}
      />
    </div>
  );
};
