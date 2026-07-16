// components/Toast.js
import { useEffect } from 'react';

export default function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [message]);

  return <div className="toast show">{message}</div>;
}
