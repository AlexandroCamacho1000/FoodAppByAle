import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';

export default function TestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-4">Cargando productos...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">✅ Test ProductService</h2>
      <p>Productos cargados: {products.length}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {products.slice(0, 3).map(p => (
          <div key={p.id} className="border p-2 rounded">
            <strong>{p.name}</strong>
            <div>Bs. {p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}