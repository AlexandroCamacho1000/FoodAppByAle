import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// ============================================
// 1. MOCK localStorage
// ============================================
// Los tests se ejecutan en Node, no tienen localStorage real.
// Creamos uno falso usando un objeto {} en memoria.
const store = {}
vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
  (key) => store[key] ?? null
)
vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
  (key, val) => { store[key] = String(val) }
)
vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(
  (key) => { delete store[key] }
)
vi.spyOn(Storage.prototype, 'clear').mockImplementation(
  () => { Object.keys(store).forEach(k => delete store[k]) }
)

// ============================================
// 2. MOCK matchMedia (usado por DarkModeContext)
// ============================================
// window.matchMedia no existe en Node. Lo simulamos.
// Por defecto decimos que NO está en modo dark.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// ============================================
// 3. MOCK navigator.language (usado por LanguageContext)
// ============================================
// El LanguageContext detecta el idioma del navegador.
// En tests, simulamos que el navegador está en español.
Object.defineProperty(navigator, 'language', {
  get: () => 'es-BO',
  configurable: true,
})

// ============================================
// 4. MOCK import.meta.env (variables de entorno de Vite)
// ============================================
// Vite expone variables como import.meta.env.VITE_*.
// En tests de Node no existen, las definimos manualmente.
process.env.VITE_API_URL = 'http://test:5000/api'
process.env.VITE_SUPERADMIN_EMAIL = 'superadmin@bolivianmarket.com'
process.env.VITE_SUPERADMIN_PASSWORD = 'superadmin123'
process.env.VITE_INVITE_CODE_EXPIRY_DAYS = '30'

// ============================================
// 5. MOCK Stripe (no queremos cargar Stripe real)
// ============================================
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(),
}))

vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => children,
  CardElement: () => null,
  useStripe: () => null,
  useElements: () => null,
}))

// ============================================
// 6. MOCK de axios para servicios
// ============================================
// Todos los servicios (cartService, productService) importan
// 'api' desde '../services/api'. Lo reemplazamos con una
// versión falsa donde get/post/put/delete son vi.fn()
// que podemos configurar en cada test.

// NOTA: El path './api' se resuelve relativo a services/
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))
