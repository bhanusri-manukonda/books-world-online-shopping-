// One place that decides how money is shown, so every page matches.
export const rupees = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

// Works out the selling price if the API did not send finalPrice.
export const finalPriceOf = (book) => {
  if (book?.finalPrice !== undefined) return book.finalPrice;
  return Math.round((book.price * (100 - (book.discountPercent || 0))) / 100);
};

export const savingOf = (book) => book.price - finalPriceOf(book);
