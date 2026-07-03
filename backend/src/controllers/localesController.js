const path = require('path');
const fs = require('fs');

const getLocale = (req, res) => {
  try {
    const { lang } = req.params;
    
    if (!['es', 'en'].includes(lang)) {
      return res.status(400).json({
        success: false,
        error: 'Idioma no soportado. Usa "es" o "en"'
      });
    }
    
    const filePath = path.join(__dirname, '../../locales', `${lang}.json`);
    const data = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(data);
    
    res.json(translations);
  } catch (error) {
    console.error('Error cargando locale:', error);
    res.status(500).json({
      success: false,
      error: 'Error al cargar traducciones'
    });
  }
};

module.exports = { getLocale };