import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Bookmark,
  Camera,
  Check,
  ChevronDown,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  MessageSquare,
  Mic,
  MicOff,
  MoreHorizontal,
  Phone,
  PhoneOff,
  Play,
  PlusCircle,
  Search,
  Share2,
  TrendingUp,
  Upload,
  User,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

// ── Types ──────────────────────────────────────────────────────────────────
interface Post {
  id: number;
  user: MockUser;
  caption: string;
  bgGradient: string;
  likes: number;
  comments: number;
  liked: boolean;
  time: string;
}

interface MockUser {
  id: number;
  name: string;
  initials: string;
  color: string;
  followers: string;
  isOnline: boolean;
}

interface FriendRequest {
  id: number;
  user: MockUser;
  mutualFriends: number;
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    name: "Aria Khan",
    initials: "AK",
    color: "from-cyan-500 to-blue-600",
    followers: "12.4K",
    isOnline: true,
  },
  {
    id: 2,
    name: "Zara Singh",
    initials: "ZS",
    color: "from-violet-500 to-purple-600",
    followers: "8.9K",
    isOnline: true,
  },
  {
    id: 3,
    name: "Dev Patel",
    initials: "DP",
    color: "from-pink-500 to-rose-600",
    followers: "21.1K",
    isOnline: false,
  },
  {
    id: 4,
    name: "Mia Chen",
    initials: "MC",
    color: "from-emerald-500 to-teal-600",
    followers: "5.3K",
    isOnline: true,
  },
  {
    id: 5,
    name: "Sam Torres",
    initials: "ST",
    color: "from-orange-500 to-amber-600",
    followers: "16.7K",
    isOnline: true,
  },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    user: MOCK_USERS[0],
    caption: "Golden hour vibes never get old ✨ #GoldenHour #Photography",
    bgGradient: "from-amber-600 via-orange-500 to-yellow-400",
    likes: 1243,
    comments: 87,
    liked: false,
    time: "2m",
  },
  {
    id: 2,
    user: MOCK_USERS[1],
    caption:
      "City lights at midnight, pure magic 🌃 #CityLife #NightPhotography",
    bgGradient: "from-blue-900 via-indigo-800 to-violet-700",
    likes: 3892,
    comments: 214,
    liked: false,
    time: "15m",
  },
  {
    id: 3,
    user: MOCK_USERS[2],
    caption: "Beach day with the squad 🏄‍♂️ tag your crew! #BeachVibes #Summer",
    bgGradient: "from-cyan-400 via-teal-500 to-blue-600",
    likes: 7120,
    comments: 432,
    liked: true,
    time: "1h",
  },
  {
    id: 4,
    user: MOCK_USERS[3],
    caption: "Morning matcha ritual 🍵 starting the day right #WellnessJourney",
    bgGradient: "from-green-600 via-emerald-500 to-teal-400",
    likes: 921,
    comments: 56,
    liked: false,
    time: "3h",
  },
  {
    id: 5,
    user: MOCK_USERS[4],
    caption: "Throwback to the best road trip ever 🚗 #Wanderlust #RoadTrip",
    bgGradient: "from-rose-600 via-pink-500 to-fuchsia-600",
    likes: 2347,
    comments: 189,
    liked: false,
    time: "6h",
  },
];

const FRIEND_REQUESTS: FriendRequest[] = [
  { id: 1, user: MOCK_USERS[2], mutualFriends: 4 },
  { id: 2, user: MOCK_USERS[4], mutualFriends: 7 },
  {
    id: 3,
    user: {
      id: 6,
      name: "Leo Martin",
      initials: "LM",
      color: "from-indigo-500 to-blue-600",
      followers: "3.1K",
      isOnline: false,
    },
    mutualFriends: 2,
  },
];

const SUGGESTED_USERS = [
  {
    id: 7,
    name: "Nova Park",
    initials: "NP",
    color: "from-pink-500 to-rose-600",
    bio: "Photographer · 44K followers",
  },
  {
    id: 8,
    name: "Ravi Mehra",
    initials: "RM",
    color: "from-yellow-500 to-orange-500",
    bio: "Travel Creator · 89K followers",
  },
  {
    id: 9,
    name: "Chloe Dupont",
    initials: "CD",
    color: "from-teal-500 to-cyan-600",
    bio: "Filmmaker · 127K followers",
  },
];

