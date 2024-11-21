import request from 'supertest';
import { app } from '../../index';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../../service/product.service';
import { CustomError } from '../../middleware/error/customError';

// import { protect } from '../../models/auth';
// import { productValidateTypes } from '../../middleware/validators/productValidate';

jest.mock('../../service/product.service', () => ({
  getProducts: jest.fn(),
  getProduct: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

// jest.mock('../../models/auth', () => ({
//   protect: (_, __, next) => next(),
// }));
// jest.mock('../../middleware/validators/productValidate', () => ({
//   productValidateTypes: {
//     validateProduct: jest.fn((req, res, next) => next()),
//   },
// }));

const mockProductPost = {
  name: 'Test Product',
  price: 100,
};

const mockProductResponse = {
  ...mockProductPost,
  id: 'product123',
  createdAt: new Date(),
  userId: 'user123',
};

describe('Product Controller', () => {
  let mockUser;
  beforeEach(() => jest.clearAllMocks());

  beforeEach(() => {
    mockUser = {
      id: 'user123',
      username: 'testuser',
      token: 'mock-jwt-token',
    };
    jest.clearAllMocks();
  });

  const mockProduct = {
    id: 'product123',
    name: 'Test Product',
    price: 100,
    createdAt: new Date().toISOString(),
    userId: 'user123',
  };

  describe('GET /api/product', () => {
    it('should get all products', async () => {
      const mockProducts = [
        {
          id: 'product123',
          name: 'Test Product 1',
          price: 100,
          createdAt: new Date().toISOString(),
          userId: 'user123',
        },
        {
          id: 'product456',
          name: 'Test Product 2',
          price: 200,
          createdAt: new Date().toISOString(),
          userId: 'user123',
        },
      ];

      (getProducts as jest.Mock).mockImplementation((req, res) => {
        return res.status(200).json({
          data: mockProducts,
        });
      });

      await request(app)
        .get('/api/product')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(res => {
          expect(res.body).toEqual({ data: mockProducts });
        });
    });

    it('should handle database errors', async () => {
      (getProducts as jest.Mock).mockImplementation((req, res, next) => {
        next(new Error('Database error'));
      });

      await request(app).get('/api/product').set('Accept', 'application/json').expect(500);
    });
  });

  describe('GET /api/product/:id', () => {
    it('should get a single product', async () => {
      (getProduct as jest.Mock).mockImplementation((req, res) => {
        return res.status(200).json({
          data: mockProduct,
        });
      });

      await request(app)
        .get('/api/product/product123')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(res => {
          expect(res.body).toEqual({ data: mockProduct });
        });
    });

    it('should handle product not found', async () => {
      (getProduct as jest.Mock).mockImplementation((req, res, next) => {
        next(new Error('Product not found'));
      });

      await request(app)
        .get('/api/product/nonexistent')
        .set('Accept', 'application/json')
        .expect(500);
    });
  });

  describe('POST /api/product', () => {
    (createProduct as jest.Mock).mockImplementation((req, res) => {
      return res.status(200).json({
        data: mockProductResponse,
      });
    });

    it('should create a new product', async () => {
      const mockProduct = {
        name: 'Test Product',
        price: 100,
      };
      const mockProductResponse = {
        ...mockProduct,
        id: 'product123',
        createdAt: expect.any(String),
        userId: 'user123',
      };

      await request(app)
        .post('/api/product')
        .send(mockProduct)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toEqual({ data: mockProductResponse });
        });
    });

    it('should handle empty product submission', async () => {
      const emptyProduct = {};

      await request(app)
        .post('/api/product')
        .send(emptyProduct)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .expect(400);
    });

    it('should handle product submission without price', async () => {
      const productWithoutPrice = {
        name: 'Test Product',
      };

      await request(app)
        .post('/api/product')
        .send(productWithoutPrice)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .expect(400);
    });
    it('should handle product submission without name', async () => {
      const productWithoutName = {
        price: 100,
      };

      await request(app)
        .post('/api/product')
        .send(productWithoutName)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .expect(400);
    });

    it('should return 401 when Authorization header is missing', async () => {
      const mockProduct = {
        name: 'Test Product',
        price: 100,
      };

      await request(app)
        .post('/api/product')
        .send(mockProduct)
        .set('Accept', 'application/json')
        .expect(401);
    });
  });

  describe('PUT /api/product/:id', () => {
    it('should update an existing product', async () => {
      const updatedProduct = {
        name: 'Updated Product',
        price: 200,
      };
      const mockUpdatedResponse = {
        ...updatedProduct,
        id: 'product123',
        createdAt: new Date().toISOString(),
        userId: 'user123',
      };

      (updateProduct as jest.Mock).mockImplementation((req, res) => {
        return res.status(200).json({
          data: mockUpdatedResponse,
        });
      });

      await request(app)
        .put('/api/product/product123')
        .send(updatedProduct)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toEqual({ data: mockUpdatedResponse });
        });
    });

    it('should return 404 when product id is not found', async () => {
      (updateProduct as jest.Mock).mockImplementation((req, res, next) => {
        const error = new CustomError(404, 'Product not found');
        return res.status(404).json({ message: error.message });
      });

      const updatedProduct = {
        name: 'Updated Product',
        price: 200,
      };

      await request(app)
        .put('/api/product/nonexistentid')
        .send(updatedProduct)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .expect(404);
    });

    it('should handle empty product update submission', async () => {
      const emptyProduct = {};

      await request(app)
        .put('/api/product/product123')
        .send(emptyProduct)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .expect(400);
    });

    it('should handle product update without price', async () => {
      const productWithoutPrice = {
        name: 'Updated Product',
      };

      await request(app)
        .put('/api/product/product123')
        .send(productWithoutPrice)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .expect(400);
    });

    it('should handle product update without name', async () => {
      const productWithoutName = {
        price: 200,
      };

      await request(app)
        .put('/api/product/product123')
        .send(productWithoutName)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .expect(400);
    });

    it('should return 401 when Authorization header is missing', async () => {
      const updatedProduct = {
        name: 'Updated Product',
        price: 200,
      };

      await request(app)
        .put('/api/product/product123')
        .send(updatedProduct)
        .set('Accept', 'application/json')
        .expect(401);
    });
  });

  describe('DELETE /api/product/:id', () => {
    it('should delete a product successfully', async () => {
      (deleteProduct as jest.Mock).mockImplementation((req, res) => {
        return res.status(200).json({
          data: mockProduct,
        });
      });

      await request(app)
        .delete('/api/product/product123')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toEqual({ data: mockProduct });
        });
    });

    it('should return 404 when product id is not found', async () => {
      (deleteProduct as jest.Mock).mockImplementation((req, res, next) => {
        const error = new CustomError(404, 'Product not found');
        return res.status(404).json({ message: error.message });
      });

      await request(app)
        .delete('/api/product/nonexistentId')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .expect(404);
    });

    it('should handle database errors', async () => {
      (deleteProduct as jest.Mock).mockImplementation((req, res, next) => {
        next(new Error('Database error'));
      });

      await request(app)
        .delete('/api/product/product123')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .expect(500);
    });

    it('should return 401 when Authorization header is missing', async () => {
      await request(app)
        .delete('/api/product/product123')
        .set('Accept', 'application/json')
        .expect(401);
    });
  });
});
