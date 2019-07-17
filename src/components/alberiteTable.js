import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

class AlberiteTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { transitionEnabled: false };
    setTimeout(() => this.setState({ transitionEnabled: true }), 5000);
  }
  generateTable() {
    return true;
  }
  additionalRow() {
    return null;
  }
  additionalColumn() {
    return null;
  }
  additionalColumnHeader() {
    return null;
  }
  pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }
  render() {
    let theRows;
    if (!this.generateTable()) {
      theRows = [];
    } else {
      if (!this.props.rows) {
        theRows = [
          <tr key="loadingRows">
            <td
              className="alberiteTableMainCell"
              key="loadingRow"
              colSpan={this.props.headerProps.length + 1}
            >
              Cargando información...
            </td>
          </tr>
        ];
      } else {
        theRows = this.props.rows.map((row, idx) => {
          const theRow = row;
          const keyValue = row.id
            ? row.id
            : row.index
            ? row.index
            : row.pin
            ? row.pin
            : "xx";
          const values = this.props.headerProps.map(headerProp => {
            let value = theRow[headerProp.prop];
            if (headerProp.prop.toLowerCase().indexOf("date") !== -1) {
              const date = new Date(Date.parse(value));
              value =
                date.toLocaleDateString() +
                " " +
                this.pad(date.getHours(), 2) +
                ":" +
                this.pad(date.getMinutes(), 2) +
                ":" +
                this.pad(date.getSeconds(), 2);
            }
            let cellStyle = "alberiteTableMainCell ";
            if (this.cellStyle) {
              cellStyle =
                this.cellStyle(headerProp.prop, value) + " " + cellStyle;
            }
            return (
              <td
                key={(row.id ? row.id : row.index) + headerProp.prop}
                className={cellStyle}
              >
                {value}
              </td>
            );
          });
          const additionalColumn = this.additionalColumn(keyValue);
          if (additionalColumn !== null) {
            values.push(additionalColumn);
          }
          return (
            <tr className="alberiteTableRow alberite_fade" key={keyValue}>
              {values}
            </tr>
          );
        });
      }
    }
    const additionalRow = this.additionalRow();
    if (additionalRow !== null) {
      theRows.push(additionalRow);
    } else if (theRows.length === 0) {
      theRows = [
        <tr className="table" key="loadingRows">
          <td
            className="alberiteTableMainCell"
            key="emptyRow"
            colSpan={this.props.headerProps.length + 1}
          >
            Nada
          </td>
        </tr>
      ];
    }
    const theHeader = this.props.headerProps.map((headerProp, idx) => {
      return (
        <th className="alberiteTableHeaderCell" key={headerProp.name}>
          {headerProp.name}
        </th>
      );
    });
    const additionalColumnHeader = this.additionalColumnHeader();
    if (additionalColumnHeader !== null) {
      theHeader.push(additionalColumnHeader);
    }
    return (
      <div>
        <table className="alberiteTable">
          <thead>
            <tr key="header">
              <th
                className="alberiteTableHeaderCell"
                colSpan={
                  this.props.headerProps.length +
                  (this.additionalColumnHeader() !== null ? 1 : 0)
                }
              >
                {this.props.tableName}
              </th>
            </tr>
            <tr className="alberiteTableHeaderCell" key="headerProps">
              {theHeader}
            </tr>
          </thead>
          <ReactCSSTransitionGroup
            component="tbody"
            transitionName="anim"
            transitionAppear={false}
            transitionEnterTimeout={2000}
            transitionEnter={this.state.transitionEnabled}
            transitionLeave={false}
          >
            {theRows}
          </ReactCSSTransitionGroup>
        </table>
      </div>
    );
  }
}

export default AlberiteTable;
