import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchSanity } from '@/sanity/server-client';
import {
  categoryBySlugQuery,
  allCategorySlugsQuery,
  productsByCategorySlugQuery,
} from '@/sanity/queries';
import ProductCard from '@/components/shop/ProductCard';
import {
  generateMetadata as generateSEOMetadata,
  generateBreadcrumbStructuredData,
  generateCollectionPageStructuredData,
} from '@/lib/seo';

const PRODUCTS_PER_PAGE = 6;
const MAX_CATEGORY_PAGE = 1000;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
] as const;

type SortOrder = (typeof SORT_OPTIONS)[number]['value'];

function parseSortOrder(value?: string): SortOrder {
  if (value === 'price-asc' || value === 'price-desc') return value;
  return 'newest';
}

interface CategoryBySlug {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string | null;
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: Array<string> | null;
    ogImage?: { alt?: string | null; asset?: unknown } | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    canonicalUrl?: string | null;
    noIndex?: boolean | null;
    noFollow?: boolean | null;
  } | null;
  productCount?: number;
}

interface CategoryProduct {
  _id: string;
  name: string;
  slug: { current: string };
  images: any[];
  price?: number;
  externalUrl?: string;
  isAvailable?: boolean;
  categories?: { _id: string; title: string; slug: { current: string } }[];
  sizes?: string[];
  _createdAt: string;
}

interface PaginatedProductsResult {
  products: CategoryProduct[];
  totalProducts: number;
}

interface CategorySlugParams {
  categorySlug: string;
}

interface SearchParamsType {
  page?: string;
  sort?: string;
}

async function getCategory(slug: string): Promise<CategoryBySlug | null> {
  try {
    return await fetchSanity<CategoryBySlug>(
      categoryBySlugQuery,
      { slug },
      { revalidate: 300, tags: ['categories', `category-${slug}`] }
    );
  } catch (error) {
    console.error(`Error fetching category with slug ${slug}:`, error);
    return null;
  }
}

async function getCategoryProducts(
  categorySlug: string,
  page: number,
  sortOrder: SortOrder
): Promise<PaginatedProductsResult> {
  const safePage = Math.min(Math.max(page, 1), MAX_CATEGORY_PAGE);
  const start = (safePage - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;

  try {
    return await fetchSanity<PaginatedProductsResult>(
      productsByCategorySlugQuery,
      { categorySlug, start, end, sortOrder },
      { revalidate: 120, tags: ['products', `category-${categorySlug}`] }
    );
  } catch (error) {
    console.error(`Error fetching products for category ${categorySlug}:`, error);
    return { products: [], totalProducts: 0 };
  }
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

function buildCategoryHref(
  categorySlug: string,
  options: { page?: number; sort?: SortOrder } = {}
) {
  const params = new URLSearchParams();
  if (options.page && options.page > 1) {
    params.set('page', String(options.page));
  }
  if (options.sort && options.sort !== 'newest') {
    params.set('sort', options.sort);
  }
  const query = params.toString();
  return query
    ? `/shop/category/${categorySlug}?${query}`
    : `/shop/category/${categorySlug}`;
}

export async function generateStaticParams() {
  const slugs = await fetchSanity<string[]>(
    allCategorySlugsQuery,
    {},
    { revalidate: 3600, tags: ['categories'] }
  );

  return (slugs || []).filter(Boolean).map((slug) => ({
    categorySlug: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CategorySlugParams>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategory(categorySlug);

  if (!category) {
    return {
      title: 'Category Not Found - Sophron Studies',
      description: 'The requested category could not be found.',
    };
  }

  return generateSEOMetadata(
    category.seo || null,
    `${category.title} Bible Studies for Women | Sophron Studies`,
    category.description || undefined
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<CategorySlugParams>;
  searchParams: Promise<SearchParamsType>;
}) {
  const { categorySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams.page;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  const sortOrder = parseSortOrder(resolvedSearchParams.sort);

  const category = await getCategory(categorySlug);
  if (!category) {
    notFound();
  }

  const { products, totalProducts } = await getCategoryProducts(
    categorySlug,
    validPage,
    sortOrder
  );
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const productCount = category.productCount ?? totalProducts;

  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const categoryUrl = `${baseUrl}/shop/category/${categorySlug}`;

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: baseUrl },
    { name: 'Shop', url: `${baseUrl}/shop` },
    { name: category.title, url: categoryUrl },
  ]);

  const collectionStructuredData = generateCollectionPageStructuredData({
    name: category.title,
    description: category.description || '',
    url: categoryUrl,
  });

  const paginationHref = (page: number) =>
    buildCategoryHref(categorySlug, { page, sort: sortOrder });

  return (
    <div className="container mx-auto px-4 pb-16 pt-8 md:max-w-6xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionStructuredData),
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-gray-800">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/shop" className="hover:text-gray-800">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-800" aria-current="page">
            {category.title}
          </li>
        </ol>
      </nav>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-heading2 mb-4">{category.title}</h1>
        {category.description && (
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {category.description}
          </p>
        )}
        {typeof productCount === 'number' && (
          <p className="text-sm text-gray-500 mt-4">
            Showing {productCount} {productCount === 1 ? 'study' : 'studies'}
          </p>
        )}
      </header>

      <div className="flex flex-wrap justify-end items-center gap-3 mb-8">
        <span className="text-sm text-gray-500">Sort by</span>
        <nav aria-label="Sort products" className="flex flex-wrap gap-2 text-sm">
          {SORT_OPTIONS.map((option) => {
            const isActive = sortOrder === option.value;
            return (
              <Link
                key={option.value}
                href={buildCategoryHref(categorySlug, { sort: option.value })}
                className={`px-3 py-1 border rounded-sm ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 border-gray-400'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-current={isActive ? 'true' : undefined}
              >
                {option.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 px-8 md:px-0">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product as any}
              fromCategory={categorySlug}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found.</p>
      )}

      {totalProducts > PRODUCTS_PER_PAGE && (
        <div className="flex justify-center items-center mt-12 space-x-4">
          <Link
            href={paginationHref(validPage - 1)}
            className={`px-3 py-1 border rounded-sm ${
              validPage <= 1
                ? 'text-gray-400 pointer-events-none'
                : 'hover:bg-gray-100'
            }`}
            aria-disabled={validPage <= 1}
          >
            &larr;
          </Link>
          <span className="text-sm text-gray-700">
            Page {validPage} of {totalPages}
          </span>
          <Link
            href={paginationHref(validPage + 1)}
            className={`px-3 py-1 border rounded-sm ${
              validPage >= totalPages
                ? 'text-gray-400 pointer-events-none'
                : 'hover:bg-gray-100'
            }`}
            aria-disabled={validPage >= totalPages}
          >
            &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
