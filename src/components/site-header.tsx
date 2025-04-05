import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { siteConfig } from "@/config/site"
import { GithubIcon } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <a
              href="https://github.com/cmelion/rjsf-tailwind"
              target="_blank"
              rel="noreferrer"
              title="View source on GitHub"
              aria-label="GitHub"
              className="p-2 text-foreground/60 transition-colors hover:text-foreground"
            >
              <GithubIcon className="h-6 w-6" />
            </a>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}