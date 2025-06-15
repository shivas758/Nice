import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Temporary fallback type for games
interface Game {
  id: string;
  name: string;
  description: string;
  url: string;
}

const DESCRIPTION_LIMIT = 100;

const Games = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('games').select('*').order('name');
      if (!error && data) setGames(data as Game[]);
      setLoading(false);
    };
    fetchGames();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-4 pb-20 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 ml-2">Games</h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-4">
          {games.map((game) => {
            const isExpanded = expanded[game.id];
            return (
              <div key={game.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between max-w-full">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <h2 className="text-lg font-semibold mb-1 truncate mr-2">{game.name}</h2>
                    {game.description.length > 60 && (
                      <button
                        className="text-gray-400 hover:text-gray-700 transition p-1"
                        onClick={() => toggleExpand(game.id)}
                        aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    )}
                  </div>
                  <p className={`text-gray-600 text-sm ${!isExpanded ? 'truncate' : ''} ${!isExpanded ? 'whitespace-nowrap' : ''}`}
                    style={!isExpanded ? { maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis' } : {}}>
                    {game.description}
                  </p>
                </div>
                <a
                  href={game.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 px-4 py-2 rounded text-black hover:bg-orange-500 hover:text-white transition whitespace-nowrap"
                >
                  Play Now
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Games;
