from pathlib import Path
import xml.etree.ElementTree as ET


root = Path(__file__).resolve().parents[1]
source = root / 'src' / 'relationships.xml'
output = root / 'src' / 'relationship-matrix.ts'
matrix = ET.parse(source).getroot()
sources = matrix.findall('source')
concepts = [source_node.attrib['concept'] for source_node in sources]
alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
key_sets = []
rows = []

for source_node in sources:
    targets = source_node.findall('target')
    target_concepts = [target.attrib['concept'] for target in targets]
    if target_concepts != concepts:
        raise SystemExit(f"Target concept order changed for {source_node.attrib['concept']}")

    row = []
    for target in targets:
        keys = target.attrib.get('relations', '').lower()
        if keys not in key_sets:
            key_sets.append(keys)
        key_index = key_sets.index(keys)
        if key_index >= len(alphabet):
            raise SystemExit('Relationship key combinations exceed the code alphabet')
        row.append(alphabet[key_index])
    rows.append(''.join(row))

lines = [
    '// Generated from relationships.xml; see that file for source and license.',
    'export const relationshipConcepts = [',
]
lines.extend(f"  '{concept}'," for concept in concepts)
lines.extend([
    '] as const;',
    '',
    f"export const relationshipKeyAlphabet = '{alphabet}';",
    'export const relationshipKeySets = [',
])
lines.extend(f"  '{keys}'," for keys in key_sets)
lines.extend([
    '];',
    '',
    'export const relationshipRows = [',
])
lines.extend(f"  '{row}'," for row in rows)
lines.extend([
    '];',
    '',
])

output.write_text('\n'.join(lines), encoding='utf-8')
print(f'Generated {output.relative_to(root)} from {source.relative_to(root)}')
