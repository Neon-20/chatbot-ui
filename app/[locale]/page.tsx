"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="m-4 flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-3xl bg-white shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-4">
          <div className="flex flex-col items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AID_Logo_Color_Transparent_300-9kVqv1p2VfsFnM9XkWRyuzkM8zoeby.png"
              alt="AID Work CoPilot Logo"
              width={150}
              height={150}
              className="size-auto"
            />
            <span className="mt-2 text-sm text-gray-500">v2.0</span>
          </div>
          <h2 className="text-center text-3xl font-bold">
            {"Let's transform the way we work together!"}
          </h2>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-lg text-gray-600">
            Experience the power of our <i>Internal ChatGPT</i> your AI-driven
            assistant designed to enhance productivity and streamline your
            workday.
          </p>
          <div className="text-left">
            <h3 className="mb-4 text-xl font-semibold">Key Benefits:</h3>
            <ul className="space-y-4 text-gray-600">
              {[
                "<strong>Boosted Efficiency:</strong> Achieve tasks faster by streamlining email writing, development, content creation, and documentation with our AI tools.",
                "<strong>Instant Access to Information:</strong> Get answers and insights right at your fingertips.",
                "<strong>Enhanced Job Satisfaction:</strong> Enjoy a more fulfilling work experience with supportive tools.",
                "<strong>Data Privacy Assurance:</strong> Your data remains confidential and secure; we never use it for training purposes."
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 size-5 shrink-0 text-green-500" />
                  <span dangerouslySetInnerHTML={{ __html: benefit }} />
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-8">
          <Link href="/login">
            <Button className="flex w-full max-w-md items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-lg font-semibold text-white transition-colors duration-200 hover:bg-red-700">
              Get started
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </Link>
          <div className="flex flex-col items-center space-y-2 text-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/team-pic-z0Wb9MlfRbQ98s6SqBixLHEM8huQjK.JPG"
              alt="AI - Automation & Cloud Engineering Team"
              width={300}
              height={50}
              className="size-auto rounded-full"
            />
            <p className="max-w-[300px] text-xs text-gray-500">
              Driven and Maintained by the AI - Automation & Cloud Engineering
              Team at AD
            </p>
          </div>
        </CardFooter>
      </Card>
      <footer className="mt-8 text-center text-xs text-gray-500">
        Alter Domus, AiD © Copyright 2024. All rights reserved.
      </footer>
    </div>
  )
}
