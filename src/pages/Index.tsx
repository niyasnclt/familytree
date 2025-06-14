import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const familyData = {
  main_family: {
    name: "Ahmed Kutty (Narimukkukkil Ayi Mutti)",
    wives: [
      {
        name: "Kootil Ayishabhi",
        children: ["Muhammad (Valiya Kutti Mon)", "Abdullah Koya", "Ummer", "Kunjeevi"]
      },
      {
        name: "Fathima (Puthiyarele)",
        children: [
          "Abubackar",
          "Fathima",
          "Iyyathutti",
          {
            name: "Hasan",
            wife: "Ayishabi Mol",
            children: ["Saffiya", "Rasheed", "Asharaf", {
              name: "Niyas",
              wife: "Hiba",
              children: ["Nuha Mariyam", "Hazim", "Nazeeh"]
            }]
          },
          "Kunjan",
          "Ummukulsum",
          "Hamsa",
          "Ramlabi"
        ]
      },
      {
        name: "Nafeesa (Naduvattam)",
        children: ["Pennu", "Kutti Mol", "Koya", "Safiya", "Azeez"]
      },
      {
        name: "Kauja",
        children: ["Kunjan", "Jameela", "Suba", "Silu"]
      }
    ]
  },
  other_family_members: [
    {
      name: "Kiriyaadath Kunjae Mutti Haji",
      wife: "Thithikutty Hajjumma",
      children: ["Kutti Mon", "Cheriyaaka", "Abu", "Malu", "Kunjan", "Ayisha Mol"],
      relationship: "Sibling of Ahmed Kutty"
    },
    {
      name: "Thottol Mammais Kutti",
      wives: [
        {
          name: "Aamina",
          children: ["Koya Kutti", "Nabeesa", "Majeed", "Bichimol", "Suharaabi"]
        },
        {
          name: "Kachallama",
          children: ["Sulayya", "Abu", "Nabeesu", "Basheer", "Musthu", "Ashraf"]
        }
      ],
      relationship: "Sibling of Ahmed Kutty"
    }
  ],
  second_generation: [
    {
      husband: "Hasan",
      wife: "Ayishabi Mol",
      children: ["Saffiya", "Rasheed", "Asharaf", "Niyas"]
    }
  ]
};

interface PersonCardProps {
  name: string;
  relationship: string;
  searchTerm: string;
  hasImage?: boolean;
}

const PersonCard: React.FC<PersonCardProps & { selectedPerson?: string, personRefs?: any }> = ({ name, relationship, searchTerm, hasImage = false, selectedPerson, personRefs }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (personRefs) {
      personRefs.current[name] = ref.current;
    }
  }, [name, personRefs]);

  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
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

