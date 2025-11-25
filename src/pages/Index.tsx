import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { Building2, Users, Handshake, Award, Target, Eye, Lightbulb, Star, Mail, MapPin, Phone, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Building the Future of Construction
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Connecting architects, builders, engineers, and designers with AI-powered tools and trusted suppliers.
              </p>
              <div className="flex gap-4">
                <Link to="/design-iq">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">Get Started</Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline">Learn More</Button>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="Modern construction building" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-8">Trusted by leading companies across India</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                <Building2 className="w-8 h-8" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About ArQonZ</h2>
            <p className="text-muted-foreground leading-relaxed">
              ArQonZ is India's first AI-powered platform revolutionizing the construction and design industry. 
              Founded in 2022, we've built a comprehensive ecosystem that brings together architects, builders, 
              engineers, and suppliers in a single platform. Our suite of AI tools including BDQ Quotes, 
              e-Negotiations, and AOQI AI Agent collectively streamline how construction projects are planned, 
              designed, and executed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
                <p className="text-muted-foreground text-sm">
                  To create a seamless digital ecosystem that transforms India's construction industry through innovative technology.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                <p className="text-muted-foreground text-sm">
                  To connect construction professionals with compatible tools and reliable vendors, empowering seamless project execution.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Our Values</h3>
                <p className="text-muted-foreground text-sm">
                  Innovation, Quality, transparency, and collaboration drive everything we do, ensuring the best for our users.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform offers a comprehensive suite of tools designed specifically for the construction and design industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Building2, title: "BDQ Quotes", desc: "Generate detailed Bill of Quantities with our AI-powered tool that saves time and reduces errors in estimation." },
              { icon: Handshake, title: "e-Negotiations", desc: "Streamline procurement with our digital platform. Compare quotes, track communications, and secure the best deals." },
              { icon: Users, title: "AOQI AI Assistant", desc: "Your 24/7 construction companion with answers, technical guidance, creative recommendations, and project insights." },
              { icon: Award, title: "Verified Suppliers", desc: "Access our network of pre-vetted suppliers with quality assurance and reliability for stress-free project completion." },
              { icon: Target, title: "Nationwide Network", desc: "Connect with construction professionals across India. Find architects, builders, engineers, and suppliers in every major metro." },
              { icon: Lightbulb, title: "Project Analytics", desc: "Gain insights from comprehensive project tracking and analytics that help you make data-driven decisions for future projects." },
            ].map((feature, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Getting started with ArQonZ is simple. Follow these three steps to transform your construction projects.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Join", desc: "Create your ArQonZ account and complete your profile to connect with your peers and access our suite of AI tools." },
              { step: "2", title: "Connect", desc: "Browse our network of professionals and suppliers. Use AI tools to optimize your workflow and find the best match for your needs." },
              { step: "3", title: "Build", desc: "Leverage your project with confidence. Use AI insights, verified suppliers, and collaborative tools to deliver excellence." },
            ].map((item, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground mb-6">{item.desc}</p>
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90">Start Your Journey</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Professionals Say</h2>
            <p className="text-muted-foreground">
              Hear from industry professionals who have transformed their construction projects with ArQonZ.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Ronak Shandy", role: "Architect", rating: 5, text: "ArQonZ has made my work so much easier. I can find all the materials I need in one place, and the AI tools help me visualize projects better." },
              { name: "Priya Patel", role: "Interior Designer", text: "ArQonZ is my go-to platform. The supplier network is reliable and the e-negotiation feature saves me time and money on every project." },
              { name: "Vikram Reddy", role: "Civil Engineer", text: "ArQonZ's AI assistant is like having a construction expert available 24/7. It has transformed how I approach complex projects." },
            ].map((testimonial, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-muted rounded-full"></div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Construction Projects?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of professionals across India who are building the future with ArQonZ.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" variant="secondary">Sign Up Now</Button>
            </Link>
            <Link to="/design-iq">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6" />
                <span className="text-lg font-bold">ArQonZ</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                India's first AI-powered platform for the construction and design industry.
              </p>
              <div className="flex gap-3">
                <Twitter className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                <Linkedin className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                <Facebook className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                <Instagram className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
                <li><Link to="/design-iq" className="hover:text-primary transition-colors">Features</Link></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a></li>
                <li><Link to="/products" className="hover:text-primary transition-colors">Marketplace</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">GDPR Compliance</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>123 Tech Park, Whitefield, Bangalore - 560066</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>info@arqonz.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 ArQonZ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
