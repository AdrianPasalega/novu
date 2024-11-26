import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../primitives/card';
import { ScrollBar, ScrollArea } from '../primitives/scroll-area';
import { Link } from 'react-router-dom';
import { useTelemetry } from '@/hooks/use-telemetry';
import { TelemetryEvent } from '@/utils/telemetry';

export interface Resource {
  title: string;
  duration: string;
  image: string;
  url: string;
}

interface ResourcesListProps {
  resources: Resource[];
  title: string;
  icon: React.ReactNode;
}

export function ResourcesList({ resources, title, icon }: ResourcesListProps) {
  const telemetry = useTelemetry();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: 10,
      y: 5,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.21, 1.02, 0.73, 0.99],
      },
    },
  };

  const handleResourceClick = (resource: Resource) => {
    telemetry(TelemetryEvent.RESOURCE_CLICKED, {
      title: resource.title,
      url: resource.url,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <motion.div
        className="font-weight-medium flex items-center gap-2 text-neutral-600"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {icon}
        <span className="text-xs font-medium">{title}</span>
      </motion.div>

      <ScrollArea className="w-full whitespace-nowrap">
        <motion.div className="flex gap-4 pb-7 pl-1" variants={containerVariants} initial="hidden" animate="show">
          {resources.map((resource, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link to={resource.url} target="_blank" rel="noopener" onClick={() => handleResourceClick(resource)}>
                <Card className="w-60 shrink-0 overflow-hidden border-none shadow-[0px_12px_32px_0px_rgba(0,0,0,0.02),0px_0px_0px_1px_rgba(0,0,0,0.05)] transition-all duration-200 hover:translate-y-[1px] hover:cursor-pointer hover:shadow-md">
                  <motion.div
                    className="h-[126px] overflow-hidden bg-neutral-50"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={`/images/welcome/${resource.image}`}
                      alt={resource.title}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>

                  <CardContent className="flex h-[94px] flex-col justify-between p-3">
                    <h3 className="whitespace-normal text-sm font-medium text-neutral-900">{resource.title}</h3>

                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-neutral-400" />
                      <span className="text-[10px] text-neutral-400">{resource.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}