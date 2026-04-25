import React from 'react';
import { Hammer } from 'lucide-react';

export default function DummyWebsitePlaceholder({ title }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border shadow-sm text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-gold rounded-full flex items-center justify-center mx-auto mb-6">
          <Hammer className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-8">This feature is currently under active development. Check back soon for exciting updates!</p>
      </div>
    </div>
  );
}
