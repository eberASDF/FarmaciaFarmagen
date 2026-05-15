import { Link } from "react-router-dom";

export default function Breadcrumb({ sizeFilter, colorFilter }) {
  return (
    <div className="mb-6 bg-white/80 backdrop-blur-sm shadow-sm rounded-lg p-2">
      <ul className="flex items-center gap-2 text-lg text-[#2E4053]">
        <Link
          to="/"
          className={`px-3 py-2 rounded-md hover:bg-white transition-colors ${!sizeFilter && !colorFilter ? 'font-bold text-orange-900' : ''}`}
        >
          Adopt Page
        </Link>

        {sizeFilter && (
          <>
            <span className="text-gray-400">/</span>
            <li className="px-3 py-2 bg-orange-100 text-orange-900 rounded-md font-medium capitalize">
              Size: {sizeFilter}
            </li>
          </>
        )}

        {colorFilter && (
          <>
            <span className="text-gray-400">/</span>
            <li className="px-3 py-2 bg-orange-100 text-orange-900 rounded-md font-medium capitalize">
              Color: {colorFilter}
            </li>
          </>
        )}
      </ul>
    </div>
  );
}