const TRENDING_TAGS = [
  "#MedolaLife",
  "#ReelChallenge",
  "#GoldenHour",
  "#CityVibes",
  "#TravelDiaries",
];

// ── Helper Components ──────────────────────────────────────────────────────
function UserAvatar({
  user,
  size = "md",
}: {
  user: { initials: string; color: string; name: string };
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sz = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-20 h-20 text-2xl",
  }[size];
  return (
    <div
      className={`${sz} rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg`}
    >
      {user.initials}
    </div>
  );
}

// ── Login Page ──────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const { login, isLoggingIn } = useInternetIdentity();

  const handleLogin = async () => {
    await login();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-card border border-border rounded-2xl p-10 shadow-2xl text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-8"
          >
            <div className="w-20 h-20 rounded-2xl grad-bg mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">M</span>
            </div>
            <h1 className="text-4xl font-bold grad-text">Medola</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Connect · Share · Explore
            </p>
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: "🎬", label: "Reels" },
              { icon: "📸", label: "Photos" },
              { icon: "📞", label: "Calls" },
            ].map((f) => (
              <div
                key={f.label}
                className="bg-muted rounded-xl p-3 text-center"
              >
                <div className="text-2xl mb-1">{f.icon}</div>
                <div className="text-xs text-muted-foreground font-medium">
                  {f.label}
                </div>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground text-sm mb-6">
            Join millions sharing moments, creating reels, and connecting with
            friends
          </p>

          <Button
            data-ocid="auth.primary_button"
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full grad-bg hover:opacity-90 text-white font-semibold py-6 rounded-xl text-base border-0"
          >
            {isLoggingIn ? "Connecting..." : "Sign in to Medola"}
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Secured by Internet Identity · No passwords needed
          </p>
        </div>
      </motion.div>
      <Toaster />
    </div>
  );
}

