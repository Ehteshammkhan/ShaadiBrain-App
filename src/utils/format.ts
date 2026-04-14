export const formatCurrency = (amount: number) => {
  return `₹ ${amount.toLocaleString()}`;
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};