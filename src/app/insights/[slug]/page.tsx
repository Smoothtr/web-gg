import { notFound } from 'next/navigation'
import { getServerCmsInsight, listServerCmsInsights } from '../../../cms/serverRepository'
import { InsightArticleView } from '../../pageViews'
import { generateInsightMetadata } from '../../routeMetadata'

export const revalidate = 5

export async function generateStaticParams() {
  const posts = await listServerCmsInsights()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return generateInsightMetadata(slug)
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getServerCmsInsight(slug)
  if (!post) notFound()

  return <InsightArticleView slug={slug} />
}
