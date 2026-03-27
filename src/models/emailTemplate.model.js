import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const emailTemplateSchema = new Schema(
    {
        organization: {
            type: String,
            required: true,
            index: true,
        },
        templateName: {
            type: String,
            required: true,
            trim: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        body: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const EmailTemplate = model('EmailTemplate', emailTemplateSchema);
