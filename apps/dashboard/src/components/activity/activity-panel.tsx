import { Route } from 'lucide-react';
import { motion } from 'motion/react';
import { RiPlayCircleLine } from 'react-icons/ri';
import { ActivityJobItem } from './activity-job-item';
import { InlineToast } from '../primitives/inline-toast';
import { useFetchActivity } from '@/hooks/use-fetch-activity';
import { ActivityPanelProps } from './types';
import { ActivityOverview } from './components/activity-overview';
import { IActivityJob } from '@novu/shared';

function LogsSection({ jobs }: { jobs: IActivityJob[] }): JSX.Element {
  return (
    <div className="flex flex-col gap-6 bg-white p-3">
      {jobs.map((job, index) => (
        <ActivityJobItem key={job._id} job={job} isFirst={index === 0} isLast={index === jobs.length - 1} />
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-2 border-b border-t border-neutral-200 border-b-neutral-100 p-2">
        <div className="h-3 w-3 rounded-full bg-neutral-200" />
        <div className="h-[20px] w-32 rounded bg-neutral-200" />
      </div>

      <div className="px-3 py-2">
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-neutral-200" />
              <div className="h-3 w-32 rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-t border-neutral-100 p-2">
        <div className="h-3 w-3 rounded-full bg-neutral-200" />
        <div className="h-4 w-16 rounded bg-neutral-200" />
      </div>

      <div className="flex flex-col gap-6 bg-white p-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="h-4 w-40 rounded bg-neutral-200" />
              <div className="h-4 w-24 rounded bg-neutral-200" />
            </div>
            <div className="h-16 w-full rounded bg-neutral-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivityPanel({ activityId, onActivitySelect }: ActivityPanelProps) {
  const { activity, isPending, error } = useFetchActivity({ activityId });

  if (isPending) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <LoadingSkeleton />
      </motion.div>
    );
  }

  if (error || !activity) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="flex h-96 items-center justify-center">
          <div className="text-foreground-600 text-sm">Failed to load activity details</div>
        </div>
      </motion.div>
    );
  }

  const isMerged = activity.jobs.some((job) => job.status === 'merged');

  return (
    <motion.div
      key={activityId}
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="h-full"
    >
      <div>
        <div className="flex items-center gap-2 border-b border-t border-neutral-200 border-b-neutral-100 p-2 px-3">
          <Route className="h-3 w-3" />
          <span className="text-foreground-950 text-sm font-medium">
            {activity.template?.name || 'Deleted workflow'}
          </span>
        </div>
        <ActivityOverview activity={activity} />

        <div className="flex items-center gap-2 border-b border-t border-neutral-100 p-2 px-3">
          <RiPlayCircleLine className="h-3 w-3" />
          <span className="text-foreground-950 text-sm font-medium">Logs</span>
        </div>

        {isMerged && (
          <div className="px-3 py-3">
            <InlineToast
              ctaClassName="text-foreground-950"
              variant={'tip'}
              ctaLabel="View Execution"
              onCtaClick={() => {
                if (activity._digestedNotificationId) {
                  onActivitySelect(activity._digestedNotificationId);
                }
              }}
              description="Remaining execution has been merged to an active Digest of an existing workflow execution."
            />
          </div>
        )}
        <LogsSection jobs={activity.jobs} />
      </div>
    </motion.div>
  );
}