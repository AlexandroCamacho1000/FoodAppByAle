export default function Button({ children, variant = 'primary' }) {
  const base = "px-4 py-2 rounded-lg font-medium transition-colors";
  
  const styles = {
    primary: "bg-amber-600 text-white hover:bg-amber-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-amber-600 text-amber-600 hover:bg-amber-50"
  };

  return (
    <button className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
}