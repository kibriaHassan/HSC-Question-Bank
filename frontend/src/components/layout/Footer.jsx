import { Link } from 'react-router-dom'
import Logo from '../brand/Logo'

export default function Footer() {
  return (
    <footer className="border-t border-ink/8 bg-cream text-ink">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-ink-soft">
            HSC গণিত ও পদার্থবিজ্ঞানের বোর্ড প্রশ্ন, MCQ ও সৃজনশীল অনুশীলনের জন্য একটি আধুনিক প্রশ্নব্যাংক।
          </p>
        </div>
        <div>
          <h3 className="font-display text-sm font-bold tracking-[0.18em] uppercase text-gold-deep">নেভিগেশন</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link to="/admin/login" className="text-ink-soft hover:text-ink">অ্যাডমিন</Link>
            <Link to="/subjects/math-1" className="text-ink-soft hover:text-ink">গণিত ১ম পত্র</Link>
            <Link to="/subjects/physics-1" className="text-ink-soft hover:text-ink">পদার্থবিজ্ঞান ১ম পত্র</Link>
          </div>
        </div>
        <div>
          <h3 className="font-display text-sm font-bold tracking-[0.18em] uppercase text-gold-deep">নোট</h3>
          <p className="mt-4 text-sm leading-6 text-ink-soft">
            এই ধাপে সম্পূর্ণ Frontend ও ডামি ডেটা ব্যবহার করা হয়েছে। পরে একই ডেটা স্ট্রাকচারে Backend যুক্ত করা যাবে।
          </p>
        </div>
      </div>
      <div className="border-t border-ink/8 py-4 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} প্রজ্ঞা — শিক্ষামূলক প্রশ্নব্যাংক
      </div>
    </footer>
  )
}
