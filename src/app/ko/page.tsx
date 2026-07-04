import KoPage from '../../KoPage'
import { createMetadata } from '../seo'

export const revalidate = 5

export function generateMetadata() {
  return createMetadata({
    title: 'The One - GG99',
    description: 'The One - GG99 Korean landing page.',
    path: '/ko',
  })
}

export default function Page() {
  return <KoPage />
}
