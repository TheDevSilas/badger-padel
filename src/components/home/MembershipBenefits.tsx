import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, ShoppingBag, Tag } from "lucide-react";

export default function MembershipBenefits() {
  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-4xl font-semibold tracking-tight mb-1">
        Membership Benefits
      </h2>
      <h3 className="text-xl font-medium text-gray-500 mb-8">
        Join Badger Padel and enjoy exclusive perks
      </h3>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="mx-auto bg-black rounded-full p-3 w-14 h-14 flex items-center justify-center mb-2">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-center">
              Tournament Discounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-base">
              Get exclusive discounts on tournament entry fees at participating
              venues across South Africa.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="mx-auto bg-black rounded-full p-3 w-14 h-14 flex items-center justify-center mb-2">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-center">
              Gear Discounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-base">
              Save on padel rackets, shoes, and accessories at our partner
              stores nationwide.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="mx-auto bg-black rounded-full p-3 w-14 h-14 flex items-center justify-center mb-2">
              <Tag className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-center">
              Merchandise Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-base">
              Enjoy special pricing on Badger Padel branded apparel and
              merchandise.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
