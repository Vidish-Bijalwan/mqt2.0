// src/app/admin/blog/new/page.tsx
// Server gate for the admin blog creator:
//  1. If ADMIN_PASSWORD is not set -> setup instructions (never throws).
//  2. If not signed in (mqt_admin cookie) -> login form.
//  3. If signed in -> the creator form.
// Never touches DATABASE_URL; safe to render with no env configured.

import Link from "next/link";
import { isAdminRequest } from "@/lib/adminAuth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import BlogCreatorForm from "@/components/admin/BlogCreatorForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New blog post · MQT Admin",
  robots: { index: false, follow: false },
};

function AdminChrome({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-700">
              My Quick Trippers · Admin
            </p>
            <h1 className="text-xl font-bold text-gray-900">{heading}</h1>
          </div>
          <Link
            href="/blog"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            ← Back to blog
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </main>
  );
}

function SetupInstructions() {
  const steps = [
    "Open the Vercel dashboard and select the mqt project.",
    "Go to Settings → Environment Variables.",
    "Add a new variable named ADMIN_PASSWORD with a strong random value, and tick Environment: Production.",
    "Redeploy the site (Deployments → ⋯ → Redeploy) so the new variable takes effect, then reload this page.",
  ];
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Admin access is not set up yet</h2>
      <p className="mt-1 text-sm text-gray-600">
        <span className="font-mono">ADMIN_PASSWORD</span> is missing from the server
        environment. <span className="font-mono">DATABASE_URL</span> is already set, so
        only the admin password needs adding:
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm text-gray-700">
        {steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Tip: generate the password with <span className="font-mono">openssl rand -base64 32</span>.
        This admin page is not linked anywhere public — only visit it directly.
      </p>
    </div>
  );
}

export default async function NewBlogPage() {
  // Reading env directly never throws; when the variable is absent this page
  // just renders the setup instructions instead of failing.
  const adminConfigured = Boolean(process.env.ADMIN_PASSWORD);

  if (!adminConfigured) {
    return (
      <AdminChrome heading="Create a blog post">
        <SetupInstructions />
      </AdminChrome>
    );
  }

  let authed = false;
  try {
    authed = await isAdminRequest();
  } catch {
    authed = false;
  }

  if (!authed) {
    return (
      <AdminChrome heading="Create a blog post">
        <AdminLoginForm />
      </AdminChrome>
    );
  }

  return (
    <AdminChrome heading="Create a blog post">
      <BlogCreatorForm />
    </AdminChrome>
  );
}
