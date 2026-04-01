'use client'

/**
 * AddressAutocomplete
 *
 * Free address search using Nominatim (OpenStreetMap).
 * No API key. No credit card. Fully open-source.
 */

import { useState, useRef, useEffect, useId } from 'react'
import { useDebounce } from 'use-debounce'
import { MapPin, Loader2, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NominatimPlace {
  placeId: number
  displayName: string
  shortName: string
  lat: number
  lng: number
  type: string
  boundingBox: [number, number, number, number]
}

export interface AddressAutocompleteProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSelect: (place: NominatimPlace) => void
  error?: string
  helperText?: string
  disabled?: boolean
  /** ISO 3166-1 alpha-2 country code to bias results. Default: 'in' (India) */
  countryCode?: string
  className?: string
}

// ─── Nominatim API ────────────────────────────────────────────────────────────

async function searchNominatim(
  query: string,
  countryCode: string,
  signal: AbortSignal
): Promise<NominatimPlace[]> {
  if (!query || query.trim().length < 3) return []

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '6',
    countrycodes: countryCode,
    'accept-language': 'en',
  })

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    {
      signal,
      headers: {
        'User-Agent': 'HomeServ/1.0 (contact@homeserv.in)',
      },
    }
  )

  if (!res.ok) throw new Error('Nominatim request failed')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = await res.json()

  return data.map((item) => ({
    placeId: item.place_id,
    displayName: item.display_name,
    shortName: buildShortName(item),
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    type: item.type,
    boundingBox: item.boundingbox.map(Number) as [number, number, number, number],
  }))
}

function buildShortName(item: Record<string, unknown>): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addr = item.address as any
  if (!addr) return String(item.display_name).split(',').slice(0, 2).join(',')
  const parts = [
    addr.house_number,
    addr.road || addr.pedestrian || addr.footway,
    addr.suburb || addr.neighbourhood,
    addr.city || addr.town || addr.village || addr.county,
  ].filter(Boolean)
  return parts.slice(0, 3).join(', ')
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddressAutocomplete({
  label,
  placeholder = 'Search address…',
  value,
  onChange,
  onSelect,
  error,
  helperText,
  disabled = false,
  countryCode = 'in',
  className,
}: AddressAutocompleteProps) {
  const inputId = useId()
  const listboxId = useId()

  const [query, setQuery] = useState(value)
  const [debouncedQuery] = useDebounce(query, 420)

  const [suggestions, setSuggestions] = useState<NominatimPlace[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => { setQuery(value) }, [value])

  useEffect(() => {
    if (debouncedQuery.trim().length < 3) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setLoading(true)

    searchNominatim(debouncedQuery, countryCode, abortRef.current.signal)
      .then((results) => {
        setSuggestions(results)
        setIsOpen(results.length > 0)
        setActiveIndex(-1)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Address search error:', err)
          setSuggestions([])
        }
      })
      .finally(() => setLoading(false))

    return () => abortRef.current?.abort()
  }, [debouncedQuery, countryCode])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    onChange(val)
    if (!val) { setSuggestions([]); setIsOpen(false) }
  }

  function handleSelect(place: NominatimPlace) {
    setQuery(place.shortName)
    onChange(place.shortName)
    onSelect(place)
    setSuggestions([])
    setIsOpen(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
  }

  function handleClear() {
    setQuery('')
    onChange('')
    setSuggestions([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && suggestions[activeIndex]) handleSelect(suggestions[activeIndex])
        break
      case 'Escape':
        setIsOpen(false)
        setActiveIndex(-1)
        break
    }
  }

  const hasError = Boolean(error)
  const showClear = query.length > 0 && !disabled

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {label && (
        <label htmlFor={inputId} className="block mb-1.5 text-sm font-medium"
          style={{ color: 'var(--color-text-primary)' }}>
          {label}
        </label>
      )}

      <div
        className={cn(
          'relative flex items-center transition-all duration-200 border bg-white',
          hasError
            ? 'border-[--color-error-500] ring-2 ring-[--color-error-500]/20'
            : 'border-[--color-border-default] focus-within:border-[--color-border-focus] focus-within:ring-2 focus-within:ring-[--color-brand-500]/20',
          disabled && 'opacity-50 cursor-not-allowed bg-[--color-neutral-50]'
        )}
        style={{ borderRadius: 'var(--radius-lg)' }}
      >
        <div className="pl-3.5 flex items-center pointer-events-none"
          style={{ color: 'var(--color-text-secondary)' }}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
        </div>

        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
          className={cn(
            'flex-1 px-3 py-3 text-sm bg-transparent outline-none',
            'placeholder:text-[--color-text-disabled]',
            disabled && 'cursor-not-allowed'
          )}
          style={{ color: 'var(--color-text-primary)' }}
        />

        {showClear && (
          <button type="button" onClick={handleClear} aria-label="Clear address"
            className="mr-2 p-1 rounded-full transition-colors hover:bg-[--color-neutral-100]"
            style={{ color: 'var(--color-text-secondary)' }}>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {(helperText || error) && (
        <p className="mt-1.5 text-xs"
          style={{ color: hasError ? 'var(--color-error-500)' : 'var(--color-text-secondary)' }}>
          {error ?? helperText}
        </p>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul id={listboxId} role="listbox" aria-label="Address suggestions"
          className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-[--color-border-default] overflow-hidden overflow-y-auto max-h-64 focus:outline-none"
          style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)' }}>
          {suggestions.map((place, index) => (
            <li
              key={place.placeId}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(place) }}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-100',
                index === activeIndex ? 'bg-[--color-brand-50]' : 'hover:bg-[--color-neutral-50]',
                index !== suggestions.length - 1 && 'border-b border-[--color-border-default]'
              )}
            >
              <div className="mt-0.5 shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: index === activeIndex ? 'var(--color-brand-100)' : 'var(--color-neutral-100)' }}>
                <MapPin className="w-3.5 h-3.5"
                  style={{ color: index === activeIndex ? 'var(--color-brand-600)' : 'var(--color-text-secondary)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                  {place.shortName || place.displayName.split(',')[0]}
                </p>
                <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                  {place.displayName}
                </p>
              </div>
            </li>
          ))}
          <li className="px-4 py-1.5 border-t border-[--color-border-default]">
            <p className="text-[10px] text-right" style={{ color: 'var(--color-text-disabled)' }}>
              © OpenStreetMap contributors
            </p>
          </li>
        </ul>
      )}

      {isOpen && !loading && suggestions.length === 0 && query.length >= 3 && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 px-4 py-6 bg-white border border-[--color-border-default] text-center"
          style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
          <Search className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--color-neutral-300)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-disabled)' }}>
            Try a more specific address or landmark
          </p>
        </div>
      )}
    </div>
  )
}
