// Utility functions can be added here
export const formatCurrency = (value) => {
  return '₹' + Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 });
}; 