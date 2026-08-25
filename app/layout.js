import "./globals.css";

export const metadata = {
  title: "Corvo — Your Movement. Understood.",
  description: "Intelligent movement coaching powered by real-time computer vision. We don't just count reps; we analyze movement quality, alignment, and depth.",
};

import ReloadRedirect from "@/components/ReloadRedirect";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReloadRedirect />
        {children}
      </body>
    </html>
  );
}
