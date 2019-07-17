import React from "react";
import AlberiteTable from "./alberiteTable.js";
import AlberiteTableGPIO from "./alberiteTableGPIO.js";

class StatusBody extends React.Component {
  render() {
    return (
      <div className="alberiteTableContainer">
        <AlberiteTable
          rows={this.props.collections.logRows}
          headerProps={[
            { name: "Mensaje", prop: "message" },
            { name: "Fecha", prop: "messagedate" },
            { name: "IP", prop: "externalip" }
          ]}
          tableName="Mensajes de log"
        />
        <AlberiteTable
          rows={this.props.collections.pastActionRows}
          headerProps={[
            { name: "Fase", prop: "phase" },
            { name: "Duración", prop: "duration" },
            { name: "Fecha", prop: "date" }
          ]}
          tableName="Riegos pasados"
        />
        <AlberiteTable
          rows={this.props.collections.actionRows}
          headerProps={[
            { name: "Fase", prop: "phase" },
            { name: "Duración", prop: "time" }
          ]}
          tableName="Riegos en cola"
        />
        <AlberiteTableGPIO
          rows={this.props.collections.gpioState}
          headerProps={[
            { name: "Puerto", prop: "pin" },
            { name: "Estado", prop: "status" }
          ]}
          tableName="Estado puertos GPIO"
        />
      </div>
    );
  }
}

export default StatusBody;
