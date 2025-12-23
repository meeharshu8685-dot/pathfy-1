import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, Brain, CheckCircle } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; points: number }[];
  category: "familiarity" | "experience" | "practical" | "environment";
}

const FIELD_QUESTIONS: Record<string, QuizQuestion[]> = {
  tech: [
    {
      id: "t1",
      question: "How familiar are you with programming fundamentals?",
      category: "familiarity",
      options: [
        { value: "none", label: "Never written code", points: 0 },
        { value: "basic", label: "Completed basic tutorials", points: 20 },
        { value: "intermediate", label: "Built small projects independently", points: 50 },
        { value: "advanced", label: "Contributed to production systems", points: 80 },
      ],
    },
    {
      id: "t2",
      question: "What's your experience with real-world projects?",
      category: "experience",
      options: [
        { value: "none", label: "Only tutorial projects", points: 0 },
        { value: "personal", label: "Personal side projects", points: 25 },
        { value: "internship", label: "Internship or freelance work", points: 55 },
        { value: "professional", label: "Full-time professional experience", points: 85 },
      ],
    },
    {
      id: "t3",
      question: "How do you approach problem-solving in code?",
      category: "practical",
      options: [
        { value: "copy", label: "Copy solutions from Stack Overflow", points: 10 },
        { value: "guided", label: "Follow tutorials step-by-step", points: 25 },
        { value: "adapt", label: "Adapt existing solutions to my needs", points: 50 },
        { value: "design", label: "Design solutions from first principles", points: 80 },
      ],
    },
    {
      id: "t4",
      question: "What learning resources do you have access to?",
      category: "environment",
      options: [
        { value: "free", label: "Only free online resources", points: 20 },
        { value: "courses", label: "Paid courses and books", points: 35 },
        { value: "mentored", label: "Have access to mentors or peers", points: 60 },
        { value: "structured", label: "Structured program or bootcamp", points: 75 },
      ],
    },
    {
      id: "t5",
      question: "How many hours per week can you ACTUALLY dedicate?",
      category: "environment",
      options: [
        { value: "minimal", label: "Less than 5 hours", points: 15 },
        { value: "parttime", label: "5-15 hours", points: 40 },
        { value: "significant", label: "15-30 hours", points: 65 },
        { value: "fulltime", label: "30+ hours", points: 85 },
      ],
    },
  ],
  exams: [
    {
      id: "e1",
      question: "How familiar are you with the exam syllabus?",
      category: "familiarity",
      options: [
        { value: "none", label: "Haven't looked at it yet", points: 0 },
        { value: "aware", label: "Know the topics broadly", points: 25 },
        { value: "studied", label: "Covered 30-60% of syllabus", points: 55 },
        { value: "complete", label: "Covered most of the syllabus", points: 80 },
      ],
    },
    {
      id: "e2",
      question: "Have you attempted practice tests?",
      category: "practical",
      options: [
        { value: "none", label: "Not yet", points: 0 },
        { value: "few", label: "1-3 practice tests", points: 30 },
        { value: "several", label: "4-10 practice tests", points: 55 },
        { value: "many", label: "10+ full-length tests", points: 80 },
      ],
    },
    {
      id: "e3",
      question: "What's your current score range on practice tests?",
      category: "experience",
      options: [
        { value: "below", label: "Below passing threshold", points: 15 },
        { value: "borderline", label: "Near passing threshold", points: 40 },
        { value: "comfortable", label: "Comfortably passing", points: 65 },
        { value: "high", label: "Top percentile range", points: 85 },
      ],
    },
    {
      id: "e4",
      question: "Do you have a structured study plan?",
      category: "environment",
      options: [
        { value: "none", label: "No plan yet", points: 10 },
        { value: "rough", label: "Rough schedule", points: 30 },
        { value: "detailed", label: "Detailed daily plan", points: 55 },
        { value: "coaching", label: "Coaching or structured program", points: 75 },
      ],
    },
    {
      id: "e5",
      question: "How do you handle difficult concepts?",
      category: "practical",
      options: [
        { value: "skip", label: "Skip and hope they don't appear", points: 5 },
        { value: "memorize", label: "Memorize without understanding", points: 20 },
        { value: "resources", label: "Find additional resources", points: 50 },
        { value: "master", label: "Work until I fully understand", points: 80 },
      ],
    },
  ],
  business: [
    {
      id: "b1",
      question: "What's your business experience level?",
      category: "experience",
      options: [
        { value: "none", label: "No business experience", points: 0 },
        { value: "education", label: "Business education only", points: 25 },
        { value: "entry", label: "Entry-level business role", points: 50 },
        { value: "management", label: "Management experience", points: 80 },
      ],
    },
    {
      id: "b2",
      question: "How familiar are you with industry trends?",
      category: "familiarity",
      options: [
        { value: "none", label: "Not following industry news", points: 10 },
        { value: "casual", label: "Occasionally read articles", points: 30 },
        { value: "active", label: "Actively follow industry", points: 55 },
        { value: "expert", label: "Deep industry knowledge", points: 80 },
      ],
    },
    {
      id: "b3",
      question: "What's your network like in this field?",
      category: "environment",
      options: [
        { value: "none", label: "No professional connections", points: 10 },
        { value: "few", label: "A few contacts", points: 30 },
        { value: "growing", label: "Building my network", points: 50 },
        { value: "strong", label: "Strong professional network", points: 75 },
      ],
    },
    {
      id: "b4",
      question: "Have you led any projects or teams?",
      category: "practical",
      options: [
        { value: "none", label: "Never led anything", points: 10 },
        { value: "academic", label: "Academic projects only", points: 30 },
        { value: "small", label: "Small professional projects", points: 55 },
        { value: "significant", label: "Significant leadership experience", points: 80 },
      ],
    },
    {
      id: "b5",
      question: "How do you approach learning new business skills?",
      category: "practical",
      options: [
        { value: "passive", label: "Wait until required", points: 10 },
        { value: "courses", label: "Take courses when needed", points: 35 },
        { value: "proactive", label: "Proactively learn and apply", points: 60 },
        { value: "mentor", label: "Learn from mentors + apply", points: 80 },
      ],
    },
  ],
  sports: [
    {
      id: "s1",
      question: "What's your current training level?",
      category: "experience",
      options: [
        { value: "none", label: "No formal training", points: 0 },
        { value: "recreational", label: "Recreational level", points: 25 },
        { value: "competitive", label: "Competitive amateur", points: 55 },
        { value: "elite", label: "Elite/professional level", points: 85 },
      ],
    },
    {
      id: "s2",
      question: "Do you have access to proper training facilities?",
      category: "environment",
      options: [
        { value: "none", label: "No specific facilities", points: 15 },
        { value: "basic", label: "Basic gym/field access", points: 35 },
        { value: "good", label: "Good training facilities", points: 60 },
        { value: "professional", label: "Professional-grade facilities", points: 80 },
      ],
    },
    {
      id: "s3",
      question: "What coaching support do you have?",
      category: "environment",
      options: [
        { value: "none", label: "Self-coached", points: 15 },
        { value: "online", label: "Online programs only", points: 30 },
        { value: "coach", label: "Have a personal coach", points: 60 },
        { value: "team", label: "Coach + support team", points: 80 },
      ],
    },
    {
      id: "s4",
      question: "How consistent is your training?",
      category: "practical",
      options: [
        { value: "irregular", label: "Very irregular", points: 10 },
        { value: "occasional", label: "2-3 times per week", points: 35 },
        { value: "regular", label: "5-6 times per week", points: 60 },
        { value: "daily", label: "Structured daily training", points: 85 },
      ],
    },
    {
      id: "s5",
      question: "Have you competed at any level?",
      category: "experience",
      options: [
        { value: "none", label: "Never competed", points: 10 },
        { value: "local", label: "Local competitions", points: 35 },
        { value: "regional", label: "Regional/state level", points: 60 },
        { value: "national", label: "National/international", points: 85 },
      ],
    },
  ],
  arts: [
    {
      id: "a1",
      question: "How long have you been practicing your craft?",
      category: "experience",
      options: [
        { value: "beginner", label: "Less than 1 year", points: 15 },
        { value: "learning", label: "1-3 years", points: 35 },
        { value: "developing", label: "3-7 years", points: 60 },
        { value: "experienced", label: "7+ years", points: 85 },
      ],
    },
    {
      id: "a2",
      question: "Have you received formal training?",
      category: "familiarity",
      options: [
        { value: "self", label: "Entirely self-taught", points: 20 },
        { value: "workshops", label: "Workshops and short courses", points: 40 },
        { value: "formal", label: "Formal education/degree", points: 65 },
        { value: "mentored", label: "Mentored by professionals", points: 80 },
      ],
    },
    {
      id: "a3",
      question: "Do you have a portfolio of work?",
      category: "practical",
      options: [
        { value: "none", label: "No portfolio yet", points: 10 },
        { value: "basic", label: "Basic collection of work", points: 35 },
        { value: "curated", label: "Curated portfolio", points: 60 },
        { value: "professional", label: "Professional portfolio with recognition", points: 85 },
      ],
    },
    {
      id: "a4",
      question: "Have you earned income from your art?",
      category: "experience",
      options: [
        { value: "none", label: "Not yet", points: 10 },
        { value: "occasional", label: "Occasional sales/commissions", points: 40 },
        { value: "regular", label: "Regular income source", points: 65 },
        { value: "primary", label: "Primary income source", points: 85 },
      ],
    },
    {
      id: "a5",
      question: "How do you approach creative challenges?",
      category: "practical",
      options: [
        { value: "avoid", label: "Stick to what I know", points: 15 },
        { value: "guided", label: "Follow tutorials and guides", points: 35 },
        { value: "experiment", label: "Experiment and iterate", points: 60 },
        { value: "innovate", label: "Develop unique approaches", points: 85 },
      ],
    },
  ],
  govt: [
    {
      id: "g1",
      question: "How familiar are you with the exam pattern?",
      category: "familiarity",
      options: [
        { value: "none", label: "Haven't researched yet", points: 5 },
        { value: "aware", label: "Know the basic structure", points: 30 },
        { value: "detailed", label: "Detailed understanding", points: 55 },
        { value: "expert", label: "Expert-level preparation", points: 80 },
      ],
    },
    {
      id: "g2",
      question: "Have you appeared for similar exams before?",
      category: "experience",
      options: [
        { value: "none", label: "First attempt", points: 15 },
        { value: "once", label: "One previous attempt", points: 40 },
        { value: "multiple", label: "Multiple attempts", points: 55 },
        { value: "cleared", label: "Cleared preliminary stages", points: 80 },
      ],
    },
    {
      id: "g3",
      question: "What's your current affairs knowledge level?",
      category: "practical",
      options: [
        { value: "weak", label: "Need to start reading news", points: 10 },
        { value: "basic", label: "Read news occasionally", points: 30 },
        { value: "regular", label: "Regular news reader", points: 55 },
        { value: "comprehensive", label: "Comprehensive daily reading", points: 80 },
      ],
    },
    {
      id: "g4",
      question: "Do you have a structured preparation plan?",
      category: "environment",
      options: [
        { value: "none", label: "No plan yet", points: 10 },
        { value: "self", label: "Self-made plan", points: 35 },
        { value: "coaching", label: "Enrolled in coaching", points: 55 },
        { value: "personalized", label: "Personalized mentored plan", points: 75 },
      ],
    },
    {
      id: "g5",
      question: "How many hours daily can you dedicate?",
      category: "environment",
      options: [
        { value: "low", label: "Less than 3 hours", points: 15 },
        { value: "medium", label: "3-6 hours", points: 40 },
        { value: "high", label: "6-10 hours", points: 65 },
        { value: "fulltime", label: "10+ hours (full-time prep)", points: 85 },
      ],
    },
  ],
  other: [
    {
      id: "o1",
      question: "How much experience do you have in this field?",
      category: "experience",
      options: [
        { value: "none", label: "Complete beginner", points: 10 },
        { value: "some", label: "Some exposure", points: 35 },
        { value: "intermediate", label: "Working knowledge", points: 55 },
        { value: "experienced", label: "Significant experience", points: 80 },
      ],
    },
    {
      id: "o2",
      question: "Have you achieved any milestones in this area?",
      category: "practical",
      options: [
        { value: "none", label: "Not yet", points: 10 },
        { value: "small", label: "Small personal wins", points: 35 },
        { value: "notable", label: "Notable achievements", points: 60 },
        { value: "significant", label: "Significant recognition", points: 85 },
      ],
    },
    {
      id: "o3",
      question: "What resources do you have access to?",
      category: "environment",
      options: [
        { value: "limited", label: "Very limited resources", points: 15 },
        { value: "basic", label: "Basic resources available", points: 35 },
        { value: "good", label: "Good resources and support", points: 60 },
        { value: "excellent", label: "Excellent resources and mentors", points: 80 },
      ],
    },
    {
      id: "o4",
      question: "How structured is your learning approach?",
      category: "practical",
      options: [
        { value: "random", label: "Learning randomly", points: 10 },
        { value: "somewhat", label: "Somewhat structured", points: 35 },
        { value: "organized", label: "Well-organized approach", points: 60 },
        { value: "systematic", label: "Systematic with clear milestones", points: 80 },
      ],
    },
    {
      id: "o5",
      question: "What's your support system like?",
      category: "environment",
      options: [
        { value: "none", label: "Working alone", points: 15 },
        { value: "peers", label: "Supportive peers", points: 35 },
        { value: "mentor", label: "Have a mentor", points: 60 },
        { value: "network", label: "Strong professional network", points: 80 },
      ],
    },
  ],
};