// ── Video/Audio Call Modal ─────────────────────────────────────────────────
function CallModal({
  type,
  user,
  onClose,
}: {
  type: "video" | "audio";
  user: MockUser;
  onClose: () => void;
}) {
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  return (
    <div
      data-ocid="call.modal"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md mx-4"
      >
        {/* Video background */}
        <div className="aspect-[9/16] max-h-[80vh] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 relative">
          {type === "video" && !camOff ? (
            <div
              className={`w-full h-full bg-gradient-to-br ${user.color} opacity-30`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UserAvatar user={user} size="xl" />
            </div>
          )}

          {/* Caller info */}
          <div className="absolute top-6 left-0 right-0 text-center">
            <p className="text-white/70 text-sm">
              {type === "video" ? "Video" : "Audio"} Call
            </p>
            <h3 className="text-white text-2xl font-bold mt-1">{user.name}</h3>
            <p className="text-white/60 text-sm mt-1">Calling...</p>
          </div>

          {/* Self preview (video only) */}
          {type === "video" && (
            <div className="absolute top-6 right-4 w-20 h-28 rounded-xl bg-gradient-to-br from-cyan-600 to-violet-600 flex items-center justify-center text-white text-xs font-medium shadow-lg">
              You
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-5">
            <button
              type="button"
              data-ocid="call.toggle"
              onClick={() => setMuted(!muted)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                muted ? "bg-red-500/80" : "bg-white/20 hover:bg-white/30"
              }`}
            >
              {muted ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              type="button"
              data-ocid="call.cancel_button"
              onClick={onClose}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-colors"
            >
              <PhoneOff className="w-7 h-7 text-white" />
            </button>

            {type === "video" && (
              <button
                type="button"
                data-ocid="call.toggle"
                onClick={() => setCamOff(!camOff)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  camOff ? "bg-red-500/80" : "bg-white/20 hover:bg-white/30"
                }`}
              >
                {camOff ? (
                  <VideoOff className="w-6 h-6 text-white" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Upload Modal ────────────────────────────────────────────────────────────
function UploadModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    }
  };

  const handlePost = () => {
    toast.success("Post uploaded successfully! 🎉");
    setCaption("");
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        data-ocid="upload.dialog"
        className="bg-card border-border max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Upload className="w-5 h-5" /> Create Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File area */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl h-48 w-full flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 transition-colors group"
            data-ocid="upload.dropzone"
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <>
                <Upload className="w-10 h-10 text-muted-foreground group-hover:text-cyan-400 transition-colors mb-2" />
                <p className="text-muted-foreground text-sm">
                  Click to upload photo or video
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  JPEG, PNG, MP4 up to 50MB
                </p>
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFile}
          />

          <Textarea
            data-ocid="upload.textarea"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="bg-muted border-border text-foreground resize-none h-24"
          />

          <div className="flex gap-3">
            <Button
              data-ocid="upload.cancel_button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              data-ocid="upload.submit_button"
              onClick={handlePost}
              className="flex-1 grad-bg border-0 text-white hover:opacity-90"
            >
              Share Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Reel Card ────────────────────────────────────────────────────────────────
function ReelCard() {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(45200);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes((p) => (liked ? p - 1 : p + 1));
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="relative">
        {/* 9:16 reel placeholder */}
        <div className="w-full aspect-[9/16] max-h-[70vh] bg-gradient-to-b from-violet-900 via-purple-800 to-indigo-900 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-violet-600/20" />

          {/* Play button */}
          <button
            type="button"
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </button>

          {/* User info overlay */}
          <div className="absolute bottom-4 left-4 right-14">
            <div className="flex items-center gap-2 mb-2">
              <UserAvatar user={MOCK_USERS[0]} size="sm" />
              <div>
                <p className="text-white font-semibold text-sm">
                  {MOCK_USERS[0].name}
                </p>
                <p className="text-white/60 text-xs">Featured Reel</p>
              </div>
            </div>
            <p className="text-white/90 text-sm">
              Dancing in the rain with no regrets 🌧️ #ReelChallenge #Medola
            </p>
          </div>

          {/* Action stack */}
          <div className="absolute right-3 bottom-4 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={toggleLike}
              className="flex flex-col items-center gap-1"
            >
              <Heart
                className={`w-7 h-7 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-white"}`}
              />
              <span className="text-white text-xs">
                {(likes / 1000).toFixed(1)}K
              </span>
            </button>
            <button type="button" className="flex flex-col items-center gap-1">
              <MessageCircle className="w-7 h-7 text-white" />
              <span className="text-white text-xs">1.2K</span>
            </button>
            <button type="button" className="flex flex-col items-center gap-1">
              <Share2 className="w-7 h-7 text-white" />
              <span className="text-white text-xs">834</span>
            </button>
            <button type="button" className="flex flex-col items-center gap-1">
              <Bookmark className="w-7 h-7 text-white" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full w-2/5 grad-bg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Post Card ────────────────────────────────────────────────────────────────
function PostCard({
  post,
  onLike,
  onCall,
}: {
  post: Post;
  onLike: (id: number) => void;
  onCall: (user: MockUser, type: "video" | "audio") => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <UserAvatar user={post.user} size="md" />
          <div>
            <p className="text-foreground font-semibold text-sm">
              {post.user.name}
            </p>
            <p className="text-muted-foreground text-xs">{post.time} ago</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCall(post.user, "audio")}
            className="text-muted-foreground hover:text-cyan-400 transition-colors"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onCall(post.user, "video")}
            className="text-muted-foreground hover:text-cyan-400 transition-colors"
          >
            <Video className="w-4 h-4" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-popover border-border">
              <DropdownMenuItem className="text-foreground hover:bg-muted cursor-pointer">
                Save Post
              </DropdownMenuItem>
              <DropdownMenuItem className="text-foreground hover:bg-muted cursor-pointer">
                Follow {post.user.name}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive hover:bg-muted cursor-pointer">
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Image */}
      <div
        className={`w-full aspect-[4/3] bg-gradient-to-br ${post.bgGradient} relative`}
      >
        <div className="absolute inset-0 flex items-end p-4">
          <p className="text-white/80 text-xs line-clamp-2">{post.caption}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3">
        <p className="text-foreground text-sm mb-3">{post.caption}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              data-ocid={`feed.toggle.${post.id}`}
              onClick={() => onLike(post.id)}
              className="flex items-center gap-1.5 group"
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  post.liked
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-muted-foreground group-hover:text-red-400"
                }`}
              />
              <span className="text-muted-foreground text-sm">
                {post.likes.toLocaleString()}
              </span>
            </button>
            <button type="button" className="flex items-center gap-1.5">
              <MessageCircle className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">
                {post.comments}
              </span>
            </button>
            <button type="button">
              <Share2 className="w-5 h-5 text-muted-foreground hover:text-cyan-400 transition-colors" />
            </button>
          </div>
          <button type="button">
            <Bookmark className="w-5 h-5 text-muted-foreground hover:text-violet-400 transition-colors" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const { identity, clear, isInitializing } = useInternetIdentity();
  const [loggedIn, setLoggedIn] = useState(false);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [friendRequests, setFriendRequests] = useState(FRIEND_REQUESTS);
  const [following, setFollowing] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<
    "home" | "search" | "profile" | "notifications"
  >("home");
  const [showUpload, setShowUpload] = useState(false);
  const [callState, setCallState] = useState<{
    user: MockUser;
    type: "video" | "audio";
  } | null>(null);
  const [notifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

  const isAuth = !!identity || loggedIn;
  const username = identity
    ? identity.getPrincipal().toString().slice(0, 8)
    : "User";

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl grad-bg mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <p className="text-muted-foreground">Loading Medola...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  const handleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  };

  const handleAcceptRequest = (id: number) => {
    const req = friendRequests.find((r) => r.id === id);
    if (req) toast.success(`You are now friends with ${req.user.name}! 🎉`);
    setFriendRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDeclineRequest = (id: number) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleFollow = (id: number) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCall = (user: MockUser, type: "video" | "audio") => {
    setCallState({ user, type });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg grad-bg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-xl grad-text hidden sm:block">
              Medola
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                data-ocid="nav.search_input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Medola..."
                className="pl-9 bg-muted border-border text-foreground h-9 rounded-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              data-ocid="nav.link"
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full" />
            </button>

            <button
              type="button"
              data-ocid="nav.link"
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs border-0 rounded-full">
                  {notifications}
                </Badge>
              )}
            </button>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  data-ocid="nav.toggle"
                  className="flex items-center gap-2 hover:bg-muted rounded-lg px-2 py-1.5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full grad-bg flex items-center justify-center text-white text-xs font-bold">
                    {username.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-foreground text-sm font-medium hidden sm:block">
                    @{username}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-popover border-border min-w-44"
              >
                <DropdownMenuItem
                  data-ocid="nav.link"
                  className="text-foreground hover:bg-muted cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="nav.link"
                  className="text-foreground hover:bg-muted cursor-pointer"
                >
                  <Bookmark className="w-4 h-4 mr-2" /> Saved Posts
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="auth.delete_button"
                  onClick={() => {
                    clear();
                    setLoggedIn(false);
                  }}
                  className="text-destructive hover:bg-muted cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ── Main Grid ── */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_260px] gap-6">
          {/* ── LEFT SIDEBAR ── */}
          <aside className="hidden lg:flex flex-col gap-5">
            {/* Online Followers */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="text-foreground font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" /> Followers
                Online
              </h3>
              <div className="space-y-3">
                {MOCK_USERS.filter((u) => u.isOnline).map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="relative">
                      <UserAvatar user={user} size="sm" />
                      {user.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm font-medium truncate">
                        {user.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {user.followers} followers
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCall(user, "audio")}
                        className="text-muted-foreground hover:text-cyan-400 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCall(user, "video")}
                        className="text-muted-foreground hover:text-violet-400 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Tags */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="text-foreground font-semibold text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" /> Trending Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    data-ocid="tags.tab"
                    className="px-3 py-1.5 rounded-full bg-muted hover:bg-cyan-500/20 hover:text-cyan-400 text-muted-foreground text-xs font-medium transition-colors border border-border"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Friend Requests */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="text-foreground font-semibold text-sm mb-3">
                Friend Requests
                {friendRequests.length > 0 && (
                  <Badge className="ml-2 bg-cyan-500/20 text-cyan-400 border-0 text-xs">
                    {friendRequests.length}
                  </Badge>
                )}
              </h3>
              {friendRequests.length === 0 ? (
                <p
                  data-ocid="requests.empty_state"
                  className="text-muted-foreground text-xs text-center py-4"
                >
                  No pending requests
                </p>
              ) : (
                <div className="space-y-3">
                  {friendRequests.map((req, i) => (
                    <div
                      key={req.id}
                      data-ocid={`requests.item.${i + 1}`}
                      className="flex items-center gap-2"
                    >
                      <UserAvatar user={req.user} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground text-xs font-medium truncate">
                          {req.user.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {req.mutualFriends} mutual friends
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          data-ocid={`requests.confirm_button.${i + 1}`}
                          onClick={() => handleAcceptRequest(req.id)}
                          className="w-7 h-7 rounded-full grad-bg flex items-center justify-center hover:opacity-90 transition-opacity"
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                        </button>
                        <button
                          type="button"
                          data-ocid={`requests.cancel_button.${i + 1}`}
                          onClick={() => handleDeclineRequest(req.id)}
                          className="w-7 h-7 rounded-full bg-muted hover:bg-red-500/20 border border-border flex items-center justify-center transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-muted-foreground hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* ── CENTER FEED ── */}
          <section className="flex flex-col gap-5 min-w-0">
            <ReelCard />
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={{ ...post }}
                onLike={handleLike}
                onCall={handleCall}
              />
            ))}
          </section>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="hidden lg:flex flex-col gap-5">
            {/* Sponsored */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="w-full aspect-video bg-gradient-to-br from-pink-600 via-rose-500 to-orange-500 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-4xl">✨</span>
                </div>
                <Badge className="absolute top-2 right-2 bg-black/50 text-white border-0 text-xs">
                  Sponsored
                </Badge>
              </div>
              <div className="p-4">
                <h4 className="text-foreground font-semibold text-sm">
                  Lumina Beauty Co.
                </h4>
                <p className="text-muted-foreground text-xs mt-1 mb-3">
                  Discover your perfect glow with our new summer collection 💫
                </p>
                <button
                  type="button"
                  className="w-full grad-bg text-white text-xs font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Follow & Shop Now
                </button>
              </div>
            </div>

            {/* Suggested Users */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="text-foreground font-semibold text-sm mb-3">
                Suggested for You
              </h3>
              <div className="space-y-3">
                {SUGGESTED_USERS.map((user, i) => (
                  <div
                    key={user.id}
                    data-ocid={`suggested.item.${i + 1}`}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                    >
                      {user.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm font-medium truncate">
                        {user.name}
                      </p>
                      <p className="text-muted-foreground text-xs truncate">
                        {user.bio}
                      </p>
                    </div>
                    <button
                      type="button"
                      data-ocid={`suggested.toggle.${i + 1}`}
                      onClick={() => handleFollow(user.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                        following.has(user.id)
                          ? "bg-muted text-muted-foreground border border-border"
                          : "grad-bg text-white hover:opacity-90"
                      }`}
                    >
                      {following.has(user.id) ? "Following" : "Follow"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-muted-foreground text-center px-2">
              © {new Date().getFullYear()}. Built with ♥ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </aside>
        </div>
      </main>

      {/* ── Bottom Nav (mobile) ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border z-40">
        <div className="flex items-center justify-around px-6 py-3">
          {(
            [
              { id: "home", icon: Home, label: "Home" },
              { id: "search", icon: Search, label: "Search" },
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <button
              type="button"
              key={id}
              data-ocid="nav.tab"
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                activeTab === id ? "text-cyan-400" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </button>
          ))}

          {/* Upload button */}
          <button
            type="button"
            data-ocid="upload.open_modal_button"
            onClick={() => setShowUpload(true)}
            className="w-12 h-12 rounded-full grad-bg flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
          >
            <PlusCircle className="w-6 h-6 text-white" />
          </button>

          {(
            [
              { id: "profile", icon: User, label: "Profile" },
              { id: "notifications", icon: Bell, label: "Alerts" },
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <button
              type="button"
              key={id}
              data-ocid="nav.tab"
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 p-2 relative transition-colors ${
                activeTab === id ? "text-cyan-400" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              {id === "notifications" && notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop upload button */}
      <button
        type="button"
        data-ocid="upload.open_modal_button"
        onClick={() => setShowUpload(true)}
        className="hidden lg:flex fixed bottom-8 right-8 w-14 h-14 rounded-full grad-bg items-center justify-center shadow-2xl hover:opacity-90 transition-opacity z-40"
      >
        <PlusCircle className="w-7 h-7 text-white" />
      </button>

      {/* ── Modals ── */}
      <UploadModal open={showUpload} onClose={() => setShowUpload(false)} />

      <AnimatePresence>
        {callState && (
          <CallModal
            type={callState.type}
            user={callState.user}
            onClose={() => setCallState(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
