export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        Books World — an online bookstore built with MongoDB, Express, React and Node.
        {' '}{new Date().getFullYear()}
      </div>
    </footer>
  );
}
