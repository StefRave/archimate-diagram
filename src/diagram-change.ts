
export function undoChange(change: IDiagramChange): IDiagramChange {
  return <IDiagramChange>{
    action: change.action,
    diagramId: change.diagramId,
    move: undoMove(change.move),
    connection: undoConnection(change.connection),
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
    }
  }
}
export interface IDiagramChange {
  action: ChangeAction;
  diagramId: string;
  move: IDiagramChangeMove;
  connection: IDiagramChangeConnection;
}

export enum ChangeAction {
  Move,
  Resize,
  Connection,
}


export interface IDiagramChangeMove {
  elementId: string;
  positionNew: IPosSize;
  positionOld: IPosSize;
  parentIdNew: string;
  parentIdOld: string;
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
}

export interface IXy {
  x: number,
  y: number,
}
