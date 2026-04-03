import express from 'express';
import * as recordController from '../controllers/recordController.js';
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validateRequest.js';
import { createRecord, getRecordsParams, updateRecord } from '../validations/record.validation.js';

const router = express.Router();

router.use(verifyToken);


// Only ADMIN and ANALYST can GET records.
router.get('/', requireRole(['ADMIN', 'ANALYST']), validate(getRecordsParams), recordController.getRecords);

// Only ADMIN can create/update/delete records
router.post('/', requireRole(['ADMIN']), validate(createRecord), recordController.createRecord);
router.put('/:id', requireRole(['ADMIN']), validate(updateRecord), recordController.updateRecord);
router.delete('/:id', requireRole(['ADMIN']), recordController.deleteRecord);

export default router;
