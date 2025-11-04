import { Router } from 'express';
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
  getTags,
  createDocumentValidation,
  updateDocumentValidation,
} from '../controllers/documentController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../utils/multer.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getDocuments);
router.post('/', upload.single('file'), createDocumentValidation, createDocument);
router.put('/:id', updateDocumentValidation, updateDocument);
router.delete('/:id', deleteDocument);
router.get('/tags/list', getTags);
router.get('/:id/download', downloadDocument);

export default router;
