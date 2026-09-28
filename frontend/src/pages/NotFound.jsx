import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page">
      <div className="panel">
        <h1>That page does not exist</h1>
        <p className="muted">The link may be old, or the book may have been removed.</p>
        <Link className="btn" to="/">Go to the book list</Link>
      </div>
    </div>
  );
}
