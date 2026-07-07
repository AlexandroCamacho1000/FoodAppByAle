// frontend/src/components/ui/LoadingSpinner.jsx
const LoadingSpinner = ({ size = 'md', color = 'blue', text = '' }) => {
  const sizeMap = { sm: 'h-5 w-5 border-2', md: 'h-10 w-10 border-3', lg: 'h-16 w-16 border-4' };
  const colorMap = {
    blue: 'border-blue-600 dark:border-blue-400',
    purple: 'border-purple-600 dark:border-purple-400',
    white: 'border-white',
    gray: 'border-gray-600 dark:border-gray-400'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`animate-spin rounded-full ${sizeMap[size] || sizeMap.md} border-t-transparent ${colorMap[color] || colorMap.blue}`}
      />
      {text && <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;