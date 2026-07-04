import V2Page from '../../V2Page'
import { createMetadata } from '../seo'

export const revalidate = 5

export function generateMetadata() {
  return createMetadata({
    title: 'The One - GG99',
    description: 'The One - GG99 homepage.',
    path: '/vi',
  })
}

export default function Page() {
  return <V2Page />
}
