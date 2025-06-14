import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import PersonCard from './PersonCard';
import FamilyNode from './FamilyNode';

interface WifesSectionProps {
  wives: any[];
  searchTerm: string;
  isExpanded: boolean;
  onToggle: () => void;
  openWifeIndexes: any;
  setOpenWifeIndexes: any;
  selectedPerson?: string;
  personRefs?: any;
  pathArr?: string[];
}

const WivesSection: React.FC<WifesSectionProps> = ({ wives, searchTerm, isExpanded, onToggle, openWifeIndexes, setOpenWifeIndexes, selectedPerson, personRefs, pathArr = [] }) => {
  return (
    <div className="ml-8 border-l-2 border-blue-200 pl-6">
      <Button
        variant="ghost"
        onClick={onToggle}
        className="mb-4 text-blue-800 hover:bg-blue-100 p-2"
      >
        {isExpanded ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
        Wives ({wives.length})
      </Button>
      {isExpanded && (
        <div className="space-y-6 animate-fade-in">
          {wives.map((wife, wifeIndex) => {
            const wifeKeyArr = [...pathArr, wife.name];
            const wifeKey = wifeKeyArr.join('-');
            return (
              <div key={wifeIndex} className="space-y-3">
                <PersonCard 
                  name={wife.name} 
                  relationship="Wife" 
                  searchTerm={searchTerm}
                  selectedPerson={selectedPerson}
                  personRefs={personRefs}
                />
                <Collapsible open={!!openWifeIndexes[wifeKey]} onOpenChange={() => setOpenWifeIndexes((prev: any) => ({ ...prev, [wifeKey]: !prev[wifeKey] }))}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mb-2 text-blue-700"
                    >
                      {openWifeIndexes[wifeKey] ? <ChevronUp className="inline w-4 h-4 mr-1" /> : <ChevronDown className="inline w-4 h-4 mr-1" />}
                      {openWifeIndexes[wifeKey] ? 'Hide Children' : 'Show Children'}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {wife.children && wife.children.length > 0 && (
                      <div className="ml-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {wife.children.map((child: any, childIndex: number) => (
                          <FamilyNode
                            key={typeof child === 'string' ? child : child.name}
                            node={child}
                            relationship="Child"
                            searchTerm={searchTerm}
                            selectedPerson={selectedPerson}
                            personRefs={personRefs}
                            openWifeIndexes={openWifeIndexes}
                            setOpenWifeIndexes={setOpenWifeIndexes}
                            pathArr={wifeKeyArr}
                          />
                        ))}
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WivesSection;
