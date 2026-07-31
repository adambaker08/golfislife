import "./globals.css";

export const metadata = {
  title: "GolfisLife — Gear, Travel & Courses",
  description:
    "Honest reviews and guides on golf gear, golf travel, and courses worth playing.",
  verification: {
    google: "<meta name="google-site-verification" content="k0LumybYPyLfHoiP1mDJUtijkmb09sxaF8EzMTWmoAo" />",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen flex flex-col">
        <header className="bg-fairway text-white">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight">
              ⛳ GolfisLife
            </a>
            <nav className="flex gap-5 text-sm font-medium">
              <a href="/" className="hover:text-sand">Home</a>
              <a href="/blog" className="hover:text-sand">Blog</a>
              <a href="/about" className="hover:text-sand">About</a>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
          {children}
        </main>

        <footer className="bg-fairwayDark text-sand/80 text-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <p className="mb-3">
              © {new Date().getFullYear()} GolfisLife. Some links on this
              site are affiliate links — we may earn a commission at no
              extra cost to you. We only recommend gear, courses, and
              travel we&apos;d genuinely play or use ourselves. As an
              Amazon Associate, GolfisLife earns from qualifying purchases.
            </p>
            <nav className="flex gap-4 text-xs">
              <a href="/privacy-policy" className="hover:text-sand underline">
                Privacy Policy
              </a>
              <a
                href="/affiliate-disclosure"
                className="hover:text-sand underline"
              >
                Affiliate Disclosure
              </a>
              <a href="/about" className="hover:text-sand underline">
                About
              </a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
