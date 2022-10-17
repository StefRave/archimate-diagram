import equal from 'fast-deep-equal';
import { ArchiDiagramChild, ArchiEntity } from './greeter';

export class ChangeFunctions {

  public static undoChange(change: IDiagramChange): IDiagramChange {
    return <IDiagramChange>{
      action: change.action,
      diagramId: change.diagramId,
      move: undoMove(change.move),
      connection: undoConnection(change.connection),
      edit: undoEdit(change.edit),
      addRemoveElement: undoAddRemoveElement(change.addRemoveElement),
    }

    function undoMove(change: IDiagramChangeMove): IDiagramChangeMove {
      if (!change)
        return null;
      return <IDiagramChangeMove>{
        elementId: change.elementId,
        parentIdNew: change.parentIdOld,
        parentIdOld: change.parentIdNew,
        positionNew: change.positionOld,
        positionOld: change.positionNew,
      }
    }
    function undoConnection(change: IDiagramChangeConnection): IDiagramChangeConnection {
      if (!change)
        return null;
      return <IDiagramChangeConnection>{
        sourceConnectionId: change.sourceConnectionId,
        index: change.index,
        bendPointsNew: change.bendPointsOld,
        bendPointsOld: change.bendPointsNew,
        targetOffset: change.targetOffset,
      }
    }

    function undoEdit(change: IDiagramChangeEdit): IDiagramChangeEdit {
      if (!change)
        return null;
      return <IDiagramChangeEdit>{
        elementId: change.elementId,
        textNew: change.textOld,
        textOld: change.textNew,
      }
    }

    function undoAddRemoveElement(change: IDiagramChangeAddRemoveElement): IDiagramChangeAddRemoveElement {
      if (!change)
        return null;
      return <IDiagramChangeAddRemoveElement>{
        entity: change.entity,
        element: change.element,
        adding: !change.adding,
      };
    }
  }

  public static isChanged(change: IDiagramChange): boolean {
    if (change.move)
      return isMoveChanged(change.move);
    if (change.connection)
      return isConnectionChanged(change.connection);
    if (change.edit)
      return isEditChanged(change.edit);
    if (change.addRemoveElement)
      return true;

    throw new Error("unknown change type");
    
    function isMoveChanged(c: IDiagramChangeMove): boolean {
      return c.parentIdNew != c.parentIdOld ||
        !equal(c.positionNew, c.positionOld);
    }
          
    function isConnectionChanged(c: IDiagramChangeConnection): boolean {
      return !equal(c.bendPointsNew, c.bendPointsOld);
    }
          
    function isEditChanged(c: IDiagramChangeEdit): boolean {
      return c.textNew != c.textOld;
    }
  }
}

export interface IDiagramChange {
  action: ChangeAction;
  diagramId: string;
  move: IDiagramChangeMove;
  connection: IDiagramChangeConnection;
  edit: IDiagramChangeEdit;
  addRemoveElement: IDiagramChangeAddRemoveElement;
}

export enum ChangeAction {
  Move = 1,
  Resize,
  Connection,
  Edit,
  AddRemoveElement,
}


export interface IDiagramChangeMove {
  elementId: string;
  positionNew: IPosSize;
  positionOld: IPosSize;
  parentIdNew: string;
  parentIdOld: string;
  dragCorner: string; 
}

export interface IPosSize {
  x: number,
  y: number,
  width: number,
  height: number,
}

export interface IDiagramChangeConnection {
  sourceConnectionId: string;
  index: number;
  bendPointsNew: IXy[];
  bendPointsOld: IXy[];
  targetOffset: IXy; // needed to set bendPoint endX and endY
}

export interface IXy {
  x: number,
  y: number,
}

export interface IDiagramChangeEdit {
  elementId: string;
  textNew: string;
  textOld: string;
}

export interface IDiagramChangeAddRemoveElement {
  entity: ArchiEntity;
  element: ArchiDiagramChild;
  adding: boolean;
}
