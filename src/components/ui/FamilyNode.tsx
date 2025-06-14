import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import PersonCard from './PersonCard';

const FamilyNode = ({
  node,
  relationship,
  searchTerm,
  selectedPerson,
  personRefs,
  openWifeIndexes,
  setOpenWifeIndexes,
  pathArr = []
}: {
  node: any,
  relationship: string,
  searchTerm: string,
  selectedPerson: string | null,
  personRefs: any,
  openWifeIndexes: any,
  setOpenWifeIndexes: any,
  pathArr?: string[]
}) => {
  if (typeof node === 'string') {
    return (
      <PersonCard
        name={node}
        relationship={relationship}
        searchTerm={searchTerm}
        selectedPerson={selectedPerson}
        personRefs={personRefs}
      />
    );
  }
  const key = pathArr.join('-');
  const hasSpouse = !!node.wife;
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  if (hasSpouse || hasChildren) {
    return (
      <div className="space-y-2">
        <PersonCard
          name={node.name}
          relationship={relationship}
          searchTerm={searchTerm}
          selectedPerson={selectedPerson}
          personRefs={personRefs}
        />
        <Collapsible open={!!openWifeIndexes[key]} onOpenChange={() => setOpenWifeIndexes((prev: any) => ({ ...prev, [key]: !prev[key] }))}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="mb-2 text-blue-700">
              {openWifeIndexes[key] ? <ChevronUp className="inline w-4 h-4 mr-1" /> : <ChevronDown className="inline w-4 h-4 mr-1" />}
              {openWifeIndexes[key] ? 'Hide Family' : 'Show Family'}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="ml-6 space-y-2">
              {hasSpouse && (
                <PersonCard
                  name={node.wife}
                  relationship="Wife"
                  searchTerm={searchTerm}
                  selectedPerson={selectedPerson}
                  personRefs={personRefs}
                />
              )}
              {hasChildren && (
                <div className="flex flex-row flex-wrap gap-4 animate-fade-in mt-2">
                  {node.children.map((child: any, idx: number) => (
                    <FamilyNode
                      key={typeof child === 'string' ? child : child.name}
                      node={child}
                      relationship="Child"
                      searchTerm={searchTerm}
                      selectedPerson={selectedPerson}
                      personRefs={personRefs}
                      openWifeIndexes={openWifeIndexes}
                      setOpenWifeIndexes={setOpenWifeIndexes}
                      pathArr={[...pathArr, node.name]}
                    />
                  ))}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }
  return (
    <PersonCard
      name={node.name}
      relationship={relationship}
      searchTerm={searchTerm}
      selectedPerson={selectedPerson}
      personRefs={personRefs}
    />
  );
};

export default FamilyNode;
