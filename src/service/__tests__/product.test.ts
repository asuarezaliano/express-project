import { Request, Response, NextFunction } from 'express';
import prisma from '../../db';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../product.service';
import { Prisma } from '@prisma/client';

// Mock prisma
jest.mock('../../db', () => ({
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Product Service', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
      user: { id: 'user123', username: 'testuser' },
    };
    mockRes = {
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 100 },
        { id: '2', name: 'Product 2', price: 200 },
      ];
      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      await getProducts(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockProducts });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (prisma.product.findMany as jest.Mock).mockRejectedValue(error);

      await getProducts(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        error,
        defaultMessage: 'Error fetching users',
      });
    });
  });

  describe('getProduct', () => {
    it('should return a single product', async () => {
      const mockProduct = { id: '1', name: 'Product 1', price: 100 };
      mockReq.params = { id: '1' };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      await getProduct(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockProduct });
    });

    it('should handle not found product', async () => {
      mockReq.params = { id: 'nonexistent' };
      const prismaError = {
        code: 'P2025',
        clientVersion: '4.7.1',
        meta: { modelName: 'Product' },
      };

      (prisma.product.findUnique as jest.Mock).mockRejectedValue(prismaError);

      await getProduct(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        error: prismaError,
        defaultMessage: 'Error fetching product',
      });
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const mockProduct = {
        id: '1',
        name: 'New Product',
        price: 100,
        userId: 'user123',
      };
      mockReq.body = { name: 'New Product', price: 100 };
      (prisma.product.create as jest.Mock).mockResolvedValue(mockProduct);

      await createProduct(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockProduct });
    });
    it('should handle creation error', async () => {
      mockReq.body = { name: 'New Product', price: 100 };
      const error = new Error('Creation failed');
      (prisma.product.create as jest.Mock).mockRejectedValue(error);

      await createProduct(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        error,
        defaultMessage: 'Error creating product',
      });
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const mockProduct = {
        id: '1',
        createdAt: new Date(),
        name: 'Updated Product',
        price: 150,
        userId: 'user123',
      };
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Product', price: 150 };
      (prisma.product.update as jest.Mock).mockResolvedValue(mockProduct);

      await updateProduct(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockProduct });
    });

    it('should handle update error', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Product', price: 150 };
      const error = new Error('Update failed');
      (prisma.product.update as jest.Mock).mockRejectedValue(error);

      await updateProduct(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        error,
        defaultMessage: 'Error updating product',
      });
    });

    it('should handle prisma known request error', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Product', price: 150 };
      const error = new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '2.0.0',
      });
      (prisma.product.update as jest.Mock).mockRejectedValue(error);

      await updateProduct(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        error,
        defaultMessage: 'Error updating product',
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      mockReq.params = { id: '1' };
      (prisma.product.delete as jest.Mock).mockResolvedValue(undefined);

      await deleteProduct(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.product.delete).toHaveBeenCalled();
    });

    it('should handle delete error', async () => {
      mockReq.params = { id: '1' };
      const error = new Error('Delete failed');
      (prisma.product.delete as jest.Mock).mockRejectedValue(error);

      await deleteProduct(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        error,
        defaultMessage: 'Error deleting product',
      });
    });
  });
});
