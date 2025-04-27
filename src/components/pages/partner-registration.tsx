import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, User } from "lucide-react";

export default function PartnerRegistrationPage() {
  return (
    <div className="min-h-screen bg-white pt-12 pb-10 px-4 sm:pt-20">
      <div className="relative bg-white rounded-2xl shadow-sm w-full max-w-4xl mx-auto p-6 sm:p-8">
        <Link to="/">
          <Button
            variant="ghost"
            className="absolute left-4 top-4 p-2 h-auto flex items-center text-gray-600 hover:text-black hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Button>
        </Link>

        <div className="text-center mb-6 pt-10">
          <img
            src="/images/White Badger Logo.PNG"
            alt="Badger Padel Logo"
            className="h-32 w-auto mx-auto mb-4"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">
          Partner With Us
        </h1>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Benefits of Becoming a Partner
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-lg mb-2">Increased Exposure</h3>
              <p className="text-gray-600">
                Gain visibility among our growing community of padel enthusiasts
                across South Africa.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-lg mb-2">Targeted Audience</h3>
              <p className="text-gray-600">
                Connect directly with passionate padel players looking for
                quality products and services.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-lg mb-2">Community Support</h3>
              <p className="text-gray-600">
                Be recognized as a supporter of the growing padel community in
                South Africa.
              </p>
            </div>
          </div>

          <div className="bg-black text-white p-8 rounded-xl mb-10">
            <h2 className="text-xl font-semibold mb-4 text-center">
              How It Works
            </h2>
            <p className="mb-4 text-center">
              Partners offer exclusive discounts & benefits to Badger Padel
              members, and in return, receive promotion through our platform,
              social media and events.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl text-center">
            <h2 className="text-xl font-semibold mb-4">
              Interested in Becoming a Partner?
            </h2>
            <p className="mb-6">
              To become a Badger Padel partner, please contact our owner
              directly:
            </p>

            <div className="inline-block text-left mx-auto">
              <div className="flex items-center mb-3">
                <User className="h-5 w-5 mr-3 text-gray-700" />
                <span className="font-medium">Silvino Da Silva</span>
              </div>

              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-gray-700" />
                <a
                  href="mailto:info@badgerpadel.co.za"
                  className="text-blue-600 hover:underline"
                >
                  info@badgerpadel.co.za
                </a>
              </div>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              We'll review your partnership request and get back to you promptly
              to discuss the details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
