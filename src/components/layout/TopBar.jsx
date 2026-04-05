import { Menu } from 'lucide-react';

export default function TopBar({ title, subtitle, onMenuClick }) {
  return (
    <header className="flex items-center justify-between mb-6 lg:mb-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
