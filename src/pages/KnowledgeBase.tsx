import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Home, Package, Users, Building, Hammer, Wand2, Calculator, MessageCircle, CreditCard } from "lucide-react";

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: Home,
      title: "Getting Started",
      items: [
        {
          question: "What is ArQonZ?",
          answer: "ArQonZ is a comprehensive platform connecting professionals, suppliers, and customers in the architecture, construction, and real estate industry. We provide tools for project management, product sourcing, professional networking, and AI-powered design solutions."
        },
        {
          question: "How do I create an account?",
          answer: "Click the 'Sign In' button in the top right corner, then select 'Sign Up'. Fill in your details including name, email, phone number, and create a password. You'll receive a verification email to activate your account."
        },
        {
          question: "Is ArQonZ free to use?",
          answer: "ArQonZ offers both free and premium features. Basic browsing, searching, and profile creation are free. Premium features like advanced AI tools require credits which can be purchased in packages."
        }
      ]
    },
    {
      icon: Package,
      title: "Products & Services",
      items: [
        {
          question: "How do I search for products?",
          answer: "Use the search bar at the top of the page or navigate to the Products section. You can filter by category, price range, location, and supplier ratings. Set your location for personalized results."
        },
        {
          question: "How do I contact a supplier?",
          answer: "Click on any product to view its details, then use the 'Contact Supplier' or 'Send Enquiry' button. You can also use the chat feature to communicate directly with verified suppliers."
        },
        {
          question: "Can I request custom quotes?",
          answer: "Yes! Navigate to the Deal Desk section where you can submit detailed requirements for custom quotes from multiple suppliers. You'll receive competitive bids within 24-48 hours."
        }
      ]
    },
    {
      icon: Users,
      title: "Professionals",
      items: [
        {
          question: "How do I find professionals?",
          answer: "Visit the Professionals section to browse architects, contractors, interior designers, and other experts. Filter by specialization, location, experience, and ratings. View portfolios and read verified reviews."
        },
        {
          question: "How do I hire a professional?",
          answer: "View the professional's profile, check their portfolio and reviews, then click 'Contact' or 'Request Quote'. Discuss your project requirements, timelines, and budget before finalizing the agreement."
        },
        {
          question: "Can professionals list their services?",
          answer: "Yes! Create a professional profile, complete your KYC verification, upload your portfolio, list your services and pricing. Enhanced profiles with premium features get better visibility."
        }
      ]
    },
    {
      icon: Building,
      title: "Properties & Projects",
      items: [
        {
          question: "How do I list a property?",
          answer: "Go to your Profile > Properties Management, click 'Add Property', fill in details including location, specifications, images, and pricing. Properties are reviewed within 24 hours before going live."
        },
        {
          question: "What types of projects can I share?",
          answer: "Share completed or ongoing projects including residential, commercial, interior design, landscaping, and renovation work. Include before/after photos, project descriptions, and team credits."
        },
        {
          question: "How do I track my projects?",
          answer: "Use the Projects Management dashboard in your profile to track project status, milestones, budgets, and team collaboration. Set reminders and generate reports."
        }
      ]
    },
    {
      icon: Wand2,
      title: "Dezign IQ (AI Tools)",
      items: [
        {
          question: "What are AI design tools?",
          answer: "Dezign IQ offers AI-powered tools including Interior AI, Exterior AI, Sketch to Image, Virtual Staging, Style Transfer, Render Enhancer, AI Eraser, 4K Upscaler, Inpainting AI, Video AI, and Prompt Generator."
        },
        {
          question: "How do credits work?",
          answer: "Each AI tool operation consumes credits. Purchase credit packages from Profile > Buy Credits. Different tools consume different amounts based on complexity. Credits never expire."
        },
        {
          question: "Can I download generated images?",
          answer: "Yes! All AI-generated images are available in your Image History (Profile > AQIQ Management) and can be downloaded in high resolution. You retain full commercial rights to your generated content."
        }
      ]
    },
    {
      icon: Calculator,
      title: "Construction Calculators",
      items: [
        {
          question: "What calculators are available?",
          answer: "We offer 20+ specialized calculators including brick, cement, concrete, mortar, grout, roofing, flooring, paint, electrical, plumbing, HVAC, and Vastu Shastra calculators. All calculations are based on industry standards."
        },
        {
          question: "How accurate are the calculations?",
          answer: "Our calculators use industry-standard formulas and include waste factors. However, always consult with professionals for critical projects. Results are estimates and actual requirements may vary."
        },
        {
          question: "Can I save calculator results?",
          answer: "Yes! Calculator results can be saved to your profile, exported as PDF, or shared with team members. You can also create material requirement lists for purchase."
        }
      ]
    },
    {
      icon: MessageCircle,
      title: "Communication & Support",
      items: [
        {
          question: "How do I contact support?",
          answer: "Use the floating chat widget on any page, send us a message via WhatsApp (click the green icon), or email support@arqonz.com. We respond within 2-4 hours during business hours."
        },
        {
          question: "Is there a mobile app?",
          answer: "ArQonZ is fully responsive and works seamlessly on mobile browsers. Native iOS and Android apps are coming soon. Add the website to your home screen for app-like experience."
        },
        {
          question: "How do I report an issue?",
          answer: "Report technical issues, inappropriate content, or violations through the 'Report' button on relevant pages, or contact support directly. All reports are reviewed within 24 hours."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Payments & Billing",
      items: [
        {
          question: "What payment methods are accepted?",
          answer: "We accept credit/debit cards, UPI, net banking, and digital wallets. All transactions are secured with SSL encryption and processed through trusted payment gateways."
        },
        {
          question: "What is the refund policy?",
          answer: "Unused credits can be refunded within 7 days of purchase. For service-related refunds, contact the professional or supplier directly. Refer to our Terms & Conditions for detailed refund policies."
        },
        {
          question: "How do I view my transaction history?",
          answer: "Go to Profile > Buy Credits to view all credit purchases and AI tool usage. For product/service transactions, check Profile > Requirements Management and Enquiries Management."
        }
      ]
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      searchQuery === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Knowledge Base</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of ArQonZ
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredCategories.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No results found. Try different keywords.</p>
              </CardContent>
            </Card>
          ) : (
            filteredCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-primary" />
                      {category.title}
                    </CardTitle>
                    <CardDescription>
                      {category.items.length} article{category.items.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.items.map((item, itemIndex) => (
                        <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                          <AccordionTrigger className="text-left hover:text-primary">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Contact Support */}
        <Card className="max-w-4xl mx-auto mt-12">
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
            <CardDescription>
              Can't find what you're looking for? Our support team is here to help.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:support@arqonz.com"
              className="flex-1 p-4 border rounded-lg hover:bg-muted/50 transition-colors text-center"
            >
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-semibold">Email Support</div>
              <div className="text-sm text-muted-foreground">support@arqonz.com</div>
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 p-4 border rounded-lg hover:bg-muted/50 transition-colors text-center"
            >
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-semibold">WhatsApp</div>
              <div className="text-sm text-muted-foreground">Chat with us</div>
            </a>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default KnowledgeBase;
