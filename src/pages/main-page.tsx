"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LogOut,
  X,
  Plus,
  Check,
  Search,
  Music,
  Headphones,
  Star,
  Calendar,
  Disc,
  User,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSubscription } from "@/hooks/useSubscription";
import { Song } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for demonstration purposes
const mockUser = {
  user_name: "JohnDoe0",
  email: "johndoe@example.com",
};

// Mock songs data
const mockSongs = [
  {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    year: "1975",
    album: "A Night at the Opera",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png",
  },
  {
    title: "Billie Jean",
    artist: "Michael Jackson",
    year: "1982",
    album: "Thriller",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
  },
  {
    title: "Sweet Child o' Mine",
    artist: "Guns N' Roses",
    year: "1987",
    album: "Appetite for Destruction",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/6/60/GunsnRosesAppetiteforDestructionalbumcover.jpg",
  },
  {
    title: "Hotel California",
    artist: "Eagles",
    year: "1976",
    album: "Hotel California",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg",
  },
  {
    title: "Imagine",
    artist: "John Lennon",
    year: "1971",
    album: "Imagine",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/6/69/ImagineCover.jpg",
  },
  {
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    year: "1971",
    album: "Led Zeppelin IV",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg",
  },
  {
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    year: "1991",
    album: "Nevermind",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg",
  },
  {
    title: "Hey Jude",
    artist: "The Beatles",
    year: "1968",
    album: "Hey Jude",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/3/3d/Beatles_-_Hey_Jude_Single.jpg",
  },
];

