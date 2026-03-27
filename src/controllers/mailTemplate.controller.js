import { MailTemplate } from '../models/mailTemplate.model.js';
import { ApiResponse } from '../utils/apiResponse.util.js';
import fs from 'fs';
import path from 'path';

export const mailTemplateController = {
    /**
     * @route   GET /api/mail
     * @desc    Get all mail templates for an organization
     * @access  Private
     */
    getTemplates: async (req, res) => {
        try {
            const organization = req.query.organization;

            if (!organization) {
                return res.status(400).json(
                    ApiResponse.error('Organization is required', 400)
                );
            }

            const templates = await MailTemplate.find({ organization }).sort({ createdAt: -1 });

            return res.status(200).json(
                ApiResponse.success('Mail templates fetched successfully', templates)
            );
        } catch (error) {
            console.error('Error fetching mail templates:', error);
            return res.status(500).json(
                ApiResponse.error(error.message || 'Failed to fetch mail templates', 500)
            );
        }
    },

    /**
     * @route   POST /api/mail
     * @desc    Create a new mail template
     * @access  Private
     */
    createTemplate: async (req, res) => {
        try {
            const { organization, email, smtpCode, mailServer } = req.body;

            if (!organization || !email || !mailServer) {
                return res.status(400).json(
                    ApiResponse.error('organization, email, and mailServer are required', 400)
                );
            }

            const newTemplate = new MailTemplate({
                organization,
                email,
                smtpCode: smtpCode || '',
                mailServer,
            });

            const savedTemplate = await newTemplate.save();

            return res.status(201).json(
                ApiResponse.success('Mail template created successfully', savedTemplate)
            );
        } catch (error) {
            console.error('Error creating mail template:', error);
            return res.status(500).json(
                ApiResponse.error(error.message || 'Failed to create mail template', 500)
            );
        }
    },

    /**
     * @route   DELETE /api/mail/:id
     * @desc    Delete a mail template
     * @access  Private
     */
    deleteTemplate: async (req, res) => {
        try {
            const { id } = req.params;

            const template = await MailTemplate.findById(id);

            if (!template) {
                return res.status(404).json(
                    ApiResponse.error('Mail template not found', 404)
                );
            }

            // No images to delete anymore
            await MailTemplate.findByIdAndDelete(id);

            return res.status(200).json(
                ApiResponse.success('Mail template deleted successfully', null)
            );
        } catch (error) {
            console.error('Error deleting mail template:', error);
            return res.status(500).json(
                ApiResponse.error(error.message || 'Failed to delete mail template', 500)
            );
        }
    },

    updateTemplate: async (req, res) => {
        try {
            const { id } = req.params;
            const { organization, email, smtpCode, mailServer } = req.body;

            if (!organization || !email || !mailServer) {
                return res.status(400).json(
                    ApiResponse.error('organization, email, and mailServer are required', 400)
                );
            }

            const template = await MailTemplate.findById(id);
            if (!template) {
                return res.status(404).json(
                    ApiResponse.error('Mail template not found', 404)
                );
            }

            template.email = email;
            template.smtpCode = smtpCode || '';
            template.mailServer = mailServer;
            template.organization = organization;

            const updatedTemplate = await template.save();

            return res.status(200).json(
                ApiResponse.success('Mail template updated successfully', updatedTemplate)
            );
        } catch (error) {
            console.error('Error updating mail template:', error);
            return res.status(500).json(
                ApiResponse.error(error.message || 'Failed to update mail template', 500)
            );
        }
    },
};
