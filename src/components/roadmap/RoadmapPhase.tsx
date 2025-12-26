import { Target, Clock, BookOpen, Hammer, CheckCircle2, Edit2, Check, X, Plus, Trash2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RoadmapPhaseProps {
  phaseNumber: number;
  phaseName: string;
  goal: string;
  timeEstimate: string;
  whatToLearn: string[];
  whatToDo: string[];
  outcome: string;
  mentorNote?: string;
  isEditable?: boolean;
  onUpdate?: (updatedPhase: any) => void;
}

export function RoadmapPhase({
  phaseNumber,
  phaseName: initialPhaseName,
  goal: initialGoal,
  timeEstimate: initialTimeEstimate,
  whatToLearn: initialWhatToLearn,
  whatToDo: initialWhatToDo,
  outcome: initialOutcome,
  mentorNote,
  isEditable = true,
  onUpdate,
}: RoadmapPhaseProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPhase, setEditedPhase] = useState({
    phaseNumber,
    phaseName: initialPhaseName,
    goal: initialGoal,
    timeEstimate: initialTimeEstimate,
    whatToLearn: initialWhatToLearn,
    whatToDo: initialWhatToDo,
    outcome: initialOutcome,
  });

  const handleSave = () => {
    onUpdate?.(editedPhase);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPhase({
      phaseNumber,
      phaseName: initialPhaseName,
      goal: initialGoal,
      timeEstimate: initialTimeEstimate,
      whatToLearn: initialWhatToLearn,
      whatToDo: initialWhatToDo,
      outcome: initialOutcome,
    });
    setIsEditing(false);
  };

  const updateList = (field: 'whatToLearn' | 'whatToDo', index: number, value: string) => {
    const newList = [...editedPhase[field]];
    newList[index] = value;
    setEditedPhase({ ...editedPhase, [field]: newList });
  };

  const addListItem = (field: 'whatToLearn' | 'whatToDo') => {
    setEditedPhase({ ...editedPhase, [field]: [...editedPhase[field], ""] });
  };

  const removeListItem = (field: 'whatToLearn' | 'whatToDo', index: number) => {
    const newList = editedPhase[field].filter((_, i) => i !== index);
    setEditedPhase({ ...editedPhase, [field]: newList });
  };

  if (isEditing) {
    return (
      <div className="p-6 rounded-xl bg-card border border-primary shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold">
            {phaseNumber}
          </div>
          <Input
            value={editedPhase.phaseName}
            onChange={(e) => setEditedPhase({ ...editedPhase, phaseName: e.target.value })}
            className="font-semibold text-lg"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-primary uppercase mb-1 block">Goal</label>
            <Textarea
              value={editedPhase.goal}
              onChange={(e) => setEditedPhase({ ...editedPhase, goal: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-amber-500 uppercase mb-1 block">Time Estimate</label>
            <Input
              value={editedPhase.timeEstimate}
              onChange={(e) => setEditedPhase({ ...editedPhase, timeEstimate: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-blue-500 uppercase mb-1 block">What to Learn</label>
            <div className="space-y-2">
              {editedPhase.whatToLearn.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={item} onChange={(e) => updateList('whatToLearn', i, e.target.value)} />
                  <Button variant="ghost" size="icon" onClick={() => removeListItem('whatToLearn', i)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addListItem('whatToLearn')} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-orange-500 uppercase mb-1 block">What to DO</label>
            <div className="space-y-2">
              {editedPhase.whatToDo.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={item} onChange={(e) => updateList('whatToDo', i, e.target.value)} />
                  <Button variant="ghost" size="icon" onClick={() => removeListItem('whatToDo', i)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addListItem('whatToDo')} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-success uppercase mb-1 block">Outcome</label>
            <Input
              value={editedPhase.outcome}
              onChange={(e) => setEditedPhase({ ...editedPhase, outcome: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={handleSave} className="flex-1">
            <Check className="w-4 h-4 mr-2" /> Save Changes
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-card border border-border relative group">
      {isEditable && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold">
          {phaseNumber}
        </div>
        <h3 className="text-lg font-semibold">
          Phase {phaseNumber} — {initialPhaseName}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Goal */}
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-primary">Goal</span>
            <p className="text-sm text-muted-foreground">{initialGoal}</p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-amber-500">Time</span>
            <p className="text-sm text-muted-foreground">{initialTimeEstimate}</p>
          </div>
        </div>

        {/* What to Learn */}
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-medium text-blue-500">What to learn</span>
            <ul className="mt-1 space-y-1">
              {initialWhatToLearn.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-muted-foreground/50">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* What to Do */}
        <div className="flex items-start gap-3">
          <Hammer className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-medium text-orange-500">What to DO (important)</span>
            <ul className="mt-1 space-y-1">
              {initialWhatToDo.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-muted-foreground/50">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Outcome */}
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-success">Outcome</span>
            <p className="text-sm text-muted-foreground">{initialOutcome}</p>
          </div>
        </div>

        {/* Mentor Note */}
        {mentorNote && (
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground italic">"{mentorNote}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
