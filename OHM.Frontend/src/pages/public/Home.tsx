import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Hospital, ShieldCheck, ArrowRight, Megaphone, Sparkles,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePublicDoctors } from '@/hooks/usePublicDoctors'
import { usePublicAnnouncements } from '@/hooks/useAnnouncements'
import { usePublicOffers } from '@/hooks/useOffers'
import { getOfferIcon } from '@/lib/offerIcons'
import type { AnnouncementDto } from '@/types/api'

function initials(name: string) {
  return name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function PublicHome() {
  const { data: doctorsData, isLoading: loadingDoctors } = usePublicDoctors(8)
  const { data: announcementsData, isLoading: loadingAnnouncements } = usePublicAnnouncements(6)
  const { data: offersData, isLoading: loadingOffers } = usePublicOffers()
  const [openAnnouncement, setOpenAnnouncement] = useState<AnnouncementDto | null>(null)

  const doctors = doctorsData?.items ?? []
  const announcements = announcementsData?.items ?? []
  const offers = offersData ?? []

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Hospital className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">CareFlow</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#doctors" className="hover:text-gray-900">Doctors</a>
            <a href="#announcements" className="hover:text-gray-900">Announcements</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign In</Link>
            <Link to="/register" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Modern Hospital Management, Simplified
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Care, coordinated. <span className="text-blue-600">All in one place.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            CareFlow connects patients, doctors, nurses, and administrators on a single platform —
            appointments, records, prescriptions, lab results, and messaging, without the paperwork.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link to="/register" className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
              Create Account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20 scroll-mt-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">What CareFlow Offers</h2>
          <p className="mt-3 text-gray-500">Everything a modern hospital needs, in one connected system.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loadingOffers && <p className="col-span-full text-center text-sm text-gray-400">Loading…</p>}
          {!loadingOffers && offers.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-14 text-center">
              <Sparkles className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-400">Nothing to show yet — check back soon.</p>
            </div>
          )}
          {offers.map((f) => {
            const Icon = getOfferIcon(f.icon)
            return (
              <div key={f.id} className="rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500">{f.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Doctors */}
      <section id="doctors" className="bg-gray-50 py-20 scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Doctors</h2>
            <p className="mt-3 text-gray-500">A team of specialists ready to take care of you.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {loadingDoctors && <p className="col-span-full text-center text-sm text-gray-400">Loading doctors…</p>}
            {!loadingDoctors && doctors.length === 0 && (
              <p className="col-span-full text-center text-sm text-gray-400">No doctors listed yet.</p>
            )}
            {doctors.map((d) => (
              <div key={d.id} className="rounded-2xl bg-white p-6 text-center shadow-sm border border-gray-100">
                {d.profileImageUrl ? (
                  <img src={d.profileImageUrl} alt={d.fullName} className="mx-auto h-16 w-16 rounded-full object-cover" />
                ) : (
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                    {initials(d.fullName)}
                  </div>
                )}
                <p className="mt-3 font-semibold text-gray-900">Dr. {d.fullName}</p>
                <p className="text-xs text-gray-500">{d.specialization}</p>
                <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${d.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {d.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section id="announcements" className="mx-auto max-w-6xl px-6 py-20 scroll-mt-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Announcements</h2>
          <p className="mt-3 text-gray-500">News and updates from the CareFlow team.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loadingAnnouncements && <p className="col-span-full text-center text-sm text-gray-400">Loading announcements…</p>}
          {!loadingAnnouncements && announcements.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-14 text-center">
              <Megaphone className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-400">No announcements yet — check back soon.</p>
            </div>
          )}
          {announcements.map((a) => (
            <article
              key={a.id}
              onClick={() => setOpenAnnouncement(a)}
              className="cursor-pointer overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="h-40 w-full object-cover" />}
              <div className="p-5">
                <p className="text-xs text-gray-400">
                  {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                  {a.author && ` · ${a.author}`}
                </p>
                <h3 className="mt-1.5 font-semibold text-gray-900">{a.title}</h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-3">{a.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Dialog open={!!openAnnouncement} onOpenChange={(open) => !open && setOpenAnnouncement(null)}>
        <DialogContent className="max-w-2xl">
          {openAnnouncement && (
            <>
              <DialogHeader>
                <DialogTitle>{openAnnouncement.title}</DialogTitle>
              </DialogHeader>
              <p className="text-xs text-gray-400">
                {openAnnouncement.publishedAt
                  ? new Date(openAnnouncement.publishedAt).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })
                  : ''}
                {openAnnouncement.author && ` · ${openAnnouncement.author}`}
              </p>
              {openAnnouncement.imageUrl && (
                <img src={openAnnouncement.imageUrl} alt={openAnnouncement.title} className="mt-2 max-h-72 w-full rounded-lg object-cover" />
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{openAnnouncement.content}</p>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Hospital className="h-4 w-4" /> CareFlow Hospital Management System
          </div>
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} CareFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
