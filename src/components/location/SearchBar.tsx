/**
 * SearchBar Component
 * Input pencarian lokasi dengan autocomplete
 */

'use client';

import { type FC, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Input, Spinner } from '@/components/ui';
import type { LocationSearchResult } from '@/types/location';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: FC<SearchBarProps> = ({
  className,
  placeholder = 'Cari lokasi...',
  autoFocus = false,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Debounce search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/locations/search?q=${encodeURIComponent(query)}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelect = (location: LocationSearchResult) => {
    setQuery('');
    setIsOpen(false);
    router.push(`/${location.code}`);
  };
  
  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          🔍
        </span>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="pl-10 pr-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner size="sm" />
          </div>
        )}
      </div>
      
      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-72 overflow-y-auto z-50">
          {results.map((location, index) => (
            <button
              key={location.code}
              onClick={() => handleSelect(location)}
              className={cn(
                'w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors',
                index !== results.length - 1 && 'border-b border-slate-100'
              )}
            >
              <div className="font-medium text-slate-900">
                {location.desa}
              </div>
              <div className="text-sm text-slate-500">
                {location.kecamatan}, {location.kabupaten}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* No results message */}
      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 p-4 text-center text-slate-500 z-50">
          Tidak ada lokasi yang ditemukan
        </div>
      )}
    </div>
  );
};
