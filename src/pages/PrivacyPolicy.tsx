import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, Users, Cookie, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <a href="/" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
          <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert max-w-none"
        >
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 space-y-6">
            <p className="text-gray-400 text-sm">Last updated: April 2026</p>

            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-orange-400" />
                1. Introduction
              </h2>
              <p className="text-gray-400 leading-relaxed">
                FunReelRWA ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform (the "Platform"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-orange-400" />
                2. Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">2.1 Personal Information</h3>
                  <ul className="text-gray-400 leading-relaxed list-disc list-inside space-y-1">
                    <li>Name and email address</li>
                    <li>Phone number</li>
                    <li>Wallet address (cryptocurrency)</li>
                    <li>Profile information and preferences</li>
                    <li>Communication records when you contact us</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">2.2 Automatically Collected Information</h3>
                  <ul className="text-gray-400 leading-relaxed list-disc list-inside space-y-1">
                    <li>Device information (browser type, operating system)</li>
                    <li>IP address and location data</li>
                    <li>Access times and referring URLs</li>
                    <li>Pages viewed and interactions</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-orange-400" />
                3. How We Use Your Information
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="text-gray-400 leading-relaxed list-disc list-inside space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Send administrative information, such as updates and security alerts</li>
                <li>Respond to your comments, questions, and provide customer service</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-orange-400" />
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                We may share your information in the following situations:
              </p>
              <ul className="text-gray-400 leading-relaxed list-disc list-inside space-y-1">
                <li><strong className="text-white">Service Providers:</strong> With third parties who assist in our operations</li>
                <li><strong className="text-white">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li><strong className="text-white">Legal Compliance:</strong> When required by law or in response to valid requests</li>
                <li><strong className="text-white">Protect Rights:</strong> To enforce our terms and protect user safety</li>
              </ul>
              <p className="text-gray-400 leading-relaxed mt-4">
                We do not sell, trade, or rent your personal information to third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Cookie className="w-5 h-5 text-orange-400" />
                5. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to track activity on our Platform and hold certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Types of cookies we use: Essential cookies (required for operation), Analytics cookies (to analyze usage), Functional cookies (to remember your preferences).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-orange-400" />
                6. Data Security
              </h2>
              <p className="text-gray-400 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-orange-400" />
                7. Your Rights
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="text-gray-400 leading-relaxed list-disc list-inside space-y-1">
                <li>Right to access your personal information</li>
                <li>Right to correct inaccurate data</li>
                <li>Right to request deletion of your data</li>
                <li>Right to object to processing</li>
                <li>Right to data portability</li>
                <li>Right to withdraw consent</li>
              </ul>
              <p className="text-gray-400 leading-relaxed mt-4">
                To exercise these rights, please contact us at the email address provided below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-orange-400" />
                8. Third-Party Links
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Our Platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read the privacy policies of any third-party websites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-orange-400" />
                9. Children's Privacy
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Our Platform is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-orange-400" />
                10. Contact Us
              </h2>
              <p className="text-gray-400 leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-orange-400 mt-2">support@funreelrwa.com</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-orange-400" />
                11. Changes to This Policy
              </h2>
              <p className="text-gray-400 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. You should review this page periodically for any changes.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}