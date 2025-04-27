import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, ExternalLink, Search, Instagram } from "lucide-react";
import { Partner, PartnerType } from "@/models/Partner";
import { getPartners } from "@/services/partnerService";
import { useToast } from "@/components/ui/use-toast";

export default function PartnerDirectory() {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState<PartnerType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPartners() {
      try {
        setLoading(true);
        const data = await getPartners();
        setPartners(data);
      } catch (error) {
        console.error("Error loading partners:", error);
        toast({
          title: "Error",
          description: "Failed to load partners. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadPartners();
  }, [toast]);

  const filteredPartners = partners.filter((partner) => {
    // Apply type filter
    if (activeFilter !== "all" && partner.type !== activeFilter) {
      return false;
    }

    // Apply search filter
    if (
      searchQuery &&
      !partner.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <section className="py-16 bg-[#f5f5f7] text-center">
      <h2 className="text-4xl font-semibold tracking-tight mb-1">
        Partner Directory
      </h2>
      <h3 className="text-xl font-medium text-gray-500 mb-8">
        Discover our network of participating venues, shops, brands and
        suppliers
      </h3>

      <div className="max-w-6xl mx-auto px-4">
        {/* Search and Filter Controls */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              onClick={() => setActiveFilter("all")}
              className="rounded-full"
            >
              All
            </Button>
            <Button
              variant={activeFilter === "court" ? "default" : "outline"}
              onClick={() => setActiveFilter("court")}
              className="rounded-full"
            >
              Courts
            </Button>
            <Button
              variant={activeFilter === "shop" ? "default" : "outline"}
              onClick={() => setActiveFilter("shop")}
              className="rounded-full"
            >
              Shops
            </Button>
            <Button
              variant={activeFilter === "brand" ? "default" : "outline"}
              onClick={() => setActiveFilter("brand")}
              className="rounded-full"
            >
              Brands
            </Button>
            <Button
              variant={activeFilter === "other" ? "default" : "outline"}
              onClick={() => setActiveFilter("other")}
              className="rounded-full"
            >
              Other
            </Button>
          </div>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search partners..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Partner Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading state
            Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden border-none shadow-md bg-white"
              >
                <div className="h-40 bg-gray-200 animate-pulse"></div>
                <CardHeader className="pb-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredPartners.length > 0 ? (
            filteredPartners.map((partner) => (
              <Card
                key={partner.id}
                className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-white"
              >
                <div className="h-40 bg-gray-100 relative">
                  <img
                    src={partner.imageUrl || partner.image}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 rounded-full">
                    {partner.type === "court"
                      ? "Court"
                      : partner.type === "shop"
                        ? "Shop"
                        : partner.type === "brand"
                          ? "Brand"
                          : "Other"}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold">
                    {partner.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {partner.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{partner.location}</span>
                      </div>
                    )}
                    {partner.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{partner.phone}</span>
                      </div>
                    )}
                    {partner.website && (
                      <div className="flex items-center text-sm text-blue-600 hover:underline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit website
                        </a>
                      </div>
                    )}
                    {partner.socialMediaLink && (
                      <div className="flex items-center text-sm text-blue-600 hover:underline">
                        <Instagram className="h-4 w-4 mr-2" />
                        <a
                          href={partner.socialMediaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Social media
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="border-t pt-3">
                    <h4 className="font-medium text-sm mb-2">
                      Member Benefits:
                    </h4>
                    {partner.memberBenefit ? (
                      <p className="text-sm text-gray-600">
                        {partner.memberBenefit}
                      </p>
                    ) : (
                      <ul className="space-y-1">
                        {partner.discounts.map((discount, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 flex items-start"
                          >
                            <span className="mr-2">•</span>
                            <span>
                              {typeof discount === "string"
                                ? discount
                                : discount.description}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">
                No partners found matching your criteria.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setActiveFilter("all");
                  setSearchQuery("");
                }}
                className="mt-2"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
