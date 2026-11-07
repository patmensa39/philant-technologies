import type { Metadata } from 'next';
import { SearchBox } from '@/components/SearchBox';
export const metadata: Metadata = { title: 'Search', description: 'Search articles, projects, resources, and skills on Philant Technologies.', alternates: { canonical: '/search' } };
export default function Search() {
  return <div className="wrap section"><h1>Search</h1><SearchBox /></div>;
}
