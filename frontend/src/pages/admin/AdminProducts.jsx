import React, { useState, useEffect } from 'react';
import { FiPackage, FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiSave, FiX, FiUpload, FiAlertCircle, FiCheckCircle, FiStar } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import Toast from '../../components/ui/Toast';

const AdminProducts = () => {
const { t, language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    descriptionEn: '',
    price: '',
    category: 'salteñas',
    stock: '',
    image: '',
    ingredients: '',
    ingredientsEn: '',
    preparationTime: '',
    isFeatured: false,
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  
  const categories = [
    'salteñas',
    'platos_fuertes',
    'bebidas',
    'entradas',
    'postres',
    'especiales'
  ];
  
  const initialProducts = [
    {
      id: generateId(),
      name: 'Salteña Paceña',
      description: 'Deliciosa salteña tradicional paceña con jugoso relleno de carne, papa, arvejas y especias.',
      descriptionEn: 'Traditional La Paz salteña with juicy beef filling, potatoes, peas and spices.',
      price: 12.50,
      category: 'salteñas',
      stock: 50,
      image: '/images/saltena.jpg',
      ingredients: 'Carne de res, papa, arvejas, cebolla, ají colorado, comino',
      ingredientsEn: 'Beef, potatoes, peas, onion, red chili, cumin',
      preparationTime: '25 min',
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-01`
    },
    {
      id: generateId(),
      name: 'Anticuchos',
      description: 'Brochetas de corazón de res marinadas en ají y especias, acompañadas de papas y salsa de maní.',
      descriptionEn: 'Beef heart skewers marinated in chili and spices, served with potatoes and peanut sauce.',
      price: 25.00,
      category: 'platos_fuertes',
      stock: 30,
      image: '/images/anticuchos.jpg',
      ingredients: 'Corazón de res, ají panca, vinagre, comino, ajo, orégano',
      ingredientsEn: 'Beef heart, chili, vinegar, cumin, garlic, oregano',
      preparationTime: '20 min',
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-02`
    },
    {
      id: generateId(),
      name: 'Sopa de Maní',
      description: 'Crema espesa de maní con papa, arroz y carne, acompañada de chuño phuti.',
      descriptionEn: 'Thick peanut cream soup with potato, rice and beef, served with chuño phuti.',
      price: 18.00,
      category: 'platos_fuertes',
      stock: 25,
      image: '/images/sopa-mani.jpg',
      ingredients: 'Maní, papa, arroz, carne de res, chuño, cebolla',
      ingredientsEn: 'Peanuts, potato, rice, beef, freeze-dried potato, onion',
      preparationTime: '40 min',
      isFeatured: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-03`
    },
    {
      id: generateId(),
      name: 'Pique Macho',
      description: 'Trozos de carne, salchicha, papas fritas, cebolla, locoto y huevo, bañados en salsa de la casa.',
      descriptionEn: 'Beef pieces, sausage, french fries, onion, locoto and egg, bathed in house sauce.',
      price: 45.00,
      category: 'platos_fuertes',
      stock: 20,
      image: '/images/pique-macho.jpg',
      ingredients: 'Carne de res, salchicha, papa, huevo, tomate, locoto, cebolla',
      ingredientsEn: 'Beef, sausage, potato, egg, tomato, locoto pepper, onion',
      preparationTime: '50 min',
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-04`
    },
    {
      id: generateId(),
      name: 'Silpancho Cochabambino',
      description: 'Arroz, papa dorada, carne empanizada, huevo frito, salsa criolla y ensalada.',
      descriptionEn: 'Rice, golden potatoes, breaded beef, fried egg, criollo sauce and salad.',
      price: 35.00,
      category: 'platos_fuertes',
      stock: 25,
      image: '/images/silpancho.jpg',
      ingredients: 'Arroz, papa, carne de res, huevo, tomate, cebolla, lechuga',
      ingredientsEn: 'Rice, potato, beef, egg, tomato, onion, lettuce',
      preparationTime: '60 min',
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-05`
    },
    {
      id: generateId(),
      name: 'Majadito',
      description: 'Arroz con carne desmenuzada, plátano frito, huevo y yuca, típico del oriente boliviano.',
      descriptionEn: 'Rice with shredded beef, fried plantain, egg and yucca, typical of eastern Bolivia.',
      price: 30.00,
      category: 'platos_fuertes',
      stock: 20,
      image: '/images/majadito.jpg',
      ingredients: 'Arroz, carne desmenuzada, plátano, huevo, yuca, cebolla',
      ingredientsEn: 'Rice, shredded beef, plantain, egg, yucca, onion',
      preparationTime: '45 min',
      isFeatured: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-06`
    },
    {
      id: generateId(),
      name: 'Api con Pastel',
      description: 'Bebida caliente de maíz morado acompañada de pastel de queso o empanada de queso.',
      descriptionEn: 'Hot purple corn drink served with cheese pastry or cheese empanada.',
      price: 15.00,
      category: 'bebidas',
      stock: 40,
      image: '/images/api-pastel.jpg',
      ingredients: 'Maíz morado, piña, canela, clavo de olor, azúcar',
      ingredientsEn: 'Purple corn, pineapple, cinnamon, cloves, sugar',
      preparationTime: '15 min',
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-07`
    },
    {
      id: generateId(),
      name: 'Mocochinchi',
      description: 'Refrescante bebida de durazno deshidratado, canela y clavo de olor.',
      descriptionEn: 'Refreshing dried peach drink with cinnamon and cloves.',
      price: 12.00,
      category: 'bebidas',
      stock: 50,
      image: '/images/mocochinchi.jpg',
      ingredients: 'Durazno deshidratado, canela, clavo de olor, azúcar',
      ingredientsEn: 'Dried peach, cinnamon, cloves, sugar',
      preparationTime: '10 min',
      isFeatured: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-08`
    },
    {
      id: generateId(),
      name: 'Humintas',
      description: 'Choclo rallado envuelto en sus propias hojas, relleno de queso y anís.',
      descriptionEn: 'Grated corn wrapped in corn husks, filled with cheese and anise.',
      price: 10.00,
      category: 'entradas',
      stock: 35,
      image: '/images/humintas.jpg',
      ingredients: 'Choclo, queso, anís, sal, mantequilla',
      ingredientsEn: 'Corn, cheese, anise, salt, butter',
      preparationTime: '30 min',
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-09`
    },
    {
      id: generateId(),
      name: 'Cuñapé',
      description: 'Panecillos de queso y yuca, típicos del oriente boliviano, crujientes por fuera y suaves por dentro.',
      descriptionEn: 'Cheese and yucca bread rolls, typical of eastern Bolivia, crispy outside and soft inside.',
      price: 8.00,
      category: 'entradas',
      stock: 40,
      image: '/images/cunape.jpg',
      ingredients: 'Yuca, queso, huevo, leche, mantequilla, sal',
      ingredientsEn: 'Yucca, cheese, egg, milk, butter, salt',
      preparationTime: '25 min',
      isFeatured: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-10`
    },
    {
      id: generateId(),
      name: 'Leche Asada',
      description: 'Postre tradicional boliviano a base de leche, huevos, azúcar y canela, horneado a la perfección.',
      descriptionEn: 'Traditional Bolivian dessert made with milk, eggs, sugar and cinnamon, baked to perfection.',
      price: 15.00,
      category: 'postres',
      stock: 30,
      image: '/images/leche-asada.jpg',
      ingredients: 'Leche, huevos, azúcar, canela, esencia de vainilla',
      ingredientsEn: 'Milk, eggs, sugar, cinnamon, vanilla extract',
      preparationTime: '50 min',
      isFeatured: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      sku: `SKU-${Date.now().toString().slice(-6)}-11`
    }
  ];

  function generateId() {
    return `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    try {
      const savedProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
      
      if (savedProducts.length === 0) {
        localStorage.setItem('admin_products', JSON.stringify(initialProducts));
        setProducts(initialProducts);
        syncProductsToMenu(initialProducts);
      } else {
        const migrated = savedProducts.map(p => ({
          ...p,
          descriptionEn: p.descriptionEn || '',
          ingredientsEn: p.ingredientsEn || ''
        }));
        setProducts(migrated);
        saveProducts(migrated);
      }
    } catch (error) {
      setProducts(initialProducts);
    } finally {
      setLoading(false);
    }
  };

  const saveProducts = (productsToSave) => {
    try {
      localStorage.setItem('admin_products', JSON.stringify(productsToSave));
    } catch (error) {
    }
  };

  const syncProductsToMenu = (productsArray) => {
    try {
      const menuProducts = productsArray
        .filter(product => product.isActive)
        .map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          descriptionEn: product.descriptionEn || '',
          price: product.price,
          category: product.category,
          image: product.image,
          isFeatured: product.isFeatured,
          ingredients: product.ingredients || '',
          ingredientsEn: product.ingredientsEn || '',
          preparationTime: product.preparationTime || '',
          stock: product.stock
        }));
      
      localStorage.setItem('menu_products', JSON.stringify(menuProducts));
      localStorage.setItem('products', JSON.stringify(menuProducts));
      
      window.dispatchEvent(new Event('products-updated'));
    } catch (error) {
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descriptionEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.ingredients?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.ingredientsEn?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    lowStock: products.filter(p => p.stock < 10).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    featuredProducts: products.filter(p => p.isFeatured).length,
    activeProducts: products.filter(p => p.isActive).length
  };

  const handleNewProduct = () => {
    setFormData({
      name: '',
      description: '',
      descriptionEn: '',
      price: '',
      category: 'salteñas',
      stock: '',
      image: '',
      ingredients: '',
      ingredientsEn: '',
      preparationTime: '',
      isFeatured: false,
      isActive: true
    });
    setImagePreview('');
    setErrors({});
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      descriptionEn: product.descriptionEn || '',
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image,
      ingredients: product.ingredients || '',
      ingredientsEn: product.ingredientsEn || '',
      preparationTime: product.preparationTime || '',
      isFeatured: product.isFeatured,
      isActive: product.isActive
    });
    setImagePreview(product.image);
    setErrors({});
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (name === 'image' && value) {
      setImagePreview(value);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = t('admin.products.error.name');
    if (!formData.description.trim()) newErrors.description = t('admin.products.error.description');
    if (!formData.price || formData.price <= 0) newErrors.price = t('admin.products.error.price');
    if (!formData.stock || formData.stock < 0) newErrors.stock = t('admin.products.error.stock');
    if (!formData.category) newErrors.category = t('admin.products.error.category');
    
    return newErrors;
  };

  const handleSaveProduct = () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setToastMessage(t('admin.products.error.form'));
      setToastType('error');
      setToastShow(true);
      return;
    }
    
    let updatedProducts;
    
    if (editingProduct) {
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
      syncProductsToMenu(updatedProducts);
      
      setToastMessage(t('admin.products.success.updated'));
      setToastType('success');
      setToastShow(true);
    } else {
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
      syncProductsToMenu(updatedProducts);
      
      setToastMessage(t('admin.products.success.created'));
      setToastType('success');
      setToastShow(true);
    }
    
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm(t('admin.products.confirm.delete'))) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
      syncProductsToMenu(updatedProducts);
      
      setToastMessage(t('admin.products.success.deleted'));
      setToastType('success');
      setToastShow(true);
    }
  };

  const toggleProductStatus = (id) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    syncProductsToMenu(updatedProducts);
    
    const msg = updatedProducts.find(p => p.id === id).isActive
      ? (language === 'es' ? 'Producto activado' : 'Product activated')
      : (language === 'es' ? 'Producto desactivado' : 'Product deactivated');
    setToastMessage(msg);
    setToastType('success');
    setToastShow(true);
  };

  const toggleFeatured = (id) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
    );
    
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    syncProductsToMenu(updatedProducts);
    
    const msg = updatedProducts.find(p => p.id === id).isFeatured
      ? (language === 'es' ? 'Producto destacado' : 'Product featured')
      : (language === 'es' ? 'Producto quitado de destacados' : 'Product unfeatured');
    setToastMessage(msg);
    setToastType('success');
    setToastShow(true);
  };

  const handleRestoreDefaults = () => {
    if (window.confirm(t('admin.products.confirm.restore'))) {
      localStorage.setItem('admin_products', JSON.stringify(initialProducts));
      setProducts(initialProducts);
      syncProductsToMenu(initialProducts);
      
      setToastMessage(t('admin.products.success.restored'));
      setToastType('success');
      setToastShow(true);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `productos-bolivianos-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleForceSync = () => {
    syncProductsToMenu(products);
    setToastMessage(t('admin.products.success.synced'));
    setToastType('success');
    setToastShow(true);
  };

  return (
    <div className="p-6">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {editingProduct ? t('admin.products.modal.edit') : t('admin.products.modal.new')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {editingProduct ? t('admin.products.modal.editDesc', { name: editingProduct.name }) : t('admin.products.modal.newDesc')}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                >
                  <FiX />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('admin.products.form.name')}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300 dark:border-[#475569]'
                        }`}
                        placeholder={t('admin.products.form.namePlaceholder')}
                      />
                      {errors.name && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('admin.products.form.description')}
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.description ? 'border-red-500' : 'border-gray-300 dark:border-[#475569]'
                        }`}
                        placeholder={t('admin.products.form.descPlaceholder')}
                      />
                      {errors.description && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.description}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descripción (Inglés)
                      </label>
                      <textarea
                        name="descriptionEn"
                        value={formData.descriptionEn}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-[#475569] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="English description..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('admin.products.form.price')}
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.price ? 'border-red-500' : 'border-gray-300 dark:border-[#475569]'
                          }`}
                          placeholder={t('admin.products.form.pricePlaceholder')}
                        />
                        {errors.price && (
                          <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.price}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('admin.products.form.stock')}
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          min="0"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.stock ? 'border-red-500' : 'border-gray-300 dark:border-[#475569]'
                          }`}
                          placeholder={t('admin.products.form.stockPlaceholder')}
                        />
                        {errors.stock && (
                          <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.stock}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('admin.products.form.category')}
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.category ? 'border-red-500' : 'border-gray-300 dark:border-[#475569]'
                          }`}
                        >
                          <option value="">{t('admin.products.form.selectCategory')}</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.category}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('admin.products.form.prepTime')}
                        </label>
                        <input
                          type="text"
                          name="preparationTime"
                          value={formData.preparationTime}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-[#475569] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={t('admin.products.form.prepPlaceholder')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('admin.products.form.ingredients')}
                      </label>
                      <textarea
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-[#475569] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('admin.products.form.ingredientsPlaceholder')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ingredientes (Inglés)
                      </label>
                      <textarea
                        name="ingredientsEn"
                        value={formData.ingredientsEn}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-[#475569] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="English ingredients..."
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('admin.products.form.image')}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-[#475569] rounded-lg p-4 text-center">
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
                          <FiUpload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                          <p className="text-gray-500 dark:text-gray-400 text-sm">{t('admin.products.form.dragImage')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('admin.products.form.imageUrl')}
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-[#475569] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('admin.products.form.imagePlaceholder')}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0f172a] rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{t('admin.products.form.featured')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.products.form.featuredHelp')}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={formData.isFeatured}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-[#334155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-[#475569] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0f172a] rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{t('admin.products.form.active')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.products.form.activeHelp')}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-[#334155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-[#475569] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-[#334155]">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-[#475569] text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-[#334155] font-medium"
                >
                  {t('admin.products.form.cancel')}
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg font-medium flex items-center gap-2"
                >
                  <FiSave />
                  {editingProduct ? t('admin.products.form.update') : t('admin.products.form.create')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('admin.products.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('admin.products.subtitle')}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            {t('admin.products.syncHint')}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleForceSync}
            className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2"
          >
            {t('admin.products.sync')}
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 dark:border-[#475569] text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-[#334155] flex items-center gap-2"
          >
            {t('admin.products.export')}
          </button>
          <button
            onClick={handleRestoreDefaults}
            className="px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 flex items-center gap-2"
          >
            {t('admin.products.restore')}
          </button>
          <button
            onClick={handleNewProduct}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg font-medium flex items-center gap-2"
          >
            <FiPlus /> {t('admin.products.new')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={t('admin.products.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-[#475569] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400 dark:text-gray-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-[#475569] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">{t('admin.products.allCategories')}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-[#1e293b] p-4 rounded-xl border border-blue-100">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.products.statTotal')}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalProducts}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-[#1e293b] p-4 rounded-xl border border-green-100">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.products.statTotalValue')}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Bs. {stats.totalValue.toFixed(0)}
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-[#1e293b] p-4 rounded-xl border border-yellow-100">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.products.statLowStock')}</p>
            <p className={`text-2xl font-bold ${stats.lowStock > 0 ? 'text-yellow-600' : 'text-gray-900 dark:text-gray-100'}`}>
              {stats.lowStock}
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-[#1e293b] p-4 rounded-xl border border-red-100">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.products.statOutStock')}</p>
            <p className={`text-2xl font-bold ${stats.outOfStock > 0 ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>
              {stats.outOfStock}
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-[#1e293b] p-4 rounded-xl border border-purple-100">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.products.statFeatured')}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.featuredProducts}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/20 dark:to-[#1e293b] p-4 rounded-xl border border-gray-100 dark:border-[#334155]">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.products.statActive')}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.activeProducts}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#1e293b] rounded-xl shadow-md overflow-hidden">
              <div className="animate-pulse bg-gray-200 dark:bg-[#334155] h-48 w-full" />
              <div className="p-4 space-y-3">
                <div className="animate-pulse bg-gray-200 dark:bg-[#334155] h-5 w-3/4 rounded" />
                <div className="animate-pulse bg-gray-200 dark:bg-[#334155] h-4 w-1/2 rounded" />
                <div className="flex gap-2">
                  <div className="animate-pulse bg-gray-200 dark:bg-[#334155] h-6 w-20 rounded-full" />
                  <div className="animate-pulse bg-gray-200 dark:bg-[#334155] h-6 w-16 rounded-full" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="animate-pulse bg-gray-200 dark:bg-[#334155] h-6 w-20 rounded" />
                  <div className="flex gap-2">
                    <div className="animate-pulse bg-gray-200 dark:bg-[#334155] h-8 w-8 rounded" />
                    <div className="animate-pulse bg-gray-200 dark:bg-[#334155] h-8 w-8 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-gray-100 dark:from-blue-900/20 dark:to-[#0f172a] rounded-2xl p-12 text-center border border-gray-200 dark:border-[#334155]">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t('admin.products.empty')}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || categoryFilter !== 'all' 
              ? `No hay productos que coincidan con "${searchTerm}"${categoryFilter !== 'all' ? ` en ${categoryFilter}` : ''}`
              : t('admin.products.emptyDesc')}
          </p>
          <button
            onClick={handleNewProduct}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg font-medium"
          >
            <FiPlus /> {t('admin.products.emptyBtn')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className={`group bg-white dark:bg-[#1e293b] rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 ${
              !product.isActive ? 'opacity-60 border-gray-200 dark:border-[#334155]' : 'border-gray-100 dark:border-[#334155]'
            }`}>
              <div className="relative">
                <div className={`relative overflow-hidden ${
                  product.image ? 'aspect-square' : 'aspect-square'
                }`}>
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <span className="text-5xl opacity-40">🍽️</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isFeatured && (
                      <span className="backdrop-blur-md bg-yellow-400/90 dark:bg-yellow-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <FiStar className="fill-white" size={12} /> {t('admin.products.featured')}
                      </span>
                    )}
                    <span className="backdrop-blur-md bg-white/80 dark:bg-[#1e293b]/80 text-gray-800 dark:text-gray-200 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {product.category}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => toggleFeatured(product.id)}
                    className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all duration-200 ${
                      product.isFeatured 
                        ? 'bg-yellow-400 text-white shadow-lg' 
                        : 'bg-white/80 dark:bg-[#1e293b]/80 text-gray-400 dark:text-gray-500 hover:text-yellow-500 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <FiStar size={12} className={product.isFeatured ? 'fill-white' : ''} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                    product.isActive
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-gray-100 dark:bg-[#334155] text-gray-500 dark:text-gray-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      product.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                    }`} />
                    {product.isActive ? t('admin.products.status.active') : t('admin.products.status.inactive')}
                  </span>
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    {t('admin.products.inStock', { stock: product.stock })}
                  </span>
                </div>

                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100 truncate pr-2">{product.name}</h3>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap tabular-nums">
                    Bs.{product.price.toFixed(2)}
                  </span>
                </div>
                
                {product.ingredients && (
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-3 line-clamp-1 leading-relaxed">
                    {language === 'es' || !product.ingredientsEn ? product.ingredients : product.ingredientsEn}
                  </p>
                )}
                
                <div className="mb-3 py-2 px-2.5 bg-gradient-to-r from-gray-50 to-gray-50/50 dark:from-[#0f172a] dark:to-[#0f172a]/50 rounded-lg border border-gray-100/50 dark:border-[#334155]/50">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 dark:text-gray-400">{t('admin.products.stockValue')}</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
                      Bs.{(product.price * product.stock).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 py-2.5 text-sm bg-blue-50 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    <FiEdit2 className="inline mr-1" size={13} /> {t('admin.products.editBtn')}
                  </button>
                  <button
                    onClick={() => toggleProductStatus(product.id)}
                    className={`px-4 py-2.5 text-sm rounded-xl font-medium transition-all duration-200 ${
                      product.isActive
                        ? 'bg-gray-100 dark:bg-[#334155] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#475569]'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    {product.isActive ? t('admin.products.toggleActive') : t('admin.products.toggleInactive')}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-4 py-2.5 text-sm bg-red-50 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>
          {t('admin.products.footer', { shown: filteredProducts.length, total: products.length })}
        </p>
      </div>
      <Toast message={toastMessage} type={toastType} show={toastShow} onClose={() => setToastShow(false)} />
    </div>
  );
};

export default AdminProducts;