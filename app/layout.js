import "./globals.css";

export const metadata = {
  title: "RehabCoach — Your Movement. Understood.",
  description: "Intelligent movement coaching powered by real-time computer vision. We don't just count reps; we analyze movement quality, alignment, and depth.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
