import { Layout } from "@/components/layout/Layout";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="min-h-screen py-16 px-4">
        <div className="container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-12 space-y-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Shield className="h-6 w-6" />
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                Privacy Policy
              </h1>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              We respect your privacy and are committed to protecting your personal information.
            </p>

            <div className="space-y-8 text-muted-foreground leading-relaxed">
              {/* Section 1 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
                <p>We may collect the following information when you use the platform:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Name or display name</li>
                  <li>Email address (for account access)</li>
                  <li>Educational background and goals (as provided by you)</li>
                  <li>Time availability and preferences</li>
                  <li>Usage data related to features you use (for improving guidance)</li>
                </ul>
                <p className="mt-4">We do not collect sensitive personal information such as:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Government ID numbers</li>
                  <li>Financial details</li>
                  <li>Family or income information</li>
                </ul>
              </section>

              {/* Section 2 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
                <p>Your data is used only to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Personalize guidance and recommendations</li>
                  <li>Improve accuracy of roadmaps and suggestions</li>
                  <li>Maintain your account and progress history</li>
                </ul>
                <p className="font-medium text-foreground mt-2">
                  We do not sell, rent, or trade your personal data to third parties.
                </p>
              </section>

              {/* Section 3 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">3. Data Storage and Security</h2>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Your data is stored securely using industry-standard practices</li>
                  <li>Access is restricted to authorized systems only</li>
                  <li>While no system is 100% secure, we take reasonable steps to protect your information</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">4. Third-Party Services</h2>
                <p>We may use trusted third-party tools for:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Authentication</li>
                  <li>Analytics</li>
                  <li>Performance monitoring</li>
                </ul>
                <p>These services are used strictly for platform functionality and improvement.</p>
              </section>

              {/* Section 5 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">5. Your Control Over Data</h2>
                <p>You can:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Edit your profile information</li>
                  <li>Update or reset your goals</li>
                  <li>Request deletion of your account and data</li>
                </ul>
                <p className="mt-2">
                  To request data deletion, contact us at:{" "}
                  <a href="mailto:Pathfy8685@Gmail.com" className="text-primary hover:underline">
                    Pathfy8685@Gmail.com
                  </a>
                </p>
              </section>

              {/* Section 6 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">6. Changes to This Policy</h2>
                <p>
                  We may update this policy occasionally. Any major changes will be communicated 
                  clearly on the platform.
                </p>
              </section>

              {/* Section 7 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">7. Contact</h2>
                <p>
                  If you have questions or concerns about privacy, contact us at:{" "}
                  <a href="mailto:meeharshu8685@gmail.com" className="text-primary hover:underline">
                    meeharshu8685@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