export default function MainPage() {
  const router = useRouter();
  const [user] = useState(mockUser);
  const [subscriptions, setSubscriptions] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    title: "",
    artist: "",
    album: "",
    year: "",
  });
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    loading,
    error: subscriptionError,
    subscribeToSong,
    unsubscribeFromSong,
    checkSubscription,
    getSubscribedSongs,
  } = useSubscription("chakit@gmail.com");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      console.log("fetchSubscriptions");
      const response = await getSubscribedSongs();
      if (response.status === 200) {
        console.log("response in fetchSubscriptions", response);
        setSubscriptions(response.message as Song[]);
      } else {
        console.error("response in fetchSubscriptions", response.message);
        toast.error(
          (response.message as string) || "Failed to fetch subscriptions"
        );
      }
    } catch {
      toast.error("Error fetching subscriptions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // In a real implementation, this would clear the session/auth state
    router.replace("/signin");
  };

  const handleRemoveSubscription = async (song: Song) => {
    try {
      console.log(song);
      console.log("handleRemoveSubscription", song);
      setIsLoading(true);
      console.log(song);
      const response = await unsubscribeFromSong(song);
      if (response.status === 200) {
        setSubscriptions(
          subscriptions.filter(
            (sub) =>
              !(
                sub.title === song.title &&
                sub.album === song.album &&
                sub.artist === song.artist
              )
          )
        );
        toast.success("Unsubscribed successfully");
      } else {
        toast.error(response.message || "Failed to unsubscribe");
      }
    } catch {
      toast.error("Error processing unsubscribe request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (song: Song) => {
    try {
      console.log("handleSubscribe", song);
      setIsLoading(true);
      // Check if already subscribed
      const isSubscribed = isAlreadySubscribed(song);

      if (isSubscribed) {
        // Unsubscribe
        await handleRemoveSubscription(song);
      } else {
        // Subscribe
        const response = await subscribeToSong(song);

        if (response.status === 200) {
          setSubscriptions([...subscriptions, song]);
          toast.success("Successfully subscribed to song");
        } else {
          toast.error(response.message || "Failed to subscribe to song");
        }
      }
    } catch {
      toast.error("Error processing subscription request");
    } finally {
      setIsLoading(false);
    }
  };

  const isAlreadySubscribed = (song: Song) => {
    return subscriptions.some(
      (sub) =>
        sub.title === song.title &&
        sub.album === song.album &&
        sub.artist === song.artist
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    try {
      // Check if at least one search parameter is filled
      const hasSearchParams = Object.values(searchQuery).some(
        (value) => value.trim() !== ""
      );

      if (!hasSearchParams) {
        toast.error("Please enter at least one search parameter");
        return;
      }

      setIsSearching(true);
      const response = await axios.get("/api/query-songs", {
        params: searchQuery,
      });

      if (response.data.success) {
        setSearchResults(response.data.songs);
        if (response.data.songs.length === 0) {
          toast.info("No songs found matching your criteria");
        } else {
          toast.success(
            `Found ${response.data.songs.length} songs matching your criteria`
          );
        }
      } else {
        toast.error("Failed to search songs");
      }
    } catch (error) {
      console.error("Error searching songs:", error);
      toast.error("Error searching songs");
    } finally {
      setIsSearching(false);
    }
  };

  // Function to handle card click
  const handleCardClick = (song: Song) => {
    setSelectedSong(song);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header with user area and logout */}
      <header className="border-b border-indigo-100 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-md">
                <Music className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Music Subscription App
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Welcome,{" "}
              <span className="font-medium text-indigo-700">
                {user.user_name}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-all duration-300"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="w-full px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Search Section */}
          <section className="space-y-4 mb-10">
            <div className="flex items-center gap-2">
              <Search className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">Search Songs</h2>
            </div>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-indigo-100 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <Input
                      name="title"
                      value={searchQuery.title}
                      onChange={handleSearchChange}
                      placeholder="Song title"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Artist
                    </label>
                    <Input
                      name="artist"
                      value={searchQuery.artist}
                      onChange={handleSearchChange}
                      placeholder="Artist name"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Album
                    </label>
                    <Input
                      name="album"
                      value={searchQuery.album}
                      onChange={handleSearchChange}
                      placeholder="Album name"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Year
                    </label>
                    <Input
                      name="year"
                      value={searchQuery.year}
                      onChange={handleSearchChange}
                      placeholder="Release year"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all duration-300 transform hover:scale-105"
                    disabled={isSearching}
                    onClick={handleSearch}
                  >
                    {isSearching ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* My Subscriptions Section */}
          <section className="space-y-4 mb-16">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-800">
                My Subscriptions
              </h2>
            </div>
            {loading || isLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
              </div>
            ) : subscriptionError ? (
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6">
                  <p className="text-red-500">{subscriptionError}</p>
                </CardContent>
              </Card>
            ) : subscriptions.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {subscriptions.map((subscription, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden transition-all duration-300 hover:shadow-xl border-indigo-100 bg-white/80 backdrop-blur-sm group cursor-pointer"
                    onClick={() => handleCardClick(subscription)}
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                      <Image
                        src={
                          subscription.image_url ||
                          "/placeholder.svg?height=100&width=100"
                        }
                        alt={subscription.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <h3 className="text-white font-bold text-lg truncate">
                          {subscription.title}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {subscription.artist}
                        </p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-500">
                        {subscription.album} • {subscription.year}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSubscription(subscription);
                        }}
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300"
                        disabled={loading || isLoading}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Unsubscribe
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-indigo-100">
                <CardContent className="flex flex-col items-center justify-center p-10">
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <Headphones className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="mt-2 text-xl font-semibold text-gray-800">
                      No Subscriptions Yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Subscribe to songs from the list below.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

          {/* All Songs Section */}
          <section className="space-y-4 mb-10">
            <div className="flex items-center gap-2">
              <Music className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Music Gallery
              </h2>
            </div>
            {isSearching ? (
              <div className="flex justify-center py-12">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
              </div>
            ) : searchResults.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-indigo-100">
                <CardContent className="flex flex-col items-center justify-center p-10">
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <Music className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="mt-2 text-xl font-semibold text-gray-800">
                      No Songs Found
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {searchResults
                  .filter((song) => !isAlreadySubscribed(song))
                  .map((song, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden transition-all duration-300 hover:shadow-xl border-indigo-100 bg-white/80 backdrop-blur-sm group cursor-pointer"
                      onClick={() => handleCardClick(song)}
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                        <Image
                          src={
                            song.image_url ||
                            "/placeholder.svg?height=100&width=100"
                          }
                          alt={song.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                          <h3 className="text-white font-bold text-lg truncate">
                            {song.title}
                          </h3>
                          <p className="text-white/80 text-sm">{song.artist}</p>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-gray-500">
                          {song.album} • {song.year}
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubscribe(song);
                          }}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                          disabled={loading || isLoading}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Subscribe
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Song Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          {selectedSong && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-800">
                  {selectedSong.title}
                </DialogTitle>
                <DialogDescription className="text-base text-indigo-600">
                  by {selectedSong.artist}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={
                      selectedSong.image_url ||
                      "/placeholder.svg?height=100&width=100"
                    }
                    alt={selectedSong.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium text-gray-700">Artist:</span>
                    <span className="text-gray-800">{selectedSong.artist}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Disc className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium text-gray-700">Album:</span>
                    <span className="text-gray-800">{selectedSong.album}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium text-gray-700">Year:</span>
                    <span className="text-gray-800">{selectedSong.year}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {isAlreadySubscribed(selectedSong) ? (
                  <Button
                    variant="destructive"
                    className="w-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSubscription(selectedSong);
                      setIsDialogOpen(false);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Unsubscribe
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe(selectedSong);
                      setIsDialogOpen(false);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Subscribe
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
