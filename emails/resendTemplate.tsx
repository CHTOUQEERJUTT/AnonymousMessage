import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface MagicCodeEmailProps {
  username: string;
  otp: string;
}

const MagicCodeEmail = ({ username, otp }: MagicCodeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Mystery Message Verification Code</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={company}>Mystery Message</Text>
          <Heading style={greeting}>Hello {username},</Heading>
          <Text style={codeDescription}>
            Enter the verification code below to confirm your email address. This code will expire in 15 minutes.
          </Text>
          <Section style={codeContainer}>
            <Heading style={codeStyle}>{otp}</Heading>
          </Section>
          <Text style={paragraph}>
            If you didn’t request this email, please ignore it or contact us at{" "}
            <Link href="mailto:support@mysterymessage.com" style={link}>
              support@mysterymessage.com
            </Link>.
          </Text>
          <Section style={buttonContainer}>
            <Button
              href="https://www.mysterymessage.com/verify"
              style={button}
            >
              Verify Email
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default MagicCodeEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "Helvetica, Arial, sans-serif",
  textAlign: "center" as const,
  padding: "20px",
};

const container = {
  backgroundColor: "#f9f9f9",
  border: "1px solid #ddd",
  borderRadius: "8px",
  margin: "0 auto",
  padding: "20px",
  width: "480px",
  maxWidth: "100%",
};

const company = {
  fontWeight: "bold",
  fontSize: "24px",
  textAlign: "center" as const,
  marginBottom: "20px",
};

const greeting = {
  fontSize: "20px",
  marginBottom: "10px",
  textAlign: "center" as const,
};

const codeDescription = {
  fontSize: "16px",
  marginBottom: "20px",
  textAlign: "center" as const,
};

const codeContainer = {
  background: "#f0f0f0",
  borderRadius: "8px",
  padding: "10px",
  margin: "20px auto",
  width: "fit-content",
};

const codeStyle = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#333",
  textAlign: "center" as const,
  letterSpacing: "4px",
};

const paragraph = {
  fontSize: "14px",
  color: "#555",
  margin: "20px 0",
  textAlign: "center" as const,
};

const buttonContainer = {
  margin: "30px auto",
};

const button = {
  backgroundColor: "#007BFF",
  borderRadius: "4px",
  color: "#fff",
  padding: "12px 24px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
};

const link = {
  color: "#007BFF",
  textDecoration: "underline",
};
