import { NavLink } from 'react-router-dom'
import { isPhysicsSubject } from '../../data/importantTopics'

const itemClass = (active) =>
  [
    'rounded-full px-4 py-2 text-sm font-bold transition',
    active ? 'bg-forest text-cream shadow-btn' : 'border border-ink/10 bg-cream text-ink hover:border-forest/30',
  ].join(' ')

export default function PhysicsSectionNav({ subject, active = 'books' }) {
  if (!isPhysicsSubject(subject)) return null
  const subjectId = subject.id
  return (
    <nav className="mt-6 flex flex-wrap gap-2" aria-label="পদার্থবিজ্ঞান বিভাগ">
      <NavLink to={`/subjects/${subjectId}`} end className={itemClass(active === 'books')}>
        বইসমূহ
      </NavLink>
      <NavLink to={`/subjects/${subjectId}/important`} className={itemClass(active === 'important')}>
        অতি গুরুত্বপূর্ণ টপিক
      </NavLink>
    </nav>
  )
}
