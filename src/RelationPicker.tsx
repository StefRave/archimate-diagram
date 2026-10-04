import { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { relationshipTypeInfo, RelationshipTypeInfo, RelationshipGroup } from './relationship-rules';

export type RelationPickerProps = {
  sourceName: string;
  targetName: string;
  relationshipTypes: string[];
  x: number;
  y: number;
  onPreview: (type: string | null) => void;
  onPick: (type: string) => void;
  onCancel: () => void;
};

const groupOrder: RelationshipGroup[] = ['Structural', 'Dependency', 'Dynamic', 'Other'];

export function RelationPicker(props: RelationPickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState(props.relationshipTypes[0] ?? null);

  const visibleTypes = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return props.relationshipTypes
      .map(relationshipTypeInfo)
      .filter(info => !search
        || info.label.toLocaleLowerCase().includes(search)
        || info.group.toLocaleLowerCase().includes(search)
        || (search.length > 1 && info.description.toLocaleLowerCase().includes(search)));
  }, [props.relationshipTypes, query]);
  const highlighted = visibleTypes.find(info => info.type === selectedType) ?? visibleTypes[0] ?? null;
  const groupedTypes = groupOrder
    .map(group => ({ group, types: visibleTypes.filter(info => info.group === group) }))
    .filter(item => item.types.length > 0);

  useEffect(() => {
    setSelectedType(visibleTypes[0]?.type ?? null);
  }, [query, props.relationshipTypes]);

  useEffect(() => {
    props.onPreview(highlighted?.type ?? null);
  }, [highlighted?.type, props.onPreview]);

  useEffect(() => {
    const onDocumentPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !rootRef.current?.contains(target))
        props.onCancel();
    };
    document.addEventListener('pointerdown', onDocumentPointerDown);
    return () => document.removeEventListener('pointerdown', onDocumentPointerDown);
  }, [props.onCancel]);

  const setHighlight = (type: string) => setSelectedType(type);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (event.key === 'Escape') {
      props.onCancel();
      return;
    }
    if (event.key === 'Enter') {
      if (highlighted)
        props.onPick(highlighted.type);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')
      return;
    event.preventDefault();
    if (!visibleTypes.length)
      return;
    const currentIndex = highlighted ? visibleTypes.findIndex(info => info.type === highlighted.type) : -1;
    const step = event.key === 'ArrowDown' ? 1 : -1;
    setSelectedType(visibleTypes[(currentIndex + step + visibleTypes.length) % visibleTypes.length].type);
  };

  const onOptionMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => event.preventDefault();
  const left = Math.max(8, Math.min(props.x + 8, Math.max(8, window.innerWidth - 268)));
  const top = Math.max(8, Math.min(props.y + 8, Math.max(8, window.innerHeight - 328)));

  return <div
    ref={rootRef}
    className="relation-picker"
    role="dialog"
    aria-label="Relationship type"
    onKeyDown={onKeyDown}
    style={{ left, top }}>
    <div className="relation-picker-header">{props.sourceName} → {props.targetName}</div>
    <input
      autoFocus
      aria-label="Search relationships"
      placeholder="Search relationships"
      value={query}
      onChange={event => setQuery(event.currentTarget.value)} />
    <div className="relation-picker-list">
      {groupedTypes.map(({ group, types }) => <div key={group} role="group" aria-label={group}>
        <div className="relation-picker-group">{group}</div>
        {types.map(info => <div
          key={info.type}
          role="option"
          data-type={info.type}
          aria-selected={highlighted?.type === info.type}
          onMouseEnter={() => setHighlight(info.type)}
          onMouseDown={onOptionMouseDown}
          onClick={() => props.onPick(info.type)}>
          <RelationshipPreview info={info} />
          <span>{info.label}</span>
        </div>)}
      </div>)}
      {!visibleTypes.length && <div className="relation-picker-empty">No matching relationship</div>}
    </div>
    <div className="relation-picker-description">{highlighted?.description ?? ''}</div>
  </div>;
}

function RelationshipPreview({ info }: { info: RelationshipTypeInfo }) {
  const markerBase = `relation-picker-${info.type}`;
  const startMarkerId = info.previewStartMarker ? `${markerBase}-start` : undefined;
  const endMarkerId = info.previewEndMarker ? `${markerBase}-end` : undefined;
  return <svg width="44" height="14" viewBox="0 0 44 14" aria-hidden="true">
    <defs>
      {info.previewStartMarker && <RelationshipMarker id={startMarkerId} type={info.previewStartMarker} start />}
      {info.previewEndMarker && <RelationshipMarker id={endMarkerId} type={info.previewEndMarker} />}
    </defs>
    <path
      d="M 8 7 H 36"
      fill="none"
      stroke="currentColor"
      strokeDasharray={info.previewDashArray}
      markerStart={startMarkerId ? `url(#${startMarkerId})` : undefined}
      markerEnd={endMarkerId ? `url(#${endMarkerId})` : undefined} />
  </svg>;
}

function RelationshipMarker({ id, type, start = false }: { id: string; type: string; start?: boolean }) {
  const isDiamond = type === 'composition' || type === 'aggregation';
  const width = isDiamond ? 13 : type === 'circle' ? 8 : 10;
  const reference = isDiamond ? 0.4 : type === 'circle' ? 3 : 9.5;
  const filled = type === 'composition' || type === 'closed' || type === 'pointed';
  return <marker
    id={id}
    markerWidth={width}
    markerHeight="10"
    refX={start ? 0.4 : reference}
    refY="5"
    orient="auto"
    markerUnits="userSpaceOnUse">
    {isDiamond
      ? <path d="M 0.4 5 L 7 0.5 L 13 5 L 7 9.5 Z" fill={filled ? 'currentColor' : '#fff'} stroke="currentColor" />
      : type === 'circle'
        ? <circle cx="3" cy="5" r="2.5" fill="#fff" stroke="currentColor" />
        : <path
          d={type === 'open' ? 'M 0 1 L 9.5 5 L 0 9' : type === 'pointed' ? 'M 1 1 L 9.5 5 L 1 9 Z' : 'M 0 0 L 9.5 5 L 0 10 Z'}
          fill={filled ? 'currentColor' : 'none'}
          stroke="currentColor" />}
  </marker>;
}
