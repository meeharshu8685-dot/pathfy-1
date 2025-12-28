import { HelpCircle, MessageCircle, Mail } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "Is this a coaching platform?",
    answer:
      "No. We provide structured guidance and planning tools — not teaching, tutoring, or coaching. Think of it as a thinking partner, not a teacher.",
  },
  {
    question: "Are results guaranteed?",
    answer:
      "No. Your outcomes depend on your effort, circumstances, and decisions. We help you plan better, but success is always yours to earn.",
  },
  {
    question: "Can I change my goal later?",
    answer:
      "Yes, anytime. Go to your Profile → Settings and tap 'Change Goal.' Your account stays intact.",
  },
  {
    question: "How accurate are the timelines?",
    answer:
      "They're estimates based on common patterns and your inputs. Real timelines vary based on effort, consistency, and personal pace.",
  },
  {
    question: "What if my situation changes?",
    answer:
      "Just update your profile — available hours, commitment type, or study time. Your roadmap will stay, and you can reset it anytime.",
  },
  {
    question: "Do I need to use this daily?",
    answer:
      "Not required. Use it when you need clarity. Some check in daily, others weekly. There's no pressure.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. We don't share or sell your data. You can delete your account anytime from Settings.",
  },
  {
    question: "How can I stay updated?",
    answer: (
      <span>
        Follow us on Instagram for tips, updates, and more: {" "}
        <a
          href="https://www.instagram.com/pathfy.online"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          pathfy.online
        </a>
      </span>
    ),
  },
];

const Help = () => {
  const handleFeedback = () => {
    window.location.href =
      "mailto:meeharshu8685@gmail.com?subject=Pathfy Feedback";
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Help / FAQ
            </h1>
            <p className="text-muted-foreground">
              Quick answers to common questions. If you need more, we're here.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="glass-card p-6 md:p-8 mb-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>


        </div>
      </div>
    </Layout>
  );
};

export default Help;
