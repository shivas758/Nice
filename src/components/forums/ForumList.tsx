import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Forum } from "@/types/forum";

interface ForumListProps {
  forums: Forum[];
  userForums: string[];
  onForumSelect: (forum: Forum) => void;
  onToggleMembership: (forumId: string) => void;
}

export const ForumList = ({
  forums,
  userForums,
  onForumSelect,
  onToggleMembership
}: ForumListProps) => {
  const userJoinedForums = forums.filter((forum) => userForums.includes(forum.id));
  const discoverForums = forums.filter((forum) => !userForums.includes(forum.id));

  return (
    <div className="space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto pb-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Communities</h2>
      <div className="grid gap-4">
        {userJoinedForums.map((forum) => (
          <Card key={forum.id} className="p-4">
            <div className="flex justify-between items-center">
              <div
                className="cursor-pointer flex-1"
                onClick={() => onForumSelect(forum)}
              >
                <h3 className="text-lg font-semibold">{forum.name}</h3>
                <p className="text-sm text-gray-500">{forum.description}</p>
              </div>
              <Switch
                checked={userForums.includes(forum.id)}
                onCheckedChange={() => onToggleMembership(forum.id)}
              />
            </div>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-center">Discover Communities</h2>
      <div className="grid gap-4">
        {discoverForums.map((forum) => (
          <Card key={forum.id} className="p-4">
            <div className="flex justify-between items-center">
              <div
                className="cursor-pointer flex-1"
                onClick={() => onForumSelect(forum)}
              >
                <h3 className="text-lg font-semibold">{forum.name}</h3>
                <p className="text-sm text-gray-500">{forum.description}</p>
              </div>
              <Switch
                checked={userForums.includes(forum.id)}
                onCheckedChange={() => onToggleMembership(forum.id)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}; 
