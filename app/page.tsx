"use client";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat, Search, Home, Library, TrendingUp, Music } from "lucide-react";

const SONGS = [
  { id: 1, title: "Neon Lights", artist: "Void Circuit", album: "Darkwave Sessions", duration: 214, color: "#7c3aed", cover: "🌌" },
  { id: 2, title: "Chrome Hearts", artist: "Ether Dreams", album: "Ultraviolet", duration: 187, color: "#0891b2", cover: "💙" },
  { id: 3, title: "Digital Ghost", artist: "Neural Pulse", album: "Ghost Protocol", duration: 243, color: "#6d28d9", cover: "👻" },
  { id: 4, title: "Plasma Rain", artist: "Void Circuit", album: "Darkwave Sessions", duration: 198, color: "#be185d", cover: "🌧️" },
  { id: 5, title: "Hologram Kiss", artist: "Synthara", album: "Mirage", duration: 221, color: "#0e7490", cover: "💫" },
  { id: 6, title: "Cryogenic", artist: "Ether Dreams", album: "Subzero", duration: 259, color: "#1e40af", cover: "❄️" },
  { id: 7, title: "Starfield Protocol", artist: "Neural Pulse", album: "Cosmos", duration: 178, color: "#5b21b6", cover: "⭐" },
  { id: 8, title: "Acid Requiem", artist: "Glitch Monk", album: "Error 404", duration: 233, color: "#9d174d", cover: "🎸" },
  { id: 9, title: "Midnight Cipher", artist: "Synthara", album: "Encoded", duration: 205, color: "#0f766e", cover: "🌙" },
  { id: 10, title: "Phantom Frequency", artist: "Glitch Monk", album: "Phantom", duration: 194, color: "#7c2d12", cover: "📡" },
  { id: 11, title: "Carbon Dreams", artist: "Neural Pulse", album: "Industrial", duration: 267, color: "#374151", cover: "🖤" },
  { id: 12, title: "Neuro Storm", artist: "Void Circuit", album: "Overload", duration: 189, color: "#6d28d9", cover: "⚡" },
];

