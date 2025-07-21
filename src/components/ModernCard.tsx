
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface ModernCardProps {
  image?: string;
  date: string;
  title: string;
  description: string;
  onReadMore?: () => void;
  className?: string;
}

const ModernCard = ({ 
  image, 
  date, 
  title, 
  description, 
  onReadMore,
  className = ""
}: ModernCardProps) => {
  return (
    <Card className={`overflow-hidden bg-white rounded-3xl shadow-xl border-0 ${className}`}>
      <CardContent className="p-8">
        <div className="flex gap-8 items-start">
          {/* Left side - Image */}
          <div className="flex-shrink-0">
            <div className="w-64 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 shadow-lg">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm"></div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex-1 space-y-6">
            {/* Date */}
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">{date}</span>
            </div>

            {/* Title */}
            <h3 className="text-3xl font-bold text-gray-900 leading-tight">
              {title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              {description}
            </p>

            {/* Read More Button */}
            <Button 
              onClick={onReadMore}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              READ MORE
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernCard;
