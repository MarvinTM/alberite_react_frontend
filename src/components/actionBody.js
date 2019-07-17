import React from "react";
import AlberiteTableActions from "./alberiteTableActions.js";
import AlberiteEditingRow from "./alberiteEditingRow.js";
import AlberiteEditingTable from "./alberiteEditingTable.js";

class ActionBody extends React.Component {
  render() {
    const programFields = [
      {
        name: "Fase",
        prop: "phase",
        type: "combo",
        possibleValues: [
          { id: 1, name: "Piscina fase 1", value: 1 },
          { id: 2, name: "Piscina fase 2", value: 2 },
          { id: 3, name: "Aspersores fase 1", value: 3 },
          { id: 4, name: "Entrada+Cerezo", value: 4 },
          { id: 5, name: "Huerta", value: 5 }
        ]
      },
      {
        name: "Duración",
        prop: "time",
        type: "combo",
        possibleValues: [
          { id: 1, name: "Pulso (10 secs)", value: 10 },
          { id: 2, name: "30 segundos", value: 30 },
          { id: 3, name: "1 minuto", value: 60 },
          { id: 4, name: "2 minutos", value: 120 },
          { id: 5, name: "3 minutos", value: 180 },
          { id: 6, name: "4 minutos", value: 240 },
          { id: 7, name: "5 minutos", value: 300 },
          { id: 8, name: "10 minutos", value: 600 },
          { id: 9, name: "15 minutos", value: 900 },
          { id: 10, name: "20 minutos", value: 1200 }
        ]
      },
      {
        name: "Frecuencia",
        prop: "frequency",
        type: "combo",
        possibleValues: [
          { id: 1, name: "DIARIA", value: "DIARIA" },
          { id: 2, name: "DÍAS IMPARES", value: "DÍAS IMPARES" },
          { id: 3, name: "DÍAS PARES", value: "DÍAS PARES" }
        ]
      },
      { name: "Hora", prop: "hour", type: "hour" }
    ];
    const directFields = [
      {
        name: "Fase",
        prop: "pin",
        type: "combo",
        possibleValues: [
          { id: 1, name: "Piscina fase 1", value: 1 },
          { id: 2, name: "Piscina fase 2", value: 2 },
          { id: 3, name: "Aspersores fase 1", value: 3 },
          { id: 4, name: "Entrada+Cerezo", value: 4 },
          { id: 5, name: "Huerta", value: 5 }
        ]
      },
      {
        name: "Duración",
        prop: "duration",
        type: "combo",
        possibleValues: [
          { id: 1, name: "Pulso (10 secs)", value: 10 },
          { id: 2, name: "30 segundos", value: 30 },
          { id: 3, name: "1 minuto", value: 60 },
          { id: 4, name: "2 minutos", value: 120 },
          { id: 5, name: "3 minutos", value: 180 },
          { id: 6, name: "4 minutos", value: 240 },
          { id: 7, name: "5 minutos", value: 300 },
          { id: 8, name: "10 minutos", value: 600 },
          { id: 9, name: "15 minutos", value: 900 },
          { id: 10, name: "20 minutos", value: 1200 }
        ]
      }
    ];
    return (
      <div className="alberiteTableContainer">
        <AlberiteEditingTable
          rows={this.props.collections.programmedActionRows}
          headerProps={programFields}
          tableName="Riegos programados"
          createActionHandler={this.props.onProgrammedAction}
          deleteActionHandler={this.props.onDeleteProgrammedAction}
        />
        <AlberiteTableActions
          rows={this.props.collections.actionRows}
          headerProps={[
            { name: "Fase", prop: "phase" },
            { name: "Duración", prop: "time" }
          ]}
          tableName="Riegos en cola"
          deleteActionHandler={this.props.onDeleteAction}
        />
        <AlberiteEditingRow
          headerProps={directFields}
          tableName="Riego directo"
          createActionHandler={this.props.onDirectAction}
        />
      </div>
    );
  }
}

export default ActionBody;
