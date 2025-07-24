"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
    { href: "/", label: "Home" },
    { href: "/reports", label: "Reports" },
    { href: "/calls", label: "Calls" },
    // { href: "/transcriptions", label: "Transcriptions" },
    // { href: "/summaries", label: "Summaries" },
    { href: "/usage", label: "Usage" },
]

export function Navigation() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="border-b border-border bg-background">
            <div className="container mx-auto px-4">
                <div className="flex h-14 items-center justify-between">
                    <Link href="/" className="text-lg font-bold text-foreground">
                        <span className="text-green-600">Zorah AI</span> Operations
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-foreground/80",
                                    pathname === item.href
                                        ? "text-foreground border-b-2 border-foreground pb-3"
                                        : "text-muted-foreground",
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <ThemeToggle />
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden flex items-center space-x-2">
                        <ThemeToggle />
                        <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="p-2">
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden border-t border-border py-4">
                        <div className="flex flex-col space-y-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-foreground/80 px-2 py-1",
                                        pathname === item.href ? "text-foreground font-semibold" : "text-muted-foreground",
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
