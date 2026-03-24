import { Router } from 'express';
import multer from 'multer';
import { mailController } from '../controllers/mail.controller.js';
import { mailTemplateController } from '../controllers/mailTemplate.controller.js';
import { emailTemplateController } from '../controllers/emailTemplate.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Use memory storage — files are passed directly as Buffer to nodemailer
const memoryUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB per file
        files: 10,
    },
});



/**
 * @swagger
 * /api/mail/send:
 *   post:
 *     summary: Send an email to a lead
 *     tags: [Mail]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [to, subject, html]
 *             properties:
 *               to:
 *                 type: string
 *               subject:
 *                 type: string
 *               html:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Mail sending failed
 */
router.post('/send', memoryUpload.array('attachments', 10), mailController.sendLeadMail);

// Mail Server routes
router.get('/', protect, mailTemplateController.getTemplates);
router.post('/', protect, mailTemplateController.createTemplate);
router.put('/:id', protect, mailTemplateController.updateTemplate);
router.delete('/:id', protect, mailTemplateController.deleteTemplate);

// Email Template routes
router.get('/templates', protect, emailTemplateController.getTemplates);
router.post('/templates', protect, emailTemplateController.createTemplate);
router.put('/templates/:id', protect, emailTemplateController.updateTemplate);
router.delete('/templates/:id', protect, emailTemplateController.deleteTemplate);

export default router;