interface AdaptiveQuizProps {
  field: string;
  onComplete: (results: QuizResults) => void;
  onSkip: () => void;
}

export interface QuizResults {
  answers: Record<string, string>;
  totalScore: number;
  calibratedLevel: "beginner" | "intermediate" | "advanced";
  categoryScores: Record<string, number>;
  confidence: number;
}

export function AdaptiveQuiz({ field, onComplete, onSkip }: AdaptiveQuizProps) {
  const questions = FIELD_QUESTIONS[field] || FIELD_QUESTIONS.other;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const handleNext = useCallback(() => {
    if (!selectedAnswer) return;

    const newAnswers = { ...answers, [currentQuestion.id]: selectedAnswer };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer("");
    } else {
      // Calculate final results
      const categoryScores: Record<string, number[]> = {};
      let totalPoints = 0;

      questions.forEach((q) => {
        const answer = newAnswers[q.id];
        const option = q.options.find((o) => o.value === answer);
        const points = option?.points || 0;
        totalPoints += points;

        if (!categoryScores[q.category]) {
          categoryScores[q.category] = [];
        }
        categoryScores[q.category].push(points);
      });

      const avgScore = totalPoints / questions.length;
      
      // Apply 12% safety downgrade to prevent overconfidence
      const adjustedScore = avgScore * 0.88;
      
      // Calculate category averages
      const categoryAverages: Record<string, number> = {};
      Object.entries(categoryScores).forEach(([cat, scores]) => {
        categoryAverages[cat] = scores.reduce((a, b) => a + b, 0) / scores.length;
      });

      // Determine calibrated level
      let calibratedLevel: "beginner" | "intermediate" | "advanced";
      if (adjustedScore < 35) {
        calibratedLevel = "beginner";
      } else if (adjustedScore < 60) {
        calibratedLevel = "intermediate";
      } else {
        calibratedLevel = "advanced";
      }

      // Confidence based on answer consistency
      const scoreVariance = questions.reduce((acc, q) => {
        const option = q.options.find((o) => o.value === newAnswers[q.id]);
        return acc + Math.pow((option?.points || 0) - avgScore, 2);
      }, 0) / questions.length;
      const confidence = Math.max(60, 100 - Math.sqrt(scoreVariance));

      onComplete({
        answers: newAnswers,
        totalScore: adjustedScore,
        calibratedLevel,
        categoryScores: categoryAverages,
        confidence: Math.round(confidence),
      });
    }
  }, [selectedAnswer, answers, currentIndex, currentQuestion, questions, onComplete]);

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Skill Calibration Quiz</CardTitle>
          </div>
          <span className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2 mt-3" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-base font-medium">{currentQuestion.question}</p>
          
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedAnswer === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedAnswer(option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label
                  htmlFor={option.value}
                  className="flex-1 cursor-pointer text-sm"
                >
                  {option.label}
                </Label>
                {selectedAnswer === option.value && (
                  <CheckCircle className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
            Skip Quiz
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="gap-2"
          >
            {currentIndex < questions.length - 1 ? "Next" : "Complete"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          This quiz helps calibrate your actual skill level for more accurate planning.
          Your answers are kept confidential.
        </p>
      </CardContent>
    </Card>
  );
}
