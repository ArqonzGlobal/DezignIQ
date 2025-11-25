import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, MapPin, ExternalLink, MoreHorizontal, Heart, Play } from "lucide-react";

export default function ProfessionalProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");

  const professional = {
    id: 1,
    name: "Rahul J.",
    title: "Top-Rated SEO Expert | AEO, GEO, Local SEO, On-Page & Off-Page SEO",
    location: "Jaipur, India",
    timezone: "2:12 pm local time",
    hourlyRate: "$6.00/hr",
    language: "English +2",
    agency: "RankTuboSys ...",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    jobSuccess: 93,
    topRated: true,
    rating: 4.8,
    reviews: 271,
    totalJobs: 462,
    totalHours: "2.9K",
    available: true,
    verified: true,
    videoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=400&fit=crop",
    aboutDescription: "Hi, I'm Rahul, a highly rated SEO Specialist with over 10+ years of experience helping businesses improve Google Rankings, grow organic traffic, and scale digital performance with data-driven, white-hat strategies.",
    fullDescription: "I have completed over 459+ Successful SEO projects...",
    skills: ["SEO", "Local SEO", "Technical SEO", "Link Building", "On-Page SEO", "Off-Page SEO"],
    clientReviews: [
      {
        id: 1,
        title: "Off-page SEO work",
        date: "October 14, 2025",
        rating: 5.0,
        feedback: "Rahul has done a fantastic job. He has brought many of our key words onto the 1st page. Working with him was a breeze, thanks to his punctuality, politeness, and outstanding cooper..."
      },
      {
        id: 2,
        title: "Next month SEO",
        date: "October 13, 2025",
        rating: 5.0,
        feedback: "I've been working with Rahul for my website SEO and the results have been fantastic. My website traffic and rankings are growing every month. They're highly professional, pay great..."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button & View Full Profile */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="link" className="gap-2 text-green-600">
            View full profile <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Card */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <img
                      src={professional.avatar}
                      alt={professional.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto"
                    />
                    {professional.available && (
                      <div className="absolute top-2 left-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 rounded-full bg-white"
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  {professional.available && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 mb-3">
                      ⚡ Available now
                    </Badge>
                  )}

                  <h2 className="font-bold text-xl flex items-center justify-center gap-2">
                    {professional.name}
                    {professional.verified && (
                      <span className="text-blue-500">✓</span>
                    )}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {professional.title}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm">👍</span>
                      <span className="font-medium text-sm">{professional.jobSuccess}%</span>
                    </div>
                    <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
                      <span className="text-sm font-medium">⭐ Top Rated</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-medium text-sm">{professional.rating}</span>
                      <span className="text-xs text-muted-foreground">({professional.reviews})</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center justify-center gap-1 mt-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{professional.location} – {professional.timezone}</span>
                  </div>

                  {/* Jobs and Hours */}
                  <div className="grid grid-cols-2 gap-4 mt-4 py-4 border-y">
                    <div>
                      <div className="text-2xl font-bold">{professional.totalJobs}</div>
                      <div className="text-xs text-muted-foreground">Total jobs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{professional.totalHours}</div>
                      <div className="text-xs text-muted-foreground">Total hours</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 mt-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Hire
                  </Button>
                  <Button variant="outline" className="w-full">
                    Invite
                  </Button>
                  <Button variant="ghost" className="w-full">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Book Consultation */}
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-600">📞</span>
                    <span className="font-semibold text-sm">Book a consultation</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    $30 per 30 min Zoom meeting
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="about" 
                  className="rounded-full data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  About
                </TabsTrigger>
                <TabsTrigger value="feedback" className="rounded-full data-[state=active]:bg-black data-[state=active]:text-white">
                  Client feedback
                </TabsTrigger>
                <TabsTrigger value="work-history" className="rounded-full data-[state=active]:bg-black data-[state=active]:text-white">
                  Work history
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="rounded-full data-[state=active]:bg-black data-[state=active]:text-white">
                  Portfolio
                </TabsTrigger>
                <TabsTrigger value="employment" className="rounded-full data-[state=active]:bg-black data-[state=active]:text-white">
                  Employment history
                </TabsTrigger>
                <TabsTrigger value="skills" className="rounded-full data-[state=active]:bg-black data-[state=active]:text-white">
                  Skills
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold">About {professional.name}</h3>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <div className="font-semibold">{professional.hourlyRate}</div>
                          <div className="text-muted-foreground">Rate</div>
                        </div>
                        <div>
                          <div className="font-semibold">{professional.language}</div>
                          <div className="text-muted-foreground">Language</div>
                        </div>
                        <div>
                          <div className="font-semibold">{professional.agency}</div>
                          <div className="text-muted-foreground">Agency</div>
                        </div>
                      </div>
                    </div>

                    {/* Video Preview */}
                    <div className="relative mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 h-64">
                      <img
                        src={professional.videoUrl}
                        alt="Video preview"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-10 h-10 text-black ml-1" />
                        </div>
                      </div>
                      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg max-w-xs">
                        <p className="text-sm font-medium">
                          Hi, I am Rahul,<br />
                          your go-to Digital<br />
                          Marketing expert!
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="prose max-w-none">
                      <p className="text-sm mb-4">
                        <strong>🏆 Top-Rated SEO Expert | 10+ Years Experience | AI SEO, GEO, Local SEO & Full-Spectrum Optimization</strong>
                      </p>
                      <p className="text-sm mb-4">
                        {professional.aboutDescription}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {professional.fullDescription}
                        <Button variant="link" className="p-0 h-auto text-sm">
                          Show more
                        </Button>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Client Feedback Section */}
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">
                      Client feedback ({professional.clientReviews.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {professional.clientReviews.map((review) => (
                        <Card key={review.id} className="bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">{review.title}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-muted-foreground">📅 {review.date}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                                ))}
                                <span className="text-xs font-semibold ml-1">{review.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              "{review.feedback}"
                            </p>
                            <Button variant="link" className="p-0 h-auto text-xs text-green-600">
                              View more
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        &lt;
                      </Button>
                      <Button variant="default" size="icon" className="w-8 h-8 bg-black">
                        1
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        2
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        3
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        4
                      </Button>
                      <span className="text-sm">...</span>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        &gt;
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="feedback" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold">Client Feedback</h3>
                    <p className="text-muted-foreground mt-2">Detailed feedback content goes here...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="work-history" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold">Work History</h3>
                    <p className="text-muted-foreground mt-2">Work history content goes here...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold">Portfolio</h3>
                    <p className="text-muted-foreground mt-2">Portfolio content goes here...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="employment" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold">Employment History</h3>
                    <p className="text-muted-foreground mt-2">Employment history content goes here...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold">Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {professional.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