const PLAYLISTS = [
  { id: 1, name: "Liked Songs", count: 12, color: "#1DB954" },
  { id: 2, name: "Late Night Vibes", count: 8, color: "#7c3aed" },
  { id: 3, name: "Workout Mode", count: 6, color: "#be185d" },
  { id: 4, name: "Chill & Focus", count: 10, color: "#0891b2" },
];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function App() {
  const [current, setCurrent] = useState(SONGS[0]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [liked, setLiked] = useState<number[]>([]);
  const [tab, setTab] = useState("home");
  const [search, setSearch] = useState("");
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const intervalRef = useRef<any>(null);

  const filtered = SONGS.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= current.duration) {
            handleNext();
            return 0;
          }
          return p + 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, current]);

  const play = (song: typeof SONGS[0]) => {
    if (current.id === song.id) {
      setPlaying(!playing);
    } else {
      setCurrent(song);
      setProgress(0);
      setPlaying(true);
    }
  };

  const handleNext = () => {
    const idx = SONGS.findIndex((s) => s.id === current.id);
    const next = shuffle
      ? SONGS[Math.floor(Math.random() * SONGS.length)]
      : SONGS[(idx + 1) % SONGS.length];
    setCurrent(next);
    setProgress(0);
    setPlaying(true);
  };

  const handlePrev = () => {
    if (progress > 3) { setProgress(0); return; }
    const idx = SONGS.findIndex((s) => s.id === current.id);
    const prev = SONGS[(idx - 1 + SONGS.length) % SONGS.length];
    setCurrent(prev);
    setProgress(0);
    setPlaying(true);
  };

  const toggleLike = (id: number) =>
    setLiked((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));

  return (
    <div className="flex h-screen bg-dark overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-black flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Music className="text-brand" size={28} />
            <span className="text-xl font-bold text-white">SoundWave</span>
          </div>
          <nav className="space-y-1">
            {[
              { id: "home", icon: Home, label: "Home" },
              { id: "search", icon: Search, label: "Search" },
              { id: "library", icon: Library, label: "Library" },
              { id: "trending", icon: TrendingUp, label: "Trending" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === id ? "bg-surface text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="px-6 flex-1 overflow-y-auto">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Playlists</p>
          {PLAYLISTS.map((pl) => (
            <button
              key={pl.id}
              className="w-full flex items-center gap-3 py-2 text-left hover:text-white text-gray-400 transition-colors"
            >
              <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold shrink-0" style={{ background: pl.color + "33", color: pl.color }}>
                ♪
              </div>
              <div className="truncate">
                <p className="text-sm truncate">{pl.name}</p>
                <p className="text-xs text-gray-600">{pl.count} songs</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-dark/80 backdrop-blur px-8 py-4 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setTab("search"); }}
                placeholder="Search songs, artists..."
                className="w-full bg-muted text-white pl-9 pr-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="px-8 pb-32">
            {tab === "home" && (
              <>
                {/* Hero - current playing */}
                <div
                  className="rounded-2xl p-8 mb-8 flex items-center gap-6"
                  style={{ background: `linear-gradient(135deg, ${current.color}66, ${current.color}22)` }}
                >
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-2xl spin-slow ${!playing ? "paused" : ""}`}
                    style={{ background: current.color + "44", border: `3px solid ${current.color}` }}
                  >
                    {current.cover}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Now Playing</p>
                    <h2 className="text-3xl font-bold text-white mb-1">{current.title}</h2>
                    <p className="text-gray-300">{current.artist} · {current.album}</p>
                  </div>
                  <button
                    onClick={() => setPlaying(!playing)}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-black font-bold transition-transform hover:scale-105 active:scale-95"
                    style={{ background: "#fff" }}
                  >
                    {playing ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" />}
                  </button>
                </div>

                <h3 className="text-xl font-bold text-white mb-4">All Songs</h3>
                <SongList songs={SONGS} current={current} playing={playing} liked={liked} onPlay={play} onLike={toggleLike} />
              </>
            )}

            {tab === "search" && (
              <>
                <h3 className="text-xl font-bold text-white mb-4">
                  {search ? `Results for "${search}"` : "Browse All"}
                </h3>
                <SongList songs={filtered} current={current} playing={playing} liked={liked} onPlay={play} onLike={toggleLike} />
              </>
            )}

            {tab === "trending" && (
              <>
                <h3 className="text-xl font-bold text-white mb-1">🔥 Trending Now</h3>
                <p className="text-gray-400 text-sm mb-6">Top tracks this week</p>
                <SongList
                  songs={[...SONGS].sort(() => Math.random() - 0.5).slice(0, 8)}
                  current={current}
                  playing={playing}
                  liked={liked}
                  onPlay={play}
                  onLike={toggleLike}
                  numbered
                />
              </>
            )}

            {tab === "library" && (
              <>
                <h3 className="text-xl font-bold text-white mb-4">💚 Liked Songs</h3>
                {liked.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <Heart size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Songs you like will appear here</p>
                  </div>
                ) : (
                  <SongList
                    songs={SONGS.filter((s) => liked.includes(s.id))}
                    current={current}
                    playing={playing}
                    liked={liked}
                    onPlay={play}
                    onLike={toggleLike}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Player Bar */}
        <div className="h-24 bg-card border-t border-white/5 px-6 flex items-center gap-6 shrink-0">
          {/* Song info */}
          <div className="flex items-center gap-3 w-64 shrink-0">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0"
              style={{ background: current.color + "44" }}
            >
              {current.cover}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{current.title}</p>
              <p className="text-xs text-gray-400 truncate">{current.artist}</p>
            </div>
            <button onClick={() => toggleLike(current.id)} className="ml-2 shrink-0">
              <Heart
                size={16}
                className={liked.includes(current.id) ? "fill-brand text-brand" : "text-gray-500"}
              />
            </button>
          </div>

          {/* Controls */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="flex items-center gap-6">
              <button onClick={() => setShuffle(!shuffle)} className={shuffle ? "text-brand" : "text-gray-400 hover:text-white"}>
                <Shuffle size={18} />
              </button>
              <button onClick={handlePrev} className="text-gray-300 hover:text-white">
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
              >
                {playing ? <Pause size={18} fill="black" className="text-black" /> : <Play size={18} fill="black" className="text-black" />}
              </button>
              <button onClick={handleNext} className="text-gray-300 hover:text-white">
                <SkipForward size={20} fill="currentColor" />
              </button>
              <button onClick={() => setRepeat(!repeat)} className={repeat ? "text-brand" : "text-gray-400 hover:text-white"}>
                <Repeat size={18} />
              </button>
            </div>
            <div className="w-full max-w-md flex items-center gap-2">
              <span className="text-xs text-gray-400 w-8 text-right">{fmt(progress)}</span>
              <div className="flex-1 relative h-1 bg-muted rounded-full cursor-pointer group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = (e.clientX - rect.left) / rect.width;
                  setProgress(Math.floor(ratio * current.duration));
                }}
              >
                <div
                  className="h-full bg-white group-hover:bg-brand rounded-full transition-colors"
                  style={{ width: `${(progress / current.duration) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-8">{fmt(current.duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 w-32 shrink-0">
            <Volume2 size={16} className="text-gray-400" />
            <div className="flex-1 relative h-1 bg-muted rounded-full cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setVolume(Math.round(((e.clientX - rect.left) / rect.width) * 100));
              }}
            >
              <div className="h-full bg-white group-hover:bg-brand rounded-full transition-colors" style={{ width: `${volume}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SongList({ songs, current, playing, liked, onPlay, onLike, numbered }: any) {
  return (
    <div className="space-y-1">
      {songs.map((song: any, i: number) => {
        const isActive = current.id === song.id;
        return (
          <div
            key={song.id}
            onClick={() => onPlay(song)}
            className={`flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer group transition-colors ${
              isActive ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            {numbered && (
              <span className={`w-5 text-center text-sm ${isActive ? "text-brand" : "text-gray-500 group-hover:hidden"}`}>
                {isActive && playing ? "▶" : i + 1}
              </span>
            )}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
              style={{ background: song.color + "44" }}
            >
              {isActive && playing ? (
                <span className="text-brand text-xs font-bold animate-pulse">♪</span>
              ) : (
                song.cover
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${isActive ? "text-brand" : "text-white"}`}>{song.title}</p>
              <p className="text-xs text-gray-400 truncate">{song.artist} · {song.album}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onLike(song.id); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart
                size={16}
                className={liked.includes(song.id) ? "fill-brand text-brand" : "text-gray-500 hover:text-white"}
              />
            </button>
            <span className="text-xs text-gray-500 w-10 text-right">{fmt(song.duration)}</span>
          </div>
        );
      })}
    </div>
  );
}
