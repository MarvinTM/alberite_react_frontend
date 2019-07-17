import React from "react";
import AlberiteTable from "./alberiteTable.js";

class AlberiteTableActions extends AlberiteTable {
  additionalColumnHeader() {
    return (
      <td className="alberiteTableEditableCell" key="additionalColHeader" />
    );
  }
  additionalColumn(index) {
    return (
      <td className="alberiteTableEditableCell" key="deleteButton">
        <button
          onClick={() => {
            this.props.deleteActionHandler(index);
          }}
        >
          Borrar
        </button>
      </td>
    );
  }
}

export default AlberiteTableActions;