interface WifesSectionProps {
  wives: any[];
  searchTerm: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const WivesSection: React.FC<WifesSectionProps & { openWifeIndexes: any, setOpenWifeIndexes: any, selectedPerson?: string, personRefs?: any }> = ({ wives, searchTerm, isExpanded, onToggle, openWifeIndexes, setOpenWifeIndexes, selectedPerson, personRefs }) => {
  const [openWifeIndexesLocal, setOpenWifeIndexesLocal] = useState<{[key:number]: boolean}>({});

  const toggleWifeSection = (index: number, subIndex?: number) => {
    const key = subIndex !== undefined ? `${index}-${subIndex}` : `${index}`;
    setOpenWifeIndexes((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

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
          {wives.map((wife, wifeIndex) => (
            <div key={wifeIndex} className="space-y-3">
              <PersonCard 
                name={wife.name} 
                relationship="Wife" 
                searchTerm={searchTerm}
                selectedPerson={selectedPerson}
                personRefs={personRefs}
              />
              <Collapsible open={!!openWifeIndexes[`${wifeIndex}`]} onOpenChange={() => toggleWifeSection(wifeIndex)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mb-2 text-blue-700"
                  >
                    {openWifeIndexes[`${wifeIndex}`] ? <ChevronUp className="inline w-4 h-4 mr-1" /> : <ChevronDown className="inline w-4 h-4 mr-1" />}
                    {openWifeIndexes[`${wifeIndex}`] ? 'Hide Children' : 'Show Children'}
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
                          pathArr={[wife.name]}
                        />
                      ))}
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Recursive component to render a person (string or object) and their descendants
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

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    mainFamily: true,
    otherMembers: true
  });
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const personRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const [openWifeIndexes, setOpenWifeIndexes] = useState<{[key: string]: boolean}>({});

  // Helper to find and expand all parent nodes for a given person
  useEffect(() => {
    if (!selectedPerson) return;

    // Helper to find the path of keys to the selected person
    function findPath(node, target, path = []) {
      if (!node) return null;
      if (typeof node === 'string') {
        if (node === target) return [...path];
        return null;
      }
      if (node.name === target) return [...path, node.name];
      if (node.wife && node.wife === target) return [...path, node.name];
      if (Array.isArray(node.children)) {
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          const result = findPath(child, target, [...path, node.name]);
          if (result) return result;
        }
      }
      return null;
    }

    // Open all collapsibles along the path
    function openPath(pathArr) {
      if (!Array.isArray(pathArr)) return;
      // Open all except the last (the person node itself)
      pathArr.slice(0, -1).forEach(key => {
        if (key) setOpenWifeIndexes(prev => ({ ...prev, [key]: true }));
      });
    }

    // Main family wives
    familyData.main_family.wives.forEach(wife => {
      const path = findPath(wife, selectedPerson, [wife.name]);
      if (path) {
        setExpandedSections(prev => ({ ...prev, mainFamily: true, mainFamilyWives: true }));
        openPath(path);
      }
    });
    // Other family members
    familyData.other_family_members.forEach((member, memberIdx) => {
      if (member.wives) {
        member.wives.forEach((wife, wifeIdx) => {
          const path = findPath(wife, selectedPerson, [`sibling${memberIdx}-${wifeIdx}`]);
          if (path) {
            setExpandedSections(prev => ({ ...prev, otherMembers: true }));
            openPath(path);
          }
        });
      }
      if (member.children) {
        member.children.forEach(child => {
          const path = findPath(child, selectedPerson, [`sibling${memberIdx}`]);
          if (path) {
            setExpandedSections(prev => ({ ...prev, otherMembers: true }));
            openPath(path);
          }
        });
      }
      if (member.wife && member.wife === selectedPerson) {
        setExpandedSections(prev => ({ ...prev, otherMembers: true }));
      }
    });
  }, [selectedPerson]);

  useEffect(() => {
    if (selectedPerson) {
      // Wait for DOM update after expanding nodes
      setTimeout(() => {
        if (personRefs.current[selectedPerson]) {
          personRefs.current[selectedPerson]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Force a second scroll after another short delay to ensure visibility
        setTimeout(() => {
          if (personRefs.current[selectedPerson]) {
            personRefs.current[selectedPerson]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 400);
      }, 400); // 400ms delay to allow collapsibles to open and animate
    }
  }, [selectedPerson]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const collectNames = (node: any): string[] => {
    if (!node) return [];
    if (typeof node === 'string') return [node];
    let names: string[] = [];
    if (node.name) names.push(node.name);
    if (node.wife) names.push(node.wife);
    if (Array.isArray(node.children)) {
      node.children.forEach(child => {
        names.push(...collectNames(child));
      });
    }
    return names;
  };

  const allNames = useMemo(() => {
    let names: string[] = [];
    // Main family head
    names.push(familyData.main_family.name);
    // Main family wives and descendants
    familyData.main_family.wives.forEach(wife => {
      names.push(wife.name);
      if (wife.children) {
        wife.children.forEach(child => {
          names.push(...collectNames(child));
        });
      }
    });
    // Other family members
    familyData.other_family_members.forEach(member => {
      names.push(member.name);
      if (member.wife) names.push(member.wife);
      if (member.wives) {
        member.wives.forEach(wife => {
          names.push(wife.name);
          if (wife.children) {
            wife.children.forEach(child => {
              names.push(...collectNames(child));
            });
          }
        });
      }
      if (member.children) {
        member.children.forEach(child => {
          names.push(...collectNames(child));
        });
      }
    });
    return names;
  }, [familyData]);

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    
    return allNames.filter(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allNames]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">Narimukkil Family</h1>
          <p className="text-blue-100 text-lg">Discover our family heritage and connections</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search Section */}
        <Card className="mb-8 border-blue-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Search className="w-5 h-5 text-blue-700" />
              <h2 className="text-xl font-semibold text-blue-900">Search Family Members</h2>
            </div>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Type a name..."
              className="mb-4"
            />
            {filteredResults && (
              <div className="space-y-2">
                {filteredResults.map((name, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    className="w-full text-left justify-start"
                    onClick={() => setSelectedPerson(name)}
                  >
                    {name}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Family Section */}
        <Card className="mb-8 border-blue-200 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-900">Ahmed Kutty's Family</h2>
              <Button
                variant="ghost"
                onClick={() => toggleSection('mainFamily')}
                className="text-blue-700 hover:bg-blue-100"
              >
                {expandedSections.mainFamily ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto w-full py-4">
              <div className="flex flex-row items-start min-w-[900px] gap-8">
                {/* Main Family Head */}
                <div className="flex flex-col items-center min-w-[200px]">
                  <PersonCard
                    name={familyData.main_family.name}
                    relationship="Family Head"
                    searchTerm={searchTerm}
                    selectedPerson={selectedPerson}
                    personRefs={personRefs}
                  />
                  {/* Wives and descendants */}
                  <div className="mt-4 space-y-8">
                    {expandedSections.mainFamily && (
                      <WivesSection
                        wives={familyData.main_family.wives}
                        searchTerm={searchTerm}
                        isExpanded={expandedSections.mainFamilyWives || false}
                        onToggle={() => toggleSection('mainFamilyWives')}
                        openWifeIndexes={openWifeIndexes}
                        setOpenWifeIndexes={setOpenWifeIndexes}
                        selectedPerson={selectedPerson}
                        personRefs={personRefs}
                      />
                    )}
                  </div>
                </div>
                {/* Siblings and other family members can be rendered in similar horizontally scrollable columns if needed */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Other Family Members Section */}
        <Card className="border-blue-200 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-900">Ahmed Kutty's Siblings</h2>
              <Button
                variant="ghost"
                onClick={() => toggleSection('otherMembers')}
                className="text-blue-700 hover:bg-blue-100"
              >
                {expandedSections.otherMembers ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {expandedSections.otherMembers && (
              <div className="space-y-8 animate-fade-in">
                {familyData.other_family_members.map((member, index) => (
                  <div key={index} className="space-y-4">
                    <PersonCard 
                      name={member.name} 
                      relationship={member.relationship || "Family Member"} 
                      searchTerm={searchTerm}
                      selectedPerson={selectedPerson}
                      personRefs={personRefs}
                    />
                    
                    <div className="ml-8 border-l-2 border-blue-200 pl-6 space-y-4">
                      {/* Single wife */}
                      {member.wife && (
                        <div className="space-y-2">
                          <PersonCard 
                            name={member.wife} 
                            relationship="Wife" 
                            searchTerm={searchTerm}
                          />
                          {member.children && !member.wives && (
                            <Collapsible>
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" size="sm" className="mb-2 text-blue-700">
                                  <ChevronDown className="inline w-4 h-4 mr-1" /> Show Children
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="ml-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
                                  {member.children.map((child: string, childIndex: number) => (
                                    <PersonCard 
                                      key={childIndex}
                                      name={child} 
                                      relationship="Child" 
                                      searchTerm={searchTerm}
                                    />
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          )}
                        </div>
                      )}
                      
                      {/* Multiple wives */}
                      {member.wives && (
                        <div className="space-y-4">
                          {member.wives.map((wife: any, wifeIndex: number) => (
                            <div key={wifeIndex} className="space-y-3">
                              <PersonCard 
                                name={wife.name} 
                                relationship="Wife" 
                                searchTerm={searchTerm}
                                selectedPerson={selectedPerson}
                                personRefs={personRefs}
                              />
                              <Collapsible open={!!openWifeIndexes[`sibling${index}-${wifeIndex}`]} onOpenChange={() => setOpenWifeIndexes(prev => ({ ...prev, [`sibling${index}-${wifeIndex}`]: !prev[`sibling${index}-${wifeIndex}`] }))}>
                                <CollapsibleTrigger asChild>
                                  <Button variant="outline" size="sm" className="mb-2 text-blue-700">
                                    {openWifeIndexes[`sibling${index}-${wifeIndex}`] ? <ChevronUp className="inline w-4 h-4 mr-1" /> : <ChevronDown className="inline w-4 h-4 mr-1" />}
                                    {openWifeIndexes[`sibling${index}-${wifeIndex}`] ? 'Hide Children' : 'Show Children'}
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  {wife.children && wife.children.length > 0 ? (
                                    <div className="ml-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
                                      {wife.children.map((child: string, childIndex: number) => (
                                        <PersonCard 
                                          key={childIndex}
                                          name={child} 
                                          relationship="Child" 
                                          searchTerm={searchTerm}
                                          selectedPerson={selectedPerson}
                                          personRefs={personRefs}
                                        />
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="ml-6 text-blue-500 text-sm">No children listed.</div>
                                  )}
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Future Generations Placeholder */}
        <Card className="mt-8 border-dashed border-2 border-blue-300 bg-blue-50/50">
          <CardContent className="p-8 text-center">
            <div className="text-blue-600">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Future Generations</h3>
              <p className="text-sm opacity-75">This section is ready for additional family members and generations</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
