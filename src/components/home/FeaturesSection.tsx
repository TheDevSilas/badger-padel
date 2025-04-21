import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-[#f5f5f7] text-center">
      <h2 className="text-5xl font-semibold tracking-tight mb-1">
        Powerful Features
      </h2>
      <h3 className="text-2xl font-medium text-gray-500 mb-4">
        Everything you need to build modern web applications
      </h3>
      <div className="flex justify-center space-x-6 text-xl text-blue-600">
        <Link to="/" className="flex items-center hover:underline">
          Explore features <ChevronRight className="h-4 w-4" />
        </Link>
        <Link to="/" className="flex items-center hover:underline">
          View documentation <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-8 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h4 className="text-xl font-medium mb-2">Lightning Fast</h4>
          <p className="text-gray-500">
            Built with performance in mind for the best developer and user
            experience.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
          <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          </div>
          <h4 className="text-xl font-medium mb-2">Modern Stack</h4>
          <p className="text-gray-500">
            Uses React, Supabase, and other modern tools to build robust
            applications.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <h4 className="text-xl font-medium mb-2">Beautiful UI</h4>
          <p className="text-gray-500">
            Comes with a set of beautiful, responsive components ready to use.
          </p>
        </div>
      </div>
    </section>
  );
}
