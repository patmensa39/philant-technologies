import type { Metadata } from 'next';
import { SearchBox } from '@/components/SearchBox';
export const metadata: Metadata = { title: 'Search', alternates: { canonical: '/search' } };
export default function Search() {
  return <div className="wrap section"><h1>Search</h1><SearchBox /></div>;
}
