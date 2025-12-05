// Root layout - minimal wrapper for locale-specific layouts
// The actual layout is handled by [locale]/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
