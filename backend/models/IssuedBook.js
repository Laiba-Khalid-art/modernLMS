const mongoose = require('mongoose');

const issuedBookSchema = new mongoose.Schema(
  {
    issueId: {
      type: Number,
      unique: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required']
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book reference is required']
    },
    issueDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    returnDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['Issued', 'Returned'],
      default: 'Issued'
    },
    fineAmount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

issuedBookSchema.pre('save', async function () {
  if (!this.issueId) {
    const last = await this.constructor.findOne({}, {}, { sort: { issueId: -1 } });
    this.issueId = last ? last.issueId + 1 : 1;
  }
});

issuedBookSchema.virtual('isOverdue').get(function () {
  if (this.status === 'Returned') return false;
  return new Date() > this.dueDate;
});

const IssuedBook = mongoose.model('IssuedBook', issuedBookSchema);
module.exports = IssuedBook;
