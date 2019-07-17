import React from "react";
import ReactDOM from "react-dom";
import MainLayout from "./components/mainLayout.js";
import "./alberite.css";
import "./alberiteFlexbox.css";
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
const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainLayout);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
