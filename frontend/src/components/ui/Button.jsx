export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = "px-4 py-2 rounded-lg font-medium transition-all";

  const styles = {
    primary: "bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white hover:shadow-lg hover:scale-105",
    secondary: "bg-gray-200 dark:bg-[#334155] text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#475569]",
    outline: "border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
