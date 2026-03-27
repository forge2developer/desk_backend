import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const mailTemplateSchema = new Schema(
    {
        organization: {
            type: String,
            required: true,
            index: true,
        },
        mailServer: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        smtpCode: {
            type: String,
            trim: true,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

export const MailTemplate = model('MailTemplate', mailTemplateSchema);
