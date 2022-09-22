export interface IDiagramChange {
  diagramId: string;
  move: IDiagramChangeMove;
  connection: IDiagramChangeConnection;
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
