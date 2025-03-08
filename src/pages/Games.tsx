import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Trophy, Users, Brain } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Games = () => {
  const { toast } = useToast();

  const handleGameClick = () => {
    toast({
      title: "Coming Soon",
      description: "Games will be available in the next update!",
    });
  };

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Games</h1>
      
      <div className="grid gap-4">
        <Card className="p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <Brain className="text-primary" />
            Language Games
          </h2>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleGameClick}
            >
              Word Match
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleGameClick}
            >
              Vocabulary Quiz
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleGameClick}
            >
              Sentence Builder
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <Gamepad2 className="text-primary" />
            Cultural Games
          </h2>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleGameClick}
            >
              Cultural Trivia
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleGameClick}
            >
              Tradition Match
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleGameClick}
            >
              Festival Quiz
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <Trophy className="text-primary" />
            Achievements
          </h2>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleGameClick}
            >
              My Trophies
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleGameClick}
            >
              Leaderboard
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleGameClick}
            >
              Daily Challenges
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <Users className="text-primary" />
            Multiplayer
          </h2>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleGameClick}
            >
              Language Exchange
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleGameClick}
            >
              Cultural Quiz Battle
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleGameClick}
            >
              Team Challenges
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Games;