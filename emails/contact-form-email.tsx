import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

interface ContactFormEmailProps {
  name: string
  email: string
  message: string
}

export default function ContactFormEmail({
  name,
  email,
  message,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact from {name}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 my-12 mx-auto font-sans">
          <Container className="bg-white p-8 rounded-lg shadow-lg max-w-xl">
            <Heading className="text-2xl font-bold text-gray-900 mb-4">
              New Contact Form Submission
            </Heading>
            <Text className="text-gray-700">
              <strong>From:</strong> {name}
            </Text>
            <Text className="text-gray-700">
              <strong>Email:</strong> {email}
            </Text>
            <Hr className="my-4 border-gray-200" />
            <Text className="text-gray-700 font-semibold">Message:</Text>
            <Text className="text-gray-700 whitespace-pre-wrap">{message}</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
