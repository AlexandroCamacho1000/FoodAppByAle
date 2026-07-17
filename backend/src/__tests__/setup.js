import { vi } from 'vitest'

process.env.JWT_SECRET = 'test-jwt-secret-key-for-tests'
process.env.JWT_EXPIRE = '7d'
process.env.STRIPE_SECRET_KEY = 'sk_test_mocked_for_tests'
process.env.SUPERADMIN_EMAIL = 'superadmin@bolivianmarket.com'
process.env.SUPERADMIN_PASSWORD = 'superadmin123'
process.env.PORT = '5000'
process.env.NODE_ENV = 'test'
