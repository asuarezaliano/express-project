import { Request, Response, NextFunction } from 'express';
import prisma from '../../db';
import { createUpdate, update, deleteUpdate, getUpdates, getUpdate } from '../update.service';
import { CustomError } from '../../middleware/error/customError';
import { Prisma, Update } from '@prisma/client';

// Mock prisma
jest.mock('../../db', () => ({
  product: {
    findUnique: jest.fn(),
  },
  update: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe('Update Service', () => {
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

  describe('getUpdates', () => {
    it('should return all updates for a product', async () => {
      const mockUpdates = [
        {
          id: 'update1',
          title: 'Update 1',
          body: 'Update body 1',
          status: 'IN_PROGRESS',
          version: '1.0',
          asset: 'asset1.jpg',
          productId: 'product123',
        },
        {
          id: 'update2',
          title: 'Update 2',
          body: 'Update body 2',
          status: 'SHIPPED',
          version: '1.1',
          asset: 'asset2.jpg',
          productId: 'product123',
        },
      ];

      mockReq.user = { id: '1', username: 'testuser' };
      (prisma.update.findMany as jest.Mock).mockResolvedValue(mockUpdates);

      await getUpdates(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.update.findMany).toHaveBeenCalledWith({
        where: {
          product: {
            userId: mockReq.user.id,
          },
        },
      });

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockUpdates });
    });

    it('should handle prisma error', async () => {
      mockReq.user = { id: '1', username: 'testuser' };
      const prismaError = new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '4.7.1',
      });
      (prisma.update.findMany as jest.Mock).mockRejectedValue(prismaError);

      await getUpdates(mockReq as Request, mockRes as Response, mockNext);
      expect(prisma.update.findMany).toHaveBeenCalledWith({
        where: {
          product: {
            userId: mockReq.user.id,
          },
        },
      });

      expect(mockNext).toHaveBeenCalledWith({
        error: prismaError,
        defaultMessage: 'Error fetching updates',
      });
    });
    it('should handle generic database error', async () => {
      mockReq.user = { id: '1', username: 'testuser' };
      const error = new Error('Database error');
      (prisma.update.findMany as jest.Mock).mockRejectedValue(error);

      await getUpdates(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.update.findMany).toHaveBeenCalledWith({
        where: {
          product: {
            userId: mockReq.user.id,
          },
        },
      });

      expect(mockNext).toHaveBeenCalledWith({
        error,
        defaultMessage: 'Error fetching updates',
      });
    });
  });

  describe('getUpdate', () => {
    it('should return a single update', async () => {
      const mockUpdate = {
        id: 'update123',
        title: 'Update 1',
        body: 'Update body',
        status: 'IN_PROGRESS',
        version: '1.0',
        asset: 'asset.jpg',
        productId: 'product123',
        product: {
          userId: 'user123',
        },
      };

      mockReq.params = { id: 'update123' };
      mockReq.user = { id: 'user123', username: 'testuser' };
      (prisma.update.findUnique as jest.Mock).mockResolvedValue(mockUpdate);

      await getUpdate(mockReq as Request, mockRes as Response, mockNext);
      expect(prisma.update.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'update123',
        },
        include: {
          product: true,
        },
      });

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockUpdate });
    });

    it('should handle update not found', async () => {
      mockReq.params = { id: 'nonexistent' };
      mockReq.user = { id: 'user123', username: 'testuser' };
      (prisma.update.findUnique as jest.Mock).mockResolvedValue(null);

      await getUpdate(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.update.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'nonexistent',
        },
        include: {
          product: true,
        },
      });

      expect(mockNext).toHaveBeenCalledWith({
        error: expect.any(CustomError),
        defaultMessage: 'Error fetching update',
      });
    });

    it('should handle unauthorized access', async () => {
      const mockUpdate = {
        id: 'update123',
        title: 'Update 1',
        body: 'Update body',
        status: 'IN_PROGRESS',
        version: '1.0',
        asset: 'asset.jpg',
        productId: 'product123',
        product: {
          userId: 'differentUser',
        },
      };

      mockReq.params = { id: 'update123' };
      mockReq.user = { id: 'user123', username: 'testuser' };
      (prisma.update.findUnique as jest.Mock).mockResolvedValue(mockUpdate);

      await getUpdate(mockReq as Request, mockRes as Response, mockNext);
      expect(prisma.update.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockUpdate.id,
        },
        include: {
          product: true,
        },
      });

      expect(mockNext).toHaveBeenCalledWith({
        error: expect.any(CustomError),
        defaultMessage: 'Error fetching update',
      });
    });

    it('should handle database error', async () => {
      mockReq.params = { id: 'update123' };
      mockReq.user = { id: 'user123', username: 'testuser' };
      const error = new Error('Database error');
      (prisma.update.findUnique as jest.Mock).mockRejectedValue(error);

      await getUpdate(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.update.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'update123',
        },
        include: {
          product: true,
        },
      });

      expect(mockNext).toHaveBeenCalledWith({
        error,
        defaultMessage: 'Error fetching update',
      });
    });
  });

  describe('createUpdate', () => {
    it('should create a new update', async () => {
      const mockProduct = {
        id: 'product123',
        userId: 'user123',
      };
      const mockUpdate = {
        id: 'update123',
        title: 'New Update',
        body: 'Update body',
        status: 'IN_PROGRESS',
        version: '1.0',
        asset: 'asset.jpg',
        productId: 'product123',
      };

      mockReq.body = mockUpdate;
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (prisma.update.create as jest.Mock).mockResolvedValue(mockUpdate);

      await createUpdate(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockUpdate.productId,
        },
      });

      expect(prisma.update.create).toHaveBeenCalledWith({
        data: {
          title: mockUpdate.title,
          body: mockUpdate.body,
          status: mockUpdate.status,
          version: mockUpdate.version,
          asset: mockUpdate.asset,
          productId: mockUpdate.productId,
          updatedAt: expect.any(Date),
        },
      });

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockUpdate });
    });

    it('should handle product not found', async () => {
      mockReq.body = {
        productId: 'nonexistent',
      };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await createUpdate(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockReq.body.productId,
        },
      });

      expect(mockNext).toHaveBeenCalledWith({
        error: expect.any(CustomError),
        defaultMessage: 'Error creating update',
      });
    });

    it('should handle unauthorized update creation', async () => {
      const mockProduct = {
        id: 'product123',
        userId: 'differentUser',
      };
      mockReq.body = {
        productId: 'product123',
      };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      await createUpdate(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockReq.body.productId,
        },
      });

      expect(mockNext).toHaveBeenCalledWith({
        error: expect.any(CustomError),
        defaultMessage: 'Error creating update',
      });
    });

    it('should handle database error', async () => {
      mockReq.body = {
        productId: 'product123',
        title: 'Test Update',
        body: 'Test Body',
        status: 'IN_PROGRESS',
        version: '1.0',
        asset: 'test.jpg',
      };
      const mockProduct = {
        id: 'product123',
        userId: 'user123',
      };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (prisma.update.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      await createUpdate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        error: expect.any(Error),
        defaultMessage: 'Error creating update',
      });
    });
  });

  describe('update', () => {
    const mockProduct = {
      id: 'product123',
      userId: 'user123',
    };
    const mockUpdatedUpdate = {
      id: 'update123',
      title: 'Updated Title',
      body: 'Updated body',
      status: 'SHIPPED',
      version: '1.1',
      asset: 'new-asset.jpg',
      productId: 'product123',
    };
    it('should update an existing update', async () => {
      mockReq.params = { id: 'update123' };
      mockReq.body = mockUpdatedUpdate;
      mockReq.user = { id: 'user123', username: 'testuser' };
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (prisma.update.update as jest.Mock).mockResolvedValue(mockUpdatedUpdate);

      await update(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockReq.body.productId,
          userId: mockReq.user.id,
        },
      });

      expect(prisma.update.update).toHaveBeenCalledWith({
        where: {
          id: mockReq.params.id,
        },
        data: {
          title: mockUpdatedUpdate.title,
          body: mockUpdatedUpdate.body,
          status: mockUpdatedUpdate.status,
          version: mockUpdatedUpdate.version,
          asset: mockUpdatedUpdate.asset,
          updatedAt: expect.any(Date),
        },
      });

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockUpdatedUpdate });
    });

    it('should handle product not found', async () => {
      mockReq.params = { id: 'update123' };
      mockReq.body = { productId: 'nonexistent' };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await update(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockReq.body.productId,
          userId: mockReq.user.id,
        },
      });

      expect(mockNext).toHaveBeenCalledWith({
        error: expect.any(CustomError),
        defaultMessage: 'Error updating record',
      });
    });

    it('should handle update not found error', async () => {
      mockReq.params = { id: 'update123' };
      mockReq.body = mockUpdatedUpdate;
      mockReq.user = { id: 'user123', username: 'testuser' };
      const error = new Error('Delete failed');

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (prisma.update.update as jest.Mock).mockRejectedValue(error);

      await update(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockReq.body.productId,
          userId: mockReq.user.id,
        },
      });

      expect(mockNext).toHaveBeenCalledWith({
        error: expect.any(Error),
        defaultMessage: 'Error updating record',
      });
    });

    it('should handle generic database error', async () => {
      mockReq.params = { id: 'update123' };
      mockReq.body = mockUpdatedUpdate;
      mockReq.user = { id: 'user123', username: 'testuser' };
      const error = new Error('Database error');
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (prisma.update.update as jest.Mock).mockRejectedValue(error);

      await update(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        error: expect.any(Error),
        defaultMessage: 'Error updating record',
      });
    });
  });

  describe('deleteUpdate', () => {
    it('should delete an update', async () => {
      const mockUpdate = {
        id: 'update123',
        product: {
          userId: 'user123',
        },
      };

      mockReq.params = { id: 'update123' };
      mockReq.user = { id: 'user123', username: 'testuser' };
      (prisma.update.findUnique as jest.Mock).mockResolvedValue(mockUpdate);
      (prisma.update.delete as jest.Mock).mockResolvedValue(mockUpdate);

      await deleteUpdate(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.update.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockReq.params.id,
        },
        include: {
          product: true,
        },
      });

      expect(prisma.update.delete).toHaveBeenCalledWith({
        where: { id: 'update123' },
      });
    });

    it('should handle update not found', async () => {
      mockReq.params = { id: 'nonexistent' };
      mockReq.user = { id: 'user123', username: 'testuser' };
      (prisma.update.findUnique as jest.Mock).mockResolvedValue(null);

      await deleteUpdate(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.update.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockReq.params.id,
        },
        include: {
          product: true,
        },
      });

      expect(mockNext).toHaveBeenCalledWith({
        error: expect.any(CustomError),
        defaultMessage: 'Error deleting update',
      });
    });

    it('should handle unauthorized deletion', async () => {
      const mockUpdate = {
        id: 'update123',
        product: {
          userId: 'differentUser',
        },
      };

      mockReq.params = { id: 'update123' };
      mockReq.user = { id: 'user123', username: 'testuser' };
      (prisma.update.findUnique as jest.Mock).mockResolvedValue(mockUpdate);

      await deleteUpdate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        error: expect.any(CustomError),
        defaultMessage: 'Error deleting update',
      });
    });
  });

  it('should handle generic database error', async () => {
    mockReq.params = { id: 'update123' };
    mockReq.user = { id: 'user123', username: 'testuser' };
    const error = new Error('Database error');
    (prisma.update.findUnique as jest.Mock).mockResolvedValue({
      id: 'update123',
      product: {
        userId: 'user123',
      },
    });
    (prisma.update.delete as jest.Mock).mockRejectedValue(error);

    await deleteUpdate(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      error,
      defaultMessage: 'Error deleting update',
    });
  });
});
