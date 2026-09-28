// Cover images come from Open Library. If one ever fails to load (removed file,
// no internet), swap in a generated cover so the layout never breaks.
export const generatedCover = (title) =>
  `https://placehold.co/300x420/0e3b34/fffdf8?text=${encodeURIComponent(title || 'Book')}`;

export const handleCoverError = (event, title) => {
  event.target.onerror = null; // stop an endless retry loop
  event.target.src = generatedCover(title);
};
