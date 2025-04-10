"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, LogOut, X, Plus } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSubscription } from "@/hooks/useSubscription";
import { Song, APIParams } from "@/types";

// Mock data for demonstration purposes
const mockUser = {
  user_name: "JohnDoe0",
  email: "johndoe@example.com",
};

export default function MainPage() {
  const router = useRouter();
  const [user] = useState(mockUser);
  const [subscriptions, setSubscriptions] = useState<Song[]>([]);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [searchParams, setSearchParams] = useState({
    title: "",
    artist: "",
    year: "",
    album: "",
  });
  const [noResults, setNoResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    loading,
    error: subscriptionError,
    subscribeToSong,
    unsubscribeFromSong,
    getSubscribedSongs,
  } = useSubscription(user.email);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const songs = await getSubscribedSongs();
      setSubscriptions(songs);
    };

    fetchSubscriptions();
  }, [getSubscribedSongs]);

  const handleLogout = () => {
    // In a real implementation, this would clear the session/auth state
    router.replace("/signin");
  };

  const handleRemoveSubscription = async (song: Song) => {
    const success = await unsubscribeFromSong(song);
    if (success) {
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
    }
  };

  const handleSearch = async () => {
    // Check if at least one field is filled
    const hasQuery = Object.values(searchParams).some(
      (param) => param.trim() !== ""
    );

    if (!hasQuery) {
      alert("Please fill at least one search field");
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // We need to create a mock API for song search
      // This would typically be a proper API endpoint
      const payload: APIParams = {
        httpMethod: "GET",
        path: "/songs",
        email: user.email,
        ...searchParams,
      };

      // For now, we'll use mock data as a placeholder
      // In a real app, this would be an actual API call
      setTimeout(() => {
        const filteredResults = [
          {
            title: "Rivers of Babylon",
            artist: "The Melodians",
            year: "1970",
            album: "Rivers of Babylon",
            image_url: "/placeholder.svg?height=100&width=100",
          },
          {
            title: "White Blood Cells",
            artist: "The White Stripes",
            year: "2001",
            album: "White Blood Cells",
            image_url: "/placeholder.svg?height=100&width=100",
          },
        ].filter((item) => {
          return (
            (!searchParams.title ||
              item.title
                .toLowerCase()
                .includes(searchParams.title.toLowerCase())) &&
            (!searchParams.artist ||
              item.artist
                .toLowerCase()
                .includes(searchParams.artist.toLowerCase())) &&
            (!searchParams.year || item.year.includes(searchParams.year)) &&
            (!searchParams.album ||
              item.album
                .toLowerCase()
                .includes(searchParams.album.toLowerCase()))
          );
        });

        setSearchResults(filteredResults);
        setNoResults(filteredResults.length === 0);
        setIsSearching(false);
      }, 500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to search songs");
      setSearchResults([]);
      setNoResults(true);
      setIsSearching(false);
    }
  };

  const handleSubscribe = async (song: Song) => {
    // Check if already subscribed
    const isAlreadySubscribed = subscriptions.some(
      (sub) =>
        sub.title === song.title &&
        sub.album === song.album &&
        sub.artist === song.artist
    );

    if (isAlreadySubscribed) {
      alert("You are already subscribed to this song");
      return;
    }

    const success = await subscribeToSong(song);
    if (success) {
      setSubscriptions([...subscriptions, song]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
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
        <div className="grid gap-8 md:grid-cols-2">
          {/* Subscription Area */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">My Subscriptions</h2>
            {loading ? (
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
                      Subscribe to songs to see them here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Search Area */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Find Songs</h2>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-foreground"
                  >
                    Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Song title"
                    value={searchParams.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="artist"
                    className="text-sm font-medium text-foreground"
                  >
                    Artist
                  </label>
                  <Input
                    id="artist"
                    name="artist"
                    placeholder="Artist name"
                    value={searchParams.artist}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="year"
                    className="text-sm font-medium text-foreground"
                  >
                    Year
                  </label>
                  <Input
                    id="year"
                    name="year"
                    placeholder="Release year"
                    value={searchParams.year}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="album"
                    className="text-sm font-medium text-foreground"
                  >
                    Album
                  </label>
                  <Input
                    id="album"
                    name="album"
                    placeholder="Album name"
                    value={searchParams.album}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <Button
                onClick={handleSearch}
                className="w-full gap-2"
                disabled={loading || isSearching}
              >
                {isSearching ? (
                  <span>Searching...</span>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
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
                    {searchResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Image
                            src={
                              result.image_url ||
                              "/placeholder.svg?height=100&width=100"
                            }
                            alt={result.title}
                            width={50}
                            height={50}
                            className="rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {result.title}
                        </TableCell>
                        <TableCell>{result.artist}</TableCell>
                        <TableCell>{result.album}</TableCell>
                        <TableCell>{result.year}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSubscribe(result)}
                            className="text-green-500 hover:text-green-700"
                            aria-label="Subscribe to song"
                            disabled={loading}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {noResults && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="text-center">
                    <h3 className="mt-2 text-xl font-semibold">No Results</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try adjusting your search criteria.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
