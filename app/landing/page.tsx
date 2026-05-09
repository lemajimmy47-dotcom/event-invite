import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-50 shadow-sm">
        <div className="text-2xl font-bold text-blue-700">🎉 InviteYetu.</div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#how" className="hover:text-blue-600 transition">Jinsi Inavyofanya Kazi</a>
          <a href="#pricing" className="hover:text-blue-600 transition">Bei</a>
          <a href="#faq" className="hover:text-blue-600 transition">Maswali</a>
          <a href="#contact" className="hover:text-blue-600 transition">Wasiliana</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition">Ingia</Link>
          <Link href="/login" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">Jisajili</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
          ✨ Digital Invitations Made Simple
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Tengeneza na Tuma<br />
          <span className="text-blue-600">Mialiko ya Kidijitali</span><br />
          kwa Dakika Chache
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Tuma mialiko kupitia WhatsApp, simamia RSVP, na fuatilia wageni wako kwa urahisi kamili.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/login" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition flex items-center gap-2">
            Anza Sasa →
          </Link>
          <a href="#how" className="border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition">
            Ona Jinsi Inavyofanya Kazi
          </a>
        </div>

        <div className="mt-16 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
          <div className="bg-gray-200 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-xs text-gray-500 ml-2">app.inviteyetu.co.tz</span>
          </div>
          <div className="p-6 flex gap-4">
            <div className="w-48 bg-blue-700 rounded-xl p-4 text-white text-left">
              <div className="font-bold text-lg mb-4">🎉 InviteYetu</div>
              <div className="space-y-2 text-sm">
                <div className="bg-blue-600 rounded-lg px-3 py-2">📊 Dashboard</div>
                <div className="px-3 py-2 opacity-70">📋 Tukio</div>
                <div className="px-3 py-2 opacity-70">👁️ Preview</div>
                <div className="px-3 py-2 opacity-70">🎨 Templates</div>
                <div className="px-3 py-2 opacity-70">👥 Wageni</div>
                <div className="px-3 py-2 opacity-70">📨 Tuma</div>
                <div className="px-3 py-2 opacity-70">✅ RSVP</div>
                <div className="px-3 py-2 opacity-70">📷 Scan</div>
              </div>
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">Dashboard</h3>
                <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-lg">+ Tukio Jipya</div>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-xs text-gray-500">Matukio</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">248</div>
                  <div className="text-xs text-gray-500">Wageni</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600">186</div>
                  <div className="text-xs text-gray-500">RSVP</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-orange-600">142</div>
                  <div className="text-xs text-gray-500">Wamefika</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Harusi ya John na Mary</div>
                    <div className="text-xs text-gray-400">📅 30 Mei 2026 • 📍 Ramada Hotel</div>
                  </div>
                  <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Birthday ya Amina</div>
                    <div className="text-xs text-gray-400">📅 15 Juni 2026 • 📍 Serena Hotel</div>
                  </div>
                  <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Upcoming</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Kwa Nini InviteYetu?</h2>
          <p className="text-center text-gray-500 mb-12">Mfumo kamili wa kusimamia mialiko ya kidijitali</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="text-4xl mb-4">📲</div>
              <h3 className="font-bold text-gray-900 mb-2">Tuma WhatsApp</h3>
              <p className="text-gray-500 text-sm">Tuma mialiko kwa wageni wote kwa click moja kupitia WhatsApp</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="font-bold text-gray-900 mb-2">Simamia RSVP</h3>
              <p className="text-gray-500 text-sm">Fuatilia wageni watakaokuja na wasiokuja kwa wakati halisi</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="text-4xl mb-4">📷</div>
              <h3 className="font-bold text-gray-900 mb-2">Scan Check-in</h3>
              <p className="text-gray-500 text-sm">Thibitisha wageni kwa QR code au nambari yao ya kipekee</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-bold text-gray-900 mb-2">Templates Nzuri</h3>
              <p className="text-gray-500 text-sm">Chagua template inayofaa tukio lako — harusi, birthday, mahafali na zaidi</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="text-4xl mb-4">🎫</div>
              <h3 className="font-bold text-gray-900 mb-2">Kadi za Kipekee</h3>
              <p className="text-gray-500 text-sm">Kila mgeni anapata kadi yake yenye jina lake na QR code ya kipekee</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">Takwimu za Kina</h3>
              <p className="text-gray-500 text-sm">Ona idadi ya wageni, RSVP, na waliofika kwa wakati halisi</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Jinsi Inavyofanya Kazi</h2>
          <p className="text-center text-gray-500 mb-12">Hatua 4 rahisi tu</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">📝</div>
              <div className="font-bold text-gray-900 mb-2">1. Unda Tukio</div>
              <p className="text-gray-500 text-sm">Jaza taarifa za tukio lako na chagua template</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">👥</div>
              <div className="font-bold text-gray-900 mb-2">2. Ongeza Wageni</div>
              <p className="text-gray-500 text-sm">Ongeza wageni mmoja mmoja au kwa wingi</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">📲</div>
              <div className="font-bold text-gray-900 mb-2">3. Tuma Mialiko</div>
              <p className="text-gray-500 text-sm">Tuma kadi za mwaliko kupitia WhatsApp</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">📷</div>
              <div className="font-bold text-gray-900 mb-2">4. Check-in</div>
              <p className="text-gray-500 text-sm">Scan QR code siku ya tukio kuthibitisha wageni</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Bei Yetu</h2>
          <p className="text-center text-gray-500 mb-12">Rahisi na ya bei nafuu</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
              <div className="text-4xl mb-2">🆓</div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">Bure</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">0 <span className="text-sm font-normal text-gray-500">TSh</span></div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6 text-left">
                <li>✅ Tukio 1</li>
                <li>✅ Wageni 10</li>
                <li>✅ QR Code</li>
                <li>✅ RSVP</li>
              </ul>
              <Link href="/login" className="block w-full border border-blue-600 text-blue-600 py-2 rounded-xl font-medium hover:bg-blue-50 transition">Anza Bure</Link>
            </div>
            <div className="bg-blue-600 rounded-2xl p-6 text-center text-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">MAARUFU</div>
              <div className="text-4xl mb-2">⭐</div>
              <h3 className="font-bold text-xl mb-1">Standard</h3>
              <div className="text-3xl font-bold mb-4">5,000 <span className="text-sm font-normal opacity-75">TSh/tukio</span></div>
              <ul className="text-sm space-y-2 mb-6 text-left opacity-90">
                <li>✅ Wageni Unlimited</li>
                <li>✅ Templates zote</li>
                <li>✅ WhatsApp Bulk Send</li>
                <li>✅ QR Check-in</li>
                <li>✅ RSVP Management</li>
              </ul>
              <Link href="/login" className="block w-full bg-white text-blue-600 py-2 rounded-xl font-medium hover:bg-blue-50 transition">Chagua Plan</Link>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
              <div className="text-4xl mb-2">💎</div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">Premium</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">15,000 <span className="text-sm font-normal text-gray-500">TSh/mwezi</span></div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6 text-left">
                <li>✅ Matukio Unlimited</li>
                <li>✅ Wageni Unlimited</li>
                <li>✅ Custom Domain</li>
                <li>✅ Priority Support</li>
                <li>✅ Analytics za Kina</li>
              </ul>
              <Link href="/login" className="block w-full border border-blue-600 text-blue-600 py-2 rounded-xl font-medium hover:bg-blue-50 transition">Chagua Plan</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Maswali Yanayoulizwa Mara kwa Mara</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-2">Je, ninaweza kutumia mfumo huu bure?</h3>
              <p className="text-gray-500 text-sm">Ndiyo! Una plan ya bure yenye tukio 1 na wageni 10. Unaweza kuanza bila kulipa.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-2">Je, mialiko inatumwa vipi?</h3>
              <p className="text-gray-500 text-sm">Mialiko inatumwa kupitia WhatsApp. Kila mgeni anapata link yake ya kipekee yenye kadi ya mwaliko na QR code.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-2">Je, naweza kuona wageni waliokubali na waliokataa?</h3>
              <p className="text-gray-500 text-sm">Ndiyo! Dashboard inaonyesha idadi ya wageni waliokubali, waliaokataa, na ambao hawajawahi kujibu.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-2">Je, check-in inafanya kazi vipi?</h3>
              <p className="text-gray-500 text-sm">Siku ya tukio, unaweza scan QR code ya mgeni au kuandika nambari yake ya kipekee kuthibitisha ufike wake.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-blue-600 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Uko Tayari Kuanza?</h2>
          <p className="text-blue-200 mb-8 text-lg">Jiunge na watumiaji wanaotumia InviteYetu kusimamia mialiko yao</p>
          <Link href="/login" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition inline-block">
            Anza Sasa — Ni Bure! 🚀
          </Link>
          <p className="text-blue-200 text-sm mt-6">Una swali? Wasiliana nasi: <a href="https://wa.me/255653578184" className="underline">WhatsApp</a></p>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <div className="text-xl font-bold text-white">🎉 InviteYetu.</div>
          <p className="text-sm">© 2026 InviteYetu. Haki zote zimehifadhiwa.</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  )
}