import { allowedRelationshipTypes, isConnectableConcept, relationshipTypes } from './relationship-rules';

describe('ArchiMate relationship rules', () => {
  it('allows Assignment, Serving, Association, Triggering, and Flow from BusinessRole to BusinessProcess', () => {
    expect(allowedRelationshipTypes('BusinessRole', 'BusinessProcess')).toEqual([
      'AssignmentRelationship',
      'ServingRelationship',
      'AssociationRelationship',
      'TriggeringRelationship',
      'FlowRelationship',
    ]);
  });

  it('allows only Association from BusinessObject to BusinessRole', () => {
    expect(allowedRelationshipTypes('BusinessObject', 'BusinessRole')).toEqual(['AssociationRelationship']);
  });

  it('reads the archimate: prefix the palette writes', () => {
    expect(allowedRelationshipTypes('archimate:BusinessRole', 'archimate:BusinessObject')).toEqual([
      'AccessRelationship',
      'AssociationRelationship',
    ]);
  });

  it('treats groups, notes, and unknown types as not connectable', () => {
    ['Group', 'Note', 'DiagramModelReference', 'Relationship', undefined].forEach(type => {
      expect(isConnectableConcept(type)).toBe(false);
    });
    expect(isConnectableConcept('BusinessRole')).toBe(true);
    expect(isConnectableConcept('Junction')).toBe(true);
    expect(allowedRelationshipTypes('Group', 'BusinessRole')).toEqual([]);
  });

  it('lists eleven relationship types in four groups', () => {
    expect(relationshipTypes).toHaveLength(11);
    expect(new Set(relationshipTypes.map(type => type.group))).toEqual(
      new Set(['Structural', 'Dependency', 'Dynamic', 'Other']),
    );
  });
});
