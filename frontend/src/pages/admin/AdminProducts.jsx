// frontend/src/pages/admin/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { FiPackage, FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiSave, FiX, FiUpload, FiAlertCircle, FiCheckCircle, FiStar } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const AdminProducts = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'salteñas',
    stock: '',
    image: '',
    ingredients: '',
    preparationTime: '',
    isFeatured: false,
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  
  const categories = [
    'salteñas',
    'platos_fuertes',
    'bebidas',
    'postres',
    'especiales'
  ];
  
  const initialProducts = [
    { 
      id: generateId(),
      name: 'Salteña Paceña', 
      description: 'Deliciosa salteña tradicional rellena de carne jugosa, papa y arvejas, con un toque de ají colorado.',
      price: 15.50, 
      category: 'salteñas',
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
      category: 'platos_fuertes',
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
      category: 'platos_fuertes',
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
      category: 'platos_fuertes',
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
      category: 'platos_fuertes',
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
      category: 'postres', 
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

  function generateId() {
    return `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    console.log('📦 Cargando productos desde localStorage...');
    
    try {
      const savedProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
      
      if (savedProducts.length === 0) {
        localStorage.setItem('admin_products', JSON.stringify(initialProducts));
        setProducts(initialProducts);
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

  const saveProducts = (productsToSave) => {
    try {
      localStorage.setItem('admin_products', JSON.stringify(productsToSave));
      console.log('💾 Productos guardados en localStorage');
    } catch (error) {
      console.error('❌ Error al guardar productos:', error);
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
          price: product.price,
          category: product.category,
          image: product.image,
          isFeatured: product.isFeatured,
          ingredients: product.ingredients || '',
          preparationTime: product.preparationTime || '',
          stock: product.stock
        }));
      
      localStorage.setItem('menu_products', JSON.stringify(menuProducts));
      localStorage.setItem('products', JSON.stringify(menuProducts));
      
      console.log(`🔄 ${menuProducts.length} productos sincronizados con Menu.jsx`);
      window.dispatchEvent(new Event('products-updated'));
    } catch (error) {
      console.error('❌ Error al sincronizar productos:', error);
    }
  };

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
      price: '',
      category: 'salteñas',
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
      alert(t('admin.products.error.form'));
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
      
      alert(t('admin.products.success.updated'));
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
      
      alert(t('admin.products.success.created'));
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
      
      alert(t('admin.products.success.deleted'));
    }
  };

  const toggleProductStatus = (id) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    syncProductsToMenu(updatedProducts);
    
    alert(`🔄 Producto ${updatedProducts.find(p => p.id === id).isActive ? 'activado' : 'desactivado'}`);
  };

  const toggleFeatured = (id) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
    );
    
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    syncProductsToMenu(updatedProducts);
    
    alert(`⭐ Producto ${updatedProducts.find(p => p.id === id).isFeatured ? 'destacado' : 'quitado de destacados'}`);
  };

  const handleRestoreDefaults = () => {
    if (window.confirm(t('admin.products.confirm.restore'))) {
      localStorage.setItem('admin_products', JSON.stringify(initialProducts));
      setProducts(initialProducts);
      syncProductsToMenu(initialProducts);
      
      alert(t('admin.products.success.restored'));
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
    alert(t('admin.products.success.synced'));
  };

  return (
    <div className="p-6">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProduct ? t('admin.products.modal.edit') : t('admin.products.modal.new')}
                  </h2>
                  <p className="text-gray-600">
                    {editingProduct ? t('admin.products.modal.editDesc', { name: editingProduct.name }) : t('admin.products.modal.newDesc')}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <FiX />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.name')}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t('admin.products.form.namePlaceholder')}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.description')}
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t('admin.products.form.descPlaceholder')}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            errors.price ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={t('admin.products.form.pricePlaceholder')}
                        />
                        {errors.price && (
                          <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('admin.products.form.stock')}
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
                          placeholder={t('admin.products.form.stockPlaceholder')}
                        />
                        {errors.stock && (
                          <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('admin.products.form.category')}
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.category ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">{t('admin.products.form.selectCategory')}</option>
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
                          {t('admin.products.form.prepTime')}
                        </label>
                        <input
                          type="text"
                          name="preparationTime"
                          value={formData.preparationTime}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={t('admin.products.form.prepPlaceholder')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.ingredients')}
                      </label>
                      <textarea
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('admin.products.form.ingredientsPlaceholder')}
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.products.form.image')}
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
                          <p className="text-gray-500 text-sm">{t('admin.products.form.dragImage')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.products.form.imageUrl')}
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('admin.products.form.imagePlaceholder')}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{t('admin.products.form.featured')}</p>
                        <p className="text-sm text-gray-600">{t('admin.products.form.featuredHelp')}</p>
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
                        <p className="font-medium text-gray-900">{t('admin.products.form.active')}</p>
                        <p className="text-sm text-gray-600">{t('admin.products.form.activeHelp')}</p>
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

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
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
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.products.title')}</h1>
          <p className="text-gray-600">{t('admin.products.subtitle')}</p>
          <p className="text-sm text-blue-600 mt-1">
            {t('admin.products.syncHint')}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleForceSync}
            className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 flex items-center gap-2"
          >
            {t('admin.products.sync')}
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            {t('admin.products.export')}
          </button>
          <button
            onClick={handleRestoreDefaults}
            className="px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 flex items-center gap-2"
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
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('admin.products.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">{t('admin.products.statTotal')}</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl border border-green-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">{t('admin.products.statTotalValue')}</p>
            <p className="text-2xl font-bold text-gray-900">
              Bs. {stats.totalValue.toFixed(0)}
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-white p-4 rounded-xl border border-yellow-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">{t('admin.products.statLowStock')}</p>
            <p className={`text-2xl font-bold ${stats.lowStock > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
              {stats.lowStock}
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl border border-red-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">{t('admin.products.statOutStock')}</p>
            <p className={`text-2xl font-bold ${stats.outOfStock > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {stats.outOfStock}
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">{t('admin.products.statFeatured')}</p>
            <p className="text-2xl font-bold text-gray-900">{stats.featuredProducts}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">{t('admin.products.statActive')}</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
          </div>
        </div>
      </div>

           {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="animate-pulse bg-gray-200 h-48 w-full" />
              <div className="p-4 space-y-3">
                <div className="animate-pulse bg-gray-200 h-5 w-3/4 rounded" />
                <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded" />
                <div className="flex gap-2">
                  <div className="animate-pulse bg-gray-200 h-6 w-20 rounded-full" />
                  <div className="animate-pulse bg-gray-200 h-6 w-16 rounded-full" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="animate-pulse bg-gray-200 h-6 w-20 rounded" />
                  <div className="flex gap-2">
                    <div className="animate-pulse bg-gray-200 h-8 w-8 rounded" />
                    <div className="animate-pulse bg-gray-200 h-8 w-8 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-gray-100 rounded-2xl p-12 text-center border border-gray-200">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('admin.products.empty')}</h3>
          <p className="text-gray-600 mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${
              !product.isActive ? 'opacity-70 border-gray-300' : 'border-gray-200'
            }`}>
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    product.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}></span>
                  <span className="text-sm font-medium text-gray-700">
                    {product.isActive ? t('admin.products.status.active') : t('admin.products.status.inactive')}
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
                
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isFeatured && (
                    <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {t('admin.products.featured')}
                    </span>
                  )}
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    product.stock > 20 ? 'bg-green-100 text-green-800' :
                    product.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                    product.stock === 0 ? 'bg-red-100 text-red-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {t('admin.products.inStock', { stock: product.stock })}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-900 truncate">{product.name}</h3>
                  <span className="text-2xl font-bold text-blue-600 whitespace-nowrap">
                    Bs. {product.price.toFixed(2)}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <div className="space-y-2 mb-5">
                  {product.ingredients && (
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">{t('admin.products.ingredients')}</span> {product.ingredients}
                    </p>
                  )}
                  {product.preparationTime && (
                    <p className="text-xs text-gray-500">
                      {t('admin.products.prepTime', { time: product.preparationTime })}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {t('admin.products.sku', { sku: product.sku || 'N/A' })}
                  </p>
                </div>
                
                <div className="mb-5 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('admin.products.stockValue')}</span>
                    <span className="font-bold text-gray-900">
                      Bs. {(product.price * product.stock).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2 font-medium"
                  >
                    <FiEdit2 /> {t('admin.products.editBtn')}
                  </button>
                  <button
                    onClick={() => toggleProductStatus(product.id)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      product.isActive
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {product.isActive ? t('admin.products.toggleActive') : t('admin.products.toggleInactive')}
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

      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>
          {t('admin.products.footer', { shown: filteredProducts.length, total: products.length })}
        </p>
      </div>
    </div>
  );
};

export default AdminProducts;