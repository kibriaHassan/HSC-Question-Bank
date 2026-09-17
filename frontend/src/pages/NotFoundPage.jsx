import { Link } from 'react-router-dom'
import EmptyState from '../components/ui/EmptyState'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <EmptyState
        title="পেজটি পাওয়া যায়নি"
        message="লিংকটি ভুল হতে পারে। হোমপেজ থেকে বিষয় বেছে নিয়ে আবার শুরু করুন।"
        action={
          <Link to="/" className="mt-5 inline-flex rounded-full bg-forest px-4 py-2 text-sm font-bold text-cream">
            হোমে ফিরুন
          </Link>
        }
      />
    </div>
  )
}
