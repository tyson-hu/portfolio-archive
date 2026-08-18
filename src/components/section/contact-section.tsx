import Link from "next/link";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Button } from "@/components/ui/button";
import { DATA } from "@/data/resume";
import { MailIcon } from "lucide-react";

export default function ContactSection() {
  const linkedIn = DATA.contact.social.LinkedIn;

  return (
    <div className="border rounded-xl p-10 relative">
      <div className="absolute -top-4 border bg-primary z-10 rounded-xl px-4 py-1 left-1/2 -translate-x-1/2">
        <span className="text-background text-sm font-medium">Contact</span>
      </div>
      <div className="absolute inset-0 top-0 left-0 right-0 h-1/2 rounded-xl overflow-hidden">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={2}
          gridGap={2}
          style={{
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>
      <div className="relative flex flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Let&apos;s build something useful.
        </h2>
        <p className="mx-auto max-w-lg text-muted-foreground text-balance">
          I&apos;m open to backend, full-stack, mobile, and developer tooling
          opportunities. The best way to reach me is by email, or you can
          connect with me on LinkedIn.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button asChild>
            <Link href={`mailto:${DATA.contact.email}`}>
              <MailIcon className="size-4" />
              Email me
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href={linkedIn.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect on LinkedIn
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
