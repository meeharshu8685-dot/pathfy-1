import { Layout } from "@/components/layout/Layout";
import { AlertTriangle } from "lucide-react";

const Disclaimer = () => {
  return (
    <Layout>
      <div className="min-h-screen py-16 px-4">
        <div className="container max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-12 space-y-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <AlertTriangle className="h-6 w-6" />
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                Disclaimer
              </h1>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                This platform is designed to provide general guidance and structured 
                insights to help students and early-career individuals make informed 
                decisions about their learning and career paths.
              </p>

              <p>
                The suggestions, roadmaps, timelines, and comparisons shown are based 
                on common patterns, publicly available information, and the inputs 
                provided by the user. <strong className="text-foreground">They are not 
                guarantees of success, selection, admission, employment, or results.</strong>
              </p>

              <p>
                This platform is not affiliated with any government body, examination 
                authority, university, or employer, and does not replace official 
                coaching, counselling, or professional advice.
              </p>

              <p className="text-foreground font-medium">
                Final decisions, preparation strategies, and outcomes remain the sole 
                responsibility of the user.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Disclaimer;
