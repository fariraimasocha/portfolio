import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

export default function WelcomeEmail() {
    return (
        <Html>
            <Head />
            <Preview>Welcome to my newsletter!</Preview>
            <Tailwind>
                <Body className="bg-white my-12 mx-auto font-sans">
                    <Container className="p-8 rounded-lg shadow-lg">
                        <Heading className="text-2xl font-bold text-gray-900 mb-4">
                            Welcome to my newsletter!
                        </Heading>
                        <Text className="text-gray-700 mb-4">
                            Thank you for subscribing! I'm excited to share updates about my work, projects, and insights with you.
                        </Text>
                        <Text className="text-gray-700 mb-4">
                            You'll receive occasional emails about:
                            • New blog posts and articles
                            • Project updates and launches
                            • Tech insights and tutorials
                            • Special announcements
                        </Text>
                        <Text className="text-gray-700">
                            Best regards,
                            <br />
                            Farirai Masocha
                        </Text>
                        <Text className="text-sm text-gray-500 mt-8">
                            You can unsubscribe at any time by clicking the link in the footer of our emails.
                            <br />
                            <Link href="https://fariraimasocha.com/privacy" className="text-blue-600 underline">
                                Privacy Policy
                            </Link>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
