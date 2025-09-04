
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto p-4 flex items-center gap-6">
        <Link to="/" className="font-semibold">RFQ AI</Link>
        <nav className="flex gap-4 text-sm text-gray-600">
          <Link to="/">Buyer</Link>
          <Link to="/supplier">Supplier</Link>
        </nav>
      </div>
    </header>
  );
}
