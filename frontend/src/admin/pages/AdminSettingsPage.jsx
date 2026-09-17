import { DEMO_ADMIN } from '../../services/auth'
import { resetStore } from '../../store/repository'

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 rounded-3xl border border-ink/8 bg-cream p-6 shadow-card">
      <h2 className="text-xl font-bold">সেটিংস</h2>
      <p className="text-sm leading-6 text-ink-soft">
        এই ভার্সনে mock authentication ও localStorage store ব্যবহার হচ্ছে। পরে একই service ফাংশনগুলো API এ পয়েন্ট করা যাবে।
      </p>
      <div className="rounded-2xl bg-paper p-4 text-sm">
        <p>Demo login: {DEMO_ADMIN.email}</p>
        <p>Password: {DEMO_ADMIN.password}</p>
      </div>
      <p className="text-sm text-ink-soft">
        Bulk Excel/CSV ইমপোর্টের জন্য architecture প্রস্তুত — প্রথম ভার্সনে single question entry যথেষ্ট।
      </p>
      <button
        type="button"
        className="rounded-xl border border-ink/10 px-4 py-2 text-sm font-semibold"
        onClick={() => {
          if (window.confirm('সব mock data রিসেট হবে। নিশ্চিত?')) resetStore()
        }}
      >
        Mock Data রিসেট করুন
      </button>
    </div>
  )
}
