// variant: 'error' | 'success' | 'info'
export default function Message({ variant = 'info', children }) {
  if (!children) return null;
  return <div className={`alert alert-${variant}`}>{children}</div>;
}
