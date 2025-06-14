import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

interface PersonCardProps {
  name: string;
  relationship: string;
  searchTerm: string;
  hasImage?: boolean;
  selectedPerson?: string;
  personRefs?: any;
}

const PersonCard: React.FC<PersonCardProps> = ({ name, relationship, searchTerm, hasImage = false, selectedPerson, personRefs }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (personRefs) {
      personRefs.current[name] = ref.current;
    }
  }, [name, personRefs]);

  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">{part}</span>
      ) : part
    );
  };

  return (
    <div
      ref={ref}
      className={`transition-shadow ${selectedPerson === name ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <Card className="hover:shadow-md transition-all duration-200 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 flex items-center justify-center border-2 border-blue-300">
              {hasImage ? (
                <img src="/placeholder.svg" alt={name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-blue-700" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 text-sm">
                {highlightText(name, searchTerm)}
              </h3>
              <p className="text-xs text-blue-700 opacity-80">{relationship}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonCard;
