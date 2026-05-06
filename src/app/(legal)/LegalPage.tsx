import Link from 'next/link'
import { ArrowLeft, Coffee } from 'lucide-react'

interface LegalSection {
  title: string
  body: string[]
}

interface LegalPageProps {
  title: string
  description: string
  lastUpdated: string
  sections: LegalSection[]
}

export function LegalPage({
  title,
  description,
  lastUpdated,
  sections,
}: LegalPageProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/70">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold">
            <Coffee className="h-5 w-5 text-primary" />
            Pualım
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Ana sayfa
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="mb-10 border-b border-border pb-8">
          <p className="mb-3 text-sm font-medium text-primary">
            Son güncelleme: {lastUpdated}
          </p>
          <h1 className="font-heading text-3xl font-bold tracking-normal sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="font-heading text-xl font-semibold">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-7 text-muted-foreground sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
          Sorularınız için{' '}
          <a href="mailto:destek@pualim.today" className="underline hover:text-foreground">
            destek@pualim.today
          </a>{' '}
          adresinden bize ulaşabilirsiniz.
        </div>
      </article>
    </main>
  )
}
