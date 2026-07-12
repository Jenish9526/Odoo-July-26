import { NewspaperIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const newsList = [
  {
    id: 1,
    category: 'LLM Development',
    title: 'Claude 3.7 Sonnet Released with Hybrid Thinking Mode',
    summary: 'Anthropic debuts hybrid thinking models with seamless toggle between real-time processing and deep reasoning.',
    time: '2h ago',
    tagColor: 'text-brand-violet bg-brand-violet/10 border-brand-violet/20',
  },
  {
    id: 2,
    category: 'Open Source',
    title: 'Llama 4 Ultra Achieves SOTA Benchmarks on Math and Coding',
    summary: 'Meta publishes open-weights weights for Llama 4, establishing a new bar for local execution agents.',
    time: '5h ago',
    tagColor: 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20',
  },
  {
    id: 3,
    category: 'GPU Hardware',
    title: 'Nvidia Rubin Architecture Details Leaked Ahead of Schedule',
    summary: 'Next-gen HBM4 memory interfaces set to expand bandwidth parameters by up to 2.4x for AI clusters.',
    time: '12h ago',
    tagColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
];

const AINewsWidget = () => {
  return (
    <div className="glass-card rounded-xl p-5 shadow-sm dark:shadow-glass border-glow font-sans flex flex-col justify-between h-full min-h-[220px] transition-colors duration-200">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5">
            <NewspaperIcon className="h-4.5 w-4.5 text-brand-violet" />
            <span className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
              AI & Tech Intelligence
            </span>
          </div>
          <span className="text-[9px] font-mono text-gray-400 dark:text-dark-muted">Live Wire</span>
        </div>

        {/* Headlines List */}
        <div className="space-y-4">
          {newsList.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg/25 transition-all duration-200"
            >
              <div className="flex justify-between items-center gap-2">
                <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 border rounded ${item.tagColor}`}>
                  {item.category}
                </span>
                <span className="text-[9px] font-mono text-gray-400 dark:text-dark-muted">{item.time}</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-brand-violet dark:group-hover:text-brand-cyan transition-colors flex items-center gap-1">
                  <span>{item.title}</span>
                  <ArrowTopRightOnSquareIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-dark-muted mt-0.5 line-clamp-2">
                  {item.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AINewsWidget;
