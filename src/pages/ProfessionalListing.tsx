import { useState } from "react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfessionalListing() {
  const navigate = useNavigate();
  const [talentBadgeOpen, setTalentBadgeOpen] = useState(true);
  const [hourlyRateOpen, setHourlyRateOpen] = useState(true);
  const [locationOpen, setLocationOpen] = useState(true);
  const [timeZoneOpen, setTimeZoneOpen] = useState(true);
  const [talentTypeOpen, setTalentTypeOpen] = useState(true);

  const professionals = [
    {
      id: 1,
      name: "Rahul J.",
      title: "Top-Rated SEO Expert | AEO, GEO, Local SEO, On-Page & Off-Page SEO",
      location: "India",
      hourlyRate: "$6/hr",
      jobSuccess: 93,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      boosted: true,
      available: true,
      consultations: true,
      skills: ["SEO Backlinking", "Search Engine Optimization", "Shopify SEO", "Yoast SEO", "Technical SEO", "Local SEO"],
      description: "Top-Rated SEO Expert | 10+ Years Experience | AI SEO, GEO, Local SEO & Full Spectrum Optimization Hi, I'm Rahul, a highly rated SEO Specialist with over 10+ years of experience helping businesses improve Google Rankings, grow organic...",
      badge: "Top Rated Plus"
    },
    {
      id: 2,
      name: "Giang P.",
      title: "Professional Video Editor | Instagram | YouTube | TikTok Reels",
      location: "Vietnam",
      hourlyRate: "$15/hr",
      jobSuccess: 93,
      earned: "$10K+",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      boosted: false,
      available: true,
      consultations: false,
      skills: ["Video Editing", "2D Animation", "Video Post-Editing", "Film & Video", "Video Color Correction", "Video Editing Software"],
      description: "Hi there! I'm Giang Pham, a full-time professional video editor with many years of experience helping creators, brands, and businesses tell their stories through engaging and high-performing video content. I specialize in creating scroll-stopping edits fo...",
      badge: "Top Rated"
    },
    {
      id: 3,
      name: "Muhammad S.",
      title: "Web Designer and Developer - WordPress, Webflow, Shopify, Wix",
      location: "Pakistan",
      hourlyRate: "$12/hr",
      jobSuccess: 95,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      boosted: true,
      available: false,
      consultations: false,
      skills: ["WordPress", "Webflow", "Shopify", "Wix", "Web Design", "Responsive Design"],
      description: "Experienced web designer and developer specializing in creating beautiful, functional websites. Over 8 years of experience with WordPress, Webflow, Shopify, and Wix platforms...",
      badge: "Rising Talent"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-4 items-center max-w-4xl">
            <div className="flex-1 relative">
              <Input
                type="search"
                placeholder="Search"
                className="w-full pl-10 h-12 rounded-full border-2"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
            </div>
            <Button variant="link" className="text-green-600 hover:text-green-700">
              Advanced search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Talent Badge Filter */}
            <Card>
              <CardContent className="p-4">
                <button
                  onClick={() => setTalentBadgeOpen(!talentBadgeOpen)}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Talent badge</span>
                    <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs">?</span>
                  </div>
                  {talentBadgeOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {talentBadgeOpen && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox id="top-rated-plus" />
                      <label htmlFor="top-rated-plus" className="flex items-center gap-2 cursor-pointer">
                        <span className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center">⭐</span>
                        <span className="text-sm">Top Rated Plus</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="top-rated" />
                      <label htmlFor="top-rated" className="flex items-center gap-2 cursor-pointer">
                        <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">⭐</span>
                        <span className="text-sm">Top Rated</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="rising-talent" />
                      <label htmlFor="rising-talent" className="flex items-center gap-2 cursor-pointer">
                        <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">↗</span>
                        <span className="text-sm">Rising Talent</span>
                      </label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hourly Rate Filter */}
            <Card>
              <CardContent className="p-4">
                <button
                  onClick={() => setHourlyRateOpen(!hourlyRateOpen)}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="font-semibold">Hourly rate</span>
                  {hourlyRateOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {hourlyRateOpen && (
                  <div className="space-y-3">
                    <div className="text-right text-sm font-semibold">$100+</div>
                    <div className="flex items-end gap-1 h-32">
                      {[40, 60, 80, 50, 90, 70, 65, 55, 45, 40, 35, 30, 25].map((height, i) => (
                        <div key={i} className="flex-1 bg-green-500 rounded-t" style={{ height: `${height}%` }} />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>under $10</span>
                      <span>$100+</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location Filter */}
            <Card>
              <CardContent className="p-4">
                <button
                  onClick={() => setLocationOpen(!locationOpen)}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="font-semibold">Location</span>
                  {locationOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {locationOpen && (
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="City, country or region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="vietnam">Vietnam</SelectItem>
                      <SelectItem value="pakistan">Pakistan</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>

            {/* Talent Time Zones */}
            <Card>
              <CardContent className="p-4">
                <button
                  onClick={() => setTimeZoneOpen(!timeZoneOpen)}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="font-semibold">Talent time zones</span>
                  {timeZoneOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {timeZoneOpen && (
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select talent time zones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ist">IST (UTC+5:30)</SelectItem>
                      <SelectItem value="pst">PST (UTC-8)</SelectItem>
                      <SelectItem value="est">EST (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>

            {/* Talent Type */}
            <Card>
              <CardContent className="p-4">
                <button
                  onClick={() => setTalentTypeOpen(!talentTypeOpen)}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="font-semibold">Talent type</span>
                  {talentTypeOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {talentTypeOpen && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox id="freelancers-agencies" defaultChecked />
                      <label htmlFor="freelancers-agencies" className="text-sm cursor-pointer">
                        Freelancers & Agencies
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="freelancers" />
                      <label htmlFor="freelancers" className="text-sm cursor-pointer">
                        Freelancers
                      </label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Professional Listings */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Select defaultValue="best-match">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="best-match">Best Match</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {professionals.map((pro) => (
              <Card 
                key={pro.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/professionals/${pro.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Profile Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={pro.avatar}
                        alt={pro.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {pro.available && (
                        <div className="absolute -top-1 -left-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{pro.name}</h3>
                            {pro.boosted && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                                ⚡ Boosted
                              </Badge>
                            )}
                          </div>
                          <p className="text-base font-medium mb-1">{pro.title}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{pro.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <Heart className="w-5 h-5" />
                          </Button>
                          <Button className="bg-green-600 hover:bg-green-700">
                            Invite to job
                          </Button>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mb-3">
                        <span className="font-semibold">{pro.hourlyRate}</span>
                        <div className="flex items-center gap-1">
                          <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">👍</span>
                          <span className="font-medium">{pro.jobSuccess}% Job Success</span>
                        </div>
                        {pro.earned && (
                          <span className="font-medium">{pro.earned} earned</span>
                        )}
                        {pro.available && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            ⚡ Available now
                          </Badge>
                        )}
                        {pro.consultations && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            💬 Offers consultations
                          </Badge>
                        )}
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {pro.skills.slice(0, 6).map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {skill}
                          </Badge>
                        ))}
                        {pro.skills.length > 6 && (
                          <Badge variant="outline">+{pro.skills.length - 6}</Badge>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {pro.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
