"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, X, Plus, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSubscription } from "@/hooks/useSubscription";
import { Song } from "@/types";

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
    year: 1975,
    album: "A Night at the Opera",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png",
  },
  {
    title: "Billie Jean",
    artist: "Michael Jackson",
    year: 1982,
    album: "Thriller",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
  },
  {
    title: "Sweet Child o' Mine",
    artist: "Guns N' Roses",
    year: 1987,
    album: "Appetite for Destruction",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/6/60/GunsnRosesAppetiteforDestructionalbumcover.jpg",
  },
  {
    title: "Hotel California",
    artist: "Eagles",
    year: 1976,
    album: "Hotel California",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg",
  },
  {
    title: "Imagine",
    artist: "John Lennon",
    year: 1971,
    album: "Imagine",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/6/69/ImagineCover.jpg",
  },
  {
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    year: 1971,
    album: "Led Zeppelin IV",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg",
  },
  {
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    year: 1991,
    album: "Nevermind",
    image_url:
      "https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg",
  },
  {
    title: "Hey Jude",
    artist: "The Beatles",
    year: 1968,
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

  const {
    loading,
    error: subscriptionError,
    subscribeToSong,
    unsubscribeFromSong,
    checkSubscription,
    getSubscribedSongs,
  } = useSubscription(user.email);

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
      console.log("handleRemoveSubscription", song);
      setIsLoading(true);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header with user area and logout */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-black">
              Music Subscription App
            </h1>
            <div className="text-sm text-muted-foreground">
              Welcome,{" "}
              <span className="font-medium text-black">{user.user_name}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 text-black"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container px-4 py-6 md:py-10">
        <div className="grid gap-8">
          {/* My Subscriptions Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">My Subscriptions</h2>
            {loading || isLoading ? (
              <p>Loading subscriptions...</p>
            ) : subscriptionError ? (
              <p className="text-red-500">{subscriptionError}</p>
            ) : subscriptions.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]"></TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Album</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((subscription, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Image
                            src={
                              subscription.image_url ||
                              "/placeholder.svg?height=100&width=100"
                            }
                            alt={subscription.title}
                            width={50}
                            height={50}
                            className="rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {subscription.title}
                        </TableCell>
                        <TableCell>{subscription.artist}</TableCell>
                        <TableCell>{subscription.album}</TableCell>
                        <TableCell>{subscription.year}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveSubscription(subscription)
                            }
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove subscription"
                            disabled={loading || isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="text-center">
                    <h3 className="mt-2 text-xl font-semibold">
                      No Subscriptions Yet
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Subscribe to songs from the list below.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

          {/* All Songs Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">All Available Songs</h2>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]"></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead>Album</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSongs.map((song, index) => {
                    const subscribed = isAlreadySubscribed(song);

                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Image
                            src={
                              song.image_url ||
                              "/placeholder.svg?height=100&width=100"
                            }
                            alt={song.title}
                            width={50}
                            height={50}
                            className="rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {song.title}
                        </TableCell>
                        <TableCell>{song.artist}</TableCell>
                        <TableCell>{song.album}</TableCell>
                        <TableCell>{song.year}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleSubscribe(song)}
                            className={`${
                              subscribed
                                ? "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
                                : "bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700"
                            } gap-1 px-2 py-1 h-8`}
                            // disabled={loading || isLoading}
                          >
                            {subscribed ? (
                              <>
                                <X className="h-3 w-3" />
                                Unsubscribe
                              </>
                            ) : (
                              <>
                                <Plus className="h-3 w-3" />
                                Subscribe
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
