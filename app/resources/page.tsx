import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PhoneIcon, ExternalLinkIcon, BookOpenIcon, FileTextIcon, MapPinIcon } from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Resources</h1>
          <p className="text-gray-600 mb-8">
            Access important resources and support services for women's safety and legal assistance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="bg-red-50 dark:bg-red-900/20">
                <CardTitle className="flex items-center gap-2">
                  <PhoneIcon className="h-5 w-5 text-red-600" />
                  Emergency Hotlines
                </CardTitle>
                <CardDescription>24/7 support for crisis situations</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-medium">National Domestic Violence Hotline</h3>
                  <p className="text-sm text-gray-500 mb-1">24/7 confidential support</p>
                  <a href="tel:18007997233" className="text-purple-600 font-medium flex items-center gap-1">
                    <PhoneIcon className="h-4 w-4" /> 1-800-799-7233
                  </a>
                </div>

                <div>
                  <h3 className="font-medium">National Sexual Assault Hotline</h3>
                  <p className="text-sm text-gray-500 mb-1">Free confidential support</p>
                  <a href="tel:18006564673" className="text-purple-600 font-medium flex items-center gap-1">
                    <PhoneIcon className="h-4 w-4" /> 1-800-656-4673
                  </a>
                </div>

                <div>
                  <h3 className="font-medium">Crisis Text Line</h3>
                  <p className="text-sm text-gray-500 mb-1">Text HOME to 741741</p>
                  <p className="text-purple-600 font-medium">Free 24/7 support</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                <CardTitle className="flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5 text-blue-600" />
                  Legal Resources
                </CardTitle>
                <CardDescription>Information on legal rights and procedures</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-medium">WomensLaw.org</h3>
                  <p className="text-sm text-gray-500 mb-1">Legal information and resources</p>
                  <a
                    href="https://www.womenslaw.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 font-medium flex items-center gap-1"
                  >
                    <ExternalLinkIcon className="h-4 w-4" /> Visit Website
                  </a>
                </div>

                <div>
                  <h3 className="font-medium">Legal Aid in Your Area</h3>
                  <p className="text-sm text-gray-500 mb-1">Find free legal assistance</p>
                  <a
                    href="https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 font-medium flex items-center gap-1"
                  >
                    <ExternalLinkIcon className="h-4 w-4" /> Find Legal Aid
                  </a>
                </div>

                <div>
                  <h3 className="font-medium">Know Your Rights</h3>
                  <p className="text-sm text-gray-500 mb-1">Educational resources</p>
                  <Link href="/resources/rights" className="text-purple-600 font-medium flex items-center gap-1">
                    <FileTextIcon className="h-4 w-4" /> View Resources
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-purple-600" />
                Find Local Support Services
              </CardTitle>
              <CardDescription>Locate shelters, support groups, and legal aid in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
                <p className="text-sm">
                  Enter your location to find nearby resources and support services for women's safety.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter your city or zip code"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button>Search</Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-purple-100 dark:bg-purple-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-purple-800 mb-3">Safety Planning</h2>
            <p className="mb-4">
              Creating a safety plan is an important step in protecting yourself in dangerous situations.
            </p>
            <Button asChild>
              <Link href="/resources/safety-plan">Create a Safety Plan</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
