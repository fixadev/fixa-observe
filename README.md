[![Fixa Logo](/.github/assets/logo.png)](https://fixa.dev)

<h3 align="center">
  <a href="https://docs.fixa.dev">📘 Docs</a>
  | <a href="https://fixa.dev/">☁️ Cloud Platform</a>
  | <a href="https://demo.fixa.dev/">✨ Demo</a>
  | <a href="https://discord.fixa.dev">🎮 Discord</a>
</h4>

# Fixa: Open-source Testing Platform for Voice & SMS Applications

Fixa is a comprehensive testing platform designed for voice and SMS applications. It enables developers to automate testing of their communication systems with real phone calls and messages, ensuring reliability at scale.

Get started in minutes and access powerful testing features as your needs grow. Our cloud platform makes it easy to begin, while maintaining the flexibility to self-host when needed.

<div align="center">
<img alt="Fixa Dashboard" src=".github/assets/dashboard.gif" width="400" />
</div>

## ✨ Features

|                                                                                                                                                                                       |                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------: |
| <h3>Real Phone Testing</h3> Test your voice applications with actual phone calls, not just simulations. Verify IVR flows, voice quality, and call routing with real-world conditions. | <img alt="Phone Testing" src=".github/assets/phone-testing.png" width="250px"> |
| <h3>SMS Verification</h3> Automate SMS testing workflows, verify message delivery, content accuracy, and timing across different carriers and regions.                                |   <img alt="SMS Testing" src=".github/assets/sms-testing.png" width="250px">   |
| <h3>Test Recording & Playback</h3> Record test sessions for debugging and quality assurance. Review calls with detailed analytics and transcriptions.                                 |     <img alt="Recording" src=".github/assets/recording.png" width="250px">     |
| <h3>Automated Test Suites</h3> Create and manage comprehensive test suites. Schedule recurring tests and integrate with CI/CD pipelines.                                              |   <img alt="Test Suites" src=".github/assets/test-suites.png" width="250px">   |
| <h3>Real-time Analytics</h3> Monitor test results, performance metrics, and system health in real-time through an intuitive dashboard.                                                |     <img alt="Analytics" src=".github/assets/analytics.png" width="250px">     |
| <h3>API Integration</h3> RESTful API for seamless integration with your existing tools and workflows. Supports major programming languages and frameworks.                            |           <img alt="API" src=".github/assets/api.png" width="250px">           |

## 📦 Installation & Setup

1. Create an account at [fixa.dev](https://fixa.dev)
2. Install the Fixa SDK:
   ```bash
   npm install @fixa/sdk
   # or
   yarn add @fixa/sdk
   ```
3. Configure your API key:

   ```typescript
   import { FixaClient } from "@fixa/sdk";

   const fixa = new FixaClient({
     apiKey: "your_api_key_here",
   });
   ```

4. Start testing:
   ```typescript
   await fixa.test.create({
     name: "My First Test",
     type: "voice",
     phoneNumber: "+1234567890",
   });
   ```

For detailed setup instructions and examples, visit our [documentation](https://docs.fixa.dev).
