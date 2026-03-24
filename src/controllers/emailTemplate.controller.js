import { EmailTemplate } from '../models/emailTemplate.model.js';
import { ApiResponse } from '../utils/apiResponse.util.js';

export const emailTemplateController = {
    getTemplates: async (req, res) => {
        try {
            const organization = req.query.organization;

            if (!organization) {
                return res.status(400).json(
                    ApiResponse.error('Organization is required', 400)
                );
            }

            const templates = await EmailTemplate.find({ organization }).sort({ createdAt: -1 });

            return res.status(200).json(
                ApiResponse.success('Templates fetched successfully', templates)
            );
        } catch (error) {
            console.error('Error fetching email templates:', error);
            return res.status(500).json(
                ApiResponse.error(error.message || 'Failed to fetch templates', 500)
            );
        }
    },

    createTemplate: async (req, res) => {
        try {
            const { organization, templateName, subject, body } = req.body;

            if (!organization || !templateName || !subject || !body) {
                return res.status(400).json(
                    ApiResponse.error('Organization, template name, subject, and body are required', 400)
                );
            }

            const newTemplate = new EmailTemplate({
                organization,
                templateName,
                subject,
                body,
            });

            const savedTemplate = await newTemplate.save();

            return res.status(201).json(
                ApiResponse.success('Template created successfully', savedTemplate)
            );
        } catch (error) {
            console.error('Error creating email template:', error);
            return res.status(500).json(
                ApiResponse.error(error.message || 'Failed to create template', 500)
            );
        }
    },

    deleteTemplate: async (req, res) => {
        try {
            const { id } = req.params;

            const template = await EmailTemplate.findById(id);

            if (!template) {
                return res.status(404).json(
                    ApiResponse.error('Template not found', 404)
                );
            }

            await EmailTemplate.findByIdAndDelete(id);

            return res.status(200).json(
                ApiResponse.success('Template deleted successfully', null)
            );
        } catch (error) {
            console.error('Error deleting email template:', error);
            return res.status(500).json(
                ApiResponse.error(error.message || 'Failed to delete template', 500)
            );
        }
    },

    updateTemplate: async (req, res) => {
        try {
            const { id } = req.params;
            const { organization, templateName, subject, body } = req.body;

            if (!organization || !templateName || !subject || !body) {
                return res.status(400).json(
                    ApiResponse.error('Organization, template name, subject, and body are required', 400)
                );
            }

            const template = await EmailTemplate.findById(id);

            if (!template) {
                return res.status(404).json(
                    ApiResponse.error('Template not found', 404)
                );
            }

            template.organization = organization;
            template.templateName = templateName;
            template.subject = subject;
            template.body = body;

            const updatedTemplate = await template.save();

            return res.status(200).json(
                ApiResponse.success('Template updated successfully', updatedTemplate)
            );
        } catch (error) {
            console.error('Error updating email template:', error);
            return res.status(500).json(
                ApiResponse.error(error.message || 'Failed to update template', 500)
            );
        }
    },
};
