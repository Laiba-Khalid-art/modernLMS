const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: Number,
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    contactNumber: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
);

studentSchema.pre('save', async function () {
  if (!this.studentId) {
    const last = await this.constructor.findOne({}, {}, { sort: { studentId: -1 } });
    this.studentId = last ? last.studentId + 1 : 1001;
  }
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
