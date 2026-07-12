import { useState } from 'react';
import {
  CommandLineIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const rawActivities = [
  {
    id: 1,
    type: 'success',
    title: 'Cluster DB replication complete',
    description: 'PostgreSQL secondary database replica successfully caught up with master node in 324ms.',
    time: '2 mins ago',
    category: 'system',
  },
  {
    id: 2,
    type: 'warning',
    title: 'API Gateway high response latency',
    description: 'Endpoint /api/v1/telemetry registered peak latency at 840ms. Auto-scaling worker group initiated.',
    time: '14 mins ago',
    category: 'warnings',
  },
  {
    id: 3,
    type: 'info',
    title: 'New API token requested',
    description: 'Developer token created by user sujal@antigravity.io for local deployment testing.',
    time: '45 mins ago',
    category: 'info',
  },
  {
    id: 4,
    type: 'success',
    title: 'Docker image deploy succeeded',
    description: 'Antigravity Core CLI v1.2.4-stable successfully built, tested, and published to AWS ECR registry.',
    time: '1h ago',
    category: 'system',
  },
  {
    id: 5,
    type: 'info',
    title: 'Security policy review initiated',
    description: 'Auto-scan flag triggered for IAM access key rotations on AWS console sub-accounts.',
    time: '3h ago',
    category: 'info',
  },
];

const ActivityTimeline = () => {
  const [filter, setFilter] = useState('all');

  const filteredActivities = rawActivities.filter((act) => {
    if (filter === 'all') return true;
    return act.category === filter;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-4 w-4 text-brand-emerald" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />;
      case 'info':
      default:
        return <InformationCircleIcon className="h-4 w-4 text-brand-cyan" />;
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 shadow-sm dark:shadow-glass border-glow font-sans h-full flex flex-col justify-between transition-colors duration-200">
      <div>
        <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-1.5">
            <CommandLineIcon className="h-4.5 w-4.5 text-brand-violet" />
            <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
              System Activity Logs
            </span>
          </div>

          {/* Filter Pill List */}
          <div className="flex gap-1 bg-gray-50 dark:bg-dark-bg p-0.5 rounded-lg border border-gray-100 dark:border-dark-border select-none text-[9px] font-bold">
            {['all', 'system', 'warnings', 'info'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2 py-0.5 rounded-md capitalize transition-all ${
                  filter === cat
                    ? 'bg-white dark:bg-dark-card text-brand-violet dark:text-white shadow-sm'
                    : 'text-gray-400 dark:text-dark-muted hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Stack */}
        <div className="relative border-l border-gray-100 dark:border-dark-border pl-4 space-y-5 ml-2 mt-2">
          {filteredActivities.map((act) => (
            <div key={act.id} className="relative group">
              {/* Point Indicator */}
              <span className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center justify-center group-hover:scale-110 transition-transform">
                {getIcon(act.type)}
              </span>

              {/* Text Container */}
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between items-baseline gap-4">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-brand-violet dark:group-hover:text-brand-cyan transition-colors">
                    {act.title}
                  </h4>
                  <span className="text-[9px] font-mono text-gray-400 dark:text-dark-muted shrink-0">
                    {act.time}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-dark-muted leading-relaxed">
                  {act.description}
                </p>
              </div>
            </div>
          ))}
          {filteredActivities.length === 0 && (
            <div className="text-center py-6 text-gray-400 dark:text-dark-muted text-xs">
              No matching log traces found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;
