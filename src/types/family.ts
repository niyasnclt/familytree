export interface FamilyNodeType {
  name: string;
  wife?: string;
  wives?: Array<{ name: string; children: any[] }>;
  children?: any[];
  relationship?: string;
}

export interface FamilyData {
  main_family: {
    name: string;
    wives: Array<{ name: string; children: any[] }>;
  };
  other_family_members: FamilyNodeType[];
  second_generation?: any[];
}
