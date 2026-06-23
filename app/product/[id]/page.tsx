import { notFound } from 'next/navigation'
import { getProductById, products } from '@/data/products'
import type { Metadata } from 'next'
import ProductClient from './ProductClient'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = getProductById(id)
  if (!product) return {}
  return {
    title: `${product.name} - ANTRO`,
    description: product.description,
    openGraph: {
      title: `${product.name} - ANTRO`,
      description: product.description,
      images: [product.mobileImages[0]],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  return <ProductClient product={product} />
}
