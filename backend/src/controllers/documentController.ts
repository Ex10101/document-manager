import express from 'express';
import { body, validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import prisma from '../utils/prisma.js';
import type { AuthRequest, DocumentCreateRequest, DocumentUpdateRequest } from '../types/index.js';

export const createDocumentValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('tag')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Tag must be max 100 characters'),
];

export const updateDocumentValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('tag')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Tag must be max 100 characters'),
];

export const getDocuments = async (
  req: AuthRequest,
  res: express.Response
): Promise<void> => {
  try {
    const { page = '1', limit = '10', tag } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId: req.userId };
    if (tag && tag !== '') {
      where.tag = tag;
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          originalFilename: true,
          tag: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.document.count({ where }),
    ]);

    res.json({
      documents,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createDocument = async (
  req: AuthRequest,
  res: express.Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'File is required' });
      return;
    }

    const { title, tag } = req.body as DocumentCreateRequest;

    const document = await prisma.document.create({
      data: {
        userId: req.userId!,
        title,
        filename: req.file.filename,
        originalFilename: req.file.originalname,
        filePath: req.file.path,
        tag: tag || null,
      },
    });

    res.status(201).json({
      message: 'Document created successfully',
      document: {
        id: document.id,
        title: document.title,
        originalFilename: document.originalFilename,
        tag: document.tag,
        createdAt: document.createdAt,
      },
    });
  } catch (error) {
    console.error('Create document error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateDocument = async (
  req: AuthRequest,
  res: express.Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { title, tag } = req.body as DocumentUpdateRequest;

    const document = await prisma.document.findFirst({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
    });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    const updatedDocument = await prisma.document.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(tag !== undefined && { tag: tag || null }),
      },
    });

    res.json({
      message: 'Document updated successfully',
      document: {
        id: updatedDocument.id,
        title: updatedDocument.title,
        tag: updatedDocument.tag,
        updatedAt: updatedDocument.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteDocument = async (
  req: AuthRequest,
  res: express.Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
    });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await prisma.document.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const downloadDocument = async (
  req: AuthRequest,
  res: express.Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
    });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    if (!fs.existsSync(document.filePath)) {
      res.status(404).json({ error: 'File not found on server' });
      return;
    }

    res.download(document.filePath, document.originalFilename);
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTags = async (
  req: AuthRequest,
  res: express.Response
): Promise<void> => {
  try {
    const tags = await prisma.document.findMany({
      where: {
        userId: req.userId,
        tag: { not: null },
      },
      select: {
        tag: true,
      },
      distinct: ['tag'],
    });

    const uniqueTags = tags.map((t) => t.tag).filter(Boolean);

    res.json({ tags: uniqueTags });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
