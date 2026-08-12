import { test, expect } from '@playwright/test';

const products = [
  {
    id: 'p1',
    name: 'Salteña Paceña',
    description: 'Deliciosa salteña tradicional paceña.',
    descriptionEn: 'Traditional La Paz salteña.',
    price: 12.5,
    image: '/images/saltena.jpg',
    category: 'salteñas',
    stock: 50,
    featured: true,
    active: true
  },
  {
    id: 'p2',
    name: 'Pique Macho',
    description: 'Trozos de carne, salchicha y papas.',
    descriptionEn: 'Beef pieces, sausage and fries.',
    price: 45,
    image: '/images/pique-macho.jpg',
    category: 'platos_fuertes',
    stock: 20,
    featured: true,
    active: true
  },
  {
    id: 'p3',
    name: 'Api con Pastel',
    description: 'Bebida caliente de maíz morado.',
    descriptionEn: 'Hot purple corn drink.',
    price: 15,
    image: '/images/api-pastel.jpg',
    category: 'bebidas',
    stock: 40,
    featured: true,
    active: true
  },
  {
    id: 'p4',
    name: 'Humintas',
    description: 'Choclo rallado con queso y anís.',
    descriptionEn: 'Grated corn with cheese and anise.',
    price: 10,
    image: '/images/humintas.jpg',
    category: 'entradas',
    stock: 35,
    featured: false,
    active: true
  },
  {
    id: 'p5',
    name: 'Leche Asada',
    description: 'Postre boliviano horneado.',
    descriptionEn: 'Baked Bolivian dessert.',
    price: 15,
    image: '/images/leche-asada.jpg',
    category: 'postres',
    stock: 30,
    featured: false,
    active: true
  }
];

export const mockApi = async (page) => {
  await page.route('**/api/products', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, count: products.length, products })
    })
  );
  await page.route('**/api/products/*', (route) => {
    const id = route.request().url().split('/').pop();
    const product = products.find((p) => p.id === id);
    if (product) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, product })
      });
    } else {
      route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'not found' }) });
    }
  });
};

test('Home carga el hero y los productos destacados', async ({ page }) => {
  await mockApi(page);

  await page.goto('/');

  await expect(page.locator('text=Comida Tradicional Boliviana')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Destacados' })).toBeVisible();

  await expect(page.locator('text=Salteña Paceña')).toBeVisible();
  await expect(page.locator('text=Pique Macho')).toBeVisible();
  await expect(page.locator('text=Api con Pastel')).toBeVisible();
});

test('Menú filtra por categoría correctamente', async ({ page }) => {
  await mockApi(page);

  await page.goto('/menu');

  await expect(page.locator('text=Menú Completo')).toBeVisible();

  await page.getByRole('button', { name: /Salteñas/ }).click();

  await expect(page.locator('text=Salteña Paceña')).toBeVisible();
  await expect(page.locator('text=Pique Macho')).not.toBeVisible();
  await expect(page.locator('text=Api con Pastel')).not.toBeVisible();
});

test('Agregar producto al carrito actualiza el contador', async ({ page }) => {
  await mockApi(page);

  await page.goto('/menu');

  await page.getByRole('button', { name: /Agregar al carrito/ }).first().click();

  await expect(page.locator('.bg-red-500')).toHaveText('1');

  await page.goto('/cart');
  await expect(page.locator('text=Salteña Paceña').first()).toBeVisible();
});