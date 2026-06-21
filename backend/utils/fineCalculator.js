const FINE_PER_DAY = Number(process.env.FINE_PER_DAY) || 5;

const calculateFine = (dueDate, returnDate) => {
  const due = new Date(dueDate);
  const returned = new Date(returnDate || new Date());
  due.setHours(0, 0, 0, 0);
  returned.setHours(0, 0, 0, 0);
  const diffMs = returned - due;
  const overdueDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (overdueDays <= 0) return 0;
  return overdueDays * FINE_PER_DAY;
};

const getOverdueDays = (dueDate, returnDate) => {
  const due = new Date(dueDate);
  const returned = new Date(returnDate || new Date());
  due.setHours(0, 0, 0, 0);
  returned.setHours(0, 0, 0, 0);
  const diffMs = returned - due;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
};

const getDueDate = (issueDate, dueDays) => {
  const due = new Date(issueDate);
  due.setDate(due.getDate() + (dueDays || Number(process.env.DUE_DAYS) || 14));
  return due;
};

module.exports = { calculateFine, getOverdueDays, getDueDate };
