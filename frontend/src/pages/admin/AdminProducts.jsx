// frontend/src/pages/admin/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { FiPackage, FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiSave, FiX, FiUpload, FiAlertCircle, FiCheckCircle, FiStar } from 'react-icons/fi';

const AdminProducts = () => {
  // Estado principal
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Salteñas',
    stock: '',
    image: '',
    ingredients: '',
    preparationTime: '',
    isFeatured: false,
    isActive: true
  });
  
  // Errores de validación
  const [errors, setErrors] = useState({});
  
  // Categorías de productos bolivianos
  const categories = [
    'Salteñas',
    'Carnes', 
    'Platos Fuertes',
    'Sopas',
    'Postres',
    'Bebidas',
    'Entradas'
  ];
  
  // Productos iniciales (solo si no hay en localStorage)
  const initialProducts = [
    { 
      id: generateId(),
      name: 'Salteña Paceña', 
      description: 'Deliciosa salteña tradicional rellena de carne jugosa, papa y arvejas, con un toque de ají colorado.',
      price: 15.50, 
      category: 'Salteñas', 
      stock: 50,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
      ingredients: 'Carne de res, papa, arvejas, cebolla, ají colorado, comino',
      preparationTime: '45 min',
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-01`
    },
    { 
      id: generateId(),
      name: 'Anticuchos', 
      description: 'Brochetas de corazón de res marinadas en una mezcla especial de ají, vinagre y especias andinas.',
      price: 28.00, 
      category: 'Carnes', 
      stock: 30,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      ingredients: 'Corazón de res, ají panca, vinagre, comino, ajo, orégano',
      preparationTime: '30 min',
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-02`
    },
    { 
      id: generateId(),
      name: 'Sillpancho', 
      description: 'Plato cochabambino con arroz, papa dorada, carne empanizada, huevo frito y ensalada fresca.',
      price: 42.00, 
      category: 'Platos Fuertes', 
      stock: 25,
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop',
      ingredients: 'Carne de res, huevo, pan molido, arroz, papa, tomate, lechuga',
      preparationTime: '60 min',
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-03`
    },
    { 
      id: generateId(),
      name: 'Pique Macho', 
      description: 'Plato potosino con carne de res, salchichas, papas fritas, huevo duro, tomate y locotos.',
      price: 65.00, 
      category: 'Platos Fuertes', 
      stock: 15,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
      ingredients: 'Carne de res, salchicha, papa, huevo, tomate, locoto, cebolla',
      preparationTime: '50 min',
      isFeatured: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-04`
    },
    { 
      id: generateId(),
      name: 'Fricasé', 
      description: 'Caldo picante de cerdo con mote pelado, chuño y ají amarillo. Tradición paceña.',
      price: 38.00, 
      category: 'Sopas', 
      stock: 40,
      image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop',
      ingredients: 'Carne de cerdo, mote, chuño, ají amarillo, cebolla, ajo',
      preparationTime: '90 min',
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-05`
    },
    { 
      id: generateId(),
      name: 'Humintas', 
      description: 'Tamales dulces de maíz fresco envueltos en hojas de choclo, cocidos al vapor.',
      price: 12.00, 
      category: 'Postres', 
      stock: 60,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      ingredients: 'Maíz fresco, azúcar, queso, canela, pasas',
      preparationTime: '60 min',
      isFeatured: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-06`
    }
  ];

  // Función para generar IDs únicos
  function generateId() {
    return `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cargar productos al inicio
  useEffect(() => {
    loadProducts();
  }, []);

  // Cargar productos desde localStorage
  const loadProducts = () => {
    console.log('📦 Cargando productos desde localStorage...');
    
    try {
      const savedProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
      
      if (savedProducts.length === 0) {
        // Si no hay productos guardados, usar los iniciales
        localStorage.setItem('admin_products', JSON.stringify(initialProducts));
        setProducts(initialProducts);
        
        // 🔄 SINCRONIZAR INMEDIATAMENTE CON MENU.JSX
        syncProductsToMenu(initialProducts);
        
        console.log('✅ Productos iniciales cargados y sincronizados');
      } else {
        setProducts(savedProducts);
        console.log(`✅ ${savedProducts.length} productos cargados desde localStorage`);
      }
    } catch (error) {
      console.error('❌ Error al cargar productos:', error);
      setProducts(initialProducts);
    } finally {
      setLoading(false);
    }
  };

  // Guardar productos en localStorage
  const saveProducts = (productsToSave) => {
    try {
      localStorage.setItem('admin_products', JSON.stringify(productsToSave));
      console.log('💾 Productos guardados en localStorage');
    } catch (error) {
      console.error('❌ Error al guardar productos:', error);
    }
  };

  // 🔄 FUNCIÓN CLAVE: Sincronizar productos con Menu.jsx
  const syncProductsToMenu = (productsArray) => {
    try {
      // Formatear productos para Menu.jsx (mantener compatibilidad)
      const menuProducts = productsArray
        .filter(product => product.isActive) // Solo productos activos
        .map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          isFeatured: product.isFeatured,
          // Campos adicionales que podría necesitar Menu.jsx
          ingredients: product.ingredients || '',
          preparationTime: product.preparationTime || '',
          stock: product.stock
        }));
      
      // Guardar en localStorage para que Menu.jsx pueda acceder
      localStorage.setItem('menu_products', JSON.stringify(menuProducts));
      
      // También guardar en 'products' para compatibilidad con servicios existentes
      localStorage.setItem('products', JSON.stringify(menuProducts));
      
      console.log(`🔄 ${menuProducts.length} productos sincronizados con Menu.jsx`);
      
      // Notificar a otros componentes que los productos han cambiado
      window.dispatchEvent(new Event('products-updated'));
      
    } catch (error) {
      console.error('❌ Error al sincronizar productos:', error);
    }
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.ingredients?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Calcular estadísticas
  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    lowStock: products.filter(p => p.stock < 10).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    featuredProducts: products.filter(p => p.isFeatured).length,
    activeProducts: products.filter(p => p.isActive).length
  };

  // Abrir modal para nuevo producto
  const handleNewProduct = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Salteñas',
      stock: '',
      image: '',
      ingredients: '',
      preparationTime: '',
      isFeatured: false,
      isActive: true
    });
    setImagePreview('');
    setErrors({});
    setEditingProduct(null);
    setShowModal(true);
  };

  // Abrir modal para editar producto
  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image,
      ingredients: product.ingredients || '',
      preparationTime: product.preparationTime || '',
      isFeatured: product.isFeatured,
      isActive: product.isActive
    });
    setImagePreview(product.image);
    setErrors({});
    setEditingProduct(product);
    setShowModal(true);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Si cambia la imagen, actualizar preview
    if (name === 'image' && value) {
      setImagePreview(value);
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.price || formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'El stock no puede ser negativo';
    if (!formData.category) newErrors.category = 'Selecciona una categoría';
    
    return newErrors;
  };

  // Guardar producto (crear o actualizar)
  const handleSaveProduct = () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert('Por favor corrige los errores en el formulario');
      return;
    }
    
    let updatedProducts;
    
    if (editingProduct) {
      // Actualizar producto existente
      updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { 
              ...editingProduct,
              ...formData,
              price: parseFloat(formData.price),
              stock: parseInt(formData.stock),
              updatedAt: new Date().toISOString()
            }
          : p
      );
      
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
      
      // 🔄 SINCRONIZAR CON MENU.JSX
      syncProductsToMenu(updatedProducts);
      
      alert('✅ Producto actualizado y sincronizado con el menú');
    } else {
      // Crear nuevo producto
      const newProduct = {
        id: generateId(),
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sku: `SKU-${Date.now().toString().slice(-6)}-${products.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
      
      // 🔄 SINCRONIZAR CON MENU.JSX
      syncProductsToMenu(updatedProducts);
      
      alert('✅ Producto creado y sincronizado con el menú');
    }
    
    setShowModal(false);
    setEditingProduct(null);
  };

  // Eliminar producto
  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
      
      // 🔄 SINCRONIZAR CON MENU.JSX
      syncProductsToMenu(updatedProducts);
      
      alert('🗑️ Producto eliminado y actualizado en el menú');
    }
  };

  // Toggle estado activo/inactivo
  const toggleProductStatus = (id) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    
    // 🔄 SINCRONIZAR CON MENU.JSX
    syncProductsToMenu(updatedProducts);
    
    alert(`🔄 Producto ${updatedProducts.find(p => p.id === id).isActive ? 'activado' : 'desactivado'}`);
  };

  // Toggle producto destacado
  const toggleFeatured = (id) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
    );
    
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    
    // 🔄 SINCRONIZAR CON MENU.JSX
    syncProductsToMenu(updatedProducts);
    
    alert(`⭐ Producto ${updatedProducts.find(p => p.id === id).isFeatured ? 'destacado' : 'quitado de destacados'}`);
  };

  // Restaurar productos iniciales
  const handleRestoreDefaults = () => {
    if (window.confirm('¿Restaurar productos a los valores iniciales? Se perderán los cambios.')) {
      localStorage.setItem('admin_products', JSON.stringify(initialProducts));
      setProducts(initialProducts);
      
      // 🔄 SINCRONIZAR CON MENU.JSX
      syncProductsToMenu(initialProducts);
      
      alert('🔄 Productos restaurados a valores iniciales y sincronizados');
    }
  };

  // Exportar productos (simulado)
  const handleExport = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `productos-bolivianos-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Forzar sincronización manual
  const handleForceSync = () => {
    syncProductsToMenu(products);
    alert('🔄 Sincronización manual completada');
  };

  return (
    <div className="p-6">
      {/* Modal de producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header del modal */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProduct ? '✏️ Editar Producto' : '🍽️ Nuevo Producto'}
                  </h2>
                  <p className="text-gray-600">
                    {editingProduct ? `Editando: ${editingProduct.name}` : 'Completa todos los campos requeridos'}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <FiX />
                </button>
              </div>

              {/* Formulario */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna izquierda - Información básica */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {/* Nombre */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Producto *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ej: Salteña Paceña"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Descripción */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Describe el producto..."
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                      )}
                    </div>

                    {/* Precio y Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Precio (Bs.) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.price ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0.00"
                        />
                        {errors.price && (
                          <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock *
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          min="0"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.stock ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0"
                        />
                        {errors.stock && (
                          <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                        )}
                      </div>
                    </div>

                    {/* Categoría y Tiempo de preparación */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Categoría *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.category ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Selecciona una categoría</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tiempo de preparación
                        </label>
                        <input
                          type="text"
                          name="preparationTime"
                          value={formData.preparationTime}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ej: 45 min"
                        />
                      </div>
                    </div>

                    {/* Ingredientes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ingredientes principales
                      </label>
                      <textarea
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Lista los ingredientes separados por comas"
                      />
                    </div>
                  </div>
                </div>

                {/* Columna derecha - Imagen y opciones */}
                <div className="lg:col-span-1">
                  {/* Preview de imagen */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagen del producto
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => {
                              setImagePreview('');
                              setFormData(prev => ({ ...prev, image: '' }));
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="py-12">
                          <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">Arrastra una imagen o ingresa la URL</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* URL de imagen */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de la imagen
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  {/* Opciones */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Producto destacado</p>
                        <p className="text-sm text-gray-600">Aparecerá en la página principal</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={formData.isFeatured}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Producto activo</p>
                        <p className="text-sm text-gray-600">Visible para los clientes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg font-medium flex items-center gap-2"
                >
                  <FiSave />
                  {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Encabezado principal */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🍽️ Gestión de Productos</h1>
          <p className="text-gray-600">Administra el menú de comida boliviana</p>
          <p className="text-sm text-blue-600 mt-1">
            🔄 Los cambios se sincronizan automáticamente con el menú
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleForceSync}
            className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 flex items-center gap-2"
          >
            🔄 Sincronizar
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            📥 Exportar
          </button>
          <button
            onClick={handleRestoreDefaults}
            className="px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 flex items-center gap-2"
          >
            🔄 Restaurar
          </button>
          <button
            onClick={handleNewProduct}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg font-medium flex items-center gap-2"
          >
            <FiPlus /> Nuevo Producto
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Barra de búsqueda */}
        <div className="lg:col-span-2">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos por nombre, categoría, ingredientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filtro por categoría */}
        <div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl border border-green-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">Valor Total</p>
            <p className="text-2xl font-bold text-gray-900">
              Bs. {stats.totalValue.toFixed(0)}
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-white p-4 rounded-xl border border-yellow-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">Bajo Stock</p>
            <p className={`text-2xl font-bold ${stats.lowStock > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
              {stats.lowStock}
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl border border-red-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">Sin Stock</p>
            <p className={`text-2xl font-bold ${stats.outOfStock > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {stats.outOfStock}
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">Destacados</p>
            <p className="text-2xl font-bold text-gray-900">{stats.featuredProducts}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">Activos</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
          </div>
        </div>
      </div>

      {/* Lista de Productos */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-gray-100 rounded-2xl p-12 text-center border border-gray-200">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No se encontraron productos</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || categoryFilter !== 'all' 
              ? `No hay productos que coincidan con "${searchTerm}"${categoryFilter !== 'all' ? ` en ${categoryFilter}` : ''}`
              : 'No hay productos registrados. ¡Crea el primero!'}
          </p>
          <button
            onClick={handleNewProduct}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg font-medium"
          >
            <FiPlus /> Crear Primer Producto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${
              !product.isActive ? 'opacity-70 border-gray-300' : 'border-gray-200'
            }`}>
              {/* Header de la tarjeta */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    product.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}></span>
                  <span className="text-sm font-medium text-gray-700">
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFeatured(product.id)}
                    className={`p-1 rounded ${
                      product.isFeatured 
                        ? 'text-yellow-500 bg-yellow-50' 
                        : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                    }`}
                  >
                    <FiStar />
                  </button>
                </div>
              </div>

              {/* Imagen */}
              <div className="h-48 relative">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center">
                    <span className="text-4xl">🍽️</span>
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isFeatured && (
                    <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ⭐ Destacado
                    </span>
                  )}
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                
                {/* Indicador de stock */}
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    product.stock > 20 ? 'bg-green-100 text-green-800' :
                    product.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                    product.stock === 0 ? 'bg-red-100 text-red-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {product.stock} en stock
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-5">
                {/* Nombre y precio */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-900 truncate">{product.name}</h3>
                  <span className="text-2xl font-bold text-blue-600 whitespace-nowrap">
                    Bs. {product.price.toFixed(2)}
                  </span>
                </div>
                
                {/* Descripción */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                {/* Detalles adicionales */}
                <div className="space-y-2 mb-5">
                  {product.ingredients && (
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Ingredientes:</span> {product.ingredients}
                    </p>
                  )}
                  {product.preparationTime && (
                    <p className="text-xs text-gray-500">
                      ⏱️ {product.preparationTime}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    📦 SKU: {product.sku || 'N/A'}
                  </p>
                </div>
                
                {/* Valor total en stock */}
                <div className="mb-5 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Valor en stock:</span>
                    <span className="font-bold text-gray-900">
                      Bs. {(product.price * product.stock).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {/* Acciones */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2 font-medium"
                  >
                    <FiEdit2 /> Editar
                  </button>
                  <button
                    onClick={() => toggleProductStatus(product.id)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      product.isActive
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {product.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pie de página */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>
          Mostrando {filteredProducts.length} de {products.length} productos • 
          Los cambios se sincronizan automáticamente con el menú
        </p>
      </div>
    </div>
  );
};

export default AdminProducts;