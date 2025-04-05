"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, LogOut, X, Plus } from "lucide-react";

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

// Mock data for demonstration purposes
const mockUser = {
  user_name: "JohnDoe0",
};

const mockSubscriptions = [
  {
    id: "1",
    title: "Rivers of Babylon",
    artist: "Boney M.",
    year: "1978",
    album: "Nightflight to Venus",
    image_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    title: "Fearless",
    artist: "Taylor Swift",
    year: "2008",
    album: "Fearless",
    image_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "1",
    title: "Rivers of Babylon",
    artist: "Boney M.",
    year: "1978",
    album: "Nightflight to Venus",
    image_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    title: "Fearless",
    artist: "Taylor Swift",
    year: "2008",
    album: "Fearless",
    image_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "1",
    title: "Rivers of Babylon",
    artist: "Boney M.",
    year: "1978",
    album: "Nightflight to Venus",
    image_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    title: "Fearless",
    artist: "Taylor Swift",
    year: "2008",
    album: "Fearless",
    image_url: "/placeholder.svg?height=100&width=100",
  },
];

export default function MainPage() {
  const router = useRouter();
  const [user] = useState(mockUser);
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [searchResults, setSearchResults] = useState<any>([]);
  const [searchParams, setSearchParams] = useState({
    title: "",
    artist: "",
    year: "",
    album: "",
  });
  const [noResults, setNoResults] = useState(false);

  const handleLogout = () => {
    // In a real implementation, this would clear the session/auth state
    router.replace("/signin");
  };

  const handleRemoveSubscription = (id: any) => {
    // In a real implementation, this would call the API to remove the subscription
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  const handleSearch = () => {
    // Check if at least one field is filled
    const hasQuery = Object.values(searchParams).some(
      (param) => param.trim() !== ""
    );

    if (!hasQuery) {
      alert("Please fill at least one search field");
      return;
    }

    // Mock search functionality
    // In a real implementation, this would query DynamoDB through API Gateway and Lambda
    const mockResults = [
      {
        id: "3",
        title: "Rivers of Babylon",
        artist: "The Melodians",
        year: "1970",
        album: "Rivers of Babylon",
        image_url: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "4",
        title: "White Blood Cells",
        artist: "The White Stripes",
        year: "2001",
        album: "White Blood Cells",
        image_url: "/placeholder.svg?height=100&width=100",
      },
    ];

    // Simple filtering logic for demonstration
    const filteredResults = mockResults.filter((item) => {
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
          item.album.toLowerCase().includes(searchParams.album.toLowerCase()))
      );
    });

    setSearchResults(filteredResults);
    setNoResults(filteredResults.length === 0);
  };

  const handleSubscribe = (song: any) => {
    // Check if already subscribed
    if (subscriptions.some((sub) => sub.id === song.id)) {
      alert("You are already subscribed to this song");
      return;
    }

    // In a real implementation, this would call the API to add the subscription
    setSubscriptions([...subscriptions, song]);
  };

  const handleInputChange = (e: any) => {
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
            <h2 className="text-2xl font-bold tracking-tight">
              Your Subscriptions
            </h2>
            {subscriptions.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">
                  You haven't subscribed to any songs yet. Use the query area to
                  find and subscribe to songs.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptions.slice(0, 5).map((subscription) => (
                  <Card key={subscription.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Image
                          src={subscription.image_url || "/placeholder.svg"}
                          alt={`${subscription.artist} - ${subscription.album}`}
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                        />
                        <div className="flex-1 space-y-1">
                          <h3 className="font-medium">{subscription.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Artist: {subscription.artist}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Album: {subscription.album}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Year: {subscription.year}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleRemoveSubscription(subscription.id)
                          }
                          className="h-8 gap-1"
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Query Area */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Find Music</h2>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title
                    </label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter song title"
                      value={searchParams.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="artist" className="text-sm font-medium">
                      Artist
                    </label>
                    <Input
                      id="artist"
                      name="artist"
                      placeholder="Enter artist name"
                      value={searchParams.artist}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="year" className="text-sm font-medium">
                      Year
                    </label>
                    <Input
                      id="year"
                      name="year"
                      placeholder="Enter release year"
                      value={searchParams.year}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="album" className="text-sm font-medium">
                      Album
                    </label>
                    <Input
                      id="album"
                      name="album"
                      placeholder="Enter album name"
                      value={searchParams.album}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <Button onClick={handleSearch} className="w-full gap-2">
                  <Search className="h-4 w-4" />
                  Query
                </Button>
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Search Results</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Album</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((result: any) => (
                      <TableRow key={result.id}>
                        <TableCell>
                          <Image
                            src={result.image_url || "/placeholder.svg"}
                            alt={`${result.artist} - ${result.album}`}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          />
                        </TableCell>
                        <TableCell>{result.title}</TableCell>
                        <TableCell>{result.artist}</TableCell>
                        <TableCell>{result.album}</TableCell>
                        <TableCell>{result.year}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSubscribe(result)}
                            className="h-8 gap-1"
                          >
                            <Plus className="h-4 w-4" />
                            Subscribe
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* No Results Message */}
            {noResults && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">
                  No result is retrieved. Please query again.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
