import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function PrivacyPolicy() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">Privacy Policy</Button>
      </DialogTrigger>
      <DialogContent className="w-[70vw] overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
          <div className="prose max-w-none">
            <p>
              Your privacy is important to us. It is our policy to respect your
              privacy regarding any information we may collect from you across
              our website.
            </p>

            <h2 className="mb-4 mt-6 text-2xl font-semibold">
              1. Information We Collect
            </h2>
            <p>
              {
                "We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used."
              }
            </p>

            <h2 className="mb-4 mt-6 text-2xl font-semibold">
              2. Use of Information
            </h2>
            <p>
              We may use your personal information for the following purposes:
            </p>
            <ul className="mb-4 list-disc pl-6">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>
                To gather analysis or valuable information so that we can
                improve our service
              </li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>

            <h2 className="mb-4 mt-6 text-2xl font-semibold">
              3. Data Protection
            </h2>
            <p>
              {
                "We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification."
              }
            </p>

            <h2 className="mb-4 mt-6 text-2xl font-semibold">4. Cookies</h2>
            <p>
              We use cookies to store information about your preferences and the
              pages you visit on our website. This helps us to optimize your
              user experience. You can choose to disable cookies through your
              individual browser options.
            </p>

            <h2 className="mb-4 mt-6 text-2xl font-semibold">
              5. Changes to This Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
              You are advised to review this Privacy Policy periodically for any
              changes.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
