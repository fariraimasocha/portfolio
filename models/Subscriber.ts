import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISubscriber extends Document {
  email: string
  subscribedAt: Date
  source: 'website' | 'manual' | 'import'
  isActive: boolean
  resendContactId?: string
  welcomeEmailSent: boolean
  unsubscribedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      enum: ['website', 'manual', 'import'],
      default: 'website',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resendContactId: {
      type: String,
      sparse: true,
    },
    welcomeEmailSent: {
      type: Boolean,
      default: false,
    },
    unsubscribedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

SubscriberSchema.index({ isActive: 1 })
SubscriberSchema.index({ subscribedAt: -1 })

const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>('Subscriber', SubscriberSchema)

export default Subscriber
