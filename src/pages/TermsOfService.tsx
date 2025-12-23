import { Layout } from "@/components/layout/Layout";
import { FileText } from "lucide-react";

const TermsOfService = () => {
  return (
    <Layout>
      <div className="min-h-screen py-16 px-4">
        <div className="container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-12 space-y-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <FileText className="h-6 w-6" />
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                Terms of Use
              </h1>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              By accessing or using this platform, you agree to the following terms.
            </p>

            <div className="space-y-8 text-muted-foreground leading-relaxed">
              {/* Section 1 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">1. Purpose of the Platform</h2>
                <p>
                  This platform provides general guidance, structured insights, and planning tools 
                  to help users make informed learning and career-related decisions.
                </p>
                <p className="font-medium text-foreground">
                  It does not guarantee outcomes, selections, admissions, employment, or results.
                </p>
              </section>

              {/* Section 2 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">2. User Responsibilities</h2>
                <p>By using this platform, you agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Provide accurate information to the best of your knowledge</li>
                  <li>Use the platform for personal, lawful purposes only</li>
                  <li>Not misuse, copy, or attempt to reverse-engineer the platform</li>
                </ul>
                <p className="font-medium text-foreground mt-2">
                  You are responsible for your own decisions, preparation, and actions.
                </p>
              </section>

              {/* Section 3 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">3. No Professional or Official Advice</h2>
                <p>The content and guidance provided:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Do not replace official coaching, counselling, or professional advice</li>
                  <li>Are not affiliated with any examination authority, institution, or employer</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">4. Account Usage</h2>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Each account is intended for individual use only</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                </ul>
                <p className="mt-2">
                  We reserve the right to suspend or restrict accounts that misuse the platform.
                </p>
              </section>

              {/* Section 5 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">5. Content Ownership</h2>
                <p>
                  All content, structure, and materials on this platform are the intellectual 
                  property of the platform unless otherwise stated.
                </p>
                <p className="font-medium text-foreground">
                  You may not copy, distribute, or reproduce content without permission.
                </p>
              </section>

              {/* Section 6 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">6. Platform Availability</h2>
                <p>
                  We aim to keep the platform available and accurate, but we do not guarantee 
                  uninterrupted access or error-free operation.
                </p>
                <p>
                  Features may be updated, modified, or removed to improve the platform.
                </p>
              </section>

              {/* Section 7 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">7. Termination</h2>
                <p>
                  We reserve the right to suspend or terminate access if these terms are violated.
                </p>
              </section>

              {/* Section 8 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">8. Updates to Terms</h2>
                <p>
                  These terms may be updated from time to time. Continued use of the platform 
                  implies acceptance of the updated terms.
                </p>
              </section>

              {/* Section 9 */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">9. Contact</h2>
                <p>
                  For questions regarding these terms, contact us at:{" "}
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

export default TermsOfService;
