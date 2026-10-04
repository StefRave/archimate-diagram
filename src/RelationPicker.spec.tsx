import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { RelationPicker } from './RelationPicker';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const allowedTypes = [
  'AssignmentRelationship',
  'ServingRelationship',
  'AssociationRelationship',
  'TriggeringRelationship',
  'FlowRelationship',
];

describe('relationship picker', () => {
  let container: HTMLDivElement;
  let root: Root;
  let onPreview: jest.Mock;
  let onPick: jest.Mock;
  let onCancel: jest.Mock;

  const renderPicker = (relationshipTypes = allowedTypes) => {
    act(() => {
      root.render(<RelationPicker
        sourceName="Customer"
        targetName="Handle Claim"
        relationshipTypes={relationshipTypes}
        x={300}
        y={400}
        onPreview={onPreview}
        onPick={onPick}
        onCancel={onCancel} />);
    });
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    onPreview = jest.fn();
    onPick = jest.fn();
    onCancel = jest.fn();
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  function typeSearch(value: string) {
    const input = container.querySelector('input') as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    act(() => {
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  function pressKey(key: string) {
    const input = container.querySelector('input');
    act(() => input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true })));
  }

  it('groups the Customer to Handle Claim types under Structural, Dependency, and Dynamic', () => {
    renderPicker();
    const groups = Array.from(container.querySelectorAll('[role="group"]'));
    expect(groups.map(group => group.getAttribute('aria-label'))).toEqual(['Structural', 'Dependency', 'Dynamic']);
    expect(Array.from(container.querySelectorAll('[role="option"]')).map(option => option.getAttribute('data-type')))
      .toEqual(allowedTypes);
    expect(container.querySelector('[role="option"]').getAttribute('aria-selected')).toBe('true');
    expect(onPreview).toHaveBeenLastCalledWith('AssignmentRelationship');
    expect(container.querySelector('.relation-picker-description').textContent)
      .toBe('The source is responsible for, performs, or carries out the target.');
    expect(container.querySelector('.relation-picker-header').textContent).toBe('Customer → Handle Claim');
    const servingPreview = container.querySelector('[data-type="ServingRelationship"] svg>path');
    expect(servingPreview.getAttribute('marker-end')).toContain('ServingRelationship-end');
  });

  it('filters by search text and hides empty groups', () => {
    renderPicker();
    typeSearch('f');
    expect(Array.from(container.querySelectorAll('[role="option"]')).map(option => option.getAttribute('data-type')))
      .toEqual(['FlowRelationship']);

    typeSearch('responsible');
    expect(Array.from(container.querySelectorAll('[role="option"]')).map(option => option.getAttribute('data-type')))
      .toEqual(['AssignmentRelationship']);

    typeSearch('serv');
    expect(Array.from(container.querySelectorAll('[role="option"]')).map(option => option.getAttribute('data-type')))
      .toEqual(['ServingRelationship']);
    expect(Array.from(container.querySelectorAll('[role="group"]')).map(group => group.getAttribute('aria-label')))
      .toEqual(['Dependency']);

    typeSearch('zzz');
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(0);
    expect(container.textContent).toContain('No matching relationship');
    pressKey('Enter');
    expect(onPick).not.toHaveBeenCalled();
  });

  it('arrow keys move the highlight and Enter picks it', () => {
    renderPicker();
    pressKey('ArrowDown');
    expect(container.querySelector('[data-type="ServingRelationship"]').getAttribute('aria-selected')).toBe('true');
    expect(onPreview).toHaveBeenLastCalledWith('ServingRelationship');

    pressKey('ArrowUp');
    pressKey('ArrowUp');
    expect(container.querySelector('[data-type="FlowRelationship"]').getAttribute('aria-selected')).toBe('true');
    pressKey('Enter');
    expect(onPick).toHaveBeenCalledWith('FlowRelationship');
  });

  it('Escape cancels and the key does not reach the document', () => {
    const documentKeydown = jest.fn();
    document.addEventListener('keydown', documentKeydown);
    try {
      renderPicker();
      pressKey('Escape');
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(documentKeydown).not.toHaveBeenCalled();
    } finally {
      document.removeEventListener('keydown', documentKeydown);
    }
  });

  it('clicking an option picks it and a pointerdown outside cancels', () => {
    renderPicker();
    act(() => {
      (container.querySelector('[data-type="ServingRelationship"]') as HTMLElement).click();
    });
    expect(onPick).toHaveBeenCalledWith('ServingRelationship');

    act(() => {
      document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
