import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useRoadmaps, MentorRoadmap } from "@/hooks/useRoadmaps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Map,
    Search,
    Star,
    Trash2,
    Download,
    ExternalLink,
    Calendar,
    Clock,
    MoreVertical
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoadmapPDFExport } from "@/components/roadmap/RoadmapPDFExport";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";

export default function RoadmapHistory() {
    const navigate = useNavigate();
    const { roadmaps, isLoading, toggleFavorite, deleteRoadmap } = useRoadmaps(null, true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const filteredRoadmaps = roadmaps.filter((roadmap) => {
        const matchesSearch = roadmap.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFavorite = showFavoritesOnly ? roadmap.is_favorite : true;
        return matchesSearch && matchesFavorite;
    });

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this roadmap? This action cannot be undone.")) {
            try {
                await deleteRoadmap.mutateAsync(id);
                toast({ title: "Roadmap deleted" });
            } catch (error) {
                toast({ title: "Failed to delete roadmap", variant: "destructive" });
            }
        }
    };

    const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
        try {
            await toggleFavorite.mutateAsync({ id, isFavorite: !currentStatus });
            toast({ title: currentStatus ? "Removed from favorites" : "Added to favorites" });
        } catch (error) {
            toast({ title: "Failed to update favorite", variant: "destructive" });
        }
    };

    return (
        <Layout>
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Roadmap History</h1>
                            <p className="text-muted-foreground">
                                Manage your saved execution plans and learning paths.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search roadmaps..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Button
                                variant={showFavoritesOnly ? "default" : "outline"}
                                size="icon"
                                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                                title={showFavoritesOnly ? "Show All" : "Show Favorites Only"}
                            >
                                <Star className={`w-4 h-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-48 rounded-xl bg-card border border-border animate-pulse" />
                            ))}
                        </div>
                    ) : filteredRoadmaps.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRoadmaps.map((roadmap) => (
                                <div
                                    key={roadmap.id}
                                    className="group relative p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-secondary p-2 rounded-lg">
                                            <Map className="w-5 h-5 text-primary" />
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/roadmap?goalId=${roadmap.goal_id}`)}>
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    Open
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleToggleFavorite(roadmap.id!, !!roadmap.is_favorite)}>
                                                    <Star className={`w-4 h-4 mr-2 ${roadmap.is_favorite ? "fill-current" : ""}`} />
                                                    {roadmap.is_favorite ? "Unfavorite" : "Favorite"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(roadmap.id!)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                                        {roadmap.title}
                                    </h3>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {roadmap.phases.length} phases
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {roadmap.created_at && formatDistanceToNow(new Date(roadmap.created_at), { addSuffix: true })}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            className="flex-1"
                                            variant="outline"
                                            onClick={() => navigate(`/roadmap?goalId=${roadmap.goal_id}`)}
                                        >
                                            View Plan
                                        </Button>
                                        {/* Reuse existing export component but styled as icon button if possible, or just button */}
                                        <RoadmapPDFExport
                                            goalTitle={roadmap.title}
                                            duration={`${roadmap.phases.length * 4} weeks`} // Approximate
                                            hoursPerWeek={10} // Default if missing
                                            phases={roadmap.phases}
                                            whatToIgnore={roadmap.whatToIgnore}
                                            finalRealityCheck={roadmap.finalRealityCheck}
                                            closingMotivation={roadmap.closingMotivation}
                                        />
                                    </div>

                                    {roadmap.is_favorite && (
                                        <div className="absolute top-6 right-12">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-border">
                            <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Map className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-medium mb-2">No roadmaps found</h3>
                            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                {searchQuery
                                    ? "Try adjusting your search terms"
                                    : "You haven't generated any roadmaps yet. Start by creating an execution plan for your goals."}
                            </p>
                            {!searchQuery && (
                                <Button onClick={() => navigate("/dashboard")}>
                                    Go to Dashboard
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
