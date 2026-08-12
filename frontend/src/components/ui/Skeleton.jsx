const SkeletonBox = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-[#334155] rounded ${className}`} />
);

const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`animate-pulse bg-gray-200 dark:bg-[#334155] rounded h-4 ${
          i === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-md overflow-hidden">
    <SkeletonBox className="h-48 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <SkeletonBox className="h-5 w-3/4" />
      <SkeletonBox className="h-4 w-1/2" />
      <SkeletonText lines={2} />
      <div className="flex justify-between items-center pt-2">
        <SkeletonBox className="h-6 w-20" />
        <SkeletonBox className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  </div>
);

const SkeletonTableRow = ({ columns = 5 }) => (
  <tr className="animate-pulse">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <SkeletonBox className={`h-4 ${i === 0 ? 'w-32' : 'w-20'}`} />
      </td>
    ))}
  </tr>
);

const SkeletonTable = ({ rows = 5, columns = 5 }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-[#334155]">
      <thead className="bg-gray-50 dark:bg-[#0f172a]">
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="px-4 py-3">
              <SkeletonBox className="h-4 w-16" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-[#1e293b] divide-y divide-gray-200 dark:divide-[#334155]">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonTableRow key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

const Skeleton = ({ type = 'text', ...props }) => {
  switch (type) {
    case 'card': return <SkeletonCard />;
    case 'table': return <SkeletonTable {...props} />;
    case 'table-row': return <SkeletonTableRow {...props} />;
    case 'box': return <SkeletonBox {...props} />;
    default: return <SkeletonText {...props} />;
  }
};

Skeleton.Card = SkeletonCard;
Skeleton.Table = SkeletonTable;
Skeleton.TableRow = SkeletonTableRow;
Skeleton.Text = SkeletonText;
Skeleton.Box = SkeletonBox;

export default Skeleton;