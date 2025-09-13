export function Footer() {
  return (
    <footer className="bg-foreground text-background py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm">© 2024 VelopTools. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm hover:text-accent transition-colors">
              About
            </a>
            <a href="#" className="text-sm hover:text-accent transition-colors">
              Contact
            </a>
            <a href="#" className="text-sm hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:text-accent transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
