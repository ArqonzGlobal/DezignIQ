import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, History, TrendingUp, Check } from "lucide-react";

const creditPackages = [
  {
    credits: 100,
    price: 999,
    popular: false,
    features: ["Basic features", "Email support", "7-day validity"],
  },
  {
    credits: 500,
    price: 4499,
    popular: true,
    features: ["All basic features", "Priority support", "30-day validity", "10% bonus credits"],
  },
  {
    credits: 1000,
    price: 7999,
    popular: false,
    features: ["All premium features", "24/7 support", "90-day validity", "25% bonus credits"],
  },
];

const transactionHistory = [
  { id: "1", type: "purchase", credits: 500, amount: 4499, date: "2024-01-15", status: "completed" },
  { id: "2", type: "usage", credits: -50, description: "AI Image Generation", date: "2024-01-14" },
  { id: "3", type: "usage", credits: -25, description: "Premium Listing", date: "2024-01-13" },
];

export default function BuyCredits() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Buy Credits</h1>
        <p className="text-muted-foreground">Purchase credits for premium features</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Credits</p>
              <p className="text-2xl font-bold">425</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Purchased</p>
              <p className="text-2xl font-bold">1,500</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <History className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Used This Month</p>
              <p className="text-2xl font-bold">285</p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Credit Packages</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {creditPackages.map((pkg) => (
            <Card
              key={pkg.credits}
              className={`p-6 relative ${pkg.popular ? "border-primary border-2" : ""}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <p className="text-4xl font-bold mb-2">{pkg.credits}</p>
                <p className="text-muted-foreground">Credits</p>
                <p className="text-3xl font-bold mt-4">₹{pkg.price}</p>
                <p className="text-sm text-muted-foreground">₹{(pkg.price / pkg.credits).toFixed(2)} per credit</p>
              </div>
              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                Buy Now
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <div className="space-y-3">
          {transactionHistory.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium">
                  {transaction.type === "purchase" ? "Credit Purchase" : transaction.description}
                </p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold ${
                    transaction.credits > 0 ? "text-success" : "text-muted-foreground"
                  }`}
                >
                  {transaction.credits > 0 ? "+" : ""}
                  {transaction.credits} credits
                </p>
                {transaction.type === "purchase" && (
                  <p className="text-sm text-muted-foreground">₹{transaction.amount}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
