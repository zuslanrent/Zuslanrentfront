import Link from "next/link"
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react"
import { Logo } from "./logo"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
           <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              © 2026 Camp Rent. Бүх эрх хуулиар хамгаалагдсан.
            </p>
          </div>

          <div>
            <ul className="space-y-2">
              <li>
                <Link href="#over-ons" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Бидний тухай
                </Link>
              </li>
              <li>
                <Link href="#diensten" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Үйлчилгээ
                </Link>
              </li>
              <li>
                <Link href="#portfolio" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Шинэ зарууд
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Холбоо барих
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Сошиал холбоосууд</h4>
            <div className="flex gap-4">
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
