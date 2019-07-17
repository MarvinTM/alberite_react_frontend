import React from "react";
import AlberiteTable from "./alberiteTable.js";

class AlberiteEditingTable extends AlberiteTable {
  constructor(props) {
    super(props);
    this.state = this.generateInitialState(props);
  }
  generateInitialState(props) {
    const initialState = {};
    props.headerProps.forEach(headerProp => {
      if (headerProp.possibleValues) {
        initialState[headerProp.prop] = headerProp.possibleValues[0].value;
      }
    });
    return initialState;
  }
  setValueInState(value) {
    this.setState(value);
  }
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
  additionalRow() {
    const fields = this.props.headerProps.map(headerProp => {
      let field;
      if (headerProp.type === "combo") {
        const options = headerProp.possibleValues.map(possibleValue => {
          return (
            <option key={possibleValue.id} value={possibleValue.value}>
              {possibleValue.name}
            </option>
          );
        });
        field = (
          <select
            className="alberite_combo"
            value={this.state[headerProp.prop]}
            onChange={evt => {
              let value = {};
              value[headerProp.prop] = evt.target.value;
              this.setValueInState(value);
            }}
          >
            {options}
          </select>
        );
      } else if (headerProp.type === "hour") {
        field = (
          <AlberiteHour
            changeHappened={theValue => {
              let value = {};
              value[headerProp.prop] = theValue;
              this.setValueInState(value);
            }}
          />
        );
      } else {
        field = <input />;
      }
      return (
        <td className="alberiteTableEditableCell" key={headerProp.name}>
          {field}
        </td>
      );
    });
    fields.push(
      <td className="alberiteTableMainCell" key="okButton">
        <button
          onClick={() => {
            this.props.createActionHandler(this.state);
          }}
        >
          Ok
        </button>
      </td>
    );
    return (
      <tr className="table" key="editingRow">
        {fields}
      </tr>
    );
  }
}

class AlberiteHour extends React.Component {
  constructor() {
    super();
    this.state = {
      hour: 0,
      minute: 0,
      second: 0
    };
  }
  pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }
  generateHourFromState() {
    let hour = "'";
    hour += this.pad(this.state.hour, 2);
    hour += ":";
    hour += this.pad(this.state.minute, 2);
    hour += ":";
    hour += this.pad(this.state.second, 2);
    hour += "'";
    return hour;
  }
  setHour(value) {
    this.setState({ hour: value }, () =>
      this.props.changeHappened(this.generateHourFromState())
    );
  }
  setMinute(value) {
    this.setState({ minute: value }, () =>
      this.props.changeHappened(this.generateHourFromState())
    );
  }
  setSecond(value) {
    this.setState({ second: value }, () =>
      this.props.changeHappened(this.generateHourFromState())
    );
  }
  render() {
    return (
      <div className="alberite_hour_div">
        <input
          className="alberite_hour_inputs"
          onChange={evt => {
            this.setHour(evt.target.value);
          }}
        />
        :
        <input
          className="alberite_hour_inputs"
          onChange={evt => {
            this.setMinute(evt.target.value);
          }}
        />
        :
        <input
          className="alberite_hour_inputs"
          onChange={evt => {
            this.setSecond(evt.target.value);
          }}
        />
      </div>
    );
  }
}

export default AlberiteEditingTable;
