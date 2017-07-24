import React from "react";
import ReactDOM from "react-dom";
import "./pure-min.css";
import "./marketing.css";
import "./alberite.css";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { createStore } from "redux";
import { connect } from "react-redux";
import { Provider } from "react-redux";

//Create Redux Store
var alberiteReducer = function(state, action) {
  if (state === undefined) {
    state = {
      collections: {
        logRows: null,
        pastActionRows: null,
        actionRows: null,
        gpioState: null,
        programmedActionRows: null
      },
      currentTab: "status"
    };
  }
  if (action.type === "ADD_DATA_COLLECTION") {
    let newState = Object.assign({}, state);
    var property;
    newState.collections = {};
    for (property in state.collections) {
      if (state.collections.hasOwnProperty(property)) {
        newState[property] = state.collections[property];
      }
    }
    for (property in action.collection) {
      if (action.collection.hasOwnProperty(property)) {
        newState.collections[property] = action.collection[property];
      }
    }
    return newState;
  } else if (action.type === "SET_CURRENT_TAB") {
    let newState = Object.assign({}, state);
    newState.currentTab = action.currentTab;
    return newState;
  }
  return state;
};

var store = createStore(alberiteReducer);

class Header extends React.Component {
  render() {
    const tabs = [
      { id: "status", name: "Sistema" },
      { id: "riego", name: "Riego" }
    ];
    const menuItems = tabs.map(menuItem => {
      let theClassName = "pure-menu-item";
      theClassName +=
        menuItem.id === this.props.currentTab ? " pure-menu-selected" : "";
      return (
        <li className={theClassName} key={menuItem.id}>
          <a
            className="pure-menu-link alberite_cursor"
            onClick={() => {
              this.props.setMenuTab(menuItem.id);
            }}
          >
            {menuItem.name}
          </a>
        </li>
      );
    });
    menuItems.push(
      <li className="pure-menu-item" key="logout">
        <a href="/logout" className="pure-menu-link alberite_cursor">
          Salir
        </a>
      </li>
    );

    return (
      <div className="header">
        <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed menu_shadow">
          <a className="pure-menu-heading alberite_page_name" href="">
            Villa Cautela
          </a>
          <ul className="pure-menu-list">
            {menuItems}
          </ul>
        </div>
      </div>
    );
  }
}

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
  render() {
    let theRows;
    if (!this.generateTable()) {
      theRows = [];
    } else {
      if (!this.props.rows) {
        theRows = [
          <tr className="pure-table-odd" key="loadingRows">
            <td
              key="loadingRow"
              colSpan={this.props.headerProps.length + 1}
              className="alberite_single_line"
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
            : row.index ? row.index : row.pin ? row.pin : "xx";
          const values = this.props.headerProps.map(headerProp => {
            let value = theRow[headerProp.prop];
            if (headerProp.prop.toLowerCase().indexOf("date") !== -1) {
              const date = new Date(Date.parse(value));
              value =
                date.toLocaleDateString() +
                " " +
                pad(date.getHours(), 2) +
                ":" +
                pad(date.getMinutes(), 2) +
                ":" +
                pad(date.getSeconds(), 2);
            }
            let cellStyle = {};
            if (this.cellStyle) {
              cellStyle = this.cellStyle(headerProp.prop, value);
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
            <tr className="pure-table-odd alberite_fade" key={keyValue}>
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
        <tr className="pure-table-odd" key="loadingRows">
          <td
            key="emptyRow"
            colSpan={this.props.headerProps.length + 1}
            className="alberite_single_line"
          >
            Nada
          </td>
        </tr>
      ];
    }
    const theHeader = this.props.headerProps.map((headerProp, idx) => {
      return (
        <th key={headerProp.name}>
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
        <table className="pure-table pure-table-horizontal alberite_generic_table alberite_log_table">
          <thead>
            <tr key="header">
              <th
                colSpan={
                  this.props.headerProps.length +
                  (this.additionalColumnHeader() !== null ? 1 : 0)
                }
              >
                {this.props.tableName}
              </th>
            </tr>
            <tr key="headerProps">
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
class AlberiteHour extends React.Component {
  constructor() {
    super();
    this.state = {
      hour: 0,
      minute: 0,
      second: 0
    };
  }
  generateHourFromState() {
    let hour = "'";
    hour += pad(this.state.hour, 2);
    hour += ":";
    hour += pad(this.state.minute, 2);
    hour += ":";
    hour += pad(this.state.second, 2);
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
        />:<input
          className="alberite_hour_inputs"
          onChange={evt => {
            this.setMinute(evt.target.value);
          }}
        />:<input
          className="alberite_hour_inputs"
          onChange={evt => {
            this.setSecond(evt.target.value);
          }}
        />
      </div>
    );
  }
}

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
    return <td key="additionalColHeader" />;
  }
  additionalColumn(index) {
    return (
      <td key="deleteButton">
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
        <td key={headerProp.name}>
          {field}
        </td>
      );
    });
    fields.push(
      <td key="okButton">
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
      <tr className="pure-table-odd" key="editingRow">
        {fields}
      </tr>
    );
  }
}

class AlberiteEditingRow extends AlberiteEditingTable {
  generateTable() {
    return false;
  }
}

class AlberiteTableGPIO extends AlberiteTable {
  cellStyle(property, value) {
    if (property === "status") {
      if (value === "on") {
        return "alberite_gpio_on";
      } else if (value === "off") {
        return "alberite_gpio_off";
      } else {
        return null;
      }
    }
  }
}

class StatusBody extends React.Component {
  render() {
    return (
      <div className="splash-container alberite_splash_container">
        <div className="alberite_generic_dummy_div_first" />
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

class RiegoBody extends React.Component {
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
      <div className="splash-container alberite_splash_container">
        <div className="alberite_generic_dummy_div_first" />
        <AlberiteEditingTable
          rows={this.props.collections.programmedActionRows}
          headerProps={programFields}
          tableName="Riegos programados"
          createActionHandler={this.props.onProgrammedAction}
          deleteActionHandler={this.props.onDeleteProgrammedAction}
        />
        <AlberiteTable
          rows={this.props.collections.actionRows}
          headerProps={[
            { name: "Fase", prop: "phase" },
            { name: "Duración", prop: "time" }
          ]}
          tableName="Riegos en cola"
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

class MainLayout extends React.Component {
  componentDidMount() {
    this.loadData();
    setInterval(() => this.loadData(), 5000);
  }
  deleteProgrammedValue(index) {
    var me = this;
    this.remoteRequest(
      "http://villacautela.com/cancelProgrammedAction?programmedAction=" +
        index,
      function(data) {
        //TODO: MESSAGE!!!
        me.loadData();
      }
    );
  }
  modifyDirectValues(values) {
    var me = this;
    this.remoteRequest(
      "http://villacautela.com/startSystemAction?" + buildGETRequest(values),
      function(data) {
        //TODO: MESSAGE!!!
        me.loadData();
      }
    );
  }
  modifyProgrammedValues(values) {
    const me = this;
    this.remoteRequest(
      "http://villacautela.com/insertProgrammedAction?" +
        buildGETRequest(values),
      function(data) {
        //TODO: MESSAGE!!!
        me.loadData();
      }
    );
  }
  loadData() {
    this.readAllCollections([
      {
        url: "http://villacautela.com/loginfo",
        collectionName: "logRows"
      },
      {
        url: "http://villacautela.com/pastActionsInfo",
        collectionName: "pastActionRows"
      },
      {
        url: "http://villacautela.com/actionsInfo",
        collectionName: "actionRows"
      },
      {
        url: "http://villacautela.com/gpioInfo",
        collectionName: "gpioState"
      },
      {
        url: "http://villacautela.com/programmedActionsInfo",
        collectionName: "programmedActionRows"
      }
    ]);
  }
  setMenuTab(tab) {
    this.props.setCurrentTab(tab);
  }
  readAllCollections(collectionList, successCallback, errorCallback) {
    this.readEachCollection(collectionList, {}, successCallback, errorCallback);
  }
  readEachCollection(
    collectionList,
    fullCollectionObj,
    successCallback,
    errorCallback
  ) {
    const me = this;
    if (collectionList.length === 0) {
      this.props.setCollectionValue(fullCollectionObj);
      if (successCallback) {
        successCallback();
      }
      return;
    }
    this.remoteRequest(
      collectionList[0].url,
      function(data) {
        fullCollectionObj[collectionList[0].collectionName] = data;
        collectionList.shift();
        me.readEachCollection(
          collectionList,
          fullCollectionObj,
          successCallback,
          errorCallback
        );
      },
      errorCallback
    );
  }
  remoteRequestForDataCollection(
    url,
    collectionName,
    successCallback,
    errorCallback
  ) {
    var me = this;
    this.remoteRequest(
      url,
      function(data) {
        var emptyObj = {};
        emptyObj[collectionName] = data;
        me.props.setCollectionValue(emptyObj);
        if (successCallback) {
          successCallback(data);
        }
      },
      errorCallback
    );
  }
  remoteRequest(url, successCallback, errorCallback, credentials = true) {
    const me = this;
    fetch(url, {
      mode: "cors",
      method: "get",
      credentials: credentials ? "include" : null
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        successCallback(data);
      })
      .catch(function(err) {
        if (credentials) {
          console.warn("Failed with credentials. Retrying without...");
          me.remoteRequest(url, successCallback, errorCallback, false);
        } else if (errorCallback) {
          console.error("error while executing remote request: " + url, err);
          errorCallback();
        }
      });
  }
  render() {
    if (this.props.currentTab === "status") {
      return (
        <div>
          <Header
            setMenuTab={tab => this.setMenuTab(tab)}
            currentTab={this.props.currentTab}
          />
          <StatusBody collections={this.props.collections} />
        </div>
      );
    } else if (this.props.currentTab === "riego") {
      return (
        <div>
          <Header
            setMenuTab={tab => this.setMenuTab(tab)}
            currentTab={this.props.currentTab}
          />
          <RiegoBody
            collections={this.props.collections}
            onProgrammedAction={i => this.modifyProgrammedValues(i)}
            onDirectAction={i => this.modifyDirectValues(i)}
            onDeleteProgrammedAction={i => this.deleteProgrammedValue(i)}
          />
        </div>
      );
    }
  }
}
var mapStateToProps = function(store) {
  return { collections: store.collections, currentTab: store.currentTab };
};

const mapDispatchToProps = dispatch => {
  return {
    setCollectionValue: collection =>
      dispatch({
        type: "ADD_DATA_COLLECTION",
        collection: collection
      }),
    setCurrentTab: currentTab =>
      dispatch({
        type: "SET_CURRENT_TAB",
        currentTab: currentTab
      })
  };
};
const App = connect(mapStateToProps, mapDispatchToProps)(MainLayout);

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function buildGETRequest(values) {
  let GETRequest = "";
  let isFirst = true;
  for (var property in values) {
    if (values.hasOwnProperty(property)) {
      if (isFirst) {
        isFirst = false;
      } else {
        GETRequest += "&&";
      }
      GETRequest += property + "=" + values[property];
    }
  }
  return GETRequest;
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
